import { useEffect, useRef } from "react";
import { Battlefield } from "@nexustable/battlefield";
import { GMSidebar } from "./components/gm-sidebar/GMSidebar";
import "./App.css";

function App() {
  const battlefieldContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = battlefieldContainerRef.current;

    if (!container) {
      return;
    }

    const battlefield = new Battlefield();

    battlefield.initialize(container);
  }, []);

  return (
    <main className="app">
      <div
        ref={battlefieldContainerRef}
        className="app__battlefield"
      />

      <GMSidebar />
    </main>
  );
}

export default App;