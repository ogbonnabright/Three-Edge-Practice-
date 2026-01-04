
import React from 'react';
import { motion } from 'framer-motion';
import { INSIGHTS } from '../constants';

const Insights: React.FC = () => {
  return (
    <div className="bg-white min-h-screen p-8 md:p-24 max-w-7xl">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-[#990000] text-xs font-bold tracking-[0.4em] uppercase mb-4">Insights</h2>
        <h1 className="text-5xl font-bold mb-16 text-black">Thought Leadership & Regulatory Updates.</h1>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
          {INSIGHTS.map((insight, idx) => (
            <motion.article
              key={insight.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group"
            >
              <div className="aspect-[3/2] bg-gray-100 overflow-hidden mb-8 relative">
                <img 
                  src={insight.image} 
                  alt={insight.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4 bg-[#990000] text-white text-[9px] font-bold tracking-widest uppercase px-3 py-1">
                  {insight.category}
                </div>
              </div>
              
              <div className="space-y-4">
                <p className="text-[10px] font-bold text-gray-400 tracking-[0.2em] uppercase">
                  {insight.date}
                </p>
                <h3 className="text-2xl font-bold text-black group-hover:text-[#990000] transition-colors duration-300">
                  {insight.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed line-clamp-3">
                  {insight.excerpt}
                </p>
                <button className="flex items-center space-x-3 text-[#990000] font-bold text-xs uppercase tracking-widest pt-4 group">
                  <span>Read Article</span>
                  <span className="w-8 h-[1px] bg-[#990000] transition-all duration-300 group-hover:w-12"></span>
                </button>
              </div>
            </motion.article>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Insights;
