import React, { useState } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

const AGENTS = [
  { id: "Research", icon: "⚡", label: "Research", desc: "Deep-dive any topic instantly" },
  { id: "Document", icon: "📄", label: "Document", desc: "Analyze PDFs & answer questions" },
  { id: "Plan", icon: "🎯", label: "Plan", desc: "Turn goals into action steps" },
  { id: "Presentation", icon: "✦", label: "Present", desc: "Generate slide outlines" },
];

export default function App() {
  const [activeTab, setActiveTab] = useState("Research");

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Inter:wght@300;400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          background: #080B14;
          color: #F8FAFC;
          font-family: 'Inter', sans-serif;
          min-height: 100vh;
          overflow-x: hidden;
        }

        .orb {
          position: fixed;
          border-radius: 50%;
          filter: blur(120px);
          opacity: 0.18;
          pointer-events: none;
          animation: drift 18s ease-in-out infinite alternate;
        }
        .orb-1 { width: 600px; height: 600px; background: #7C3AED; top: -200px; left: -150px; animation-delay: 0s; }
        .orb-2 { width: 500px; height: 500px; background: #06B6D4; bottom: -150px; right: -100px; animation-delay: -6s; }
        .orb-3 { width: 350px; height: 350px; background: #4F46E5; top: 40%; left: 50%; animation-delay: -12s; }

        @keyframes drift {
          0%   { transform: translate(0, 0) scale(1); }
          50%  { transform: translate(30px, -40px) scale(1.05); }
          100% { transform: translate(-20px, 30px) scale(0.97); }
        }

        .app {
          position: relative;
          z-index: 1;
          max-width: 860px;
          margin: 0 auto;
          padding: 48px 24px 80px;
        }

        /* HEADER */
        .header { text-align: center; margin-bottom: 52px; }

        .logo-row {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 16px;
        }

        .logo-dot {
          width: 10px; height: 10px;
          border-radius: 50%;
          background: linear-gradient(135deg, #7C3AED, #06B6D4);
          box-shadow: 0 0 16px #7C3AED88;
          animation: pulse 2.5s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 8px #7C3AED88; }
          50%       { box-shadow: 0 0 24px #06B6D4CC; }
        }

        .logo-text {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 15px;
          font-weight: 600;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          background: linear-gradient(90deg, #A78BFA, #67E8F9);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero-title {
          font-family: 'Space Grotesk', sans-serif;
          font-size: clamp(36px, 6vw, 58px);
          font-weight: 700;
          line-height: 1.1;
          letter-spacing: -0.02em;
          margin-bottom: 16px;
        }

        .hero-title span {
          background: linear-gradient(135deg, #A78BFA 0%, #67E8F9 50%, #A78BFA 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 4s linear infinite;
        }

        @keyframes shimmer {
          0%   { background-position: 0% center; }
          100% { background-position: 200% center; }
        }

        .hero-sub {
          font-size: 16px;
          color: #94A3B8;
          font-weight: 400;
          line-height: 1.6;
          max-width: 480px;
          margin: 0 auto;
        }

        /* AGENT TABS */
        .agent-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 10px;
          margin-bottom: 28px;
        }

        @media (max-width: 600px) {
          .agent-grid { grid-template-columns: repeat(2, 1fr); }
        }

        .agent-tab {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 14px;
          padding: 16px 12px;
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: left;
          position: relative;
          overflow: hidden;
        }

        .agent-tab:hover {
          background: rgba(255,255,255,0.06);
          border-color: rgba(124,58,237,0.4);
          transform: translateY(-2px);
        }

        .agent-tab.active {
          background: linear-gradient(135deg, rgba(124,58,237,0.2), rgba(6,182,212,0.15));
          border-color: rgba(124,58,237,0.6);
          box-shadow: 0 0 24px rgba(124,58,237,0.2), inset 0 1px 0 rgba(255,255,255,0.1);
        }

        .tab-icon {
          font-size: 20px;
          margin-bottom: 8px;
          display: block;
        }

        .tab-label {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 14px;
          font-weight: 600;
          color: #F1F5F9;
          display: block;
          margin-bottom: 3px;
        }

        .tab-desc {
          font-size: 11px;
          color: #64748B;
          line-height: 1.4;
        }

        .active .tab-label { color: #A78BFA; }
        .active .tab-desc  { color: #94A3B8; }

        /* GLASS PANEL */
        .glass {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.09);
          border-radius: 20px;
          padding: 32px;
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          box-shadow: 0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.07);
        }

        .panel-title {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 20px;
          font-weight: 600;
          color: #F1F5F9;
          margin-bottom: 6px;
        }

        .panel-sub {
          font-size: 13px;
          color: #64748B;
          margin-bottom: 20px;
        }

        /* INPUTS */
        textarea, input[type="text"] {
          width: 100%;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px;
          padding: 14px 16px;
          font-size: 14px;
          font-family: 'Inter', sans-serif;
          color: #F1F5F9;
          resize: vertical;
          transition: border-color 0.2s, box-shadow 0.2s;
          outline: none;
          margin-bottom: 14px;
        }

        textarea::placeholder, input::placeholder { color: #475569; }

        textarea:focus, input:focus {
          border-color: rgba(124,58,237,0.6);
          box-shadow: 0 0 0 3px rgba(124,58,237,0.12);
          background: rgba(255,255,255,0.07);
        }

        /* BUTTON */
        .btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 11px 22px;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 14px;
          font-weight: 600;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          background: linear-gradient(135deg, #7C3AED, #0891B2);
          color: #fff;
          transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s;
          box-shadow: 0 4px 16px rgba(124,58,237,0.35);
          letter-spacing: 0.01em;
        }

        .btn:hover:not(:disabled) {
          opacity: 0.9;
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(124,58,237,0.45);
        }

        .btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }

        .btn-secondary {
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.12);
          box-shadow: none;
          color: #CBD5E1;
        }

        .btn-secondary:hover:not(:disabled) {
          background: rgba(255,255,255,0.11);
          box-shadow: none;
        }

        /* FILE INPUT */
        .file-zone {
          border: 1.5px dashed rgba(124,58,237,0.35);
          border-radius: 12px;
          padding: 24px;
          text-align: center;
          cursor: pointer;
          transition: all 0.2s;
          margin-bottom: 14px;
          position: relative;
        }

        .file-zone:hover { border-color: rgba(124,58,237,0.6); background: rgba(124,58,237,0.05); }
        .file-zone input { position: absolute; inset: 0; opacity: 0; cursor: pointer; width: 100%; }
        .file-zone-text { font-size: 13px; color: #64748B; }
        .file-zone-text strong { color: #A78BFA; }
        .file-name { font-size: 13px; color: #67E8F9; margin-top: 6px; }

        /* OUTPUT */
        .output-box {
          margin-top: 20px;
          background: rgba(0,0,0,0.25);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 14px;
          padding: 20px;
          position: relative;
          overflow: hidden;
        }

        .output-box::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 2px;
          background: linear-gradient(90deg, #7C3AED, #06B6D4);
          border-radius: 14px 14px 0 0;
        }

        .output-label {
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #7C3AED;
          margin-bottom: 12px;
          font-family: 'Space Grotesk', sans-serif;
        }

        .output-text {
          font-size: 13.5px;
          line-height: 1.75;
          color: #CBD5E1;
          white-space: pre-wrap;
          word-break: break-word;
        }

        /* SLIDES */
        .slide-card {
          background: rgba(124,58,237,0.07);
          border: 1px solid rgba(124,58,237,0.2);
          border-radius: 12px;
          padding: 16px 18px;
          margin-bottom: 10px;
        }

        .slide-number {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.1em;
          color: #7C3AED;
          text-transform: uppercase;
          font-family: 'Space Grotesk', sans-serif;
          margin-bottom: 4px;
        }

        .slide-title {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 15px;
          font-weight: 600;
          color: #F1F5F9;
          margin-bottom: 10px;
        }

        .slide-bullets { list-style: none; padding: 0; }

        .slide-bullets li {
          font-size: 13px;
          color: #94A3B8;
          padding: 3px 0 3px 16px;
          position: relative;
          line-height: 1.5;
        }

        .slide-bullets li::before {
          content: '▸';
          position: absolute;
          left: 0;
          color: #06B6D4;
          font-size: 10px;
          top: 5px;
        }

        /* DIVIDER */
        .divider {
          border: none;
          border-top: 1px solid rgba(255,255,255,0.07);
          margin: 22px 0;
        }

        /* LOADING SPINNER */
        .spinner {
          display: inline-block;
          width: 13px; height: 13px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }

        @keyframes spin { to { transform: rotate(360deg); } }

        /* FOOTER */
        .footer {
          text-align: center;
          margin-top: 60px;
          font-size: 12px;
          color: #334155;
        }

        .footer a { color: #7C3AED; text-decoration: none; }
        .footer a:hover { color: #A78BFA; }

        /* ERROR */
        .error-text { color: #F87171; font-size: 13px; margin-top: 12px; }

        /* FOLLOW-UP SECTION */
        .followup { margin-top: 22px; }
        .followup-title {
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #475569;
          margin-bottom: 10px;
          font-family: 'Space Grotesk', sans-serif;
        }
      `}</style>

      {/* Background orbs */}
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      <div className="app">
        {/* Header */}
        <header className="header">
          <div className="logo-row">
            <div className="logo-dot" />
            <span className="logo-text">Vyrora AI</span>
          </div>
          <h1 className="hero-title">
            Four agents.<br />
            <span>One platform.</span>
          </h1>
          <p className="hero-sub">
            Research, analyze documents, build plans, and generate presentations — powered by Groq LLMs.
          </p>
        </header>

        {/* Agent tabs */}
        <div className="agent-grid">
          {AGENTS.map((a) => (
            <button
              key={a.id}
              className={`agent-tab${activeTab === a.id ? " active" : ""}`}
              onClick={() => setActiveTab(a.id)}
            >
              <span className="tab-icon">{a.icon}</span>
              <span className="tab-label">{a.label}</span>
              <span className="tab-desc">{a.desc}</span>
            </button>
          ))}
        </div>

        {/* Panel */}
        <div className="glass">
          {activeTab === "Research"      && <ResearchPanel />}
          {activeTab === "Document"      && <DocumentPanel />}
          {activeTab === "Plan"          && <PlanPanel />}
          {activeTab === "Presentation"  && <PresentationPanel />}
        </div>

        {/* Footer */}
        <footer className="footer">
          Built by <a href="https://rosesharma13.github.io" target="_blank" rel="noreferrer">Rose Sharma</a>
          {" · "}
          <a href="https://github.com/Rosesharma13/vyrora-ai-agent-platform" target="_blank" rel="noreferrer">GitHub</a>
        </footer>
      </div>
    </>
  );
}

/* ─── RESEARCH ─────────────────────────────────────────────────────────────── */
function ResearchPanel() {
  const [q, setQ] = useState("");
  const [res, setRes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const run = async () => {
    if (!q.trim()) return;
    setLoading(true); setRes(""); setError("");
    try {
      const r = await axios.post(`${API_BASE}/research`, { question: q });
      setRes(r.data.response);
    } catch (e) { setError("Could not reach the backend. Try again in a moment."); }
    finally { setLoading(false); }
  };

  return (
    <>
      <p className="panel-title">Research Agent</p>
      <p className="panel-sub">Ask about any topic — get a structured overview, key points, and trends.</p>
      <textarea rows="4" placeholder="e.g. What is retrieval-augmented generation?" value={q} onChange={e => setQ(e.target.value)} />
      <button className="btn" onClick={run} disabled={loading || !q.trim()}>
        {loading ? <><span className="spinner" /> Researching…</> : "Run Research"}
      </button>
      {error && <p className="error-text">{error}</p>}
      {res && (
        <div className="output-box">
          <div className="output-label">Research Output</div>
          <p className="output-text">{res}</p>
        </div>
      )}
    </>
  );
}

/* ─── DOCUMENT ──────────────────────────────────────────────────────────────── */
function DocumentPanel() {
  const [file, setFile] = useState(null);
  const [text, setText] = useState("");
  const [analysis, setAnalysis] = useState("");
  const [q, setQ] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const upload = async () => {
    if (!file) return;
    setLoading(true); setAnalysis(""); setAnswer(""); setError("");
    const fd = new FormData(); fd.append("file", file);
    try {
      const r = await axios.post(`${API_BASE}/document/upload`, fd, { headers: { "Content-Type": "multipart/form-data" } });
      if (r.data.error) { setError(r.data.error); }
      else { setAnalysis(r.data.analysis); setText(r.data.extracted_text); }
    } catch (e) { setError("Upload failed. Check file type and try again."); }
    finally { setLoading(false); }
  };

  const ask = async () => {
    if (!q.trim() || !text) return;
    setLoading(true); setAnswer(""); setError("");
    try {
      const r = await axios.post(`${API_BASE}/document/ask`, { text, question: q });
      setAnswer(r.data.response);
    } catch (e) { setError("Could not reach the backend."); }
    finally { setLoading(false); }
  };

  return (
    <>
      <p className="panel-title">Document Agent</p>
      <p className="panel-sub">Upload a PDF or text file to get a summary, key points, and ask questions about it.</p>

      <div className="file-zone">
        <input type="file" accept=".pdf,.txt" onChange={e => setFile(e.target.files[0])} />
        <p className="file-zone-text">
          {file ? null : <><strong>Choose file</strong> or drag & drop</>}
        </p>
        {file && <p className="file-name">📎 {file.name}</p>}
      </div>

      <button className="btn" onClick={upload} disabled={loading || !file}>
        {loading ? <><span className="spinner" /> Analyzing…</> : "Analyze Document"}
      </button>

      {error && <p className="error-text">{error}</p>}

      {analysis && (
        <div className="output-box">
          <div className="output-label">Document Analysis</div>
          <p className="output-text">{analysis}</p>
        </div>
      )}

      {text && (
        <>
          <hr className="divider" />
          <div className="followup">
            <p className="followup-title">Ask a follow-up question</p>
            <textarea rows="2" placeholder="What does the document say about…?" value={q} onChange={e => setQ(e.target.value)} />
            <button className="btn btn-secondary" onClick={ask} disabled={loading || !q.trim()}>
              {loading ? <><span className="spinner" /> Thinking…</> : "Ask Question"}
            </button>
            {answer && (
              <div className="output-box">
                <div className="output-label">Answer</div>
                <p className="output-text">{answer}</p>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
}

/* ─── PLAN ──────────────────────────────────────────────────────────────────── */
function PlanPanel() {
  const [goal, setGoal] = useState("");
  const [res, setRes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const run = async () => {
    if (!goal.trim()) return;
    setLoading(true); setRes(""); setError("");
    try {
      const r = await axios.post(`${API_BASE}/plan`, { goal });
      setRes(r.data.response);
    } catch (e) { setError("Could not reach the backend. Try again."); }
    finally { setLoading(false); }
  };

  return (
    <>
      <p className="panel-title">Planning Agent</p>
      <p className="panel-sub">Describe your goal — get a concrete, numbered action plan with risks flagged.</p>
      <textarea rows="3" placeholder="e.g. Land a junior AI engineer role in 60 days" value={goal} onChange={e => setGoal(e.target.value)} />
      <button className="btn" onClick={run} disabled={loading || !goal.trim()}>
        {loading ? <><span className="spinner" /> Planning…</> : "Generate Plan"}
      </button>
      {error && <p className="error-text">{error}</p>}
      {res && (
        <div className="output-box">
          <div className="output-label">Action Plan</div>
          <p className="output-text">{res}</p>
        </div>
      )}
    </>
  );
}

/* ─── PRESENTATION ──────────────────────────────────────────────────────────── */
function PresentationPanel() {
  const [topic, setTopic] = useState("");
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const run = async () => {
    if (!topic.trim()) return;
    setLoading(true); setSlides([]); setError("");
    try {
      const r = await axios.post(`${API_BASE}/presentation`, { topic });
      setSlides(r.data.slides || []);
    } catch (e) { setError("Could not reach the backend. Try again."); }
    finally { setLoading(false); }
  };

  return (
    <>
      <p className="panel-title">Presentation Agent</p>
      <p className="panel-sub">Enter a topic — get a complete slide-by-slide outline with talking points.</p>
      <textarea rows="2" placeholder="e.g. Introduction to Large Language Models" value={topic} onChange={e => setTopic(e.target.value)} />
      <button className="btn" onClick={run} disabled={loading || !topic.trim()}>
        {loading ? <><span className="spinner" /> Generating…</> : "Generate Outline"}
      </button>
      {error && <p className="error-text">{error}</p>}
      {slides.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          {slides.map((s, i) => (
            <div className="slide-card" key={i}>
              <div className="slide-number">Slide {i + 1}</div>
              <div className="slide-title">{s.title}</div>
              <ul className="slide-bullets">
                {(s.bullets || []).map((b, j) => <li key={j}>{b}</li>)}
              </ul>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
