import { useRoutes } from "react-router-dom"
import LandingPage from "./pages/LandingPage";
import Home from "./pages/Home";

const AppRouter = () => {


    const elements = useRoutes([
        {
            path: "/",
            element: <LandingPage />
        },
        {
            path: "/home",
            element: <Home />
        }
    ])


    return elements;
}

export default AppRouter;