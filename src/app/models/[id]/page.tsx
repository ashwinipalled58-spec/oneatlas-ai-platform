"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, ExternalLink, Cpu, DollarSign, BookOpen,
  Calendar, Layers, Award, Info
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { PageLoader } from "@/components/LoadingStates";
import EmptyState from "@/components/EmptyState";

type BenchmarkScore = {
  score: number;
  isDemo: boolean;
  benchmark: { name: string; slug: string; description: string; category: string; maxScore: number };
};

type FullModel = {
  id: number;
  name: string;
  slug: string;
  description: string;
  category: string;
  inputPrice: number;
  outputPrice: number;
  contextWindow: number;
  releaseDate: string | null;
  capabilities: string[];
  modalities: string[];
  isOpenSource: boolean;
  tag?: string | null;
  lab: { name: string; slug: string; description: string; website?: string };
  providers: { provider: { name: string; slug: string; website?: string; capabilities: string[] } }[];
  benchmarkScores: BenchmarkScore[];
};

function formatContext(tokens: number): string {
  if (tokens >= 1_000_000) return `${tokens / 1_000_000}M tokens`;
  if (tokens >= 1_000) return `${tokens / 1_000}K tokens`;
  return `${tokens} tokens`;
}

function formatPrice(price: number): string {
  if (price < 0.01) return `$${price.toFixed(4)}`;
  return `$${price.toFixed(2)}`;
}

export default function ModelDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const [model, setModel] = useState<FullModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    fetch(`/api/models/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error("Not found");
        return r.json();
      })
      .then(setModel)
      .catch(() => setError("Model not found."))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <><Navbar /><PageLoader /></>;
  if (error || !model) return (
    <>
      <Navbar />
      <div className="mx-auto max-w-4xl px-6 py-20">
        <EmptyState type="error" message={error} action={
          <button onClick={() => router.push("/")} className="btn-primary px-4 py-2 rounded-lg text-sm">
            Back to Models
          </button>
        } />
      </div>
    </>
  );

  const topScore = model.benchmarkScores.length > 0
    ? Math.max(...model.benchmarkScores.map((s) => s.score))
    : null;

  return (
    <div className="min-h-screen bg-[#080b12]">
      <Navbar />

      <main className="mx-auto max-w-[1100px] px-6 py-12 fade-in">
        {/* Back */}
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-cyan-400 transition-colors mb-8">
          <ArrowLeft className="h-4 w-4" /> Back to Model Directory
        </Link>

        {/* Header */}
        <div className="rounded-2xl border border-white/[0.08] bg-[#101621] p-8 mb-6">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="badge badge-cyan text-xs">{model.lab.name}</span>
                <span className="badge badge-purple text-xs">{model.category}</span>
                {model.isOpenSource && <span className="badge badge-green text-xs">Open Source</span>}
                {model.tag && <span className="badge badge-amber text-xs">{model.tag}</span>}
              </div>
              <h1 className="text-4xl font-bold text-white">{model.name}</h1>
              <p className="mt-3 text-base text-slate-400 max-w-2xl leading-relaxed">
                {model.description}
              </p>
            </div>
            {topScore && (
              <div className="text-center rounded-xl border border-cyan-400/20 bg-cyan-400/5 p-5 min-w-[120px]">
                <Award className="h-6 w-6 text-cyan-400 mx-auto mb-2" />
                <p className="text-3xl font-bold text-cyan-400">{topScore.toFixed(1)}</p>
                <p className="text-xs text-slate-500 mt-1">Best Score</p>
              </div>
            )}
          </div>
        </div>

        {/* Key Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6 md:grid-cols-4">
          {[
            { icon: DollarSign, label: "Input Price", value: `${formatPrice(model.inputPrice)} / 1M`, sub: "tokens" },
            { icon: DollarSign, label: "Output Price", value: `${formatPrice(model.outputPrice)} / 1M`, sub: "tokens" },
            { icon: Cpu, label: "Context Window", value: formatContext(model.contextWindow), sub: "" },
            { icon: Calendar, label: "Release Date", value: model.releaseDate ? new Date(model.releaseDate).toLocaleDateString("en-US", { year: "numeric", month: "short" }) : "Unknown", sub: "" },
          ].map(({ icon: Icon, label, value, sub }) => (
            <div key={label} className="rounded-xl border border-white/[0.06] bg-[#101621] p-5">
              <Icon className="h-4 w-4 text-cyan-400 mb-3" />
              <p className="text-xs text-slate-500">{label}</p>
              <p className="mt-1.5 text-lg font-bold text-white">{value}</p>
              {sub && <p className="text-xs text-slate-600">{sub}</p>}
            </div>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Capabilities */}
          <div className="rounded-2xl border border-white/[0.08] bg-[#101621] p-6">
            <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-cyan-400 mb-4">
              <Layers className="h-4 w-4" /> Capabilities
            </h2>
            <div className="flex flex-wrap gap-2">
              {model.capabilities.map((cap) => (
                <span key={cap} className="rounded-lg border border-white/[0.06] bg-white/[0.03] px-3 py-1.5 text-sm text-slate-300 capitalize">
                  {cap}
                </span>
              ))}
            </div>

            <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-cyan-400 mt-6 mb-4">
              <BookOpen className="h-4 w-4" /> Modalities
            </h2>
            <div className="flex flex-wrap gap-2">
              {model.modalities.map((mod) => (
                <span key={mod} className="rounded-lg border border-cyan-400/20 bg-cyan-400/5 px-3 py-1.5 text-sm text-cyan-300 capitalize">
                  {mod}
                </span>
              ))}
            </div>
          </div>

          {/* Lab Info */}
          <div className="rounded-2xl border border-white/[0.08] bg-[#101621] p-6">
            <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-cyan-400 mb-4">
              <Info className="h-4 w-4" /> About {model.lab.name}
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed">{model.lab.description}</p>
            {model.lab.website && (
              <a
                href={model.lab.website}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 text-xs text-cyan-400 hover:underline"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                Visit {model.lab.name}
              </a>
            )}

            {/* Providers */}
            {model.providers.length > 0 && (
              <>
                <h3 className="mt-6 text-xs font-semibold uppercase tracking-widest text-slate-500 mb-3">
                  Available via
                </h3>
                <div className="flex flex-wrap gap-2">
                  {model.providers.map(({ provider }) => (
                    <Link
                      key={provider.slug}
                      href={`/providers/${provider.slug}`}
                      className="rounded-lg border border-white/[0.06] bg-white/[0.03] px-3 py-1.5 text-sm text-slate-300 hover:border-cyan-400/30 hover:text-cyan-400 transition-colors"
                    >
                      {provider.name}
                    </Link>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Benchmark Scores */}
        {model.benchmarkScores.length > 0 && (
          <div className="mt-6 rounded-2xl border border-white/[0.08] bg-[#101621] p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-cyan-400">
                <Award className="h-4 w-4" /> Benchmark Scores
              </h2>
              <span className="badge badge-amber text-[10px]">⚠ Demo Data — For Illustration Only</span>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {model.benchmarkScores.map(({ benchmark, score }) => (
                <div key={benchmark.slug} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-sm font-semibold text-white">{benchmark.name}</p>
                      <p className="text-xs text-slate-500 mt-0.5 capitalize">{benchmark.category}</p>
                    </div>
                    <span className="text-2xl font-bold text-cyan-400">{score.toFixed(1)}</span>
                  </div>
                  {/* Score bar */}
                  <div className="h-1.5 w-full rounded-full bg-white/[0.06]">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-indigo-500 transition-all"
                      style={{ width: `${(score / benchmark.maxScore) * 100}%` }}
                    />
                  </div>
                  <p className="mt-2 text-[10px] text-slate-600 leading-relaxed line-clamp-2">{benchmark.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href={`/compare?models=${model.id}`} className="btn-primary flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm">
            Compare This Model
          </Link>
          <Link href="/" className="btn-ghost flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm">
            ← Browse All Models
          </Link>
        </div>
      </main>
    </div>
  );
}
