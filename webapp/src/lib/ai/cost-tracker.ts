import { createClient } from "@supabase/supabase-js";
import { type ModelTier } from "./models";

const COST_CAPS = {
  daily: parseFloat(process.env.AI_DAILY_COST_CAP || "10.00"),
  monthly: parseFloat(process.env.AI_MONTHLY_COST_CAP || "150.00"),
  perCall: parseFloat(process.env.AI_PER_CALL_CAP || "0.50"),
};

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function checkCostBudget(): Promise<{
  allowed: boolean;
  remaining: number;
  reason?: string;
}> {
  const supabase = getSupabaseAdmin();
  const today = new Date().toISOString().split("T")[0];

  const { data: todayUsage } = await supabase
    .from("ai_usage")
    .select("cost_usd")
    .gte("created_at", today);

  const dailyTotal =
    todayUsage?.reduce((sum, r) => sum + Number(r.cost_usd), 0) || 0;

  if (dailyTotal >= COST_CAPS.daily) {
    return {
      allowed: false,
      remaining: 0,
      reason: `Daily budget exhausted ($${dailyTotal.toFixed(2)}/$${COST_CAPS.daily})`,
    };
  }

  return {
    allowed: true,
    remaining: COST_CAPS.daily - dailyTotal,
  };
}

export async function trackUsage(params: {
  task: string;
  provider: string;
  model: string;
  tier: ModelTier;
  inputTokens: number;
  outputTokens: number;
  costUsd: number;
  latencyMs?: number;
  jobName?: string;
  userId?: string;
  contentItemId?: string;
  success?: boolean;
  errorMessage?: string;
}) {
  const supabase = getSupabaseAdmin();

  await supabase.from("ai_usage").insert({
    task: params.task,
    provider: params.provider,
    model: params.model,
    tier: params.tier,
    input_tokens: params.inputTokens,
    output_tokens: params.outputTokens,
    cost_usd: params.costUsd,
    latency_ms: params.latencyMs,
    job_name: params.jobName,
    user_id: params.userId,
    content_item_id: params.contentItemId,
    success: params.success ?? true,
    error_message: params.errorMessage,
  });

  // Log warning if single call exceeds per-call cap
  if (params.costUsd > COST_CAPS.perCall) {
    console.warn(
      `[AI Cost Warning] Single call cost $${params.costUsd.toFixed(4)} exceeds cap $${COST_CAPS.perCall} (task: ${params.task})`
    );
  }
}
