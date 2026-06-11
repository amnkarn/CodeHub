import type { Prisma } from "../generated/prisma/client.js";

export const repoSummarySelect = {
    name: true,
    description: true,
    _count: {
        select: {
            staredBy: true,
            fork: true,
            issues: true,
        },
    },
    createdAt: true,
    updatedAt: true,
} as const satisfies Prisma.RepositorySelect;

export const repoListItemSelect = {
    name: true,
    description: true,
    visibility: true,
    _count: {
        select: {
            staredBy: true,
            fork: true,
            issues: true,
        },
    },
    createdAt: true,
    updatedAt: true,
} as const satisfies Prisma.RepositorySelect;

export const issueDetailSelect = {
    id: true,
    title: true,
    description: true,
    status: true,
    repository: { select: { name: true } },
    author: { select: { username: true } },
    createdAt: true,
} as const satisfies Prisma.IssueSelect;

export const userSummarySelect = {
    id: true,
    username: true,
    email: true,
    name: true,
    createdAt: true,
} as const satisfies Prisma.UserSelect;

export const commentDetailSelect = {
    id: true,
    author: {
        select: { username: true },
    },
    comment: true,
    createdAt: true,
} as const satisfies Prisma.CommentsSelect;
