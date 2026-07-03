import api from "../api";

export const bakimlariGetir = async () => {
    const response = await api.get("/Maintenance");
    return response.data;
};

export const bakimEkle = async (bakim) => {
    const response = await api.post("/Maintenance", bakim);
    return response.data;
};

export const bakimGuncelle = async (id, bakim) => {
    await api.put(`/Maintenance/${id}`, bakim);
};

export const bakimSil = async (id) => {
    await api.delete(`/Maintenance/${id}`);
};