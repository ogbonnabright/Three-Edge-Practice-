
import React from 'react';
import { motion } from 'framer-motion';

const Careers: React.FC = () => {
  return (
    <div className="bg-white min-h-screen p-8 md:p-24 max-w-7xl">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-[#990000] text-xs font-bold tracking-[0.4em] uppercase mb-4">Careers</h2>
        <h1 className="text-5xl font-bold mb-16 text-black">Join the Vanguard of Strategic Law.</h1>

        <div className="grid md:grid-cols-[1fr_400px] gap-24">
          <div className="space-y-12">
            <section className="space-y-6">
              <h3 className="text-3xl font-bold">Why TEP?</h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                At Three Edge Practice, we don't just practice law; we shape strategy. We provide our team members with the platform to work on landmark cases that influence the regulatory and economic landscape of West Africa.
              </p>
              <div className="grid grid-cols-2 gap-8 pt-8">
                <div>
                  <h4 className="text-[#990000] font-bold text-xs uppercase tracking-widest mb-2">Mentorship</h4>
                  <p className="text-sm text-gray-500 italic">Learn from the most seasoned strategic minds in the industry.</p>
                </div>
                <div>
                  <h4 className="text-[#990000] font-bold text-xs uppercase tracking-widest mb-2">Impact</h4>
                  <p className="text-sm text-gray-500 italic">Work on high-stakes matters that redefine industry standards.</p>
                </div>
              </div>
            </section>

            <section className="bg-black text-white p-12 space-y-8">
              <h3 className="text-2xl font-bold">Current Vacancies</h3>
              <div className="space-y-6">
                {[
                  { title: 'Senior Associate (Criminal Defense)', type: 'Lagos' },
                  { title: 'Legal Trainee (2024 Cycle)', type: 'Abuja' },
                  { title: 'Regulatory Compliance Specialist', type: 'Lagos / Remote' }
                ].map((job) => (
                  <div key={job.title} className="flex justify-between items-center border-b border-white/10 pb-4 group cursor-pointer">
                    <div>
                      <h4 className="font-semibold group-hover:text-[#990000] transition-colors">{job.title}</h4>
                      <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">{job.type}</p>
                    </div>
                    <button className="text-[10px] font-bold bg-white text-black px-4 py-2 uppercase hover:bg-[#990000] hover:text-white transition-colors">
                      Apply
                    </button>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <aside className="space-y-12">
            <div className="aspect-square bg-[#990000] p-12 flex flex-col justify-between text-white">
              <h3 className="text-3xl font-serif italic">"We look for candidates who think beyond the statute books."</h3>
              <div>
                <p className="font-bold uppercase tracking-widest text-[10px]">The Recruitment Board</p>
              </div>
            </div>
            
            <div className="border border-gray-100 p-8 space-y-6">
              <h4 className="font-bold text-black uppercase text-xs tracking-widest">Culture at TEP</h4>
              <p className="text-sm text-gray-500 leading-relaxed">
                Our culture is defined by rigorous debate, collaborative problem-solving, and a commitment to professional growth. We value intellectual curiosity and a strategic mindset.
              </p>
              <button className="w-full py-4 border border-black text-xs font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-all">
                Learn More
              </button>
            </div>
          </aside>
        </div>
      </motion.div>
    </div>
  );
};

export default Careers;
