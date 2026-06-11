import { describe, it, expect } from "vitest";
import { issueParams, createIssueSchema, issueByIdSchema, issueUpdateSchema, OnlyIssueParams } from "./issueSchema.js";

const VALID_UUID = "550e8400-e29b-41d4-a716-446655440000";

describe("issueParams", () => {
  it("accepts valid owner and repo", () => {
    expect(issueParams.safeParse({ owner: "alice", repo: "my-repo" }).success).toBe(true);
  });

  it("rejects owner longer than 30 chars", () => {
    expect(issueParams.safeParse({ owner: "a".repeat(31), repo: "repo" }).success).toBe(false);
  });

  it("rejects repo longer than 30 chars", () => {
    expect(issueParams.safeParse({ owner: "alice", repo: "r".repeat(31) }).success).toBe(false);
  });

  it("rejects missing fields", () => {
    expect(issueParams.safeParse({}).success).toBe(false);
  });
});

describe("createIssueSchema", () => {
  it("accepts valid issue data", () => {
    const result = createIssueSchema.safeParse({ title: "Bug", description: "It broke" });
    expect(result.success).toBe(true);
  });

  it("rejects missing title", () => {
    expect(createIssueSchema.safeParse({ description: "text" }).success).toBe(false);
  });

  it("rejects missing description", () => {
    expect(createIssueSchema.safeParse({ title: "Bug" }).success).toBe(false);
  });
});

describe("issueByIdSchema", () => {
  it("accepts valid params with UUID", () => {
    const result = issueByIdSchema.safeParse({
      owner: "alice",
      repo: "my-repo",
      issueId: VALID_UUID,
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid UUID", () => {
    const result = issueByIdSchema.safeParse({
      owner: "alice",
      repo: "my-repo",
      issueId: "not-a-uuid",
    });
    expect(result.success).toBe(false);
  });
});

describe("issueUpdateSchema", () => {
  it("accepts partial update with title", () => {
    expect(issueUpdateSchema.safeParse({ title: "New title" }).success).toBe(true);
  });

  it("accepts partial update with status", () => {
    expect(issueUpdateSchema.safeParse({ status: "closed" }).success).toBe(true);
  });

  it("accepts all valid statuses", () => {
    for (const status of ["open", "closed", "assigned"]) {
      expect(issueUpdateSchema.safeParse({ status }).success).toBe(true);
    }
  });

  it("rejects invalid status", () => {
    expect(issueUpdateSchema.safeParse({ status: "pending" }).success).toBe(false);
  });

  it("accepts empty object (all optional)", () => {
    expect(issueUpdateSchema.safeParse({}).success).toBe(true);
  });
});

describe("OnlyIssueParams", () => {
  it("accepts valid UUID", () => {
    expect(OnlyIssueParams.safeParse({ issueId: VALID_UUID }).success).toBe(true);
  });

  it("rejects invalid UUID", () => {
    expect(OnlyIssueParams.safeParse({ issueId: "abc" }).success).toBe(false);
  });
});
