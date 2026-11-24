"use client";

import Link from "next/link";
import { Check, Plus, ExternalLink } from "lucide-react";

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

type Props = {
  model: Model;
  selected: boolean;
  onToggleCompare: (id: number) => void;
  compareCount: number;
};

const TAG_COLORS: Record<string, string> = {
  Popular: "badge-cyan",
  Featured: "badge-purple",
  Trending: "badge-cyan",
  Value: "badge-green",
  Open: "badge-green",
  Enterprise: "badge-amber",
  Elite: "badge-purple",
  Fast: "badge-cyan",
  Reasoning: "badge-purple",
};

function formatContext(tokens: number): string {
  if (tokens >= 1_000_000) return `${tokens / 1_000_000}M`;
  if (tokens >= 1_000) return `${tokens / 1_000}K`;
  return `${tokens}`;
}

function formatPrice(price: number): string {
  if (price < 0.01) return `$${price.toFixed(4)}`;
  return `$${price.toFixed(2)}`;
}

export default function ModelCard({ model, selected, onToggleCompare, compareCount }: Props) {
  const tagClass = TAG_COLORS[model.tag ?? ""] ?? "badge-cyan";
  const canAdd = selected || compareCount < 3;

  return (
    <article className="card group flex flex-col p-6 relative overflow-hidden">
      {/* Subtle top glow on hover */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium text-cyan-400 truncate">{model.lab.name}</p>
          <h3 className="mt-1 text-lg font-bold text-white leading-tight truncate">
            {model.name}
          </h3>
        </div>
        <div className="flex flex-col items-end gap-1.5 shrink-0">
          {model.tag && (
            <span className={`badge ${tagClass}`}>{model.tag}</span>
          )}
          {model.isOpenSource && (
            <span className="badge badge-green">Open</span>
          )}
        </div>
      </div>

      {/* Description */}
      <p className="mt-4 text-sm leading-relaxed text-slate-400 line-clamp-2 flex-1">
        {model.description}
      </p>

      {/* Pricing Grid */}
      <div className="mt-5 grid grid-cols-3 gap-2 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
        <div>
          <p className="text-[10px] uppercase tracking-wide text-slate-500">Input /1M</p>
          <p className="mt-1.5 text-sm font-semibold text-white">{formatPrice(model.inputPrice)}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wide text-slate-500">Output /1M</p>
          <p className="mt-1.5 text-sm font-semibold text-white">{formatPrice(model.outputPrice)}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wide text-slate-500">Context</p>
          <p className="mt-1.5 text-sm font-semibold text-white">{formatContext(model.contextWindow)}</p>
        </div>
      </div>

      {/* Capabilities */}
      {model.capabilities.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {model.capabilities.slice(0, 4).map((cap) => (
            <span
              key={cap}
              className="rounded-md bg-white/[0.04] px-2 py-0.5 text-[10px] text-slate-400 capitalize"
            >
              {cap}
            </span>
          ))}
          {model.capabilities.length > 4 && (
            <span className="rounded-md bg-white/[0.04] px-2 py-0.5 text-[10px] text-slate-500">
              +{model.capabilities.length - 4}
            </span>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="mt-5 flex items-center gap-2">
        <Link
          href={`/models/${model.slug}`}
          className="btn-ghost flex-1 flex items-center justify-center gap-1.5 text-xs py-2"
        >
          <ExternalLink className="h-3 w-3" />
          View Details
        </Link>
        <button
          onClick={() => onToggleCompare(model.id)}
          disabled={!canAdd}
          title={!canAdd ? "Max 3 models" : selected ? "Remove from compare" : "Add to compare"}
          className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition-all ${
            selected
              ? "bg-cyan-400 text-[#071019]"
              : canAdd
              ? "btn-ghost"
              : "opacity-30 cursor-not-allowed border border-white/10 text-slate-500"
          }`}
        >
          {selected ? (
            <><Check className="h-3 w-3" /> Selected</>
          ) : (
            <><Plus className="h-3 w-3" /> Compare</>
          )}
        </button>
      </div>
    </article>
  );
}
