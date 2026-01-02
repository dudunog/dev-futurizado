import { createClient } from "@/lib/supabase/client";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  "image/webp",
];

export type UploadResult = {
  url: string;
  path: string;
};

/**
 * Uploads an image to Supabase Storage
 * @param file - The image file to upload
 * @returns Public URL of the uploaded image
 * @throws Error if upload fails or validation fails
 */
export async function uploadBannerImage(file: File): Promise<UploadResult> {
  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    throw new Error(
      "Tipo de arquivo inválido. Por favor, envie uma imagem JPEG, PNG, GIF ou WebP."
    );
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error(
      "O tamanho do arquivo excede o limite de 5MB. Por favor, escolha uma imagem menor."
    );
  }

  try {
    const supabase = createClient();

    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random()
      .toString(36)
      .substring(7)}.${fileExt}`;
    const filePath = fileName;

    const { data, error } = await supabase.storage
      .from("banners")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type,
      });

    if (error) {
      throw new Error(`Falha ao fazer upload da imagem: ${error.message}`);
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("banners").getPublicUrl(data.path);

    return {
      url: publicUrl,
      path: data.path,
    };
  } catch (err) {
    if (err instanceof Error) {
      throw err;
    }
    throw new Error(`Falha ao fazer upload da imagem: ${String(err)}`);
  }
}
