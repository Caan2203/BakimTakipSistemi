import { Outlet } from "react-router-dom";
import Menu from "../bilesenler/Menu";

function AnaDuzen() {
    return (
        <div className="d-flex">

            <Menu />

            <div className="container-fluid p-4">
                <Outlet />
            </div>

        </div>
    );
}

export default AnaDuzen;