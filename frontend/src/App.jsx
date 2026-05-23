import { useState } from "react";
import { askQuestion } from "./api";
import "./App.css";

function App() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    setLoading(true);
    setAnswer("");
    setSources([]);

    try {
      const data = await askQuestion(question);
      setAnswer(data.answer);
      setSources(data.sources || []);
    } catch {
      setAnswer("Backend error. Check FastAPI and Ollama are running.");
    }

    setLoading(false);
  };

  return (
    <div className="page">
      <div className="card">
        <h1>📊 Trustworthy Finance RAG</h1>
        <p className="subtitle">Ask market questions with source-backed answers.</p>

        <textarea
          placeholder="Example: Why is Nvidia stock moving this week?"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />

        <button onClick={handleAsk} disabled={loading || !question}>
          {loading ? "Analyzing..." : "Ask AI"}
        </button>

        {loading && <div className="loader">⏳ Retrieving news + generating answer...</div>}

        <div className="section">
          <h2>Answer</h2>
          <pre>{answer}</pre>
        </div>

        <div className="section">
          <h2>Sources</h2>
          {sources.map((source, index) => (
            <a key={index} href={source.url} target="_blank">
              🔗 {source.title}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;