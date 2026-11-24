import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { FALLBACK_MODELS } from "@/lib/fallback-data";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const isNumeric = /^\d+$/.test(id);
  try {
    const model = await prisma.aIModel.findFirst({
      where: isNumeric ? { id: parseInt(id) } : { slug: id },
      include: {
        lab: true,
        providers: { include: { provider: true } },
        benchmarkScores: { include: { benchmark: true }, orderBy: { benchmark: { name: "asc" } } },
      },
    });
    if (!model) return NextResponse.json({ error: "Model not found" }, { status: 404 });
    return NextResponse.json(model);
  } catch {
    const model = isNumeric
      ? FALLBACK_MODELS.find((m) => m.id === parseInt(id))
      : FALLBACK_MODELS.find((m) => m.slug === id);
    if (!model) return NextResponse.json({ error: "Model not found" }, { status: 404 });
    return NextResponse.json({ ...model, _fallback: true });
  }
}
