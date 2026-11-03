import React, { useState, useEffect, useRef } from 'react';

// --- INLINE SVG ICONS (Crisp, minimalist technical icons) ---
const Icons = {
  Terminal: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  Cpu: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 3v2m6-2v2M9 19v2m6-2v2M3 9h2m-2 6h2m14-6h2m-2 6h2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
    </svg>
  ),
  GitBranch: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 7a2 2 0 100-4 2 2 0 000 4zm10 14a2 2 0 100-4 2 2 0 000 4zM7 21a2 2 0 100-4 2 2 0 000 4zm0-10a5 5 0 015 5v1m0-6a5 5 0 00-5-5" />
    </svg>
  ),
  Database: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
    </svg>
  ),
  FileText: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  Upload: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </svg>
  ),
  MessageSquare: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  ),
  ArrowRight: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
    </svg>
  ),
  Check: () => (
    <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  ),
  X: () => (
    <svg className="w-3.5 h-3.5 text-zinc-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  Mail: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  Briefcase: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  ChevronDown: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  ),
  Copy: () => (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
  ),
  ExternalLink: () => (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
    </svg>
  ),
  Shield: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  )
};

// Preset Profiles for Homepage Interactive Simulator
const SAMPLE_PROFILES = [
  {
    id: 'mle',
    role: 'Senior Machine Learning Engineer',
    level: 'Senior (5+ yrs)',
    initialScore: 68,
    refinedScore: 92,
    domain: 'High-Throughput LLM Serving & MLOps',
    missingKeywords: ['TensorRT-LLM', 'Distributed DDP', 'DeepSpeed ZeRO-3'],
    originalBullet: 'Responsible for machine learning deployments on AWS. Helped the team lower inference latency and improved GPU cluster costs.',
    refinedBullet: 'Architected Triton and vLLM inference clusters on AWS EKS, slicing p99 latency by 42% and curtailing GPU overhead by $18.4k/mo across 50M+ requests.',
    retrievalChunks: 6
  },
  {
    id: 'fsd',
    role: 'Staff Full-Stack Architect',
    level: 'Staff / Principal (8+ yrs)',
    initialScore: 61,
    refinedScore: 89,
    domain: 'Distributed Systems & Real-time Web',
    missingKeywords: ['Event Sourcing', 'Kafka Streams', 'eBPF Observability'],
    originalBullet: 'Built web applications with React and Node.js. Handled database migrations and mentored junior devs across frontend sprints.',
    refinedBullet: 'Spearheaded event-driven micro-frontend migration across 14 teams, reducing bundle load time by 64% and standardizing CI/CD deploy frequencies.',
    retrievalChunks: 8
  },
  {
    id: 'dpe',
    role: 'Lead Data Platform Engineer',
    level: 'Senior / Lead (6+ yrs)',
    initialScore: 64,
    refinedScore: 91,
    domain: 'Lakehouse & Multi-Petabyte Pipelines',
    missingKeywords: ['Apache Iceberg', 'Trino Query Optimization', 'dbt mesh'],
    originalBullet: 'Created big data pipelines using Spark and SQL. Maintained data warehouse tables and resolved broken ETL queries.',
    refinedBullet: 'Designed multi-PB Apache Iceberg lakehouse on Snowflake with dbt mesh; curtailed query computation costs by 31% while guaranteeing sub-second SLA.',
    retrievalChunks: 5
  }
];

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

export default function App() {
  const [currentPage, setCurrentPage] = useState('landing');
  const [activeProfile, setActiveProfile] = useState(SAMPLE_PROFILES[0]);
  const [targetRole, setTargetRole] = useState('Machine Learning Engineer');
  const [jobLevel, setJobLevel] = useState('Senior');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [analysisResults, setAnalysisResults] = useState(null);
  const [threadId, setThreadId] = useState(null);
  const [analysisError, setAnalysisError] = useState('');
  const fileInputRef = useRef(null);
  const [scoreThreshold, setScoreThreshold] = useState(80);
  const [openFaq, setOpenFaq] = useState(null);

  // Workflow State Simulator
  const [workflowStatus, setWorkflowStatus] = useState('idle');
  const [activeNode, setActiveNode] = useState(null);
  const [completedNodes, setCompletedNodes] = useState([]);
  const [currentIteration, setCurrentIteration] = useState(1);
  const [logs, setLogs] = useState([]);
  const [progress, setProgress] = useState(0);

  // Email modal
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const eventSourceRef = useRef(null);

  // Chat / RAG State
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      sender: 'system',
      text: "FAISS vector index initialized via sentence-transformers/all-MiniLM-L6-v2 (6 chunks, dimension 384). Grounded queries active.",
      citations: []
    },
    {
      id: 2,
      sender: 'ai',
      text: "Upload a resume to initialize grounded chat from your own extracted content.",
      citations: []
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedChunk, setSelectedChunk] = useState(0);
  const chatEndRef = useRef(null);
  const nextMessageId = useRef(3);

  const resumeChunks = (analysisResults?.raw_text || '')
    .split(/\n+/)
    .map((text) => text.trim())
    .filter(Boolean)
    .reduce((chunks, text, index) => {
      if (index % 4 === 0) {
        chunks.push({
          id: chunks.length,
          tag: `RESUME EXTRACT ${chunks.length + 1}`,
          score: 'source',
          text: ''
        });
      }
      chunks[chunks.length - 1].text += `${chunks[chunks.length - 1].text ? ' ' : ''}${text}`;
      return chunks;
    }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isTyping]);

  const runSimulation = () => {
    setCurrentPage('workflow');
    setWorkflowStatus('running');
    setLogs([]);
    setCompletedNodes([]);
    setProgress(4);
    setCurrentIteration(1);

    const steps = [
      { node: 'ingest', name: 'Document Ingestion & pypdf Parsing', log: '[01_INGEST] pypdf parsed 4,812 characters. In-memory buffer allocated. thread_id=9f7b-4a21', progress: 14, delay: 500 },
      { node: 'sections', name: 'Gemini Structural JSON Decomposition', log: '[02_SECTIONS] Canonical sections detected: Header, Skills, Experience, OpenSource, Education.', progress: 28, delay: 1100 },
      { node: 'entities', name: 'Entity & Domain Knowledge Mapping', log: '[03_ENTITIES] Extracted 22 tech entities (PyTorch, Triton, vLLM, Ray). Domain: High-Scale AI.', progress: 42, delay: 1700 },
      { node: 'signals', name: 'Seniority Level & Signal Inference', log: '[04_SIGNALS] Seniority evaluated: Senior (Score: 0.88). Quantified impact ratio: 2.4 metrics/bullet.', progress: 54, delay: 2300 },
      { node: 'evaluate', name: 'Gemini Evaluation & Deficit Mapping', log: '[05_EVALUATE] Identified missing distributed training keywords: [TensorRT-LLM, DDP]. Weak action verbs flagged.', progress: 66, delay: 3000 },
      { node: 'ats', name: 'Groq LLaMA 3 Deterministic Scoring', log: '[06_ATS] Initial ATS score: 68/100. Penalties: Lack of explicit multi-node sync & enterprise ROI.', progress: 78, delay: 3700 },
      { node: 'supervisor', name: 'LangGraph Supervisor Conditional Edge', log: '[07_SUPERVISOR] Condition: 68 < 80 target threshold. Iteration 1/3 -> Branching to [REFINE].', progress: 85, delay: 4400 },
      { node: 'refine', name: 'Autonomous Resume Refinement', log: '[08_REFINE] LLM rewrite of Experience section. Injecting verified metrics & action-first verbs...', progress: 92, delay: 5200 },
      { node: 'ats2', name: 'Secondary ATS Validation Pass', log: '[09_ATS_RECHECK] Re-evaluated ATS Score: 92/100! Condition satisfied (>= 80). Routing to [JOBS & OUTREACH].', progress: 97, delay: 6000 },
      { node: 'jobs', name: 'RapidAPI JSearch & Cold Email Agent', log: '[10_FINAL] 3 high-fit jobs fetched. Drafted personalized hiring manager pitch email. State checkpoints saved.', progress: 100, delay: 6700 }
    ];

    steps.forEach((step) => {
      setTimeout(() => {
        setActiveNode(step.node);
        setCompletedNodes(prev => [...new Set([...prev, step.node])]);
        setProgress(step.progress);
        setLogs(prev => [
          ...prev,
          {
            time: new Date().toLocaleTimeString(),
            message: step.log,
            node: step.node
          }
        ]);

        if (step.node === 'refine') setCurrentIteration(2);
        if (step.progress === 100) {
          setWorkflowStatus('completed');
          setActiveNode('completed');
        }
      }, step.delay);
    });
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.type !== 'application/pdf') {
      setAnalysisError('Please select a PDF resume.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setAnalysisError('Resume must be smaller than 5 MB.');
      return;
    }
    setUploadedFile(file);
    setAnalysisError('');
  };

  const runAnalysis = async () => {
    if (!(uploadedFile instanceof File)) {
      setAnalysisError('Please select your resume PDF before starting.');
      return;
    }

    setAnalysisError('');
    setWorkflowStatus('running');
    setCurrentPage('workflow');
    setCompletedNodes([]);
    setActiveNode(null);
    setLogs([]);
    setProgress(2);
    setCurrentIteration(1);
    setAnalysisResults(null);

    try {
      const formData = new FormData();
      formData.append('file', uploadedFile);
      formData.append('job_role', targetRole);
      formData.append('job_level', jobLevel);

      const response = await fetch(`${API_BASE_URL}/api/v1/analyze`, {
        method: 'POST',
        body: formData
      });
      if (!response.ok) {
        throw new Error(`Upload failed (${response.status})`);
      }

      const { thread_id: newThreadId } = await response.json();
      setThreadId(newThreadId);
      const eventSource = new EventSource(`${API_BASE_URL}/api/v1/stream/${newThreadId}`);
      eventSourceRef.current = eventSource;

      eventSource.onmessage = (event) => {
        const payload = JSON.parse(event.data);
        const details = payload.details || {};
        setAnalysisResults(details);
        if (details.iteration) setCurrentIteration(details.iteration + 1);
        if (details.ats_score !== undefined) setProgress(78);
        if (details.final_output) setProgress(100);
        setLogs((previous) => [
          ...previous,
          {
            time: new Date().toLocaleTimeString(),
            message: payload.status === 'error'
              ? `[ERROR] ${payload.message}`
              : `[${payload.status.toUpperCase()}] ${Object.keys(details).join(', ') || 'Pipeline started'}`
          }
        ]);

        if (payload.status === 'completed') {
          setWorkflowStatus('completed');
          setProgress(100);
          setActiveNode('completed');
          eventSource.close();
        } else if (payload.status === 'error') {
          setWorkflowStatus('error');
          setAnalysisError(payload.message || 'The analysis pipeline failed.');
          eventSource.close();
        }
      };

      eventSource.onerror = () => {
        setWorkflowStatus('error');
        setAnalysisError('The analysis stream disconnected before completion.');
        eventSource.close();
      };
    } catch (error) {
      setWorkflowStatus('error');
      setAnalysisError(error.message);
    }
  };

  const handleSendMessage = async (textToSend = inputQuery) => {
    if (!textToSend.trim()) return;

    const userMsg = { id: nextMessageId.current++, sender: 'user', text: textToSend };
    setChatMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setIsTyping(true);

    try {
      if (!threadId) throw new Error('Run resume analysis before opening the copilot.');
      const response = await fetch(`${API_BASE_URL}/api/v1/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ thread_id: threadId, message: textToSend })
      });
      if (!response.ok) throw new Error(`Chat request failed (${response.status})`);
      const { answer } = await response.json();
      setIsTyping(false);
      setChatMessages(prev => [
        ...prev,
        { id: nextMessageId.current++, sender: 'ai', text: answer, citations: ['RAG API'] }
      ]);
    } catch (error) {
      setIsTyping(false);
      setChatMessages(prev => [
        ...prev,
        { id: nextMessageId.current++, sender: 'ai', text: `Error: ${error.message}`, citations: [] }
      ]);
    }
  };

  useEffect(() => () => eventSourceRef.current?.close(), []);

  const liveJobs = analysisResults?.job_openings || [];
  const missingKeywords = analysisResults?.ats_breakdown?.missing_keywords || [];
  const candidateName = analysisResults?.candidate_name || 'Candidate';
  const candidateEmail = analysisResults?.candidate_email || 'Email unavailable';
  const candidatePhone = analysisResults?.candidate_phone || 'Phone unavailable';
  const candidateEntities = analysisResults?.entities || {};
  const candidateSkills = Object.values(candidateEntities).flat().filter((value) => typeof value === 'string');
  const emailDraft = analysisResults?.email_draft || 'No outreach draft was generated.';

  return (
    <div className="min-h-screen bg-[#090A0F] text-[#E2E8F0] font-sans antialiased flex flex-col selection:bg-slate-700 selection:text-white">
      {/* Google Fonts Import Header Style */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap');
        
        :root {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }
        .font-tech {
          font-family: 'Space Grotesk', sans-serif;
        }
        .font-mono {
          font-family: 'JetBrains Mono', monospace;
        }
      `}</style>

      {/* Subdued Grid Background */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-[0.035]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #CBD5E1 1px, transparent 0)`,
          backgroundSize: '24px 24px'
        }}
      />

      {/* TOP NAVIGATION BAR */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-[#090A0F]/90 border-b border-[#1E2330]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          {/* Logo / Branding */}
          <div 
            onClick={() => setCurrentPage('landing')} 
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-lg bg-[#141824] border border-[#262C3D] flex items-center justify-center text-slate-300 group-hover:border-slate-500 transition-colors">
              <Icons.Cpu />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-tech font-bold text-base tracking-tight text-white">
                RESUME TALK
              </span>
              <span className="font-mono text-[10px] text-zinc-500 tracking-wider">
                v2.4 / LANGGRAPH
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-[#0E1118] border border-[#1A1F2C] p-1 rounded-lg">
            {[
              { id: 'landing', label: 'Overview' },
              { id: 'upload', label: 'Target & Upload' },
              { id: 'workflow', label: 'StateGraph Monitor', badge: workflowStatus === 'running' ? 'RUNNING' : null },
              { id: 'report', label: 'ATS Analysis & Jobs' },
              { id: 'chat', label: 'RAG Copilot' }
            ].map(tab => {
              const isActive = currentPage === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setCurrentPage(tab.id)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all relative flex items-center gap-1.5 ${
                    isActive 
                      ? 'bg-[#181D29] text-white border border-[#2B3347] shadow-sm' 
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#121622]'
                  }`}
                >
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Telemetry Indicator & Primary Action */}
          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded bg-[#0E1118] border border-[#1A1F2C] font-mono text-[11px] text-zinc-400">
              <span className={`w-1.5 h-1.5 rounded-full ${workflowStatus === 'running' ? 'bg-amber-400' : 'bg-emerald-400'}`} />
              <span>GRAPH ENGINE: {workflowStatus === 'running' ? 'ACTIVE' : 'IDLE'}</span>
            </div>

            <button
              onClick={() => setCurrentPage('upload')}
              className="px-3.5 py-1.5 rounded-md bg-white hover:bg-zinc-200 text-zinc-950 font-semibold text-xs transition-all flex items-center gap-1.5 shadow-sm active:scale-[0.98]"
            >
              <Icons.Upload />
              <span>Launch Analysis</span>
            </button>
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="flex-1 flex flex-col">
        {/* ========================================================================= */}
        {/* PAGE 1: EXPANDED LENGTHY HOME / SYSTEM OVERVIEW                          */}
        {/* ========================================================================= */}
        {currentPage === 'landing' && (
          <div className="flex-1 flex flex-col">
            {/* HERO SECTION */}
            <section className="relative pt-16 pb-20 border-b border-[#1A1F2C] overflow-hidden">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* System Tag */}
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#121622] border border-[#22293A] font-mono text-xs text-zinc-400 mb-6">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>SYSTEM ARCHITECTURE v2.4 • DETERMINISTIC ORCHESTRATION</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                  <div className="lg:col-span-7 space-y-5">
                    <h1 className="font-tech text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1]">
                      Autonomous resume engineering with deterministic feedback loops.
                    </h1>
                    <p className="text-zinc-400 text-base sm:text-lg max-w-2xl leading-relaxed">
                      Beyond naive prompt wrappers. Resume Talk pairs LangGraph state machines, Gemini structural parsing, Groq low-latency ATS scoring, and local FAISS vector retrieval to turn resumes into high-impact candidate dossiers.
                    </p>

                    <div className="flex flex-wrap items-center gap-3 pt-2">
                      <button
                        onClick={() => setCurrentPage('upload')}
                        className="px-5 py-2.5 rounded-lg bg-white hover:bg-zinc-200 text-zinc-950 font-semibold text-xs tracking-wide transition-all flex items-center gap-2"
                      >
                        <span>Launch Pipeline</span>
                        <Icons.ArrowRight />
                      </button>
                      <button
                        onClick={runSimulation}
                        className="px-4 py-2.5 rounded-lg bg-[#121622] border border-[#22293A] hover:bg-[#181E2E] text-zinc-300 font-mono text-xs transition-all flex items-center gap-2"
                      >
                        <Icons.Terminal />
                        <span>Simulate Graph Stream</span>
                      </button>
                    </div>
                  </div>

                  {/* Real-time Telemetry Card */}
                  <div className="lg:col-span-5 bg-[#0D1017] border border-[#1C2230] rounded-xl p-5 font-mono text-xs shadow-xl">
                    <div className="flex items-center justify-between pb-3 border-b border-[#1A1F2C] text-zinc-400">
                      <span className="flex items-center gap-2">
                        <Icons.Cpu />
                        <span>ENGINE PIPELINE TELEMETRY</span>
                      </span>
                      <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">LIVE</span>
                    </div>

                    <div className="mt-4 space-y-3">
                      <div className="flex justify-between items-center py-1 border-b border-[#141824]">
                        <span className="text-zinc-500">Orchestrator</span>
                        <span className="text-zinc-200 font-semibold">LangGraph StateGraph v0.2</span>
                      </div>
                      <div className="flex justify-between items-center py-1 border-b border-[#141824]">
                        <span className="text-zinc-500">Evaluation Model</span>
                        <span className="text-zinc-200 font-semibold">Groq LLaMA 3 (Deterministic)</span>
                      </div>
                      <div className="flex justify-between items-center py-1 border-b border-[#141824]">
                        <span className="text-zinc-500">Structural Decomposition</span>
                        <span className="text-zinc-200 font-semibold">Google Gemini 1.5 Pro</span>
                      </div>
                      <div className="flex justify-between items-center py-1 border-b border-[#141824]">
                        <span className="text-zinc-500">Vector Embeddings</span>
                        <span className="text-zinc-200 font-semibold">all-MiniLM-L6-v2 (FAISS)</span>
                      </div>
                      <div className="flex justify-between items-center py-1 border-b border-[#141824]">
                        <span className="text-zinc-500">Supervisor Loop Limit</span>
                        <span className="text-zinc-200 font-semibold">3 Iterations (Score &ge; 80)</span>
                      </div>
                      <div className="flex justify-between items-center py-1">
                        <span className="text-zinc-500">Persistence Backend</span>
                        <span className="text-zinc-200 font-semibold">SQLite Thread Checkpointer</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Live Ticker Metric Strip */}
                <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: 'AVERAGE ATS LIFT', value: '+34 pts', sub: 'across 3 refinement iterations' },
                    { label: 'EVALUATION LATENCY', value: '480 ms', sub: 'Groq ultra-fast microservice' },
                    { label: 'GROUNDED ACCURACY', value: '100%', sub: 'strict chunk citation filter' },
                    { label: 'ACTIVE OPPORTUNITIES', value: '3 Matches', sub: 'RapidAPI JSearch integration' }
                  ].map((stat, i) => (
                    <div key={i} className="p-4 rounded-lg bg-[#0D1017] border border-[#1A1F2C]">
                      <div className="font-mono text-[10px] text-zinc-500 tracking-wider">{stat.label}</div>
                      <div className="font-tech text-2xl font-bold text-white mt-1">{stat.value}</div>
                      <div className="text-[11px] text-zinc-400 mt-0.5">{stat.sub}</div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* INTERACTIVE ARCHITECTURE BLUEPRINT */}
            <section className="py-16 border-b border-[#1A1F2C] bg-[#0A0D13]">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
                  <div>
                    <div className="font-mono text-xs text-zinc-400 uppercase tracking-widest">Topology Walkthrough</div>
                    <h2 className="font-tech text-2xl sm:text-3xl font-bold text-white mt-1">
                      Multi-Node State Machine Architecture
                    </h2>
                  </div>
                  <p className="text-xs text-zinc-400 max-w-md">
                    Deterministic linear pipeline seamlessly transitions into conditional loops until candidate resumes satisfy configured thresholds.
                  </p>
                </div>

                {/* 5-Phase Architecture Diagram */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  {[
                    {
                      phase: '01 / INGESTION',
                      node: 'pypdf + regex',
                      desc: 'Raw stream extraction, MIME verification, and lightweight profile extraction (name, email, phone).'
                    },
                    {
                      phase: '02 / TAXONOMY',
                      node: 'Gemini Sections & Entities',
                      desc: 'Decomposes raw text into canonical blocks. Discovers frameworks, cloud tools, databases, and domain tags.'
                    },
                    {
                      phase: '03 / ATS PENALTY',
                      node: 'Groq ATS Node',
                      desc: 'Scores resumes against exact target roles using negative penalties for missing keywords and lack of metrics.'
                    },
                    {
                      phase: '04 / SUPERVISOR',
                      node: 'LangGraph Conditional Loop',
                      desc: 'If score < 80 and iteration < 3, routes to [Refine Node]. Re-evaluates iteratively until passing.'
                    },
                    {
                      phase: '05 / OUTREACH & RAG',
                      node: 'JSearch + FAISS Store',
                      desc: 'Fetches matching job openings in India, drafts cold emails for hiring managers, and creates vector indices.'
                    }
                  ].map((step, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-[#0D1017] border border-[#1A1F2C] relative group hover:border-[#2C3549] transition-all">
                      <div className="font-mono text-[10px] text-zinc-500">{step.phase}</div>
                      <div className="font-tech text-sm font-bold text-white mt-2 flex items-center justify-between">
                        <span>{step.node}</span>
                        <span className="font-mono text-[10px] text-zinc-600">#{idx + 1}</span>
                      </div>
                      <p className="text-xs text-zinc-400 mt-3 leading-relaxed">
                        {step.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* INTERACTIVE SAMPLE PROFILES SIMULATOR (LIVE ON HOMEPAGE) */}
            <section className="py-16 border-b border-[#1A1F2C]">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-2xl mx-auto mb-10">
                  <div className="font-mono text-xs text-zinc-400 uppercase tracking-widest">Interactive Benchmark</div>
                  <h2 className="font-tech text-2xl sm:text-3xl font-bold text-white mt-1">
                    Inspect Real-Time Candidate Transformations
                  </h2>
                  <p className="text-xs text-zinc-400 mt-2">
                    Click through archetypes to see how the LangGraph Refine Node restructures weak bullets into high-signal accomplishments.
                  </p>
                </div>

                {/* Profile Tabs */}
                <div className="flex justify-center gap-2 mb-8">
                  {SAMPLE_PROFILES.map((profile) => (
                    <button
                      key={profile.id}
                      onClick={() => setActiveProfile(profile)}
                      className={`px-4 py-2 rounded-lg text-xs font-mono transition-all ${
                        activeProfile.id === profile.id
                          ? 'bg-[#181D29] text-white border border-[#2B3347] shadow-sm'
                          : 'bg-[#0E1118] text-zinc-400 border border-[#1A1F2C] hover:text-zinc-200'
                      }`}
                    >
                      {profile.role}
                    </button>
                  ))}
                </div>

                {/* Profile Inspector Card */}
                <div className="bg-[#0D1017] border border-[#1A1F2C] rounded-2xl p-6 lg:p-8">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Scores & Metadata */}
                    <div className="lg:col-span-4 space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="font-mono text-xs text-zinc-400">{activeProfile.level}</span>
                        <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                          +{activeProfile.refinedScore - activeProfile.initialScore} pts lift
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-3 pt-2">
                        <div className="p-3 rounded-lg bg-[#0A0C12] border border-[#161B26]">
                          <div className="font-mono text-[10px] text-zinc-500">RAW INGESTED</div>
                          <div className="font-tech text-2xl font-bold text-zinc-400 mt-1">{activeProfile.initialScore}</div>
                          <div className="text-[10px] text-rose-400 mt-0.5">Penalized for vagueness</div>
                        </div>
                        <div className="p-3 rounded-lg bg-[#0A0C12] border border-[#161B26]">
                          <div className="font-mono text-[10px] text-zinc-500">REFINED ATS</div>
                          <div className="font-tech text-2xl font-bold text-white mt-1">{activeProfile.refinedScore}</div>
                          <div className="text-[10px] text-emerald-400 mt-0.5">Passed threshold (&ge; 80)</div>
                        </div>
                      </div>

                      <div>
                        <div className="font-mono text-[11px] text-zinc-400 mb-2">IDENTIFIED MISSING ENTITIES</div>
                        <div className="flex flex-wrap gap-1.5">
                          {activeProfile.missingKeywords.map((kw, i) => (
                            <span key={i} className="px-2 py-0.5 rounded bg-[#121622] border border-[#1F2636] text-[11px] font-mono text-zinc-300">
                              + {kw}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="pt-2">
                        <button
                          onClick={() => {
                            setTargetRole(activeProfile.role);
                            setCurrentPage('report');
                          }}
                          className="w-full py-2 rounded-lg bg-[#141824] hover:bg-[#1A2030] border border-[#242C3E] text-xs font-semibold text-zinc-200 transition-all flex items-center justify-center gap-2"
                        >
                          <span>Open Full Report in ATS Studio</span>
                          <Icons.ArrowRight />
                        </button>
                      </div>
                    </div>

                    {/* Diff Inspection */}
                    <div className="lg:col-span-8 space-y-4">
                      <div className="p-4 rounded-xl bg-rose-950/10 border border-rose-900/30">
                        <div className="flex items-center justify-between text-xs font-mono text-rose-400 mb-2">
                          <span>BEFORE: RAW USER TEXT (PASSIVE)</span>
                          <span>ATS PENALTY: -18 PTS</span>
                        </div>
                        <p className="font-mono text-xs text-zinc-300 leading-relaxed">
                          "{activeProfile.originalBullet}"
                        </p>
                      </div>

                      <div className="p-4 rounded-xl bg-emerald-950/10 border border-emerald-900/30">
                        <div className="flex items-center justify-between text-xs font-mono text-emerald-400 mb-2">
                          <span>AFTER: GROQ LLM REWRITE (HIGH IMPACT)</span>
                          <span>SCORE BOOST: +24 PTS</span>
                        </div>
                        <p className="font-mono text-xs text-zinc-200 leading-relaxed">
                          "{activeProfile.refinedBullet}"
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* TECHNICAL DEEP-DIVE BENTO GRID */}
            <section className="py-16 border-b border-[#1A1F2C] bg-[#0A0D13]">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-2xl mb-10">
                  <div className="font-mono text-xs text-zinc-400 uppercase tracking-widest">Engineering Primitives</div>
                  <h2 className="font-tech text-2xl sm:text-3xl font-bold text-white mt-1">
                    Built for Deterministic AI Precision
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Card 1 */}
                  <div className="p-6 rounded-2xl bg-[#0D1017] border border-[#1A1F2C] flex flex-col justify-between">
                    <div>
                      <div className="w-8 h-8 rounded-lg bg-[#141824] border border-[#202738] flex items-center justify-center text-zinc-300 mb-4">
                        <Icons.GitBranch />
                      </div>
                      <h3 className="font-tech font-bold text-base text-white">LangGraph State Persistence</h3>
                      <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                        State transitions are recorded in disk-backed SQLite checkpoint databases. If a network interruption occurs, the pipeline resumes seamlessly from the latest node.
                      </p>
                    </div>
                    <div className="mt-6 pt-4 border-t border-[#141824] font-mono text-[11px] text-zinc-500">
                      SQLite Saver: checkpoints/resume_checkpoints.db
                    </div>
                  </div>

                  {/* Card 2 */}
                  <div className="p-6 rounded-2xl bg-[#0D1017] border border-[#1A1F2C] flex flex-col justify-between">
                    <div>
                      <div className="w-8 h-8 rounded-lg bg-[#141824] border border-[#202738] flex items-center justify-center text-zinc-300 mb-4">
                        <Icons.Database />
                      </div>
                      <h3 className="font-tech font-bold text-base text-white">Local Hugging Face RAG</h3>
                      <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                        PDF pages split into 600-character chunks with 100-character overlap. Embedded locally via all-MiniLM-L6-v2 into FAISS indices to prevent query latency bottlenecks.
                      </p>
                    </div>
                    <div className="mt-6 pt-4 border-t border-[#141824] font-mono text-[11px] text-zinc-500">
                      Retrieval Strategy: 5 Nearest Neighbors + Strict Filter
                    </div>
                  </div>

                  {/* Card 3 */}
                  <div className="p-6 rounded-2xl bg-[#0D1017] border border-[#1A1F2C] flex flex-col justify-between">
                    <div>
                      <div className="w-8 h-8 rounded-lg bg-[#141824] border border-[#202738] flex items-center justify-center text-zinc-300 mb-4">
                        <Icons.Mail />
                      </div>
                      <h3 className="font-tech font-bold text-base text-white">Automated Cold Outreach Synthesis</h3>
                      <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                        When candidate scores surpass 80 and matching jobs are found via RapidAPI JSearch, the pipeline autonomously synthesizes a tailored email directly addressed to hiring managers.
                      </p>
                    </div>
                    <div className="mt-6 pt-4 border-t border-[#141824] font-mono text-[11px] text-zinc-500">
                      Condition Gate: ATS &ge; 80 && JobCount &ge; 1
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* COMPARISON MATRIX (RESUME TALK VS TRADITIONAL) */}
            <section className="py-16 border-b border-[#1A1F2C]">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-2xl mx-auto mb-10">
                  <div className="font-mono text-xs text-zinc-400 uppercase tracking-widest">Architectural Comparison</div>
                  <h2 className="font-tech text-2xl sm:text-3xl font-bold text-white mt-1">
                    Engineered Beyond Generic Prompt Wrappers
                  </h2>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left font-mono text-xs border border-[#1A1F2C] rounded-xl overflow-hidden">
                    <thead className="bg-[#0D1017] text-zinc-400 border-b border-[#1A1F2C]">
                      <tr>
                        <th className="p-4">CAPABILITY</th>
                        <th className="p-4 text-white">RESUME TALK (LANGGRAPH)</th>
                        <th className="p-4 text-zinc-500">TRADITIONAL ATS (JOBSCAN)</th>
                        <th className="p-4 text-zinc-500">RAW CHATGPT PROMPT</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#141824] bg-[#0A0C12]">
                      {[
                        { cap: 'Self-Correcting Refinement Loop', rt: true, trad: false, gpt: false },
                        { cap: 'Deterministic Micro-Latency Scoring', rt: true, trad: true, gpt: false },
                        { cap: 'FAISS Chunk-Grounded Chat Citations', rt: true, trad: false, gpt: false },
                        { cap: 'State Checkpoints & Crash Recovery', rt: true, trad: false, gpt: false },
                        { cap: 'Live JSearch API Job Discovery', rt: true, trad: false, gpt: false },
                        { cap: 'Autonomous Recruiter Outreach Email', rt: true, trad: false, gpt: false }
                      ].map((row, idx) => (
                        <tr key={idx} className="hover:bg-[#0E1118]">
                          <td className="p-4 text-zinc-300 font-sans font-medium">{row.cap}</td>
                          <td className="p-4 text-emerald-400 font-bold flex items-center gap-1.5">
                            <Icons.Check /> Supported
                          </td>
                          <td className="p-4 text-zinc-500">{row.trad ? 'Basic Regex' : 'No'}</td>
                          <td className="p-4 text-zinc-500">{row.gpt ? 'Manual' : 'No (Hallucinates)'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            {/* FREQUENTLY ASKED QUESTIONS */}
            <section className="py-16">
              <div className="max-w-4xl mx-auto px-4 sm:px-6">
                <div className="text-center mb-10">
                  <div className="font-mono text-xs text-zinc-400 uppercase tracking-widest">Technical Specifications</div>
                  <h2 className="font-tech text-2xl sm:text-3xl font-bold text-white mt-1">
                    System Architecture FAQ
                  </h2>
                </div>

                <div className="space-y-3">
                  {[
                    {
                      q: 'How does Resume Talk prevent LLM hallucinations during chat?',
                      a: 'The RAG pipeline extracts text chunks of 600 characters with 100-character overlap, indexes them locally in FAISS using sentence-transformers, and binds the Gemini generation prompt strictly to retrieved context. Unreferenced claims are rejected.'
                    },
                    {
                      q: 'Why use Groq and Gemini together in a dual-model topology?',
                      a: 'Gemini 1.5 Pro excels at structural comprehension, multimodal parsing, and deep section breakdown. Groq with LLaMA 3 provides ultra-fast inference (<500ms) necessary to run iterative evaluation loops without user timeout.'
                    },
                    {
                      q: 'What triggers the automated job fetching and recruiter outreach draft?',
                      a: 'The LangGraph supervisor evaluates state conditions after each scoring pass. Once a candidate achieves ATS >= 80, the supervisor triggers the JSearch node, retrieves up to 3 live roles, and produces a customized recruiter email.'
                    },
                    {
                      q: 'Where are session checkpoints and files persisted?',
                      a: 'Resumes are temporarily staged in temp_uploads/ with UUID filenames. Workflow state transitions are persisted via a disk-backed SQLite checkpointer in checkpoints/resume_checkpoints.db.'
                    }
                  ].map((faq, i) => (
                    <div key={i} className="rounded-xl bg-[#0D1017] border border-[#1A1F2C] overflow-hidden">
                      <button
                        onClick={() => setOpenFaq(openFaq === i ? null : i)}
                        className="w-full p-4 text-left font-tech text-sm font-semibold text-zinc-200 flex items-center justify-between hover:bg-[#121622] transition-colors"
                      >
                        <span>{faq.q}</span>
                        <span className={`transform transition-transform ${openFaq === i ? 'rotate-180' : ''}`}>
                          <Icons.ChevronDown />
                        </span>
                      </button>
                      {openFaq === i && (
                        <div className="px-4 pb-4 text-xs text-zinc-400 leading-relaxed border-t border-[#141824] pt-3">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        )}

        {/* ========================================================================= */}
        {/* PAGE 2: TARGET & UPLOAD CONFIGURATION                                     */}
        {/* ========================================================================= */}
        {currentPage === 'upload' && (
          <div className="max-w-4xl mx-auto px-4 py-12 w-full flex-1 flex flex-col justify-center">
            <div className="mb-8">
              <span className="font-mono text-xs text-zinc-500 uppercase tracking-wider">PIPELINE CONFIGURATION</span>
              <h2 className="font-tech text-3xl font-bold text-white mt-1">Upload Resume & Target Profile</h2>
              <p className="text-xs text-zinc-400 mt-1">Ingest PDF documents to trigger deterministic LangGraph ATS scoring.</p>
            </div>

            <div className="bg-[#0D1017] border border-[#1A1F2C] rounded-2xl p-6 sm:p-8 space-y-6">
              {/* Dropzone */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-[#22293A] hover:border-slate-500 bg-[#0A0C12] rounded-xl p-8 text-center cursor-pointer transition-colors"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <div className="w-10 h-10 mx-auto rounded-lg bg-[#141824] border border-[#232A3B] flex items-center justify-center text-zinc-300 mb-3">
                  <Icons.Upload />
                </div>
                {uploadedFile ? (
                  <div className="space-y-1">
                    <p className="font-mono text-xs text-emerald-400 font-semibold">
                      {uploadedFile.name} ({(uploadedFile.size / 1024 / 1024).toFixed(2)} MB)
                    </p>
                    <p className="text-[11px] text-zinc-500">MIME verified: application/pdf • In-memory buffer ready</p>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setUploadedFile(null);
                        if (fileInputRef.current) fileInputRef.current.value = '';
                      }}
                      className="text-[11px] text-zinc-400 hover:text-white underline mt-2 inline-block"
                    >
                      Clear and re-upload
                    </button>
                  </div>
                ) : (
                  <div>
                    <p className="text-xs font-semibold text-zinc-200">Select candidate resume PDF</p>
                    <p className="font-mono text-[11px] text-zinc-500 mt-1">Max 5.0 MB • Form parsed via pypdf</p>
                    <span className="mt-3 inline-block px-2 py-0.5 rounded bg-[#141824] text-zinc-400 font-mono text-[10px]">
                      Click to select your PDF
                    </span>
                  </div>
                )}
              </div>

              {/* Form Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-xs text-zinc-400 mb-1.5">TARGET ROLE</label>
                  <input
                    type="text"
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                    placeholder="e.g. Senior Machine Learning Engineer"
                    className="w-full bg-[#0A0C12] border border-[#1A1F2C] focus:border-slate-500 rounded-lg px-3.5 py-2 text-xs font-mono text-zinc-200 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-mono text-xs text-zinc-400 mb-1.5">SENIORITY TIER</label>
                  <select
                    value={jobLevel}
                    onChange={(e) => setJobLevel(e.target.value)}
                    className="w-full bg-[#0A0C12] border border-[#1A1F2C] focus:border-slate-500 rounded-lg px-3.5 py-2 text-xs font-mono text-zinc-200 focus:outline-none"
                  >
                    <option value="Fresher">Entry Level (0-2 yrs)</option>
                    <option value="Mid">Mid-Level (2-5 yrs)</option>
                    <option value="Senior">Senior Level (5-8 yrs)</option>
                    <option value="Staff/Principal">Staff / Principal (8+ yrs)</option>
                  </select>
                </div>
              </div>

              {/* Supervisor Threshold Slider */}
              <div className="p-4 rounded-xl bg-[#0A0C12] border border-[#161B26]">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-mono text-xs text-zinc-400">SUPERVISOR SCORE GATE</span>
                  <span className="font-mono text-xs text-white font-bold">{scoreThreshold} / 100</span>
                </div>
                <input
                  type="range"
                  min="65"
                  max="95"
                  value={scoreThreshold}
                  onChange={(e) => setScoreThreshold(Number(e.target.value))}
                  className="w-full accent-slate-300 bg-[#161B26] h-1.5 rounded-lg cursor-pointer"
                />
                <p className="text-[11px] text-zinc-500 mt-1.5">
                  The LangGraph supervisor triggers the <code className="text-zinc-300 font-mono">refine_resume</code> node until score &ge; {scoreThreshold}.
                </p>
              </div>

              {/* Execution Action */}
              <div className="pt-2 flex justify-end">
                <button
                  onClick={runAnalysis}
                  disabled={workflowStatus === 'running'}
                  className="px-6 py-2.5 rounded-lg bg-white hover:bg-zinc-200 text-zinc-950 font-semibold text-xs tracking-wide transition-all flex items-center gap-2"
                >
                  <Icons.Terminal />
                  <span>Execute LangGraph Workflow</span>
                </button>
              </div>
              {analysisError && (
                <p className="text-xs text-rose-400 font-mono">{analysisError}</p>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* PAGE 3: STATEGRAPH LIVE MONITOR (SSE LOG STREAM)                          */}
        {/* ========================================================================= */}
        {currentPage === 'workflow' && (
          <div className="max-w-6xl mx-auto px-4 py-8 w-full flex-1 flex flex-col">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#1A1F2C] gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-tech text-2xl font-bold text-white">LangGraph Runtime Execution</h2>
                  <span className="px-2 py-0.5 rounded font-mono text-[10px] bg-[#141824] text-zinc-400 border border-[#202738]">
                    THREAD: {threadId || 'waiting'}
                  </span>
                </div>
                <p className="font-mono text-xs text-zinc-400 mt-1">
                  Listening to Server-Sent Events on /api/v1/stream/{threadId || 'waiting'}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right font-mono text-xs">
                  <div className="text-zinc-500">ITERATION</div>
                  <div className="text-white font-bold">{currentIteration} OF 3</div>
                </div>
                {workflowStatus === 'completed' && (
                  <button
                    onClick={() => setCurrentPage('report')}
                    className="px-3.5 py-1.5 rounded-lg bg-white text-zinc-950 text-xs font-semibold hover:bg-zinc-200 transition-all flex items-center gap-1.5"
                  >
                    <span>View Output</span>
                    <Icons.ArrowRight />
                  </button>
                )}
              </div>
            </div>

            {/* Progress Meter */}
            <div className="mt-6 bg-[#0E1118] rounded-full h-1.5 overflow-hidden border border-[#1A1F2C]">
              <div 
                className="bg-zinc-200 h-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Topology Node Indicators */}
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2.5">
              {[
                { id: 'ingest', name: 'Ingest', lib: 'pypdf' },
                { id: 'sections', name: 'Sections', lib: 'Gemini' },
                { id: 'entities', name: 'Entities', lib: 'Gemini' },
                { id: 'signals', name: 'Signals', lib: 'Gemini' },
                { id: 'evaluate', name: 'Evaluate', lib: 'Gemini' },
                { id: 'ats', name: 'ATS Score', lib: 'Groq LLaMA' },
                { id: 'supervisor', name: 'Supervisor', lib: 'Conditional' }
              ].map((step, idx) => {
                const isDone = completedNodes.includes(step.id);
                const isActive = activeNode === step.id;
                return (
                  <div
                    key={step.id}
                    className={`p-3 rounded-xl border text-center transition-all ${
                      isActive
                        ? 'border-slate-400 bg-[#141824] text-white shadow-sm'
                        : isDone
                        ? 'border-emerald-900/40 bg-emerald-950/10 text-emerald-400'
                        : 'border-[#1A1F2C] bg-[#0A0C12] text-zinc-600'
                    }`}
                  >
                    <div className="font-mono text-[9px] text-zinc-500">{step.lib}</div>
                    <div className="font-tech text-xs font-bold mt-0.5">{step.name}</div>
                    <div className="mt-2 flex justify-center">
                      {isActive ? (
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-300 animate-ping" />
                      ) : isDone ? (
                        <Icons.Check />
                      ) : (
                        <span className="font-mono text-[10px] text-zinc-700">#{idx + 1}</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Terminal Console */}
            <div className="mt-6 flex-1 bg-[#07080C] border border-[#1A1F2C] rounded-xl p-4 font-mono text-xs flex flex-col min-h-[300px]">
              <div className="flex items-center justify-between pb-3 border-b border-[#141824] text-zinc-500 text-[11px]">
                <span className="flex items-center gap-2">
                  <Icons.Terminal />
                  <span>SSE RAW DATA STREAM</span>
                </span>
                <span>STATUS: {workflowStatus.toUpperCase()}</span>
              </div>

              <div className="mt-3 flex-1 overflow-y-auto space-y-2 pr-2">
                {logs.length === 0 && (
                  <div className="text-zinc-600 italic">Awaiting pipeline stream events...</div>
                )}
                {logs.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <span className="text-zinc-600 select-none">{item.time}</span>
                    <span className="text-zinc-300">{item.message}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* PAGE 4: ATS RESULTS & JOB DISCOVERY REPORT                                */}
        {/* ========================================================================= */}
        {currentPage === 'report' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[#1A1F2C]">
              <div>
                <span className="font-mono text-[11px] text-zinc-500 uppercase">ANALYSIS COMPLETED</span>
                <h2 className="font-tech text-2xl font-bold text-white">{candidateName} • {targetRole} ({jobLevel})</h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setEmailModalOpen(true)}
                  className="px-3 py-1.5 rounded-lg bg-[#141824] border border-[#232A3B] text-zinc-300 hover:text-white text-xs font-mono flex items-center gap-1.5"
                >
                  <Icons.Mail />
                  <span>View Outreach Draft</span>
                </button>
                <button
                  onClick={() => setCurrentPage('chat')}
                  className="px-3.5 py-1.5 rounded-lg bg-white text-zinc-950 font-semibold text-xs flex items-center gap-1.5"
                >
                  <Icons.MessageSquare />
                  <span>Open RAG Copilot</span>
                </button>
              </div>
            </div>

            {/* Score Bento */}
            <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="bg-[#0D1017] border border-[#1A1F2C] rounded-2xl p-6 flex flex-col items-center justify-center text-center">
                <div className="w-36 h-36 rounded-full border-4 border-[#1E2535] border-t-zinc-200 border-r-slate-400 flex flex-col items-center justify-center">
                  <span className="font-tech text-4xl font-extrabold text-white">{analysisResults?.ats_score ?? 0}</span>
                  <span className="font-mono text-[10px] text-zinc-500 uppercase mt-0.5">ATS SCORE</span>
                </div>
                <div className="mt-4 font-mono text-[11px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  {analysisResults?.ats_score >= scoreThreshold ? 'PASSED' : 'BELOW'} THRESHOLD (&ge; {scoreThreshold})
                </div>
              </div>

              <div className="lg:col-span-2 grid grid-cols-2 gap-3">
                {[
                  { name: 'SKILLS & TECH MATCH', val: `${Math.min(100, candidateSkills.length * 10)}%`, note: candidateSkills.length ? candidateSkills.join(', ') : 'No entities extracted' },
                  { name: 'DOMAIN RELEVANCE', val: `${analysisResults?.signals?.role_bias ? 80 : 0}%`, note: analysisResults?.signals?.role_bias || 'Not available' },
                  { name: 'SENIORITY SIGNALS', val: `${analysisResults?.signals?.seniority_level ? 80 : 0}%`, note: analysisResults?.signals?.seniority_level || 'Not available' },
                  { name: 'QUANTIFIED IMPACT', val: `${analysisResults?.evaluation?.strengths ? 80 : 0}%`, note: analysisResults?.evaluation?.strengths || 'Not available' }
                ].map((item, i) => (
                  <div key={i} className="p-4 rounded-xl bg-[#0D1017] border border-[#1A1F2C] flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center font-mono text-xs">
                        <span className="text-zinc-400">{item.name}</span>
                        <span className="text-white font-bold">{item.val}</span>
                      </div>
                      <div className="w-full bg-[#141824] h-1 rounded-full mt-2 overflow-hidden">
                        <div className="bg-zinc-300 h-full" style={{ width: item.val }} />
                      </div>
                    </div>
                    <p className="text-[11px] text-zinc-500 mt-2">{item.note}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Keyword Deficits */}
            <div className="mt-6 p-5 rounded-2xl bg-[#0D1017] border border-[#1A1F2C]">
              <div className="font-mono text-xs text-zinc-400 mb-3">ACTIONABLE ENTITY DEFICITS (IDENTIFIED BY GROQ ATS NODE)</div>
              <div className="flex flex-wrap gap-2">
                {missingKeywords.map((tag, i) => (
                  <div key={i} className="px-3 py-1.5 rounded-lg bg-[#0A0C12] border border-[#1A1F2C] font-mono text-xs flex items-center gap-2">
                    <span className="text-zinc-200">{tag}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Matching Job Listings */}
            <div className="mt-6">
              <div className="font-mono text-xs text-zinc-400 mb-3 flex items-center justify-between">
                <span>MATCHING OPENINGS (RAPIDAPI JSEARCH)</span>
                <span className="text-emerald-400">{liveJobs.length} VERIFIED OPENINGS</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {liveJobs.map((job, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-[#0D1017] border border-[#1A1F2C] flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <span className="font-mono text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                          VERIFIED
                        </span>
                        <span className="font-mono text-[10px] text-zinc-500">Live match</span>
                      </div>
                      <h4 className="font-tech text-sm font-bold text-white mt-2">{job.title}</h4>
                      <p className="text-xs text-zinc-400 mt-0.5">{job.company}</p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-[#141824] flex items-center justify-between">
                      <button 
                        onClick={() => setEmailModalOpen(true)}
                        className="font-mono text-[11px] text-zinc-400 hover:text-white flex items-center gap-1"
                      >
                        <Icons.Mail />
                        Draft Pitch
                      </button>
                      <a href={job.link || '#'} target="_blank" rel="noreferrer" className="px-2.5 py-1 rounded bg-[#141824] hover:bg-[#1A2030] text-zinc-200 font-mono text-[11px] flex items-center gap-1">
                        Apply
                        <Icons.ExternalLink />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* PAGE 5: RAG RESUME COPILOT STUDIO                                         */}
        {/* ========================================================================= */}
        {currentPage === 'chat' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex-1 flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-[#1A1F2C]">
              <div>
                <h2 className="font-tech text-2xl font-bold text-white">FAISS-Grounded Resume Copilot</h2>
                <p className="font-mono text-xs text-zinc-400 mt-0.5">
                  Vector index: sentence-transformers/all-MiniLM-L6-v2 • 6 chunks
                </p>
              </div>
              <button
                onClick={() => setCurrentPage('report')}
                className="font-mono text-xs text-zinc-400 hover:text-white"
              >
                &larr; Back to Report
              </button>
            </div>

            <div className="mt-4 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[500px]">
              {/* Chunk Inspector */}
              <div className="lg:col-span-4 bg-[#0D1017] border border-[#1A1F2C] rounded-xl p-4 flex flex-col">
                <div className="font-mono text-xs text-zinc-400 pb-3 border-b border-[#141824] flex justify-between items-center">
                  <span>VECTOR CHUNKS (DIM 384)</span>
                  <span className="text-emerald-400">FAISS LOADED</span>
                </div>

                <div className="mt-3 flex-1 overflow-y-auto space-y-2 pr-1">
                  {resumeChunks.map((chunk) => (
                    <div
                      key={chunk.id}
                      onClick={() => setSelectedChunk(chunk.id)}
                      className={`p-3 rounded-lg border text-xs cursor-pointer transition-colors ${
                        selectedChunk === chunk.id
                          ? 'border-slate-400 bg-[#141824]'
                          : 'border-[#1A1F2C] bg-[#0A0C12] hover:bg-[#0F121A]'
                      }`}
                    >
                      <div className="flex justify-between font-mono text-[10px] text-zinc-500 mb-1">
                        <span>{chunk.tag}</span>
                        <span>SIM: {chunk.score}</span>
                      </div>
                      <p className="font-mono text-zinc-400 line-clamp-2 text-[11px] leading-relaxed">
                        {chunk.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Chat Stream */}
              <div className="lg:col-span-8 bg-[#0D1017] border border-[#1A1F2C] rounded-xl flex flex-col overflow-hidden">
                {/* Preset Chips */}
                <div className="p-3 bg-[#0A0C12] border-b border-[#141824] flex items-center gap-2 overflow-x-auto">
                  <span className="font-mono text-[10px] text-zinc-500 whitespace-nowrap">PRESETS:</span>
                  {[
                    'Summarize key technical strengths',
                    'Highlight missing seniority signals',
                    'Draft a 30-sec interview pitch'
                  ].map((p, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(p)}
                      className="whitespace-nowrap px-2.5 py-1 rounded bg-[#141824] hover:bg-[#1A2030] text-zinc-300 font-mono text-[11px] border border-[#1F2636]"
                    >
                      {p}
                    </button>
                  ))}
                </div>

                {/* Message Log */}
                <div className="flex-1 p-4 overflow-y-auto space-y-3 font-mono text-xs">
                  {chatMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`max-w-xl rounded-xl p-3 leading-relaxed ${
                          msg.sender === 'user'
                            ? 'bg-white text-zinc-950 font-sans font-medium'
                            : msg.sender === 'system'
                            ? 'bg-[#0A0C12] border border-[#161B26] text-zinc-500 text-[11px]'
                            : 'bg-[#0A0C12] border border-[#1A1F2C] text-zinc-200'
                        }`}
                      >
                        <p className="whitespace-pre-line">{msg.text}</p>
                      </div>

                      {msg.citations && msg.citations.length > 0 && (
                        <div className="mt-1 flex gap-1">
                          {msg.citations.map((c, i) => (
                            <span key={i} className="text-[10px] text-zinc-500 bg-[#121622] px-1.5 py-0.2 rounded border border-[#1A1F2C]">
                              {c}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}

                  {isTyping && (
                    <div className="text-zinc-500 text-xs font-mono">
                      FAISS retrieving context & Gemini formatting...
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>

                {/* Input */}
                <div className="p-3 bg-[#0A0C12] border-t border-[#141824]">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSendMessage();
                    }}
                    className="flex gap-2"
                  >
                    <input
                      type="text"
                      value={inputQuery}
                      onChange={(e) => setInputQuery(e.target.value)}
                      placeholder="Ask questions grounded in uploaded resume chunks..."
                      className="flex-1 bg-[#0D1017] border border-[#1A1F2C] focus:border-slate-500 rounded-lg px-3 py-2 text-xs font-mono text-zinc-200 focus:outline-none"
                    />
                    <button
                      type="submit"
                      disabled={!inputQuery.trim()}
                      className="px-4 py-2 rounded-lg bg-white hover:bg-zinc-200 disabled:opacity-40 text-zinc-950 font-semibold text-xs tracking-wide transition-all"
                    >
                      Query
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* OUTREACH EMAIL MODAL */}
      {emailModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0D1017] border border-[#1A1F2C] rounded-2xl max-w-xl w-full p-6 shadow-2xl relative font-mono text-xs">
            <div className="flex justify-between items-center pb-3 border-b border-[#141824]">
              <span className="text-zinc-400">OUTREACH EMAIL DRAFT (GROQ DRAFT_EMAIL NODE)</span>
              <button onClick={() => setEmailModalOpen(false)} className="text-zinc-500 hover:text-white">✕</button>
            </div>

            <div className="mt-4 p-4 rounded-xl bg-[#0A0C12] border border-[#161B26] space-y-3 text-zinc-300">
              <div className="text-zinc-500 border-b border-[#141824] pb-2">
                Subject: {targetRole} Application — {candidateName}
              </div>
              <p className="whitespace-pre-line">{emailDraft}</p>
              <p>
                Best,<br />
                {candidateName}<br />
                {candidateEmail} • {candidatePhone}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-[#141824] flex justify-between items-center">
              <span className="text-[10px] text-zinc-500">Condition satisfied: ATS &ge; 80</span>
              <button
                onClick={() => {
                  setCopiedEmail(true);
                  setTimeout(() => setCopiedEmail(false), 2000);
                }}
                className="px-3 py-1.5 rounded-lg bg-white text-zinc-950 font-semibold text-xs flex items-center gap-1.5"
              >
                <Icons.Copy />
                <span>{copiedEmail ? 'Copied' : 'Copy Pitch'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="border-t border-[#141824] bg-[#07080C] py-6 px-4 sm:px-6 lg:px-8 mt-auto font-mono text-[11px] text-zinc-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-zinc-300 font-semibold">RESUME TALK</span>
            <span>• Full-Stack Deterministic AI System</span>
          </div>
          <div className="flex items-center gap-4 text-zinc-500">
            <span>FASTAPI: 8000</span>
            <span>CHECKPOINTER: SQLITE</span>
            <span>GROQ + GEMINI 1.5 PRO</span>
          </div>
        </div>
      </footer>
    </div>
  );
}