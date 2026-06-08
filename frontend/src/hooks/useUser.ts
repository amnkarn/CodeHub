import { useEffect, useState } from "react";
import { getCurrentUserApi, getUserByUsernameApi, getUserFollowersApi, getUserFollowingApi } from "../api/user.api";
import { useAuth } from "./useAuth";


export default function useUser(username?: string, isCurrentUser: boolean = false) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const {user: currentUser} = useAuth();

    useEffect(() => {
        const fetchUserData = async () => {
            setLoading(true);

            try {
                let userData;

                if (isCurrentUser) {
                    userData = await getCurrentUserApi();
                } else if (username) {
                    userData = await getUserByUsernameApi(username);

                    try { //Fetch followers and following data for the public profile
                        const followers = await getUserFollowersApi(username);
                        const following = await getUserFollowingApi(username);
                        userData.followers = followers;
                        userData.following = following;
                    } catch (err) {
                        console.warn("Could not fetch followers/following data:", err);
                    }
                } else if (currentUser) {
                    userData = await getCurrentUserApi();
                }

                if(!userData) {
                    throw new Error("Failed to fetch user data");
                }

                setUser(userData)
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