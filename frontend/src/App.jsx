import { useState } from "react";
import { checkBackendHealth } from "./api";
import "./App.css";

function App() {
  const [status, setStatus] = useState("");

  const testBackend = async () => {
    try {
      const data = await checkBackendHealth();
      setStatus(data.status);
    } catch (error) {
      setStatus("Backend connection failed");
    }
  };

  return (
    <div>
      <h1>Trustworthy Finance RAG</h1>
      <button onClick={testBackend}>Test Backend</button>
      <p>{status}</p>
    </div>
  );
}

export default App;