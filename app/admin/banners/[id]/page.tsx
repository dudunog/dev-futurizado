import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { BannerForm } from "@/components/admin/banners/banner-form";
import { BannerAbSettings } from "@/components/admin/banners/banner-ab-settings";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ id: string }>;
};

async function getBanner(id: string) {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      (process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "http://localhost:3000");

    const response = await fetch(`${baseUrl}/api/banners/${id}/get`, {
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`Failed to fetch banner: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching banner:", error);
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="rounded-lg border bg-card shadow-sm p-6">
              <BannerForm
                mode="edit"
                bannerId={id}
                initialData={{
                  ...banner,
                  imageAlt: banner.imageAlt ?? undefined,
                  startDate: banner.startDate
                    ? typeof banner.startDate === "string"
                      ? banner.startDate.split("T")[0]
                      : new Date(banner.startDate).toISOString().split("T")[0]
                    : undefined,
                  endDate: banner.endDate
                    ? typeof banner.endDate === "string"
                      ? banner.endDate.split("T")[0]
                      : new Date(banner.endDate).toISOString().split("T")[0]
                    : undefined,
                  startTime: banner.startTime ?? undefined,
                  endTime: banner.endTime ?? undefined,
                  clickUrl: banner.clickUrl ?? undefined,
                  displayDuration: banner.displayDuration ?? undefined,
                  animationType:
                    (banner.animationType as
                      | "fade"
                      | "slide"
                      | "bounce"
                      | null) ?? undefined,
                }}
              />
            </div>
          </div>
          <div>
            <BannerAbSettings
              bannerId={id}
              initialVariant={banner.abTestVariant}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
