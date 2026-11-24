import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding OneAtlas database...");

  // ── Labs ──────────────────────────────────────────────────────────────────
  const labsData = [
    {
      name: "OpenAI",
      slug: "openai",
      description:
        "OpenAI is an AI research laboratory known for the GPT series and ChatGPT, pioneering large language models and AI safety research.",
      website: "https://openai.com",
      country: "USA",
      foundedYear: 2015,
    },
    {
      name: "Anthropic",
      slug: "anthropic",
      description:
        "Anthropic is an AI safety company building reliable, interpretable, and steerable AI systems. Creator of the Claude model family.",
      website: "https://anthropic.com",
      country: "USA",
      foundedYear: 2021,
    },
    {
      name: "Google DeepMind",
      slug: "google-deepmind",
      description:
        "Google DeepMind combines world-leading AI research with Google's compute and product integration, creating models like Gemini.",
      website: "https://deepmind.google",
      country: "USA",
      foundedYear: 2010,
    },
    {
      name: "Meta AI",
      slug: "meta-ai",
      description:
        "Meta AI develops open-source AI models including the Llama family, advancing accessible and open AI for the community.",
      website: "https://ai.meta.com",
      country: "USA",
      foundedYear: 2013,
    },
    {
      name: "Mistral AI",
      slug: "mistral-ai",
      description:
        "Mistral AI is a French AI company building efficient, multilingual open-weight and commercial models for enterprise use.",
      website: "https://mistral.ai",
      country: "France",
      foundedYear: 2023,
    },
    {
      name: "DeepSeek",
      slug: "deepseek",
      description:
        "DeepSeek is a Chinese AI lab focused on reasoning and coding models, known for cost-efficient high-performance models.",
      website: "https://deepseek.com",
      country: "China",
      foundedYear: 2023,
    },
    {
      name: "xAI",
      slug: "xai",
      description:
        "xAI is Elon Musk's AI company developing the Grok series of large language models with real-time internet access.",
      website: "https://x.ai",
      country: "USA",
      foundedYear: 2023,
    },
    {
      name: "Alibaba Cloud",
      slug: "alibaba-cloud",
      description:
        "Alibaba Cloud develops the Qwen series of open and commercial large language models supporting Chinese and multilingual tasks.",
      website: "https://qwenlm.github.io",
      country: "China",
      foundedYear: 2009,
    },
    {
      name: "Cohere",
      slug: "cohere",
      description:
        "Cohere builds large language models designed for enterprise NLP, specializing in search, classification, and generation APIs.",
      website: "https://cohere.com",
      country: "Canada",
      foundedYear: 2019,
    },
  ];

  const labs: Record<string, number> = {};
  for (const lab of labsData) {
    const created = await prisma.lab.upsert({
      where: { slug: lab.slug },
      update: lab,
      create: lab,
    });
    labs[lab.slug] = created.id;
    console.log(`  ✅ Lab: ${lab.name}`);
  }

  // ── Providers ─────────────────────────────────────────────────────────────
  const providersData = [
    {
      name: "OpenAI API",
      slug: "openai-api",
      description:
        "OpenAI's official API offering GPT-4, o-series, and embedding models for production use.",
      website: "https://platform.openai.com",
      capabilities: ["chat", "completion", "embeddings", "vision", "audio"],
    },
    {
      name: "Anthropic API",
      slug: "anthropic-api",
      description:
        "Anthropic's Claude API for enterprise-grade AI with strong safety guarantees.",
      website: "https://console.anthropic.com",
      capabilities: ["chat", "vision", "tool-use", "long-context"],
    },
    {
      name: "Google AI Studio",
      slug: "google-ai-studio",
      description:
        "Google's unified API for Gemini models with multimodal and long-context support.",
      website: "https://aistudio.google.com",
      capabilities: ["chat", "vision", "audio", "code", "long-context"],
    },
    {
      name: "Together AI",
      slug: "together-ai",
      description:
        "Together AI provides fast inference for open-source models including Llama, Mistral, and more.",
      website: "https://together.ai",
      capabilities: ["chat", "completion", "vision", "embeddings"],
    },
    {
      name: "Groq",
      slug: "groq",
      description:
        "Groq delivers ultra-fast LLM inference using custom LPU hardware for open-source models.",
      website: "https://groq.com",
      capabilities: ["chat", "completion", "ultra-fast-inference"],
    },
    {
      name: "OpenRouter",
      slug: "openrouter",
      description:
        "OpenRouter is a unified API gateway providing access to hundreds of AI models from multiple providers.",
      website: "https://openrouter.ai",
      capabilities: [
        "chat",
        "completion",
        "vision",
        "routing",
        "cost-optimization",
      ],
    },
  ];

  const providers: Record<string, number> = {};
  for (const provider of providersData) {
    const created = await prisma.provider.upsert({
      where: { slug: provider.slug },
      update: provider,
      create: provider,
    });
    providers[provider.slug] = created.id;
    console.log(`  ✅ Provider: ${provider.name}`);
  }

  // ── Benchmarks ────────────────────────────────────────────────────────────
  const benchmarksData = [
    {
      name: "MMLU",
      slug: "mmlu",
      description:
        "Massive Multitask Language Understanding — 57 subjects including STEM, humanities, and social sciences.",
      category: "general",
      maxScore: 100,
    },
    {
      name: "HumanEval",
      slug: "humaneval",
      description:
        "OpenAI's coding benchmark testing ability to write correct Python functions from docstrings.",
      category: "coding",
      maxScore: 100,
    },
    {
      name: "MATH",
      slug: "math",
      description:
        "Competition mathematics benchmark covering algebra, geometry, calculus and more.",
      category: "math",
      maxScore: 100,
    },
    {
      name: "GPQA Diamond",
      slug: "gpqa-diamond",
      description:
        "Graduate-level Google-Proof Q&A — expert-level science questions difficult even for PhD holders.",
      category: "reasoning",
      maxScore: 100,
    },
    {
      name: "SWE-bench Verified",
      slug: "swe-bench-verified",
      description:
        "Real-world software engineering tasks from GitHub issues requiring code changes to pass tests.",
      category: "coding",
      maxScore: 100,
    },
  ];

  const benchmarks: Record<string, number> = {};
  for (const benchmark of benchmarksData) {
    const created = await prisma.benchmark.upsert({
      where: { slug: benchmark.slug },
      update: benchmark,
      create: benchmark,
    });
    benchmarks[benchmark.slug] = created.id;
    console.log(`  ✅ Benchmark: ${benchmark.name}`);
  }

  // ── AI Models ─────────────────────────────────────────────────────────────
  const modelsData = [
    {
      name: "GPT-4.1",
      slug: "gpt-4-1",
      description:
        "OpenAI's flagship model with exceptional performance on coding, instruction following, and long-context tasks. Features a 1M token context window.",
      category: "Chat",
      inputPrice: 2.0,
      outputPrice: 8.0,
      contextWindow: 1_000_000,
      releaseDate: new Date("2025-04-14"),
      capabilities: ["coding", "reasoning", "instruction-following", "analysis"],
      modalities: ["text", "image"],
      isOpenSource: false,
      tag: "Popular",
      labSlug: "openai",
      providerSlugs: ["openai-api", "openrouter"],
      scores: { mmlu: 90.2, humaneval: 92.1, math: 86.4, "gpqa-diamond": 78.3, "swe-bench-verified": 54.6 },
    },
    {
      name: "GPT-4o",
      slug: "gpt-4o",
      description:
        "OpenAI's omni model combining text, vision, and audio capabilities in a single efficient model optimized for real-world use.",
      category: "Multimodal",
      inputPrice: 2.5,
      outputPrice: 10.0,
      contextWindow: 128_000,
      releaseDate: new Date("2024-05-13"),
      capabilities: ["vision", "audio", "coding", "reasoning", "tool-use"],
      modalities: ["text", "image", "audio"],
      isOpenSource: false,
      tag: "Featured",
      labSlug: "openai",
      providerSlugs: ["openai-api", "openrouter"],
      scores: { mmlu: 88.7, humaneval: 90.2, math: 76.6, "gpqa-diamond": 53.6, "swe-bench-verified": 49.0 },
    },
    {
      name: "GPT-4o mini",
      slug: "gpt-4o-mini",
      description:
        "OpenAI's cost-efficient small model delivering strong performance for routine tasks at a fraction of the cost of GPT-4o.",
      category: "Chat",
      inputPrice: 0.15,
      outputPrice: 0.6,
      contextWindow: 128_000,
      releaseDate: new Date("2024-07-18"),
      capabilities: ["coding", "reasoning", "instruction-following"],
      modalities: ["text", "image"],
      isOpenSource: false,
      tag: "Value",
      labSlug: "openai",
      providerSlugs: ["openai-api", "openrouter"],
      scores: { mmlu: 82.0, humaneval: 87.2, math: 70.2, "gpqa-diamond": 40.2, "swe-bench-verified": 29.2 },
    },
    {
      name: "Claude Sonnet 4",
      slug: "claude-sonnet-4",
      description:
        "Anthropic's most intelligent model balancing capability and speed. Excels at coding, writing, complex analysis, and agentic tasks.",
      category: "Chat",
      inputPrice: 3.0,
      outputPrice: 15.0,
      contextWindow: 200_000,
      releaseDate: new Date("2025-07-09"),
      capabilities: ["coding", "reasoning", "analysis", "tool-use", "agentic"],
      modalities: ["text", "image"],
      isOpenSource: false,
      tag: "Featured",
      labSlug: "anthropic",
      providerSlugs: ["anthropic-api", "openrouter"],
      scores: { mmlu: 90.8, humaneval: 93.7, math: 89.1, "gpqa-diamond": 83.3, "swe-bench-verified": 72.7 },
    },
    {
      name: "Claude 3.5 Haiku",
      slug: "claude-3-5-haiku",
      description:
        "Anthropic's fastest and most compact model, optimized for high-throughput tasks with strong reasoning at low latency.",
      category: "Chat",
      inputPrice: 0.8,
      outputPrice: 4.0,
      contextWindow: 200_000,
      releaseDate: new Date("2024-11-04"),
      capabilities: ["coding", "instruction-following", "analysis", "tool-use"],
      modalities: ["text", "image"],
      isOpenSource: false,
      tag: "Fast",
      labSlug: "anthropic",
      providerSlugs: ["anthropic-api", "openrouter"],
      scores: { mmlu: 83.0, humaneval: 88.4, math: 78.6, "gpqa-diamond": 55.0, "swe-bench-verified": 40.6 },
    },
    {
      name: "Claude Opus 4",
      slug: "claude-opus-4",
      description:
        "Anthropic's most powerful model for the most complex tasks, with exceptional reasoning, coding, and research capabilities.",
      category: "Chat",
      inputPrice: 15.0,
      outputPrice: 75.0,
      contextWindow: 200_000,
      releaseDate: new Date("2025-07-09"),
      capabilities: ["coding", "reasoning", "research", "tool-use", "agentic", "long-context"],
      modalities: ["text", "image"],
      isOpenSource: false,
      tag: "Elite",
      labSlug: "anthropic",
      providerSlugs: ["anthropic-api", "openrouter"],
      scores: { mmlu: 92.0, humaneval: 95.1, math: 91.8, "gpqa-diamond": 86.8, "swe-bench-verified": 79.4 },
    },
    {
      name: "Gemini 2.5 Pro",
      slug: "gemini-2-5-pro",
      description:
        "Google DeepMind's most capable model with advanced reasoning and multimodal understanding across text, image, audio, and video.",
      category: "Multimodal",
      inputPrice: 1.25,
      outputPrice: 10.0,
      contextWindow: 1_000_000,
      releaseDate: new Date("2025-03-25"),
      capabilities: ["reasoning", "vision", "audio", "coding", "long-context", "tool-use"],
      modalities: ["text", "image", "audio", "video"],
      isOpenSource: false,
      tag: "Trending",
      labSlug: "google-deepmind",
      providerSlugs: ["google-ai-studio", "openrouter"],
      scores: { mmlu: 91.0, humaneval: 93.0, math: 91.5, "gpqa-diamond": 84.0, "swe-bench-verified": 63.2 },
    },
    {
      name: "Gemini 1.5 Flash",
      slug: "gemini-1-5-flash",
      description:
        "Google's fast and efficient model with a 1M token context window, designed for high-volume tasks at low cost.",
      category: "Chat",
      inputPrice: 0.075,
      outputPrice: 0.3,
      contextWindow: 1_000_000,
      releaseDate: new Date("2024-05-24"),
      capabilities: ["vision", "long-context", "coding", "instruction-following"],
      modalities: ["text", "image", "audio", "video"],
      isOpenSource: false,
      tag: "Value",
      labSlug: "google-deepmind",
      providerSlugs: ["google-ai-studio", "openrouter"],
      scores: { mmlu: 78.9, humaneval: 74.3, math: 71.7, "gpqa-diamond": 47.2, "swe-bench-verified": 25.8 },
    },
    {
      name: "Llama 4 Maverick",
      slug: "llama-4-maverick",
      description:
        "Meta's open-weight multimodal model with a 1M context window combining efficiency with strong performance across text and vision tasks.",
      category: "Multimodal",
      inputPrice: 0.27,
      outputPrice: 0.85,
      contextWindow: 1_000_000,
      releaseDate: new Date("2025-04-05"),
      capabilities: ["vision", "coding", "long-context", "tool-use"],
      modalities: ["text", "image"],
      isOpenSource: true,
      tag: "Open",
      labSlug: "meta-ai",
      providerSlugs: ["together-ai", "groq", "openrouter"],
      scores: { mmlu: 85.5, humaneval: 85.0, math: 79.4, "gpqa-diamond": 56.2, "swe-bench-verified": 38.4 },
    },
    {
      name: "Llama 3.3 70B",
      slug: "llama-3-3-70b",
      description:
        "Meta's latest 70B open-source model with competitive performance to much larger models, ideal for cost-effective inference.",
      category: "Chat",
      inputPrice: 0.23,
      outputPrice: 0.4,
      contextWindow: 128_000,
      releaseDate: new Date("2024-12-06"),
      capabilities: ["coding", "instruction-following", "reasoning"],
      modalities: ["text"],
      isOpenSource: true,
      tag: "Open",
      labSlug: "meta-ai",
      providerSlugs: ["together-ai", "groq", "openrouter"],
      scores: { mmlu: 86.0, humaneval: 83.6, math: 77.7, "gpqa-diamond": 50.5, "swe-bench-verified": 33.5 },
    },
    {
      name: "DeepSeek R1",
      slug: "deepseek-r1",
      description:
        "DeepSeek's reasoning-focused model using chain-of-thought inference for solving complex mathematical and logical problems.",
      category: "Reasoning",
      inputPrice: 0.55,
      outputPrice: 2.19,
      contextWindow: 128_000,
      releaseDate: new Date("2025-01-20"),
      capabilities: ["reasoning", "math", "coding", "chain-of-thought"],
      modalities: ["text"],
      isOpenSource: true,
      tag: "Reasoning",
      labSlug: "deepseek",
      providerSlugs: ["together-ai", "openrouter"],
      scores: { mmlu: 90.8, humaneval: 92.9, math: 97.3, "gpqa-diamond": 71.5, "swe-bench-verified": 49.2 },
    },
    {
      name: "DeepSeek V3",
      slug: "deepseek-v3",
      description:
        "DeepSeek's most capable general-purpose model, rivaling frontier models at a fraction of the API cost.",
      category: "Chat",
      inputPrice: 0.27,
      outputPrice: 1.1,
      contextWindow: 128_000,
      releaseDate: new Date("2024-12-26"),
      capabilities: ["coding", "reasoning", "instruction-following", "analysis"],
      modalities: ["text"],
      isOpenSource: true,
      tag: "Value",
      labSlug: "deepseek",
      providerSlugs: ["together-ai", "openrouter"],
      scores: { mmlu: 88.5, humaneval: 91.6, math: 90.2, "gpqa-diamond": 68.4, "swe-bench-verified": 42.0 },
    },
    {
      name: "Mistral Large 2",
      slug: "mistral-large-2",
      description:
        "Mistral's top-tier model delivering strong multilingual performance, coding ability, and function calling for enterprise applications.",
      category: "Chat",
      inputPrice: 2.0,
      outputPrice: 6.0,
      contextWindow: 128_000,
      releaseDate: new Date("2024-07-24"),
      capabilities: ["coding", "multilingual", "tool-use", "instruction-following"],
      modalities: ["text"],
      isOpenSource: false,
      tag: "Enterprise",
      labSlug: "mistral-ai",
      providerSlugs: ["openrouter"],
      scores: { mmlu: 84.0, humaneval: 87.9, math: 76.4, "gpqa-diamond": 52.0, "swe-bench-verified": 32.4 },
    },
    {
      name: "Mixtral 8x22B",
      slug: "mixtral-8x22b",
      description:
        "Mistral's open-weight mixture-of-experts model combining 8 expert networks for strong performance at efficient inference cost.",
      category: "Chat",
      inputPrice: 0.65,
      outputPrice: 0.65,
      contextWindow: 65_000,
      releaseDate: new Date("2024-04-17"),
      capabilities: ["coding", "multilingual", "reasoning"],
      modalities: ["text"],
      isOpenSource: true,
      tag: "Open",
      labSlug: "mistral-ai",
      providerSlugs: ["together-ai", "groq", "openrouter"],
      scores: { mmlu: 77.8, humaneval: 75.6, math: 68.2, "gpqa-diamond": 45.0, "swe-bench-verified": 28.4 },
    },
    {
      name: "Grok 3",
      slug: "grok-3",
      description:
        "xAI's latest model with real-time internet access and strong reasoning, trained on X data with up-to-date world knowledge.",
      category: "Chat",
      inputPrice: 3.0,
      outputPrice: 15.0,
      contextWindow: 131_072,
      releaseDate: new Date("2025-02-18"),
      capabilities: ["reasoning", "real-time-search", "coding", "analysis"],
      modalities: ["text", "image"],
      isOpenSource: false,
      tag: "Trending",
      labSlug: "xai",
      providerSlugs: ["openrouter"],
      scores: { mmlu: 87.5, humaneval: 88.3, math: 85.2, "gpqa-diamond": 72.3, "swe-bench-verified": 45.8 },
    },
    {
      name: "Qwen2.5 72B",
      slug: "qwen-2-5-72b",
      description:
        "Alibaba Cloud's flagship open-weight model excelling at multilingual tasks, coding, and math with strong Chinese language support.",
      category: "Chat",
      inputPrice: 0.4,
      outputPrice: 0.4,
      contextWindow: 128_000,
      releaseDate: new Date("2024-09-19"),
      capabilities: ["multilingual", "coding", "math", "reasoning"],
      modalities: ["text"],
      isOpenSource: true,
      tag: "Open",
      labSlug: "alibaba-cloud",
      providerSlugs: ["together-ai", "openrouter"],
      scores: { mmlu: 86.1, humaneval: 86.9, math: 85.6, "gpqa-diamond": 55.2, "swe-bench-verified": 35.6 },
    },
    {
      name: "Command R+",
      slug: "command-r-plus",
      description:
        "Cohere's enterprise model with native RAG capabilities, strong tool use, and multilingual support across 10+ languages.",
      category: "Chat",
      inputPrice: 2.5,
      outputPrice: 10.0,
      contextWindow: 128_000,
      releaseDate: new Date("2024-04-04"),
      capabilities: ["rag", "tool-use", "multilingual", "instruction-following"],
      modalities: ["text"],
      isOpenSource: false,
      tag: "Enterprise",
      labSlug: "cohere",
      providerSlugs: ["openrouter"],
      scores: { mmlu: 75.7, humaneval: 72.4, math: 61.9, "gpqa-diamond": 38.4, "swe-bench-verified": 24.8 },
    },
    {
      name: "o3",
      slug: "o3",
      description:
        "OpenAI's most advanced reasoning model with extended thinking capabilities for tackling the hardest scientific and mathematical problems.",
      category: "Reasoning",
      inputPrice: 10.0,
      outputPrice: 40.0,
      contextWindow: 200_000,
      releaseDate: new Date("2025-04-16"),
      capabilities: ["reasoning", "math", "science", "coding", "extended-thinking"],
      modalities: ["text", "image"],
      isOpenSource: false,
      tag: "Elite",
      labSlug: "openai",
      providerSlugs: ["openai-api", "openrouter"],
      scores: { mmlu: 92.3, humaneval: 97.5, math: 97.9, "gpqa-diamond": 88.0, "swe-bench-verified": 71.7 },
    },
    {
      name: "o4-mini",
      slug: "o4-mini",
      description:
        "OpenAI's efficient small reasoning model delivering frontier reasoning performance at significantly lower cost than o3.",
      category: "Reasoning",
      inputPrice: 1.1,
      outputPrice: 4.4,
      contextWindow: 200_000,
      releaseDate: new Date("2025-04-16"),
      capabilities: ["reasoning", "math", "coding", "extended-thinking"],
      modalities: ["text", "image"],
      isOpenSource: false,
      tag: "Popular",
      labSlug: "openai",
      providerSlugs: ["openai-api", "openrouter"],
      scores: { mmlu: 90.0, humaneval: 93.0, math: 96.4, "gpqa-diamond": 81.4, "swe-bench-verified": 68.1 },
    },
    {
      name: "Gemini 2.0 Flash",
      slug: "gemini-2-0-flash",
      description:
        "Google's fast multimodal model with real-time capabilities, native tool use, and efficient performance for high-volume applications.",
      category: "Multimodal",
      inputPrice: 0.1,
      outputPrice: 0.4,
      contextWindow: 1_000_000,
      releaseDate: new Date("2025-01-30"),
      capabilities: ["vision", "audio", "real-time", "tool-use", "long-context"],
      modalities: ["text", "image", "audio", "video"],
      isOpenSource: false,
      tag: "Fast",
      labSlug: "google-deepmind",
      providerSlugs: ["google-ai-studio", "openrouter"],
      scores: { mmlu: 85.0, humaneval: 82.5, math: 84.9, "gpqa-diamond": 62.1, "swe-bench-verified": 42.9 },
    },
  ];

  for (const modelData of modelsData) {
    const { labSlug, providerSlugs, scores, ...modelFields } = modelData;

    const model = await prisma.aIModel.upsert({
      where: { slug: modelFields.slug },
      update: { ...modelFields, labId: labs[labSlug] },
      create: { ...modelFields, labId: labs[labSlug] },
    });

    // Link to providers
    for (const providerSlug of providerSlugs) {
      const providerId = providers[providerSlug];
      if (providerId) {
        await prisma.providerModel.upsert({
          where: { providerId_modelId: { providerId, modelId: model.id } },
          update: {},
          create: { providerId, modelId: model.id },
        });
      }
    }

    // Create benchmark scores
    for (const [benchSlug, score] of Object.entries(scores)) {
      const benchmarkId = benchmarks[benchSlug];
      if (benchmarkId) {
        await prisma.benchmarkScore.upsert({
          where: { modelId_benchmarkId: { modelId: model.id, benchmarkId } },
          update: { score, isDemo: true },
          create: { modelId: model.id, benchmarkId, score, isDemo: true },
        });
      }
    }

    console.log(`  ✅ Model: ${modelFields.name}`);
  }

  console.log("\n✨ Database seeded successfully!");
  console.log(`   Labs: ${labsData.length}`);
  console.log(`   Providers: ${providersData.length}`);
  console.log(`   Benchmarks: ${benchmarksData.length}`);
  console.log(`   Models: ${modelsData.length}`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
