import api from "../api";

export const zimmetleriGetir = async () => {
    const response = await api.get("/Zimmet");
    return response.data;
};

export const zimmetEkle = async (zimmet) => {
    const response = await api.post("/Zimmet", zimmet);
    return response.data;
};
export const zimmetIadeEt = async (id) => {
    await api.put(`/Zimmet/iade/${id}`);
};
export const urunZimmetGecmisiGetir = async (productId) => {
    const response = await api.get(`/Zimmet/product/${productId}`);
    return response.data;
};
export const personelZimmetleriniGetir = async (id) => {
    const response = await api.get(`/Zimmet/employee/${id}`);
    return response.data;
};

export const aktifPersonelZimmetleriniGetir = async (id) => {
    const response = await api.get(`/Zimmet/employee/${id}/active`);
    return response.data;
};  
