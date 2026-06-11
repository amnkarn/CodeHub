import { describe, it, expect, vi } from "vitest";
import type { Request, Response } from "express";

vi.mock("../generated/prisma/enums.js", () => ({
  VISIBILITY: { public: "public", private: "private" },
}));

vi.mock("../config/db.js", () => ({
  default: {
    repository: { findFirst: vi.fn() },
    comments: {
      create: vi.fn(),
      findMany: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

vi.mock("../config/redis.js", () => ({
  default: { set: vi.fn() },
}));

import prismaClient from "../config/db.js";
import { addComment, getComments, deleteComment } from "./comment.controller.js";

const VALID_UUID = "550e8400-e29b-41d4-a716-446655440000";
const VALID_UUID_2 = "660e8400-e29b-41d4-a716-446655440000";

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

describe("addComment", () => {
  it("returns 400 when user id missing", async () => {
    const req = mockReq({
      params: { owner: "alice", repo: "repo", issueId: VALID_UUID },
      body: { comment: "text" },
    });
    const res = mockRes();
    await addComment(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("returns 400 on invalid params", async () => {
    const req = mockReq({
      user: { id: "u1", jti: "j" },
      params: { owner: "alice", repo: "repo", issueId: "bad" },
      body: { comment: "text" },
    });
    const res = mockRes();
    await addComment(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("returns 400 on invalid body", async () => {
    const req = mockReq({
      user: { id: "u1", jti: "j" },
      params: { owner: "alice", repo: "repo", issueId: VALID_UUID },
      body: {},
    });
    const res = mockRes();
    await addComment(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("returns 400 when repo not found", async () => {
    vi.mocked(prismaClient.repository.findFirst).mockResolvedValue(null);
    const req = mockReq({
      user: { id: "u1", jti: "j" },
      params: { owner: "alice", repo: "repo", issueId: VALID_UUID },
      body: { comment: "Nice!" },
    });
    const res = mockRes();
    await addComment(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("creates comment successfully", async () => {
    vi.mocked(prismaClient.repository.findFirst).mockResolvedValue({ id: "r1" } as any);
    vi.mocked(prismaClient.comments.create).mockResolvedValue({ id: "c1" } as any);
    const req = mockReq({
      user: { id: "u1", jti: "j" },
      params: { owner: "alice", repo: "repo", issueId: VALID_UUID },
      body: { comment: "Nice!" },
    });
    const res = mockRes();
    await addComment(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
  });
});

describe("getComments", () => {
  it("returns 400 on invalid params", async () => {
    const req = mockReq({
      user: { id: "u1", jti: "j" },
      params: { owner: "alice", repo: "repo", issueId: "bad" },
    });
    const res = mockRes();
    await getComments(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("returns 200 when no comments", async () => {
    vi.mocked(prismaClient.comments.findMany).mockResolvedValue([]);
    const req = mockReq({
      user: { id: "u1", jti: "j" },
      params: { owner: "alice", repo: "repo", issueId: VALID_UUID },
    });
    const res = mockRes();
    await getComments(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("returns 200 with comments", async () => {
    vi.mocked(prismaClient.comments.findMany).mockResolvedValue([{ id: "c1" }] as any);
    const req = mockReq({
      user: { id: "u1", jti: "j" },
      params: { owner: "alice", repo: "repo", issueId: VALID_UUID },
    });
    const res = mockRes();
    await getComments(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
  });
});

describe("deleteComment", () => {
  it("returns 400 on invalid params", async () => {
    const req = mockReq({
      user: { id: "u1", jti: "j" },
      params: { owner: "alice", repo: "repo", issueId: "bad", commentId: "bad" },
    });
    const res = mockRes();
    await deleteComment(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("returns 401 when user id missing", async () => {
    const req = mockReq({
      params: { owner: "alice", repo: "repo", issueId: VALID_UUID, commentId: VALID_UUID_2 },
    });
    const res = mockRes();
    await deleteComment(req, res);
    expect(res.status).toHaveBeenCalledWith(401);
  });

  it("deletes comment successfully", async () => {
    vi.mocked(prismaClient.comments.delete).mockResolvedValue({} as any);
    const req = mockReq({
      user: { id: "u1", jti: "j" },
      params: { owner: "alice", repo: "repo", issueId: VALID_UUID, commentId: VALID_UUID_2 },
    });
    const res = mockRes();
    await deleteComment(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("returns 400 on P2025 error", async () => {
    const err = new Error("not found") as any;
    err.code = "P2025";
    vi.mocked(prismaClient.comments.delete).mockRejectedValue(err);
    const req = mockReq({
      user: { id: "u1", jti: "j" },
      params: { owner: "alice", repo: "repo", issueId: VALID_UUID, commentId: VALID_UUID_2 },
    });
    const res = mockRes();
    await deleteComment(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });
});
