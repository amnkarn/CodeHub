import { useState, useMemo, useEffect } from "react";
import {
  MapPin,
  Link2,
  Users,
  BookOpen,
  Star,
  GitFork,
  Lock,
  Globe,
  AlertCircle,
  Calendar,
} from "lucide-react";

interface UserProfile {
  name: string;
  username: string;
  avatarUrl?: string;
  bio?: string;
  followers: number;
  following: number;
  location?: string;
  website?: string;
  publicRepos: number;
}

interface Repository {
  id: number;
  name: string;
  description?: string;
  isPrivate: boolean;
  topics?: string[];
  language?: string;
  stars: number;
  forks: number;
  openIssues: number;
}

// --- Placeholder Hook for Data Fetching ---
function useProfileData(username: string) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [repos, setRepos] = useState<Repository[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  //fetch and set user details here
  useEffect(() => {
    setIsLoading(true);
    // MOCK API CALL: Replace this block with your actual fetch logic
    setTimeout(() => {
      setUser({
        name: "Developer Name",
        username: username,
        bio: "Full-stack developer building cool things on the internet.",
        followers: 1204,
        following: 34,
        location: "San Francisco, CA",
        website: "https://example.com",
        publicRepos: 12,
      });

      setRepos([
        {
          id: 1,
          name: "awesome-project",
          description: "A really awesome project built with React and Tailwind.",
          isPrivate: false,
          topics: ["react", "tailwind", "typescript"],
          language: "TypeScript",
          stars: 128,
          forks: 12,
          openIssues: 3,
        },
      ]);
      setIsLoading(false);
    }, 1000);
  }, [username]);

  return { user, repos, userLoading: isLoading, reposLoading: isLoading };
}

const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Rust: "#dea584",
  Go: "#00add8",
  Python: "#3572a5",
  Java: "#b07219",
  "C++": "#f34b7d",
  Ruby: "#701516",
};

function generateContributions(seed: string): number[] {
  let h = 0;
  for (let i = 0; i < seed.length; i++)
    h = (Math.imul(31, h) + seed.charCodeAt(i)) | 0;
  const rng = () => {
    h = (Math.imul(h ^ (h >>> 16), 0x45d9f3b)) | 0;
    return (h >>> 0) / 4294967296;
  };
  return Array.from({ length: 52 * 7 }, () => {
    const r = rng();
    if (r < 0.55) return 0;
    if (r < 0.7) return 1;
    if (r < 0.82) return 2;
    if (r < 0.92) return 3;
    return 4;
  });
}

const CONTRIB_COLORS = [
  "bg-muted/40",
  "bg-primary/30",
  "bg-primary/55",
  "bg-primary/80",
  "bg-primary",
];

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

function ContributionGraph({ username }: { username: string }) {
  const cells = useMemo(() => generateContributions(username), [username]);
  const total = cells.filter((c) => c > 0).length * 3;

  const now = new Date();
  const monthLabels: { label: string; col: number }[] = [];
  for (let w = 0; w < 52; w++) {
    const d = new Date(now);
    d.setDate(d.getDate() - (51 - w) * 7);
    if (d.getDate() <= 7) {
      monthLabels.push({ label: MONTHS[d.getMonth()], col: w });
    }
  }

  return (
    <div className="border border-border rounded-xl bg-card p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span>{total} contributions in the last year</span>
        </h3>
        <div className="flex items-center gap-1.5 text-xs font-mono text-muted-foreground">
          <span>Less</span>
          {CONTRIB_COLORS.map((c, i) => (
            <span key={i} className={`h-3 w-3 rounded-sm ${c}`} />
          ))}
          <span>More</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div style={{ minWidth: 660 }}>
          <div className="flex mb-1 pl-7">
            {monthLabels.map(({ label, col }) => (
              <div
                key={`${label}-${col}`}
                className="text-xs font-mono text-muted-foreground"
                style={{ position: "absolute", left: col * 14 + 28 }}
              />
            ))}
            <div className="relative flex gap-px" style={{ height: 12 }}>
              {monthLabels.map(({ label, col }) => (
                <span
                  key={`${label}-${col}`}
                  className="absolute text-xs font-mono text-muted-foreground"
                  style={{ left: col * 14 }}
                >
                  {label}
                </span>
              ))}
            </div>
          </div>

          <div className="flex gap-px mt-4">
            {Array.from({ length: 52 }, (_, w) => (
              <div key={w} className="flex flex-col gap-px">
                {Array.from({ length: 7 }, (_, d) => {
                  const level = cells[w * 7 + d] ?? 0;
                  return (
                    <div
                      key={d}
                      title={`${level === 0 ? "No" : level * 3} contributions`}
                      className={`h-[11px] w-[11px] rounded-[2px] ${CONTRIB_COLORS[level]} transition-opacity hover:opacity-70 cursor-default`}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}



// --- Main Page Component ---
export default function ProfilePage({ username = "devuser" }: { username?: string }) {
  const [starredRepos, setStarredRepos] = useState<Set<number>>(new Set());

  const { user, repos, userLoading, reposLoading } = useProfileData(username);

  const toggleStar = (id: number) => {
    setStarredRepos((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="container px-4 py-8 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* ── Sidebar ────────────────────────────────── */}
          <div className="lg:col-span-1">
            {userLoading ? (
              <div className="space-y-3">
                <div className="animate-pulse bg-primary/10 h-24 w-24 rounded-full" />
                <div className="animate-pulse bg-primary/10 rounded-md h-6 w-32" />
                <div className="animate-pulse bg-primary/10 rounded-md h-4 w-24" />
                <div className="animate-pulse bg-primary/10 rounded-md h-4 w-full" />
                <div className="animate-pulse bg-primary/10 rounded-md h-4 w-3/4" />
              </div>
            ) : !user ? (
              <div className="text-center py-12 text-muted-foreground">
                <AlertCircle className="h-10 w-10 mx-auto mb-3 opacity-40" />
                <p className="font-mono text-sm">User not found</p>
              </div>
            ) : (
              <div className="space-y-5">
                <div className="relative w-fit">
                  <div className="relative flex h-24 w-24 shrink-0 overflow-hidden rounded-full ring-2 ring-border shadow-xl bg-primary/10">
                    {user.avatarUrl ? (
                      <img
                        src={user.avatarUrl}
                        alt={user.name}
                        className="aspect-square h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-2xl font-bold text-primary">
                        {user.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div
                    className="absolute bottom-1 right-1 h-4 w-4 rounded-full bg-green-400 border-2 border-card"
                    title="Online"
                  />
                </div>

                <div>
                  <h1 className="text-xl font-bold leading-tight">{user.name}</h1>
                  <p className="text-muted-foreground font-mono text-sm">
                    @{user.username}
                  </p>
                </div>

                {user.bio && (
                  <p className="text-sm text-foreground/80 leading-relaxed">
                    {user.bio}
                  </p>
                )}

                <button className="inline-flex w-full items-center justify-center rounded-md border border-border bg-transparent px-3 py-1.5 text-sm font-medium font-mono shadow-sm transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
                  <Users className="h-3.5 w-3.5 mr-1.5" /> Follow
                </button>

                <div className="flex items-center gap-3 text-sm font-mono">
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Users className="h-4 w-4 shrink-0" />
                    <span className="font-semibold text-foreground">
                      {user.followers.toLocaleString()}
                    </span>
                    <span>followers</span>
                  </span>
                  <span className="text-muted-foreground">·</span>
                  <span className="text-muted-foreground">
                    <span className="font-semibold text-foreground">
                      {user.following.toLocaleString()}
                    </span>{" "}
                    following
                  </span>
                </div>

                <div className="space-y-2 text-sm border-t border-border pt-4">
                  {user.location && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4 shrink-0 text-muted-foreground/60" />
                      <span>{user.location}</span>
                    </div>
                  )}
                  {user.website && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Link2 className="h-4 w-4 shrink-0 text-muted-foreground/60" />
                      <a
                        href={user.website}
                        target="_blank"
                        rel="noreferrer"
                        className="text-primary hover:underline truncate"
                      >
                        {user.website.replace(/^https?:\/\//, "")}
                      </a>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <BookOpen className="h-4 w-4 shrink-0 text-muted-foreground/60" />
                    <span>{user.publicRepos} public repositories</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── Main ───────────────────────────────────── */}
          <div className="lg:col-span-3 space-y-6">
            {!userLoading && user && <ContributionGraph username={username} />}

            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold font-mono uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  Repositories
                  {repos && (
                    <span className="text-xs px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                      {repos.length}
                    </span>
                  )}
                </h2>
              </div>

              <div className="space-y-3">
                {reposLoading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <div
                      key={i}
                      className="p-4 border border-border rounded-xl bg-card space-y-2"
                    >
                      <div className="animate-pulse bg-primary/10 rounded-md h-5 w-48" />
                      <div className="animate-pulse bg-primary/10 rounded-md h-4 w-full" />
                      <div className="flex gap-4">
                        <div className="animate-pulse bg-primary/10 rounded-md h-3 w-16" />
                        <div className="animate-pulse bg-primary/10 rounded-md h-3 w-12" />
                        <div className="animate-pulse bg-primary/10 rounded-md h-3 w-12" />
                      </div>
                    </div>
                  ))
                ) : repos?.length === 0 ? (
                  <div className="p-14 text-center border border-border rounded-xl bg-card text-muted-foreground">
                    <BookOpen className="h-10 w-10 mx-auto mb-3 opacity-30" />
                    <p className="font-mono text-sm">No public repositories</p>
                  </div>
                ) : (
                  repos?.map((repo) => {
                    const isStarred = starredRepos.has(repo.id);
                    const displayStars = repo.stars + (isStarred ? 1 : 0);
                    return (
                      <div
                        key={repo.id}
                        className="p-4 border border-border rounded-xl bg-card hover:border-primary/40 hover:shadow-md hover:shadow-primary/5 transition-all group"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              {repo.isPrivate ? (
                                <Lock className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                              ) : (
                                <Globe className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                              )}
                              <span className="font-semibold text-primary font-mono group-hover:underline cursor-pointer">
                                {repo.name}
                              </span>
                              <span className="inline-flex items-center rounded-full border border-border px-1.5 py-0 text-xs font-semibold font-mono text-foreground">
                                {repo.isPrivate ? "Private" : "Public"}
                              </span>
                            </div>

                            {repo.description && (
                              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                                {repo.description}
                              </p>
                            )}

                            {repo.topics && repo.topics.length > 0 && (
                              <div className="flex flex-wrap gap-1.5 mb-3">
                                {repo.topics.map((topic) => (
                                  <span
                                    key={topic}
                                    className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-mono"
                                  >
                                    {topic}
                                  </span>
                                ))}
                              </div>
                            )}

                            <div className="flex items-center gap-4 text-xs font-mono text-muted-foreground">
                              {repo.language && (
                                <span className="flex items-center gap-1.5">
                                  <span
                                    className="w-2.5 h-2.5 rounded-full"
                                    style={{ backgroundColor: LANGUAGE_COLORS[repo.language] ?? "#8b949e" }}
                                  />
                                  {repo.language}
                                </span>
                              )}
                              <span className="flex items-center gap-1">
                                <Star
                                  className={`h-3.5 w-3.5 ${
                                    isStarred
                                      ? "text-yellow-400 fill-yellow-400"
                                      : ""
                                  }`}
                                />
                                {displayStars.toLocaleString()}
                              </span>
                              <span className="flex items-center gap-1">
                                <GitFork className="h-3.5 w-3.5" />
                                {repo.forks.toLocaleString()}
                              </span>
                              {repo.openIssues > 0 && (
                                <span className="flex items-center gap-1 text-red-400">
                                  <AlertCircle className="h-3.5 w-3.5" />
                                  {repo.openIssues} issues
                                </span>
                              )}
                            </div>
                          </div>

                          {/*start repo components*/}
                          <button
                            onClick={() => toggleStar(repo.id)}
                            className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-mono transition-all ${
                              isStarred
                                ? "border-yellow-500/40 bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20"
                                : "border-border bg-muted/30 text-muted-foreground hover:text-foreground hover:border-muted-foreground/50"
                            }`}
                          >
                            <Star
                              className={`h-3.5 w-3.5 ${
                                isStarred ? "fill-yellow-400" : ""
                              }`}
                            />
                            {isStarred ? "Starred" : "Star"}
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}