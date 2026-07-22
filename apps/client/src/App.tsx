import { useEffect, useRef, useState } from "react";
import { GMSidebar } from "./components/gm-sidebar/GMSidebar";
import { NexusClient } from "./core/NexusClient";
import "./App.css";

function App() {
  const battlefieldContainerRef = useRef<HTMLDivElement>(null);
  const nexusClientRef = useRef<NexusClient | null>(null);
  const [clientReady, setClientReady] = useState(false);

  if (nexusClientRef.current === null) {
    nexusClientRef.current = new NexusClient();
  }

  const nexusClient = nexusClientRef.current;

  useEffect(() => {
    const container = battlefieldContainerRef.current;

    if (!container) {
      return;
    }

    let cancelled = false;

    const initializeClient = async () => {
      await nexusClient.initialize(container);

      if (!cancelled) {
        setClientReady(true);
      }
    };

    void initializeClient();

    return () => {
      cancelled = true;
    };
  }, [nexusClient]);

  return (
    <main className="app">
      <div
        ref={battlefieldContainerRef}
        className="app__battlefield"
      />

      <GMSidebar
        client={nexusClient}
        clientReady={clientReady}
      />
    </main>
  );
}

export default App;