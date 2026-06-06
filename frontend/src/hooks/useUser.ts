import { useEffect, useState } from "react";
import { getCurrentUserApi, getUserByUsernameApi } from "../api/user.api";


export default async function useUser(username?: string, isCurrentUser: boolean = false) {
    const [user, setUser] = useState(null);
    const [repos, setRepos] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            setLoading(true);

            try {
                let userData;
                
                if(isCurrentUser) {
                    userData = await getCurrentUserApi();
                } else if(username) {
                    userData = await getUserByUsernameApi(username);
                }

                setUser(userData)
            } catch (error) {
                console.log('Error in useUser: ', error);
            } finally {
                setLoading(false);
            }
        }

        fetchUserData();
    }, [username, isCurrentUser])

    return { user, repos, loading }
}