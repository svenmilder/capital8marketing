import { inngest } from "./client";

// Phase 1: placeholder function for testing Inngest connection
export const helloWorld = inngest.createFunction(
  {
    id: "hello-world",
    name: "Hello World Test",
    triggers: [{ event: "test/hello.world" }],
  },
  async ({ event, step }) => {
    await step.run("log-event", async () => {
      console.log("Inngest connected successfully:", event.data);
      return { message: "Inngest is working" };
    });
  }
);

// Phase 5: These will be implemented later
// - weekly-linkedin-batch (Sunday night)
// - daily-metrics-pull (every morning)
// - weekly-seo-recommendations (Monday 6am)
// - gsc-daily-sync (daily)
// - email-sequence-scheduler (daily)
// - sprint-goal-updater (daily)
// - onsite-seo-audit (weekly)
// - skill-performance-collector (Sunday night)
// - skill-evolution-analyzer (Monday 2am)
