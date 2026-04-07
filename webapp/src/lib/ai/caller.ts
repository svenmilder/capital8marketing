import Anthropic from "@anthropic-ai/sdk";
import {
  MODEL_CONFIG,
  TASK_MODEL_MAP,
  calculateCost,
  type ModelTier,
} from "./models";
import { checkCostBudget, trackUsage } from "./cost-tracker";

export interface AIResponse {
  content: string;
  inputTokens: number;
  outputTokens: number;
  costUsd: number;
  model: string;
  tier: ModelTier;
}

export class BudgetExhaustedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "BudgetExhaustedError";
  }
}

let anthropicClient: Anthropic | null = null;

function getAnthropicClient(): Anthropic {
  if (!anthropicClient) {
    anthropicClient = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY!,
    });
  }
  return anthropicClient;
}

export async function callAI(
  task: string,
  systemPrompt: string,
  userMessage: string,
  options?: {
    tierOverride?: ModelTier;
    maxTokens?: number;
    userId?: string;
    contentItemId?: string;
    jobName?: string;
  }
): Promise<AIResponse> {
  const tier = options?.tierOverride || TASK_MODEL_MAP[task];

  if (!tier) {
    throw new Error(`No model mapping for task: ${task}`);
  }

  if (tier === "T3_DETERMINISTIC") {
    throw new Error(
      `Task ${task} is deterministic — use the dedicated function, not callAI`
    );
  }

  // Cost budget check
  const budget = await checkCostBudget();
  if (!budget.allowed) {
    throw new BudgetExhaustedError(
      budget.reason || "AI budget exhausted"
    );
  }

  const config = MODEL_CONFIG[tier];
  const startTime = Date.now();

  try {
    let response: AIResponse;

    if (config.provider === "anthropic") {
      response = await callAnthropic(
        config.model!,
        tier,
        systemPrompt,
        userMessage,
        options?.maxTokens || config.maxTokens
      );
    } else if (config.provider === "google") {
      response = await callGemini(
        config.model!,
        tier,
        systemPrompt,
        userMessage,
        options?.maxTokens || config.maxTokens
      );
    } else {
      throw new Error(`Unknown provider: ${config.provider}`);
    }

    const latencyMs = Date.now() - startTime;

    // Track usage
    await trackUsage({
      task,
      provider: config.provider,
      model: response.model,
      tier,
      inputTokens: response.inputTokens,
      outputTokens: response.outputTokens,
      costUsd: response.costUsd,
      latencyMs,
      userId: options?.userId,
      contentItemId: options?.contentItemId,
      jobName: options?.jobName,
    });

    return response;
  } catch (error) {
    const latencyMs = Date.now() - startTime;

    // Track failed calls too
    if (!(error instanceof BudgetExhaustedError)) {
      await trackUsage({
        task,
        provider: config.provider,
        model: config.model || "unknown",
        tier,
        inputTokens: 0,
        outputTokens: 0,
        costUsd: 0,
        latencyMs,
        userId: options?.userId,
        jobName: options?.jobName,
        success: false,
        errorMessage:
          error instanceof Error ? error.message : String(error),
      });
    }

    throw error;
  }
}

async function callAnthropic(
  model: string,
  tier: ModelTier,
  systemPrompt: string,
  userMessage: string,
  maxTokens: number
): Promise<AIResponse> {
  const client = getAnthropicClient();

  const response = await client.messages.create({
    model,
    max_tokens: maxTokens,
    system: systemPrompt,
    messages: [{ role: "user", content: userMessage }],
  });

  const content =
    response.content[0].type === "text" ? response.content[0].text : "";

  const costUsd = calculateCost(
    response.usage.input_tokens,
    response.usage.output_tokens,
    tier
  );

  return {
    content,
    inputTokens: response.usage.input_tokens,
    outputTokens: response.usage.output_tokens,
    costUsd,
    model,
    tier,
  };
}

async function callGemini(
  model: string,
  tier: ModelTier,
  systemPrompt: string,
  userMessage: string,
  maxTokens: number
): Promise<AIResponse> {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": process.env.GEMINI_API_KEY!,
      },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: systemPrompt }] },
        contents: [{ parts: [{ text: userMessage }] }],
        generationConfig: { maxOutputTokens: maxTokens },
      }),
    }
  );

  const data = await response.json();

  const content =
    data.candidates?.[0]?.content?.parts?.[0]?.text || "";
  const inputTokens =
    data.usageMetadata?.promptTokenCount || 0;
  const outputTokens =
    data.usageMetadata?.candidatesTokenCount || 0;

  const costUsd = calculateCost(inputTokens, outputTokens, tier);

  return {
    content,
    inputTokens,
    outputTokens,
    costUsd,
    model,
    tier,
  };
}
