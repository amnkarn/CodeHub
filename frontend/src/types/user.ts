export interface UserProfile {
  id?: string;
  username: string;
  email: string;
  name: string;
  createdAt: string;
  avatarUrl?: string;
  bio?: string;
  location?: string;
  website?: string;
  followers?: Array<{
    id: string;
    username: string;
    name: string;
    email: string;
    createdAt: string;
  }>;
  following?: Array<{
    id: string;
    username: string;
    email: string;
    name: string;
    createdAt: string;
  }>;
  starRepos?: Array<{ id: string; name: string }>;
  issues?: Array<{ id: string; title: string; status: string }>;
  repositories?: Array<{ id: string; name: string; description: string; visibility: string }>;
  forks?: number;
  _count?: {
    followedBy: number;
    following: number;
    starRepos: number;
    issues: number;
    forks: number;
  };
}

export interface Repository {
  id: string;
  name: string;
  description?: string;
  visibility: string;
  _count?: {
    staredBy: number;
    fork: number;
    issues: number;
  };
  updatedAt?: string;
}
