import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  Briefcase,
  GraduationCap,
  Award,
  ChevronDown,
  UploadCloud,
  CheckCircle2,
  Mail,
  MapPin,
  Clock,
  Sparkles,
  Users,
  Compass,
  FileText,
  AlertCircle,
  ExternalLink,
  X,
  Send
} from 'lucide-react';
import ApplicationModal, { JobVacancy, VACANCIES_LIST } from '../components/ApplicationModal';

interface FAQItem {
  question: string;
  answer: string;
}

const FAQS: FAQItem[] = [
  {
    question: 'How do I apply when there are no active vacancies listed?',
    answer:
      'Three Edge Practice operates an active Rolling Talent Pool. When there are no specific vacancies posted, we encourage exceptional candidates to submit a speculative curriculum vitae and writing sample through our "Submit Your CV" portal on this page or via careers@tep.com.ng. All applications are indexed by practice group and reviewed prior to our quarterly recruitment deliberations.'
  },
  {
    question: 'When does the annual Internship Programme intake take place?',
    answer:
      'Our primary Summer Internship cycle runs annually between June and September. Applications for this cycle open from December 1st through February 28th each year. In addition, we accommodate Nigerian Law School externships on a rolling basis aligned with the official Council of Legal Education academic calendar.'
  },
  {
    question: 'What are the academic qualifications for the Trainee Associate track?',
    answer:
      'Prospective Trainee Associates and NYSC legal counsel must hold a minimum of a Second Class Upper Division (2:1) at both the LL.B and Nigerian Law School (B.L.) levels. We also evaluate demonstrated analytical excellence, legal drafting proficiency, extracurricular moot court or law review leadership, and commercial acumen.'
  },
  {
    question: 'Does the firm accept physical or paper CV drop-offs at regional offices?',
    answer:
      'No. In alignment with Three Edge Practice’s environmental stewardship and paperless digital operations, all applications must be submitted digitally via our online careers portal or transmitted to careers@tep.com.ng. Physical dossiers delivered to our chambers in Lagos, Abuja, Port Harcourt, or Kano will not be processed.'
  },
  {
    question: 'What does the assessment and interview process involve?',
    answer:
      'Our recruitment process is rigorous, transparent, and meritocratic. Shortlisted applicants undergo a three-stage evaluation: (1) a preliminary analytical writing and legal drafting assessment; (2) a competency and commercial problem-solving interview with Senior Associates and Managing Counsel; and (3) a final conversational panel with members of the Firm’s Partnership Board.'
  },
  {
    question: 'Are foreign-qualified practitioners eligible for lateral hire positions?',
    answer:
      'Yes. We actively recruit dual-qualified practitioners (e.g. England & Wales, New York, Texas, or Canada) who are admitted to practice before the Nigerian Bar. Counsel with specialized experience in international arbitration, cross-border energy transactions, and multijurisdictional regulatory compliance are strongly encouraged to submit their credentials.'
  }
];

export const Careers: React.FC = () => {
  // Application Modal state
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState<boolean>(false);
  const [selectedJob, setSelectedJob] = useState<JobVacancy | null>(null);

  // Open Positions Modal state (modeled on https://tnp.com.ng/careers/open-positions/)
  const [isOpenPositionsModalOpen, setIsOpenPositionsModalOpen] = useState<boolean>(false);
  const [selectedPathwayTitle, setSelectedPathwayTitle] = useState<string>('Three Edge Practice');

  // Simple Recruitment Inquiry Modal state
  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState<boolean>(false);
  const [inquiryForm, setInquiryForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    category: 'Internship Programme Cycles',
    message: ''
  });
  const [isSubmittingInquiry, setIsSubmittingInquiry] = useState<boolean>(false);
  const [inquirySuccess, setInquirySuccess] = useState<boolean>(false);
  const [inquiryError, setInquiryError] = useState<string>('');

  // FAQ Accordion state
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const handleOpenOpenPositions = (pathway: string) => {
    setSelectedPathwayTitle(pathway);
    setIsOpenPositionsModalOpen(true);
  };

  const handleOpenApplicationModal = (pathwayTitle?: string) => {
    setSelectedJob({
      title: pathwayTitle ? `${pathwayTitle} — Speculative Submission` : 'General Speculative Application',
      type: 'All Regional Offices',
      department: 'Three Edge Practice Talent Pool',
      overview:
        'Submit an unsolicited dossier for rolling evaluation across our Abuja, Lagos, Port Harcourt, and Kano chambers.',
      requirements: 'Open to exceptional practitioners, litigators, and pupils across all practice groups.'
    });
    setIsApplicationModalOpen(true);
  };

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryForm.fullName.trim() || !inquiryForm.email.trim() || !inquiryForm.message.trim()) {
      setInquiryError('Please complete all required fields.');
      return;
    }

    setIsSubmittingInquiry(true);
    setInquiryError('');

    setTimeout(() => {
      setIsSubmittingInquiry(false);
      setInquirySuccess(true);
    }, 1000);
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-white text-black min-h-screen">
      {/* ----------------------------------------------------------------------- */}
      {/* 1. COMPACT HERO SECTION */}
      {/* ----------------------------------------------------------------------- */}
      <section className="relative border-b border-gray-800 bg-black text-white py-10 md:py-14 px-6 md:px-12 lg:px-16 overflow-hidden">
        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

        <div className="relative z-10 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-3.5"
          >
            <div className="flex items-center gap-2 text-[11px] font-semibold tracking-[0.25em] uppercase text-[#990000]">
              <span>Careers</span>
              <span aria-hidden="true">·</span>
              <span className="text-gray-400">Three Edge Practice Chambers</span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold font-serif tracking-tight text-white leading-tight">
              Advocacy Defined by Strategy. <span className="text-[#990000]">Careers Built on Precedent.</span>
            </h1>

            <p className="text-xs sm:text-sm text-gray-300 max-w-2xl leading-relaxed font-light">
              We cultivate exceptional legal counsel and practice professionals committed to intellectual precision,
              commercial ingenuity, and landmark dispute resolution across Nigeria and West Africa.
            </p>

            {/* Compact Navigation Anchor Bar */}
            <div className="pt-2 flex flex-wrap items-center gap-2 text-[11px]">
              <button
                type="button"
                onClick={() => scrollToSection('why-join-us')}
                className="px-3 py-1.5 border border-white/20 hover:border-white text-gray-200 hover:text-white transition-colors cursor-pointer uppercase tracking-wider text-[11px]"
              >
                Why Join Us
              </button>
              <button
                type="button"
                onClick={() => scrollToSection('pathways')}
                className="px-3 py-1.5 border border-white/20 hover:border-white text-gray-200 hover:text-white transition-colors cursor-pointer uppercase tracking-wider text-[11px]"
              >
                Career Pathways
              </button>
              <button
                type="button"
                onClick={() => scrollToSection('internships')}
                className="px-3 py-1.5 border border-white/20 hover:border-white text-gray-200 hover:text-white transition-colors cursor-pointer uppercase tracking-wider text-[11px]"
              >
                Internship Programme
              </button>
              <button
                type="button"
                onClick={() => scrollToSection('submit-cv')}
                className="px-3 py-1.5 bg-[#990000] hover:bg-[#b30000] text-white transition-colors cursor-pointer font-bold uppercase tracking-wider text-[11px]"
              >
                Submit Your CV
              </button>
              <button
                type="button"
                onClick={() => scrollToSection('faqs')}
                className="px-3 py-1.5 border border-white/20 hover:border-white text-gray-200 hover:text-white transition-colors cursor-pointer uppercase tracking-wider text-[11px]"
              >
                FAQs
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ----------------------------------------------------------------------- */}
      {/* 2. WHY JOIN US / THE FOUR STRATEGIC PILLARS */}
      {/* ----------------------------------------------------------------------- */}
      <section id="why-join-us" className="py-16 md:py-24 px-6 md:px-16 lg:px-24 max-w-7xl mx-auto">
        <div className="space-y-4 mb-14">
          <p className="text-xs font-bold tracking-[0.3em] uppercase text-[#990000]">Life at Three Edge Practice</p>
          <h2 className="text-3xl md:text-4xl font-bold font-serif tracking-tight text-black">
            The Three Edge Practice Advantage
          </h2>
          <p className="text-gray-600 text-sm md:text-base max-w-3xl leading-relaxed">
            Our firm is defined by a culture of strategic depth, collaborative energy, and mutual trust. We invest in
            individuals who want to master their discipline and shape the commercial and regulatory trajectory of West
            Africa.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-10">
          {/* Pillar 1 */}
          <div className="border border-gray-200 p-8 sm:p-10 hover:border-black transition-colors bg-white space-y-4">
            <div className="w-12 h-12 bg-black text-white flex items-center justify-center font-serif font-bold text-lg">
              01
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-serif text-black">
              Unrivaled Practice Breadth & Direct Frontline Exposure
            </h3>
            <p className="text-gray-600 leading-relaxed text-sm">
              We reject the practice of sequestering talent in narrow administrative silos. From day one, you engage
              directly in high-stakes dispute resolution, complex commercial documentation, and regulatory defense—refining
              your strategic instincts through actual case ownership and trial room immersion.
            </p>
            <div className="pt-2 text-xs text-gray-500 flex items-center gap-2">
              <span>Direct Client Engagement</span>
              <span aria-hidden="true">·</span>
              <span>Cross-Disciplinary Exposure</span>
            </div>
          </div>

          {/* Pillar 2 */}
          <div className="border border-gray-200 p-8 sm:p-10 hover:border-black transition-colors bg-white space-y-4">
            <div className="w-12 h-12 bg-black text-white flex items-center justify-center font-serif font-bold text-lg">
              02
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-serif text-black">
              Landmark Mandates That Shape West African Commerce
            </h3>
            <p className="text-gray-600 leading-relaxed text-sm">
              Our briefs sit at the critical intersection of Nigerian commerce, energy infrastructure, sovereign
              regulation, and global capital. The advocacy you deliver here influences judicial precedent, structural policy
              reforms, and multi-billion-naira industrial transactions.
            </p>
            <div className="pt-2 text-xs text-gray-500 flex items-center gap-2">
              <span>High-Consequence Briefs</span>
              <span aria-hidden="true">·</span>
              <span>Regional Precedent</span>
            </div>
          </div>

          {/* Pillar 3 */}
          <div className="border border-gray-200 p-8 sm:p-10 hover:border-black transition-colors bg-white space-y-4">
            <div className="w-12 h-12 bg-black text-white flex items-center justify-center font-serif font-bold text-lg">
              03
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-serif text-black">
              Institutional Mentorship & Accelerated Leadership
            </h3>
            <p className="text-gray-600 leading-relaxed text-sm">
              Professional mastery is cultivated through deliberate apprenticeship. You will work alongside Senior
              Advocates and practice leaders, gaining access to trial workshops, specialized research sabbaticals, and a
              transparent roadmap toward partnership and practice leadership.
            </p>
            <div className="pt-2 text-xs text-gray-500 flex items-center gap-2">
              <span>Senior Partner Mentorship</span>
              <span aria-hidden="true">·</span>
              <span>Advocacy Academies</span>
            </div>
          </div>

          {/* Pillar 4 */}
          <div className="border border-gray-200 p-8 sm:p-10 hover:border-black transition-colors bg-white space-y-4">
            <div className="w-12 h-12 bg-black text-white flex items-center justify-center font-serif font-bold text-lg">
              04
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-serif text-black">
              An Intellectual Meritocracy Grounded in Integrity
            </h3>
            <p className="text-gray-600 leading-relaxed text-sm">
              We foster an agile, unpretentious collegial environment where ideas are judged solely by their strategic
              validity and rigorous craftsmanship. We value mutual trust, ethical discipline, and the collective pursuit of
              legal excellence.
            </p>
            <div className="pt-2 text-xs text-gray-500 flex items-center gap-2">
              <span>Merit-Driven Progression</span>
              <span aria-hidden="true">·</span>
              <span>Collegial Culture</span>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------------------- */}
      {/* 3. CULTURE QUOTE & AT-A-GLANCE METRICS */}
      {/* ----------------------------------------------------------------------- */}
      <section className="bg-gray-50 border-y border-gray-200 py-16 px-6 md:px-16 lg:px-24">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <span className="text-xs font-bold tracking-[0.3em] uppercase text-[#990000]">The TEP Standard</span>
            <blockquote className="text-2xl sm:text-3xl font-serif italic text-black leading-snug">
              "We seek lawyers and advisors who think beyond the statute books, understand the commercial imperatives of
              our clients, and embody relentless intellectual integrity."
            </blockquote>
            <div className="pt-2">
              <p className="font-bold text-black uppercase tracking-wider text-xs">The Recruitment & Management Board</p>
              <p className="text-xs text-gray-500">Three Edge Practice · Abuja · Lagos · Port Harcourt · Kano</p>
            </div>
          </div>

          <div className="lg:col-span-5 grid grid-cols-2 gap-6">
            <div className="bg-white p-6 border border-gray-200">
              <p className="text-3xl font-bold font-serif text-black">4</p>
              <p className="text-xs uppercase tracking-wider text-gray-500 mt-1">Regional Chambers</p>
              <p className="text-xs text-gray-400 mt-2">Lagos, Abuja, Port Harcourt & Kano</p>
            </div>
            <div className="bg-white p-6 border border-gray-200">
              <p className="text-3xl font-bold font-serif text-[#990000]">100%</p>
              <p className="text-xs uppercase tracking-wider text-gray-500 mt-1">Digital Practice</p>
              <p className="text-xs text-gray-400 mt-2">Cloud docketing & secure client portals</p>
            </div>
            <div className="bg-white p-6 border border-gray-200">
              <p className="text-3xl font-bold font-serif text-black">8+</p>
              <p className="text-xs uppercase tracking-wider text-gray-500 mt-1">Practice Groups</p>
              <p className="text-xs text-gray-400 mt-2">Energy, Litigation, Tax, Tech & White-Collar</p>
            </div>
            <div className="bg-white p-6 border border-gray-200">
              <p className="text-3xl font-bold font-serif text-[#990000]">1:1</p>
              <p className="text-xs uppercase tracking-wider text-gray-500 mt-1">Partner Mentorship</p>
              <p className="text-xs text-gray-400 mt-2">Direct engagement with firm leadership</p>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------------------- */}
      {/* 4. CAREER PATHWAYS (INTERNSHIPS, TRAINEES, EXPERIENCE HIRES & BUSINESS OPS) */}
      {/* ----------------------------------------------------------------------- */}
      <section id="pathways" className="py-20 md:py-28 px-6 md:px-16 lg:px-24 max-w-7xl mx-auto">
        <div className="space-y-4 mb-16">
          <p className="text-xs font-bold tracking-[0.3em] uppercase text-[#990000]">Growth Architecture</p>
          <h2 className="text-3xl md:text-5xl font-bold font-serif tracking-tight text-black">
            Career Pathways
          </h2>
          <p className="text-gray-600 text-base md:text-lg max-w-3xl leading-relaxed">
            Whether taking your first steps into commercial practice or seeking a platform for high-level lateral growth,
            we offer clear and structured career trajectories.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Pathway 1: Internships */}
          <div id="internships" className="border border-gray-200 p-8 flex flex-col justify-between bg-white hover:border-black transition-colors">
            <div className="space-y-5">
              <div className="w-10 h-10 bg-gray-100 flex items-center justify-center text-[#990000]">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Undergraduate & Law School</p>
                <h3 className="text-xl font-bold font-serif text-black">Internship Programme</h3>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                Designed for outstanding law undergraduates and Nigerian Law School externs. Interns work directly on
                active client matters, assist in court process drafting, attend superior court hearings, and receive
                constructive feedback from seasoned associates.
              </p>
              <ul className="text-xs text-gray-500 space-y-2 pt-2 border-t border-gray-100">
                <li className="flex items-start gap-2">
                  <span className="text-[#990000] font-bold font-serif">·</span>
                  <span>Summer Cycle (June – September)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#990000] font-bold font-serif">·</span>
                  <span>Applications Open: Dec 1 – Feb 28</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#990000] font-bold font-serif">·</span>
                  <span>Fast-track to Trainee Associate interview</span>
                </li>
              </ul>
            </div>
            <div className="pt-8">
              <button
                type="button"
                onClick={() => handleOpenOpenPositions('Internship Programme')}
                className="w-full py-3 border border-black hover:bg-black hover:text-white text-black text-xs font-bold uppercase tracking-wider transition-colors inline-flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Apply for Internship</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Pathway 2: Trainee Associates */}
          <div className="border border-gray-200 p-8 flex flex-col justify-between bg-white hover:border-black transition-colors">
            <div className="space-y-5">
              <div className="w-10 h-10 bg-gray-100 flex items-center justify-center text-[#990000]">
                <Briefcase className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Pupillage & NYSC</p>
                <h3 className="text-xl font-bold font-serif text-black">Trainee Associate Programme</h3>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                A rigorous 12-month structured rotational development track for newly called barristers and NYSC counsel.
                Trainees rotate across Commercial Advisory, Dispute Resolution, Regulatory Compliance, and Energy Law under
                the guidance of assigned mentor partners.
              </p>
              <ul className="text-xs text-gray-500 space-y-2 pt-2 border-t border-gray-100">
                <li className="flex items-start gap-2">
                  <span className="text-[#990000] font-bold font-serif">·</span>
                  <span>Minimum 2:1 LL.B and B.L. credentials</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#990000] font-bold font-serif">·</span>
                  <span>Trial advocacy and courtroom appearances</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#990000] font-bold font-serif">·</span>
                  <span>Quarterly performance and advancement reviews</span>
                </li>
              </ul>
            </div>
            <div className="pt-8">
              <button
                type="button"
                onClick={() => handleOpenOpenPositions('Trainee Associate Programme')}
                className="w-full py-3 border border-black hover:bg-black hover:text-white text-black text-xs font-bold uppercase tracking-wider transition-colors inline-flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Apply as Trainee</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Pathway 3: Experience Hires & Business Ops */}
          <div className="border border-gray-200 p-8 flex flex-col justify-between bg-white hover:border-black transition-colors md:col-span-2 lg:col-span-1">
            <div className="space-y-5">
              <div className="w-10 h-10 bg-gray-100 flex items-center justify-center text-[#990000]">
                <Award className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Mid-Career & Leadership</p>
                <h3 className="text-xl font-bold font-serif text-black">Experience Hires & Business Ops</h3>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                For experienced litigators, transactional counsel, and specialized practice leads with proven domain
                authority. We also welcome forward-thinking professionals in Legal Tech, Knowledge Management, Finance,
                and Practice Administration.
              </p>
              <ul className="text-xs text-gray-500 space-y-2 pt-2 border-t border-gray-100">
                <li className="flex items-start gap-2">
                  <span className="text-[#990000] font-bold font-serif">·</span>
                  <span>Senior Associate & Managing Counsel paths</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#990000] font-bold font-serif">·</span>
                  <span>Entrepreneurial and partnership tracks</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#990000] font-bold font-serif">·</span>
                  <span>Executive business and practice management</span>
                </li>
              </ul>
            </div>
            <div className="pt-8">
              <button
                type="button"
                onClick={() => handleOpenOpenPositions('Experience Hires & Business Ops')}
                className="w-full py-3 bg-[#990000] hover:bg-black text-white text-xs font-bold uppercase tracking-wider transition-colors inline-flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Submit Application</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------------------- */}
      {/* 5. TALENT DATABASE & SPECULATIVE DOSSIERS (CLEANED UP SECTION) */}
      {/* ----------------------------------------------------------------------- */}
      <section id="submit-cv" className="py-20 md:py-28 px-6 md:px-16 lg:px-24 max-w-7xl mx-auto border-t border-gray-200">
        <div className="bg-gray-50 border border-gray-200 p-8 sm:p-14 lg:p-16">
          <div className="max-w-4xl space-y-8">
            <div className="space-y-3">
              <p className="text-xs font-bold tracking-[0.3em] uppercase text-[#990000]">Talent Database</p>
              <h2 className="text-3xl md:text-4xl font-bold font-serif tracking-tight text-black">
                Submit Your CV
              </h2>
              <p className="text-gray-600 leading-relaxed text-sm sm:text-base font-light">
                Three Edge Practice continually evaluates distinguished legal practitioners, seasoned litigators, and
                promising pupils for future expansion. Prospective counsel are welcome to submit an unsolicited curriculum
                vitae and dossier for consideration across our Abuja, Lagos, Port Harcourt, and Kano chambers.
              </p>
            </div>

            {/* Guidelines Grid */}
            <div className="grid sm:grid-cols-2 gap-6 pt-2">
              <div className="bg-white p-6 border border-gray-200 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-black">
                  <FileText className="w-4 h-4 text-[#990000]" />
                  <span>Dossier Format</span>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Curriculum vitae and writing sample should be in PDF or Microsoft Word format (under 10MB). Please indicate
                  your Call to Bar year or expected law graduation date.
                </p>
              </div>

              <div className="bg-white p-6 border border-gray-200 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-black">
                  <MapPin className="w-4 h-4 text-[#990000]" />
                  <span>Chamber Preference</span>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  State your preferred office location (Lagos, Abuja, Port Harcourt, or Kano) and your core practice group
                  focus (Dispute Resolution, Corporate, Energy, Regulatory, or White-Collar Defense).
                </p>
              </div>
            </div>

            {/* Direct Channel & Action */}
            <div className="pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border-t border-gray-200">
              <div className="space-y-1 text-xs text-gray-600">
                <p className="font-semibold text-black">Talent Management & Registry Desks:</p>
                <p>Email: <a href="mailto:careers@tep.com.ng" className="text-[#990000] hover:underline">careers@tep.com.ng</a> · Registry: registry@tep.com.ng</p>
              </div>

              <button
                type="button"
                onClick={() => handleOpenApplicationModal()}
                className="px-8 py-3.5 bg-[#990000] hover:bg-black text-white text-xs font-bold uppercase tracking-wider transition-colors inline-flex items-center gap-2 cursor-pointer shadow-sm shrink-0"
              >
                <span>Submit Your CV</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------------------- */}
      {/* 6. WHAT WE LOOK FOR (THE SELECTION CRITERIA) */}
      {/* ----------------------------------------------------------------------- */}
      <section className="bg-gray-50 border-t border-gray-200 py-20 md:py-28 px-6 md:px-16 lg:px-24">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <p className="text-xs font-bold tracking-[0.3em] uppercase text-[#990000]">Candidate Standards</p>
            <h2 className="text-3xl md:text-5xl font-bold font-serif tracking-tight text-black">
              What We Look For
            </h2>
            <p className="text-gray-600 text-sm md:text-base leading-relaxed">
              We hold our practitioners to the highest international standards of analytical rigor, ethical practice,
              and commercial execution.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 border border-gray-200 space-y-3">
              <Compass className="w-6 h-6 text-[#990000]" />
              <h4 className="font-serif font-bold text-lg text-black">Intellectual Rigor</h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                A command of legal doctrine, meticulous research discipline, and the ability to articulate complex legal
                principles with clarity and precision.
              </p>
            </div>

            <div className="bg-white p-6 border border-gray-200 space-y-3">
              <Sparkles className="w-6 h-6 text-[#990000]" />
              <h4 className="font-serif font-bold text-lg text-black">Commercial Acumen</h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                Going beyond abstract legal opinions to grasp the commercial realities, financial structures, and strategic
                objectives of our clients' enterprises.
              </p>
            </div>

            <div className="bg-white p-6 border border-gray-200 space-y-3">
              <Award className="w-6 h-6 text-[#990000]" />
              <h4 className="font-serif font-bold text-lg text-black">Unbending Integrity</h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                Absolute confidentiality, fiduciary loyalty, and the moral fortitude required when advising on
                high-stakes corporate and regulatory matters.
              </p>
            </div>

            <div className="bg-white p-6 border border-gray-200 space-y-3">
              <Users className="w-6 h-6 text-[#990000]" />
              <h4 className="font-serif font-bold text-lg text-black">Collaborative Drive</h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                High emotional intelligence, resilience under trial pressure, and an instinctive commitment to collective
                success over individual acclaim.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------------------- */}
      {/* 7. FREQUENTLY ASKED QUESTIONS (FAQ ACCORDION) */}
      {/* ----------------------------------------------------------------------- */}
      <section id="faqs" className="py-20 md:py-28 px-6 md:px-16 lg:px-24 max-w-5xl mx-auto">
        <div className="space-y-4 mb-12">
          <p className="text-xs font-bold tracking-[0.3em] uppercase text-[#990000]">Admissions & Queries</p>
          <h2 className="text-3xl md:text-5xl font-bold font-serif tracking-tight text-black">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-600 text-sm md:text-base leading-relaxed">
            Essential information regarding our recruitment cycles, evaluation processes, and talent repository.
          </p>
        </div>

        <div className="divide-y divide-gray-200 border-y border-gray-200">
          {FAQS.map((faq, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div key={index} className="py-6">
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                  className="w-full flex items-center justify-between text-left gap-4 cursor-pointer group"
                >
                  <span className="font-serif font-bold text-base md:text-lg text-black group-hover:text-[#990000] transition-colors">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-500 transition-transform duration-200 shrink-0 ${
                      isOpen ? 'rotate-180 text-black' : ''
                    }`}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <p className="pt-4 text-sm text-gray-600 leading-relaxed font-light">{faq.answer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>

      {/* ----------------------------------------------------------------------- */}
      {/* 8. RECRUITMENT DESK FOOTER: SUBMIT INQUIRY BUTTON & INQUIRY MODAL */}
      {/* ----------------------------------------------------------------------- */}
      <section className="bg-black text-white py-16 px-6 md:px-16 lg:px-24 border-t border-white/10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-2xl font-serif font-bold text-white">Have a Specific Recruitment Inquiry?</h3>
            <p className="text-xs text-gray-400">
              Contact our Talent Management Desk directly at <span className="text-white">careers@tep.com.ng</span>.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => {
                setInquirySuccess(false);
                setInquiryError('');
                setIsInquiryModalOpen(true);
              }}
              className="px-6 py-3 bg-[#990000] hover:bg-white hover:text-black text-white text-xs font-bold uppercase tracking-wider transition-colors inline-flex items-center gap-2 cursor-pointer"
            >
              <span>Submit Inquiry</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------------------- */}
      {/* MODAL 1: OPEN POSITIONS MODAL (MODELED ON https://tnp.com.ng/careers/open-positions/) */}
      {/* ----------------------------------------------------------------------- */}
      <AnimatePresence>
        {isOpenPositionsModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpenPositionsModalOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.25 }}
              className="relative bg-white text-black w-full max-w-xl border border-gray-200 shadow-2xl z-10 overflow-hidden my-8"
            >
              {/* Modal Top Bar */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-black text-white">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-[#990000]">Careers</span>
                  <span className="text-gray-500">·</span>
                  <span className="text-xs font-semibold uppercase tracking-wider text-gray-200">Open Positions</span>
                </div>
                <button
                  onClick={() => setIsOpenPositionsModalOpen(false)}
                  className="text-gray-400 hover:text-white transition-colors cursor-pointer p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body: Exactly as on https://tnp.com.ng/careers/open-positions/ */}
              <div className="p-8 sm:p-10 text-center space-y-6">
                <div className="w-14 h-14 bg-gray-100 flex items-center justify-center mx-auto text-[#990000] border border-gray-200">
                  <Briefcase className="w-7 h-7" />
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                    {selectedPathwayTitle}
                  </p>
                  <h3 className="text-2xl sm:text-3xl font-serif font-bold text-black tracking-tight">
                    There are currently no open positions.
                  </h3>
                </div>

                <p className="text-sm text-gray-600 leading-relaxed font-light max-w-md mx-auto">
                  Thank you for your interest in Three Edge Practice. All formal vacancies for this cycle have been
                  filled across our regional chambers. However, we continually evaluate exceptional legal talent.
                  Submit your CV to be considered when relevant opportunities arise.
                </p>

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setIsOpenPositionsModalOpen(false);
                      handleOpenApplicationModal(selectedPathwayTitle);
                    }}
                    className="w-full sm:w-auto px-7 py-3 bg-[#990000] hover:bg-black text-white text-xs font-bold uppercase tracking-wider transition-colors inline-flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                  >
                    <span>Submit Your CV</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsOpenPositionsModalOpen(false)}
                    className="w-full sm:w-auto px-6 py-3 border border-gray-300 hover:border-black text-gray-700 hover:text-black text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>

              {/* Footer text */}
              <div className="bg-gray-50 border-t border-gray-200 px-6 py-3 text-center text-xs text-gray-500">
                Talent Pool Desk: <span className="text-black font-medium">careers@tep.com.ng</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ----------------------------------------------------------------------- */}
      {/* MODAL 2: SIMPLE RECRUITMENT INQUIRY FORM */}
      {/* ----------------------------------------------------------------------- */}
      <AnimatePresence>
        {isInquiryModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsInquiryModalOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.25 }}
              className="relative bg-white text-black w-full max-w-lg border border-gray-200 shadow-2xl z-10 overflow-hidden my-8"
            >
              {/* Modal Top Bar */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-black text-white">
                <div>
                  <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-[#990000]">Recruitment Desk</p>
                  <h3 className="text-base font-serif font-bold text-white">Submit Recruitment Inquiry</h3>
                </div>
                <button
                  onClick={() => setIsInquiryModalOpen(false)}
                  className="text-gray-400 hover:text-white transition-colors cursor-pointer p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 sm:p-8">
                {inquirySuccess ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-6 space-y-4"
                  >
                    <div className="w-12 h-12 bg-[#990000] text-white flex items-center justify-center mx-auto rounded-full">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <h4 className="text-xl font-serif font-bold text-black">Inquiry Transmitted</h4>
                    <p className="text-xs sm:text-sm text-gray-600 max-w-md mx-auto leading-relaxed">
                      Thank you, <strong className="text-black">{inquiryForm.fullName}</strong>. Your recruitment inquiry has
                      been routed to the Three Edge Practice Talent Management Desk. A representative will review and respond
                      to <span className="text-black font-semibold">{inquiryForm.email}</span> within two business days.
                    </p>
                    <div className="pt-4">
                      <button
                        type="button"
                        onClick={() => setIsInquiryModalOpen(false)}
                        className="px-6 py-2.5 bg-black text-white text-xs font-bold uppercase tracking-wider hover:bg-[#990000] transition-colors cursor-pointer"
                      >
                        Close Window
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <form onSubmit={handleInquirySubmit} className="space-y-4">
                    {inquiryError && (
                      <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{inquiryError}</span>
                      </div>
                    )}

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={inquiryForm.fullName}
                        onChange={(e) => setInquiryForm({ ...inquiryForm, fullName: e.target.value })}
                        placeholder="e.g. Barrister Emeka Nwosu"
                        className="w-full px-3.5 py-2.5 border border-gray-300 text-sm focus:border-black focus:outline-none transition-colors"
                      />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          required
                          value={inquiryForm.email}
                          onChange={(e) => setInquiryForm({ ...inquiryForm, email: e.target.value })}
                          placeholder="e.nwosu@example.com"
                          className="w-full px-3.5 py-2.5 border border-gray-300 text-sm focus:border-black focus:outline-none transition-colors"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          value={inquiryForm.phone}
                          onChange={(e) => setInquiryForm({ ...inquiryForm, phone: e.target.value })}
                          placeholder="+234 800 000 0000"
                          className="w-full px-3.5 py-2.5 border border-gray-300 text-sm focus:border-black focus:outline-none transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                        Nature of Inquiry
                      </label>
                      <select
                        value={inquiryForm.category}
                        onChange={(e) => setInquiryForm({ ...inquiryForm, category: e.target.value })}
                        className="w-full px-3.5 py-2.5 border border-gray-300 text-sm focus:border-black focus:outline-none transition-colors bg-white"
                      >
                        <option value="Internship Programme Cycles">Internship Programme & Law School Externships</option>
                        <option value="Trainee Associate / NYSC Track">Trainee Associate & NYSC Intake</option>
                        <option value="Experience Hires & Lateral Inquiries">Experience Hires & Lateral Opportunities</option>
                        <option value="Application Status Follow-up">Previous Application Status Follow-up</option>
                        <option value="General Recruitment Question">General Recruitment or Chamber Query</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                        Message / Inquiry Details *
                      </label>
                      <textarea
                        rows={4}
                        required
                        value={inquiryForm.message}
                        onChange={(e) => setInquiryForm({ ...inquiryForm, message: e.target.value })}
                        placeholder="Please state your inquiry or question clearly..."
                        className="w-full px-3.5 py-2.5 border border-gray-300 text-sm focus:border-black focus:outline-none transition-colors resize-none"
                      />
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={isSubmittingInquiry}
                        className="w-full py-3 bg-[#990000] hover:bg-black text-white text-xs font-bold uppercase tracking-wider transition-colors inline-flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                      >
                        {isSubmittingInquiry ? (
                          <span>Transmitting Inquiry...</span>
                        ) : (
                          <>
                            <span>Transmit Inquiry</span>
                            <Send className="w-3.5 h-3.5" />
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ----------------------------------------------------------------------- */}
      {/* MODAL 3: APPLICATION / CV SUBMISSION MODAL */}
      {/* ----------------------------------------------------------------------- */}
      <ApplicationModal
        isOpen={isApplicationModalOpen}
        onClose={() => setIsApplicationModalOpen(false)}
        selectedJob={selectedJob}
        allJobs={VACANCIES_LIST}
      />
    </div>
  );
};

export default Careers;
