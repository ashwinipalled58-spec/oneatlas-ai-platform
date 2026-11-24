"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Award, Filter, ChevronDown } from "lucide-react";
import Navbar from "@/components/Navbar";
import { PageLoader } from "@/components/LoadingStates";
import EmptyState from "@/components/EmptyState";

type RankedModel = {
  id: number;
  name: string;
  slug: string;
  category: string;
  rank: number;
  rankScore: number;
  inputPrice: number;
  outputPrice: number;
  contextWindow: number;
  lab: { name: string; slug: string };
  benchmarkScores: { score: number; benchmark: { name: string; slug: string } }[];
};

const BENCHMARKS = [
  { slug: "mmlu", name: "MMLU" },
  { slug: "humaneval", name: "HumanEval" },
  { slug: "math", name: "MATH" },
  { slug: "gpqa-diamond", name: "GPQA Diamond" },
  { slug: "swe-bench-verified", name: "SWE-bench" },
];

const CATEGORIES = ["All", "Chat", "Reasoning", "Multimodal"];

const MEDAL: Record<number, string> = { 1: "🥇", 2: "🥈", 3: "🥉" };

function formatPrice(price: number) {
  return price < 0.01 ? `$${price.toFixed(4)}` : `$${price.toFixed(2)}`;
}

export default function RankingsPage() {
  const [rankings, setRankings] = useState<RankedModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [benchmark, setBenchmark] = useState("mmlu");
  const [category, setCategory] = useState("All");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    const params = new URLSearchParams({ benchmark });
    if (category !== "All") params.set("category", category);
    fetch(`/api/rankings?${params}`)
      .then((r) => r.ok ? r.json() : Promise.reject())
      .then((data) => setRankings(data.rankings ?? []))
      .catch(() => setError("Failed to load rankings."))
      .finally(() => setLoading(false));
  }, [benchmark, category]);

  const benchName = BENCHMARKS.find((b) => b.slug === benchmark)?.name ?? benchmark;

  return (
    <div className="min-h-screen bg-[#080b12]">
      <Navbar />

      <main className="mx-auto max-w-[1100px] px-6 py-12 fade-in">
        {/* Header */}
        <div className="mb-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-cyan-400">Leaderboard</p>
          <h1 className="mt-2 text-4xl font-bold text-white">Model Rankings</h1>
          <p className="mt-2 text-slate-500 text-sm max-w-xl">
            Models ranked by benchmark performance. All scores are{" "}
            <span className="text-amber-400 font-medium">demo data for illustration only</span> — not independently verified.
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 flex flex-wrap gap-4">
          <div className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-[#101621] px-4 py-3">
            <Award className="h-4 w-4 text-cyan-400" />
            <select
              value={benchmark}
              onChange={(e) => setBenchmark(e.target.value)}
              className="bg-transparent text-sm text-slate-300 outline-none cursor-pointer"
            >
              {BENCHMARKS.map((b) => (
                <option key={b.slug} value={b.slug}>{b.name}</option>
              ))}
            </select>
            <ChevronDown className="h-4 w-4 text-slate-500" />
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-[#101621] px-4 py-3">
            <Filter className="h-4 w-4 text-slate-500" />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="bg-transparent text-sm text-slate-300 outline-none cursor-pointer"
            >
              {CATEGORIES.map((c) => <option key={c} value={c}>{c === "All" ? "All Categories" : c}</option>)}
            </select>
            <ChevronDown className="h-4 w-4 text-slate-500" />
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <PageLoader />
        ) : error ? (
          <EmptyState type="server" message={error} />
        ) : rankings.length === 0 ? (
          <EmptyState type="search" title="No results" message="Try a different benchmark or category." />
        ) : (
          <div className="rounded-2xl border border-white/[0.08] bg-[#101621] overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-[48px_1fr_120px_120px_100px_100px] items-center gap-4 border-b border-white/[0.08] bg-white/[0.02] px-6 py-3">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">#</span>
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Model</span>
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 text-right">{benchName}</span>
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 text-right">Input /1M</span>
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 text-right">Context</span>
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 text-right">Category</span>
            </div>

            {rankings.map((model, i) => (
              <div
                key={model.id}
                className={`grid grid-cols-[48px_1fr_120px_120px_100px_100px] items-center gap-4 px-6 py-4 transition-colors hover:bg-white/[0.02] ${i < rankings.length - 1 ? "border-b border-white/[0.05]" : ""}`}
              >
                {/* Rank */}
                <div className="flex items-center justify-center">
                  {MEDAL[model.rank] ? (
                    <span className="text-xl">{MEDAL[model.rank]}</span>
                  ) : (
                    <span className="text-sm font-bold text-slate-500">{model.rank}</span>
                  )}
                </div>

                {/* Model */}
                <div>
                  <p className="text-xs text-cyan-400 font-medium">{model.lab.name}</p>
                  <Link
                    href={`/models/${model.slug}`}
                    className="text-sm font-semibold text-white hover:text-cyan-400 transition-colors"
                  >
                    {model.name}
                  </Link>
                </div>

                {/* Score */}
                <div className="text-right">
                  <span className="text-lg font-bold text-cyan-400">{model.rankScore.toFixed(1)}</span>
                  <div className="mt-1 h-1 w-full rounded-full bg-white/[0.06]">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-indigo-500"
                      style={{ width: `${model.rankScore}%` }}
                    />
                  </div>
                </div>

                {/* Price */}
                <p className="text-sm text-slate-300 text-right">{formatPrice(model.inputPrice)}</p>

                {/* Context */}
                <p className="text-sm text-slate-300 text-right">
                  {model.contextWindow >= 1_000_000
                    ? `${model.contextWindow / 1_000_000}M`
                    : `${model.contextWindow / 1_000}K`}
                </p>

                {/* Category */}
                <p className="text-xs text-slate-500 text-right">{model.category}</p>
              </div>
            ))}
          </div>
        )}
      </main>

      <footer className="border-t border-white/[0.06] px-6 py-6 text-center text-xs text-slate-600 mt-8">
        © 2026 OneAtlas — All benchmark scores are demo data for illustration purposes only.
      </footer>
    </div>
  );
}
