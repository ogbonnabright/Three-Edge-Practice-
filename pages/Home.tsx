import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import HeroAnimation from '../components/HeroAnimation';

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col justify-center px-8 md:px-16 overflow-hidden border-b border-gray-50">
        <HeroAnimation />

        <div className="relative z-10 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="flex items-center space-x-4 mb-6">
              <div className="h-[2px] w-12 bg-[#990000]"></div>
              <span className="text-[#990000] font-bold tracking-[0.4em] text-xs uppercase">
                Strategic Advocacy
              </span>
            </div>

            <h1 className="text-6xl md:text-8xl font-bold leading-tight text-black mb-8 font-serif">
              Strategic Advocacy.<br />
              <span className="text-[#990000]">Decisive Results.</span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-500 font-light leading-relaxed max-w-2xl mb-12">
              Three Edge Practice is an elite law firm defined by intellectual rigor and a triad of strategic strengths, 
              delivering precision in high-stakes legal matters.
            </p>

            <div className="flex flex-wrap gap-6">
              <button
                onClick={() => navigate('/contact')}
                className="group relative px-10 py-5 bg-[#990000] text-white font-bold tracking-widest uppercase text-xs overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-red-900/20"
              >
                <span className="relative z-10">Contact Us</span>
                <div className="absolute inset-0 bg-black translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              </button>
              
              <button
                onClick={() => navigate('/firm')}
                className="px-10 py-5 border border-black text-black font-bold tracking-widest uppercase text-xs hover:bg-black hover:text-white transition-all duration-300"
              >
                The Firm
              </button>
            </div>
          </motion.div>
        </div>

        <div className="absolute bottom-12 right-12 hidden lg:flex items-center space-x-6">
          <div className="text-right">
            <p className="text-[10px] text-gray-400 tracking-widest uppercase mb-1">Established</p>
            <p className="text-xl font-bold font-serif italic text-black">Excellence</p>
          </div>
          <div className="w-[1px] h-12 bg-gray-200"></div>
          <div className="text-right">
            <p className="text-[10px] text-gray-400 tracking-widest uppercase mb-1">Global</p>
            <p className="text-xl font-bold font-serif italic text-black">Reach</p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-24 px-8 md:px-24 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-[#990000] text-xs font-bold tracking-[0.4em] uppercase mb-6">The Firm</h2>
            <h3 className="text-4xl md:text-5xl font-bold text-black mb-8 leading-tight">
              A Triad of Intellectual Rigor, Strategy, and Integrity.
            </h3>
            <p className="text-gray-600 text-lg leading-relaxed mb-8">
              Three Edge Practice (TEP) stands at the pinnacle of the Nigerian legal landscape, providing sophisticated advocacy for global entities. We navigate the complexities of modern regulation with a relentless focus on our clients' commercial and reputational objectives.
            </p>
            <button 
              onClick={() => navigate('/firm')}
              className="text-xs font-bold uppercase tracking-widest border-b-2 border-[#990000] pb-2 hover:text-[#990000] transition-colors"
            >
              Explore Our Story
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

      {/* Focus Practice Areas */}
      <section className="py-24 bg-gray-50 px-8 md:px-24">
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

      {/* Regulatory Vigilance Section */}
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

      {/* Final Call to Action */}
      <section className="py-24 px-8 text-center bg-white border-t border-gray-50">
        <h3 className="text-4xl md:text-5xl font-bold text-black mb-12 font-serif">Ready for Strategic Advocacy?</h3>
        <button 
          onClick={() => navigate('/contact')}
          className="bg-black text-white px-12 py-5 font-bold tracking-widest uppercase text-xs hover:bg-[#990000] transition-colors duration-500 shadow-xl"
        >
          Engage Our Experts
        </button>
      </section>
    </div>
  );
};

export default Home;