import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:5112/api"
});

export default api;