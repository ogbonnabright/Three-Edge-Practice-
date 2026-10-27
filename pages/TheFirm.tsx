import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import HeroVideo from '../components/HeroVideo';

const TheFirm: React.FC = () => {
  const navigate = useNavigate();

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
              A standard of<br />
              <span className="text-[#990000]">strategic excellence.</span>
            </h1>
            <div className="h-[1px] w-24 bg-black"></div>
          </motion.div>
        </div>

        {/* Floating Detail */}
        <div className="absolute bottom-12 right-12 hidden lg:block">
          <p className="text-[10px] text-gray-400 tracking-[0.3em] uppercase mb-2">Institutional</p>
          <p className="text-xl font-bold font-serif italic text-black">Precision</p>
        </div>
      </section>

      {/* The Firm Overview Section (Moved from landing page) */}
      <section className="py-24 px-8 md:px-24 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-[#990000] text-xs font-bold tracking-[0.4em] uppercase mb-6">The Firm</h2>
            <h3 className="text-4xl md:text-5xl font-bold text-black mb-8 leading-tight font-serif">
              A Triad of Intellectual Rigor, Strategy, and Integrity.
            </h3>
            <p className="text-gray-600 text-lg leading-relaxed mb-8">
              Three Edge Practice (TEP) stands at the pinnacle of the Nigerian legal landscape, providing sophisticated advocacy for global entities. We navigate the complexities of modern regulation with a relentless focus on our clients' commercial and reputational objectives.
            </p>
            <button 
              onClick={() => navigate('/practice')}
              className="text-xs font-bold uppercase tracking-widest border-b-2 border-[#990000] pb-2 hover:text-[#990000] transition-colors"
            >
              Explore Practice Areas →
            </button>
          </motion.div>
          <div className="relative group">
            <div className="aspect-[4/5] bg-gray-100 overflow-hidden shadow-2xl transition-transform duration-700 group-hover:scale-[1.02]">
              <img src="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=800&auto=format&fit=crop" alt="TEP Office" className="w-full h-full object-cover filter grayscale" />
            </div>
            <div className="absolute -bottom-8 -left-8 bg-[#990000] p-12 hidden md:block shadow-2xl">
              <p className="text-white text-4xl font-serif italic">"Precision in every move."</p>
            </div>
          </div>
        </div>
      </section>

      {/* Institutional Triad, Vision, Core Values & Metrics */}
      <section className="py-24 bg-gray-50 border-t border-b border-gray-100 px-8 md:px-24">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="grid md:grid-cols-2 gap-16 mb-20 items-start">
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

              <div className="bg-white p-10 md:p-12 space-y-10 shadow-sm border border-gray-200">
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

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="border-l-4 border-[#990000] p-8 bg-white shadow-sm hover:shadow-md transition-shadow">
                <h4 className="text-4xl font-bold mb-2 text-black">100%</h4>
                <p className="text-gray-400 uppercase text-[9px] font-bold tracking-[0.2em]">Partner-Led Advisory</p>
              </div>
              <div className="border-l-4 border-[#990000] p-8 bg-white shadow-sm hover:shadow-md transition-shadow">
                <h4 className="text-4xl font-bold mb-2 text-black">50+</h4>
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
      </section>

      {/* Strategic Focus Section (Moved from landing page) */}
      <section className="py-24 bg-white px-8 md:px-24">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <h2 className="text-[#990000] text-xs font-bold tracking-[0.4em] uppercase mb-4">Strategic Focus</h2>
            <h3 className="text-4xl font-bold text-black font-serif">Core Pillars of Excellence.</h3>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* AML/CFT */}
            <motion.div 
              whileHover={{ y: -10 }}
              className="bg-white p-8 md:p-10 border border-gray-100 shadow-sm transition-all duration-300 border-t-4 border-t-[#990000] flex flex-col justify-between"
            >
              <div>
                <h4 className="text-xl md:text-2xl font-bold mb-6 text-black font-serif leading-snug break-words">AML/CFT Compliance Advisory</h4>
                <p className="text-gray-500 text-sm leading-relaxed mb-8">
                  In an era of heightened scrutiny, we provide sophisticated anti-money laundering and counter-terrorism financing strategies that ensure institutional resilience.
                </p>
              </div>
              <ul className="space-y-3">
                <li className="flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-black/40">
                  <div className="w-1 h-1 bg-[#990000]"></div>
                  <span>Regulatory Audits</span>
                </li>
                <li className="flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-black/40">
                  <div className="w-1 h-1 bg-[#990000]"></div>
                  <span>Framework Design</span>
                </li>
              </ul>
            </motion.div>

            {/* Data Protection */}
            <motion.div 
              whileHover={{ y: -10 }}
              className="bg-white p-8 md:p-10 border border-gray-100 shadow-sm transition-all duration-300 border-t-4 border-t-[#990000] flex flex-col justify-between"
            >
              <div>
                <h4 className="text-xl md:text-2xl font-bold mb-6 text-black font-serif leading-snug break-words">Data Protection</h4>
                <p className="text-gray-500 text-sm leading-relaxed mb-8">
                  Safeguarding digital assets and ensuring compliance with the Nigeria Data Protection Act (NDPA) 2023, GAID 2025, and GDPR. We architect legal frameworks that protect both consumer privacy and corporate data integrity.
                </p>
              </div>
              <ul className="space-y-3">
                <li className="flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-black/40">
                  <div className="w-1 h-1 bg-[#990000]"></div>
                  <span>Audit & Gap Analysis</span>
                </li>
                <li className="flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-black/40">
                  <div className="w-1 h-1 bg-[#990000]"></div>
                  <span>Data Breach Response</span>
                </li>
              </ul>
            </motion.div>

            {/* General Corporate/Commercial */}
            <motion.div 
              whileHover={{ y: -10 }}
              className="bg-white p-8 md:p-10 border border-gray-100 shadow-sm transition-all duration-300 border-t-4 border-t-[#990000] flex flex-col justify-between"
            >
              <div>
                <h4 className="text-xl md:text-2xl font-bold mb-6 text-black font-serif leading-snug break-words">General Corporate / Commercial Legal Support</h4>
                <p className="text-gray-500 text-sm leading-relaxed mb-8">
                  End-to-end legal support for foundational business operations, from Tax and Startup advisory to sector-specific requirements in Real Estate and Energy.
                </p>
              </div>
              <ul className="space-y-3">
                <li className="flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-black/40">
                  <div className="w-1 h-1 bg-[#990000]"></div>
                  <span>Tax & Startup Advisory</span>
                </li>
                <li className="flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-black/40">
                  <div className="w-1 h-1 bg-[#990000]"></div>
                  <span>Construction & Energy</span>
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Strategic Specializations */}
      <section className="py-24 bg-gray-50 border-t border-b border-gray-100 px-8 md:px-24">
        <div className="max-w-7xl mx-auto">
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
      </section>

      {/* Regulatory Vigilance Section (Moved from landing page) */}
      <section className="py-24 px-8 md:px-24 bg-white">
        <div className="max-w-7xl mx-auto border-l-4 border-[#990000] pl-12 md:pl-20 py-4">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-[#990000] text-xs font-bold tracking-[0.5em] uppercase mb-6">Regulatory Vigilance</h2>
            <h3 className="text-4xl md:text-5xl font-bold text-black mb-10 leading-tight font-serif max-w-4xl">
              The Evolving Enforcement Landscape under the Money Laundering Act, 2022.
            </h3>
            
            <div className="grid lg:grid-cols-[1fr_400px] gap-20">
              <div className="space-y-8">
                <p className="text-xl text-gray-700 leading-relaxed font-light">
                  The regulatory climate in Nigeria has shifted decisively toward active enforcement. Under the <strong>Money Laundering (Prevention and Prohibition) Act, 2022</strong>, regulators have commenced rigorous prosecution, securing convictions against business owners and corporate entities for critical procedural lapses.
                </p>
                
                <div className="bg-gray-50 p-10 space-y-8">
                  <h4 className="text-xs font-bold tracking-widest uppercase text-black border-b border-gray-200 pb-4">
                    Primary Enforcement Focal Points
                  </h4>
                  <ul className="space-y-6">
                    {[
                      {
                        title: "Compliance Leadership",
                        desc: "Mandatory appointment of a qualified, fit-and-proper Compliance Officer."
                      },
                      {
                        title: "Institutionalized Training",
                        desc: "Verifiable, ongoing AML/CFT training protocols for all staff levels."
                      },
                      {
                        title: "Reporting Integrity",
                        desc: "Rigorous adherence to timelines for mandatory disclosures and regulatory reports."
                      }
                    ].map((item, i) => (
                      <li key={i} className="flex space-x-6">
                        <span className="text-[#990000] font-serif italic text-2xl font-bold">0{i+1}</span>
                        <div>
                          <p className="text-black font-bold text-sm uppercase tracking-wider mb-1">{item.title}</p>
                          <p className="text-gray-500 text-sm font-light">{item.desc}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex flex-col justify-between py-2">
                <div className="space-y-8">
                  <p className="text-gray-500 text-sm leading-relaxed">
                    TEP serves as a proactive strategic partner, architecting AML/CFT frameworks designed to insulate founders and board members from regulatory exposure and reputational risk.
                  </p>
                  <p className="text-black font-semibold text-sm leading-relaxed border-t border-gray-100 pt-8">
                    We manage compliance complexity end-to-end, allowing your leadership team to remain focused on growth and strategic decision-making with absolute certainty.
                  </p>
                </div>
                
                <button 
                  onClick={() => navigate('/practice')}
                  className="mt-12 md:mt-0 text-[10px] font-bold text-[#990000] tracking-[0.3em] uppercase border-b border-[#990000] pb-2 self-start hover:text-black hover:border-black transition-colors"
                >
                  Explore Compliance Strategy →
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default TheFirm;
