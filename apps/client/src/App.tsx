import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import "./App.css";

const socket = io("http://localhost:3001", {
  autoConnect: true
});

function App() {
  const [connected, setConnected] = useState(false);
  const [version, setVersion] = useState("");

useEffect(() => {
  socket.on("connect", () => {
    console.log("Connected to NexusTable server");

    socket.emit("request-status");
  });

socket.on("server-status", (data) => {
  console.log("Server status received:", data);

  setConnected(data.connected);
  setVersion(data.version);
});

  return () => {
    socket.off("connect");
    socket.off("server-status");
  };
}, []);

  return (
    <div className="app">
      <div className="card">
        <h1>NexusTable</h1>

        <p>
          Server Status:
          {" "}
          {connected ? (
            <span className="online">
              🟢 Connected
            </span>
          ) : (
            <span className="offline">
              🔴 Disconnected
            </span>
          )}
        </p>

        <p>
          Version: {version || "Loading..."}
        </p>
      </div>
    </div>
  );
}

export default App;