import axios from "axios";

const API = "https://localhost:7020/api/products";

export const qrUrunGetir = async (qrCode) => {
    const response = await axios.get(`${API}/qr/${qrCode}`);
    return response.data;
};