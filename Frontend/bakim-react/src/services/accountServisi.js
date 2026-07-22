import axios from "axios";

const API = "https://localhost:7020/api/Account";

export const sifreDegistir = (data) =>
    axios.post(`${API}/change-password`, data);