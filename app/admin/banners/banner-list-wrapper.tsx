"use client";

import type { Banner } from "@/app/generated/prisma/client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { BannerList } from "@/components/admin/banners/banner-list";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type BannerListWrapperProps = {
  initialBanners: Banner[];
};

export function BannerListWrapper({ initialBanners }: BannerListWrapperProps) {
  const router = useRouter();
  const [banners, setBanners] = useState(initialBanners);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [bannerToDelete, setBannerToDelete] = useState<string | null>(null);

  const handleReorder = async (
    bannersWithPriority: { id: string; priority: number }[]
  ) => {
    try {
      const response = await fetch("/api/banners/reorder", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ banners: bannersWithPriority }),
      });

      if (!response.ok) {
        throw new Error("Falha ao atualizar prioridades");
      }

      setBanners((prev) => {
        const priorityMap = new Map(
          bannersWithPriority.map((b) => [b.id, b.priority])
        );
        return prev
          .map((banner) => ({
            ...banner,
            priority: priorityMap.get(banner.id) ?? banner.priority,
          }))
          .sort((a, b) => b.priority - a.priority);
      });

      router.refresh();
    } catch (error) {
      throw error;
    }
  };

  const handleDeleteClick = (id: string) => {
    setBannerToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!bannerToDelete) return;

    try {
      const response = await fetch(`/api/banners/${bannerToDelete}/delete`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Falha ao excluir banner");
      }

      setBanners((prev) => prev.filter((b) => b.id !== bannerToDelete));
      setDeleteDialogOpen(false);
      setBannerToDelete(null);
      router.refresh();
    } catch (_) {
      alert("Erro ao excluir banner. Tente novamente.");
    }
  };

  return (
    <>
      <BannerList
        banners={banners}
        onReorder={handleReorder}
        onDelete={handleDeleteClick}
      />
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir este banner? Esta ação não pode ser
              desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
