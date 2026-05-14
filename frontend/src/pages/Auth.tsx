import { useLocation, useNavigate } from "react-router-dom"


export default function AuthPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const isRegisterMode = location.pathname === '/register'

    return (
        <div className="w-full h-screen bg-[#0d1117]">

            <div className="flex flex-col items-center pt-10 w-[25%] text-white place-self-center gap-5 px-3">

                <div className="flex items-center gap-2 cursor-pointer hover:bg-blue-950">
                    <img src="../logo.png" alt="#logo" className="w-14 rounded-full" />
                </div>

                <h3 className="font-bold text-xl">{!isRegisterMode ? "Sign in to CodeHub" : "Sign up to CodeHub"}</h3>



                <div className="flex flex-col mt-5 gap-3 w-full">
                    <div className="flex flex-col ">
                        <label className="font-bold text-[15px] pb-0.5">{isRegisterMode ? "Username" : "Username or email address"}</label>
                        <input 
                            type="text" 
                            className="border rounded-lg py-2 border-gray-600 pl-2 placeholder:text-sm" placeholder={`${isRegisterMode ? "enter your username" : "enter your username or email"}`}
                        />
                    </div>

                    { isRegisterMode && 
                        <div className="flex flex-col ">
                            <label className="font-bold text-[15px] pb-0.5">Email</label>
                            <input 
                                type="email"
                                className="border rounded-lg py-2 border-gray-600 pl-2 placeholder:text-sm" 
                                placeholder="enter your email"
                            />
                        </div>
                    }

                    { isRegisterMode && 
                        <div className="flex flex-col ">
                            <label className="font-bold text-[15px] pb-0.5">Name</label>
                            <input 
                                type="text" 
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
                            className="border rounded-lg py-2 pl-2 border-gray-600 placeholder:text-sm" 
                            placeholder="enter you password"
                        />
                    </div>


                </div>

                <div className="w-full mt-5">
                    <button className="w-full py-2 rounded-md bg-green-600">
                        {isRegisterMode ? "Sign up" : "Sign in"}
                    </button>

                    { isRegisterMode ? 
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
            </div>

            <Footer />
        </div>
    )
}

function Footer() {
    return (
        <div className="w-full fixed py-5 bottom-0 flex justify-center items-center gap-8 text-gray-400 text-xs bg-[#151b23]">
            <a href="">Terms</a>
            <a href="">Privacy</a>
            <a href="">Docs</a>
            <a href="">Contact CodeHub Support</a>
            <a href="">Manage cookies</a>
            <a href="">Do not share my personal information</a>
        </div>
    )
}