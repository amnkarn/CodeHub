import { describe, it, expect } from "vitest";
import { forkParamsSchema } from "./forkSchema.js";

describe("forkParamsSchema", () => {
  it("accepts valid owner and repo", () => {
    const result = forkParamsSchema.safeParse({ owner: "alice", repo: "my-repo" });
    expect(result.success).toBe(true);
  });

  it("rejects missing owner", () => {
    expect(forkParamsSchema.safeParse({ repo: "my-repo" }).success).toBe(false);
  });

  it("rejects missing repo", () => {
    expect(forkParamsSchema.safeParse({ owner: "alice" }).success).toBe(false);
  });

  it("rejects empty object", () => {
    expect(forkParamsSchema.safeParse({}).success).toBe(false);
  });
});
