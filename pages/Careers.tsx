
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Briefcase, CheckCircle2, ChevronRight, ChevronLeft, MapPin, Building2, Sparkles } from 'lucide-react';
import ApplicationModal, { JobVacancy, VACANCIES_LIST } from '../components/ApplicationModal';

const Careers: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedJob, setSelectedJob] = useState<JobVacancy | null>(null);
  const [currentVacancyIndex, setCurrentVacancyIndex] = useState<number>(0);

  const totalVacancies = VACANCIES_LIST.length;
  const currentJob = VACANCIES_LIST[currentVacancyIndex];

  const handleOpenApplication = (job?: JobVacancy) => {
    setSelectedJob(job || null);
    setIsModalOpen(true);
  };

  const handleNextVacancy = () => {
    setCurrentVacancyIndex((prev) => (prev + 1) % totalVacancies);
  };

  const handlePrevVacancy = () => {
    setCurrentVacancyIndex((prev) => (prev - 1 + totalVacancies) % totalVacancies);
  };

  return (
    <div className="bg-white min-h-screen p-8 md:p-24 max-w-7xl">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-[#990000] text-xs font-bold tracking-[0.4em] uppercase mb-4">Careers</h2>
        <h1 className="text-4xl md:text-5xl font-bold mb-16 text-black tracking-tight">Join the Vanguard of Strategic Law.</h1>

        <div className="grid lg:grid-cols-[1fr_400px] gap-16 lg:gap-24">
          <div className="space-y-12">
            <section className="space-y-6">
              <h3 className="text-3xl font-bold font-serif">Why TEP?</h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                At Three Edge Practice, we don't just practice law; we shape strategy. We provide our team members with the platform to work on landmark cases that influence the regulatory and economic landscape of West Africa.
              </p>
              <div className="grid sm:grid-cols-2 gap-8 pt-6">
                <div className="border-l-2 border-[#990000] pl-4">
                  <h4 className="text-[#990000] font-bold text-xs uppercase tracking-widest mb-1.5">Mentorship</h4>
                  <p className="text-sm text-gray-500 italic">Learn from the most seasoned strategic minds and Senior Advocates in the industry.</p>
                </div>
                <div className="border-l-2 border-[#990000] pl-4">
                  <h4 className="text-[#990000] font-bold text-xs uppercase tracking-widest mb-1.5">Impact</h4>
                  <p className="text-sm text-gray-500 italic">Work on high-stakes commercial disputes and energy transactions that redefine industry standards.</p>
                </div>
              </div>
            </section>

            <section className="bg-black text-white p-6 md:p-8 space-y-4">
              {/* Section Header with Stepper Controls */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
                <div className="flex items-center gap-3">
                  <h3 className="text-xl font-bold font-serif">Current Vacancies</h3>
                  <span className="text-[10px] font-mono tracking-widest font-bold px-2 py-0.5 bg-[#990000] text-white uppercase">
                    {String(currentVacancyIndex + 1).padStart(2, '0')} / {String(totalVacancies).padStart(2, '0')}
                  </span>
                </div>

                {/* Quick Controls in Header */}
                <div className="flex items-center gap-1.5 self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={handlePrevVacancy}
                    aria-label="Previous vacancy"
                    className="p-1.5 border border-white/20 text-gray-300 hover:text-white hover:border-white hover:bg-white/10 transition-colors"
                    title="Previous Vacancy"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNextVacancy}
                    aria-label="Next vacancy"
                    className="p-1.5 border border-white/20 text-gray-300 hover:text-white hover:border-white hover:bg-white/10 transition-colors"
                    title="Next Vacancy"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Segmented Step Indicator */}
              <div className="grid grid-cols-5 gap-1">
                {VACANCIES_LIST.map((job, idx) => {
                  const isActive = idx === currentVacancyIndex;
                  return (
                    <button
                      key={job.title}
                      type="button"
                      onClick={() => setCurrentVacancyIndex(idx)}
                      className={`h-1 transition-all duration-300 ${
                        isActive
                          ? 'bg-[#990000]'
                          : 'bg-white/20 hover:bg-white/40'
                      }`}
                      aria-label={`Go to vacancy ${idx + 1}: ${job.title}`}
                      title={`${idx + 1}. ${job.title}`}
                    />
                  );
                })}
              </div>

              {/* Single Vacancy Display */}
              <div>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentVacancyIndex}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.2 }}
                    className="border border-white/10 bg-white/[0.03] p-5 md:p-6 space-y-4"
                  >
                    {/* Meta Badges */}
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-white/10 text-white border border-white/10">
                        <MapPin className="w-2.5 h-2.5 text-[#990000]" />
                        {currentJob.type}
                      </span>
                      {currentJob.department && (
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-medium text-gray-300 bg-white/5 border border-white/10">
                          <Building2 className="w-2.5 h-2.5 text-gray-400" />
                          {currentJob.department}
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-emerald-400 uppercase tracking-widest px-1.5 py-0.5 ml-auto">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        Active Cycle
                      </span>
                    </div>

                    {/* Job Title */}
                    <h4 className="text-xl md:text-2xl font-bold font-serif text-white tracking-tight leading-snug">
                      {currentJob.title}
                    </h4>

                    {/* Overview */}
                    {currentJob.overview && (
                      <p className="text-gray-300 text-xs md:text-sm leading-relaxed">
                        {currentJob.overview}
                      </p>
                    )}

                    {/* Requirements / Criteria */}
                    {currentJob.requirements && (
                      <div className="border-l-2 border-[#990000] pl-3 py-0.5 bg-white/[0.02]">
                        <span className="text-[9px] font-bold uppercase tracking-widest text-[#990000] block mb-0.5">
                          Profile & Qualifications
                        </span>
                        <p className="text-xs text-gray-400 leading-relaxed">
                          {currentJob.requirements}
                        </p>
                      </div>
                    )}

                    {/* Action Bar */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-white/10">
                      <button
                        type="button"
                        onClick={() => handleOpenApplication(currentJob)}
                        className="text-[11px] font-bold bg-[#990000] text-white px-5 py-2.5 uppercase tracking-wider hover:bg-red-700 transition-colors flex items-center gap-2 self-start"
                      >
                        <span>Apply for Position</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>

                      {/* Next / Prev Stepper Buttons */}
                      <div className="flex items-center gap-2 self-stretch sm:self-auto">
                        <button
                          type="button"
                          onClick={handlePrevVacancy}
                          className="flex-1 sm:flex-none px-3 py-2 border border-white/20 text-[11px] font-bold text-gray-300 hover:text-white hover:border-white/50 uppercase tracking-wider flex items-center justify-center gap-1 transition-colors"
                        >
                          <ChevronLeft className="w-3.5 h-3.5" />
                          <span>Prev</span>
                        </button>
                        <button
                          type="button"
                          onClick={handleNextVacancy}
                          className="flex-1 sm:flex-none px-4 py-2 bg-white text-black text-[11px] font-bold uppercase tracking-wider hover:bg-gray-200 flex items-center justify-center gap-1.5 transition-colors group"
                        >
                          <span>Next</span>
                          <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </section>
          </div>

          <aside className="space-y-12">
            <div className="bg-[#990000] p-10 md:p-12 flex flex-col justify-between text-white min-h-[320px]">
              <h3 className="text-2xl md:text-3xl font-serif italic leading-snug">
                "We look for candidates who think beyond the statute books and possess relentless strategic acumen."
              </h3>
              <div className="pt-8 border-t border-white/20">
                <p className="font-bold uppercase tracking-widest text-[10px] text-white/90">The Recruitment Board</p>
                <p className="text-xs text-white/70 mt-0.5">Three Edge Practice</p>
              </div>
            </div>
            
            <div className="border border-gray-200 p-8 space-y-6 bg-gray-50/50">
              <h4 className="font-bold text-black uppercase text-xs tracking-widest">Culture & Intake Protocol</h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                Our culture is defined by rigorous debate, collaborative problem-solving, and continuous mastery. We accept rolling applications for lateral hires, pupils, and practice associates.
              </p>
              <button
                onClick={() => handleOpenApplication()}
                className="w-full py-3.5 bg-black text-white text-xs font-bold uppercase tracking-widest hover:bg-[#990000] transition-all flex items-center justify-center gap-2"
              >
                <span>Submit Application Dossier</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </aside>
        </div>
      </motion.div>

      {/* Application Form Modal */}
      <ApplicationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedJob={selectedJob}
        allJobs={VACANCIES_LIST}
      />
    </div>
  );
};

export default Careers;
