import { useEffect, useState } from "react";
import { 
    getCurrentUserApi, 
    getUserByUsernameApi, 
    getUserFollowersApi, 
    getUserFollowingApi,
    getUserRepositoriesApi
} from "../api/user.api";
import { useAuth } from "./useAuth";
import type { UserProfile } from "../types/user";

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