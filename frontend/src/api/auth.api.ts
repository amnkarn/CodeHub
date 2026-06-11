import axiosInstanse from "../lib/axiosInstance";
import { getCurrentUserApi } from "./user.api";


interface RegisterUser {
    username: string,
    email: string,
    name: string,
    password: string
}

export const registerApi = async ({ username, email, name, password }: RegisterUser) => {
    const response = await axiosInstanse.post("/auth/register", { username, email, name, password });
    console.log("api response: ", response);
    return response.data;
}

export const loginApi = async ({ username, password }: { username: string, password: string }) => {
    const response = await axiosInstanse.post("/auth/login", { username, password });
    return response.data;
}

export const logoutApi = async () => {
    const response = await axiosInstanse.post("/auth/logout");
    return response.data;
}

export const refreshTokenApi = async () => {
    const response = await axiosInstanse.get("/auth/refresh-token");
    return response.data;
}

export const getMe = getCurrentUserApi;