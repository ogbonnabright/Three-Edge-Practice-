
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  UserCheck, 
  CheckCircle, 
  ArrowRight, 
  Building2, 
  Compass,
  Check
} from 'lucide-react';
import { REGIONAL_OFFICES, TEAM, PRACTICE_AREAS } from '../constants';
import { RegionalOffice } from '../types';

const Contact: React.FC = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const attorneyParam = query.get('attorney');

  // Selected office tab
  const [selectedOfficeId, setSelectedOfficeId] = useState<string>('abuja');
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    office: 'Abuja',
    attorney: attorneyParam || '',
    practiceArea: '',
    message: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const activeOffice: RegionalOffice = REGIONAL_OFFICES.find((o) => o.id === selectedOfficeId) || REGIONAL_OFFICES[0];

  useEffect(() => {
    if (attorneyParam) {
      setFormData((prev) => ({ ...prev, attorney: attorneyParam }));
      // If attorney has a known location, match the active office tab
      const matched = TEAM.find((m) => m.name.toLowerCase() === attorneyParam.toLowerCase());
      if (matched?.location) {
        const foundOffice = REGIONAL_OFFICES.find((o) => o.city.toLowerCase() === matched.location?.toLowerCase());
        if (foundOffice) {
          setSelectedOfficeId(foundOffice.id);
          setFormData((prev) => ({ ...prev, office: foundOffice.city }));
        }
      }
      // Scroll to consultation form when attorney param is provided
      setTimeout(() => {
        const formEl = document.getElementById('consultation-form');
        formEl?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 200);
    }
  }, [attorneyParam]);

  const scrollToConsultationForm = () => {
    const formEl = document.getElementById('consultation-form');
    if (formEl) {
      formEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setTimeout(() => {
        const inputEl = document.getElementById('client-name-input');
        inputEl?.focus();
      }, 400);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    setTimeout(() => setCopiedField(null), 2500);
  };

  return (
    <div className="bg-[#fcfcfc] min-h-screen text-black">
      {/* Hero Header */}
      <section className="bg-[#0f1115] text-white pt-16 pb-20 px-6 sm:px-12 md:px-20 border-b border-gray-800 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-[#990000]/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex items-center space-x-3 mb-4">
            <span className="w-8 h-[2px] bg-[#990000]"></span>
            <span className="text-[#990000] text-xs font-bold tracking-[0.35em] uppercase">Connect With Us</span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-serif tracking-tight leading-tight max-w-4xl text-white mb-6">
            Nationwide Presence. Strategic Proximity.
          </h1>
          
          <p className="text-gray-300 text-base sm:text-lg max-w-3xl leading-relaxed font-light mb-8">
            With regional offices strategically positioned in Abuja, Lagos, Kano, and Port Harcourt, Three Edge Practice provides responsive, top-tier counsel at the critical hubs of Nigerian government, commerce, and industry.
          </p>

          <div className="flex flex-wrap gap-4">
            <button
              onClick={scrollToConsultationForm}
              className="px-8 py-4 bg-[#990000] text-white text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-300 flex items-center space-x-2 cursor-pointer shadow-lg shadow-black/30"
            >
              <span>Consult an Attorney</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <a
              href={`tel:${activeOffice.phone.replace(/[^0-9+]/g, '')}`}
              className="px-8 py-4 border border-white/20 bg-white/5 text-white text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-300 flex items-center space-x-2"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call Direct Line</span>
            </a>
          </div>

          {/* Quick Office Jump Links */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-10 pt-8 border-t border-white/10">
            {REGIONAL_OFFICES.map((office) => (
              <button
                key={office.id}
                onClick={() => {
                  setSelectedOfficeId(office.id);
                  setFormData((prev) => ({ ...prev, office: office.city }));
                }}
                className={`text-left p-3.5 border transition-all duration-300 ${
                  selectedOfficeId === office.id
                    ? 'border-[#990000] bg-[#990000]/15'
                    : 'border-white/10 hover:border-white/30 bg-white/5'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold font-serif text-white">{office.city}</span>
                  {selectedOfficeId === office.id && (
                    <span className="w-2 h-2 rounded-full bg-[#990000]"></span>
                  )}
                </div>
                <span className="text-[10px] text-gray-400 uppercase tracking-widest block mt-1 truncate">
                  {office.state}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content Area: Regional Directory & Inquiry Form */}
      <section className="max-w-7xl mx-auto px-6 sm:px-12 md:px-20 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column (7 Cols): Regional Offices Detailed Dossier */}
          <div className="lg:col-span-7 space-y-8">
            <div className="border-b border-gray-200 pb-4 flex items-center justify-between">
              <div>
                <span className="text-[#990000] text-xs font-bold tracking-widest uppercase block mb-1">
                  Directory of Offices
                </span>
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-black">
                  Regional Jurisdictions
                </h2>
              </div>
              <span className="text-xs text-gray-400 font-medium">
                4 Locations Nationwide
              </span>
            </div>

            {/* Office Navigation Tabs */}
            <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-4">
              {REGIONAL_OFFICES.map((office) => (
                <button
                  key={office.id}
                  onClick={() => {
                    setSelectedOfficeId(office.id);
                    setFormData((prev) => ({ ...prev, office: office.city }));
                  }}
                  className={`px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition-all duration-200 flex items-center space-x-2 ${
                    selectedOfficeId === office.id
                      ? 'bg-[#990000] text-white shadow-sm'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-black'
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5" />
                  <span>{office.city}</span>
                </button>
              ))}
            </div>

            {/* Active Office Detail Card */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeOffice.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
                className="bg-white border border-gray-200 p-8 shadow-sm space-y-8 relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 right-0 h-1 bg-[#990000]"></div>

                {/* Office Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-[#990000] text-[11px] font-bold tracking-widest uppercase block mb-1">
                      {activeOffice.state} &bull; Regional Practice
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-serif font-bold text-black">
                      {activeOffice.city} Office
                    </h3>
                    <p className="text-xs text-gray-500 font-medium mt-1">
                      {activeOffice.tagline}
                    </p>
                  </div>
                  {activeOffice.partnerInCharge && (
                    <div className="bg-gray-50 border border-gray-200 p-3 self-start sm:self-auto text-right">
                      <span className="text-[10px] text-gray-400 uppercase tracking-widest block font-bold">Partner-in-Charge</span>
                      <span className="text-xs font-bold text-black flex items-center space-x-1.5 justify-end mt-0.5">
                        <UserCheck className="w-3.5 h-3.5 text-[#990000]" />
                        <span>{activeOffice.partnerInCharge}</span>
                      </span>
                    </div>
                  )}
                </div>

                {/* Contact Channels Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-gray-100 text-sm">
                  {/* Address */}
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-xs font-bold text-[#990000] uppercase tracking-wider">
                      <MapPin className="w-4 h-4" />
                      <span>Physical Address</span>
                    </div>
                    <p className="text-gray-700 leading-relaxed font-light text-sm">
                      {activeOffice.address}
                    </p>
                    <button
                      onClick={() => copyToClipboard(activeOffice.address, 'address')}
                      className="text-[11px] font-semibold text-gray-500 hover:text-[#990000] flex items-center space-x-1 pt-1"
                    >
                      {copiedField === 'address' ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span className="text-emerald-600">Copied Address</span>
                        </>
                      ) : (
                        <span>Copy Address</span>
                      )}
                    </button>
                  </div>

                  {/* Phone & Email */}
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center space-x-2 text-xs font-bold text-[#990000] uppercase tracking-wider mb-1">
                        <Phone className="w-4 h-4" />
                        <span>Direct Telephone</span>
                      </div>
                      <a 
                        href={`tel:${activeOffice.phone.replace(/[^0-9+]/g, '')}`}
                        className="text-black font-semibold text-sm hover:text-[#990000] transition-colors"
                      >
                        {activeOffice.phone}
                      </a>
                    </div>

                    <div>
                      <div className="flex items-center space-x-2 text-xs font-bold text-[#990000] uppercase tracking-wider mb-1">
                        <Mail className="w-4 h-4" />
                        <span>Office Email</span>
                      </div>
                      <a 
                        href={`mailto:${activeOffice.email}`}
                        className="text-black font-semibold text-sm hover:text-[#990000] transition-colors"
                      >
                        {activeOffice.email}
                      </a>
                    </div>
                  </div>
                </div>

                {/* Operating Hours & Practice Disciplines */}
                <div className="pt-6 border-t border-gray-100 space-y-4">
                  <div className="flex items-center space-x-2 text-xs text-gray-600">
                    <Clock className="w-4 h-4 text-[#990000]" />
                    <span className="font-bold uppercase tracking-wider text-[11px]">Operating Hours:</span>
                    <span>{activeOffice.hours} (West Africa Time)</span>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3 flex items-center space-x-2">
                      <Compass className="w-3.5 h-3.5 text-[#990000]" />
                      <span>Key Regional Focus Areas</span>
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {activeOffice.practiceFocus.map((focus, fIdx) => (
                        <span
                          key={fIdx}
                          className="bg-gray-50 border border-gray-200 text-gray-700 text-xs px-3 py-1 font-medium"
                        >
                          {focus}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Interactive Map Embed */}
            <div className="border border-gray-200 bg-white overflow-hidden shadow-sm">
              <div className="bg-gray-100 px-6 py-3 border-b border-gray-200 flex items-center justify-between text-xs">
                <span className="font-bold uppercase tracking-wider text-gray-700 flex items-center space-x-2">
                  <MapPin className="w-3.5 h-3.5 text-[#990000]" />
                  <span>Map Location: {activeOffice.city} Office</span>
                </span>
                <span className="text-gray-400">{activeOffice.state}</span>
              </div>
              <div className="w-full h-80 relative bg-gray-100 grayscale-[0.4] hover:grayscale-0 transition-all duration-700">
                <iframe
                  title={`TEP ${activeOffice.city} Location`}
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  scrolling="no"
                  marginHeight={0}
                  marginWidth={0}
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(activeOffice.mapQuery)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                ></iframe>
              </div>
            </div>
          </div>

          {/* Right Column (5 Cols): Strategic Consultation Request Form */}
          <div id="consultation-form" className="lg:col-span-5 bg-white border border-gray-200 p-8 sm:p-10 shadow-sm sticky top-8 scroll-mt-24">
            <div className="border-b border-gray-200 pb-4 mb-6">
              <span className="text-[#990000] text-xs font-bold tracking-widest uppercase block mb-1">
                Client Engagement
              </span>
              <h3 className="text-2xl font-serif font-bold text-black">
                Request a Consultation
              </h3>
              <p className="text-xs text-gray-500 mt-1 font-light">
                Submit an inquiry directly to our managing partners and practice leaders. All communications are strictly confidential.
              </p>
            </div>

            {isSubmitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-12 text-center space-y-4"
              >
                <div className="w-16 h-16 bg-[#990000]/10 text-[#990000] rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h4 className="text-xl font-serif font-bold text-black">Inquiry Dispatched</h4>
                <p className="text-gray-600 text-xs leading-relaxed max-w-sm mx-auto">
                  Thank you for reaching out to Three Edge Practice. A designated partner from our <span className="font-bold text-black">{formData.office} office</span> will review your matter and respond within 24 business hours.
                </p>
                <button
                  onClick={() => {
                    setIsSubmitted(false);
                    setFormData({
                      name: '',
                      email: '',
                      phone: '',
                      office: 'Abuja',
                      attorney: '',
                      practiceArea: '',
                      message: ''
                    });
                  }}
                  className="mt-6 inline-flex items-center space-x-2 px-6 py-2.5 bg-black text-white text-xs font-bold uppercase tracking-widest hover:bg-[#990000] transition-colors"
                >
                  <span>Submit Another Inquiry</span>
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Attorney Pre-Selection Indicator */}
                {formData.attorney && (
                  <div className="bg-[#990000]/10 border border-[#990000]/20 p-3 text-xs flex items-center justify-between">
                    <span className="text-[#990000] font-bold">
                      Direct Request for: <span className="underline">{formData.attorney}</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, attorney: '' })}
                      className="text-gray-500 hover:text-black font-bold uppercase text-[10px]"
                    >
                      Clear
                    </button>
                  </div>
                )}

                {/* Name */}
                <div>
                  <label htmlFor="client-name-input" className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    id="client-name-input"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Aliko Bello"
                    className="w-full bg-gray-50 border border-gray-200 px-4 py-3 text-sm text-black placeholder-gray-400 focus:outline-none focus:border-[#990000] focus:bg-white transition-colors"
                  />
                </div>

                {/* Email & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="client@organization.com"
                      className="w-full bg-gray-50 border border-gray-200 px-4 py-3 text-sm text-black placeholder-gray-400 focus:outline-none focus:border-[#990000] focus:bg-white transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+234 ..."
                      className="w-full bg-gray-50 border border-gray-200 px-4 py-3 text-sm text-black placeholder-gray-400 focus:outline-none focus:border-[#990000] focus:bg-white transition-colors"
                    />
                  </div>
                </div>

                {/* Preferred Regional Office */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Preferred Regional Office *
                  </label>
                  <select
                    value={formData.office}
                    onChange={(e) => {
                      setFormData({ ...formData, office: e.target.value });
                      const found = REGIONAL_OFFICES.find((o) => o.city.toLowerCase() === e.target.value.toLowerCase());
                      if (found) setSelectedOfficeId(found.id);
                    }}
                    className="w-full bg-gray-50 border border-gray-200 px-4 py-3 text-sm text-black focus:outline-none focus:border-[#990000] focus:bg-white transition-colors"
                  >
                    <option value="Abuja">Abuja (Headquarters - Federal Capital)</option>
                    <option value="Lagos">Lagos (Commercial, Banking & IP Hub)</option>
                    <option value="Kano">Kano (Northern Regional & Cross-Border Trade)</option>
                    <option value="Port Harcourt">Port Harcourt (Energy & Niger Delta)</option>
                  </select>
                </div>

                {/* Practice Area */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Practice Area / Matter Type
                  </label>
                  <select
                    value={formData.practiceArea}
                    onChange={(e) => setFormData({ ...formData, practiceArea: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 px-4 py-3 text-sm text-black focus:outline-none focus:border-[#990000] focus:bg-white transition-colors"
                  >
                    <option value="">General Corporate Inquiry</option>
                    {PRACTICE_AREAS.map((pa) => (
                      <option key={pa.id} value={pa.title}>{pa.title}</option>
                    ))}
                    <option value="Islamic Finance & Sukuk">Islamic Finance & Sukuk (Northern Office)</option>
                    <option value="White Collar & Corporate Crime">White Collar & Corporate Crime Defense</option>
                  </select>
                </div>

                {/* Confidential Brief */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Confidential Summary of Matter *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Provide a high-level summary of the dispute, advisory request, or transactional mandate..."
                    className="w-full bg-gray-50 border border-gray-200 px-4 py-3 text-sm text-black placeholder-gray-400 focus:outline-none focus:border-[#990000] focus:bg-white transition-colors resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#990000] text-white py-4 font-bold tracking-[0.2em] uppercase text-xs hover:bg-black transition-colors duration-300 flex items-center justify-center space-x-2"
                >
                  <span>Submit Confidential Inquiry</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <p className="text-[10px] text-gray-400 text-center leading-relaxed">
                  All communications are protected under professional legal privilege and strict non-disclosure obligations.
                </p>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;

