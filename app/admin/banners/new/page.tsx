import { Metadata } from "next";

import { BannerForm } from "@/components/admin/banners/banner-form";

export const metadata: Metadata = {
  title: "Criar Banner | Admin",
  description: "Criar um novo banner",
};

export default function CreateBannerPage() {
  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Criar Banner</h1>
          <p className="text-muted-foreground mt-2">
            Crie um novo banner para exibir em seu site
          </p>
        </div>

        <div className="rounded-lg border bg-card shadow-sm p-6">
          <BannerForm mode="create" />
        </div>
      </div>
    </div>
  );
}
