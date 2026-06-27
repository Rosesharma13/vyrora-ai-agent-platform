import React, { useState } from "react";
import axios from "axios";

// Use an environment variable so this works in both local dev and
// production deploys. Falls back to localhost only if nothing is set.
const API_BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

const TABS = ["Research", "Document", "Plan", "Presentation"];

function App() {
  const [activeTab, setActiveTab] = useState("Research");

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <h1 style={styles.title}>Vyrora AI</h1>
        <p style={styles.subtitle}>Multi-Agent Intelligence Platform</p>
      </header>

      <nav style={styles.tabBar}>
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              ...styles.tabButton,
              ...(activeTab === tab ? styles.tabButtonActive : {}),
            }}
          >
            {tab}
          </button>
        ))}
      </nav>

      <main style={styles.main}>
        {activeTab === "Research" && <ResearchPanel />}
        {activeTab === "Document" && <DocumentPanel />}
        {activeTab === "Plan" && <PlanPanel />}
        {activeTab === "Presentation" && <PresentationPanel />}
      </main>
    </div>
  );
}

function ResearchPanel() {
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleResearch = async () => {
    if (!question.trim()) return;
    setLoading(true);
    setResponse("");
    try {
      const res = await axios.post(`${API_BASE}/research`, { question });
      setResponse(res.data.response);
    } catch (error) {
      setResponse("Error connecting to backend: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.panel}>
      <h2 style={styles.panelTitle}>Research Agent</h2>
      <p style={styles.panelDesc}>
        Get an overview, key points, and trends on any topic.
      </p>
      <textarea
        style={styles.textarea}
        rows="4"
        placeholder="Research anything..."
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />
      <button style={styles.button} onClick={handleResearch} disabled={loading}>
        {loading ? "Researching..." : "Research"}
      </button>
      {response && <pre style={styles.output}>{response}</pre>}
    </div>
  );
}

function DocumentPanel() {
  const [file, setFile] = useState(null);
  const [extractedText, setExtractedText] = useState("");
  const [analysis, setAnalysis] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setAnalysis("");
    setAnswer("");
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await axios.post(`${API_BASE}/document/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.data.error) {
        setAnalysis(res.data.error);
      } else {
        setAnalysis(res.data.analysis);
        setExtractedText(res.data.extracted_text);
      }
    } catch (error) {
      setAnalysis("Error connecting to backend: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAsk = async () => {
    if (!question.trim() || !extractedText) return;
    setLoading(true);
    setAnswer("");
    try {
      const res = await axios.post(`${API_BASE}/document/ask`, {
        text: extractedText,
        question,
      });
      setAnswer(res.data.response);
    } catch (error) {
      setAnswer("Error connecting to backend: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.panel}>
      <h2 style={styles.panelTitle}>Document Agent</h2>
      <p style={styles.panelDesc}>
        Upload a PDF or text file for a summary, key points, and Q&A.
      </p>
      <input
        type="file"
        accept=".pdf,.txt"
        onChange={(e) => setFile(e.target.files[0])}
        style={styles.fileInput}
      />
      <button style={styles.button} onClick={handleUpload} disabled={loading || !file}>
        {loading ? "Analyzing..." : "Analyze Document"}
      </button>
      {analysis && <pre style={styles.output}>{analysis}</pre>}

      {extractedText && (
        <div style={{ marginTop: "16px" }}>
          <textarea
            style={styles.textarea}
            rows="2"
            placeholder="Ask a question about this document..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
          <button style={styles.button} onClick={handleAsk} disabled={loading}>
            {loading ? "Thinking..." : "Ask"}
          </button>
          {answer && <pre style={styles.output}>{answer}</pre>}
        </div>
      )}
    </div>
  );
}

function PlanPanel() {
  const [goal, setGoal] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePlan = async () => {
    if (!goal.trim()) return;
    setLoading(true);
    setResponse("");
    try {
      const res = await axios.post(`${API_BASE}/plan`, { goal });
      setResponse(res.data.response);
    } catch (error) {
      setResponse("Error connecting to backend: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.panel}>
      <h2 style={styles.panelTitle}>Planning Agent</h2>
      <p style={styles.panelDesc}>
        Describe a goal and get a concrete, numbered action plan.
      </p>
      <textarea
        style={styles.textarea}
        rows="3"
        placeholder="e.g. Land a junior ML engineer role in 60 days"
        value={goal}
        onChange={(e) => setGoal(e.target.value)}
      />
      <button style={styles.button} onClick={handlePlan} disabled={loading}>
        {loading ? "Planning..." : "Generate Plan"}
      </button>
      {response && <pre style={styles.output}>{response}</pre>}
    </div>
  );
}

function PresentationPanel() {
  const [topic, setTopic] = useState("");
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    setSlides([]);
    setError("");
    try {
      const res = await axios.post(`${API_BASE}/presentation`, { topic });
      setSlides(res.data.slides || []);
    } catch (err) {
      setError("Error connecting to backend: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.panel}>
      <h2 style={styles.panelTitle}>Presentation Agent</h2>
      <p style={styles.panelDesc}>
        Generate a slide-by-slide outline for any topic.
      </p>
      <textarea
        style={styles.textarea}
        rows="2"
        placeholder="e.g. Introduction to Retrieval-Augmented Generation"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
      />
      <button style={styles.button} onClick={handleGenerate} disabled={loading}>
        {loading ? "Generating..." : "Generate Outline"}
      </button>
      {error && <pre style={styles.output}>{error}</pre>}
      {slides.length > 0 && (
        <div style={{ marginTop: "16px" }}>
          {slides.map((slide, i) => (
            <div key={i} style={styles.slideCard}>
              <strong>{i + 1}. {slide.title}</strong>
              <ul>
                {(slide.bullets || []).map((b, j) => (
                  <li key={j}>{b}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  page: {
    maxWidth: "780px",
    margin: "0 auto",
    padding: "32px 20px",
    fontFamily: "system-ui, -apple-system, sans-serif",
    color: "#1a1a1a",
  },
  header: { marginBottom: "24px" },
  title: { fontSize: "28px", margin: 0 },
  subtitle: { fontSize: "14px", color: "#666", marginTop: "4px" },
  tabBar: {
    display: "flex",
    gap: "8px",
    marginBottom: "24px",
    borderBottom: "1px solid #ddd",
    paddingBottom: "8px",
  },
  tabButton: {
    padding: "8px 16px",
    border: "none",
    background: "transparent",
    cursor: "pointer",
    fontSize: "14px",
    borderRadius: "6px",
    color: "#444",
  },
  tabButtonActive: {
    background: "#1a1a1a",
    color: "#fff",
  },
  panel: { display: "flex", flexDirection: "column", gap: "12px" },
  panelTitle: { fontSize: "20px", margin: 0 },
  panelDesc: { fontSize: "14px", color: "#666", margin: 0 },
  textarea: {
    width: "100%",
    padding: "10px",
    fontSize: "14px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontFamily: "inherit",
    boxSizing: "border-box",
  },
  fileInput: { fontSize: "14px" },
  button: {
    alignSelf: "flex-start",
    padding: "10px 18px",
    fontSize: "14px",
    border: "none",
    borderRadius: "6px",
    background: "#1a1a1a",
    color: "#fff",
    cursor: "pointer",
  },
  output: {
    whiteSpace: "pre-wrap",
    background: "#f5f5f5",
    padding: "16px",
    borderRadius: "6px",
    fontSize: "13px",
    lineHeight: "1.5",
  },
  slideCard: {
    background: "#f5f5f5",
    padding: "12px 16px",
    borderRadius: "6px",
    marginBottom: "10px",
  },
};

export default App;
