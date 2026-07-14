import api from "../api";

export const urunleriGetir = async () => {
    const response = await api.get("/Products");
    return response.data;
};

export const urunEkle = async (urun) => {
    const response = await api.post("/Products", urun);
    return response.data;
};

export const urunGuncelle = async (id, urun) => {
    await api.put(`/Products/${id}`, urun);
};

export const urunSil = async (id) => {
    await api.delete(`/Products/${id}`);
};
export const yaklasanBakimlariGetir = async () => {
    const response = await api.get("/Products/upcoming");
    return response.data;
};
export const uygunUrunleriGetir = async () => {
    const response = await api.get("/Products/available");
    return response.data;
};
 
export const urunDetayiGetir = async (id) => {
    const response = await api.get(`/Products/${id}/detail`);
    return response.data;
}; 
export const urunLoglariniGetir = async (id) => {
    const response = await api.get(`/Products/${id}/history`);
    return response.data;
};    