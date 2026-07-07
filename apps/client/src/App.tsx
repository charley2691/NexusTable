import { useEffect, useRef } from "react";
import { Battlefield } from "@nexustable/battlefield";

function App() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        const battlefield = new Battlefield();

        battlefield.initialize(containerRef.current);
    }, []);

    return (
        <div
            ref={containerRef}
            style={{
                width: "100vw",
                height: "100vh",
                overflow: "hidden"
            }}
        />
    );
}

export default App;