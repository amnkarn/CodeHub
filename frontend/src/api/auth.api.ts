import axiosInstanse from "../lib/axiosInstance";


interface RegisterUser {
    username: string,
    email: string,
    name: string,
    password: string
}

export const registerApi = async ({ username, email, name, password }: RegisterUser) => {
    try {
        const response = await axiosInstanse.post("/auth/register", { username, email, name, password });
        return response.data;

    } catch (error) {
        console.log(error);
    }
}

export const loginApi = async ({ username, password }: { username: string, password: string }) => {
    try {
        const response = await axiosInstanse.post("/auth/login", { username, password });
        return response.data;

    } catch (error) {
        console.log(error);
    }
}

export const logoutApi = async () => {
    try {
        const response = await axiosInstanse.post("/auth/logout");
        return response.data;

    } catch (error) {
        console.log(error);
    }
}

export const refreshTokenApi = async () => {
    try {
        const response = await axiosInstanse.get("/auth/refresh-token");
        return response.data;

    } catch (error) {
        console.log(error);
    }
}