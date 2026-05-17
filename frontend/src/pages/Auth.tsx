import { useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "../hooks/useAuth";
import Loader from "../components/Loader";


export default function AuthPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const isRegisterMode = location.pathname === '/register';

    const { loading, handleLogin, handleRegister } = useAuth();

    async function sendReq(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const form = e.currentTarget;

        const username = (form.elements.namedItem("username") as HTMLInputElement | null)?.value || "";
        const password = (form.elements.namedItem("password") as HTMLInputElement | null)?.value || "";


        if(isRegisterMode) {
            const name = (form.elements.namedItem("name") as HTMLInputElement | null)?.value || "";
            const email = (form.elements.namedItem("email") as HTMLInputElement | null)?.value || "";
            console.log("Processing Registration...", { username, email, name, password });

            const success = await handleRegister({username, email, name, password});
            console.log(success);
            if(success) {
                //show the flash
                navigate("/home");
            }

        } else { //login form
            console.log("Processing Login...", { username, password });

            const success = await handleLogin({ username, password });
            if (success) {
                navigate("/home");
            }
        }
    }

    return (
        <div className="w-full h-screen bg-[#0d1117]">

            { loading && <Loader />}

            <div className="flex flex-col items-center pt-10 w-[25%] text-white place-self-center gap-5 px-3">
                <div className="flex items-center gap-2 cursor-pointer hover:scale-105">
                    <img src="../logo.png" alt="#logo" className="w-14 rounded-full" />
                </div>

                <h3 className="font-bold text-xl">{!isRegisterMode ? "Sign in to CodeHub" : "Sign up to CodeHub"}</h3>


                <form className="flex flex-col mt-5 gap-3 w-full" id="authForm" onSubmit={sendReq} >
                    <div className="flex flex-col ">
                        <label className="font-bold text-[15px] pb-0.5">{isRegisterMode ? "Username" : "Username or email address"}</label>
                        <input
                            type="text"
                            name="username"
                            required
                            className="border rounded-lg py-2 border-gray-600 pl-2 placeholder:text-sm" placeholder={`${isRegisterMode ? "enter your username" : "enter your username or email"}`}
                        />
                    </div>

                    {isRegisterMode &&
                        <div className="flex flex-col ">
                            <label className="font-bold text-[15px] pb-0.5">Email</label>
                            <input
                                type="email"
                                name="email"
                                required
                                className="border rounded-lg py-2 border-gray-600 pl-2 placeholder:text-sm"
                                placeholder="enter your email"
                            />
                        </div>
                    }

                    {isRegisterMode &&
                        <div className="flex flex-col ">
                            <label className="font-bold text-[15px] pb-0.5">Name</label>
                            <input
                                type="text"
                                name="name"
                                required
                                className="border rounded-lg py-2 border-gray-600 pl-2 placeholder:text-sm"
                                placeholder="enter you name"
                            />
                        </div>
                    }

                    <div className="flex flex-col ">
                        <div className="flex items-center justify-between pb-0.5">
                            <label className="font-bold text-[15px]">Password</label>
                            <label className="text-[15px] text-blue-400">Forgot password</label>
                        </div>
                        <input
                            type="password"
                            name="password"
                            required
                            className="border rounded-lg py-2 pl-2 border-gray-600 placeholder:text-sm"
                            placeholder="enter you password"
                        />
                    </div>


                    <div className="w-full mt-5">
                        <button className="w-full py-2 rounded-md text-white font-semibold bg-green-600 transform transition duration-150 hover:bg-green-700 hover:scale-[1.01] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-green-500">
                            {isRegisterMode ? "Sign up" : "Sign in"}
                        </button>

                        {isRegisterMode ?
                            <p className="text-[15px] pt-1">Already registered? &nbsp;
                                <span
                                    className="text-blue-400 cursor-pointer"
                                    onClick={() => navigate("/login")}>
                                    login to your account
                                </span>
                            </p>
                            :
                            <p className="text-[15px] pt-1">New to CodeHub? &nbsp;
                                <span
                                    className="text-blue-400 cursor-pointer"
                                    onClick={() => navigate("/register")}>
                                    create an account
                                </span>
                            </p>
                        }
                    </div>
                </form>

            </div>

            <Footer />
        </div>
    )
}

function Footer() {
    return (
        <div className="w-full fixed py-5 bottom-0 flex justify-center items-center gap-8 text-gray-400 text-xs bg-[#151b23]">
            <a href="" className="hover:underline hover:text-gray-300">Terms</a>
            <a href="" className="hover:underline hover:text-gray-300">Privacy</a>
            <a href="" className="hover:underline hover:text-gray-300">Docs</a>
            <a href="" className="hover:underline hover:text-gray-300">Contact CodeHub Support</a>
            <a href="" className="hover:underline hover:text-gray-300">Manage cookies</a>
            <a href="" className="hover:underline hover:text-gray-300">Do not share my personal information</a>
        </div>
    )
}