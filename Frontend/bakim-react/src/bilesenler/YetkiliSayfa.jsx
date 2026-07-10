import { Navigate } from "react-router-dom";

function YetkiliSayfa({ children }) {

    const token = localStorage.getItem("token");

    if (!token) {
        return <Navigate to="/giris" replace />;
    }

    return children;
}

export default YetkiliSayfa;