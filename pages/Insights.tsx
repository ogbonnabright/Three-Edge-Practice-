import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { INSIGHTS } from '../constants';
import { Insight } from '../types';

const Insights: React.FC = () => {
  const [selectedInsight, setSelectedInsight] = useState<Insight | null>(null);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const navigate = useNavigate();

  const handleShareOption = (option: 'email' | 'twitter' | 'linkedin' | 'download') => {
    if (!selectedInsight) return;
    const url = window.location.href;
    const text = `Read the latest legal analysis from Three Edge Practice: ${selectedInsight.title}`;

    switch (option) {
      case 'email':
        window.location.href = `mailto:?subject=${encodeURIComponent(selectedInsight.title)}&body=${encodeURIComponent(text + '\n\n' + url)}`;
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'download':
        window.print();
        break;
    }
    setShowShareMenu(false);
  };

  const handleContactPartner = () => {
    if (selectedInsight?.author) {
      navigate(`/team?member=${encodeURIComponent(selectedInsight.author)}`);
    } else {
      navigate('/team');
    }
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="p-8 md:p-24 max-w-7xl mx-auto">
        <AnimatePresence mode="wait">
          {!selectedInsight ? (
            <motion.div
              key="grid-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-[#990000] text-xs font-bold tracking-[0.4em] uppercase mb-4">Insights</h2>
              <h1 className="text-5xl font-bold mb-16 text-black font-serif">Thought Leadership & Regulatory Updates.</h1>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
                {INSIGHTS.map((insight, idx) => (
                  <motion.article
                    key={insight.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="group flex flex-col h-full"
                  >
                    <div className="aspect-[3/2] bg-gray-100 overflow-hidden mb-8 relative">
                      <img 
                        src={insight.image} 
                        alt={insight.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter grayscale group-hover:grayscale-0"
                      />
                      <div className="absolute top-4 left-4 bg-[#990000] text-white text-[9px] font-bold tracking-widest uppercase px-3 py-1">
                        {insight.category}
                      </div>
                    </div>
                    
                    <div className="space-y-4 flex-grow flex flex-col">
                      <p className="text-[10px] font-bold text-gray-400 tracking-[0.2em] uppercase">
                        {insight.date}
                      </p>
                      <h3 className="text-2xl font-bold text-black group-hover:text-[#990000] transition-colors duration-300 font-serif line-clamp-2">
                        {insight.title}
                      </h3>
                      <p className="text-gray-500 text-sm leading-relaxed line-clamp-3 mb-6">
                        {insight.excerpt}
                      </p>
                      <div className="mt-auto">
                        <button 
                          onClick={() => setSelectedInsight(insight)}
                          className="flex items-center space-x-3 text-[#990000] font-bold text-xs uppercase tracking-widest pt-4 group/btn"
                        >
                          <span>Read Full Analysis</span>
                          <span className="w-8 h-[1px] bg-[#990000] transition-all duration-300 group-hover/btn:w-16"></span>
                        </button>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="article-view"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5 }}
              className="max-w-4xl mx-auto"
            >
              <button 
                onClick={() => setSelectedInsight(null)}
                className="flex items-center space-x-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest hover:text-[#990000] transition-colors mb-12 print:hidden"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span>Back to Insights</span>
              </button>

              <div className="space-y-12">
                <header className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <span className="px-3 py-1 bg-[#990000] text-white text-[9px] font-bold tracking-widest uppercase">
                      {selectedInsight.category}
                    </span>
                    <span className="text-gray-400 text-[10px] font-bold tracking-[0.2em] uppercase">
                      {selectedInsight.date}
                    </span>
                  </div>
                  <h1 className="text-4xl md:text-6xl font-bold text-black font-serif leading-tight">
                    {selectedInsight.title}
                  </h1>
                  <div className="h-1 w-24 bg-[#990000]"></div>
                </header>

                <div className="aspect-[21/9] w-full bg-gray-100 overflow-hidden shadow-2xl print:hidden">
                  <img 
                    src={selectedInsight.image} 
                    alt={selectedInsight.title} 
                    className="w-full h-full object-cover filter grayscale"
                  />
                </div>

                <div className="prose prose-lg max-w-none">
                  {selectedInsight.content.split('\n\n').map((para, i) => (
                    <p key={i} className="text-gray-600 text-lg md:text-xl leading-relaxed font-light mb-8 whitespace-pre-line">
                      {para}
                    </p>
                  ))}
                </div>

                <div className="border-t border-gray-100 pt-12 mt-12 flex flex-col md:flex-row md:items-center justify-between gap-8 print:hidden relative">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden border-2 border-[#990000]">
                      <img src="https://picsum.photos/seed/tep_author/100/100" alt="Author" className="grayscale" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-black uppercase tracking-widest">{selectedInsight.author || 'TEP Editorial Board'}</p>
                      <p className="text-[10px] text-gray-400 uppercase tracking-widest">Partner, Regulatory Affairs</p>
                    </div>
                  </div>

                  <div className="flex space-x-4 relative">
                    <div className="relative">
                      <button 
                        onClick={() => setShowShareMenu(!showShareMenu)}
                        className="px-6 py-3 border border-gray-200 text-[10px] font-bold uppercase tracking-widest hover:border-[#990000] hover:text-[#990000] transition-all"
                      >
                        Share Insights
                      </button>
                      
                      <AnimatePresence>
                        {showShareMenu && (
                          <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="absolute bottom-full right-0 mb-4 bg-white border border-gray-100 shadow-2xl p-4 min-w-[200px] z-50 flex flex-col space-y-2"
                          >
                            <button onClick={() => handleShareOption('email')} className="text-left px-4 py-2 text-[10px] font-bold uppercase tracking-widest hover:bg-gray-50 hover:text-[#990000] transition-colors">Email Analysis</button>
                            <button onClick={() => handleShareOption('twitter')} className="text-left px-4 py-2 text-[10px] font-bold uppercase tracking-widest hover:bg-gray-50 hover:text-[#990000] transition-colors">Twitter (X)</button>
                            <button onClick={() => handleShareOption('linkedin')} className="text-left px-4 py-2 text-[10px] font-bold uppercase tracking-widest hover:bg-gray-50 hover:text-[#990000] transition-colors">LinkedIn</button>
                            <div className="h-[1px] bg-gray-100 my-1"></div>
                            <button onClick={() => handleShareOption('download')} className="text-left px-4 py-2 text-[10px] font-bold uppercase tracking-widest hover:bg-gray-50 hover:text-[#990000] transition-colors flex justify-between items-center">
                              <span>Download PDF</span>
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    <button 
                      onClick={handleContactPartner}
                      className="px-6 py-3 bg-black text-white text-[10px] font-bold uppercase tracking-widest hover:bg-[#990000] transition-all"
                    >
                      Contact Partner
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Insights;