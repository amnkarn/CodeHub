import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { loginApi, logoutApi, registerApi } from "../api/auth.api";


interface Register {
    username: string,
    email: string,
    name: string,
    password: string
}

interface Login {
    username: string,
    password: string
}

export function useAuth() {
    const context = useContext(AuthContext);
    if(!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }

    const { user, setUser, loading, setLoading } = context;

    const handleLogin = async ({username, password}: Login) => {
        setLoading(true);

        try {
            const data = await loginApi({username, password});
            setUser(data.user);
            return true;

        } catch {
            console.log("Client side error in login function");
        } finally {
            setLoading(false);
        }
    }

    const handleRegister = async ({ username, email, name, password }: Register) => {
        setLoading(true);

        try {
            const data = await registerApi({username, email, name, password});
            setUser(data.user);
            return true;

        } catch {
            console.log("Client side error in regeistre function");
            return false;
        } finally {
            setLoading(false);
        }
    }

    const handleLogout = async () => {
        setLoading(true);

        try {
            await logoutApi();
            setUser(null);
            return true;
        } catch {
            console.log("Client side error in logout function");
            return false;
        } finally {
            setLoading(false);
        }
    }

    return { user, loading, handleLogin, handleRegister, handleLogout }
}