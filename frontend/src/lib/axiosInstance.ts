import axios from "axios";

const axiosInstanse = axios.create({
    baseURL: import.meta.env.VITE_SERVER_URI ?? "http://localhost:3000/api/v1",
    withCredentials: true,
})


export default axiosInstanse;