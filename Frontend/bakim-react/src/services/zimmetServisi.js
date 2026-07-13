import api from "../api";

export const zimmetleriGetir = async () => {
    const response = await api.get("/Zimmet");
    return response.data;
};

export const zimmetEkle = async (zimmet) => {
    const response = await api.post("/Zimmet", zimmet);
    return response.data;
};