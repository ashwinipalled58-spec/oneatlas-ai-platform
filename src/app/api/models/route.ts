import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { FALLBACK_MODELS } from "@/lib/fallback-data";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") ?? "";
  const category = searchParams.get("category") ?? "";
  const labSlug = searchParams.get("lab") ?? "";
  const capability = searchParams.get("capability") ?? "";
  const sortBy = searchParams.get("sort") ?? "name";
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
  const limit = Math.min(50, parseInt(searchParams.get("limit") ?? "12"));
  const skip = (page - 1) * limit;

  try {
    const where: Record<string, unknown> = {};
    if (q) {
      where.OR = [
        { name: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
        { lab: { name: { contains: q, mode: "insensitive" } } },
      ];
    }
    if (category) where.category = { equals: category, mode: "insensitive" };
    if (labSlug) where.lab = { slug: labSlug };
    if (capability) where.capabilities = { has: capability };

    const orderBy: Record<string, string> =
      sortBy === "inputPrice" ? { inputPrice: "asc" }
      : sortBy === "outputPrice" ? { outputPrice: "asc" }
      : sortBy === "contextWindow" ? { contextWindow: "desc" }
      : sortBy === "releaseDate" ? { releaseDate: "desc" }
      : { name: "asc" };

    const [models, total] = await Promise.all([
      prisma.aIModel.findMany({
        where, orderBy, skip, take: limit,
        include: {
          lab: { select: { name: true, slug: true } },
          providers: { include: { provider: { select: { name: true, slug: true } } } },
          benchmarkScores: { include: { benchmark: { select: { name: true, slug: true } } } },
        },
      }),
      prisma.aIModel.count({ where }),
    ]);

    return NextResponse.json({ models, pagination: { total, page, limit, totalPages: Math.ceil(total / limit) } });
  } catch {
    // ── Fallback: DB unavailable ──────────────────────────────────────────
    let filtered = [...FALLBACK_MODELS];
    if (q) filtered = filtered.filter((m) => m.name.toLowerCase().includes(q.toLowerCase()) || m.lab.name.toLowerCase().includes(q.toLowerCase()));
    if (category) filtered = filtered.filter((m) => m.category.toLowerCase() === category.toLowerCase());
    if (labSlug) filtered = filtered.filter((m) => m.lab.slug === labSlug);
    if (capability) filtered = filtered.filter((m) => m.capabilities.includes(capability));

    if (sortBy === "inputPrice") filtered.sort((a, b) => a.inputPrice - b.inputPrice);
    else if (sortBy === "outputPrice") filtered.sort((a, b) => a.outputPrice - b.outputPrice);
    else if (sortBy === "contextWindow") filtered.sort((a, b) => b.contextWindow - a.contextWindow);
    else if (sortBy === "releaseDate") filtered.sort((a, b) => new Date(b.releaseDate ?? 0).getTime() - new Date(a.releaseDate ?? 0).getTime());
    else filtered.sort((a, b) => a.name.localeCompare(b.name));

    const total = filtered.length;
    const models = filtered.slice(skip, skip + limit);
    return NextResponse.json({ models, pagination: { total, page, limit, totalPages: Math.ceil(total / limit) }, _fallback: true });
  }
}
