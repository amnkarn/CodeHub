import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import LandingPage from "./pages/LandingPage";
import AuthPage from "./pages/Auth";
import Loader from "./components/Loader";
import { useAuth } from "./hooks/useAuth";
import ProfilePage from "./pages/ProfilePage";

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

            <Route path="/me" element={
                <ProtectedRoute>
                    <ProfilePage />
                </ProtectedRoute>
            } />

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