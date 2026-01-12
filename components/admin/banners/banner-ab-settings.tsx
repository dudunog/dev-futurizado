"use client";

import type { AbTestGroup, AbTestVariant } from "@/lib/types/ab-test";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Loader2, Plus, X } from "lucide-react";

type BannerAbSettingsProps = {
  bannerId: string;
  initialVariant?: (AbTestVariant & { testGroup: AbTestGroup }) | null;
};

export function BannerAbSettings({
  bannerId,
  initialVariant,
}: BannerAbSettingsProps) {
  const [testGroups, setTestGroups] = useState<AbTestGroup[]>([]);
  const [selectedGroupId, setSelectedGroupId] = useState<string>(
    initialVariant?.testGroupId || ""
  );
  const [variant, setVariant] = useState<string>(initialVariant?.variant || "");
  const [trafficSplit, setTrafficSplit] = useState<number>(
    initialVariant?.trafficSplit || 50
  );
  const [isControl, setIsControl] = useState<boolean>(
    initialVariant?.isControl || false
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingGroups, setIsLoadingGroups] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showNewGroupForm, setShowNewGroupForm] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupDescription, setNewGroupDescription] = useState("");

  useEffect(() => {
    loadTestGroups();
  }, []);

  const loadTestGroups = async () => {
    try {
      setIsLoadingGroups(true);
      const response = await fetch("/api/ab-test-groups?active=true");
      if (!response.ok) throw new Error("Falha ao carregar grupos");
      const data = await response.json();
      setTestGroups(data.groups || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setIsLoadingGroups(false);
    }
  };

  const handleCreateGroup = async () => {
    if (!newGroupName.trim()) {
      setError("Nome do grupo é obrigatório");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch("/api/ab-test-groups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newGroupName,
          description: newGroupDescription || undefined,
          isActive: true,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Falha ao criar grupo");
      }

      const newGroup = await response.json();
      setTestGroups([...testGroups, newGroup]);
      setSelectedGroupId(newGroup.id);
      setShowNewGroupForm(false);
      setNewGroupName("");
      setNewGroupDescription("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveVariant = async () => {
    if (!selectedGroupId) {
      setError("Selecione um grupo de teste");
      return;
    }
    if (!variant.trim()) {
      setError("Nome da variante é obrigatório");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      if (initialVariant) {
        const response = await fetch(
          `/api/ab-test-variants/${initialVariant.id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              variant,
              trafficSplit,
              isControl,
            }),
          }
        );

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || "Falha ao atualizar variante");
        }
      } else {
        const response = await fetch("/api/ab-test-variants", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            bannerId,
            testGroupId: selectedGroupId,
            variant,
            trafficSplit,
            isControl,
          }),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || "Falha ao criar variante");
        }
      }

      window.location.reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveVariant = async () => {
    if (!initialVariant) return;

    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(
        `/api/ab-test-variants/${initialVariant.id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Falha ao remover variante");
      }

      window.location.reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Teste A/B</CardTitle>
        <CardDescription>
          Configure este banner como parte de um teste A/B
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <div className="rounded-lg border border-destructive bg-destructive/10 p-3">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        {isLoadingGroups ? (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="h-4 w-4 animate-spin" />
          </div>
        ) : (
          <>
            <div className="space-y-2">
              <Label>Grupo de Teste</Label>
              <div className="flex gap-2">
                <Select
                  value={selectedGroupId}
                  onValueChange={setSelectedGroupId}
                  disabled={!!initialVariant}
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Selecione um grupo" />
                  </SelectTrigger>
                  <SelectContent>
                    {testGroups.map((group) => (
                      <SelectItem key={group.id} value={group.id}>
                        {group.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {!initialVariant && (
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => setShowNewGroupForm(!showNewGroupForm)}
                  >
                    {showNewGroupForm ? (
                      <X className="h-4 w-4" />
                    ) : (
                      <Plus className="h-4 w-4" />
                    )}
                  </Button>
                )}
              </div>
            </div>

            {showNewGroupForm && (
              <div className="rounded-lg border p-4 space-y-3">
                <div className="space-y-2">
                  <Label>Nome do Grupo</Label>
                  <Input
                    value={newGroupName}
                    onChange={(e) => setNewGroupName(e.target.value)}
                    placeholder="Ex: Promoção Verão 2026"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Descrição (opcional)</Label>
                  <Input
                    value={newGroupDescription}
                    onChange={(e) => setNewGroupDescription(e.target.value)}
                    placeholder="Descrição do teste"
                  />
                </div>
                <Button
                  type="button"
                  onClick={handleCreateGroup}
                  disabled={isLoading}
                  size="sm"
                >
                  {isLoading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Criar Grupo
                </Button>
              </div>
            )}

            {selectedGroupId && (
              <>
                <div className="space-y-2">
                  <Label>Nome da Variante</Label>
                  <Input
                    value={variant}
                    onChange={(e) => setVariant(e.target.value)}
                    placeholder="Ex: A, B, C"
                    disabled={!!initialVariant}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Distribuição de Tráfego (%)</Label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={trafficSplit}
                    onChange={(e) =>
                      setTrafficSplit(parseInt(e.target.value) || 0)
                    }
                  />
                  <p className="text-xs text-muted-foreground">
                    Porcentagem de tráfego que verá esta variante (0-100)
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isControl"
                    checked={isControl}
                    onChange={(e) => setIsControl(e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="isControl" className="cursor-pointer">
                    Esta é a variante de controle
                  </Label>
                </div>

                <div className="flex gap-2 pt-2">
                  {initialVariant ? (
                    <>
                      <Button
                        type="button"
                        onClick={handleSaveVariant}
                        disabled={isLoading}
                      >
                        {isLoading && (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Atualizar Variante
                      </Button>
                      <Button
                        type="button"
                        variant="destructive"
                        onClick={handleRemoveVariant}
                        disabled={isLoading}
                      >
                        {isLoading && (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Remover do Teste A/B
                      </Button>
                    </>
                  ) : (
                    <Button
                      type="button"
                      onClick={handleSaveVariant}
                      disabled={
                        isLoading || !selectedGroupId || !variant.trim()
                      }
                    >
                      {isLoading && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Associar ao Teste A/B
                    </Button>
                  )}
                </div>
              </>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
