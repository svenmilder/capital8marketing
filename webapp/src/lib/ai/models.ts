export type ModelTier = "T1_FLAGSHIP" | "T2_FAST" | "T3_DETERMINISTIC" | "T4_EXTERNAL";

export interface ModelConfig {
  provider: "anthropic" | "google" | "none";
  model: string | null;
  maxTokens: number;
  costPer1MInput: number;
  costPer1MOutput: number;
}

export const MODEL_CONFIG: Record<ModelTier, ModelConfig> = {
  T1_FLAGSHIP: {
    provider: "anthropic",
    model: "claude-sonnet-4-20250514",
    maxTokens: 4096,
    costPer1MInput: 3.0,
    costPer1MOutput: 15.0,
  },
  T2_FAST: {
    provider: "anthropic",
    model: "claude-3-5-haiku-20241022",
    maxTokens: 4096,
    costPer1MInput: 0.8,
    costPer1MOutput: 4.0,
  },
  T3_DETERMINISTIC: {
    provider: "none",
    model: null,
    maxTokens: 0,
    costPer1MInput: 0,
    costPer1MOutput: 0,
  },
  T4_EXTERNAL: {
    provider: "google",
    model: "gemini-2.0-flash",
    maxTokens: 4096,
    costPer1MInput: 0.1,
    costPer1MOutput: 0.4,
  },
} as const;

// Task-to-model mapping — every AI call in the system
export const TASK_MODEL_MAP: Record<string, ModelTier> = {
  // T1 — Goes to market or needs deep reasoning
  "content.linkedin.generate": "T1_FLAGSHIP",
  "content.linkedin.batch": "T1_FLAGSHIP",
  "content.blog.generate": "T1_FLAGSHIP",
  "content.email.generate": "T1_FLAGSHIP",
  "content.video.generate": "T1_FLAGSHIP",
  "seo.programmatic.generate": "T1_FLAGSHIP",
  "content.overnight.batch": "T1_FLAGSHIP",
  "skills.recommendation.generate": "T1_FLAGSHIP",

  // T2 — Internal analysis, short-form, template-driven
  "content.instagram.caption": "T2_FAST",
  "content.carousel.slides": "T2_FAST",
  "content.youtube.thumbnail_text": "T2_FAST",
  "content.research.analyze": "T2_FAST",
  "content.edit.expand": "T2_FAST",
  "content.edit.rewrite": "T2_FAST",
  "content.topics.suggest": "T2_FAST",
  "seo.section.generate": "T2_FAST",
  "seo.recommendations.weekly": "T2_FAST",
  "seo.meta.generate": "T2_FAST",
  "dashboard.metric.summarize": "T2_FAST",
  "content.calendar.plan": "T2_FAST",
  "skills.performance.analyze": "T2_FAST",
  "skills.impact.predict": "T2_FAST",

  // T3 — No LLM needed
  "compliance.check": "T3_DETERMINISTIC",
  "seo.citation.check": "T3_DETERMINISTIC",
  "seo.schema.generate": "T3_DETERMINISTIC",
  "email.trigger.evaluate": "T3_DETERMINISTIC",
  "data.freshness.check": "T3_DETERMINISTIC",

  // T4 — Bulk extraction, low stakes
  "content.competitive.research": "T4_EXTERNAL",
  "seo.readability.audit": "T4_EXTERNAL",
  "seo.keywords.cluster": "T4_EXTERNAL",
};

export function calculateCost(
  inputTokens: number,
  outputTokens: number,
  tier: ModelTier
): number {
  const config = MODEL_CONFIG[tier];
  return (
    (inputTokens / 1_000_000) * config.costPer1MInput +
    (outputTokens / 1_000_000) * config.costPer1MOutput
  );
}
