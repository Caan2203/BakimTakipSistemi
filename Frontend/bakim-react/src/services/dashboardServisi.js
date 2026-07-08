import api from "../api";

export const dashboardBilgileriniGetir = async () => {
    const response = await api.get("/Dashboard");
    return response.data;
};

export const sonBakimlariGetir = async () => {
    const response = await api.get("/Maintenance");
    return response.data;
};

export const urunleriGetir = async () => {
    const response = await api.get("/Products");
    return response.data;
};
export const personelleriGetir = async () => {
    const response = await api.get("/Employees");
    return response.data;
};