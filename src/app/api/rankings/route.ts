import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { FALLBACK_MODELS } from "@/lib/fallback-data";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const benchmarkSlug = searchParams.get("benchmark") ?? "mmlu";
  const category = searchParams.get("category") ?? "";

  try {
    const where: Record<string, unknown> = {};
    if (category) where.category = { equals: category, mode: "insensitive" };
    const models = await prisma.aIModel.findMany({
      where,
      include: {
        lab: { select: { name: true, slug: true } },
        benchmarkScores: { include: { benchmark: { select: { name: true, slug: true } } } },
      },
    });
    const ranked = models
      .map((m) => { const s = m.benchmarkScores.find((b) => b.benchmark.slug === benchmarkSlug); return { ...m, rankScore: s?.score ?? null }; })
      .filter((m) => m.rankScore !== null)
      .sort((a, b) => (b.rankScore ?? 0) - (a.rankScore ?? 0))
      .map((m, i) => ({ ...m, rank: i + 1 }));
    return NextResponse.json({ benchmark: benchmarkSlug, rankings: ranked });
  } catch {
    let filtered = [...FALLBACK_MODELS];
    if (category) filtered = filtered.filter((m) => m.category.toLowerCase() === category.toLowerCase());
    const ranked = filtered
      .map((m) => { const s = m.benchmarkScores.find((b) => b.benchmark.slug === benchmarkSlug); return { ...m, rankScore: s?.score ?? null }; })
      .filter((m) => m.rankScore !== null)
      .sort((a, b) => (b.rankScore ?? 0) - (a.rankScore ?? 0))
      .map((m, i) => ({ ...m, rank: i + 1 }));
    return NextResponse.json({ benchmark: benchmarkSlug, rankings: ranked, _fallback: true });
  }
}
