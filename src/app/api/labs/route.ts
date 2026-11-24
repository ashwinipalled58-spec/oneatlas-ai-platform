import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { FALLBACK_LABS_WITH_MODELS } from "@/lib/fallback-data";

export async function GET() {
  try {
    const labs = await prisma.lab.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: { select: { models: true } },
        models: { select: { id: true, name: true, slug: true, category: true, tag: true }, orderBy: { name: "asc" } },
      },
    });
    return NextResponse.json(labs);
  } catch {
    return NextResponse.json(FALLBACK_LABS_WITH_MODELS);
  }
}
