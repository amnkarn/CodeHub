import { describe, it, expect, vi } from "vitest";
import type { Response } from "express";

// Set env before module loads its top-level `const secret`
process.env["JWT_SECRET"] = "test-secret";

vi.mock("jsonwebtoken", () => ({
  default: {
    sign: vi.fn(),
  },
}));

vi.mock("uuid", () => ({
  v4: vi.fn(() => "mocked-uuid"),
}));

import jwt from "jsonwebtoken";
import generateToken from "./generateToken.js";

function mockRes(): Response {
  const res = {} as Response;
  res.cookie = vi.fn().mockReturnValue(res);
  return res;
}

describe("generateToken", () => {
  it("signs a refresh token and an access token", () => {
    vi.mocked(jwt.sign)
      .mockReturnValueOnce("refresh-token-value" as any)
      .mockReturnValueOnce("access-token-value" as any);

    const res = mockRes();
    generateToken("user-123", res);

    expect(jwt.sign).toHaveBeenCalledTimes(2);

    const calls = vi.mocked(jwt.sign).mock.calls;

    // refresh token call
    expect(calls[0]![0]).toEqual({ id: "user-123", jti: "mocked-uuid" });
    expect(calls[0]![2]).toEqual({ expiresIn: 7 * 24 * 60 * 60 * 1000 });

    // access token call
    expect(calls[1]![0]).toEqual({ id: "user-123", jti: "mocked-uuid" });
    expect(calls[1]![2]).toEqual({ expiresIn: "15m" });
  });

  it("sets refreshToken and accessToken cookies", () => {
    vi.mocked(jwt.sign)
      .mockReturnValueOnce("refresh-tok" as any)
      .mockReturnValueOnce("access-tok" as any);

    const res = mockRes();
    generateToken("user-123", res);

    expect(res.cookie).toHaveBeenCalledWith("refreshToken", "refresh-tok", {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "strict",
    });

    expect(res.cookie).toHaveBeenCalledWith("accessToken", "access-tok", {
      httpOnly: true,
      maxAge: 15 * 60 * 1000,
      sameSite: "strict",
    });
  });
});
