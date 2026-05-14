# 1. Create a repo on the CodeHub website → get the repoId from the URL or response
# 2. In their project folder:
codehub init --repo abc-123-uuid

# 3. Normal workflow:
codehub add app.ts
codehub add index.ts
codehub commit "first commit"
codehub push

# 4. On another machine:
codehub init --repo abc-123-uuid
codehub pull