import { useCallback } from "react";
import Particles from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

function ParticlesBackground() {

    const particlesInit = useCallback(async (engine) => {
        await loadSlim(engine);
    }, []);

    return (
        <Particles
            id="particles"
            init={particlesInit}
            options={{
                fullScreen: {
                    enable: true,
                    zIndex: -1
                },

                background: {
                    color: "#f8fafc"
                },

                fpsLimit: 60,

                particles: {
                    number: {
                        value: 65
                    },

                    color: {
                        value: "#2563eb"
                    },

                    links: {
                        enable: true,
                        color: "#60a5fa",
                        distance: 150,
                        opacity: 0.35
                    },

                    move: {
                        enable: true,
                        speed: 1
                    },

                    opacity: {
                        value: 0.4
                    },

                    size: {
                        value: 3
                    }
                },

                interactivity: {
                    events: {
                        onHover: {
                            enable: true,
                            mode: "grab"
                        }
                    },

                    modes: {
                        grab: {
                            distance: 180
                        }
                    }
                }
            }}
        />
    );
}

export default ParticlesBackground;