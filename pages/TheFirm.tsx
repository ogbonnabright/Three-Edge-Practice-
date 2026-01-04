
import React from 'react';
import { motion } from 'framer-motion';

const TheFirm: React.FC = () => {
  return (
    <div className="bg-white">
      <div className="p-8 md:p-24 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-[#990000] text-xs font-bold tracking-[0.4em] uppercase mb-4">The Firm</h2>
          <h1 className="text-5xl font-bold mb-16 text-black">A legacy of strategic excellence.</h1>

          <div className="grid md:grid-cols-2 gap-16 mb-24">
            <div className="space-y-8">
              <p className="text-lg text-gray-600 leading-relaxed">
                Three Edge Practice (TEP) was founded on the principle that elite legal advocacy requires a triad of strengths: 
                profound intellectual rigor, strategic foresight, and unwavering integrity.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                We operate at the intersection of law, policy, and business, providing our clients with the decisive edge 
                needed to navigate complex regulatory and institutional challenges in Nigeria and beyond.
              </p>
            </div>

            <div className="bg-gray-50 p-12 space-y-12">
              <div>
                <h3 className="text-[#990000] text-xs font-bold tracking-widest uppercase mb-4">Our Vision</h3>
                <p className="text-2xl font-serif text-black italic">
                  "To be the foremost strategic partner for global entities navigating the African legal landscape."
                </p>
              </div>
              <div>
                <h3 className="text-[#990000] text-xs font-bold tracking-widest uppercase mb-4">Our Core Values</h3>
                <ul className="space-y-4">
                  {['Strategic Precision', 'Absolute Integrity', 'Relentless Excellence', 'Client Centricity'].map((value) => (
                    <li key={value} className="flex items-center space-x-3">
                      <div className="w-1.5 h-1.5 bg-[#990000]"></div>
                      <span className="text-black font-semibold text-lg">{value}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="mb-24">
            <h2 className="text-[#990000] text-xs font-bold tracking-[0.4em] uppercase mb-12">Strategic Specializations</h2>
            <div className="space-y-24">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="order-2 md:order-1">
                  <h3 className="text-3xl font-bold text-black mb-6">Environmental and Social Governance (ESG) Advisory</h3>
                  <p className="text-gray-600 leading-relaxed mb-6">
                    In an evolving global economy, sustainability is no longer optional. We provide comprehensive advisory on Environmental and Social Governance, helping corporations align their operations with international standards while mitigating reputational and regulatory risks, with a primary focus on the energy and extractive industries.
                  </p>
                  <ul className="space-y-3">
                    {['Sustainability Reporting', 'Stakeholder Engagement', 'Regulatory Compliance'].map(item => (
                      <li key={item} className="flex items-center text-sm font-bold text-black uppercase tracking-widest">
                        <span className="w-4 h-[1px] bg-[#990000] mr-3"></span> {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="order-1 md:order-2 aspect-[4/3] bg-gray-100 overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1444312645910-ffa973656eba?q=80&w=800&auto=format&fit=crop" 
                    alt="Oil and Gas Exploration - ESG Context" 
                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" 
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="aspect-[4/3] bg-gray-100 overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1505664194779-8beaceb93744?q=80&w=800&auto=format&fit=crop" 
                    alt="White Collar Defense" 
                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" 
                  />
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-black mb-6">Corporate and White Collar Crime Defense</h3>
                  <p className="text-gray-600 leading-relaxed mb-6">
                    Protecting corporate integrity requires a formidable defense. Our team specializes in high-stakes regulatory investigations and corporate crime defense, providing sophisticated counsel to navigate through legal complexities with precision.
                  </p>
                  <ul className="space-y-3">
                    {['Internal Investigations', 'Anti-Corruption Compliance', 'Enforcement Defense'].map(item => (
                      <li key={item} className="flex items-center text-sm font-bold text-black uppercase tracking-widest">
                        <span className="w-4 h-[1px] bg-[#990000] mr-3"></span> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="border-l-4 border-[#990000] p-8 bg-white shadow-sm">
              <h4 className="text-4xl font-bold mb-2">15+</h4>
              <p className="text-gray-500 uppercase text-[10px] tracking-widest">Years of Practice</p>
            </div>
            <div className="border-l-4 border-[#990000] p-8 bg-white shadow-sm">
              <h4 className="text-4xl font-bold mb-2">500+</h4>
              <p className="text-gray-500 uppercase text-[10px] tracking-widest">Strategic Wins</p>
            </div>
            <div className="border-l-4 border-[#990000] p-8 bg-white shadow-sm">
              <h4 className="text-4xl font-bold mb-2">30+</h4>
              <p className="text-gray-500 uppercase text-[10px] tracking-widest">Expert Attorneys</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TheFirm;
