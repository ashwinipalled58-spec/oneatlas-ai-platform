import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { FALLBACK_PROVIDERS_WITH_MODELS } from "@/lib/fallback-data";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const isNumeric = /^\d+$/.test(id);
  try {
    const provider = await prisma.provider.findFirst({
      where: isNumeric ? { id: parseInt(id) } : { slug: id },
      include: { models: { include: { model: { include: { lab: { select: { name: true, slug: true } } } } } } },
    });
    if (!provider) return NextResponse.json({ error: "Provider not found" }, { status: 404 });
    return NextResponse.json({ ...provider, modelCount: provider.models.length, models: provider.models.map((pm) => pm.model) });
  } catch {
    const provider = isNumeric
      ? FALLBACK_PROVIDERS_WITH_MODELS.find((p) => p.id === parseInt(id))
      : FALLBACK_PROVIDERS_WITH_MODELS.find((p) => p.slug === id);
    if (!provider) return NextResponse.json({ error: "Provider not found" }, { status: 404 });
    return NextResponse.json({ ...provider, _fallback: true });
  }
}
