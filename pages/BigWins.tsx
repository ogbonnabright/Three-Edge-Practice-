import React from 'react';
import { motion } from 'framer-motion';
import { Info, ShieldCheck } from 'lucide-react';
import { BIG_WINS } from '../constants';

const BigWins: React.FC = () => {
  return (
    <div className="bg-white min-h-screen p-8 md:p-24 max-w-7xl">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-[#990000] text-xs font-bold tracking-[0.4em] uppercase mb-4">
          Representative Matters
        </h2>
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-black font-serif">
          Representative Engagements.
        </h1>
        <p className="text-gray-600 max-w-3xl text-sm sm:text-base leading-relaxed mb-10 font-light">
          An indicative overview of select strategic advocacy, corporate advisory, and complex regulatory engagements
          handled across our regional chambers (2024 – Present).
        </p>

        {/* Professional Ethics & Regulatory Compliance Notice */}
        <div className="bg-gray-50 border-l-2 border-[#990000] p-4 sm:p-5 mb-16 text-xs text-gray-500 leading-relaxed space-y-1">
          <p className="font-bold text-black uppercase tracking-wider text-[11px] flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-[#990000]" />
            <span>Professional Conduct & Regulatory Disclosure</span>
          </p>
          <p>
            In accordance with legal ethics, professional conduct standards, and strict client confidentiality, the matters
            summarized below represent anonymized factual descriptions of selected institutional engagements and do not
            constitute a guarantee, warranty, or prediction regarding the outcome of any prospective legal mandate. Prior
            results do not guarantee similar outcomes.
          </p>
        </div>

        <div className="relative border-l border-gray-100 ml-4 md:ml-0 md:pl-0">
          {BIG_WINS.map((win, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="relative pl-12 pb-20 group"
            >
              {/* Timeline Marker */}
              <div className="absolute left-[-5px] top-0 w-[10px] h-[10px] rounded-full bg-gray-200 border-2 border-white group-hover:bg-[#990000] group-hover:scale-150 transition-all duration-300"></div>
              
              <div className="grid md:grid-cols-[100px_1fr] gap-8">
                <span className="text-2xl font-bold text-gray-400 font-serif italic">{win.year}</span>
                <div className="bg-gray-50 p-8 sm:p-10 group-hover:bg-white group-hover:shadow-lg transition-all duration-300 border border-gray-100 group-hover:border-gray-200">
                  <h3 className="text-xl sm:text-2xl font-bold text-black font-serif mb-3">{win.title}</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed text-sm font-light">
                    {win.description}
                  </p>
                  <div className="pt-4 border-t border-gray-200/60 flex flex-wrap items-center gap-2 text-xs">
                    <span className="text-gray-400 uppercase tracking-wider font-semibold text-[11px]">Matter Resolution:</span>
                    <span className="text-gray-800 font-medium">{win.result}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default BigWins;
