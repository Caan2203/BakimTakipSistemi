import Menu from "../bilesenler/Menu";

function AnaDuzen({ children }) {
    return (
        <div className="d-flex">

            <Menu />

            <main
                className="flex-grow-1"
                style={{
                    marginLeft: "260px",
                    minHeight: "100vh",
                    background: "#f5f7fb",
                    padding: "30px"
                }}
            >
                {children}
            </main>

        </div>
    );
}

export default AnaDuzen;