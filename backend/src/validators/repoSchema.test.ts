import { describe, it, expect } from "vitest";
import {
  usernameParamSchema,
  createRepoSchema,
  repoByNameSchema,
  updateRepoSchema,
  toggleVisibilitySchema,
  searchSchema,
} from "./repoSchema.js";

describe("usernameParamSchema", () => {
  it("accepts valid username", () => {
    expect(usernameParamSchema.safeParse({ username: "alice" }).success).toBe(true);
  });

  it("rejects username shorter than 3 chars", () => {
    expect(usernameParamSchema.safeParse({ username: "ab" }).success).toBe(false);
  });

  it("rejects username longer than 15 chars", () => {
    expect(usernameParamSchema.safeParse({ username: "a".repeat(16) }).success).toBe(false);
  });
});

describe("createRepoSchema", () => {
  it("accepts valid repo with default visibility", () => {
    const result = createRepoSchema.safeParse({ name: "my-repo", description: "A repo" });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.visibility).toBe("public");
    }
  });

  it("accepts explicit private visibility", () => {
    const result = createRepoSchema.safeParse({
      name: "my-repo",
      description: "A repo",
      visibility: "private",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.visibility).toBe("private");
    }
  });

  it("rejects invalid visibility", () => {
    const result = createRepoSchema.safeParse({
      name: "my-repo",
      description: "A repo",
      visibility: "internal",
    });
    expect(result.success).toBe(false);
  });

  it("rejects missing fields", () => {
    expect(createRepoSchema.safeParse({}).success).toBe(false);
    expect(createRepoSchema.safeParse({ name: "x" }).success).toBe(false);
  });
});

describe("repoByNameSchema", () => {
  it("accepts valid owner and repo", () => {
    expect(repoByNameSchema.safeParse({ owner: "alice", repo: "my-repo" }).success).toBe(true);
  });

  it("rejects owner shorter than 5 chars", () => {
    expect(repoByNameSchema.safeParse({ owner: "ab", repo: "repo" }).success).toBe(false);
  });

  it("rejects owner longer than 15 chars", () => {
    expect(repoByNameSchema.safeParse({ owner: "a".repeat(16), repo: "repo" }).success).toBe(false);
  });

  it("rejects empty repo name", () => {
    expect(repoByNameSchema.safeParse({ owner: "alice", repo: "" }).success).toBe(false);
  });
});

describe("updateRepoSchema", () => {
  it("accepts partial update with name only", () => {
    expect(updateRepoSchema.safeParse({ name: "new-name" }).success).toBe(true);
  });

  it("accepts partial update with description only", () => {
    expect(updateRepoSchema.safeParse({ description: "new desc" }).success).toBe(true);
  });

  it("accepts empty object (both optional)", () => {
    expect(updateRepoSchema.safeParse({}).success).toBe(true);
  });
});

describe("toggleVisibilitySchema", () => {
  it("accepts public", () => {
    expect(toggleVisibilitySchema.safeParse({ visibility: "public" }).success).toBe(true);
  });

  it("accepts private", () => {
    expect(toggleVisibilitySchema.safeParse({ visibility: "private" }).success).toBe(true);
  });

  it("rejects invalid visibility", () => {
    expect(toggleVisibilitySchema.safeParse({ visibility: "internal" }).success).toBe(false);
  });

  it("rejects missing visibility", () => {
    expect(toggleVisibilitySchema.safeParse({}).success).toBe(false);
  });
});

describe("searchSchema", () => {
  it("accepts valid search input", () => {
    expect(searchSchema.safeParse({ input: "react" }).success).toBe(true);
  });

  it("rejects input longer than 50 chars", () => {
    expect(searchSchema.safeParse({ input: "a".repeat(51) }).success).toBe(false);
  });

  it("rejects missing input", () => {
    expect(searchSchema.safeParse({}).success).toBe(false);
  });
});
