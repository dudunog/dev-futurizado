"use client";

import type { Banner } from "@/lib/types/banner";

import { useState, useEffect } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { BannerCard } from "./banner-card";

import { Loader2 } from "lucide-react";

type Props = {
  banners: Banner[];
  onReorder: (banners: { id: string; priority: number }[]) => Promise<void>;
  onDelete?: (id: string) => void;
};

function SortableBannerItem({
  banner,
  onDelete,
  onToggleActive,
}: {
  banner: Banner;
  onDelete?: (id: string) => void;
  onToggleActive?: (id: string, isActive: boolean) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: banner.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative flex items-start gap-4 group"
    >
      <div className="flex-1 min-w-0">
        <BannerCard
          banner={banner}
          onDelete={onDelete}
          onToggleActive={onToggleActive}
          attributes={attributes}
          listeners={listeners}
        />
      </div>
    </div>
  );
}

export function BannerList({ banners, onReorder, onDelete }: Props) {
  const [items, setItems] = useState<Banner[]>(banners);
  const [isReordering, setIsReordering] = useState(false);

  const handleToggleActive = (id: string, isActive: boolean) => {
    setItems((prev) =>
      prev.map((banner) =>
        banner.id === id ? { ...banner, isActive } : banner
      )
    );
  };

  useEffect(() => {
    if (!isReordering) {
      setItems(banners);
    }
  }, [banners, isReordering]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);

      const reorderedItems = arrayMove(items, oldIndex, newIndex);

      const itemsWithNewPriority = reorderedItems.map((banner, index) => ({
        ...banner,
        priority: reorderedItems.length - index,
      }));

      const bannersWithPriority = itemsWithNewPriority.map((banner) => ({
        id: banner.id,
        priority: banner.priority,
      }));

      setItems(itemsWithNewPriority);
      setIsReordering(true);

      try {
        await onReorder(bannersWithPriority);
      } catch {
        setItems(banners);
      } finally {
        setIsReordering(false);
      }
    }
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>Nenhum banner encontrado.</p>
        <p className="text-sm mt-2">Crie seu primeiro banner para começar.</p>
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={items.map((banner) => banner.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-4">
          {isReordering && (
            <div className="flex items-center justify-end gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Salvando...</span>
            </div>
          )}
          {items.map((banner) => (
            <SortableBannerItem
              key={banner.id}
              banner={banner}
              onDelete={onDelete}
              onToggleActive={handleToggleActive}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
