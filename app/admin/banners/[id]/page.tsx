import { Metadata } from "next";
import { notFound } from "next/navigation";

import { BannerForm } from "@/components/admin/banners/banner-form";

import { prisma } from "@/lib/prisma";

type Props = {
  params: Promise<{ id: string }>;
};

async function getBanner(id: string) {
  try {
    const banner = await prisma.banner.findUnique({
      where: { id },
    });
    return banner;
  } catch (_) {
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const banner = await getBanner(id);

  if (!banner) {
    return {
      title: "Banner Não Encontrado | Admin",
    };
  }

  return {
    title: `Atualizar Banner | Admin`,
    description: `Atualizar banner para ${banner.targetUrl}`,
  };
}

export default async function EditBannerPage({ params }: Props) {
  const { id } = await params;
  const banner = await getBanner(id);

  if (!banner) {
    notFound();
  }

  return (
    <div className="container mx-auto py-6 px-4 max-w-7xl">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Atualizar Banner
          </h1>
          <p className="text-muted-foreground mt-2">
            Atualize as configurações do banner
          </p>
        </div>

        <div className="rounded-lg border bg-card shadow-sm p-6">
          <BannerForm
            mode="edit"
            bannerId={id}
            initialData={{
              ...banner,
              imageAlt: banner.imageAlt ?? undefined,
              startDate: banner.startDate
                ? banner.startDate.toISOString().split("T")[0]
                : undefined,
              endDate: banner.endDate
                ? banner.endDate.toISOString().split("T")[0]
                : undefined,
              startTime: banner.startTime ?? undefined,
              endTime: banner.endTime ?? undefined,
              clickUrl: banner.clickUrl ?? undefined,
              displayDuration: banner.displayDuration ?? undefined,
              animationType:
                (banner.animationType as "fade" | "slide" | "bounce" | null) ??
                undefined,
            }}
          />
        </div>
      </div>
    </div>
  );
}
