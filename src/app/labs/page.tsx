"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Globe, ExternalLink, Cpu } from "lucide-react";
import Navbar from "@/components/Navbar";
import { PageLoader } from "@/components/LoadingStates";
import EmptyState from "@/components/EmptyState";

type Lab = {
  id: number;
  name: string;
  slug: string;
  description: string;
  website?: string | null;
  country?: string | null;
  foundedYear?: number | null;
  _count: { models: number };
  models: { id: number; name: string; slug: string; category: string; tag?: string | null }[];
};

const LAB_COLORS: Record<string, string> = {
  openai: "from-emerald-600 to-teal-700",
  anthropic: "from-orange-600 to-red-700",
  "google-deepmind": "from-blue-600 to-indigo-700",
  "meta-ai": "from-blue-500 to-cyan-600",
  "mistral-ai": "from-orange-500 to-amber-600",
  deepseek: "from-indigo-600 to-violet-700",
  xai: "from-slate-600 to-slate-800",
  "alibaba-cloud": "from-orange-500 to-red-600",
  cohere: "from-purple-600 to-indigo-700",
};

const LAB_INITIALS: Record<string, string> = {
  openai: "OAI",
  anthropic: "ANT",
  "google-deepmind": "GDM",
  "meta-ai": "META",
  "mistral-ai": "MST",
  deepseek: "DS",
  xai: "xAI",
  "alibaba-cloud": "QWEN",
  cohere: "COH",
};

export default function LabsPage() {
  const [labs, setLabs] = useState<Lab[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/labs")
      .then((r) => r.ok ? r.json() : Promise.reject())
      .then(setLabs)
      .catch(() => setError("Failed to load labs."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-[#080b12]">
      <Navbar />

      <main className="mx-auto max-w-[1100px] px-6 py-12 fade-in">
        <div className="mb-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-cyan-400">Research Labs</p>
          <h1 className="mt-2 text-4xl font-bold text-white">AI Labs Directory</h1>
          <p className="mt-2 text-slate-500 text-sm">The organizations building the AI models powering the world.</p>
        </div>

        {loading ? (
          <PageLoader />
        ) : error ? (
          <EmptyState type="server" message={error} />
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {labs.map((lab) => {
              const gradient = LAB_COLORS[lab.slug] ?? "from-cyan-700 to-teal-800";
              const initials = LAB_INITIALS[lab.slug] ?? lab.name.slice(0, 3).toUpperCase();
              return (
                <div key={lab.id} className="card flex flex-col p-6">
                  {/* Logo area */}
                  <div className="flex items-start gap-4 mb-5">
                    <div
                      className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${gradient} text-white font-bold text-sm shadow-lg`}
                    >
                      {initials}
                    </div>
                    <div className="min-w-0">
                      <h2 className="text-lg font-bold text-white truncate">{lab.name}</h2>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        {lab.country && (
                          <span className="flex items-center gap-1 text-xs text-slate-500">
                            <Globe className="h-3 w-3" />
                            {lab.country}
                          </span>
                        )}
                        {lab.foundedYear && (
                          <span className="text-xs text-slate-600">Est. {lab.foundedYear}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-slate-400 leading-relaxed line-clamp-3 flex-1">
                    {lab.description}
                  </p>

                  {/* Models */}
                  <div className="mt-5 pt-5 border-t border-white/[0.06]">
                    <div className="flex items-center gap-2 mb-3">
                      <Cpu className="h-3.5 w-3.5 text-cyan-400" />
                      <span className="text-xs font-semibold text-cyan-400">
                        {lab._count.models} Model{lab._count.models !== 1 ? "s" : ""}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {lab.models.slice(0, 4).map((m) => (
                        <Link
                          key={m.id}
                          href={`/models/${m.slug}`}
                          className="rounded-md bg-white/[0.04] px-2.5 py-1 text-xs text-slate-400 hover:text-cyan-400 hover:bg-cyan-400/5 transition-colors"
                        >
                          {m.name}
                        </Link>
                      ))}
                      {lab.models.length > 4 && (
                        <span className="rounded-md bg-white/[0.04] px-2.5 py-1 text-xs text-slate-600">
                          +{lab.models.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Website */}
                  {lab.website && (
                    <a
                      href={lab.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-cyan-400 transition-colors"
                    >
                      <ExternalLink className="h-3 w-3" />
                      Visit {lab.name}
                    </a>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>

      <footer className="border-t border-white/[0.06] px-6 py-6 text-center text-xs text-slate-600 mt-8">
        © 2026 OneAtlas — AI Model Intelligence Platform
      </footer>
    </div>
  );
}
