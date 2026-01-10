import Link from "next/link";

import { Button } from "@/components/ui/button";

import { Plus } from "lucide-react";

export function CreateBannerButton() {
  return (
    <Button
      asChild
      size="lg"
      className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-shadow"
    >
      <Link href="/admin/banners/novo">
        <Plus className="h-6 w-6" />
        <span className="sr-only">Criar Banner</span>
      </Link>
    </Button>
  );
}
