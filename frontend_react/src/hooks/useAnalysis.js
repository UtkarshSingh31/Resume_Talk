import { useState, useRef, useEffect } from 'react';

export function useAnalysis() {
  const [threadId, setThreadId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loaderStatus, setLoaderStatus] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [results, setResults] = useState(null);

  const eventSourceRef = useRef(null);

  const startAnalysis = async (file, config) => {
    if (!file) throw new Error('Please upload a resume PDF first.');
    if (!config.jobRole || !config.jobLevel) throw new Error('Please specify both Role and Level.');

    setIsLoading(true);
    setErrorMsg('');
    setLoaderStatus('Uploading & Initializing...');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('job_role', config.jobRole);
    formData.append('job_level', config.jobLevel);

    try {
      // 1. Submit file and job params
      const res = await fetch('https://utkarshsingh0013-resume-talk.hf.space/api/v1/analyze', {
        method: 'POST',
        body: formData
      });
      
      if(!res.ok) throw new Error("Failed to start analysis");
      const data = await res.json();
      setThreadId(data.thread_id);

      // 2. Start SSE Stream
      setLoaderStatus('Connecting to AI Engine...');
      startSSEStream(data.thread_id);
    } catch (err) {
      console.error(err);
      setErrorMsg('Error starting analysis. Ensure backend is running.');
    }
  };

  const startSSEStream = (currentId) => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }
    
    const eventSource = new EventSource(`https://utkarshsingh0013-resume-talk.hf.space/api/v1/stream/${currentId}`);
    eventSourceRef.current = eventSource;
    
    eventSource.onmessage = (e) => {
      const data = JSON.parse(e.data);
      
      if (data.status === 'error') {
        console.error("Pipeline Error:", data.message);
        setErrorMsg("Pipeline Error: " + data.message);
        eventSource.close();
        return;
      }

      if (data.status === 'completed') {
        eventSource.close();
        setIsLoading(false);
        setResults(data.details || {});
      } else {
        let progressMsg = 'Upload Received...';
        if (data.details) {
          const vals = data.details;
          if (vals.email_draft) progressMsg = 'Drafting Cover Email...';
          else if (vals.job_openings && vals.job_openings.length > 0) progressMsg = 'Fetching Job Matches...';
          else if (vals.ats_score) progressMsg = `Refining Resume (Iteration ${vals.iteration || 1})...`;
          else if (vals.evaluation) progressMsg = 'Evaluating Strengths & Weaknesses...';
          else if (vals.signals) progressMsg = 'Inferring Candidate Profile...';
          else if (vals.entities) progressMsg = 'Extracting Core Entities...';
          else if (vals.sections) progressMsg = 'Analyzing Resume Hierarchy...';
          else if (vals.raw_text) progressMsg = 'Extracting Text from Document...';
        }
        setLoaderStatus(progressMsg);
        setResults(data.details || {}); // keep showing partial results under the hood
      }
    };
    
    eventSource.onerror = (e) => {
      console.error("SSE Error:", e);
      setLoaderStatus("Connection lost. Reconnecting...");
    };
  };

  useEffect(() => {
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, []);

  return {
    threadId,
    isLoading,
    loaderStatus,
    errorMsg,
    results,
    setIsLoading,
    setErrorMsg,
    startAnalysis
  };
}
