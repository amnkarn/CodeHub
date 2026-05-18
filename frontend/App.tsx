import { Routes, Route, useNavigate } from "react-router-dom";
import Home from "./src/pages/Home"
import LandingPage from "./src/pages/LandingPage"
import AuthPage from "./src/pages/Auth"
import Cookies from "js-cookie";


export default function AppRouter() {
    return (
        <Routes>
            <Route path="/" element={<LandingPage />} />
            
            <ProtectedRoute>
                <Route path="/home" element={<Home />} />
            </ProtectedRoute>

            <Route path="/register" element={<AuthPage />} />
            <Route path="/login" element={<AuthPage />} />
        </Routes>
    );
}

function ProtectedRoute({children}: {children: React.ReactNode}) {
    const navigate = useNavigate();

    const accessToke = Cookies.get("accessToken");
    const refreshToken = Cookies.get("refreshToken");

    if(!accessToke || !refreshToken) {
        navigate("/");    
    }


    return <>{children}</>
}