import React, { useState, useMemo, useRef } from 'react';
import {
  ShieldCheck,
  FileCode2,
  UploadCloud,
  CheckSquare,
  Square,
  AlertTriangle,
  CheckCircle2,
  Terminal,
  Users,
  Send,
  FolderTree,
  Server,
  Layers,
  Lock,
  Sparkles,
  Download,
  RefreshCw,
  GripVertical
} from 'lucide-react';

/**
 * eCTD Sync — Global Collaborative Pharma & Red Hat Enterprise Workbench
 * Aesthetic: Swiss Clinical Monograph & Red Hat Enterprise Console
 * Architecture: Single-file React Component (Vite + Tailwind + Vercel /api/gemini Proxy)
 */

const MAX_UPLOAD_MB = 50;
const MAX_UPLOAD_BYTES = MAX_UPLOAD_MB * 1024 * 1024;

// Sample valid ICH eCTD index.xml backbone for instant overseas team testing
const SAMPLE_ECTD_XML = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE ectd:ectd SYSTEM "util/dtd/ich-ectd-3-2.dtd">
<ectd:ectd xmlns:ectd="http://www.ich.org/ectd" xmlns:xlink="http://www.w3c.org/1999/xlink" dtd-version="3.2">
  <m1-administrative-information-and-prescribing-information>
    <m1-0-cover-letter>
      <leaf ID="node-101" operation="new" checksum-type="md5" xlink:href="m1/us/10-cover/cover-letter.pdf">
        <title>FDA Form 356h &amp; Cover Letter - Sequence 0000</title>
      </leaf>
    </m1-0-cover-letter>
  </m1-administrative-information-and-prescribing-information>
  <m2-common-technical-document-summaries>
    <m2-2-introduction>
      <leaf ID="node-201" operation="new" checksum-type="md5" xlink:href="m2/22-intro/introduction.pdf">
        <title>2.2 Clinical &amp; Quality Introduction</title>
      </leaf>
    </m2-2-introduction>
  </m2-common-technical-document-summaries>
  <m3-quality>
    <m3-2-body-of-data>
      <leaf ID="node-301" operation="new" checksum-type="md5" xlink:href="m3/32-body-data/drug-substance.pdf">
        <title>3.2.S Drug Substance Manufacturing Specification (GxP Verified)</title>
      </leaf>
    </m3-2-body-of-data>
  </m3-quality>
  <m4-nonclinical-study-reports />
  <m5-clinical-study-reports>
    <m5-3-clinical-study-reports>
      <leaf ID="node-501" operation="new" checksum-type="md5" xlink:href="m5/53-clin-stud-rep/phase3-pivotal.pdf">
        <title>5.3.5.1 Pivotal Phase III Clinical Efficacy Report</title>
      </leaf>
    </m5-3-clinical-study-reports>
  </m5-clinical-study-reports>
</ectd:ectd>`;

const INITIAL_ROADMAP_LAYERS = [
  {
    id: 'redhat',
    step: 'LAYER 01',
    title: 'Red Hat Enterprise Vault',
    subtitle: 'RHEL 9 & OpenShift Air-Gapped Compliance Foundation',
    ownerRole: 'redhat',
    ownerLabel: 'Red Hat DevOps Lead',
    accentColor: '#EE0000',
    badgeText: 'FDA 21 CFR PART 11 / GxP',
    tasks: [
      {
        id: 'rh-1',
        code: 'RH-101',
        title: 'Provision air-gapped Red Hat OpenShift Container Platform blueprint',
        detail: 'Ensures pre-approval molecule formulas remain inside the pharma client private server room with zero public cloud egress.',
        done: true
      },
      {
        id: 'rh-2',
        code: 'RH-102',
        title: 'Enforce SELinux mandatory access controls & immutable audit trails',
        detail: 'Kernel-level cryptographic logging for every XML leaf creation, replacement, or deletion (21 CFR Part 11.10).',
        done: false
      },
      {
        id: 'rh-3',
        code: 'RH-103',
        title: 'Containerize XML validation worker with RHEL UBI 9 minimal image',
        detail: 'Eliminates CVE attack surfaces for enterprise CISO security audits.',
        done: false
      }
    ]
  },
  {
    id: 'replit',
    step: 'LAYER 02',
    title: 'Replit Engine Room',
    subtitle: 'Rapid ICH eCTD XML Tree & Checksum Generator',
    ownerRole: 'engineer',
    ownerLabel: 'Offshore Engineering Team',
    accentColor: '#0F4C81',
    badgeText: 'ICH M2 EWG v3.2.2',
    tasks: [
      {
        id: 'rep-1',
        code: 'ENG-201',
        title: 'Build deterministic index.xml & regional.xml DTD generator',
        detail: 'Automates XML leaf IDs, xlink:href relative paths, and MD5/SHA-256 checksum calculation.',
        done: true
      },
      {
        id: 'rep-2',
        code: 'ENG-202',
        title: 'Implement < 50MB pre-flight dossier chunk & size gatekeeper',
        detail: 'Prevents oversized binary PDFs from exhausting serverless memory or prepaid AI token budgets.',
        done: true
      },
      {
        id: 'rep-3',
        code: 'ENG-203',
        title: 'Automated PDF/A-1b & hyperlink destination verifier',
        detail: 'Catches broken cross-module bookmarks prior to FDA ESG / EMA CESP submission.',
        done: false
      }
    ]
  },
  {
    id: 'ahoy',
    step: 'LAYER 03',
    title: 'Ahoy AI Operations',
    subtitle: 'Executive Follow-Up & Regulatory Stakeholder Workflow',
    ownerRole: 'regulatory',
    ownerLabel: 'Founder & Regulatory Ops',
    accentColor: '#047857',
    badgeText: 'WORKFLOW AUTOMATION',
    tasks: [
      {
        id: 'ah-1',
        code: 'OPS-301',
        title: 'Configure automated post-conference pharma executive follow-ups',
        detail: 'Logs Regulatory Affairs VP contacts and schedules live Red Hat/eCTD sandbox demos automatically.',
        done: false
      },
      {
        id: 'ah-2',
        code: 'OPS-302',
        title: 'Sync overseas QA review sign-off digests across time zones',
        detail: 'Consolidates DTD inspection feedback from London, Frankfurt, and offshore dev teams.',
        done: false
      }
    ]
  },
  {
    id: 'salesforce',
    step: 'LAYER 04',
    title: 'Salesforce Health Cloud',
    subtitle: 'One-Click Enterprise Dossier Packaging Plug-In',
    ownerRole: 'designer',
    ownerLabel: 'UX / Dossier Designer',
    accentColor: '#1D4ED8',
    badgeText: 'ENTERPRISE INTEGRATION',
    tasks: [
      {
        id: 'sf-1',
        code: 'UX-401',
        title: 'Design "Package eCTD Sequence" Lightning Web Component',
        detail: 'Pulls clinical trial metadata directly from Salesforce Health Cloud into a ready-to-validate dossier.',
        done: false
      },
      {
        id: 'sf-2',
        code: 'UX-402',
        title: 'Usability benchmark for drag-and-drop sequence lifecycle',
        detail: 'Verify regulatory publishers can assign New / Replace / Delete leaf operators in under 3 clicks.',
        done: false
      }
    ]
  }
];

const INITIAL_MODULES = [
  { id: 'm1', code: 'M1', name: 'Regional Administrative & Prescribing Info', agency: 'FDA / EMA Specific', status: 'DTD v3.3 Ready', leafs: 4 },
  { id: 'm2', code: 'M2', name: 'Common Technical Document Summaries', agency: 'ICH Harmonized', status: 'Verified', leafs: 7 },
  { id: 'm3', code: 'M3', name: 'Quality (CMC & Drug Substance)', agency: 'ICH M4Q', status: 'Needs Checksum', leafs: 12 },
  { id: 'm4', code: 'M4', name: 'Nonclinical Study Reports', agency: 'ICH M4S', status: 'Verified', leafs: 5 },
  { id: 'm5', code: 'M5', name: 'Clinical Study Reports (STF)', agency: 'ICH M4E', status: 'STF XML Valid', leafs: 9 }
];

const INITIAL_REVIEWS = [
  {
    id: 1,
    author: 'Dr. H. Lindqvist',
    role: 'Regulatory Affairs QA',
    location: 'Basel / Remote',
    timestamp: '09:42 UTC',
    verdict: 'APPROVED',
    note: 'Verified DTD 3.2 leaf operator attributes (new/replace/delete). Drag-and-drop sequence ordering is intuitive for submission publishers.'
  },
  {
    id: 2,
    author: 'M. Kovacs',
    role: 'Red Hat OpenShift Eng',
    location: 'Brno / Remote',
    timestamp: '11:15 UTC',
    verdict: 'INFO',
    note: 'Confirmed RHEL 9 UBI container runs statelessly. Frontend Vercel deployment communicates strictly via /api/gemini without exposing keys.'
  }
];

export default function App() {
  // Active View Tab: 'workbench' | 'xml-sandbox' | 'vercel-guide'
  const [activeTab, setActiveTab] = useState('workbench');

  // Active Overseas Stakeholder Role
  const [activeRole, setActiveRole] = useState('regulatory');

  // 4-Layer Roadmap State
  const [layers, setLayers] = useState(INITIAL_ROADMAP_LAYERS);
  const [selectedLayerId, setSelectedLayerId] = useState('redhat');

  // Drag & Drop Dossier Inspector State (< 50MB enforced)
  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const [inspectionReport, setInspectionReport] = useState(null);
  const fileInputRef = useRef(null);

  // Interactive 5-Module Reordering State (for UX & Regulatory Feasibility Testing)
  const [modules, setModules] = useState(INITIAL_MODULES);
  const [draggedModuleIdx, setDraggedModuleIdx] = useState(null);

  // Overseas Stakeholder Review Feed
  const [reviews, setReviews] = useState(INITIAL_REVIEWS);
  const [reviewerName, setReviewerName] = useState('');
  const [reviewVerdict, setReviewVerdict] = useState('APPROVED');
  const [reviewNote, setReviewNote] = useState('');

  // Gemini Regulatory AI Assistant (via Vercel /api/gemini backend proxy)
  const [aiQuery, setAiQuery] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSourceMode, setAiSourceMode] = useState('');

  // Compute Execution Progress Metrics
  const stats = useMemo(() => {
    let total = 0;
    let completed = 0;
    layers.forEach((layer) => {
      layer.tasks.forEach((t) => {
        total += 1;
        if (t.done) completed += 1;
      });
    });
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { total, completed, percent };
  }, [layers]);

  // Toggle Task Completion
  const toggleTask = (layerId, taskId) => {
    setLayers((prev) =>
      prev.map((layer) => {
        if (layer.id !== layerId) return layer;
        return {
          ...layer,
          tasks: layer.tasks.map((task) =>
            task.id === taskId ? { ...task, done: !task.done } : task
          )
        };
      })
    );
  };

  // Compute Real SHA-256 Checksum using Web Crypto API (FDA eCTD Requirement)
  const computeSha256 = async (arrayBuffer) => {
    try {
      if (!window.crypto || !window.crypto.subtle) {
        return 'sha256-requires-secure-https-context';
      }
      const hashBuffer = await window.crypto.subtle.digest('SHA-256', arrayBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
    } catch {
      return 'sha256-unavailable-in-sandbox';
    }
  };

  // Inspect Dropped or Selected File (Enforces < 50MB Cap + Real XML DOM Parsing)
  const analyzeDossierFile = async (file) => {
    if (!file) return;

    const sizeMB = (file.size / (1024 * 1024)).toFixed(2);

    // 1. Strict 50MB Payload Guard
    if (file.size > MAX_UPLOAD_BYTES) {
      setInspectionReport({
        status: 'REJECTED',
        fileName: file.name,
        sizeLabel: `${sizeMB} MB`,
        reason: `File exceeds strict ${MAX_UPLOAD_MB} MB threshold (${sizeMB} MB detected). Upload blocked before backend transmission to preserve your $100/mo prepaid Google AI Studio budget.`,
        xmlNodes: 0,
        leafCount: 0,
        sha256: 'BLOCKED_PRE_HASH',
        timestamp: new Date().toLocaleTimeString()
      });
      return;
    }

    try {
      const buffer = await file.arrayBuffer();
      const sha256 = await computeSha256(buffer);

      // 2. If XML file, run real DOMParser structural validation
      if (file.name.toLowerCase().endsWith('.xml')) {
        const text = new TextDecoder().decode(buffer);
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(text, 'application/xml');
        const parserError = xmlDoc.querySelector('parsererror');

        if (parserError) {
          setInspectionReport({
            status: 'XML_ERROR',
            fileName: file.name,
            sizeLabel: `${(file.size / 1024).toFixed(1)} KB`,
            reason: `Malformed XML syntax detected: ${parserError.textContent.slice(0, 140)}...`,
            xmlNodes: 0,
            leafCount: 0,
            sha256,
            timestamp: new Date().toLocaleTimeString()
          });
          return;
        }

        const allElements = xmlDoc.getElementsByTagName('*');
        const leaves = xmlDoc.getElementsByTagName('leaf');
        const rootTag = xmlDoc.documentElement?.nodeName || 'unknown';

        setInspectionReport({
          status: 'PASSED',
          fileName: file.name,
          sizeLabel: `${(file.size / 1024).toFixed(1)} KB`,
          reason: `Well-formed XML document. Root element <${rootTag}> verified with ${leaves.length} eCTD leaf node(s). Ready for Red Hat OpenShift packaging.`,
          xmlNodes: allElements.length,
          leafCount: leaves.length,
          sha256,
          timestamp: new Date().toLocaleTimeString()
        });
      } else {
        // Non-XML Dossier Module (PDF / ZIP)
        setInspectionReport({
          status: 'PASSED',
          fileName: file.name,
          sizeLabel: `${sizeMB} MB`,
          reason: `Binary module accepted within < ${MAX_UPLOAD_MB} MB ceiling. SHA-256 checksum generated for eCTD XML leaf manifest binding.`,
          xmlNodes: 1,
          leafCount: 1,
          sha256,
          timestamp: new Date().toLocaleTimeString()
        });
      }
    } catch (err) {
      setInspectionReport({
        status: 'XML_ERROR',
        fileName: file.name,
        sizeLabel: `${sizeMB} MB`,
        reason: `Unable to read file buffer: ${err?.message || 'Unknown error'}`,
        xmlNodes: 0,
        leafCount: 0,
        sha256: 'ERROR',
        timestamp: new Date().toLocaleTimeString()
      });
    }
  };

  // Load Built-In Sample eCTD XML for Immediate Team Testing
  const runSampleXmlTest = async () => {
    const blob = new Blob([SAMPLE_ECTD_XML], { type: 'application/xml' });
    const sampleFile = new File([blob], 'index-seq0000.xml', { type: 'application/xml' });
    await analyzeDossierFile(sampleFile);
  };

  // Drag-and-Drop Module Sequence Reordering (UX & Regulatory Testing)
  const handleModuleDragStart = (index) => {
    setDraggedModuleIdx(index);
  };

  const handleModuleDrop = (targetIndex) => {
    if (draggedModuleIdx === null || draggedModuleIdx === targetIndex) return;
    const updated = [...modules];
    const [moved] = updated.splice(draggedModuleIdx, 1);
    updated.splice(targetIndex, 0, moved);
    setModules(updated);
    setDraggedModuleIdx(null);
  };

  // Post Overseas Stakeholder Review Entry
  const handleAddReview = (e) => {
    e.preventDefault();
    if (!reviewNote.trim()) return;

    const roleTitles = {
      regulatory: 'Regulatory Affairs QA',
      redhat: 'Red Hat OpenShift Eng',
      designer: 'UX / Dossier Designer',
      engineer: 'Offshore XML Dev'
    };

    const newEntry = {
      id: Date.now(),
      author: reviewerName.trim() || 'Overseas Reviewer',
      role: roleTitles[activeRole] || 'Stakeholder',
      location: 'Remote Node',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' UTC',
      verdict: reviewVerdict,
      note: reviewNote.trim()
    };

    setReviews((prev) => [newEntry, ...prev]);
    setReviewNote('');
  };

  // Export Current Audit & Build Report as JSON
  const exportAuditManifest = () => {
    const payload = {
      project: 'eCTD Sync — Red Hat & FDA/EMA Workbench',
      exportedAt: new Date().toISOString(),
      completionPercent: stats.percent,
      layers,
      moduleSequence: modules,
      stakeholderReviews: reviews,
      lastFileInspection: inspectionReport
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ectd-sync-audit-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Query Gemini 3 Flash via Vercel Serverless Proxy (/api/gemini)
  const runGeminiConsultation = async (e) => {
    e.preventDefault();
    if (!aiQuery.trim()) return;

    setAiLoading(true);
    setAiResponse('');
    setAiSourceMode('');

    // Exponential backoff helper
    const fetchWithRetry = async (url, options, retries = 3, delay = 1000) => {
      for (let i = 0; i < retries; i++) {
        try {
          const res = await fetch(url, options);
          if (res.ok) return res;
        } catch {
          // Retry silently
        }
        if (i < retries - 1) {
          await new Promise((r) => setTimeout(r, delay));
          delay *= 2;
        }
      }
      return null;
    };

    // 1. Primary Route: Vercel Serverless Function (/api/gemini) where GEMINI_API_KEY is hidden
    const proxyRes = await fetchWithRetry('/api/gemini', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: aiQuery,
        roleContext: activeRole
      })
    });

    if (proxyRes) {
      const data = await proxyRes.json();
      if (data.text) {
        setAiResponse(data.text);
        setAiSourceMode('Verified via Vercel Serverless Proxy (/api/gemini • Key Hidden)');
        setAiLoading(false);
        return;
      }
    }

    // 2. Fallback Route for Standalone Local Preview (when /api/gemini is not running)
    const fallbackApiKey = '';
    const directUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${fallbackApiKey}`;

    const directRes = await fetchWithRetry(directUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: aiQuery }] }],
        systemInstruction: {
          parts: [
            {
              text: 'You are an FDA/EMA eCTD v3.2.2/v4.0 XML backbone architect and Red Hat OpenShift 21 CFR Part 11 compliance engineer. Be concise, technical, and authoritative.'
            }
          ]
        }
      })
    });

    if (directRes) {
      const data = await directRes.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) {
        setAiResponse(text);
        setAiSourceMode('Preview Sandbox Direct Mode (Deploy on Vercel to route via /api/gemini)');
        setAiLoading(false);
        return;
      }
    }

    setAiResponse(
      'Unable to reach /api/gemini. Once deployed on Vercel with GEMINI_API_KEY added in Project Settings -> Environment Variables, all queries will execute securely on the server.'
    );
    setAiSourceMode('Offline Diagnostic Notice');
    setAiLoading(false);
  };

  const activeLayerObj = layers.find((l) => l.id === selectedLayerId) || layers[0];

  return (
    <div className="min-h-screen bg-[#F4F5F7] text-[#111827] font-sans flex flex-col">
      {/* TOP CLINICAL & RED HAT ENTERPRISE HEADER */}
      <header className="bg-white border-b border-gray-300 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {/* Red Hat / Clinical Cross Emblem */}
            <div className="w-9 h-9 bg-[#EE0000] text-white flex items-center justify-center font-mono font-bold text-sm tracking-tighter">
              eCTD
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base tracking-tight text-gray-900">
                  eCTD SYNC
                </span>
                <span className="hidden sm:inline-block text-[11px] font-mono bg-gray-100 text-gray-700 border border-gray-300 px-2 py-0.5">
                  ICH M2 v3.2.2 • RHEL 9
                </span>
              </div>
              <p className="text-[11px] font-mono text-gray-500">
                Pharmaceutical Dossier Automation &amp; Overseas QA Console
              </p>
            </div>
          </div>

          {/* Stakeholder Role Switcher */}
          <div className="hidden md:flex items-center border border-gray-300 bg-gray-50 p-0.5 text-xs font-mono">
            {[
              { id: 'regulatory', label: 'Regulatory QA' },
              { id: 'redhat', label: 'Red Hat Eng' },
              { id: 'designer', label: 'UX Designer' },
              { id: 'engineer', label: 'Offshore Dev' }
            ].map((role) => (
              <button
                key={role.id}
                onClick={() => setActiveRole(role.id)}
                className={`px-3 py-1.5 transition ${
                  activeRole === role.id
                    ? 'bg-[#111827] text-white font-semibold'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {role.label}
              </button>
            ))}
          </div>

          {/* Export Manifest Button */}
          <button
            onClick={exportAuditManifest}
            className="flex items-center gap-1.5 text-xs font-mono bg-white hover:bg-gray-100 text-gray-900 border border-gray-400 px-3 py-2 transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export QA JSON</span>
          </button>
        </div>

        {/* Sub-Navigation Bar */}
        <div className="bg-[#FAFAFA] border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between overflow-x-auto">
            <nav className="flex space-x-6 text-xs font-mono">
              <button
                onClick={() => setActiveTab('workbench')}
                className={`py-3 border-b-2 transition whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === 'workbench'
                    ? 'border-[#EE0000] text-[#EE0000] font-bold'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                01. 4-LAYER EXECUTION &amp; QA LEDGER
              </button>
              <button
                onClick={() => setActiveTab('xml-sandbox')}
                className={`py-3 border-b-2 transition whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === 'xml-sandbox'
                    ? 'border-[#0F4C81] text-[#0F4C81] font-bold'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <FileCode2 className="w-3.5 h-3.5" />
                02. XML BACKBONE &amp; &lt;50MB DRAG-DROP TESTBED
              </button>
              <button
                onClick={() => setActiveTab('vercel-guide')}
                className={`py-3 border-b-2 transition whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === 'vercel-guide'
                    ? 'border-[#111827] text-[#111827] font-bold'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <Server className="w-3.5 h-3.5" />
                03. VERCEL DEPLOYMENT &amp; FIRESTORE NOTES
              </button>
            </nav>

            <div className="hidden lg:flex items-center gap-4 text-[11px] font-mono text-gray-600">
              <span className="flex items-center gap-1">
                <Lock className="w-3 h-3 text-emerald-700" />
                API KEY: SERVER-HIDDEN
              </span>
              <span className="text-gray-300">|</span>
              <span className="flex items-center gap-1 text-amber-800 font-semibold">
                UPLOAD CAP: &le; {MAX_UPLOAD_MB} MB
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 flex-grow space-y-6">
        {/* TOP METRIC STRIP (SWISS CLINICAL TABULAR GRID) */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 bg-white border border-gray-300 divide-y sm:divide-y-0 sm:divide-x divide-gray-300">
          <div className="p-4">
            <div className="text-[11px] font-mono uppercase tracking-wider text-gray-500">
              Launch Readiness Index
            </div>
            <div className="mt-1 flex items-baseline justify-between">
              <span className="text-2xl font-bold font-mono text-gray-900">
                {stats.percent}%
              </span>
              <span className="text-xs font-mono text-gray-600">
                {stats.completed}/{stats.total} Milestones
              </span>
            </div>
            <div className="w-full bg-gray-200 h-1.5 mt-2.5">
              <div
                className="bg-[#EE0000] h-1.5 transition-all duration-300"
                style={{ width: `${stats.percent}%` }}
              />
            </div>
          </div>

          <div className="p-4">
            <div className="text-[11px] font-mono uppercase tracking-wider text-gray-500">
              Compliance Foundation
            </div>
            <div className="mt-1 text-base font-bold text-gray-900 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#EE0000]" />
              Red Hat OpenShift
            </div>
            <p className="text-xs text-gray-600 mt-1 font-mono">
              Air-gapped FDA 21 CFR Part 11
            </p>
          </div>

          <div className="p-4">
            <div className="text-[11px] font-mono uppercase tracking-wider text-gray-500">
              Payload &amp; Credit Guard
            </div>
            <div className="mt-1 text-base font-bold text-gray-900 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-700" />
              Max {MAX_UPLOAD_MB} MB / File
            </div>
            <p className="text-xs text-gray-600 mt-1 font-mono">
              Protects $100/mo AI Studio Budget
            </p>
          </div>

          <div className="p-4">
            <div className="text-[11px] font-mono uppercase tracking-wider text-gray-500">
              Active Stakeholder Lens
            </div>
            <div className="mt-1 text-base font-bold text-[#0F4C81] capitalize">
              {activeRole === 'regulatory' && 'Regulatory Affairs QA'}
              {activeRole === 'redhat' && 'Red Hat DevOps Lead'}
              {activeRole === 'designer' && 'UX / Dossier Designer'}
              {activeRole === 'engineer' && 'Offshore XML Engineer'}
            </div>
            <p className="text-xs text-gray-600 mt-1 font-mono">
              Vercel React Vite Node
            </p>
          </div>
        </section>

        {/* TAB 1: 4-LAYER EXECUTION & OVERSEAS QA LEDGER */}
        {activeTab === 'workbench' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* LEFT 8 COLS: 4-LAYER ARCHITECTURE & MILESTONES */}
            <div className="lg:col-span-8 space-y-6">
              {/* Layer Selector Matrix */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {layers.map((layer) => {
                  const isSelected = layer.id === selectedLayerId;
                  const layerDoneCount = layer.tasks.filter((t) => t.done).length;
                  return (
                    <button
                      key={layer.id}
                      onClick={() => setSelectedLayerId(layer.id)}
                      className={`text-left p-3.5 border transition bg-white ${
                        isSelected
                          ? 'border-gray-900 ring-1 ring-gray-900'
                          : 'border-gray-300 hover:border-gray-500'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px] font-mono">
                        <span
                          className="font-bold"
                          style={{ color: layer.accentColor }}
                        >
                          {layer.step}
                        </span>
                        <span className="text-gray-500">
                          {layerDoneCount}/{layer.tasks.length}
                        </span>
                      </div>
                      <div className="font-bold text-xs sm:text-sm text-gray-900 mt-1">
                        {layer.title}
                      </div>
                      <div className="text-[11px] text-gray-500 mt-1 truncate font-mono">
                        {layer.ownerLabel}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Active Layer Task Checklist */}
              <div className="bg-white border border-gray-300">
                <div
                  className="p-5 border-b border-gray-300 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                  style={{ borderTop: `4px solid ${activeLayerObj.accentColor}` }}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold uppercase text-gray-500">
                        {activeLayerObj.step}
                      </span>
                      <span className="text-[11px] font-mono bg-gray-100 border border-gray-300 px-2 py-0.5 text-gray-800">
                        {activeLayerObj.badgeText}
                      </span>
                    </div>
                    <h2 className="text-lg font-bold text-gray-900 mt-1">
                      {activeLayerObj.title} — {activeLayerObj.subtitle}
                    </h2>
                  </div>
                  <div className="text-xs font-mono text-gray-600">
                    Lead: <strong>{activeLayerObj.ownerLabel}</strong>
                  </div>
                </div>

                <div className="divide-y divide-gray-200">
                  {activeLayerObj.tasks.map((task) => (
                    <div
                      key={task.id}
                      onClick={() => toggleTask(activeLayerObj.id, task.id)}
                      className={`p-4 flex items-start gap-3.5 cursor-pointer transition ${
                        task.done ? 'bg-gray-50' : 'hover:bg-gray-50/70'
                      }`}
                    >
                      <button
                        type="button"
                        className="mt-0.5 text-gray-800 focus:outline-none"
                        aria-label="Toggle milestone"
                      >
                        {task.done ? (
                          <CheckSquare className="w-5 h-5 text-emerald-700" />
                        ) : (
                          <Square className="w-5 h-5 text-gray-400" />
                        )}
                      </button>
                      <div className="flex-grow">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[11px] font-mono font-bold px-1.5 py-0.5 bg-gray-100 border border-gray-300 text-gray-700">
                            {task.code}
                          </span>
                          <span
                            className={`text-sm font-semibold ${
                              task.done ? 'line-through text-gray-500' : 'text-gray-900'
                            }`}
                          >
                            {task.title}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                          {task.detail}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick XML & File Upload Gatekeeper Preview Card */}
              <div className="bg-white border border-gray-300 p-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-gray-200">
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                      <FileCode2 className="w-4 h-4 text-[#0F4C81]" />
                      Quick eCTD XML &amp; &lt;50MB Dossier Gatekeeper
                    </h3>
                    <p className="text-xs text-gray-600 mt-0.5">
                      Drop an XML backbone or PDF module to verify syntax, compute SHA-256 checksums, and enforce the 50MB limit.
                    </p>
                  </div>
                  <button
                    onClick={runSampleXmlTest}
                    className="text-xs font-mono bg-[#0F4C81] hover:bg-[#0b3960] text-white px-3 py-1.5 transition whitespace-nowrap"
                  >
                    Run Sample index.xml Test
                  </button>
                </div>

                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDraggingFile(true);
                  }}
                  onDragLeave={() => setIsDraggingFile(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDraggingFile(false);
                    if (e.dataTransfer.files?.[0]) {
                      analyzeDossierFile(e.dataTransfer.files[0]);
                    }
                  }}
                  onClick={() => fileInputRef.current?.click()}
                  className={`mt-4 border-2 border-dashed p-6 text-center cursor-pointer transition ${
                    isDraggingFile
                      ? 'border-[#0F4C81] bg-blue-50/50'
                      : 'border-gray-300 hover:border-gray-500 bg-[#FAFAFA]'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    accept=".xml,.pdf,.zip,.dtd"
                    onChange={(e) => {
                      if (e.target.files?.[0]) analyzeDossierFile(e.target.files[0]);
                    }}
                  />
                  <UploadCloud className="w-7 h-7 mx-auto text-gray-500" />
                  <p className="text-xs font-semibold text-gray-900 mt-2">
                    Drag &amp; drop eCTD XML / PDF module here, or click to browse
                  </p>
                  <p className="text-[11px] font-mono text-gray-500 mt-1">
                    Strict ceiling: {MAX_UPLOAD_MB}.00 MB • Client-side SHA-256 + DOM XML Parser
                  </p>
                </div>

                {inspectionReport && (
                  <div
                    className={`mt-4 p-4 border text-xs font-mono space-y-1.5 ${
                      inspectionReport.status === 'PASSED'
                        ? 'bg-emerald-50/60 border-emerald-600 text-gray-900'
                        : 'bg-red-50/70 border-red-600 text-red-950'
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold">
                      <span className="flex items-center gap-1.5">
                        {inspectionReport.status === 'PASSED' ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 text-red-700" />
                        )}
                        VERDICT: {inspectionReport.status}
                      </span>
                      <span className="text-[11px] text-gray-600">
                        {inspectionReport.timestamp}
                      </span>
                    </div>
                    <div>
                      <strong>File:</strong> {inspectionReport.fileName} ({inspectionReport.sizeLabel})
                    </div>
                    <div>
                      <strong>Analysis:</strong> {inspectionReport.reason}
                    </div>
                    <div className="break-all text-[11px] text-gray-700">
                      <strong>SHA-256:</strong> {inspectionReport.sha256}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT 4 COLS: OVERSEAS QA SIGN-OFF LOG & VERCEL AI CO-PILOT */}
            <div className="lg:col-span-4 space-y-6">
              {/* Overseas Stakeholder Sign-Off Ledger */}
              <div className="bg-white border border-gray-300 flex flex-col">
                <div className="p-4 border-b border-gray-300 flex items-center justify-between bg-[#FAFAFA]">
                  <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-gray-900 flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-[#EE0000]" />
                    Overseas QA &amp; Design Sign-Off
                  </h3>
                  <span className="text-[11px] font-mono text-gray-500">
                    {reviews.length} Logs
                  </span>
                </div>

                <div className="p-4 space-y-3 max-h-72 overflow-y-auto divide-y divide-gray-200">
                  {reviews.map((rev) => (
                    <div key={rev.id} className="pt-3 first:pt-0 space-y-1">
                      <div className="flex items-center justify-between text-[11px] font-mono">
                        <span className="font-bold text-gray-900">{rev.author}</span>
                        <span
                          className={`px-1.5 py-0.5 text-[10px] font-bold border ${
                            rev.verdict === 'APPROVED'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-400'
                              : rev.verdict === 'FLAGGED'
                              ? 'bg-red-50 text-red-800 border-red-400'
                              : 'bg-gray-100 text-gray-800 border-gray-300'
                          }`}
                        >
                          {rev.verdict}
                        </span>
                      </div>
                      <div className="text-[10px] font-mono text-gray-500">
                        {rev.role} • {rev.timestamp}
                      </div>
                      <p className="text-xs text-gray-700 leading-relaxed">
                        {rev.note}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Add Review Form */}
                <form
                  onSubmit={handleAddReview}
                  className="p-4 border-t border-gray-300 bg-[#FAFAFA] space-y-2.5"
                >
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={reviewerName}
                      onChange={(e) => setReviewerName(e.target.value)}
                      placeholder="Your Name / Handle"
                      className="bg-white border border-gray-300 px-2.5 py-1.5 text-xs font-mono focus:outline-none focus:border-gray-900"
                    />
                    <select
                      value={reviewVerdict}
                      onChange={(e) => setReviewVerdict(e.target.value)}
                      className="bg-white border border-gray-300 px-2 py-1.5 text-xs font-mono focus:outline-none focus:border-gray-900"
                    >
                      <option value="APPROVED">APPROVED</option>
                      <option value="INFO">TECH NOTE</option>
                      <option value="FLAGGED">FLAG ISSUE</option>
                    </select>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={reviewNote}
                      onChange={(e) => setReviewNote(e.target.value)}
                      placeholder="Log XML DTD or UX check..."
                      className="flex-grow bg-white border border-gray-300 px-2.5 py-1.5 text-xs focus:outline-none focus:border-gray-900"
                    />
                    <button
                      type="submit"
                      className="bg-[#111827] hover:bg-black text-white px-3 py-1.5 text-xs font-mono flex items-center gap-1"
                    >
                      <Send className="w-3 h-3" />
                      Post
                    </button>
                  </div>
                </form>
              </div>

              {/* Regulatory AI Assistant (Routed via Vercel /api/gemini) */}
              <div className="bg-white border border-gray-300 p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                  <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-gray-900 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-[#0F4C81]" />
                    Regulatory &amp; Red Hat AI Advisor
                  </h3>
                  <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 border border-emerald-300 px-1.5 py-0.5">
                    /api/gemini
                  </span>
                </div>
                <p className="text-xs text-gray-600">
                  Query ICH eCTD DTD rules, FDA 21 CFR Part 11 audit requirements, or OpenShift deployment specs.
                </p>

                <form onSubmit={runGeminiConsultation} className="space-y-2.5">
                  <textarea
                    rows={3}
                    value={aiQuery}
                    onChange={(e) => setAiQuery(e.target.value)}
                    placeholder="e.g., What attributes are mandatory on an ICH eCTD v3.2 <leaf> element for Module 3 CMC?"
                    className="w-full bg-[#FAFAFA] border border-gray-300 p-2.5 text-xs font-mono focus:outline-none focus:border-gray-900"
                  />
                  <button
                    type="submit"
                    disabled={aiLoading}
                    className="w-full bg-[#0F4C81] hover:bg-[#0b3960] disabled:opacity-50 text-white py-2 text-xs font-mono font-semibold flex items-center justify-center gap-2 transition"
                  >
                    {aiLoading ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        Querying Vercel Backend...
                      </>
                    ) : (
                      <>
                        <Terminal className="w-3.5 h-3.5" />
                        Run Regulatory Check
                      </>
                    )}
                  </button>
                </form>

                {aiResponse && (
                  <div className="p-3 bg-[#FAFAFA] border border-gray-300 text-xs space-y-2 max-h-60 overflow-y-auto">
                    {aiSourceMode && (
                      <div className="text-[10px] font-mono text-gray-500 border-b border-gray-200 pb-1">
                        {aiSourceMode}
                      </div>
                    )}
                    <div className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                      {aiResponse}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: XML BACKBONE & INTERACTIVE 5-MODULE DRAG-AND-DROP TESTBED */}
        {activeTab === 'xml-sandbox' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left 6 Cols: Interactive Module Drag-and-Drop Sequence Builder */}
            <div className="lg:col-span-6 bg-white border border-gray-300 p-5 space-y-4">
              <div className="border-b border-gray-200 pb-3">
                <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                  <FolderTree className="w-4 h-4 text-[#0F4C81]" />
                  ICH eCTD 5-Module Drag-and-Drop Sequence Testbed
                </h2>
                <p className="text-xs text-gray-600 mt-1">
                  For UX designers &amp; regulatory publishers: drag rows below to test dossier sequence ordering and operator usability.
                </p>
              </div>

              <div className="space-y-2">
                {modules.map((mod, idx) => (
                  <div
                    key={mod.id}
                    draggable
                    onDragStart={() => handleModuleDragStart(idx)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => handleModuleDrop(idx)}
                    className="p-3.5 bg-[#FAFAFA] hover:bg-gray-100 border border-gray-300 flex items-center justify-between gap-3 cursor-move transition"
                  >
                    <div className="flex items-center gap-3">
                      <GripVertical className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <span className="w-9 h-9 bg-white border border-gray-300 flex items-center justify-center font-mono font-bold text-xs text-[#0F4C81]">
                        {mod.code}
                      </span>
                      <div>
                        <div className="text-xs sm:text-sm font-bold text-gray-900">
                          {mod.name}
                        </div>
                        <div className="text-[11px] font-mono text-gray-500">
                          {mod.agency} • {mod.leafs} XML Leaf Nodes
                        </div>
                      </div>
                    </div>
                    <span className="text-[11px] font-mono px-2 py-0.5 bg-white border border-gray-300 text-gray-800 whitespace-nowrap">
                      {mod.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right 6 Cols: Live ICH eCTD index.xml Backbone Inspector */}
            <div className="lg:col-span-6 bg-white border border-gray-300 p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                <div>
                  <h2 className="text-base font-bold text-gray-900">
                    Reference ICH eCTD v3.2 XML Backbone
                  </h2>
                  <p className="text-xs text-gray-600">
                    Standard DTD leaf structure generated by the Replit Engine Room.
                  </p>
                </div>
                <button
                  onClick={runSampleXmlTest}
                  className="text-xs font-mono bg-[#111827] text-white px-3 py-1.5 hover:bg-black transition"
                >
                  Validate This XML
                </button>
              </div>

              <pre className="bg-[#111827] text-gray-100 p-4 text-[11px] font-mono overflow-x-auto leading-relaxed border border-gray-800">
                {SAMPLE_ECTD_XML}
              </pre>
            </div>
          </div>
        )}

        {/* TAB 3: VERCEL DEPLOYMENT & FIRESTORE ARCHITECTURE DIAGNOSTICS */}
        {activeTab === 'vercel-guide' && (
          <div className="bg-white border border-gray-300 p-6 space-y-6">
            <div className="border-b border-gray-200 pb-4">
              <h2 className="text-lg font-bold text-gray-900">
                Vercel &amp; Firestore Deployment Architecture Guide
              </h2>
              <p className="text-xs text-gray-600 mt-1">
                How this Vite + React repository solves Vercel configuration prompts and safeguards your $100/mo Google AI Studio credits.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="p-4 border border-gray-300 bg-[#FAFAFA] space-y-2">
                <div className="text-xs font-mono font-bold text-[#EE0000]">
                  1. WHY VERCEL SHOWED "NO PRODUCTION DEPLOYMENT"
                </div>
                <p className="text-xs text-gray-700 leading-relaxed">
                  Your earlier deployment had a raw <code>index.html</code> + legacy <code>routes</code> in <code>vercel.json</code> without a <code>vite build</code> script. Vercel paused waiting for manual Framework/Output answers. With this Vite + React setup, Vercel auto-detects <strong>Vite</strong> and builds automatically on every <code>git push</code>.
                </p>
              </div>

              <div className="p-4 border border-gray-300 bg-[#FAFAFA] space-y-2">
                <div className="text-xs font-mono font-bold text-[#0F4C81]">
                  2. FIRESTORE VS. VERCEL (NO CONFLICT)
                </div>
                <p className="text-xs text-gray-700 leading-relaxed">
                  Firestore never conflicts with Vercel. Vercel serves static React assets and runs <code>/api/gemini.js</code>, while Firestore connects directly from browsers. Simply use standard <code>VITE_FIREBASE_*</code> environment variables if you add Firestore later.
                </p>
              </div>

              <div className="p-4 border border-gray-300 bg-[#FAFAFA] space-y-2">
                <div className="text-xs font-mono font-bold text-emerald-800">
                  3. HIDDEN API KEY + 50MB GUARD
                </div>
                <p className="text-xs text-gray-700 leading-relaxed">
                  Add <code>GEMINI_API_KEY</code> inside <strong>Vercel &rarr; Project Settings &rarr; Environment Variables</strong>. Both the React drag-and-drop inspector and <code>api/gemini.js</code> reject any file above <strong>50 MB</strong> so your prepaid credits cannot be drained.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* CLINICAL FOOTER */}
      <footer className="bg-white border-t border-gray-300 py-4 px-4 sm:px-8 text-xs font-mono text-gray-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>eCTD SYNC • Pharmaceutical Regulatory &amp; Red Hat Execution Workbench</div>
          <div>Vite + React • Vercel Serverless Key Isolation • &le; 50MB Payload Guard</div>
        </div>
      </footer>
    </div>
  );
}
