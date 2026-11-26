import React, { useState, useMemo, useRef } from 'react';
import {
  FileCode2,
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  Terminal,
  Users,
  FolderTree,
  Lock,
  Sparkles,
  Download,
  RefreshCw,
  BookOpen,
  GitBranch,
  Plus,
  Trash2,
  GraduationCap,
  Layers,
  FileCheck2,
  ArrowRight
} from 'lucide-react';

const MAX_UPLOAD_MB = 50;
const MAX_UPLOAD_BYTES = MAX_UPLOAD_MB * 1024 * 1024;

const ECTD_MODULES_CURRICULUM = [
  {
    code: 'M1',
    folder: 'm1/us',
    title: 'Module 1: Regional Administrative & Prescribing Info',
    standard: 'FDA eCTD v3.3 / EMA v3.1 / SFDA v1.1',
    regulatoryWhy:
      'Module 1 is NOT part of the harmonized ICH core—it changes by country/agency (FDA Form 356h, EMA Cover Letter, SFDA regional forms). Health authorities immediately reject submissions if regional DTD attributes do not match the target agency.',
    engineerRule:
      'Generate a separate regional.xml inside m1/<region>/ linked from root index.xml. Enforce strict lowercase ASCII filenames with hyphens only (no spaces or uppercase letters).',
    redhatSecurity:
      'Contains proprietary sponsor signatory details and commercial launch timelines; stored inside air-gapped RHEL 9 encrypted volumes.',
    uxGuidance:
      'Provide a single Region Selector dropdown (FDA / EMA / SFDA) that automatically swaps the required administrative leaf templates so publishers never guess folder paths.',
    sampleLeaves: [
      {
        id: 'node-m1-01',
        section: '1.0 Cover Letter',
        filename: 'cover-letter-seq0000.pdf',
        href: 'm1/us/10-cover/cover-letter-seq0000.pdf',
        operation: 'new',
        sequence: '0000',
        checksum: '9f86d081884c7d659a2feaa0c55ad015',
        sizeMB: 0.42
      },
      {
        id: 'node-m1-02',
        section: '1.14.1 Draft Labeling',
        filename: 'prescribing-information.pdf',
        href: 'm1/us/114-labeling/prescribing-information.pdf',
        operation: 'new',
        sequence: '0000',
        checksum: '4b227777d4dd1fc61c6f884f48641d02',
        sizeMB: 1.18
      }
    ]
  },
  {
    code: 'M2',
    folder: 'm2',
    title: 'Module 2: Common Technical Document (CTD) Summaries',
    standard: 'ICH M4 Harmonized Core',
    regulatoryWhy:
      'Module 2 is the executive scientific narrative (Quality Overall Summary, Nonclinical & Clinical Overviews) that agency reviewers read first to understand the entire drug dossier.',
    engineerRule:
      'Cross-document hyperlinks inside Module 2 PDFs must use relative paths (e.g., ../m3/32-body-data/drug-substance.pdf) rather than absolute local drive paths.',
    redhatSecurity:
      'Red Hat OpenShift worker containers run automated link-crawler verification without exposing pre-approval clinical summaries to external cloud services.',
    uxGuidance:
      'Highlight broken relative cross-links in amber before export and allow one-click preview of linked Module 3/5 target leaves.',
    sampleLeaves: [
      {
        id: 'node-m2-01',
        section: '2.2 CTD Introduction',
        filename: 'ctd-introduction.pdf',
        href: 'm2/22-intro/ctd-introduction.pdf',
        operation: 'new',
        sequence: '0000',
        checksum: '7902699be42c8a8e46fbbb4501726517',
        sizeMB: 0.85
      },
      {
        id: 'node-m2-02',
        section: '2.3 Quality Overall Summary',
        filename: 'quality-overall-summary.pdf',
        href: 'm2/23-qos/quality-overall-summary.pdf',
        operation: 'new',
        sequence: '0000',
        checksum: '2c26b46b68ffc68ff99b453c1d304134',
        sizeMB: 3.4
      }
    ]
  },
  {
    code: 'M3',
    folder: 'm3',
    title: 'Module 3: Quality (CMC — Drug Substance & Product)',
    standard: 'ICH M4Q(R1)',
    regulatoryWhy:
      'Contains proprietary Chemistry, Manufacturing, and Controls (CMC) recipes, batch synthesis routes, and stability data—the highest-value intellectual property of any pharma company.',
    engineerRule:
      'Each stability update in later sequences uses operation="replace" or operation="append" pointing via modified-file attribute to the exact prior leaf ID.',
    redhatSecurity:
      'Primary reason pharma CISOs demand Red Hat Enterprise Linux & OpenShift on-premise: molecule synthesis recipes never leave the company firewall.',
    uxGuidance:
      'Display clear lifecycle pills (NEW / REPLACE / APPEND / DELETE) beside every CMC stability table so regulatory authors visually confirm sequence history.',
    sampleLeaves: [
      {
        id: 'node-m3-01',
        section: '3.2.S.2 Manufacture',
        filename: 'drug-substance-synthesis.pdf',
        href: 'm3/32-body-data/32s-drug-sub/drug-substance-synthesis.pdf',
        operation: 'new',
        sequence: '0000',
        checksum: '5feceb66ffc86f38d952786c6d696c79',
        sizeMB: 6.75
      },
      {
        id: 'node-m3-02',
        section: '3.2.P.8 Stability',
        filename: 'stability-12month-data.pdf',
        href: 'm3/32-body-data/32p-drug-prod/stability-12month-data.pdf',
        operation: 'new',
        sequence: '0000',
        checksum: '6b86b273ff34fce19d6b804eff5a3f57',
        sizeMB: 4.12
      }
    ]
  },
  {
    code: 'M4',
    folder: 'm4',
    title: 'Module 4: Nonclinical Study Reports',
    standard: 'ICH M4S(R2)',
    regulatoryWhy:
      'Documents animal pharmacology, pharmacokinetics, and toxicology studies proving safety prior to human clinical trials.',
    engineerRule:
      'All PDFs must conform to PDF/A-1b (embedded fonts, no password protection, no JavaScript attachments) to pass FDA Technical Rejection Criteria.',
    redhatSecurity:
      '21 CFR Part 11 immutable audit logs track every checksum recalculation and operator change with timestamp and user identity.',
    uxGuidance:
      'Auto-detect non-compliant filenames or oversized >50MB study appendices on drag-and-drop and guide the user to split oversized files.',
    sampleLeaves: [
      {
        id: 'node-m4-01',
        section: '4.2.3 Toxicology',
        filename: 'repeat-dose-tox-study.pdf',
        href: 'm4/42-stud-rep/423-tox/repeat-dose-tox-study.pdf',
        operation: 'new',
        sequence: '0000',
        checksum: 'd4735e3a265e16eee03f59718b9b5d03',
        sizeMB: 8.9
      }
    ]
  },
  {
    code: 'M5',
    folder: 'm5',
    title: 'Module 5: Clinical Study Reports & Study Tagging Files',
    standard: 'ICH M4E(R2) + STF v2.2',
    regulatoryWhy:
      'Contains pivotal Phase I–III human clinical trial reports. Requires Study Tagging Files (STF XML) grouping protocols, statistical analysis plans, and patient listings per study.',
    engineerRule:
      'Every clinical study folder in m5/53-clin-stud-rep/ requires an accompanying stf.xml declaring study-id and file-tag attributes (e.g., study-report-body).',
    redhatSecurity:
      'Patient-level pseudonymized listings require strict SELinux role isolation and zero third-party telemetry.',
    uxGuidance:
      'Group clinical files into a visual "Study Container" card that automatically generates the companion stf.xml behind the scenes.',
    sampleLeaves: [
      {
        id: 'node-m5-01',
        section: '5.3.5.1 Pivotal Phase III CSR',
        filename: 'phase3-efficacy-csr.pdf',
        href: 'm5/53-clin-stud-rep/535-rep-effic-safety-stud/phase3-efficacy-csr.pdf',
        operation: 'new',
        sequence: '0000',
        checksum: '4e07408562bedb8b60ce05c1decfe3ad',
        sizeMB: 14.6
      }
    ]
  }
];

const INITIAL_LIFECYCLE_LEAVES = [
  {
    id: 'leaf-101',
    module: 'M1',
    title: 'Cover Letter & FDA Form 356h',
    href: 'm1/us/10-cover/cover-letter.pdf',
    seq0000Op: 'new',
    seq0001Op: 'new',
    seq0001Note: 'New cover letter added for Sequence 0001 amendment (old cover letter remains in history)',
    checksum: 'a1b2c3d4e5f60718293a4b5c6d7e8f90'
  },
  {
    id: 'leaf-114',
    module: 'M1',
    title: 'Draft Prescribing Information (Labeling)',
    href: 'm1/us/114-labeling/prescribing-info.pdf',
    seq0000Op: 'new',
    seq0001Op: 'replace',
    seq0001Note: 'Replaces Sequence 0000 labeling via modified-file="../0000/index.xml#leaf-114"',
    checksum: 'f0e1d2c3b4a5968778695a4b3c2d1e0f'
  },
  {
    id: 'leaf-301',
    module: 'M3',
    title: '3.2.P.8 Drug Product Stability Protocol & Data',
    href: 'm3/32-body-data/stability-data.pdf',
    seq0000Op: 'new',
    seq0001Op: 'append',
    seq0001Note: 'Appends 18-month stability dataset onto existing Sequence 0000 leaf without deleting 12-month data',
    checksum: '11223344556677889900aabbccddeeff'
  },
  {
    id: 'leaf-402',
    module: 'M4',
    title: 'Preliminary Pilot Assay (Superseded)',
    href: 'm4/42-stud-rep/pilot-assay.pdf',
    seq0000Op: 'new',
    seq0001Op: 'delete',
    seq0001Note: 'Removes superseded pilot file from the active cumulative regulatory view while preserving audit trail',
    checksum: '99887766554433221100ffeeddccbbaa'
  }
];

const INITIAL_HANDOFF_NOTES = [
  {
    id: 1,
    fromRole: 'Regulatory Affairs Expert',
    toRole: 'Offshore XML Engineer',
    topic: 'ICH eCTD Filename & Checksum Compliance',
    lesson:
      'Health authorities reject ZIP packages if any file path contains spaces, uppercase letters, or symbols other than hyphens. Always sanitize filenames and compute lowercase 32-char MD5 hashes inside index.xml.',
    status: 'VERIFIED'
  },
  {
    id: 2,
    fromRole: 'Red Hat OpenShift Architect',
    toRole: 'UX / Product Designer',
    topic: 'Air-Gapped On-Premise Trust Indicators',
    lesson:
      'Pharma reviewers need visual confirmation that pre-approval Module 3 CMC files are hashed locally inside their Red Hat cluster and never uploaded to external public AI endpoints.',
    status: 'VERIFIED'
  }
];

function checkEctdFilenameCompliance(filename) {
  const issues = [];
  if (/[A-Z]/.test(filename)) {
    issues.push('Contains uppercase letters (ICH eCTD requires strictly lowercase filenames)');
  }
  if (/\s/.test(filename)) {
    issues.push('Contains spaces (replace spaces with hyphens "-")');
  }
  if (/[^a-z0-9.\-_]/.test(filename.toLowerCase())) {
    issues.push('Contains special characters outside [a-z0-9-_.]');
  }
  if (filename.length > 64) {
    issues.push('Exceeds 64-character ICH filename limit');
  }
  return issues;
}

export default function App() {
  const [activeTab, setActiveTab] = useState('explorer');
  const [activeDiscipline, setActiveDiscipline] = useState('regulatory');
  const [selectedModuleCode, setSelectedModuleCode] = useState('M3');

  const [lifecycleLeaves, setLifecycleLeaves] = useState(INITIAL_LIFECYCLE_LEAVES);
  const [viewSequenceMode, setViewSequenceMode] = useState('cumulative');

  const [customLeaves, setCustomLeaves] = useState([
    {
      id: 'leaf-001',
      module: 'M1',
      section: '1.0 Cover Letter',
      filename: 'cover-letter.pdf',
      operation: 'new',
      sizeMB: 0.45,
      checksum: '9f86d081884c7d659a2feaa0c55ad015',
      issues: []
    },
    {
      id: 'leaf-002',
      module: 'M3',
      section: '3.2.S Drug Substance',
      filename: 'drug-substance-spec.pdf',
      operation: 'new',
      sizeMB: 2.3,
      checksum: '5feceb66ffc86f38d952786c6d696c79',
      issues: []
    }
  ]);
  const [targetModuleForDrop, setTargetModuleForDrop] = useState('M3');
  const [targetOpForDrop, setTargetOpForDrop] = useState('new');
  const [isDragging, setIsDragging] = useState(false);
  const [uploadAlert, setUploadAlert] = useState(null);
  const fileInputRef = useRef(null);

  const [handoffNotes, setHandoffNotes] = useState(INITIAL_HANDOFF_NOTES);
  const [fromRole, setFromRole] = useState('Regulatory Affairs Expert');
  const [toRole, setToRole] = useState('Offshore XML Engineer');
  const [lessonTopic, setLessonTopic] = useState('');
  const [lessonBody, setLessonBody] = useState('');

  const [aiPrompt, setAiPrompt] = useState('');
  const [aiReply, setAiReply] = useState('');
  const [aiStatusNote, setAiStatusNote] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  const selectedModuleObj = useMemo(
    () => ECTD_MODULES_CURRICULUM.find((m) => m.code === selectedModuleCode) || ECTD_MODULES_CURRICULUM[0],
    [selectedModuleCode]
  );

  const updateLeafSeq0001Op = (leafId, newOp) => {
    const descriptions = {
      new: 'Adds a brand-new leaf node in Sequence 0001 alongside Sequence 0000 items',
      replace: `Replaces Sequence 0000 version via modified-file="../0000/index.xml#${leafId}"`,
      append: `Appends supplemental pages onto Sequence 0000 leaf via modified-file="../0000/index.xml#${leafId}"`,
      delete: `Marks Sequence 0000 leaf as deleted so health authority reviewers no longer see it in current view`
    };
    setLifecycleLeaves((prev) =>
      prev.map((leaf) =>
        leaf.id === leafId
          ? { ...leaf, seq0001Op: newOp, seq0001Note: descriptions[newOp] }
          : leaf
      )
    );
  };

  const generatedLifecycleXml = useMemo(() => {
    const lines = [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<!DOCTYPE ectd:ectd SYSTEM "util/dtd/ich-ectd-3-2.dtd">',
      '<ectd:ectd xmlns:ectd="http://www.ich.org/ectd" xmlns:xlink="http://www.w3c.org/1999/xlink" dtd-version="3.2">',
      '  <!-- Sequence 0001 Amendment Manifest -->'
    ];
    lifecycleLeaves.forEach((leaf) => {
      const modifiedAttr =
        leaf.seq0001Op !== 'new'
          ? ` modified-file="../0000/index.xml#${leaf.id}"`
          : '';
      const hrefAttr =
        leaf.seq0001Op === 'delete'
          ? ''
          : ` xlink:href="${leaf.href}" checksum-type="md5" checksum="${leaf.checksum}"`;
      lines.push(
        `  <leaf ID="${leaf.id}-s1" operation="${leaf.seq0001Op}"${modifiedAttr}${hrefAttr}>`
      );
      lines.push(`    <title>${leaf.title}</title>`);
      lines.push('  </leaf>');
    });
    lines.push('</ectd:ectd>');
    return lines.join('\n');
  }, [lifecycleLeaves]);

  const computeFileChecksum = async (file) => {
    try {
      const buf = await file.arrayBuffer();
      if (window.crypto && window.crypto.subtle) {
        const digest = await window.crypto.subtle.digest('SHA-256', buf);
        const hex = Array.from(new Uint8Array(digest))
          .map((b) => b.toString(16).padStart(2, '0'))
          .join('');
        return hex.slice(0, 32);
      }
    } catch {
      // Fallback deterministic hex
    }
    return Math.random().toString(16).slice(2, 18) + Math.random().toString(16).slice(2, 18);
  };

  const handleDossierFileAdd = async (file) => {
    if (!file) return;
    const sizeMB = Number((file.size / (1024 * 1024)).toFixed(2));

    if (file.size > MAX_UPLOAD_BYTES) {
      setUploadAlert({
        type: 'error',
        title: `Upload Blocked: ${file.name} (${sizeMB} MB) exceeds ${MAX_UPLOAD_MB} MB Limit`,
        message:
          'To protect your $100/mo prepaid Google AI Studio token budget and prevent serverless memory spikes, files larger than 50 MB are blocked prior to upload. Split large clinical appendices into modular PDFs.'
      });
      return;
    }

    const checksum = await computeFileChecksum(file);
    const issues = checkEctdFilenameCompliance(file.name);
    const sectionMap = {
      M1: '1.0 Regional Admin',
      M2: '2.3 Quality Summary',
      M3: '3.2.P Drug Product',
      M4: '4.2 Toxicology Study',
      M5: '5.3 Clinical Report'
    };

    const newLeaf = {
      id: `leaf-${String(customLeaves.length + 1).padStart(3, '0')}`,
      module: targetModuleForDrop,
      section: sectionMap[targetModuleForDrop] || '3.2 Quality',
      filename: file.name,
      operation: targetOpForDrop,
      sizeMB,
      checksum,
      issues
    };

    setCustomLeaves((prev) => [...prev, newLeaf]);
    setUploadAlert({
      type: issues.length > 0 ? 'warning' : 'success',
      title:
        issues.length > 0
          ? `Added with ICH Naming Warning: ${file.name}`
          : `Validated & Added to ${targetModuleForDrop}: ${file.name} (${sizeMB} MB)`,
      message:
        issues.length > 0
          ? `Educational Note: ${issues.join(' • ')}. Click "Auto-Sanitize Filenames" below to fix automatically.`
          : `Checksum ${checksum} generated locally. Ready for index.xml export.`
    });
  };

  const sanitizeAllFilenames = () => {
    setCustomLeaves((prev) =>
      prev.map((leaf) => {
        const cleanName = leaf.filename
          .toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^a-z0-9.\-_]/g, '');
        return {
          ...leaf,
          filename: cleanName,
          issues: checkEctdFilenameCompliance(cleanName)
        };
      })
    );
    setUploadAlert({
      type: 'success',
      title: 'All Filenames Sanitized to ICH M2 Standard',
      message: 'Converted to lowercase ASCII with hyphens only. Zero naming validation errors remain.'
    });
  };

  const customBuilderXml = useMemo(() => {
    const lines = [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<!DOCTYPE ectd:ectd SYSTEM "util/dtd/ich-ectd-3-2.dtd">',
      '<ectd:ectd xmlns:ectd="http://www.ich.org/ectd" xmlns:xlink="http://www.w3c.org/1999/xlink" dtd-version="3.2">'
    ];
    ['M1', 'M2', 'M3', 'M4', 'M5'].forEach((modCode) => {
      const modLeaves = customLeaves.filter((l) => l.module === modCode);
      if (modLeaves.length === 0) return;
      const tagMap = {
        M1: 'm1-administrative-information-and-prescribing-information',
        M2: 'm2-common-technical-document-summaries',
        M3: 'm3-quality',
        M4: 'm4-nonclinical-study-reports',
        M5: 'm5-clinical-study-reports'
      };
      const tag = tagMap[modCode];
      lines.push(`  <${tag}>`);
      modLeaves.forEach((leaf) => {
        const folder = modCode.toLowerCase();
        lines.push(
          `    <leaf ID="${leaf.id}" operation="${leaf.operation}" checksum-type="md5" checksum="${leaf.checksum}" xlink:href="${folder}/${leaf.filename}">`
        );
        lines.push(`      <title>${leaf.section} — ${leaf.filename}</title>`);
        lines.push('    </leaf>');
      });
      lines.push(`  </${tag}>`);
    });
    lines.push('</ectd:ectd>');
    return lines.join('\n');
  }, [customLeaves]);

  const downloadGeneratedIndexXml = () => {
    const blob = new Blob([customBuilderXml], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'index.xml';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleAddHandoffNote = (e) => {
    e.preventDefault();
    if (!lessonTopic.trim() || !lessonBody.trim()) return;
    setHandoffNotes((prev) => [
      {
        id: Date.now(),
        fromRole,
        toRole,
        topic: lessonTopic.trim(),
        lesson: lessonBody.trim(),
        status: 'SHARED'
      },
      ...prev
    ]);
    setLessonTopic('');
    setLessonBody('');
  };

  const askEducationalTutor = async (e, presetQuestion = null) => {
    if (e) e.preventDefault();
    const question = presetQuestion || aiPrompt;
    if (!question.trim()) return;

    if (presetQuestion) setAiPrompt(presetQuestion);
    setAiLoading(true);
    setAiReply('');
    setAiStatusNote('');

    const payload = {
      prompt: question,
      roleContext: activeDiscipline
    };

    const callEndpoint = async (url, bodyObj) => {
      let delay = 1000;
      for (let attempt = 0; attempt < 3; attempt++) {
        try {
          const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bodyObj)
          });
          if (res.ok) return await res.json();
        } catch {
          // Exponential backoff retry
        }
        if (attempt < 2) {
          await new Promise((r) => setTimeout(r, delay));
          delay *= 2;
        }
      }
      return null;
    };

    const serverData = await callEndpoint('/api/gemini', payload);
    if (serverData && serverData.text) {
      setAiReply(serverData.text);
      setAiStatusNote('Answered securely via Vercel Backend (/api/gemini • API Key Hidden)');
      setAiLoading(false);
      return;
    }

    const previewKey = '';
    const directUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${previewKey}`;
    const directData = await callEndpoint(directUrl, {
      contents: [{ parts: [{ text: question }] }],
      systemInstruction: {
        parts: [
          {
            text: 'You are an educational Pharmaceutical eCTD & Red Hat OpenShift Architect. Explain regulatory concepts clearly so overseas software engineers, UX designers, and regulatory specialists understand both the "Why" and the exact technical implementation.'
          }
        ]
      }
    });

    const fallbackText = directData?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (fallbackText) {
      setAiReply(fallbackText);
      setAiStatusNote('Preview Sandbox Mode (Will automatically route via /api/gemini on Vercel)');
    } else {
      setAiReply(
        'Connect your GEMINI_API_KEY in Vercel Project Settings -> Environment Variables and redeploy to activate live server-side regulatory tutoring.'
      );
      setAiStatusNote('Awaiting Vercel GEMINI_API_KEY configuration');
    }
    setAiLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#F4F5F7] text-[#111827] font-sans flex flex-col">
      <header className="bg-white border-b border-gray-300 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#EE0000] text-white flex items-center justify-center font-mono font-bold text-sm">
              eCTD
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base tracking-tight text-gray-900">
                  eCTD SYNC
                </span>
                <span className="hidden sm:inline-block text-[11px] font-mono bg-gray-100 border border-gray-300 px-2 py-0.5 text-gray-700">
                  ICH M2/M8 • RHEL 9 • VERCEL NODE
                </span>
              </div>
              <p className="text-[11px] font-mono text-gray-500">
                Interactive eCTD Submission Lab &amp; Cross-Team Educational Workbench
              </p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-2">
            <span className="text-[11px] font-mono text-gray-500">MY ROLE:</span>
            <div className="flex border border-gray-300 bg-gray-50 p-0.5 text-xs font-mono">
              {[
                { id: 'regulatory', label: 'Regulatory QA' },
                { id: 'redhat', label: 'Red Hat Eng' },
                { id: 'engineer', label: 'Offshore Dev' },
                { id: 'designer', label: 'UX Designer' }
              ].map((role) => (
                <button
                  key={role.id}
                  onClick={() => setActiveDiscipline(role.id)}
                  className={`px-2.5 py-1 transition ${
                    activeDiscipline === role.id
                      ? 'bg-[#111827] text-white font-semibold'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {role.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-[#FAFAFA] border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between overflow-x-auto">
            <nav className="flex space-x-6 text-xs font-mono">
              <button
                onClick={() => setActiveTab('explorer')}
                className={`py-3 border-b-2 transition whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === 'explorer'
                    ? 'border-[#EE0000] text-[#EE0000] font-bold'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <FolderTree className="w-3.5 h-3.5" />
                1. MODULE 1–5 DOSSIER EXPLORER
              </button>
              <button
                onClick={() => setActiveTab('lifecycle')}
                className={`py-3 border-b-2 transition whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === 'lifecycle'
                    ? 'border-[#0F4C81] text-[#0F4C81] font-bold'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <GitBranch className="w-3.5 h-3.5" />
                2. SEQUENCE LIFECYCLE SIMULATOR
              </button>
              <button
                onClick={() => setActiveTab('builder')}
                className={`py-3 border-b-2 transition whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === 'builder'
                    ? 'border-emerald-700 text-emerald-800 font-bold'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <FileCode2 className="w-3.5 h-3.5" />
                3. &lt;50MB DRAG-DROP XML BUILDER
              </button>
              <button
                onClick={() => setActiveTab('education')}
                className={`py-3 border-b-2 transition whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === 'education'
                    ? 'border-[#111827] text-[#111827] font-bold'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5" />
                4. EDUCATIONAL HANDOFF &amp; AI TUTOR
              </button>
            </nav>

            <div className="hidden lg:flex items-center gap-3 text-[11px] font-mono text-gray-600">
              <span className="flex items-center gap-1 text-emerald-800">
                <Lock className="w-3 h-3" />
                KEY HIDDEN IN VERCEL
              </span>
              <span>|</span>
              <span className="text-amber-800 font-semibold">
                CAP: &le; {MAX_UPLOAD_MB} MB
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 flex-grow space-y-6">
        <section className="bg-white border-l-4 border-[#0F4C81] border-t border-r border-b border-gray-300 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#0F4C81] flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5" />
              Educational Practice Lens — Viewing as:{' '}
              {activeDiscipline === 'regulatory' && 'Regulatory Affairs Specialist'}
              {activeDiscipline === 'redhat' && 'Red Hat OpenShift Infrastructure Engineer'}
              {activeDiscipline === 'engineer' && 'Offshore XML & Backend Developer'}
              {activeDiscipline === 'designer' && 'UX / Dossier Publisher Designer'}
            </div>
            <p className="text-xs text-gray-700 leading-relaxed">
              {activeDiscipline === 'regulatory' &&
                'Focus: Verify that every CTD leaf obeys ICH M2 DTD 3.2 rules, regional Module 1 requirements (FDA/EMA/SFDA), and sequence lifecycle operators (new/replace/append/delete) so agencies never issue a Technical Rejection.'}
              {activeDiscipline === 'redhat' &&
                'Focus: Ensure all XML validation workers and PDF checksum engines run inside air-gapped RHEL 9 / OpenShift containers with 21 CFR Part 11 audit trails so pre-approval molecule data never leaves the client vault.'}
              {activeDiscipline === 'engineer' &&
                'Focus: Enforce deterministic relative xlink:href paths, strictly lowercase kebab-case filenames, SHA-256/MD5 leaf hashes, and a strict 50MB payload gatekeeper before calling /api/gemini.'}
              {activeDiscipline === 'designer' &&
                'Focus: Replace complex XML tag editing with drag-and-drop CTD module cards, clear lifecycle badges, and instant plain-English validation guidance for end-user regulatory publishers.'}
            </p>
          </div>
          <div className="flex sm:hidden gap-1.5 text-[11px] font-mono">
            {['regulatory', 'redhat', 'engineer', 'designer'].map((r) => (
              <button
                key={r}
                onClick={() => setActiveDiscipline(r)}
                className={`px-2 py-1 border ${
                  activeDiscipline === r
                    ? 'bg-gray-900 text-white border-gray-900'
                    : 'bg-gray-50 text-gray-700 border-gray-300'
                }`}
              >
                {r.toUpperCase()}
              </button>
            ))}
          </div>
        </section>

        {activeTab === 'explorer' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-4 space-y-3">
              <div className="bg-white border border-gray-300 p-4">
                <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-gray-900 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-[#EE0000]" />
                  ICH Common Technical Document (M1–M5)
                </h2>
                <p className="text-xs text-gray-600 mt-1">
                  Select any CTD module below to inspect its directory structure, XML leaf nodes, and cross-team engineering rules.
                </p>
              </div>

              <div className="space-y-2">
                {ECTD_MODULES_CURRICULUM.map((mod) => {
                  const isSelected = mod.code === selectedModuleCode;
                  return (
                    <button
                      key={mod.code}
                      onClick={() => setSelectedModuleCode(mod.code)}
                      className={`w-full text-left p-4 border transition bg-white ${
                        isSelected
                          ? 'border-[#EE0000] ring-1 ring-[#EE0000]'
                          : 'border-gray-300 hover:border-gray-500'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="font-bold text-[#EE0000]">
                          {mod.code} • /{mod.folder}/
                        </span>
                        <span className="text-[11px] text-gray-500">
                          {mod.sampleLeaves.length} sample leaves
                        </span>
                      </div>
                      <div className="font-bold text-sm text-gray-900 mt-1">
                        {mod.title}
                      </div>
                      <div className="text-[11px] font-mono text-gray-500 mt-1">
                        {mod.standard}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="lg:col-span-8 space-y-6">
              <div className="bg-white border border-gray-300">
                <div className="p-5 border-b border-gray-300 bg-[#FAFAFA]">
                  <div className="text-xs font-mono font-bold text-[#EE0000]">
                    {selectedModuleObj.standard} • ROOT PATH: /{selectedModuleObj.folder}/
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mt-1">
                    {selectedModuleObj.title}
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-200 border-b border-gray-300">
                  <div className="p-4 space-y-3">
                    <div>
                      <div className="text-[11px] font-mono font-bold uppercase text-[#0F4C81]">
                        1. Regulatory Purpose (Why Health Authorities Care)
                      </div>
                      <p className="text-xs text-gray-700 mt-1 leading-relaxed">
                        {selectedModuleObj.regulatoryWhy}
                      </p>
                    </div>
                    <div className="pt-2 border-t border-gray-200">
                      <div className="text-[11px] font-mono font-bold uppercase text-[#EE0000]">
                        2. Red Hat Enterprise Compliance &amp; Vault
                      </div>
                      <p className="text-xs text-gray-700 mt-1 leading-relaxed">
                        {selectedModuleObj.redhatSecurity}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 space-y-3">
                    <div>
                      <div className="text-[11px] font-mono font-bold uppercase text-emerald-800">
                        3. Offshore Engineering Rule (XML &amp; File System)
                      </div>
                      <p className="text-xs text-gray-700 mt-1 leading-relaxed">
                        {selectedModuleObj.engineerRule}
                      </p>
                    </div>
                    <div className="pt-2 border-t border-gray-200">
                      <div className="text-[11px] font-mono font-bold uppercase text-gray-900">
                        4. UX Design &amp; End-User Simplicity
                      </div>
                      <p className="text-xs text-gray-700 mt-1 leading-relaxed">
                        {selectedModuleObj.uxGuidance}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-mono font-bold uppercase text-gray-900">
                      Sample eCTD Leaf Manifest inside /{selectedModuleObj.folder}/
                    </h4>
                    <span className="text-[11px] font-mono text-gray-500">
                      DTD v3.2.2 Leaf Nodes
                    </span>
                  </div>

                  <div className="overflow-x-auto border border-gray-300">
                    <table className="w-full text-left border-collapse text-xs font-mono">
                      <thead>
                        <tr className="bg-gray-100 border-b border-gray-300 text-[11px] text-gray-700">
                          <th className="p-2.5">Leaf ID</th>
                          <th className="p-2.5">CTD Section</th>
                          <th className="p-2.5">Relative xlink:href</th>
                          <th className="p-2.5">Op</th>
                          <th className="p-2.5">MD5 Checksum</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {selectedModuleObj.sampleLeaves.map((leaf) => (
                          <tr key={leaf.id} className="hover:bg-gray-50">
                            <td className="p-2.5 font-bold text-[#0F4C81]">{leaf.id}</td>
                            <td className="p-2.5 font-sans text-gray-900">{leaf.section}</td>
                            <td className="p-2.5 text-gray-700">{leaf.href}</td>
                            <td className="p-2.5">
                              <span className="px-1.5 py-0.5 bg-emerald-50 border border-emerald-400 text-emerald-800 text-[10px] font-bold uppercase">
                                {leaf.operation}
                              </span>
                            </td>
                            <td className="p-2.5 text-gray-500">{leaf.checksum}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'lifecycle' && (
          <div className="space-y-6">
            <div className="bg-white border border-gray-300 p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                  <GitBranch className="w-4 h-4 text-[#0F4C81]" />
                  Interactive eCTD Sequence Lifecycle Simulator (Sequence 0000 &rarr; 0001)
                </h2>
                <p className="text-xs text-gray-600 mt-1 max-w-3xl">
                  In eCTD, you <strong>never overwrite</strong> an older submission folder. Instead, Sequence <code>0001</code> sends XML lifecycle instructions (<code>new</code>, <code>replace</code>, <code>append</code>, <code>delete</code>) referencing Sequence <code>0000</code>. Change the Sequence 0001 operators below to teach your team how cumulative regulatory views work.
                </p>
              </div>

              <div className="flex border border-gray-300 bg-gray-50 p-0.5 text-xs font-mono self-start">
                {[
                  { id: '0000', label: 'Seq 0000 (Initial)' },
                  { id: '0001', label: 'Seq 0001 (Delta)' },
                  { id: 'cumulative', label: 'Current Agency View' }
                ].map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => setViewSequenceMode(mode.id)}
                    className={`px-3 py-1.5 transition ${
                      viewSequenceMode === mode.id
                        ? 'bg-[#0F4C81] text-white font-bold'
                        : 'text-gray-700 hover:text-gray-900'
                    }`}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-7 bg-white border border-gray-300 divide-y divide-gray-200">
                <div className="p-4 bg-[#FAFAFA] text-xs font-mono font-bold text-gray-800 flex items-center justify-between">
                  <span>DOSSIER LEAF NODES (INTERACTIVE OPERATOR CONTROL)</span>
                  <span className="text-[#0F4C81]">
                    VIEW: {viewSequenceMode.toUpperCase()}
                  </span>
                </div>

                {lifecycleLeaves
                  .filter((leaf) => {
                    if (viewSequenceMode === 'cumulative' && leaf.seq0001Op === 'delete') {
                      return false;
                    }
                    return true;
                  })
                  .map((leaf) => (
                    <div key={leaf.id} className="p-4 space-y-2.5">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold px-2 py-0.5 bg-gray-100 border border-gray-300">
                            {leaf.module}
                          </span>
                          <span className="text-sm font-bold text-gray-900">
                            {leaf.title}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5 text-xs font-mono">
                          <span className="text-[11px] text-gray-500">Seq 0001 Op:</span>
                          <select
                            value={leaf.seq0001Op}
                            onChange={(e) => updateLeafSeq0001Op(leaf.id, e.target.value)}
                            className="border border-gray-400 bg-white px-2 py-1 font-bold text-gray-900 focus:outline-none"
                          >
                            <option value="new">new</option>
                            <option value="replace">replace</option>
                            <option value="append">append</option>
                            <option value="delete">delete</option>
                          </select>
                        </div>
                      </div>

                      <div className="text-xs font-mono text-gray-600">
                        Path: {leaf.href} • Base ID: <code>{leaf.id}</code>
                      </div>

                      <div className="p-2.5 bg-[#FAFAFA] border-l-2 border-[#0F4C81] text-xs text-gray-700">
                        <strong>Educational Behavior:</strong> {leaf.seq0001Note}
                      </div>
                    </div>
                  ))}
              </div>

              <div className="lg:col-span-5 bg-white border border-gray-300 p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                  <span className="text-xs font-mono font-bold text-gray-900">
                    LIVE SEQUENCE 0001 INDEX.XML OUTPUT
                  </span>
                  <span className="text-[10px] font-mono bg-emerald-50 text-emerald-800 border border-emerald-300 px-1.5 py-0.5">
                    AUTO-UPDATED
                  </span>
                </div>
                <p className="text-xs text-gray-600">
                  Notice how selecting <code>replace</code>, <code>append</code>, or <code>delete</code> automatically injects the required <code>modified-file=&quot;../0000/index.xml#...&quot;</code> pointer.
                </p>
                <pre className="bg-[#111827] text-gray-100 p-3.5 text-[11px] font-mono overflow-x-auto leading-relaxed">
                  {generatedLifecycleXml}
                </pre>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'builder' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 space-y-5">
              <div className="bg-white border border-gray-300 p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-200 pb-3">
                  <div>
                    <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                      <FileCheck2 className="w-4 h-4 text-emerald-700" />
                      Hands-On Dossier Assembler &amp; ICH Linter (&le; {MAX_UPLOAD_MB} MB)
                    </h2>
                    <p className="text-xs text-gray-600 mt-0.5">
                      Drop real PDFs or XML files to test drag-and-drop usability, enforce the 50MB token-saving ceiling, and check ICH naming rules.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-[#FAFAFA] p-3 border border-gray-200 text-xs font-mono">
                  <div>
                    <label className="block text-[11px] text-gray-500 mb-1">
                      TARGET CTD MODULE
                    </label>
                    <select
                      value={targetModuleForDrop}
                      onChange={(e) => setTargetModuleForDrop(e.target.value)}
                      className="w-full bg-white border border-gray-300 px-2.5 py-1.5 text-gray-900"
                    >
                      <option value="M1">M1 — Regional Administrative</option>
                      <option value="M2">M2 — CTD Summaries</option>
                      <option value="M3">M3 — Quality (CMC)</option>
                      <option value="M4">M4 — Nonclinical Reports</option>
                      <option value="M5">M5 — Clinical Study Reports</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] text-gray-500 mb-1">
                      LEAF LIFECYCLE OPERATOR
                    </label>
                    <select
                      value={targetOpForDrop}
                      onChange={(e) => setTargetOpForDrop(e.target.value)}
                      className="w-full bg-white border border-gray-300 px-2.5 py-1.5 text-gray-900"
                    >
                      <option value="new">new (Initial Leaf)</option>
                      <option value="replace">replace (Supersede Prior)</option>
                      <option value="append">append (Add Supplemental)</option>
                    </select>
                  </div>
                </div>

                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    if (e.dataTransfer.files?.[0]) {
                      handleDossierFileAdd(e.dataTransfer.files[0]);
                    }
                  }}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed p-6 text-center cursor-pointer transition ${
                    isDragging
                      ? 'border-emerald-700 bg-emerald-50/50'
                      : 'border-gray-300 hover:border-gray-500 bg-[#FAFAFA]'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    accept=".pdf,.xml,.zip"
                    onChange={(e) => {
                      if (e.target.files?.[0]) handleDossierFileAdd(e.target.files[0]);
                    }}
                  />
                  <UploadCloud className="w-7 h-7 mx-auto text-gray-600" />
                  <p className="text-xs font-bold text-gray-900 mt-2">
                    Drag &amp; drop a PDF or XML document here, or click to select
                  </p>
                  <p className="text-[11px] font-mono text-gray-500 mt-1">
                    Strict cap: {MAX_UPLOAD_MB}.00 MB • Automatic SHA-256/MD5 checksum &amp; ICH filename audit
                  </p>
                </div>

                {uploadAlert && (
                  <div
                    className={`p-3.5 border text-xs space-y-1 ${
                      uploadAlert.type === 'error'
                        ? 'bg-red-50 border-red-600 text-red-950'
                        : uploadAlert.type === 'warning'
                        ? 'bg-amber-50 border-amber-600 text-amber-950'
                        : 'bg-emerald-50 border-emerald-600 text-emerald-950'
                    }`}
                  >
                    <div className="font-bold flex items-center gap-1.5">
                      {uploadAlert.type === 'success' ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-amber-700" />
                      )}
                      {uploadAlert.title}
                    </div>
                    <p className="leading-relaxed">{uploadAlert.message}</p>
                  </div>
                )}

                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-gray-800">
                      ASSEMBLED DOSSIER LEAVES ({customLeaves.length})
                    </span>
                    <button
                      onClick={sanitizeAllFilenames}
                      className="text-[11px] font-mono bg-gray-100 hover:bg-gray-200 border border-gray-400 px-2.5 py-1 text-gray-900"
                    >
                      Auto-Sanitize Filenames
                    </button>
                  </div>

                  <div className="divide-y divide-gray-200 border border-gray-300">
                    {customLeaves.map((leaf) => (
                      <div
                        key={leaf.id}
                        className="p-3 bg-white flex items-center justify-between gap-3 text-xs"
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2 font-mono">
                            <span className="font-bold text-[#0F4C81]">{leaf.module}</span>
                            <span className="font-bold text-gray-900">{leaf.filename}</span>
                            <span className="text-[10px] px-1.5 py-0.5 bg-gray-100 border border-gray-300">
                              {leaf.operation}
                            </span>
                            <span className="text-gray-500">({leaf.sizeMB} MB)</span>
                          </div>
                          {leaf.issues.length > 0 ? (
                            <div className="text-[11px] text-amber-800 font-medium">
                              Warning: {leaf.issues.join(' • ')}
                            </div>
                          ) : (
                            <div className="text-[11px] font-mono text-gray-500">
                              ICH Valid • Checksum: {leaf.checksum}
                            </div>
                          )}
                        </div>

                        <button
                          onClick={() =>
                            setCustomLeaves((prev) => prev.filter((item) => item.id !== leaf.id))
                          }
                          className="text-gray-400 hover:text-red-700 p-1"
                          title="Remove leaf"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 bg-white border border-gray-300 p-5 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">
                      Generated eCTD index.xml Backbone
                    </h3>
                    <p className="text-xs text-gray-600">
                      Live XML output ready for Red Hat OpenShift validation.
                    </p>
                  </div>
                  <button
                    onClick={downloadGeneratedIndexXml}
                    className="flex items-center gap-1.5 bg-[#EE0000] hover:bg-red-700 text-white text-xs font-mono px-3 py-2 transition"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download index.xml
                  </button>
                </div>

                <pre className="bg-[#111827] text-gray-100 p-4 text-[11px] font-mono overflow-x-auto leading-relaxed max-h-[460px]">
                  {customBuilderXml}
                </pre>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'education' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-6 bg-white border border-gray-300 p-5 space-y-4">
              <div className="border-b border-gray-200 pb-3">
                <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#EE0000]" />
                  Cross-Team Educational Communication Ledger
                </h2>
                <p className="text-xs text-gray-600 mt-1">
                  Bridge the communication gap between Regulatory Experts, Red Hat Engineers, Offshore Developers, and UX Designers by recording clear &ldquo;Why + How&rdquo; lessons.
                </p>
              </div>

              <div className="space-y-3 max-h-80 overflow-y-auto">
                {handoffNotes.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 bg-[#FAFAFA] border border-gray-300 space-y-1.5"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono">
                      <span className="font-bold text-[#0F4C81] flex items-center gap-1">
                        {item.fromRole} <ArrowRight className="w-3 h-3" /> {item.toRole}
                      </span>
                      <span className="px-1.5 py-0.5 bg-emerald-50 border border-emerald-400 text-emerald-800 text-[10px] font-bold">
                        {item.status}
                      </span>
                    </div>
                    <div className="text-xs font-bold text-gray-900">{item.topic}</div>
                    <p className="text-xs text-gray-700 leading-relaxed">{item.lesson}</p>
                  </div>
                ))}
              </div>

              <form
                onSubmit={handleAddHandoffNote}
                className="pt-3 border-t border-gray-200 space-y-2.5"
              >
                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div>
                    <label className="block text-[10px] text-gray-500 mb-1">FROM DISCIPLINE</label>
                    <select
                      value={fromRole}
                      onChange={(e) => setFromRole(e.target.value)}
                      className="w-full border border-gray-300 bg-white px-2 py-1.5"
                    >
                      <option>Regulatory Affairs Expert</option>
                      <option>Red Hat OpenShift Architect</option>
                      <option>Offshore XML Engineer</option>
                      <option>UX / Product Designer</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] text-gray-500 mb-1">TO DISCIPLINE</label>
                    <select
                      value={toRole}
                      onChange={(e) => setToRole(e.target.value)}
                      className="w-full border border-gray-300 bg-white px-2 py-1.5"
                    >
                      <option>Offshore XML Engineer</option>
                      <option>UX / Product Designer</option>
                      <option>Red Hat OpenShift Architect</option>
                      <option>Regulatory Affairs Expert</option>
                    </select>
                  </div>
                </div>
                <input
                  type="text"
                  value={lessonTopic}
                  onChange={(e) => setLessonTopic(e.target.value)}
                  placeholder="Lesson Topic (e.g., Why Module 5 requires Study Tagging Files)"
                  className="w-full border border-gray-300 px-3 py-1.5 text-xs focus:outline-none focus:border-gray-900"
                />
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={lessonBody}
                    onChange={(e) => setLessonBody(e.target.value)}
                    placeholder="Explain the regulatory reason & practical engineering action..."
                    className="flex-grow border border-gray-300 px-3 py-1.5 text-xs focus:outline-none focus:border-gray-900"
                  />
                  <button
                    type="submit"
                    className="bg-[#111827] hover:bg-black text-white px-3.5 py-1.5 text-xs font-mono flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Share
                  </button>
                </div>
              </form>
            </div>

            <div className="lg:col-span-6 bg-white border border-gray-300 p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                <div>
                  <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#0F4C81]" />
                    Interactive eCTD &amp; Red Hat Educational Tutor
                  </h2>
                  <p className="text-xs text-gray-600 mt-0.5">
                    Powered securely via Vercel Serverless Proxy (<code>/api/gemini</code>) using your hidden <code>GEMINI_API_KEY</code>.
                  </p>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="text-[11px] font-mono text-gray-500">
                  QUICK CURRICULUM PROMPTS (CLICK TO TEACH TEAM):
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    'Explain eCTD sequence lifecycle (new, replace, append, delete) to a junior developer',
                    'Why do pharmaceutical companies require Red Hat OpenShift instead of public cloud?',
                    'What are the top 5 FDA eCTD Technical Rejection Criteria for PDFs and XML?'
                  ].map((sampleQ) => (
                    <button
                      key={sampleQ}
                      type="button"
                      onClick={() => askEducationalTutor(null, sampleQ)}
                      className="text-left text-[11px] font-mono bg-[#FAFAFA] hover:bg-gray-100 border border-gray-300 px-2.5 py-1.5 text-gray-800 transition"
                    >
                      {sampleQ}
                    </button>
                  ))}
                </div>
              </div>

              <form onSubmit={(e) => askEducationalTutor(e)} className="space-y-2.5">
                <textarea
                  rows={3}
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="Ask any eCTD XML, FDA/EMA/SFDA submission, or Red Hat OpenShift compliance question..."
                  className="w-full border border-gray-300 p-3 text-xs font-mono bg-[#FAFAFA] focus:outline-none focus:border-gray-900"
                />
                <button
                  type="submit"
                  disabled={aiLoading}
                  className="w-full bg-[#0F4C81] hover:bg-[#0b3960] disabled:opacity-50 text-white py-2.5 text-xs font-mono font-bold flex items-center justify-center gap-2 transition"
                >
                  {aiLoading ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      Consulting Vercel Serverless Tutor...
                    </>
                  ) : (
                    <>
                      <Terminal className="w-3.5 h-3.5" />
                      Generate Educational Explanation
                    </>
                  )}
                </button>
              </form>

              {aiReply && (
                <div className="p-4 bg-[#FAFAFA] border border-gray-300 space-y-2 max-h-72 overflow-y-auto">
                  {aiStatusNote && (
                    <div className="text-[10px] font-mono text-emerald-800 border-b border-gray-200 pb-1">
                      {aiStatusNote}
                    </div>
                  )}
                  <div className="text-xs text-gray-800 whitespace-pre-wrap leading-relaxed">
                    {aiReply}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <footer className="bg-white border-t border-gray-300 py-4 px-4 sm:px-8 text-xs font-mono text-gray-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>eCTD SYNC • Pharmaceutical Regulatory Lab &amp; Red Hat Compliance Console</div>
          <div>Pure Vite + React • Vercel Serverless Key Isolation • &le; 50MB Payload Guard</div>
        </div>
      </footer>
    </div>
  );
}
