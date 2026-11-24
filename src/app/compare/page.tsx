"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { X, Plus, ArrowLeft, Award } from "lucide-react";
import Navbar from "@/components/Navbar";
import { PageLoader } from "@/components/LoadingStates";
import EmptyState from "@/components/EmptyState";

type Model = {
  id: number;
  name: string;
  slug: string;
  category: string;
  description: string;
  inputPrice: number;
  outputPrice: number;
  contextWindow: number;
  capabilities: string[];
  modalities: string[];
  isOpenSource: boolean;
  lab: { name: string };
  benchmarkScores: { score: number; benchmark: { name: string; slug: string } }[];
};

function formatPrice(price: number) {
  return price < 0.01 ? `$${price.toFixed(4)}` : `$${price.toFixed(2)}`;
}

function formatContext(tokens: number) {
  if (tokens >= 1_000_000) return `${tokens / 1_000_000}M`;
  if (tokens >= 1_000) return `${tokens / 1_000}K`;
  return `${tokens}`;
}

const BENCH_SLUGS = ["mmlu", "humaneval", "math", "gpqa-diamond", "swe-bench-verified"];
const BENCH_NAMES: Record<string, string> = {
  "mmlu": "MMLU",
  "humaneval": "HumanEval",
  "math": "MATH",
  "gpqa-diamond": "GPQA Diamond",
  "swe-bench-verified": "SWE-bench",
};

function CompareContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [models, setModels] = useState<(Model | null)[]>([]);
  const [loading, setLoading] = useState(true);

  const idsParam = searchParams.get("models") ?? "";
  const ids = idsParam.split(",").filter(Boolean).slice(0, 3);

  useEffect(() => {
    async function load() {
      if (ids.length === 0) {
        setLoading(false);
        return;
      }
      setLoading(true);
      const results = await Promise.all(
        ids.map((id) =>
          fetch(`/api/models/${id}`)
            .then((r) => r.ok ? r.json() : null)
            .catch(() => null)
        )
      );
      setModels(results);
      setLoading(false);
    }
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idsParam]);

  function removeModel(id: number) {
    const remaining = ids.filter((x) => x !== String(id));
    if (remaining.length === 0) router.push("/compare");
    else router.push(`/compare?models=${remaining.join(",")}`);
  }

  const validModels = models.filter(Boolean) as Model[];

  const ROWS = [
    { label: "Provider / Lab", render: (m: Model) => m.lab.name },
    { label: "Category", render: (m: Model) => m.category },
    { label: "Input Price /1M", render: (m: Model) => formatPrice(m.inputPrice) },
    { label: "Output Price /1M", render: (m: Model) => formatPrice(m.outputPrice) },
    { label: "Context Window", render: (m: Model) => formatContext(m.contextWindow) },
    { label: "Open Source", render: (m: Model) => m.isOpenSource ? "✅ Yes" : "❌ No" },
    { label: "Modalities", render: (m: Model) => m.modalities.join(", ") },
    { label: "Capabilities", render: (m: Model) => m.capabilities.slice(0, 4).join(", ") },
    ...BENCH_SLUGS.map((slug) => ({
      label: BENCH_NAMES[slug] ?? slug,
      render: (m: Model) => {
        const s = m.benchmarkScores.find((b) => b.benchmark.slug === slug);
        return s ? `${s.score.toFixed(1)}` : "—";
      },
    })),
  ];

  if (loading) return <PageLoader />;

  if (ids.length === 0 || validModels.length === 0) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-20">
        <EmptyState
          type="empty"
          title="No models selected"
          message="Go back to the model directory and select up to 3 models to compare."
          action={
            <Link href="/" className="btn-primary px-5 py-2.5 rounded-lg text-sm">
              Browse Models
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <main className="mx-auto max-w-[1100px] px-6 py-12 fade-in">
      <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-cyan-400 mb-8">
        <ArrowLeft className="h-4 w-4" /> Back to Models
      </Link>

      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-cyan-400">Side-by-Side</p>
        <h1 className="mt-2 text-3xl font-bold text-white">Model Comparison</h1>
        <p className="mt-1 text-sm text-slate-500">Comparing {validModels.length} model{validModels.length > 1 ? "s" : ""}</p>
      </div>

      {/* Model Headers */}
      <div className="mb-6 grid gap-4" style={{ gridTemplateColumns: `220px repeat(${validModels.length}, 1fr)` }}>
        <div />
        {validModels.map((model) => (
          <div key={model.id} className="rounded-2xl border border-white/[0.08] bg-[#101621] p-5 relative">
            <button
              onClick={() => removeModel(model.id)}
              className="absolute right-3 top-3 rounded-lg p-1 text-slate-500 hover:bg-white/10 hover:text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
            <p className="text-xs text-cyan-400 font-medium">{model.lab.name}</p>
            <h2 className="mt-1 text-lg font-bold text-white leading-tight pr-6">{model.name}</h2>
            <span className="mt-2 inline-block rounded-full bg-white/[0.05] px-2 py-0.5 text-xs text-slate-400">
              {model.category}
            </span>
          </div>
        ))}
      </div>

      {/* Comparison Table */}
      <div className="rounded-2xl border border-white/[0.08] bg-[#101621] overflow-hidden">
        {ROWS.map((row, i) => {
          const isLast = i === ROWS.length - 1;
          const isBenchStart = i === 8;
          return (
            <div key={row.label}>
              {isBenchStart && (
                <div className="border-t border-white/[0.08] bg-white/[0.02] px-5 py-3">
                  <div className="flex items-center gap-2">
                    <Award className="h-3.5 w-3.5 text-cyan-400" />
                    <span className="text-xs font-semibold uppercase tracking-widest text-cyan-400">
                      Benchmark Scores
                    </span>
                    <span className="badge badge-amber text-[10px] ml-2">Demo Data</span>
                  </div>
                </div>
              )}
              <div
                className={`grid items-center gap-4 px-5 py-4 ${!isLast ? "border-b border-white/[0.05]" : ""} ${i % 2 === 0 ? "" : "bg-white/[0.01]"}`}
                style={{ gridTemplateColumns: `220px repeat(${validModels.length}, 1fr)` }}
              >
                <p className="text-xs font-medium text-slate-500">{row.label}</p>
                {validModels.map((model) => (
                  <p key={model.id} className="text-sm text-white font-medium">
                    {row.render(model)}
                  </p>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add another model */}
      {validModels.length < 3 && (
        <div className="mt-6 rounded-2xl border border-dashed border-white/[0.1] p-8 text-center">
          <Plus className="h-8 w-8 text-slate-600 mx-auto mb-3" />
          <p className="text-sm text-slate-500 mb-4">Add another model to compare</p>
          <Link href="/" className="btn-ghost px-5 py-2.5 rounded-lg text-sm inline-flex items-center gap-2">
            Browse Models
          </Link>
        </div>
      )}
    </main>
  );
}

export default function ComparePage() {
  return (
    <div className="min-h-screen bg-[#080b12]">
      <Navbar />
      <Suspense fallback={<PageLoader />}>
        <CompareContent />
      </Suspense>
      <footer className="border-t border-white/[0.06] px-6 py-6 text-center text-xs text-slate-600">
        © 2026 OneAtlas — Benchmark data shown is demo data for illustration purposes only.
      </footer>
    </div>
  );
}
