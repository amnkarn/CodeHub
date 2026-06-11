import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Request, Response } from "express";

vi.mock("../generated/prisma/enums.js", () => ({
  VISIBILITY: { public: "public", private: "private" },
}));

vi.mock("../config/db.js", () => ({
  default: {
    repository: {
      findMany: vi.fn(),
      findFirst: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    user: {
      findUnique: vi.fn(),
      findFirst: vi.fn(),
      update: vi.fn(),
    },
  },
}));

vi.mock("../config/redis.js", () => ({
  default: { set: vi.fn() },
}));

import prismaClient from "../config/db.js";
import {
  searchRepositories,
  getUserRepositories,
  getRepositoryByFullName,
  getMyRepositories,
  createRepository,
  updateRepository,
  deleteRepository,
  starRepository,
  unstarRepository,
} from "./repo.controller.js";

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

describe("searchRepositories", () => {
  it("returns 400 on missing query", async () => {
    const req = mockReq({ query: {} });
    const res = mockRes();
    await searchRepositories(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("returns 200 with empty result message when nothing found", async () => {
    vi.mocked(prismaClient.repository.findMany).mockResolvedValue([]);
    const req = mockReq({ query: { input: "nothing" } });
    const res = mockRes();
    await searchRepositories(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("returns 200 with results", async () => {
    vi.mocked(prismaClient.repository.findMany).mockResolvedValue([
      { name: "my-repo" },
    ] as any);
    const req = mockReq({ query: { input: "my" } });
    const res = mockRes();
    await searchRepositories(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
  });
});

describe("getUserRepositories", () => {
  it("returns 400 on invalid params", async () => {
    const req = mockReq({ params: { username: "ab" } });
    const res = mockRes();
    await getUserRepositories(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("returns 404 when user not found", async () => {
    vi.mocked(prismaClient.user.findUnique).mockResolvedValue(null);
    const req = mockReq({ params: { username: "alice" } });
    const res = mockRes();
    await getUserRepositories(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it("returns 200 with repos", async () => {
    vi.mocked(prismaClient.user.findUnique).mockResolvedValue({
      repositories: [],
    } as any);
    const req = mockReq({ params: { username: "alice" } });
    const res = mockRes();
    await getUserRepositories(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
  });
});

describe("getRepositoryByFullName", () => {
  it("returns 400 on invalid params", async () => {
    const req = mockReq({ params: { owner: "ab", repo: "r" } });
    const res = mockRes();
    await getRepositoryByFullName(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("returns 200 when no matching repo", async () => {
    vi.mocked(prismaClient.user.findFirst).mockResolvedValue({
      repositories: [],
    } as any);
    const req = mockReq({ params: { owner: "alice", repo: "nope" } });
    const res = mockRes();
    await getRepositoryByFullName(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
  });
});

describe("getMyRepositories", () => {
  it("returns 200 with user repos", async () => {
    vi.mocked(prismaClient.user.findUnique).mockResolvedValue({
      repositories: [{ name: "repo-1" }],
    } as any);
    const req = mockReq({ user: { id: "u1", jti: "j" } });
    const res = mockRes();
    await getMyRepositories(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
  });
});

describe("createRepository", () => {
  it("returns 400 on invalid input", async () => {
    const req = mockReq({ user: { id: "u1", jti: "j" }, body: {} });
    const res = mockRes();
    await createRepository(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("creates repository successfully", async () => {
    vi.mocked(prismaClient.repository.create).mockResolvedValue({
      id: "r1",
      name: "new-repo",
    } as any);
    const req = mockReq({
      user: { id: "u1", jti: "j" },
      body: { name: "new-repo", description: "desc" },
    });
    const res = mockRes();
    await createRepository(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
  });
});

describe("updateRepository", () => {
  it("returns 400 on invalid params", async () => {
    const req = mockReq({
      user: { id: "u1", jti: "j" },
      params: { owner: "ab", repo: "r" },
      body: { name: "new" },
    });
    const res = mockRes();
    await updateRepository(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("returns 404 when owner not found", async () => {
    vi.mocked(prismaClient.user.findUnique).mockResolvedValue(null);
    const req = mockReq({
      user: { id: "u1", jti: "j" },
      params: { owner: "alice", repo: "repo" },
      body: { name: "new" },
    });
    const res = mockRes();
    await updateRepository(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it("returns 403 when not the owner", async () => {
    vi.mocked(prismaClient.user.findUnique).mockResolvedValue({ id: "other" } as any);
    const req = mockReq({
      user: { id: "u1", jti: "j" },
      params: { owner: "alice", repo: "repo" },
      body: { name: "new" },
    });
    const res = mockRes();
    await updateRepository(req, res);
    expect(res.status).toHaveBeenCalledWith(403);
  });

  it("returns 400 when nothing to update", async () => {
    vi.mocked(prismaClient.user.findUnique).mockResolvedValue({ id: "u1" } as any);
    const req = mockReq({
      user: { id: "u1", jti: "j" },
      params: { owner: "alice", repo: "repo" },
      body: {},
    });
    const res = mockRes();
    await updateRepository(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("updates repo successfully", async () => {
    vi.mocked(prismaClient.user.findUnique).mockResolvedValue({ id: "u1" } as any);
    vi.mocked(prismaClient.repository.update).mockResolvedValue({ name: "new" } as any);
    const req = mockReq({
      user: { id: "u1", jti: "j" },
      params: { owner: "alice", repo: "repo" },
      body: { name: "new" },
    });
    const res = mockRes();
    await updateRepository(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
  });
});

describe("deleteRepository", () => {
  it("returns 400 on invalid params", async () => {
    const req = mockReq({
      user: { id: "u1", jti: "j" },
      params: { owner: "ab", repo: "r" },
    });
    const res = mockRes();
    await deleteRepository(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("returns 404 when owner not found", async () => {
    vi.mocked(prismaClient.user.findUnique).mockResolvedValue(null);
    const req = mockReq({
      user: { id: "u1", jti: "j" },
      params: { owner: "alice", repo: "repo" },
    });
    const res = mockRes();
    await deleteRepository(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it("returns 403 when not the owner", async () => {
    vi.mocked(prismaClient.user.findUnique).mockResolvedValue({ id: "other" } as any);
    const req = mockReq({
      user: { id: "u1", jti: "j" },
      params: { owner: "alice", repo: "repo" },
    });
    const res = mockRes();
    await deleteRepository(req, res);
    expect(res.status).toHaveBeenCalledWith(403);
  });

  it("deletes repo successfully", async () => {
    vi.mocked(prismaClient.user.findUnique).mockResolvedValue({ id: "u1" } as any);
    vi.mocked(prismaClient.repository.delete).mockResolvedValue({} as any);
    const req = mockReq({
      user: { id: "u1", jti: "j" },
      params: { owner: "alice", repo: "repo" },
    });
    const res = mockRes();
    await deleteRepository(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
  });
});

describe("starRepository", () => {
  it("returns 400 on invalid params", async () => {
    const req = mockReq({
      user: { id: "u1", jti: "j" },
      params: { owner: "ab", repo: "r" },
    });
    const res = mockRes();
    await starRepository(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("returns 404 when repo not found", async () => {
    vi.mocked(prismaClient.repository.findFirst).mockResolvedValue(null);
    const req = mockReq({
      user: { id: "u1", jti: "j" },
      params: { owner: "alice", repo: "repo" },
    });
    const res = mockRes();
    await starRepository(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it("returns 400 when already starred", async () => {
    vi.mocked(prismaClient.repository.findFirst).mockResolvedValue({
      id: "r1",
      staredBy: [{ id: "u1" }],
    } as any);
    const req = mockReq({
      user: { id: "u1", jti: "j" },
      params: { owner: "alice", repo: "repo" },
    });
    const res = mockRes();
    await starRepository(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("stars repo successfully", async () => {
    vi.mocked(prismaClient.repository.findFirst).mockResolvedValue({
      id: "r1",
      staredBy: [],
    } as any);
    vi.mocked(prismaClient.user.update).mockResolvedValue({} as any);
    const req = mockReq({
      user: { id: "u1", jti: "j" },
      params: { owner: "alice", repo: "repo" },
    });
    const res = mockRes();
    await starRepository(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
  });
});

describe("unstarRepository", () => {
  it("returns 404 when repo not found", async () => {
    vi.mocked(prismaClient.repository.findFirst).mockResolvedValue(null);
    const req = mockReq({
      user: { id: "u1", jti: "j" },
      params: { owner: "alice", repo: "repo" },
    });
    const res = mockRes();
    await unstarRepository(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });
});
