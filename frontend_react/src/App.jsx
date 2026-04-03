import { useState } from 'react';
import { useAnalysis } from './hooks/useAnalysis';
import { UploadCloud, CheckCircle, FileText, Briefcase, MessageSquare, AlertCircle } from 'lucide-react';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import './index.css'; // Global custom CSS

function App() {
  const [file, setFile] = useState(null);
  const [jobRole, setJobRole] = useState('');
  const [jobLevel, setJobLevel] = useState('');
  
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { text: "Hello! Once a resume is processed, ask me anything about the candidate's skills, experience, or projects.", isUser: false }
  ]);

  const {
    threadId,
    isLoading,
    loaderStatus,
    errorMsg,
    results,
    setIsLoading,
    setErrorMsg,
    startAnalysis
  } = useAnalysis();

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleLaunch = () => {
    if (!file) return alert('Please upload a resume PDF first.');
    if (!jobRole.trim() || !jobLevel.trim()) return alert('Please specify both Role and Level.');
    
    startAnalysis(file, { jobRole, jobLevel });
  };

  const handleSendChat = async () => {
    if (!chatInput.trim() || !threadId) return;
    
    const query = chatInput.trim();
    setChatMessages(prev => [...prev, { text: query, isUser: true }]);
    setChatInput('');

    try {
      const res = await fetch('https://utkarshsingh0013-resume_talk.hf.space/api/v1/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: query, thread_id: threadId })
      });
      
      if(!res.ok) throw new Error("Chat failed");
      const data = await res.json();
      setChatMessages(prev => [...prev, { text: data.answer, isUser: false }]);
    } catch(e) {
      setChatMessages(prev => [...prev, { text: "Oops! Connection to RAG service failed.", isUser: false }]);
    }
  };

  // derived props
  const score = results?.ats_score || 0;
  const breakdownReason = results?.ats_breakdown?.penalty_reason || "Upload a resume and target role to see how well you match the parsing systems.";
  
  const strokeColor = score >= 80 ? '#D1FA40' : (score >= 60 ? '#FFB800' : '#FF4D4D');

  const renderEvalText = () => {
    if (!results?.final_output) return <p>Detailed insights will appear here after analysis.</p>;
    let markdown = results.final_output.replace(/(?:\r\n|\r|\n)/g, '<br>');
    // simple bolding replacer
    const parts = markdown.split(/(\*\*.*?\*\*)/g);
    return (
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
        {parts.map((part, i) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return <b key={i} style={{ color: '#fff' }}>{part.slice(2, -2)}</b>;
          }
          return <span key={i} dangerouslySetInnerHTML={{ __html: part }} />;
        })}
      </p>
    );
  };

  return (
    <>
      <div className={`loader-overlay ${isLoading || errorMsg ? 'active' : ''}`}>
        {isLoading && <div className="spinner"></div>}
        {errorMsg && <AlertCircle size={48} color="#FFAA00" style={{ marginBottom: 20 }} />}
        
        <div className="loader-text" style={{ color: errorMsg ? '#FFAA00' : 'inherit' }}>
          {errorMsg || loaderStatus}
        </div>
        
        {!errorMsg && <div className="loader-sub">This involves deep logic parsing and ATS simulation.</div>}
        
        {errorMsg && (
          <button 
            className="btn btn-outline" 
            style={{ marginTop: 20, width: 'auto' }}
            onClick={() => setErrorMsg('')}
          >
            Close Error Screen
          </button>
        )}
      </div>

      <div className="dashboard-wrapper">
        <aside className="glass-card sidebar">
          <div>
            <div className="brand">
              <div className="brand-icon">
                <CheckCircle size={20} color="var(--bg-deep)" />
              </div>
              NexGen Profiler
            </div>

            <h1 className="candidate-title" style={{ fontSize: '2.5rem' }}>
              {results?.job_role || 'Profile Optimizer'}
            </h1>
            <p className="meta-info">
              {results?.job_level 
                ? `Optimized for ${results.job_level} Level` 
                : (file ? <span style={{color: 'var(--accent-color)'}}>Document prepared: {file.name}</span> : 'Awaiting document upload...')}
            </p>

            <div className="input-group">
              <button className="btn btn-outline" onClick={() => document.getElementById('file-input').click()}>
                <UploadCloud size={18} />
                Upload Resume (PDF)
              </button>
              <input type="file" id="file-input" accept="application/pdf" style={{ display: 'none' }} onChange={handleFileChange} />
            </div>

            <div className="input-group">
              <label>Target Role</label>
              <input type="text" className="text-input" value={jobRole} onChange={(e) => setJobRole(e.target.value)} placeholder="e.g. Full Stack Developer" />
            </div>

            <div className="input-group">
              <label>Seniority Level</label>
              <input type="text" className="text-input" value={jobLevel} onChange={(e) => setJobLevel(e.target.value)} placeholder="e.g. Senior / Fresher" />
            </div>
          </div>

          <button className="btn btn-primary" onClick={handleLaunch} disabled={isLoading}>
            Launch Evaluation
          </button>
        </aside>

        <main className="content-area">
          <div className="glass-card full-width">
            <div className="score-display">
              <svg viewBox="0 0 36 36" className="circular-chart">
                <path className="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                <path className="circle" 
                  strokeDasharray={`${score}, 100`} 
                  stroke={strokeColor}
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                <text x="18" y="20.35" className="percentage">{score}%</text>
              </svg>

              <div className="score-details">
                <h2>ATS Compatibility</h2>
                <p>{breakdownReason}</p>
              </div>
            </div>
          </div>

          <div className="glass-card">
            <div className="card-header">
              <FileText size={20} />
              Critical Evaluation
            </div>
            
            <div className="eval-section">
              <h3>Strengths & Weaknesses</h3>
              {renderEvalText()}
            </div>
            
            <div className="eval-section">
              <h3>Missing Keywords</h3>
              <div className="tags-container">
                {results?.ats_breakdown?.missing_keywords ? (
                  results.ats_breakdown.missing_keywords.map((kw, idx) => (
                    <span key={idx} className="tag">{kw}</span>
                  ))
                ) : (
                  <span className="tag matched">Adequate keyword coverage</span>
                )}
              </div>
            </div>
          </div>

          <div className="glass-card">
            <div className="card-header">
              <Briefcase size={20} />
              Career Pathways
            </div>
            
            <div className="eval-section">
              <h3>Curated Job Matches</h3>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                {results?.job_openings?.length > 0 ? (
                  results.job_openings.map((job, idx) => (
                    <a key={idx} className="job-card" href={job.link || '#'} target="_blank" rel="noreferrer">
                      <div className="job-title">{job.title}</div>
                      <div className="job-company">{job.company}</div>
                    </a>
                  ))
                ) : (
                  "No matches yet."
                )}
              </div>
            </div>

            <div className="eval-section" style={{ marginTop: '2rem' }}>
              <h3>Drafted Approach</h3>
              <p style={{ fontSize: '0.85rem', fontFamily: 'monospace', background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-light)', whiteSpace: 'pre-wrap' }}>
                {results?.email_draft || "Awaiting criteria..."}
              </p>
            </div>
          </div>

          <div className="glass-card full-width">
            <div className="card-header">
              <MessageSquare size={20} />
              Resume Deep Dive (RAG Chat)
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}>Ask questions directly to the AI about the uploaded resume context.</p>
            
            <div className="chat-container">
              <div className="chat-messages">
                {chatMessages.map((msg, idx) => (
                  <div key={idx} className={`msg ${msg.isUser ? 'user' : 'bot'}`} dangerouslySetInnerHTML={{ __html: msg.text.replace(/(?:\r\n|\r|\n)/g, '<br>') }} />
                ))}
              </div>
              <div className="chat-input-row">
                <input 
                  type="text" 
                  className="text-input" 
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendChat()}
                  placeholder="e.g. What are their core database skills?" 
                  disabled={!threadId} 
                />
                <button 
                  className="btn btn-primary" 
                  onClick={handleSendChat} 
                  style={{ marginTop: 0, width: 'auto', padding: '0 1.5rem' }} 
                  disabled={!threadId}
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
      <Analytics />
      <SpeedInsights />
    </>
  );
}

export default App;
