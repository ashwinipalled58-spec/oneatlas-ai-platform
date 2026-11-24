"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, SlidersHorizontal, ChevronDown, ArrowRight, GitCompare } from "lucide-react";
import Navbar from "@/components/Navbar";
import ModelCard from "@/components/ModelCard";
import { SkeletonCard } from "@/components/LoadingStates";
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
  tag?: string | null;
  isOpenSource: boolean;
  capabilities: string[];
  lab: { name: string; slug: string };
};

type Pagination = { total: number; page: number; limit: number; totalPages: number };

const CATEGORIES = ["All", "Chat", "Reasoning", "Multimodal"];
const SORT_OPTIONS = [
  { value: "name", label: "Name A–Z" },
  { value: "inputPrice", label: "Lowest Input Price" },
  { value: "outputPrice", label: "Lowest Output Price" },
  { value: "contextWindow", label: "Largest Context" },
  { value: "releaseDate", label: "Newest First" },
];

export default function HomePage() {
  const router = useRouter();
  const [models, setModels] = useState<Model[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("name");
  const [page, setPage] = useState(1);
  const [compareIds, setCompareIds] = useState<number[]>([]);
  const [stats, setStats] = useState({ models: 0, labs: 0, providers: 0 });
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchModels = useCallback(async (q: string, cat: string, s: string, pg: number) => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({
        limit: "12",
        page: String(pg),
        sort: s,
      });
      if (q) params.set("q", q);
      if (cat !== "All") params.set("category", cat);

      const res = await fetch(`/api/models?${params}`);
      if (!res.ok) throw new Error("Failed to load models");
      const data = await res.json();
      setModels(data.models);
      setPagination(data.pagination);
      if (pg === 1 && !q && cat === "All") {
        setStats((prev) => ({ ...prev, models: data.pagination.total }));
      }
    } catch {
      setError("Could not load models. Make sure the database is set up.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch platform stats once
  useEffect(() => {
    Promise.all([
      fetch("/api/labs").then((r) => r.json()),
      fetch("/api/providers").then((r) => r.json()),
    ]).then(([labs, providers]) => {
      setStats((prev) => ({
        ...prev,
        labs: Array.isArray(labs) ? labs.length : 0,
        providers: Array.isArray(providers) ? providers.length : 0,
      }));
    }).catch(() => {});
  }, []);

  // Debounced search
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setPage(1);
      fetchModels(search, category, sort, 1);
    }, 350);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [search, category, sort, fetchModels]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchModels(search, category, sort, page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  function toggleCompare(id: number) {
    setCompareIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : prev.length < 3 ? [...prev, id] : prev
    );
  }

  function goToCompare() {
    router.push(`/compare?models=${compareIds.join(",")}`);
  }

  return (
    <div className="min-h-screen bg-[#080b12]">
      <Navbar />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden px-6 pb-16 pt-20 text-center">
        <div className="hero-glow" />
        <div className="relative mx-auto max-w-[1440px]">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/5 px-4 py-1.5 text-xs font-medium text-cyan-400">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
            AI MODEL INTELLIGENCE PLATFORM
          </div>

          <h1 className="mx-auto max-w-4xl text-4xl font-bold leading-tight tracking-tight text-white md:text-6xl">
            Discover the right AI model.
            <span className="block gradient-text">Build without limits.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-400">
            Compare pricing, context windows, capabilities and benchmarks across all leading AI
            models — from GPT-4 to Gemini, Claude to Llama.
          </p>

          {/* Search Bar */}
          <div className="mx-auto mt-10 flex max-w-2xl items-center gap-3 rounded-2xl border border-white/[0.08] bg-[#101621] p-3 transition-colors focus-within:border-cyan-400/40 focus-within:shadow-[0_0_24px_rgba(34,211,238,0.07)]">
            <Search className="ml-2 h-4 w-4 shrink-0 text-slate-500" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search models, providers, capabilities..."
              className="min-w-0 flex-1 bg-transparent py-2 text-sm text-white outline-none placeholder:text-slate-500"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="rounded-lg bg-white/5 px-3 py-1.5 text-xs text-slate-400 hover:text-white transition-colors"
              >
                Clear
              </button>
            )}
          </div>

          {/* Stats */}
          <div className="mx-auto mt-12 grid max-w-2xl grid-cols-3 gap-4">
            {[
              { value: stats.models || "20+", label: "AI Models" },
              { value: stats.labs || "9", label: "Research Labs" },
              { value: stats.providers || "6", label: "API Providers" },
            ].map(({ value, label }) => (
              <div key={label} className="rounded-xl border border-white/[0.06] bg-[#101621] p-5">
                <p className="text-2xl font-bold text-cyan-400">{value}</p>
                <p className="mt-1 text-xs text-slate-500">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Model Directory ───────────────────────────────────────────────── */}
      <section className="mx-auto max-w-[1440px] px-6 pb-24">
        {/* Toolbar */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-cyan-400">
              Model Directory
            </p>
            <h2 className="mt-2 text-3xl font-bold text-white">Explore AI Models</h2>
            <p className="mt-1 text-sm text-slate-500">
              {pagination ? `${pagination.total} models from leading AI companies` : "Loading…"}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-lg border border-white/[0.08] bg-[#101621] px-3 py-2.5">
              <SlidersHorizontal className="h-3.5 w-3.5 text-slate-500" />
              <select
                value={sort}
                onChange={(e) => { setSort(e.target.value); setPage(1); }}
                className="bg-transparent text-sm text-slate-300 outline-none cursor-pointer"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
              <ChevronDown className="h-3.5 w-3.5 text-slate-500" />
            </div>
          </div>
        </div>

        {/* Category Filters */}
        <div className="mb-8 flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => { setCategory(cat); setPage(1); }}
              className={`rounded-full px-5 py-2 text-sm font-medium transition-all ${
                category === cat
                  ? "bg-cyan-400 text-[#071019] shadow-[0_0_16px_rgba(34,211,238,0.3)]"
                  : "border border-white/[0.08] bg-[#101621] text-slate-400 hover:border-cyan-400/30 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        {error ? (
          <EmptyState type="server" message={error} />
        ) : loading ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : models.length === 0 ? (
          <EmptyState
            type="search"
            action={
              <button
                onClick={() => { setSearch(""); setCategory("All"); }}
                className="btn-primary text-sm px-4 py-2 rounded-lg"
              >
                Clear Filters
              </button>
            }
          />
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3 fade-in">
            {models.map((model) => (
              <ModelCard
                key={model.id}
                model={model}
                selected={compareIds.includes(model.id)}
                onToggleCompare={toggleCompare}
                compareCount={compareIds.length}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="mt-10 flex items-center justify-center gap-3">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="btn-ghost px-4 py-2 text-sm disabled:opacity-30"
            >
              ← Previous
            </button>
            <span className="text-sm text-slate-500">
              Page {page} of {pagination.totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
              disabled={page === pagination.totalPages}
              className="btn-ghost px-4 py-2 text-sm disabled:opacity-30"
            >
              Next →
            </button>
          </div>
        )}
      </section>

      {/* ── Compare Banner ────────────────────────────────────────────────── */}
      {compareIds.length > 0 && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 fade-in">
          <div className="flex items-center gap-4 rounded-2xl border border-cyan-400/30 bg-[#101621]/95 px-6 py-4 shadow-[0_8px_32px_rgba(0,0,0,0.5)] backdrop-blur-xl">
            <GitCompare className="h-5 w-5 text-cyan-400" />
            <span className="text-sm text-white font-medium">
              {compareIds.length} / 3 models selected
            </span>
            <button
              onClick={goToCompare}
              className="btn-primary flex items-center gap-2 rounded-lg px-4 py-2 text-sm"
            >
              Compare Now <ArrowRight className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setCompareIds([])}
              className="text-xs text-slate-500 hover:text-white transition-colors"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-white/[0.06] px-6 py-8 text-center text-sm text-slate-600">
        © 2026 OneAtlas — AI Model Intelligence Platform. Demo benchmark data for illustration only.
      </footer>
    </div>
  );
}
