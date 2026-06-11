import { describe, it, expect, vi } from "vitest";
import type { Request, Response } from "express";

vi.mock("../generated/prisma/enums.js", () => ({
  VISIBILITY: { public: "public", private: "private" },
}));

vi.mock("../config/db.js", () => ({
  default: {
    repository: {
      findFirst: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
    },
    fork: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
    },
  },
}));

vi.mock("../config/redis.js", () => ({
  default: { set: vi.fn() },
}));

vi.mock("../utils/copyRepoFiles.js", () => ({
  default: vi.fn().mockResolvedValue("forked-repo-id"),
}));

import prismaClient from "../config/db.js";
import { forkRepository, getForkedRepositories } from "./forkRouter.controller.js";

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
  return res;
}

describe("forkRepository", () => {
  it("returns 400 on invalid params", async () => {
    const req = mockReq({ user: { id: "u1", jti: "j" }, params: {} });
    const res = mockRes();
    await forkRepository(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("returns 401 when user not authenticated", async () => {
    const req = mockReq({ params: { owner: "alice", repo: "repo" } });
    const res = mockRes();
    await forkRepository(req, res);
    expect(res.status).toHaveBeenCalledWith(401);
  });

  it("returns 400 when repo not found", async () => {
    vi.mocked(prismaClient.repository.findFirst).mockResolvedValue(null);
    const req = mockReq({
      user: { id: "u1", jti: "j" },
      params: { owner: "alice", repo: "repo" },
    });
    const res = mockRes();
    await forkRepository(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("returns 400 when trying to fork own repo", async () => {
    vi.mocked(prismaClient.repository.findFirst).mockResolvedValue({
      id: "r1",
      ownerId: "u1",
    } as any);
    const req = mockReq({
      user: { id: "u1", jti: "j" },
      params: { owner: "alice", repo: "repo" },
    });
    const res = mockRes();
    await forkRepository(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("returns 400 when already forked", async () => {
    vi.mocked(prismaClient.repository.findFirst).mockResolvedValue({
      id: "r1",
      ownerId: "u2",
    } as any);
    vi.mocked(prismaClient.fork.findUnique).mockResolvedValue({ id: 1 } as any);
    const req = mockReq({
      user: { id: "u1", jti: "j" },
      params: { owner: "alice", repo: "repo" },
    });
    const res = mockRes();
    await forkRepository(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("forks repository successfully", async () => {
    vi.mocked(prismaClient.repository.findFirst).mockResolvedValue({
      id: "r1",
      ownerId: "u2",
      name: "repo",
      description: "desc",
    } as any);
    vi.mocked(prismaClient.fork.findUnique).mockResolvedValue(null);
    vi.mocked(prismaClient.repository.findUnique).mockResolvedValue(null);
    vi.mocked(prismaClient.repository.create).mockResolvedValue({ id: "new-r" } as any);
    vi.mocked(prismaClient.fork.create).mockResolvedValue({
      id: 1,
      sourceCode: { name: "repo" },
      forkedBy: { username: "bob" },
    } as any);

    const req = mockReq({
      user: { id: "u1", jti: "j" },
      params: { owner: "alice", repo: "repo" },
    });
    const res = mockRes();
    await forkRepository(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
  });
});

describe("getForkedRepositories", () => {
  it("returns 400 on invalid params", async () => {
    const req = mockReq({ params: {} });
    const res = mockRes();
    await getForkedRepositories(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("returns 400 when repo not found", async () => {
    vi.mocked(prismaClient.repository.findFirst).mockResolvedValue(null);
    const req = mockReq({ params: { owner: "alice", repo: "repo" } });
    const res = mockRes();
    await getForkedRepositories(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("returns 200 with forks list", async () => {
    vi.mocked(prismaClient.repository.findFirst).mockResolvedValue({ id: "r1" } as any);
    vi.mocked(prismaClient.fork.findMany).mockResolvedValue([
      { id: 1, forkedBy: { username: "bob" } },
    ] as any);
    const req = mockReq({ params: { owner: "alice", repo: "repo" } });
    const res = mockRes();
    await getForkedRepositories(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
  });
});
