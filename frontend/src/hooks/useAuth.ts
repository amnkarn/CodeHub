import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { loginApi, logoutApi, registerApi } from "../api/auth.api";
import axios from "axios";


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

function extractErrorMessage(error: unknown, fallback: string): string {
    if (axios.isAxiosError(error)) {
        return error.response?.data?.message ?? fallback;
    }
    if (error instanceof Error) {
        return error.message;
    }
    return fallback;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if(!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }

    const { user, setUser, loading, setLoading } = context;
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async ({username, password}: Login) => {
        setLoading(true);
        setError(null);

        try {
            const data = await loginApi({username, password});
            setUser(data.user);
            return true;

        } catch (err) {
            const message = extractErrorMessage(err, "Login failed");
            setError(message);
            return false;
        } finally {
            setLoading(false);
        }
    }

    const handleRegister = async ({ username, email, name, password }: Register) => {
        setLoading(true);
        setError(null);

        try {
            const data = await registerApi({username, email, name, password});
            setUser(data.data);
            return true;

        } catch (err) {
            const message = extractErrorMessage(err, "Registration failed");
            setError(message);
            return false;
        } finally {
            setLoading(false);
        }
    }

    const handleLogout = async () => {
        setLoading(true);
        setError(null);

        try {
            await logoutApi();
            setUser(null);
            return true;
        } catch (err) {
            const message = extractErrorMessage(err, "Logout failed");
            setError(message);
            return false;
        } finally {
            setLoading(false);
        }
    }

    return { user, loading, error, handleLogin, handleRegister, handleLogout }
}