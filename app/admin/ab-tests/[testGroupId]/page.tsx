import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";

import { baseUrl } from "@/lib/constants/api";
import { AbTestStatsHeader } from "@/components/admin/ab-tests/ab-test-stats-header";
import { AbTestStatsOverview } from "@/components/admin/ab-tests/ab-test-stats-overview";
import { AbTestBestVariant } from "@/components/admin/ab-tests/ab-test-best-variant";
import { AbTestVariantsComparison } from "@/components/admin/ab-tests/ab-test-variants-comparison";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ testGroupId: string }>;
};

async function getTestGroupStats(testGroupId: string) {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore
      .getAll()
      .map((cookie) => `${cookie.name}=${cookie.value}`)
      .join("; ");

    const response = await fetch(
      `${baseUrl}/api/ab-test-groups/${testGroupId}/stats`,
      {
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
          Cookie: cookieHeader,
        },
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(
        `Failed to fetch test group stats: ${response.statusText}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching test group stats:", error);
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { testGroupId } = await params;
  const data = await getTestGroupStats(testGroupId);

  if (!data) {
    return {
      title: "Grupo não encontrado | Admin",
    };
  }

  return {
    title: `${data.testGroup.name} - Estatísticas | Admin`,
    description: `Estatísticas detalhadas do teste A/B: ${data.testGroup.name}`,
  };
}

export default async function AbTestStatsPage({ params }: Props) {
  const { testGroupId } = await params;
  const data = await getTestGroupStats(testGroupId);

  if (!data) {
    notFound();
  }

  const {
    testGroup,
    stats,
    totalImpressions,
    totalClicks,
    overallCtr,
    bestVariant,
  } = data;

  return (
    <div className="container mx-auto py-6 px-4 max-w-7xl">
      <div className="space-y-6">
        <AbTestStatsHeader testGroup={testGroup} />

        <AbTestStatsOverview
          totalImpressions={totalImpressions}
          totalClicks={totalClicks}
          overallCtr={overallCtr}
        />

        <AbTestBestVariant
          bestVariant={bestVariant}
          totalVariants={stats.length}
        />

        <AbTestVariantsComparison stats={stats} />
      </div>
    </div>
  );
}
