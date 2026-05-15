import { Routes, Route } from "react-router-dom";
import Home from "./src/pages/Home"
import LandingPage from "./src/pages/LandingPage"
import AuthPage from "./src/pages/Auth"


export default function AppRouter() {
    return (
        <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/home" element={<Home />} />
            <Route path="/register" element={<AuthPage />} />
            <Route path="/login" element={<AuthPage />} />
        </Routes>
    );
}