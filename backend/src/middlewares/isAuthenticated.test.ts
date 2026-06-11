import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Request, Response, NextFunction } from "express";

vi.mock("jsonwebtoken", () => ({
  default: {
    verify: vi.fn(),
  },
}));

import jwt from "jsonwebtoken";
import isAuthenticated from "./isAuthenticated.js";

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

describe("isAuthenticated middleware", () => {
  const next: NextFunction = vi.fn();

  beforeEach(() => {
    vi.stubEnv("JWT_SECRET", "test-secret");
  });

  it("returns 401 when accessToken cookie is missing", async () => {
    const req = mockReq({ cookies: {} });
    const res = mockRes();

    await isAuthenticated(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Token is missing" });
    expect(next).not.toHaveBeenCalled();
  });

  it("calls next and sets req.user on valid token", async () => {
    const payload = { id: "user-1", jti: "jti-1" };
    vi.mocked(jwt.verify).mockReturnValue(payload as any);

    const req = mockReq({ cookies: { accessToken: "valid-token" } });
    const res = mockRes();

    await isAuthenticated(req, res, next);

    expect(jwt.verify).toHaveBeenCalledWith("valid-token", "test-secret");
    expect(req.user).toEqual(payload);
    expect(next).toHaveBeenCalled();
  });

  it("returns 500 when jwt.verify throws", async () => {
    vi.mocked(jwt.verify).mockImplementation(() => {
      throw new Error("invalid token");
    });

    const req = mockReq({ cookies: { accessToken: "bad-token" } });
    const res = mockRes();

    await isAuthenticated(req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "Error in server" });
  });
});
