import { useRoutes } from "react-router-dom"
import LandingPage from "./pages/LandingPage";
import Home from "./pages/Home";
import AuthPage from "./pages/Auth";

const AppRouter = () => {


    const elements = useRoutes([
        {
            path: "/",
            element: <LandingPage />
        },
        {
            path: "/home",
            element: <Home />
        },
        {
            path: "/register",
            element: <AuthPage />
        },
        {
            path: "/login",
            element: <AuthPage />
        }
    ])


    return elements;
}

export default AppRouter;