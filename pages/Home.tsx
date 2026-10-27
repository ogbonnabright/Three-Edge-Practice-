import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Lock, 
  ShieldCheck, 
  Activity, 
  FileText, 
  ArrowRight,
  Building2,
  Scale,
  FileSearch,
  Cpu,
  Leaf,
  Flame,
  Globe2,
  GraduationCap,
  Laptop,
  Compass,
  Target,
  Building,
  Globe,
  Briefcase,
  CheckCircle2
} from 'lucide-react';
import HeroAnimation from '../components/HeroAnimation';

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-white">
      {/* 1. Hero Section */}
      <section className="relative min-h-[calc(100vh-4rem)] md:min-h-screen md:h-screen flex flex-col justify-center px-6 sm:px-10 md:px-16 lg:px-20 py-8 sm:py-10 md:py-12 overflow-hidden border-b border-gray-50">
        <HeroAnimation />

        <div className="relative z-10 max-w-4xl my-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="flex items-center space-x-3 mb-3 md:mb-4">
              <div className="h-[2px] w-10 bg-[#990000]"></div>
              <span className="text-[#990000] font-bold tracking-[0.35em] text-[11px] md:text-xs uppercase">
                Strategic Advocacy
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-[1.08] text-black mb-3 md:mb-4 font-serif">
              Strategic Advocacy.<br />
              <span className="text-[#990000]">Decisive Results.</span>
            </h1>

            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-700 font-light leading-relaxed max-w-2xl lg:max-w-3xl mb-3 md:mb-4">
              We help businesses, institutions and international organisations navigate legal complexity, manage regulatory risk and strengthen ESG and governance performance through legal expertise and technology-enabled solutions.
            </p>

            <div className="w-12 h-[2px] bg-[#990000] mb-3 md:mb-4"></div>

            <p className="text-xs sm:text-sm md:text-base text-gray-500 font-light leading-relaxed max-w-2xl mb-6 md:mb-8">
              Nigeria-focused legal and advisory expertise for a connected, regulated and sustainability-driven global economy.
            </p>

            <div className="flex flex-wrap gap-4 items-center">
              <button
                onClick={() => navigate('/contact#consultation-form')}
                className="group relative px-6 sm:px-8 py-3.5 sm:py-4 bg-[#990000] text-white font-bold tracking-widest uppercase text-xs overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-red-900/20 cursor-pointer flex items-center gap-2"
              >
                <span className="relative z-10">Request a Consultation</span>
                <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" />
                <div className="absolute inset-0 bg-black translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              </button>
              
              <button
                onClick={() => {
                  const el = document.getElementById('services');
                  if (el) {
                    el.scrollIntoView({ behavior: 'smooth' });
                  } else {
                    navigate('/practice');
                  }
                }}
                className="px-6 sm:px-8 py-3.5 sm:py-4 border border-black text-black font-bold tracking-widest uppercase text-xs hover:bg-black hover:text-white transition-all duration-300 cursor-pointer"
              >
                Explore Our Services
              </button>
            </div>
          </motion.div>
        </div>

        <div className="absolute bottom-6 right-8 hidden xl:flex items-center space-x-6 z-10 pointer-events-none">
          <div className="text-right">
            <p className="text-[10px] text-gray-400 tracking-widest uppercase mb-0.5">Established</p>
            <p className="text-lg font-bold font-serif italic text-black">Excellence</p>
          </div>
          <div className="w-[1px] h-10 bg-gray-200"></div>
          <div className="text-right">
            <p className="text-[10px] text-gray-400 tracking-widest uppercase mb-0.5">Global</p>
            <p className="text-lg font-bold font-serif italic text-black">Reach</p>
          </div>
        </div>
      </section>

      {/* Law, Technology & Regulatory Intelligence Section */}
      <section className="py-20 md:py-24 px-8 md:px-24 bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-[1fr_1.2fr] gap-12 items-center">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <span className="w-8 h-[2px] bg-[#990000]"></span>
                <span className="text-[#990000] text-xs font-bold tracking-[0.4em] uppercase">
                  Regulatory Intelligence
                </span>
              </div>
              <h2 className="text-4xl md:text-6xl font-bold font-serif text-black leading-tight">
                Law. Technology.<br />
                <span className="text-[#990000]">Regulatory Intelligence.</span>
              </h2>
            </div>
            <div className="lg:border-l-2 lg:border-[#990000] lg:pl-12">
              <p className="text-xl md:text-2xl text-gray-700 font-light leading-relaxed mb-6">
                Three Edge Practice is an elite law firm defined by intellectual rigor and a triad of strategic strengths, delivering precision in high-stakes legal matters.
              </p>
              <div className="flex flex-wrap items-center gap-6 text-xs text-gray-500 font-bold uppercase tracking-widest">
                <span className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#990000]"></span>
                  Intellectual Rigor
                </span>
                <span className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#990000]"></span>
                  Strategic Foresight
                </span>
                <span className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#990000]"></span>
                  Decisive Precision
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Our Services Section */}
      <section id="services" className="py-24 px-8 md:px-24 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mb-16">
            <div className="flex items-center space-x-3 mb-4">
              <span className="w-8 h-[2px] bg-[#990000]"></span>
              <span className="text-[#990000] text-xs font-bold tracking-[0.4em] uppercase">
                Our Services
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-black font-serif mb-4 leading-tight">
              Comprehensive Legal & Advisory Solutions
            </h2>
            <p className="text-gray-500 text-base md:text-lg font-light">
              Strategic advice. Practical solutions. Lasting impact.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Corporate & Commercial Law",
                desc: "Business formation, transactions, mergers & acquisitions.",
                icon: Building2
              },
              {
                title: "Litigation & Dispute Resolution",
                desc: "Strategic representation in complex disputes.",
                icon: Scale
              },
              {
                title: "Regulatory Compliance",
                desc: "Advisory and support for sector-specific regulations.",
                icon: ShieldCheck
              },
              {
                title: "Financial Crime & Investigations",
                desc: "AML/CFT, anti-corruption and white-collar crime.",
                icon: FileSearch
              },
              {
                title: "Technology & AI Governance",
                desc: "Legal frameworks for emerging technologies and data protection.",
                icon: Cpu
              },
              {
                title: "ESG Advisory",
                desc: "Environmental, social and governance risk and reporting.",
                icon: Leaf
              },
              {
                title: "Energy & Natural Resources",
                desc: "Oil & gas, power and infrastructure advisory.",
                icon: Flame
              },
              {
                title: "International Business Advisory",
                desc: "Cross-border transactions and market entry support.",
                icon: Globe2
              }
            ].map((service, idx) => {
              const IconComp = service.icon;
              return (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.05 }}
                  onClick={() => navigate('/practice')}
                  className="group bg-white p-8 border border-gray-100 hover:border-[#990000] border-t-2 border-t-transparent hover:border-t-[#990000] transition-all duration-300 flex flex-col justify-between cursor-pointer shadow-xs hover:shadow-lg"
                >
                  <div>
                    <div className="w-12 h-12 bg-gray-50 group-hover:bg-[#990000]/10 flex items-center justify-center mb-6 transition-colors duration-300">
                      <IconComp className="w-6 h-6 text-[#990000]" />
                    </div>
                    <h3 className="text-lg font-bold text-black font-serif mb-3 leading-snug group-hover:text-[#990000] transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-gray-500 text-xs md:text-sm font-light leading-relaxed mb-6">
                      {service.desc}
                    </p>
                  </div>
                  <div className="flex items-center text-[10px] font-bold text-[#990000] uppercase tracking-widest gap-1 group-hover:translate-x-1 transition-transform">
                    <span>Learn More</span>
                    <ArrowRight className="w-3 h-3" />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. Why Three Edge Practice Section */}
      <section className="py-24 px-8 md:px-24 bg-[#0f1115] text-white relative overflow-hidden border-t border-b border-gray-800">
        <div className="absolute right-0 bottom-0 w-96 h-96 bg-[#990000]/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center mb-16">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <span className="w-8 h-[2px] bg-[#990000]"></span>
                <span className="text-[#990000] text-xs font-bold tracking-[0.4em] uppercase">
                  Why Three Edge Practice
                </span>
              </div>
              <h2 className="text-3xl md:text-5xl font-bold font-serif leading-tight mb-6">
                A Partner for a Complex World
              </h2>
              <p className="text-gray-300 text-base md:text-lg font-light leading-relaxed mb-8">
                We combine deep legal expertise with regulatory insight, technology and ESG experience to help clients navigate risk, seize opportunity and achieve sustainable growth.
              </p>
              <button
                onClick={() => navigate('/firm')}
                className="px-8 py-4 bg-[#990000] hover:bg-white text-white hover:text-black font-bold text-xs uppercase tracking-widest transition-all duration-300 flex items-center gap-2 cursor-pointer shadow-lg"
              >
                <span>Learn More About Us</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              {[
                {
                  title: "Deep Legal Expertise",
                  desc: "Nigerian-qualified lawyers with specialist experience.",
                  icon: GraduationCap
                },
                {
                  title: "Technology-Enabled",
                  desc: "Modern tools for efficient and transparent service.",
                  icon: Laptop
                },
                {
                  title: "Global Perspective",
                  desc: "Advising international and local clients.",
                  icon: Compass
                },
                {
                  title: "Client-Centred",
                  desc: "Practical solutions aligned with your goals.",
                  icon: Target
                }
              ].map((item, i) => {
                const IconComp = item.icon;
                return (
                  <div 
                    key={item.title}
                    className="p-6 bg-white/5 border border-white/10 hover:border-[#990000] transition-colors duration-300"
                  >
                    <div className="w-10 h-10 bg-[#990000]/20 flex items-center justify-center mb-4">
                      <IconComp className="w-5 h-5 text-[#990000]" />
                    </div>
                    <h3 className="text-base font-bold font-serif mb-2 text-white">
                      {item.title}
                    </h3>
                    <p className="text-gray-400 text-xs font-light leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 4. Our Practice Areas Section */}
      <section className="py-24 px-8 md:px-24 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mb-16">
            <div className="flex items-center space-x-3 mb-4">
              <span className="w-8 h-[2px] bg-[#990000]"></span>
              <span className="text-[#990000] text-xs font-bold tracking-[0.4em] uppercase">
                Our Practice Areas
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-black font-serif leading-tight">
              Industry-Focused Legal Expertise
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Corporate & Commercial",
                desc: "Strategic legal support for business growth.",
                image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop"
              },
              {
                title: "Energy & Natural Resources",
                desc: "Regulatory, commercial and ESG advisory.",
                image: "https://images.unsplash.com/photo-1444312645910-ffa973656eba?q=80&w=800&auto=format&fit=crop"
              },
              {
                title: "Technology & AI",
                desc: "Governance, data protection and innovation.",
                image: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop"
              },
              {
                title: "ESG Advisory",
                desc: "Sustainability and responsible business practices.",
                image: "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?q=80&w=800&auto=format&fit=crop"
              }
            ].map((area, idx) => (
              <motion.div
                key={area.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                onClick={() => navigate('/practice')}
                className="group border border-gray-100 bg-white overflow-hidden flex flex-col justify-between hover:border-[#990000] transition-all duration-300 cursor-pointer shadow-xs hover:shadow-lg"
              >
                <div>
                  <div className="aspect-[16/10] bg-gray-100 overflow-hidden relative">
                    <img 
                      src={area.image} 
                      alt={area.title} 
                      className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" 
                    />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-black font-serif mb-2 group-hover:text-[#990000] transition-colors leading-snug">
                      {area.title}
                    </h3>
                    <p className="text-gray-500 text-xs md:text-sm font-light leading-relaxed">
                      {area.desc}
                    </p>
                  </div>
                </div>
                <div className="px-6 pb-6 pt-2 flex items-center text-[10px] font-bold text-[#990000] uppercase tracking-widest gap-1 group-hover:translate-x-1 transition-transform">
                  <span>Learn More</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Our Team Section */}
      <section className="py-24 px-8 md:px-24 bg-gray-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
            <div className="max-w-2xl">
              <div className="flex items-center space-x-3 mb-4">
                <span className="w-8 h-[2px] bg-[#990000]"></span>
                <span className="text-[#990000] text-xs font-bold tracking-[0.4em] uppercase">
                  Our Team
                </span>
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-black font-serif leading-tight mb-4">
                Experienced. Focused. Committed.
              </h2>
              <p className="text-gray-600 text-sm md:text-base font-light leading-relaxed">
                Our team brings together legal, regulatory, compliance and technology expertise to deliver practical and innovative solutions for our clients.
              </p>
            </div>
            <div>
              <button
                onClick={() => navigate('/team')}
                className="px-8 py-4 bg-black hover:bg-[#990000] text-white font-bold text-xs uppercase tracking-widest transition-all duration-300 flex items-center gap-2 cursor-pointer shadow-md"
              >
                <span>Meet Our Team</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Al'Qasim Ja'Afar",
                role: "Managing Partner",
                focus: "AML/CFT Compliance, Financial Crime & Regulatory Strategy",
                image: "/images/Al'Qasim Jafar.png"
              },
              {
                name: "Tamunoibi Aprekuma",
                role: "Head, IT Law & Tech Regulatory",
                focus: "Corporate & Commercial Law, Regulatory Compliance & AI Governance",
                image: "/images/Tamunoibi Aprekuma.jpeg"
              },
              {
                name: "Churchill Osila",
                role: "Partner, Head of Port Harcourt Office",
                focus: "Litigation & Dispute Resolution, Energy & White Collar Defense",
                image: "/images/Churchill Osila.png"
              }
            ].map((lawyer, idx) => (
              <motion.div
                key={lawyer.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                onClick={() => navigate('/team')}
                className="group bg-white border border-gray-200 overflow-hidden cursor-pointer hover:border-[#990000] transition-all duration-300 shadow-sm hover:shadow-md"
              >
                <div className="aspect-[4/5] bg-gray-100 overflow-hidden relative">
                  <img 
                    src={lawyer.image} 
                    alt={lawyer.name} 
                    className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-700" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#990000] bg-white px-2 py-0.5 inline-block mb-1 shadow-xs">
                      {lawyer.role}
                    </span>
                    <h3 className="text-xl font-bold font-serif text-white">
                      {lawyer.name}
                    </h3>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-xs text-gray-600 font-light leading-relaxed">
                    {lawyer.focus}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Selected Experience Section */}
      <section className="py-24 px-8 md:px-24 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mb-16">
            <div className="flex items-center space-x-3 mb-4">
              <span className="w-8 h-[2px] bg-[#990000]"></span>
              <span className="text-[#990000] text-xs font-bold tracking-[0.4em] uppercase">
                Selected Experience
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-black font-serif leading-tight">
              Trusted by Leading Businesses and Institutions
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {[
              {
                title: "Regulatory Compliance",
                desc: "Providing advisory and compliance support to financial institutions and Designated Non-Financial Businesses and Professions (DNFBPs) to meet applicable regulatory requirements, supervisory standards and audit obligations.",
                tag: "Financial Services Advisory",
                image: "/images/financial_regulatory_advisory.jpg"
              },
              {
                title: "ESG Compliance Framework",
                desc: "Supporting organisations to monitor environmental and social performance, assess governance and sustainability risks, meet applicable regulatory requirements, improve transparency, and achieve responsible, sustainable growth.",
                tag: "Energy & Natural Resources",
                image: "https://images.unsplash.com/photo-1444312645910-ffa973656eba?q=80&w=800&auto=format&fit=crop"
              },
              {
                title: "Technology Advisory",
                desc: "Legal and regulatory advisory services to technology companies, startups, innovators, investors and established businesses adopting digital solutions.",
                tag: "Technology & Innovation",
                image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=800&auto=format&fit=crop"
              }
            ].map((exp, idx) => (
              <motion.div
                key={exp.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                onClick={() => navigate('/practice')}
                className="group border border-gray-100 bg-white overflow-hidden flex flex-col justify-between hover:border-[#990000] transition-all duration-300 cursor-pointer shadow-xs hover:shadow-md"
              >
                <div>
                  <div className="aspect-[16/10] bg-gray-100 overflow-hidden relative">
                    <img 
                      src={exp.image} 
                      alt={exp.title} 
                      className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" 
                    />
                  </div>
                  <div className="p-6">
                    <span className="inline-block px-2.5 py-1 bg-gray-100 text-black text-[9px] font-bold uppercase tracking-wider mb-3 border border-gray-200">
                      {exp.tag}
                    </span>
                    <h3 className="text-lg font-bold text-black font-serif mb-2 leading-snug group-hover:text-[#990000] transition-colors">
                      {exp.title}
                    </h3>
                    <p className="text-gray-500 text-xs md:text-sm font-light leading-relaxed">
                      {exp.desc}
                    </p>
                  </div>
                </div>
                <div className="px-6 pb-6 pt-2 flex items-center text-[10px] font-bold text-[#990000] uppercase tracking-widest gap-1 group-hover:translate-x-1 transition-transform">
                  <span>Learn More</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-left">
            <button
              onClick={() => navigate('/practice')}
              className="text-xs font-bold text-[#990000] uppercase tracking-widest border-b-2 border-[#990000] pb-2 hover:text-black hover:border-black transition-colors cursor-pointer"
            >
              Explore Practice Experience →
            </button>
          </div>
        </div>
      </section>

      {/* 7. Who We Serve Section */}
      <section className="py-24 px-8 md:px-24 bg-gray-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mb-16">
            <div className="flex items-center space-x-3 mb-4">
              <span className="w-8 h-[2px] bg-[#990000]"></span>
              <span className="text-[#990000] text-xs font-bold tracking-[0.4em] uppercase">
                Our Clients
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-black font-serif leading-tight mb-4">
              Who We Serve
            </h2>
            <p className="text-gray-600 text-sm md:text-base font-light">
              We work with a diverse range of clients, locally and internationally, including:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Nigerian Businesses & Institutions",
                desc: "Corporate, regulatory and litigation support.",
                icon: Building
              },
              {
                title: "Oil & Gas Companies & Multinationals",
                desc: "ESG, compliance and regulatory advisory.",
                icon: Flame
              },
              {
                title: "International Companies Entering Nigeria",
                desc: "Market entry and local legal support.",
                icon: Globe
              },
              {
                title: "Technology Companies & Regulated Businesses",
                desc: "AI governance, data protection and compliance.",
                icon: Cpu
              }
            ].map((client, idx) => {
              const IconComp = client.icon;
              return (
                <motion.div
                  key={client.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.08 }}
                  className="bg-white p-8 border border-gray-200 border-t-2 border-t-[#990000] shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="w-12 h-12 bg-gray-50 flex items-center justify-center mb-6">
                      <IconComp className="w-6 h-6 text-[#990000]" />
                    </div>
                    <h3 className="text-lg font-bold text-black font-serif mb-3 leading-snug">
                      {client.title}
                    </h3>
                    <p className="text-gray-500 text-xs md:text-sm font-light leading-relaxed">
                      {client.desc}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 8. Client Legal Case Portal Section */}
      <section className="py-20 px-8 md:px-24 bg-[#0f1115] text-white relative overflow-hidden border-t border-b border-gray-800">
        <div className="absolute right-0 top-0 w-96 h-96 bg-[#990000]/15 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-12">
          <div className="max-w-2xl space-y-4">
            <div className="flex items-center space-x-3">
              <span className="w-8 h-[2px] bg-[#990000]"></span>
              <span className="text-[#990000] text-xs font-bold tracking-[0.35em] uppercase flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5" />
                <span>Client Privilege & Transparency</span>
              </span>
            </div>
            <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold font-serif leading-tight">
              Client Legal Case Portal & Real-Time Dashboard
            </h3>
            <p className="text-gray-300 text-sm sm:text-base font-light leading-relaxed">
              Track active trial proceedings, monitor certified electronic court filings, and communicate directly with designated lead defense counsel in real time powered by secure cloud database technology.
            </p>
            <div className="pt-4 flex flex-wrap gap-6 text-xs text-gray-400">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#990000]" />
                <span className="text-white font-medium">Real-Time Proceeding Feeds</span>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#990000]" />
                <span className="text-white font-medium">Certified Court Document Vault</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#990000]" />
                <span className="text-white font-medium">256-Bit Encrypted Privilege</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <button
              onClick={() => navigate('/portal')}
              className="w-full sm:w-auto px-8 py-5 bg-[#990000] hover:bg-white text-white hover:text-black font-bold text-xs uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 shadow-xl cursor-pointer"
            >
              <span>Login</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 9. Let's Work Together Call to Action */}
      <section className="py-24 px-8 text-center bg-white border-t border-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <span className="w-8 h-[2px] bg-[#990000]"></span>
            <span className="text-[#990000] text-xs font-bold tracking-[0.4em] uppercase">
              Let's Work Together
            </span>
            <span className="w-8 h-[2px] bg-[#990000]"></span>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold text-black mb-6 font-serif">
            Get Legal Advice. Build Better Outcomes.
          </h2>
          <p className="text-gray-600 text-base md:text-lg font-light leading-relaxed mb-10 max-w-2xl mx-auto">
            Contact us today to discuss your needs and explore how we can help.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button 
              onClick={() => navigate('/contact#consultation-form')}
              className="bg-[#990000] text-white px-10 py-5 font-bold tracking-widest uppercase text-xs hover:bg-black transition-colors duration-300 shadow-xl cursor-pointer"
            >
              Request a Consultation →
            </button>
            <button 
              onClick={() => navigate('/contact')}
              className="border border-black text-black px-10 py-5 font-bold tracking-widest uppercase text-xs hover:bg-black hover:text-white transition-colors duration-300 cursor-pointer"
            >
              Contact Us
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;