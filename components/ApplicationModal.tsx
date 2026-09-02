import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, UploadCloud, FileText, CheckCircle2, AlertCircle, ArrowRight, Building2, Briefcase, User, Mail, Phone, ExternalLink } from 'lucide-react';

export interface JobVacancy {
  title: string;
  type: string;
  department?: string;
}

interface ApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedJob?: JobVacancy | null;
  allJobs?: JobVacancy[];
}

export const VACANCIES_LIST: JobVacancy[] = [
  { title: 'Senior Associate (Criminal Defense)', type: 'Lagos', department: 'Litigation & White Collar Defense' },
  { title: 'Legal Trainee (2024/2025 Cycle)', type: 'Abuja', department: 'Corporate & Regulatory Advocacy' },
  { title: 'Regulatory Compliance Specialist', type: 'Lagos / Remote', department: 'Energy & Policy Practice' },
  { title: 'Senior Energy & Natural Resources Counsel', type: 'Port Harcourt', department: 'Energy, Oil & Gas' },
  { title: 'General Speculative Application', type: 'All Regional Offices', department: 'Three Edge Practice Talent Pool' }
];

export const getSpecificOfficeLocation = (typeStr?: string): string | null => {
  if (!typeStr) return null;
  const trimmed = typeStr.trim();
  const lower = trimmed.toLowerCase();

  // If it indicates multiple locations, flexible, remote, or all offices
  if (
    lower.includes('/') ||
    lower.includes('remote') ||
    lower.includes('all') ||
    lower.includes('flexible') ||
    lower.includes('nationwide') ||
    lower.includes('various') ||
    lower.includes('hybrid')
  ) {
    return null;
  }

  // Format recognized offices
  if (lower === 'lagos' || lower.includes('lagos')) return 'Lagos Regional Office';
  if (lower === 'abuja' || lower.includes('abuja')) return 'Abuja Regional Office';
  if (lower === 'port harcourt' || lower.includes('port harcourt')) return 'Port Harcourt Regional Office';
  if (lower === 'kano' || lower.includes('kano')) return 'Kano Regional Office';

  return `${trimmed} Office`;
};

export const ApplicationModal: React.FC<ApplicationModalProps> = ({
  isOpen,
  onClose,
  selectedJob,
  allJobs = VACANCIES_LIST
}) => {
  const [targetJobTitle, setTargetJobTitle] = useState<string>('');
  const [preferredOffice, setPreferredOffice] = useState<string>('Lagos');
  const [fullName, setFullName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [experience, setExperience] = useState<string>('1-3 years');
  const [qualification, setQualification] = useState<string>('Called to Nigerian Bar (BL)');
  const [linkedIn, setLinkedIn] = useState<string>('');
  const [coverNote, setCoverNote] = useState<string>('');
  
  // File state
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [writingSampleFile, setWritingSampleFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const sampleInputRef = useRef<HTMLInputElement>(null);

  // Status state
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [applicationRef, setApplicationRef] = useState<string>('');

  // Active Job resolution
  const activeJob = allJobs.find((job) => job.title === targetJobTitle) || selectedJob;
  const specificOfficeLocation = getSpecificOfficeLocation(activeJob?.type);

  // Sync target job when selectedJob changes
  useEffect(() => {
    if (selectedJob) {
      setTargetJobTitle(selectedJob.title);
      const specific = getSpecificOfficeLocation(selectedJob.type);
      if (specific) {
        setPreferredOffice(specific);
      } else {
        if (selectedJob.type.includes('Abuja')) setPreferredOffice('Abuja');
        else if (selectedJob.type.includes('Port Harcourt')) setPreferredOffice('Port Harcourt');
        else if (selectedJob.type.includes('Kano')) setPreferredOffice('Kano');
        else setPreferredOffice('Lagos');
      }
    } else {
      const defaultJob = allJobs[0];
      setTargetJobTitle(defaultJob?.title || 'General Speculative Application');
      const specific = getSpecificOfficeLocation(defaultJob?.type);
      if (specific) {
        setPreferredOffice(specific);
      }
    }
  }, [selectedJob, allJobs, isOpen]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (validateFile(file)) {
        setResumeFile(file);
      }
    }
  };

  const validateFile = (file: File) => {
    const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!validTypes.includes(file.type) && !file.name.endsWith('.pdf') && !file.name.endsWith('.doc') && !file.name.endsWith('.docx')) {
      setErrorMessage('Please upload a PDF or Word document (.pdf, .doc, .docx).');
      return false;
    }
    if (file.size > 15 * 1024 * 1024) {
      setErrorMessage('File size must be less than 15MB.');
      return false;
    }
    setErrorMessage('');
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim() || !phone.trim()) {
      setErrorMessage('Please complete all required fields.');
      return;
    }

    if (!resumeFile) {
      setErrorMessage('Please attach your Curriculum Vitae / Resume.');
      return;
    }

    setStatus('submitting');
    setErrorMessage('');

    // Simulate reliable secure intake processing
    setTimeout(() => {
      const generatedRef = `TEP-REC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
      setApplicationRef(generatedRef);
      setStatus('success');
    }, 1200);
  };

  const handleReset = () => {
    setStatus('idle');
    setFullName('');
    setEmail('');
    setPhone('');
    setLinkedIn('');
    setCoverNote('');
    setResumeFile(null);
    setWritingSampleFile(null);
    setErrorMessage('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-10 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-3xl bg-white shadow-2xl z-10 my-auto overflow-hidden border border-gray-200"
          >
            {/* Header */}
            <div className="bg-black text-white p-6 md:p-8 flex items-start justify-between border-b-2 border-[#990000]">
              <div>
                <span className="text-[#990000] text-[10px] font-bold tracking-[0.3em] uppercase block mb-1">
                  Three Edge Practice · Career Intake
                </span>
                <h3 className="text-2xl font-serif font-bold tracking-tight">
                  {status === 'success' ? 'Application Lodged' : 'Candidate Application Dossier'}
                </h3>
                <p className="text-xs text-gray-400 mt-1">
                  Applying for: <span className="text-white font-medium">{targetJobTitle}</span>
                </p>
              </div>

              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-white hover:bg-white/10 transition-colors rounded-none"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 md:p-8 max-h-[75vh] overflow-y-auto">
              {status === 'success' ? (
                <div className="py-8 text-center space-y-6">
                  <div className="w-16 h-16 bg-[#990000]/10 text-[#990000] flex items-center justify-center mx-auto border border-[#990000]/30">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="text-2xl font-serif font-bold text-black mb-2">Application Received</h4>
                    <p className="text-sm text-gray-600 max-w-md mx-auto leading-relaxed">
                      Your application for <strong className="text-black">{targetJobTitle}</strong> has been securely transmitted to the TEP Recruitment Board.
                    </p>
                  </div>

                  <div className="bg-gray-50 border border-gray-200 p-4 max-w-md mx-auto text-left text-xs space-y-2">
                    <div className="flex justify-between border-b border-gray-200 pb-2">
                      <span className="text-gray-500 uppercase font-bold tracking-wider text-[10px]">Reference Number:</span>
                      <span className="font-mono font-bold text-[#990000]">{applicationRef}</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-200 pb-2">
                      <span className="text-gray-500 uppercase font-bold tracking-wider text-[10px]">Applicant:</span>
                      <span className="font-semibold text-black">{fullName}</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-200 pb-2">
                      <span className="text-gray-500 uppercase font-bold tracking-wider text-[10px]">
                        {specificOfficeLocation ? 'Regional Office:' : 'Preferred Office:'}
                      </span>
                      <span className="font-semibold text-black">{specificOfficeLocation || preferredOffice}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 uppercase font-bold tracking-wider text-[10px]">Resume Attached:</span>
                      <span className="font-semibold text-black truncate max-w-[200px]">{resumeFile?.name}</span>
                    </div>
                  </div>

                  <p className="text-xs text-gray-500 max-w-md mx-auto italic">
                    Our team reviews applications on a rolling basis. Shortlisted candidates will be contacted via email for preliminary interviews.
                  </p>

                  <div className="pt-4 flex justify-center gap-4">
                    <button
                      onClick={handleReset}
                      className="px-8 py-3 bg-black text-white text-xs font-bold uppercase tracking-widest hover:bg-[#990000] transition-colors"
                    >
                      Done
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {errorMessage && (
                    <div className="p-4 bg-red-50 border border-[#990000]/30 text-[#990000] text-xs flex items-center gap-3">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  {/* Role & Office Selection */}
                  <div className="grid md:grid-cols-2 gap-4 bg-gray-50 p-4 border border-gray-200">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-700 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                        <Briefcase className="w-3.5 h-3.5 text-[#990000]" />
                        Applying For Position *
                      </label>
                      <select
                        value={targetJobTitle}
                        onChange={(e) => {
                          const newTitle = e.target.value;
                          setTargetJobTitle(newTitle);
                          const matching = allJobs.find((j) => j.title === newTitle);
                          const specific = getSpecificOfficeLocation(matching?.type);
                          if (specific) {
                            setPreferredOffice(specific);
                          }
                        }}
                        className="w-full bg-white border border-gray-300 p-2.5 text-xs text-black focus:outline-none focus:border-[#990000]"
                      >
                        {allJobs.map((job) => (
                          <option key={job.title} value={job.title}>
                            {job.title} ({job.type})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      {specificOfficeLocation ? (
                        <div>
                          <label className="block text-[10px] font-bold text-gray-700 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                            <Building2 className="w-3.5 h-3.5 text-[#990000]" />
                            Regional Office
                          </label>
                          <div className="w-full bg-white border border-gray-300 p-2.5 text-xs text-black font-semibold flex items-center justify-between min-h-[38px]">
                            <span>{specificOfficeLocation}</span>
                            <span className="text-[9px] bg-black text-white px-2 py-0.5 uppercase tracking-wider font-bold">
                              Vacancy Location
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <label className="block text-[10px] font-bold text-gray-700 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                            <Building2 className="w-3.5 h-3.5 text-[#990000]" />
                            Preferred Regional Office *
                          </label>
                          <select
                            value={preferredOffice}
                            onChange={(e) => setPreferredOffice(e.target.value)}
                            className="w-full bg-white border border-gray-300 p-2.5 text-xs text-black focus:outline-none focus:border-[#990000]"
                          >
                            <option value="Lagos">Lagos (Commercial Hub)</option>
                            <option value="Abuja">Abuja (Federal Capital & Regulatory)</option>
                            <option value="Port Harcourt">Port Harcourt (Energy & Niger Delta)</option>
                            <option value="Kano">Kano (Northern Regional Practice)</option>
                            <option value="Remote / Flexible">Remote / Multi-Office Flexible</option>
                          </select>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Personal & Professional Details */}
                  <div>
                    <h5 className="text-xs font-bold uppercase tracking-widest text-black border-b border-gray-200 pb-2 mb-4">
                      1. Candidate Information
                    </h5>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-1">
                          Full Legal Name *
                        </label>
                        <div className="relative">
                          <User className="w-3.5 h-3.5 absolute left-3 top-3 text-gray-400" />
                          <input
                            type="text"
                            required
                            placeholder="e.g. Barr. Ngozi Adeleke"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 border border-gray-300 text-xs text-black focus:outline-none focus:border-[#990000]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-1">
                          Email Address *
                        </label>
                        <div className="relative">
                          <Mail className="w-3.5 h-3.5 absolute left-3 top-3 text-gray-400" />
                          <input
                            type="email"
                            required
                            placeholder="e.g. ngozi.adeleke@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 border border-gray-300 text-xs text-black focus:outline-none focus:border-[#990000]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-1">
                          Phone Number *
                        </label>
                        <div className="relative">
                          <Phone className="w-3.5 h-3.5 absolute left-3 top-3 text-gray-400" />
                          <input
                            type="tel"
                            required
                            placeholder="+234 (0) 800 000 0000"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 border border-gray-300 text-xs text-black focus:outline-none focus:border-[#990000]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-1">
                          LinkedIn / Professional Profile
                        </label>
                        <div className="relative">
                          <ExternalLink className="w-3.5 h-3.5 absolute left-3 top-3 text-gray-400" />
                          <input
                            type="url"
                            placeholder="https://linkedin.com/in/username"
                            value={linkedIn}
                            onChange={(e) => setLinkedIn(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 border border-gray-300 text-xs text-black focus:outline-none focus:border-[#990000]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-1">
                          Post-Qualification Experience (PQE)
                        </label>
                        <select
                          value={experience}
                          onChange={(e) => setExperience(e.target.value)}
                          className="w-full p-2 border border-gray-300 text-xs text-black focus:outline-none focus:border-[#990000]"
                        >
                          <option value="Entry / Graduate Trainee (0-1 year)">Entry / Graduate Trainee (0-1 year)</option>
                          <option value="1-3 years">Junior Associate (1-3 years)</option>
                          <option value="4-7 years">Senior Associate (4-7 years)</option>
                          <option value="8+ years">Managing Counsel / Partner Level (8+ years)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-1">
                          Bar Admission / Qualification Status
                        </label>
                        <select
                          value={qualification}
                          onChange={(e) => setQualification(e.target.value)}
                          className="w-full p-2 border border-gray-300 text-xs text-black focus:outline-none focus:border-[#990000]"
                        >
                          <option value="Called to Nigerian Bar (BL)">Called to Nigerian Bar (BL)</option>
                          <option value="Nigerian Law School Candidate">Nigerian Law School Candidate</option>
                          <option value="LL.B Graduate (Pre-NLS)">LL.B Graduate (Pre-NLS)</option>
                          <option value="Dual-Qualified (Nigeria & Foreign Bar)">Dual-Qualified (Nigeria & Foreign Bar)</option>
                          <option value="Non-Legal Professional (Compliance / Operations)">Non-Legal Professional</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Documents Upload Section */}
                  <div>
                    <h5 className="text-xs font-bold uppercase tracking-widest text-black border-b border-gray-200 pb-2 mb-4">
                      2. Curriculum Vitae & Dossier
                    </h5>

                    {/* Resume Drag & Drop Zone */}
                    <div
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className={`border-2 border-dashed p-6 text-center cursor-pointer transition-colors ${
                        dragActive
                          ? 'border-[#990000] bg-red-50/50'
                          : resumeFile
                          ? 'border-green-600 bg-green-50/20'
                          : 'border-gray-300 hover:border-gray-400 bg-gray-50/50'
                      }`}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf,.doc,.docx"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            if (validateFile(e.target.files[0])) {
                              setResumeFile(e.target.files[0]);
                            }
                          }
                        }}
                      />

                      {resumeFile ? (
                        <div className="flex items-center justify-between text-left">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-100 text-green-700">
                              <FileText className="w-5 h-5" />
                            </div>
                            <div>
                              <p className="text-xs font-bold text-black">{resumeFile.name}</p>
                              <p className="text-[10px] text-gray-500">{(resumeFile.size / (1024 * 1024)).toFixed(2)} MB · Attached</p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setResumeFile(null);
                            }}
                            className="text-xs text-[#990000] hover:underline font-bold"
                          >
                            Change File
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <UploadCloud className="w-8 h-8 mx-auto text-gray-400" />
                          <p className="text-xs font-bold text-black">
                            Click to upload or drag & drop your Resume / CV *
                          </p>
                          <p className="text-[10px] text-gray-500">
                            Accepted formats: PDF, DOCX, DOC (Max size: 15MB)
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Optional Writing Sample / Transcript */}
                    <div className="mt-3">
                      <div className="flex items-center justify-between">
                        <label className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">
                          Optional: Legal Writing Sample or Academic Transcript
                        </label>
                        {writingSampleFile && (
                          <button
                            type="button"
                            onClick={() => setWritingSampleFile(null)}
                            className="text-[10px] text-[#990000] hover:underline"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                      <input
                        ref={sampleInputRef}
                        type="file"
                        accept=".pdf,.doc,.docx"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            if (validateFile(e.target.files[0])) {
                              setWritingSampleFile(e.target.files[0]);
                            }
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => sampleInputRef.current?.click()}
                        className="mt-1 w-full py-2 px-3 border border-gray-300 text-left text-xs text-gray-600 hover:bg-gray-50 flex items-center justify-between"
                      >
                        <span className="truncate">
                          {writingSampleFile ? writingSampleFile.name : '+ Attach Writing Sample / Brief / Transcript (Optional)'}
                        </span>
                        <UploadCloud className="w-3.5 h-3.5 text-gray-400 flex-shrink-0 ml-2" />
                      </button>
                    </div>
                  </div>

                  {/* Statement of Interest */}
                  <div>
                    <h5 className="text-xs font-bold uppercase tracking-widest text-black border-b border-gray-200 pb-2 mb-4">
                      3. Statement of Strategic Interest
                    </h5>
                    <label className="block text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-1">
                      Cover Note / Why Three Edge Practice?
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Briefly state your core areas of expertise, strategic motivation, and how you will contribute to Three Edge Practice's mandate..."
                      value={coverNote}
                      onChange={(e) => setCoverNote(e.target.value)}
                      className="w-full p-3 border border-gray-300 text-xs text-black focus:outline-none focus:border-[#990000] leading-relaxed"
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-[10px] text-gray-500 italic">
                      Confidential. TEP complies with NDPR guidelines.
                    </p>
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      <button
                        type="button"
                        onClick={onClose}
                        className="w-full sm:w-auto px-5 py-2.5 border border-gray-300 text-xs font-bold uppercase tracking-widest text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={status === 'submitting'}
                        className="w-full sm:w-auto px-7 py-2.5 bg-black text-white text-xs font-bold uppercase tracking-widest hover:bg-[#990000] transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {status === 'submitting' ? (
                          <>
                            <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                            Submitting...
                          </>
                        ) : (
                          <>
                            Submit Application
                            <ArrowRight className="w-3.5 h-3.5" />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ApplicationModal;
