
import React from 'react';
import { motion } from 'framer-motion';
import { BIG_WINS } from '../constants';

const BigWins: React.FC = () => {
  return (
    <div className="bg-white min-h-screen p-8 md:p-24 max-w-7xl">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-[#990000] text-xs font-bold tracking-[0.4em] uppercase mb-4">Track Record</h2>
        <h1 className="text-5xl font-bold mb-16 text-black">Landmark Victories.</h1>

        <div className="relative border-l border-gray-100 ml-4 md:ml-0 md:pl-0">
          {BIG_WINS.map((win, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="relative pl-12 pb-24 group"
            >
              {/* Timeline Marker */}
              <div className="absolute left-[-5px] top-0 w-[10px] h-[10px] rounded-full bg-gray-200 border-2 border-white group-hover:bg-[#990000] group-hover:scale-150 transition-all duration-300"></div>
              
              <div className="grid md:grid-cols-[100px_1fr] gap-8">
                <span className="text-2xl font-bold text-gray-300 font-serif italic">{win.year}</span>
                <div className="bg-gray-50 p-10 group-hover:bg-white group-hover:shadow-xl transition-all duration-300 border-l-4 border-transparent group-hover:border-[#990000]">
                  <h3 className="text-2xl font-bold text-black mb-4">{win.title}</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {win.description}
                  </p>
                  <div className="inline-flex items-center space-x-3 text-[#990000] font-bold text-xs uppercase tracking-widest">
                    <span>Result:</span>
                    <span className="text-black">{win.result}</span>
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
