
import React from 'react';
import { motion } from 'framer-motion';
import HeroVideo from '../components/HeroVideo';

const TheFirm: React.FC = () => {
  return (
    <div className="bg-white">
      {/* Cinematic Hero Section */}
      <section className="relative h-[70vh] flex flex-col justify-center px-8 md:px-24 overflow-hidden border-b border-gray-50">
        <HeroVideo />
        
        <div className="relative z-10 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          >
            <h2 className="text-[#990000] text-xs font-bold tracking-[0.5em] uppercase mb-6">The Firm</h2>
            <h1 className="text-5xl md:text-7xl font-bold text-black leading-tight font-serif mb-8">
              A legacy of<br />
              <span className="text-[#990000]">strategic excellence.</span>
            </h1>
            <div className="h-[1px] w-24 bg-black"></div>
          </motion.div>
        </div>

        {/* Floating Detail */}
        <div className="absolute bottom-12 right-12 hidden lg:block">
          <p className="text-[10px] text-gray-400 tracking-[0.3em] uppercase mb-2">Institutional</p>
          <p className="text-xl font-bold font-serif italic text-black">Longevity</p>
        </div>
      </section>

      {/* Main Content */}
      <div className="p-8 md:p-24 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="grid md:grid-cols-2 gap-16 mb-24 items-start">
            <div className="space-y-8">
              <h3 className="text-3xl font-bold text-black font-serif">A Triad of Strengths.</h3>
              <p className="text-lg text-gray-600 leading-relaxed font-light">
                Three Edge Practice (TEP) was founded on the principle that elite legal advocacy requires a triad of strengths: 
                profound intellectual rigor, strategic foresight, and unwavering integrity.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed font-light">
                We operate at the intersection of law, policy, and business, providing our clients with the decisive edge 
                needed to navigate complex regulatory and institutional challenges in Nigeria and beyond.
              </p>
            </div>

            <div className="bg-gray-50 p-12 space-y-12 shadow-sm border border-gray-100">
              <div>
                <h3 className="text-[#990000] text-xs font-bold tracking-widest uppercase mb-4">Our Vision</h3>
                <p className="text-2xl font-serif text-black italic leading-snug">
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
              <div className="grid md:grid-cols-2 gap-16 items-center">
                <div className="order-2 md:order-1">
                  <h3 className="text-3xl font-bold text-black mb-6 font-serif">Environmental and Social Governance (ESG) Advisory</h3>
                  <p className="text-gray-600 leading-relaxed mb-8 font-light">
                    In an evolving global economy, sustainability is no longer optional. We provide comprehensive advisory on Environmental and Social Governance, helping corporations align their operations with international standards while mitigating reputational and regulatory risks, with a primary focus on the energy and extractive industries.
                  </p>
                  <ul className="space-y-3">
                    {['Sustainability Reporting', 'Stakeholder Engagement', 'Regulatory Compliance'].map(item => (
                      <li key={item} className="flex items-center text-[10px] font-bold text-black uppercase tracking-widest">
                        <span className="w-4 h-[1px] bg-[#990000] mr-3"></span> {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="order-1 md:order-2 aspect-[4/3] bg-gray-100 overflow-hidden shadow-xl">
                  <img 
                    src="https://images.unsplash.com/photo-1444312645910-ffa973656eba?q=80&w=800&auto=format&fit=crop" 
                    alt="Oil and Gas Exploration - ESG Context" 
                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" 
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-16 items-center">
                <div className="aspect-[4/3] bg-gray-100 overflow-hidden shadow-xl">
                  <img 
                    src="https://images.unsplash.com/photo-1505664194779-8beaceb93744?q=80&w=800&auto=format&fit=crop" 
                    alt="White Collar Defense" 
                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" 
                  />
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-black mb-6 font-serif">Corporate and White Collar Crime Defense</h3>
                  <p className="text-gray-600 leading-relaxed mb-8 font-light">
                    Protecting corporate integrity requires a formidable defense. Our team specializes in high-stakes regulatory investigations and corporate crime defense, providing sophisticated counsel to navigate through legal complexities with precision.
                  </p>
                  <ul className="space-y-3">
                    {['Internal Investigations', 'Anti-Corruption Compliance', 'Enforcement Defense'].map(item => (
                      <li key={item} className="flex items-center text-[10px] font-bold text-black uppercase tracking-widest">
                        <span className="w-4 h-[1px] bg-[#990000] mr-3"></span> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="border-l-4 border-[#990000] p-8 bg-white shadow-sm hover:shadow-md transition-shadow">
              <h4 className="text-4xl font-bold mb-2 text-black">15+</h4>
              <p className="text-gray-400 uppercase text-[9px] font-bold tracking-[0.2em]">Years of Practice</p>
            </div>
            <div className="border-l-4 border-[#990000] p-8 bg-white shadow-sm hover:shadow-md transition-shadow">
              <h4 className="text-4xl font-bold mb-2 text-black">120+</h4>
              <p className="text-gray-400 uppercase text-[9px] font-bold tracking-[0.2em]">Strategic Wins</p>
            </div>
            <div className="border-l-4 border-[#990000] p-8 bg-white shadow-sm hover:shadow-md transition-shadow">
              <h4 className="text-4xl font-bold mb-2 text-black">30+</h4>
              <p className="text-gray-400 uppercase text-[9px] font-bold tracking-[0.2em]">Expert Attorneys</p>
            </div>
            <div className="border-l-4 border-[#990000] p-8 bg-white shadow-sm hover:shadow-md transition-shadow">
              <h4 className="text-4xl font-bold mb-2 text-[#990000]">4</h4>
              <p className="text-gray-400 uppercase text-[9px] font-bold tracking-[0.2em]">Regional Offices</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TheFirm;
