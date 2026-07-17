import { Outlet } from "react-router-dom";
import Menu from "../bilesenler/Menu";

function AnaDuzen() {
    return (
        <div 
            className="d-flex bg-light" 
            style={{ 
                height: "100vh", 
                overflow: "hidden" 
            }}
        >
            <Menu />

            <div
                className="flex-grow-1"
                style={{
                    minWidth: 0,
                    height: "100%",
                    padding: "28px",
                    overflowY: "auto",
                    overflowX: "auto" 
                }}
            >
                <Outlet />
            </div>

        </div>
    );
}

export default AnaDuzen;