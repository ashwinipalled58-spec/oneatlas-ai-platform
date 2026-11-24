import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { FALLBACK_BENCHMARKS } from "@/lib/fallback-data";

export async function GET() {
  try {
    const benchmarks = await prisma.benchmark.findMany({
      orderBy: { name: "asc" },
      include: { _count: { select: { scores: true } } },
    });
    return NextResponse.json(benchmarks);
  } catch {
    return NextResponse.json(FALLBACK_BENCHMARKS);
  }
}
