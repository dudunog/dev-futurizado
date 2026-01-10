"use client";

import type { Banner } from "@/app/generated/prisma/client";

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

import { Button } from "@/components/ui/button";
import { BannerCard } from "./banner-card";

import { GripVertical } from "lucide-react";

type BannerListProps = {
  banners: Banner[];
  onReorder: (banners: { id: string; priority: number }[]) => Promise<void>;
  onDelete?: (id: string) => void;
};

function SortableBannerItem({
  banner,
  onDelete,
}: {
  banner: Banner;
  onDelete?: (id: string) => void;
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
          attributes={attributes}
          listeners={listeners}
        />
      </div>
    </div>
  );
}

export function BannerList({ banners, onReorder, onDelete }: BannerListProps) {
  const [items, setItems] = useState<Banner[]>(banners);
  const [isReordering, setIsReordering] = useState(false);

  useEffect(() => {
    setItems(banners);
  }, [banners]);

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

      const newItems = arrayMove(items, oldIndex, newIndex);

      const bannersWithPriority = newItems.map((banner, index) => ({
        id: banner.id,
        priority: newItems.length - index,
      }));

      setItems(newItems);
      setIsReordering(true);

      try {
        await onReorder(bannersWithPriority);
      } catch (error) {
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
          {items.map((banner) => (
            <SortableBannerItem
              key={banner.id}
              banner={banner}
              onDelete={onDelete}
            />
          ))}
        </div>
      </SortableContext>
      {isReordering && (
        <div className="fixed inset-0 bg-background/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="text-sm text-muted-foreground">Salvando ordem...</div>
        </div>
      )}
    </DndContext>
  );
}
