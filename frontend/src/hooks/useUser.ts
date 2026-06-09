import { useEffect, useState } from "react";
import { 
    getCurrentUserApi, 
    getUserByUsernameApi, 
    getUserFollowersApi, 
    getUserFollowingApi,
    getUserRepositoriesApi
} from "../api/user.api";
import { useAuth } from "./useAuth";


export interface UserProfile {
  id?: string;
  username: string;
  email: string;
  name: string;
  createdAt: string;
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

export default function useUser(username?: string, isCurrentUser: boolean = false) {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const {user: currentUser} = useAuth();

    useEffect(() => {
        const fetchUserData = async () => {
            setLoading(true);

            try {
                let userData: UserProfile | null = null;
                const shouldFetchCurrent = isCurrentUser || !username;

                if (shouldFetchCurrent && currentUser) {
                    userData = await getCurrentUserApi();
                } else if (username) {
                    userData = await getUserByUsernameApi(username);
                }

                if (userData) {
                    try {
                        const followers = await getUserFollowersApi(userData.username);
                        const following = await getUserFollowingApi(userData.username);
                        const repositories = await getUserRepositoriesApi(userData.username);

                        userData.followers = followers;
                        userData.following = following;
                        userData.repositories = repositories;
                    } catch (err) {
                        console.warn("Could not fetch followers/following/repositories data:", err);
                    }
                }

                if(!userData) {
                    throw new Error("Failed to fetch user data");
                }

                setUser(userData);
            } catch (error) {
                console.log('Error in useUser: ', error);
            } finally {
                setLoading(false);
            }
        }

        fetchUserData();
    }, [username, isCurrentUser, currentUser]);

    return { user, loading }
}