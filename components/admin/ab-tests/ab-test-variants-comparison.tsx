import { VariantStat } from "@/lib/types/ab-test";
import { AbTestVariantCard } from "./ab-test-variant-card";

type Props = {
  stats: VariantStat[];
};

export function AbTestVariantsComparison({ stats }: Props) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Comparação de Variantes</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {stats.map((variant) => (
          <AbTestVariantCard key={variant.bannerId} variant={variant} />
        ))}
      </div>
    </div>
  );
}
