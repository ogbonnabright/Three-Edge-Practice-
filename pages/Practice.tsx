import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
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
                        <svg className="w-8 h-8 text-[#990000]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </div>
                    
                    <span className="text-4xl font-serif italic text-[#990000]/20 mb-8 block">0{idx + 1}</span>
                    <h3 className="text-2xl font-bold mb-6 text-black group-hover:text-[#990000] transition-colors duration-300">
                      {area.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed mb-6">
                      {area.description}
                    </p>
                    <div className="text-[10px] font-bold text-[#990000] tracking-widest uppercase mt-4">
                      Explore Practice →
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
                className="flex items-center space-x-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest hover:text-[#990000] transition-colors mb-8"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
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
                        <svg className="w-4 h-4 text-gray-300 group-hover/item:text-[#990000]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
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
            className="bg-black text-white px-12 py-5 font-bold tracking-widest uppercase text-xs hover:bg-[#990000] transition-colors duration-500 shadow-xl"
          >
            Engage Our Experts
          </button>
        </motion.div>
      </section>

      {/* Focus Area Detail Modal */}
      <AnimatePresence>
        {selectedSub && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white w-full max-w-3xl relative shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
            >
              {/* Close Button */}
              <button 
                onClick={() => setSelectedSub(null)}
                className="absolute top-6 right-6 z-10 text-gray-400 hover:text-black transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Sidebar Decoration */}
              <div className="hidden md:block w-24 bg-[#990000] flex-shrink-0"></div>

              {/* Content */}
              <div className="p-12 flex-1 overflow-y-auto">
                <h4 className="text-[#990000] text-[10px] font-bold tracking-[0.4em] uppercase mb-2">Focus Area</h4>
                <h3 className="text-3xl font-bold text-black mb-8 leading-tight">{selectedSub.title}</h3>
                
                <div className="h-[1px] w-full bg-gray-100 mb-8"></div>
                
                <p className="text-gray-600 text-lg leading-relaxed mb-12">
                  {selectedSub.details}
                </p>

                {/* Contact Staff Section */}
                <div className="bg-gray-50 p-8 border-l-4 border-[#990000]">
                  <h5 className="text-[10px] font-bold tracking-widest text-[#990000] uppercase mb-6">Expert Contact Staff</h5>
                  <div className="space-y-6">
                    {selectedSub.staff?.map((s) => (
                      <div key={s.email} className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-gray-200 pb-4 last:border-0 last:pb-0">
                        <div>
                          <p className="text-black font-bold uppercase tracking-wider text-sm">{s.name}</p>
                          <p className="text-gray-400 text-xs mt-1 uppercase tracking-widest">{s.role}</p>
                        </div>
                        <a 
                          href={`mailto:${s.email}`} 
                          className="text-[#990000] font-bold text-xs uppercase tracking-widest mt-2 md:mt-0 hover:underline"
                        >
                          {s.email}
                        </a>
                      </div>
                    ))}
                    {!selectedSub.staff?.length && (
                      <p className="text-gray-400 text-xs italic">Staff information pending regulatory update.</p>
                    )}
                  </div>
                </div>

                <div className="mt-12">
                  <button 
                    onClick={() => setSelectedSub(null)}
                    className="px-8 py-4 bg-black text-white text-[10px] font-bold uppercase tracking-widest hover:bg-[#990000] transition-colors"
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