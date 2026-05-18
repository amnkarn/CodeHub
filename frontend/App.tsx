import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./src/pages/Home"
import LandingPage from "./src/pages/LandingPage"
import AuthPage from "./src/pages/Auth"
import { useAuth } from "./src/hooks/useAuth";
import Loader from "./src/components/Loader";


export default function AppRouter() { 
    return (
        <Routes>
            <Route path="/" element={<LandingPage />} />

            <Route path="/home" element={
                <ProtectedRoute>
                    <Home />
                </ProtectedRoute>
            } />

            <Route path="/register" element={<AuthPage />} />
            <Route path="/login" element={<AuthPage />} />
        </Routes>
    );
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();

    if(loading) {
        return <Loader />
    }

    if(!user) {
        return <Navigate to={"/"} />
    }

    return <>{children}</>
}