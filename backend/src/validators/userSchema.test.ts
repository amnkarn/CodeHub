import { describe, it, expect } from "vitest";
import { getUserParamsSchema, getTargetQuerySchema, userUpdateSchema } from "./userSchema.js";

describe("getUserParamsSchema", () => {
  it("accepts valid username", () => {
    expect(getUserParamsSchema.safeParse({ username: "johndoe" }).success).toBe(true);
  });

  it("rejects username shorter than 3 chars", () => {
    expect(getUserParamsSchema.safeParse({ username: "ab" }).success).toBe(false);
  });

  it("rejects username longer than 15 chars", () => {
    expect(getUserParamsSchema.safeParse({ username: "a".repeat(16) }).success).toBe(false);
  });

  it("rejects missing username", () => {
    expect(getUserParamsSchema.safeParse({}).success).toBe(false);
  });
});

describe("getTargetQuerySchema", () => {
  it("accepts valid target", () => {
    expect(getTargetQuerySchema.safeParse({ target: "alice" }).success).toBe(true);
  });

  it("rejects target shorter than 3 chars", () => {
    expect(getTargetQuerySchema.safeParse({ target: "ab" }).success).toBe(false);
  });

  it("rejects target longer than 15 chars", () => {
    expect(getTargetQuerySchema.safeParse({ target: "a".repeat(16) }).success).toBe(false);
  });
});

describe("userUpdateSchema", () => {
  it("accepts full update", () => {
    const result = userUpdateSchema.safeParse({
      username: "newname",
      email: "new@example.com",
      name: "New Name",
      password: "newpass123",
    });
    expect(result.success).toBe(true);
  });

  it("accepts name-only update (username, email, password optional)", () => {
    const result = userUpdateSchema.safeParse({ name: "Only Name" });
    expect(result.success).toBe(true);
  });

  it("rejects optional username shorter than 5 chars when provided", () => {
    const result = userUpdateSchema.safeParse({ name: "X", username: "ab" });
    expect(result.success).toBe(false);
  });

  it("rejects optional email with invalid format when provided", () => {
    const result = userUpdateSchema.safeParse({ name: "X", email: "bad" });
    expect(result.success).toBe(false);
  });

  it("rejects optional password shorter than 5 chars when provided", () => {
    const result = userUpdateSchema.safeParse({ name: "X", password: "ab" });
    expect(result.success).toBe(false);
  });

  it("rejects missing name", () => {
    const result = userUpdateSchema.safeParse({});
    expect(result.success).toBe(false);
  });
});
