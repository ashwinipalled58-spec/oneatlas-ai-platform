import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { FALLBACK_MODELS, FALLBACK_LABS, FALLBACK_PROVIDERS } from "@/lib/fallback-data";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") ?? "";
  if (!q) return NextResponse.json({ models: [], labs: [], providers: [] });

  try {
    const [models, labs, providers] = await Promise.all([
      prisma.aIModel.findMany({ where: { OR: [{ name: { contains: q, mode: "insensitive" } }, { description: { contains: q, mode: "insensitive" } }] }, take: 6, select: { id: true, name: true, slug: true, category: true, lab: { select: { name: true } } } }),
      prisma.lab.findMany({ where: { name: { contains: q, mode: "insensitive" } }, take: 3, select: { id: true, name: true, slug: true, _count: { select: { models: true } } } }),
      prisma.provider.findMany({ where: { name: { contains: q, mode: "insensitive" } }, take: 3, select: { id: true, name: true, slug: true } }),
    ]);
    return NextResponse.json({ models, labs, providers });
  } catch {
    const ql = q.toLowerCase();
    return NextResponse.json({
      models: FALLBACK_MODELS.filter((m) => m.name.toLowerCase().includes(ql) || m.lab.name.toLowerCase().includes(ql)).slice(0, 6).map((m) => ({ id: m.id, name: m.name, slug: m.slug, category: m.category, lab: { name: m.lab.name } })),
      labs: FALLBACK_LABS.filter((l) => l.name.toLowerCase().includes(ql)).slice(0, 3),
      providers: FALLBACK_PROVIDERS.filter((p) => p.name.toLowerCase().includes(ql)).slice(0, 3),
    });
  }
}
