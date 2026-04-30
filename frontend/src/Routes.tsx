import { useRoutes } from "react-router-dom"
import LandingPage from "./LandingPage";
import Home from "./Home";


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