import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { TEAM } from '../constants';

const Team: React.FC = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const memberToHighlight = query.get('member');
  const teamRefs = useRef<{[key: string]: HTMLDivElement | null}>({});

  useEffect(() => {
    if (memberToHighlight && teamRefs.current[memberToHighlight]) {
      teamRefs.current[memberToHighlight]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [memberToHighlight]);

  return (
    <div className="bg-white min-h-screen p-8 md:p-24 max-w-7xl">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-[#990000] text-xs font-bold tracking-[0.4em] uppercase mb-4">Our People</h2>
        <h1 className="text-5xl font-bold mb-16 text-black font-serif">The Minds Behind the Advocacy.</h1>

        <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-x-12 gap-y-24">
          {TEAM.map((member, idx) => {
            const isHighlighted = memberToHighlight === member.name;
            return (
              <motion.div
                key={member.name}
                // Fix: ref callback should return void to satisfy TypeScript's Ref type requirements
                ref={(el) => { teamRefs.current[member.name] = el; }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className={`flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-8 items-start p-6 transition-all duration-700 ${isHighlighted ? 'ring-2 ring-[#990000] bg-gray-50' : ''}`}
              >
                <div className="w-full md:w-64 h-80 bg-gray-100 flex-shrink-0 relative group overflow-hidden">
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="w-full h-full object-cover filter grayscale hover:grayscale-0 transition-all duration-700"
                  />
                  <div className="absolute inset-0 border-8 border-transparent group-hover:border-[#990000]/10 transition-all duration-700"></div>
                </div>
                
                <div className="flex-1 py-4">
                  <h3 className="text-3xl font-bold text-black mb-2 font-serif">{member.name}</h3>
                  <p className="text-[#990000] text-xs font-bold tracking-widest uppercase mb-6">{member.role}</p>
                  <div className="w-12 h-1 bg-[#990000] mb-6"></div>
                  <p className="text-gray-500 leading-relaxed text-sm italic">
                    "{member.bio}"
                  </p>
                  
                  <div className="mt-8 flex space-x-6">
                    <button className="text-[10px] font-bold tracking-widest text-black border-b border-black hover:text-[#990000] hover:border-[#990000] transition-colors duration-300 uppercase pb-1">
                      View Full Bio
                    </button>
                    <a href={`mailto:partner@tep.com.ng`} className="text-[10px] font-bold tracking-widest text-[#990000] border-b border-[#990000] hover:text-black hover:border-black transition-colors duration-300 uppercase pb-1">
                      Connect via Email
                    </a>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};

export default Team;