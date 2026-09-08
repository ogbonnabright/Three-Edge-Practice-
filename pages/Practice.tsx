import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft, ChevronRight, X, Mail } from 'lucide-react';
import { PRACTICE_AREAS } from '../constants';
import { SubPractice, PracticeArea } from '../types';

const Practice: React.FC = () => {
  const [selectedPractice, setSelectedPractice] = useState<PracticeArea | null>(null);
  const [selectedSub, setSelectedSub] = useState<SubPractice | null>(null);
  const navigate = useNavigate();

  // Scroll to top when switching between main practice view and detail view
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [selectedPractice]);

  const handleConsultAttorney = (attorneyName: string) => {
    setSelectedSub(null);
    const params = new URLSearchParams();
    params.set('attorney', attorneyName);
    if (selectedPractice?.title) {
      params.set('practice', selectedPractice.title);
    }
    if (selectedSub?.title) {
      params.set('matter', selectedSub.title);
    }
    navigate(`/contact?${params.toString()}#consultation-form`);
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="p-8 md:p-24 max-w-7xl mx-auto">
        <AnimatePresence mode="wait">
          {!selectedPractice ? (
            <motion.div
              key="grid-view"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <div className="mb-16">
                <h2 className="text-[#990000] text-xs font-bold tracking-[0.4em] uppercase mb-4">Expertise</h2>
                <h1 className="text-5xl font-bold text-black leading-tight">Decisive Expertise Across Key Sectors.</h1>
              </div>

              <div className="grid lg:grid-cols-3 gap-8">
                {PRACTICE_AREAS.map((area, idx) => (
                  <motion.div
                    key={area.id}
                    onClick={() => setSelectedPractice(area)}
                    className="group relative cursor-pointer border border-gray-100 p-10 hover:border-[#990000] transition-all duration-500 bg-white hover:shadow-2xl overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-100 transition-opacity">
                      <ArrowRight className="w-8 h-8 text-[#990000]" />
                    </div>
                    
                    <span className="text-4xl font-serif italic text-[#990000]/20 mb-8 block">0{idx + 1}</span>
                    <h3 className="text-2xl font-bold mb-6 text-black group-hover:text-[#990000] transition-colors duration-300 leading-snug break-words">
                      {area.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed mb-6">
                      {area.description}
                    </p>
                    <div className="text-[10px] font-bold text-[#990000] tracking-widest uppercase mt-4 flex items-center gap-1">
                      <span>Explore Practice</span>
                      <ArrowRight className="w-3 h-3" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="detail-view"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5 }}
              className="space-y-12"
            >
              <button 
                onClick={() => setSelectedPractice(null)}
                className="flex items-center space-x-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest hover:text-[#990000] transition-colors mb-8 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to All Practices</span>
              </button>

              <div className="grid lg:grid-cols-2 gap-20">
                <div>
                  <h2 className="text-[#990000] text-xs font-bold tracking-[0.4em] uppercase mb-4">Practice Detail</h2>
                  <h1 className="text-5xl font-bold text-black leading-tight mb-8">{selectedPractice.title}</h1>
                  <p className="text-gray-600 text-lg leading-relaxed mb-12">
                    {selectedPractice.fullDescription}
                  </p>
                </div>

                <div className="bg-gray-50 p-12">
                  <h3 className="text-[10px] font-bold tracking-widest text-[#990000] uppercase mb-10 border-b border-gray-200 pb-4">
                    Focused Strategic Areas
                  </h3>
                  <div className="space-y-6">
                    {selectedPractice.subPractices.map((sub) => (
                      <motion.div
                        key={sub.title}
                        whileHover={{ x: 10 }}
                        onClick={() => setSelectedSub(sub)}
                        className="group/item flex items-center justify-between p-6 bg-white border border-gray-100 cursor-pointer hover:border-[#990000] hover:shadow-lg transition-all"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-2 h-2 bg-[#990000]"></div>
                          <span className="text-sm font-bold text-black uppercase tracking-wider">{sub.title}</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-300 group-hover/item:text-[#990000] transition-colors" />
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Engage Our Experts CTA Section */}
      <section className="py-24 px-8 text-center bg-white border-t border-gray-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h3 className="text-4xl md:text-5xl font-bold text-black mb-12 font-serif">Ready for Strategic Advocacy?</h3>
          <button 
            onClick={() => navigate('/contact')}
            className="bg-black text-white px-12 py-5 font-bold tracking-widest uppercase text-xs hover:bg-[#990000] transition-colors duration-500 shadow-xl cursor-pointer"
          >
            Engage Our Experts
          </button>
        </motion.div>
      </section>

      {/* Focus Area Detail Modal */}
      <AnimatePresence>
        {selectedSub && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white w-full max-w-3xl relative shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
            >
              {/* Close Button */}
              <button 
                onClick={() => setSelectedSub(null)}
                className="absolute top-6 right-6 z-10 text-gray-400 hover:text-black transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Sidebar Decoration */}
              <div className="hidden md:block w-20 bg-[#990000] flex-shrink-0"></div>

              {/* Content */}
              <div className="p-8 sm:p-12 flex-1 overflow-y-auto">
                <h4 className="text-[#990000] text-[10px] font-bold tracking-[0.4em] uppercase mb-2">Focus Area</h4>
                <h3 className="text-2xl sm:text-3xl font-bold text-black mb-6 leading-tight">{selectedSub.title}</h3>
                
                <div className="h-[1px] w-full bg-gray-100 mb-6"></div>
                
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-8 font-light">
                  {selectedSub.details}
                </p>

                {/* Contact Staff Section with Consult Attorney button */}
                <div className="bg-gray-50 p-6 sm:p-8 border-l-4 border-[#990000]">
                  <div className="flex items-center justify-between mb-6 pb-2 border-b border-gray-200">
                    <h5 className="text-[10px] font-bold tracking-widest text-[#990000] uppercase">
                      Designated Attorneys & Strategic Leads
                    </h5>
                    <span className="text-[9px] font-mono tracking-widest text-gray-400 uppercase hidden sm:inline">
                      Direct Counsel
                    </span>
                  </div>

                  <div className="space-y-4">
                    {selectedSub.staff?.map((s) => (
                      <div 
                        key={s.email} 
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-white border border-gray-200/80 shadow-xs hover:border-[#990000]/40 transition-all"
                      >
                        <div className="min-w-0 flex-1 space-y-1">
                          <p className="text-black font-bold uppercase tracking-wider text-sm">{s.name}</p>
                          <p className="text-gray-400 text-xs uppercase tracking-widest">{s.role}</p>
                          <a 
                            href={`mailto:${s.email}`} 
                            className="text-[#990000] hover:text-black font-semibold text-xs tracking-wider inline-flex items-center gap-1.5 pt-0.5 transition-colors"
                            title={`Email ${s.name}`}
                          >
                            <Mail className="w-3 h-3 text-[#990000]" />
                            <span>{s.email}</span>
                          </a>
                        </div>

                        {/* Small button beside the attorney */}
                        <div className="flex items-center self-start sm:self-center flex-shrink-0">
                          <button
                            type="button"
                            onClick={() => handleConsultAttorney(s.name)}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#990000] text-white text-[10px] font-bold uppercase tracking-wider hover:bg-black active:scale-95 transition-all duration-200 shadow-xs group/btn cursor-pointer whitespace-nowrap"
                            title={`Consult with ${s.name}`}
                          >
                            <span>Consult Attorney</span>
                            <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-0.5 transition-transform" />
                          </button>
                        </div>
                      </div>
                    ))}
                    {!selectedSub.staff?.length && (
                      <p className="text-gray-400 text-xs italic">Staff information pending regulatory update.</p>
                    )}
                  </div>
                </div>

                <div className="mt-8 flex items-center justify-between">
                  <button 
                    onClick={() => setSelectedSub(null)}
                    className="px-6 py-3 border border-black bg-white text-black text-[10px] font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-colors cursor-pointer"
                  >
                    Close Detail
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Practice;