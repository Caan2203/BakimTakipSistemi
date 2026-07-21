import api from "../api";

export const bildirimleriGetir = () => {
    return api.get("/Notifications");
};

export const bildirimiOku = (id) => {
    return api.put(`/Notifications/read/${id}`);
};