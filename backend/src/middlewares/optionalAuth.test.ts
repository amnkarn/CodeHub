import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Request, Response, NextFunction } from "express";

vi.mock("jsonwebtoken", () => ({
  default: {
    verify: vi.fn(),
  },
}));

import jwt from "jsonwebtoken";
import optionalAuth from "./optionalAuth.js";

function mockReq(overrides: Partial<Request> = {}): Request {
  return {
    cookies: {},
    ...overrides,
  } as unknown as Request;
}

function mockRes(): Response {
  const res = {} as Response;
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res;
}

describe("optionalAuth middleware", () => {
  const next: NextFunction = vi.fn();

  beforeEach(() => {
    vi.stubEnv("JWT_SECRET", "test-secret");
  });

  it("calls next without setting user when no token", async () => {
    const req = mockReq({ cookies: {} });
    const res = mockRes();

    await optionalAuth(req, res, next);

    expect(req.user).toBeUndefined();
    expect(next).toHaveBeenCalled();
  });

  it("sets req.user and calls next when token is valid", async () => {
    const payload = { id: "user-1", jti: "jti-1" };
    vi.mocked(jwt.verify).mockResolvedValue(payload as any);

    const req = mockReq({ cookies: { accessToken: "valid-token" } });
    const res = mockRes();

    await optionalAuth(req, res, next);

    expect(req.user).toEqual(payload);
    expect(next).toHaveBeenCalled();
  });

  it("calls next without user when token is invalid", async () => {
    vi.mocked(jwt.verify).mockRejectedValue(new Error("bad token"));

    const req = mockReq({ cookies: { accessToken: "bad-token" } });
    const res = mockRes();

    await optionalAuth(req, res, next);

    expect(req.user).toBeUndefined();
    expect(next).toHaveBeenCalled();
  });
});
