import React, { useState, useEffect, createContext } from "react"
import { getMe } from "../api/auth.api"


interface AuthContextType {
    user: null | object
    setUser: React.Dispatch<React.SetStateAction<null | object>>
    loading: boolean
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
}


export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({children}: {children: React.ReactNode}) => {
    
    const [user, setUser] = useState<null | object>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getAndSetUser = async () => {
            setLoading(true); //before fetching from backend
            
            try {
                const userData = await getMe();
                setUser(userData);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        }

        getAndSetUser();
    }, [])


    return (
        <AuthContext.Provider value={{user, setUser, loading, setLoading}}>
            { children }
        </AuthContext.Provider>
    )
}