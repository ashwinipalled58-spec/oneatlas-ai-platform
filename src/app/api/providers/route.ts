import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { FALLBACK_PROVIDERS_WITH_MODELS } from "@/lib/fallback-data";

export async function GET() {
  try {
    const providers = await prisma.provider.findMany({
      orderBy: { name: "asc" },
      include: {
        models: { include: { model: { select: { id: true, name: true, slug: true, category: true } } } },
      },
    });
    return NextResponse.json(providers.map((p) => ({ ...p, modelCount: p.models.length, models: p.models.map((pm) => pm.model) })));
  } catch {
    return NextResponse.json(FALLBACK_PROVIDERS_WITH_MODELS);
  }
}
