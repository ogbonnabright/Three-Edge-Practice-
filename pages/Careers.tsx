
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Briefcase, CheckCircle2, ChevronRight, Sparkles } from 'lucide-react';
import ApplicationModal, { JobVacancy, VACANCIES_LIST } from '../components/ApplicationModal';

const Careers: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedJob, setSelectedJob] = useState<JobVacancy | null>(null);

  const handleOpenApplication = (job?: JobVacancy) => {
    setSelectedJob(job || null);
    setIsModalOpen(true);
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

            <section className="bg-black text-white p-8 md:p-12 space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                <div>
                  <h3 className="text-2xl font-bold font-serif">Current Vacancies</h3>
                  <p className="text-xs text-gray-400 mt-1">Direct recruitment cycle across our regional offices</p>
                </div>
                <button
                  onClick={() => handleOpenApplication()}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-300 hover:text-white uppercase tracking-wider"
                >
                  <span>Speculative Application</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-4">
                {VACANCIES_LIST.map((job) => (
                  <div
                    key={job.title}
                    onClick={() => handleOpenApplication(job)}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-white/10 hover:border-white/30 bg-white/5 hover:bg-white/10 transition-all group cursor-pointer gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-white group-hover:text-[#990000] transition-colors">
                          {job.title}
                        </h4>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-gray-400">
                        <span className="uppercase tracking-wider text-[10px] text-gray-300">{job.type}</span>
                        {job.department && (
                          <>
                            <span className="text-gray-600">·</span>
                            <span className="text-[11px] text-gray-400">{job.department}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenApplication(job);
                      }}
                      className="text-[10px] font-bold bg-white text-black px-5 py-2.5 uppercase tracking-wider hover:bg-[#990000] hover:text-white transition-colors flex-shrink-0 self-start sm:self-center"
                    >
                      Apply
                    </button>
                  </div>
                ))}
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
