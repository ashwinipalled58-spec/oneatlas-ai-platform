"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ExternalLink, Cpu, Shield } from "lucide-react";
import Navbar from "@/components/Navbar";
import { PageLoader } from "@/components/LoadingStates";
import EmptyState from "@/components/EmptyState";

type Provider = {
  id: number;
  name: string;
  slug: string;
  description: string;
  website?: string | null;
  capabilities: string[];
  modelCount: number;
  models: { id: number; name: string; slug: string; category: string }[];
};

const PROVIDER_COLORS: Record<string, string> = {
  "openai-api": "from-emerald-500 to-teal-600",
  "anthropic-api": "from-orange-500 to-red-600",
  "google-ai-studio": "from-blue-500 to-indigo-600",
  "together-ai": "from-purple-500 to-violet-600",
  groq: "from-cyan-500 to-sky-600",
  openrouter: "from-rose-500 to-pink-600",
};

export default function ProvidersPage() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/providers")
      .then((r) => r.ok ? r.json() : Promise.reject())
      .then(setProviders)
      .catch(() => setError("Failed to load providers."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-[#080b12]">
      <Navbar />

      <main className="mx-auto max-w-[1100px] px-6 py-12 fade-in">
        <div className="mb-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-cyan-400">API Providers</p>
          <h1 className="mt-2 text-4xl font-bold text-white">Provider Directory</h1>
          <p className="mt-2 text-slate-500 text-sm">
            APIs and platforms that give you access to AI models.
          </p>
        </div>

        {loading ? (
          <PageLoader />
        ) : error ? (
          <EmptyState type="server" message={error} />
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {providers.map((provider) => {
              const gradient = PROVIDER_COLORS[provider.slug] ?? "from-cyan-700 to-teal-800";
              return (
                <div key={provider.id} className="card flex flex-col p-6">
                  {/* Header */}
                  <div className="flex items-start gap-4 mb-5">
                    <div
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} text-white font-bold text-xs shadow-lg`}
                    >
                      {provider.name.slice(0, 3).toUpperCase()}
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-white">{provider.name}</h2>
                      <div className="flex items-center gap-1.5 mt-1">
                        <Cpu className="h-3 w-3 text-cyan-400" />
                        <span className="text-xs text-cyan-400 font-medium">{provider.modelCount} models</span>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-slate-400 leading-relaxed">{provider.description}</p>

                  {/* Capabilities */}
                  <div className="mt-5">
                    <div className="flex items-center gap-2 mb-3">
                      <Shield className="h-3.5 w-3.5 text-slate-500" />
                      <span className="text-xs text-slate-500 font-medium uppercase tracking-wide">Capabilities</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {provider.capabilities.map((cap) => (
                        <span
                          key={cap}
                          className="rounded-md bg-white/[0.04] px-2.5 py-1 text-xs text-slate-400 capitalize"
                        >
                          {cap}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Models */}
                  {provider.models.length > 0 && (
                    <div className="mt-5 pt-5 border-t border-white/[0.06]">
                      <p className="text-xs text-slate-500 font-medium uppercase tracking-wide mb-3">Available Models</p>
                      <div className="flex flex-wrap gap-1.5">
                        {provider.models.slice(0, 5).map((m) => (
                          <Link
                            key={m.id}
                            href={`/models/${m.slug}`}
                            className="rounded-md bg-white/[0.04] px-2.5 py-1 text-xs text-slate-400 hover:text-cyan-400 hover:bg-cyan-400/5 transition-colors"
                          >
                            {m.name}
                          </Link>
                        ))}
                        {provider.models.length > 5 && (
                          <span className="rounded-md bg-white/[0.04] px-2.5 py-1 text-xs text-slate-600">
                            +{provider.models.length - 5} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Website */}
                  {provider.website && (
                    <a
                      href={provider.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-5 inline-flex items-center gap-2 rounded-lg border border-white/[0.08] px-4 py-2 text-xs text-slate-400 hover:border-cyan-400/30 hover:text-cyan-400 transition-colors self-start"
                    >
                      <ExternalLink className="h-3 w-3" />
                      Visit {provider.name}
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
