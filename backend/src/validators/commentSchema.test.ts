import { describe, it, expect } from "vitest";
import { addCommentParams, addCommentSchema, deleteCommentParams } from "./commentSchema.js";

const VALID_UUID = "550e8400-e29b-41d4-a716-446655440000";
const VALID_UUID_2 = "660e8400-e29b-41d4-a716-446655440000";

describe("addCommentParams", () => {
  it("accepts valid params", () => {
    const result = addCommentParams.safeParse({
      owner: "alice",
      repo: "my-repo",
      issueId: VALID_UUID,
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid issueId", () => {
    const result = addCommentParams.safeParse({
      owner: "alice",
      repo: "my-repo",
      issueId: "not-uuid",
    });
    expect(result.success).toBe(false);
  });

  it("rejects missing owner", () => {
    const result = addCommentParams.safeParse({
      repo: "my-repo",
      issueId: VALID_UUID,
    });
    expect(result.success).toBe(false);
  });
});

describe("addCommentSchema", () => {
  it("accepts valid comment", () => {
    expect(addCommentSchema.safeParse({ comment: "Nice work!" }).success).toBe(true);
  });

  it("rejects missing comment", () => {
    expect(addCommentSchema.safeParse({}).success).toBe(false);
  });
});

describe("deleteCommentParams", () => {
  it("accepts valid params", () => {
    const result = deleteCommentParams.safeParse({
      owner: "alice",
      repo: "my-repo",
      issueId: VALID_UUID,
      commentId: VALID_UUID_2,
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid commentId", () => {
    const result = deleteCommentParams.safeParse({
      owner: "alice",
      repo: "my-repo",
      issueId: VALID_UUID,
      commentId: "bad",
    });
    expect(result.success).toBe(false);
  });

  it("rejects missing issueId", () => {
    const result = deleteCommentParams.safeParse({
      owner: "alice",
      repo: "my-repo",
      commentId: VALID_UUID_2,
    });
    expect(result.success).toBe(false);
  });
});
