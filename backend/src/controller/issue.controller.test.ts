import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Request, Response } from "express";

vi.mock("../generated/prisma/enums.js", () => ({
  VISIBILITY: { public: "public", private: "private" },
}));

vi.mock("../config/db.js", () => ({
  default: {
    repository: { findFirst: vi.fn() },
    issue: {
      create: vi.fn(),
      findMany: vi.fn(),
      findFirst: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

vi.mock("../config/redis.js", () => ({
  default: { set: vi.fn() },
}));

import prismaClient from "../config/db.js";
import {
  createIssue,
  getAllIssuesByRepo,
  getIssueById,
  updateIssue,
  deleteIssue,
  getMyIssues,
  updateMyIssuesById,
} from "./issue.controller.js";

const VALID_UUID = "550e8400-e29b-41d4-a716-446655440000";

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

describe("createIssue", () => {
  it("returns 400 on invalid params", async () => {
    const req = mockReq({
      user: { id: "u1", jti: "j" },
      params: { owner: "a".repeat(31), repo: "r" },
      body: { title: "Bug", description: "desc" },
    });
    const res = mockRes();
    await createIssue(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("returns 400 on invalid body", async () => {
    const req = mockReq({
      user: { id: "u1", jti: "j" },
      params: { owner: "alice", repo: "repo" },
      body: {},
    });
    const res = mockRes();
    await createIssue(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("returns 404 when repo not found", async () => {
    vi.mocked(prismaClient.repository.findFirst).mockResolvedValue(null);
    const req = mockReq({
      user: { id: "u1", jti: "j" },
      params: { owner: "alice", repo: "repo" },
      body: { title: "Bug", description: "desc" },
    });
    const res = mockRes();
    await createIssue(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it("creates issue successfully", async () => {
    vi.mocked(prismaClient.repository.findFirst).mockResolvedValue({ id: "r1" } as any);
    vi.mocked(prismaClient.issue.create).mockResolvedValue({ id: "i1", title: "Bug" } as any);
    const req = mockReq({
      user: { id: "u1", jti: "j" },
      params: { owner: "alice", repo: "repo" },
      body: { title: "Bug", description: "desc" },
    });
    const res = mockRes();
    await createIssue(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
  });
});

describe("getAllIssuesByRepo", () => {
  it("returns 400 on invalid params", async () => {
    const req = mockReq({
      user: { id: "u1", jti: "j" },
      params: { owner: "a".repeat(31), repo: "r" },
    });
    const res = mockRes();
    await getAllIssuesByRepo(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("returns 200 when no issues", async () => {
    vi.mocked(prismaClient.issue.findMany).mockResolvedValue([]);
    const req = mockReq({
      user: { id: "u1", jti: "j" },
      params: { owner: "alice", repo: "repo" },
    });
    const res = mockRes();
    await getAllIssuesByRepo(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("returns 200 with issues", async () => {
    vi.mocked(prismaClient.issue.findMany).mockResolvedValue([{ id: "i1" }] as any);
    const req = mockReq({
      user: { id: "u1", jti: "j" },
      params: { owner: "alice", repo: "repo" },
    });
    const res = mockRes();
    await getAllIssuesByRepo(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
  });
});

describe("getIssueById", () => {
  it("returns 400 on invalid params", async () => {
    const req = mockReq({
      user: { id: "u1", jti: "j" },
      params: { owner: "alice", repo: "repo", issueId: "bad" },
    });
    const res = mockRes();
    await getIssueById(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("returns 404 when issue not found", async () => {
    vi.mocked(prismaClient.issue.findFirst).mockResolvedValue(null);
    const req = mockReq({
      user: { id: "u1", jti: "j" },
      params: { owner: "alice", repo: "repo", issueId: VALID_UUID },
    });
    const res = mockRes();
    await getIssueById(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it("returns 200 with issue data", async () => {
    vi.mocked(prismaClient.issue.findFirst).mockResolvedValue({ id: VALID_UUID } as any);
    const req = mockReq({
      user: { id: "u1", jti: "j" },
      params: { owner: "alice", repo: "repo", issueId: VALID_UUID },
    });
    const res = mockRes();
    await getIssueById(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
  });
});

describe("updateIssue", () => {
  it("returns 400 on invalid params", async () => {
    const req = mockReq({
      user: { id: "u1", jti: "j" },
      params: { owner: "alice", repo: "repo", issueId: "bad" },
      body: { title: "x" },
    });
    const res = mockRes();
    await updateIssue(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("returns 400 when nothing to update", async () => {
    const req = mockReq({
      user: { id: "u1", jti: "j" },
      params: { owner: "alice", repo: "repo", issueId: VALID_UUID },
      body: {},
    });
    const res = mockRes();
    await updateIssue(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("updates issue successfully", async () => {
    vi.mocked(prismaClient.issue.update).mockResolvedValue({ id: VALID_UUID } as any);
    const req = mockReq({
      user: { id: "u1", jti: "j" },
      params: { owner: "alice", repo: "repo", issueId: VALID_UUID },
      body: { title: "Fixed" },
    });
    const res = mockRes();
    await updateIssue(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("returns 404 on P2025 error", async () => {
    const err = new Error("not found") as any;
    err.code = "P2025";
    vi.mocked(prismaClient.issue.update).mockRejectedValue(err);
    const req = mockReq({
      user: { id: "u1", jti: "j" },
      params: { owner: "alice", repo: "repo", issueId: VALID_UUID },
      body: { title: "Fixed" },
    });
    const res = mockRes();
    await updateIssue(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });
});

describe("deleteIssue", () => {
  it("returns 400 on invalid params", async () => {
    const req = mockReq({
      user: { id: "u1", jti: "j" },
      params: { owner: "alice", repo: "repo", issueId: "bad" },
    });
    const res = mockRes();
    await deleteIssue(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("deletes issue successfully", async () => {
    vi.mocked(prismaClient.issue.delete).mockResolvedValue({ id: VALID_UUID } as any);
    const req = mockReq({
      user: { id: "u1", jti: "j" },
      params: { owner: "alice", repo: "repo", issueId: VALID_UUID },
    });
    const res = mockRes();
    await deleteIssue(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
  });
});

describe("getMyIssues", () => {
  it("returns 200 with issues", async () => {
    vi.mocked(prismaClient.issue.findMany).mockResolvedValue([{ id: "i1" }] as any);
    const req = mockReq({ user: { id: "u1", jti: "j" } });
    const res = mockRes();
    await getMyIssues(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
  });
});

describe("updateMyIssuesById", () => {
  it("returns 400 on invalid params", async () => {
    const req = mockReq({
      user: { id: "u1", jti: "j" },
      params: { issueId: "bad" },
      body: { title: "x" },
    });
    const res = mockRes();
    await updateMyIssuesById(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("returns 400 when nothing to update", async () => {
    const req = mockReq({
      user: { id: "u1", jti: "j" },
      params: { issueId: VALID_UUID },
      body: {},
    });
    const res = mockRes();
    await updateMyIssuesById(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("updates own issue successfully", async () => {
    vi.mocked(prismaClient.issue.update).mockResolvedValue({ id: VALID_UUID } as any);
    const req = mockReq({
      user: { id: "u1", jti: "j" },
      params: { issueId: VALID_UUID },
      body: { status: "closed" },
    });
    const res = mockRes();
    await updateMyIssuesById(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("returns 404 on P2025 error", async () => {
    const err = new Error("not found") as any;
    err.code = "P2025";
    vi.mocked(prismaClient.issue.update).mockRejectedValue(err);
    const req = mockReq({
      user: { id: "u1", jti: "j" },
      params: { issueId: VALID_UUID },
      body: { title: "x" },
    });
    const res = mockRes();
    await updateMyIssuesById(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });
});
