import { useEffect, useState } from "react";
import { askQuestion } from "./api";
import "./App.css";

function TypeWriter({ text }) {
  const [shown, setShown] = useState("");

  useEffect(() => {
    setShown("");
    if (!text) return;

    let i = 0;
    const interval = setInterval(() => {
      setShown(text.slice(0, i));
      i++;
      if (i > text.length) clearInterval(interval);
    }, 12);

    return () => clearInterval(interval);
  }, [text]);

  return <p className="pen-text">{shown}</p>;
}

function App() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [timeTaken, setTimeTaken] = useState(null);
  const [liveTimer, setLiveTimer] = useState(0);

  const cleanText = (text) =>
    text
      ?.replace(/###/g, "")
      .replace(/\*\*/g, "")
      .replace(/\*/g, "")
      .trim();

  const extractSection = (label) => {
    const regex = new RegExp(
      `${label}\\s*[:\\n]\\s*([\\s\\S]*?)(?=Summary|Key Drivers|Sentiment|Confidence|Sources|$)`,
      "i"
    );
    const match = cleanText(answer).match(regex);
    return match ? match[1].trim() : "Not available";
  };

  const getSummary = () => {
    let text = cleanText(answer || "");
    text = text.replace(/Summary\s*[:\n]/i, "");
    text = text.replace(/Key Drivers[\s\S]*/i, "");
    return text.trim() || "Your answer will appear here.";
  };

  const handleAsk = async () => {
    setLoading(true);
    setAnswer("");
    setSources([]);
    setTimeTaken(null);
    setLiveTimer(0);

    const start = performance.now();

    const timerInterval = setInterval(() => {
      setLiveTimer((prev) => prev + 1);
    }, 1000);

    try {
      const data = await askQuestion(question);
      const end = performance.now();

      setAnswer(data.answer || "");
      setSources(data.sources || []);
      setTimeTaken(((end - start) / 1000).toFixed(2));
    } catch {
      setAnswer("Backend error. Check FastAPI and Ollama are running.");
    } finally {
      clearInterval(timerInterval);
      setLoading(false);
    }
  };

  return (
    <div className="app">
      {loading && <div className="corner-timer">⏱ {liveTimer}s</div>}

      <div className={loading ? "neuron-layer active" : "neuron-layer"}>
        <span></span><span></span><span></span><span></span><span></span>
      </div>

      <header className="hero">
        <h1>AI Finance Intelligence</h1>
        <p>Source-backed market insights powered by RAG</p>
      </header>

      <section className="question-card">
        <textarea
          placeholder="Ask: Why is Tesla stock moving this week?"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />

        <button onClick={handleAsk} disabled={loading || !question}>
          {loading ? "Analyzing Market Data..." : "Ask AI →"}
        </button>

        {timeTaken && <p className="timer">Answered in {timeTaken} seconds</p>}
      </section>

      <main className="grid">
        <section className="card answer">
          <h2>Answer</h2>
          {loading ? <p>Writing answer...</p> : <TypeWriter text={getSummary()} />}
        </section>

        <section className="card">
          <h2>Key Drivers</h2>
          {loading ? <p>Finding drivers...</p> : <TypeWriter text={extractSection("Key Drivers")} />}
        </section>

        <section className="card sentiment">
          <h2>Sentiment</h2>
          {loading ? <p>Analyzing sentiment...</p> : <TypeWriter text={extractSection("Sentiment")} />}
        </section>

        <section className="card confidence">
          <h2>Confidence</h2>
          {loading ? <p>Checking confidence...</p> : <TypeWriter text={extractSection("Confidence")} />}
        </section>

        <section className="card sources">
          <h2>Sources</h2>
          {sources.length === 0 && <p>No sources yet.</p>}
          {sources.map((s, i) => (
            <a key={i} href={s.url} target="_blank" rel="noreferrer">
              🔗 {s.title}
            </a>
          ))}
        </section>
      </main>
    </div>
  );
}

export default App;