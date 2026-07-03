import Menu from "../bilesenler/Menu";

function AnaDuzen({ children }) {
    return (
        <div className="d-flex">

            <Menu />

            <div className="container-fluid p-4">
                {children}
            </div>

        </div>
    );
}

export default AnaDuzen;