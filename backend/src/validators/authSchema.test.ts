import { describe, it, expect } from "vitest";
import { registerSchema, loginSchema } from "./authSchema.js";

describe("registerSchema", () => {
  it("accepts valid input", () => {
    const result = registerSchema.safeParse({
      username: "johndoe",
      email: "john@example.com",
      name: "John Doe",
      password: "secret123",
    });
    expect(result.success).toBe(true);
  });

  it("rejects username shorter than 5 chars", () => {
    const result = registerSchema.safeParse({
      username: "ab",
      email: "john@example.com",
      name: "John",
      password: "secret123",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid email", () => {
    const result = registerSchema.safeParse({
      username: "johndoe",
      email: "not-an-email",
      name: "John",
      password: "secret123",
    });
    expect(result.success).toBe(false);
  });

  it("rejects password shorter than 5 chars", () => {
    const result = registerSchema.safeParse({
      username: "johndoe",
      email: "john@example.com",
      name: "John",
      password: "abc",
    });
    expect(result.success).toBe(false);
  });

  it("rejects missing name", () => {
    const result = registerSchema.safeParse({
      username: "johndoe",
      email: "john@example.com",
      password: "secret123",
    });
    expect(result.success).toBe(false);
  });

  it("rejects empty object", () => {
    const result = registerSchema.safeParse({});
    expect(result.success).toBe(false);
  });
});

describe("loginSchema", () => {
  it("accepts valid input", () => {
    const result = loginSchema.safeParse({
      username: "johndoe",
      password: "secret123",
    });
    expect(result.success).toBe(true);
  });

  it("rejects username shorter than 5 chars", () => {
    const result = loginSchema.safeParse({
      username: "ab",
      password: "secret123",
    });
    expect(result.success).toBe(false);
  });

  it("rejects password shorter than 5 chars", () => {
    const result = loginSchema.safeParse({
      username: "johndoe",
      password: "ab",
    });
    expect(result.success).toBe(false);
  });

  it("rejects missing fields", () => {
    expect(loginSchema.safeParse({}).success).toBe(false);
    expect(loginSchema.safeParse({ username: "johndoe" }).success).toBe(false);
    expect(loginSchema.safeParse({ password: "secret123" }).success).toBe(false);
  });
});
