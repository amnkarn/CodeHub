import axiosInstanse from "../lib/axiosInstance";

export const getCurrentUserApi = async () => {
    const response = await axiosInstanse.get("/user/me");
    return response.data.user;
}

export const getUserByUsernameApi = async (username: string) => {
    const response = await axiosInstanse.get(`/user/${username}`);
    return response.data.user;
}

export const getUserFollowersApi = async (username: string) => {
    const response = await axiosInstanse.get(`/user/${username}/following`);
    return response.data.userFollowers.followedBy;
}

export const getUserFollowingApi = async (username: string) => {
    const response = await axiosInstanse.get(`/user/${username}/followers`);
    return response.data.userFollowing.following;
}

// Follow a user
export const followUserApi = async (targetUsername: string) => {
  const response = await axiosInstanse.post(`/user/follow?target=${targetUsername}`);
  return response.data;
};

// Unfollow a user
export const unfollowUserApi = async (targetUsername: string) => {
  const response = await axiosInstanse.post(`/user/unfollow?target=${targetUsername}`);
  return response.data;
};