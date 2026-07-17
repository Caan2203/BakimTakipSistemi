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
export const personelDetayiGetir = async (id) => {
    const response = await api.get(`/Employees/${id}/detail`);
    return response.data;
};
export const personelExcelIndir = async () => {

    const response = await api.get("/Employees/excel", {
        responseType: "blob"
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));

    const link = document.createElement("a");

    link.href = url;

    link.download = "Personeller.xlsx";

    document.body.appendChild(link);

    link.click();

    link.remove();
};