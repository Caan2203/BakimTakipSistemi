import api from "../api";

export const personelleriGetir = async () => {
    const response = await api.get("/Employees");
    return response.data;
};

export const personelEkle = async (personel) => {
    const response = await api.post("/Employees", personel);
    return response.data;
};

export const personelGuncelle = async (id, personel) => {
    await api.put(`/Employees/${id}`, personel);
};

export const personelSil = async (id) => {
    await api.delete(`/Employees/${id}`);
};