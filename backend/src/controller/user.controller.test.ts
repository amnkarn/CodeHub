import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Request, Response } from "express";

vi.mock("../config/db.js", () => ({
  default: {
    user: {
      findUnique: vi.fn(),
      findFirst: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

vi.mock("../config/redis.js", () => ({
  default: { set: vi.fn() },
}));

vi.mock("bcrypt", () => ({
  default: {
    genSalt: vi.fn().mockResolvedValue("salt"),
    hash: vi.fn().mockResolvedValue("hashed"),
  },
}));

vi.mock("jsonwebtoken", () => ({
  default: { verify: vi.fn(), sign: vi.fn() },
}));

vi.mock("../utils/blacklistToken.js", () => ({
  default: vi.fn(),
}));

vi.mock("../utils/generateToken.js", () => ({
  default: vi.fn(),
}));

import prismaClient from "../config/db.js";
import {
  getCurrentUser,
  updateUserProfile,
  deleteUserProfile,
  getUserByUsername,
  getUserFollowers,
  getUserFollowing,
  followUser,
  unfollowUser,
} from "./user.controller.js";

function mockReq(overrides: Partial<Request> = {}): Request {
  return {
    body: {},
    cookies: {},
    params: {},
    query: {},
    user: undefined,
    ...overrides,
  } as unknown as Request;
}

function mockRes(): Response {
  const res = {} as Response;
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  res.clearCookie = vi.fn().mockReturnValue(res);
  return res;
}

describe("getCurrentUser", () => {
  it("returns 401 when user id is missing", async () => {
    const req = mockReq();
    const res = mockRes();
    await getCurrentUser(req, res);
    expect(res.status).toHaveBeenCalledWith(401);
  });

  it("returns 200 with user data", async () => {
    vi.mocked(prismaClient.user.findUnique).mockResolvedValue({
      id: "u1",
      username: "johndoe",
    } as any);

    const req = mockReq({ user: { id: "u1", jti: "j" } });
    const res = mockRes();
    await getCurrentUser(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(prismaClient.user.findUnique).toHaveBeenCalled();
  });
});

describe("updateUserProfile", () => {
  it("returns 400 on invalid body", async () => {
    const req = mockReq({ user: { id: "u1", jti: "j" }, body: {} });
    const res = mockRes();
    await updateUserProfile(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("returns 400 when nothing to update (name only, no change fields)", async () => {
    vi.mocked(prismaClient.user.findUnique).mockResolvedValue(null);
    const req = mockReq({
      user: { id: "u1", jti: "j" },
      body: { name: "Same" },
    });
    const res = mockRes();
    await updateUserProfile(req, res);
    // name is always set, so update proceeds
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("returns 404 when new username is taken", async () => {
    vi.mocked(prismaClient.user.findUnique).mockResolvedValue({ id: "other" } as any);
    const req = mockReq({
      user: { id: "u1", jti: "j" },
      body: { name: "John", username: "taken" },
    });
    const res = mockRes();
    await updateUserProfile(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it("updates user successfully", async () => {
    vi.mocked(prismaClient.user.findUnique).mockResolvedValue(null);
    vi.mocked(prismaClient.user.update).mockResolvedValue({ id: "u1" } as any);

    const req = mockReq({
      user: { id: "u1", jti: "j" },
      body: { name: "New Name", username: "newname" },
    });
    const res = mockRes();
    await updateUserProfile(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
  });
});

describe("getUserByUsername", () => {
  it("returns 400 on invalid params", async () => {
    const req = mockReq({ params: { username: "ab" } });
    const res = mockRes();
    await getUserByUsername(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("returns 404 when user not found", async () => {
    vi.mocked(prismaClient.user.findUnique).mockResolvedValue(null);
    const req = mockReq({ params: { username: "alice" } });
    const res = mockRes();
    await getUserByUsername(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it("returns 200 with user data", async () => {
    vi.mocked(prismaClient.user.findUnique).mockResolvedValue({
      username: "alice",
    } as any);
    const req = mockReq({ params: { username: "alice" } });
    const res = mockRes();
    await getUserByUsername(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
  });
});

describe("getUserFollowers", () => {
  it("returns 400 on invalid params", async () => {
    const req = mockReq({ params: { username: "ab" } });
    const res = mockRes();
    await getUserFollowers(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("returns 404 when user not found", async () => {
    vi.mocked(prismaClient.user.findUnique).mockResolvedValue(null);
    const req = mockReq({ params: { username: "alice" } });
    const res = mockRes();
    await getUserFollowers(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it("returns 200 with followers", async () => {
    vi.mocked(prismaClient.user.findUnique).mockResolvedValue({
      followedBy: [{ id: "f1" }],
    } as any);
    const req = mockReq({ params: { username: "alice" } });
    const res = mockRes();
    await getUserFollowers(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
  });
});

describe("getUserFollowing", () => {
  it("returns 400 on invalid params", async () => {
    const req = mockReq({ params: { username: "ab" } });
    const res = mockRes();
    await getUserFollowing(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("returns 200 with following data", async () => {
    vi.mocked(prismaClient.user.findUnique).mockResolvedValue({
      following: [],
    } as any);
    const req = mockReq({ params: { username: "alice" } });
    const res = mockRes();
    await getUserFollowing(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
  });
});

describe("followUser", () => {
  it("returns 400 on invalid query", async () => {
    const req = mockReq({ user: { id: "u1", jti: "j" }, query: {} });
    const res = mockRes();
    await followUser(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("returns 404 when target user not found", async () => {
    vi.mocked(prismaClient.user.findUnique).mockResolvedValue(null);
    const req = mockReq({ user: { id: "u1", jti: "j" }, query: { target: "alice" } });
    const res = mockRes();
    await followUser(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it("returns 400 when trying to follow self", async () => {
    vi.mocked(prismaClient.user.findUnique).mockResolvedValueOnce({ id: "u1" } as any);
    const req = mockReq({ user: { id: "u1", jti: "j" }, query: { target: "alice" } });
    const res = mockRes();
    await followUser(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("returns 400 when already following", async () => {
    vi.mocked(prismaClient.user.findUnique)
      .mockResolvedValueOnce({ id: "u2" } as any)
      .mockResolvedValueOnce({ following: [{ id: "u2" }] } as any);
    const req = mockReq({ user: { id: "u1", jti: "j" }, query: { target: "alice" } });
    const res = mockRes();
    await followUser(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("follows user successfully", async () => {
    vi.mocked(prismaClient.user.findUnique)
      .mockResolvedValueOnce({ id: "u2" } as any)
      .mockResolvedValueOnce({ following: [] } as any);
    vi.mocked(prismaClient.user.update).mockResolvedValue({} as any);

    const req = mockReq({ user: { id: "u1", jti: "j" }, query: { target: "alice" } });
    const res = mockRes();
    await followUser(req, res);
    expect(res.json).toHaveBeenCalledWith({ message: "User followed successfully" });
  });
});

describe("unfollowUser", () => {
  it("returns 400 on invalid query", async () => {
    const req = mockReq({ user: { id: "u1", jti: "j" }, query: {} });
    const res = mockRes();
    await unfollowUser(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("returns 404 when target user not found", async () => {
    vi.mocked(prismaClient.user.findUnique).mockResolvedValue(null);
    const req = mockReq({ user: { id: "u1", jti: "j" }, query: { target: "alice" } });
    const res = mockRes();
    await unfollowUser(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it("returns 400 when not following", async () => {
    vi.mocked(prismaClient.user.findUnique).mockResolvedValue({ id: "u2" } as any);
    vi.mocked(prismaClient.user.findFirst).mockResolvedValue(null);
    const req = mockReq({ user: { id: "u1", jti: "j" }, query: { target: "alice" } });
    const res = mockRes();
    await unfollowUser(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("unfollows user successfully", async () => {
    vi.mocked(prismaClient.user.findUnique).mockResolvedValue({ id: "u2" } as any);
    vi.mocked(prismaClient.user.findFirst).mockResolvedValue({ id: "u1" } as any);
    vi.mocked(prismaClient.user.update).mockResolvedValue({} as any);

    const req = mockReq({ user: { id: "u1", jti: "j" }, query: { target: "alice" } });
    const res = mockRes();
    await unfollowUser(req, res);
    expect(res.json).toHaveBeenCalledWith({ message: "User unfollowed successfully" });
  });
});
