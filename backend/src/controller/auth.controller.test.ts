import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Request, Response } from "express";

vi.mock("../config/db.js", () => ({
  default: {
    user: {
      findFirst: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
    },
  },
}));

vi.mock("../config/redis.js", () => ({
  default: {
    get: vi.fn(),
    set: vi.fn(),
  },
}));

vi.mock("bcrypt", () => ({
  default: {
    genSalt: vi.fn().mockResolvedValue("salt"),
    hash: vi.fn().mockResolvedValue("hashed-password"),
    compare: vi.fn(),
  },
}));

vi.mock("jsonwebtoken", () => ({
  default: {
    sign: vi.fn().mockReturnValue("token"),
    verify: vi.fn(),
  },
}));

vi.mock("uuid", () => ({
  v4: vi.fn(() => "mocked-uuid"),
}));

vi.mock("../utils/generateToken.js", () => ({
  default: vi.fn(),
}));

vi.mock("../utils/blacklistToken.js", () => ({
  default: vi.fn(),
}));

import prismaClient from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import redisClient from "../config/redis.js";
import generateToken from "../utils/generateToken.js";
import blackListToken from "../utils/blacklistToken.js";
import { registerUser, loginUser, refreshAccessToken, logoutUser } from "./auth.controller.js";

function mockReq(overrides: Partial<Request> = {}): Request {
  return {
    body: {},
    cookies: {},
    ...overrides,
  } as unknown as Request;
}

function mockRes(): Response {
  const res = {} as Response;
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  res.cookie = vi.fn().mockReturnValue(res);
  res.clearCookie = vi.fn().mockReturnValue(res);
  return res;
}

describe("registerUser", () => {
  beforeEach(() => {
    vi.stubEnv("JWT_SECRET", "test-secret");
  });

  it("returns 400 on invalid input", async () => {
    const req = mockReq({ body: {} });
    const res = mockRes();
    await registerUser(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("returns 400 if user already exists", async () => {
    vi.mocked(prismaClient.user.findFirst).mockResolvedValue({ id: "existing" } as any);
    const req = mockReq({
      body: { username: "johndoe", email: "j@e.com", name: "John", password: "secret123" },
    });
    const res = mockRes();
    await registerUser(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("creates user and generates token on success", async () => {
    vi.mocked(prismaClient.user.findFirst).mockResolvedValue(null);
    vi.mocked(prismaClient.user.create).mockResolvedValue({
      id: "new-user-id",
      username: "johndoe",
      email: "j@e.com",
      name: "John",
    } as any);

    const req = mockReq({
      body: { username: "johndoe", email: "j@e.com", name: "John", password: "secret123" },
    });
    const res = mockRes();
    await registerUser(req, res);

    expect(bcrypt.hash).toHaveBeenCalled();
    expect(prismaClient.user.create).toHaveBeenCalled();
    expect(generateToken).toHaveBeenCalledWith("new-user-id", res);
    expect(res.status).toHaveBeenCalledWith(201);
  });
});

describe("loginUser", () => {
  beforeEach(() => {
    vi.stubEnv("JWT_SECRET", "test-secret");
  });

  it("returns 400 on invalid input", async () => {
    const req = mockReq({ body: {} });
    const res = mockRes();
    await loginUser(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("returns 404 if user not found", async () => {
    vi.mocked(prismaClient.user.findUnique).mockResolvedValue(null);
    const req = mockReq({ body: { username: "johndoe", password: "secret123" } });
    const res = mockRes();
    await loginUser(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it("returns 401 on wrong password", async () => {
    vi.mocked(prismaClient.user.findUnique).mockResolvedValue({
      id: "u1",
      username: "johndoe",
      password: "hashed",
    } as any);
    vi.mocked(bcrypt.compare).mockResolvedValue(false as never);

    const req = mockReq({ body: { username: "johndoe", password: "wrong" } });
    const res = mockRes();
    await loginUser(req, res);
    expect(res.status).toHaveBeenCalledWith(401);
  });

  it("returns 200 and generates token on success", async () => {
    vi.mocked(prismaClient.user.findUnique).mockResolvedValue({
      id: "u1",
      username: "johndoe",
      email: "j@e.com",
      name: "John",
      password: "hashed",
    } as any);
    vi.mocked(bcrypt.compare).mockResolvedValue(true as never);

    const req = mockReq({ body: { username: "johndoe", password: "secret123" } });
    const res = mockRes();
    await loginUser(req, res);

    expect(generateToken).toHaveBeenCalledWith("u1", res);
    expect(res.status).toHaveBeenCalledWith(200);
  });
});

describe("refreshAccessToken", () => {
  beforeEach(() => {
    vi.stubEnv("JWT_SECRET", "test-secret");
  });

  it("returns 401 when tokens are missing", async () => {
    const req = mockReq({ cookies: {} });
    const res = mockRes();
    await refreshAccessToken(req, res);
    expect(res.status).toHaveBeenCalledWith(401);
  });

  it("returns 400 if token is blacklisted", async () => {
    vi.mocked(jwt.verify).mockReturnValue({ id: "u1", jti: "jti-1" } as any);
    vi.mocked(redisClient.get).mockResolvedValue("blacklisted" as any);

    const req = mockReq({ cookies: { accessToken: "at", refreshToken: "rt" } });
    const res = mockRes();
    await refreshAccessToken(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("returns 200 and refreshes on valid tokens", async () => {
    vi.mocked(jwt.verify).mockReturnValue({ id: "u1", jti: "jti-1" } as any);
    vi.mocked(redisClient.get).mockResolvedValue(null as any);

    const req = mockReq({ cookies: { accessToken: "at", refreshToken: "rt" } });
    const res = mockRes();
    await refreshAccessToken(req, res);

    expect(blackListToken).toHaveBeenCalledTimes(2);
    expect(generateToken).toHaveBeenCalledWith("u1", res);
    expect(res.status).toHaveBeenCalledWith(200);
  });
});

describe("logoutUser", () => {
  beforeEach(() => {
    vi.stubEnv("JWT_SECRET", "test-secret");
  });

  it("returns 400 when tokens are missing", () => {
    const req = mockReq({ cookies: {} });
    const res = mockRes();
    logoutUser(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("blacklists tokens and clears cookies on success", () => {
    vi.mocked(jwt.verify).mockReturnValue({ id: "u1", jti: "jti-1" } as any);

    const req = mockReq({ cookies: { accessToken: "at", refreshToken: "rt" } });
    const res = mockRes();
    logoutUser(req, res);

    expect(blackListToken).toHaveBeenCalledTimes(2);
    expect(res.clearCookie).toHaveBeenCalledWith("refreshToken");
    expect(res.clearCookie).toHaveBeenCalledWith("accessToken");
    expect(res.status).toHaveBeenCalledWith(200);
  });
});
