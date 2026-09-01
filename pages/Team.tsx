import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, Link } from 'react-router-dom';
import { 
  Search, 
  MapPin, 
  Mail, 
  Phone, 
  ArrowRight, 
  X, 
  Download, 
  GraduationCap, 
  Award, 
  Briefcase, 
  RotateCcw,
  ExternalLink,
  ChevronDown,
  Globe
} from 'lucide-react';
import { TEAM } from '../constants';
import { TeamMember } from '../types';

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

const Team: React.FC = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const memberToHighlight = query.get('member');

  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('All');
  const [selectedPractice, setSelectedPractice] = useState<string>('All');
  const [selectedLocation, setSelectedLocation] = useState<string>('All');
  const [selectedLetter, setSelectedLetter] = useState<string>('All');

  // Active Profile Modal
  const [activeMember, setActiveMember] = useState<TeamMember | null>(null);

  // Extract unique practice areas and locations for filters
  const practiceAreaOptions = useMemo(() => {
    const areas = new Set<string>();
    TEAM.forEach((m) => {
      m.practiceAreas?.forEach((pa) => areas.add(pa));
    });
    return Array.from(areas).sort();
  }, []);

  const locationOptions = useMemo(() => {
    const locs = new Set<string>();
    TEAM.forEach((m) => {
      if (m.location) locs.add(m.location);
    });
    return Array.from(locs).sort();
  }, []);

  const roleCategories = ['All', 'Partners', 'Managing Counsel', 'Senior Associates', 'Associates'];

  // Handle URL query for highlighting / auto-opening modal
  useEffect(() => {
    if (memberToHighlight) {
      const found = TEAM.find((m) => m.name.toLowerCase() === memberToHighlight.toLowerCase());
      if (found) {
        setActiveMember(found);
      }
    }
  }, [memberToHighlight]);

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveMember(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Filter logic
  const filteredTeam = useMemo(() => {
    return TEAM.filter((member) => {
      // 1. Text Search
      if (searchTerm.trim() !== '') {
        const query = searchTerm.toLowerCase();
        const matchName = member.name.toLowerCase().includes(query);
        const matchRole = member.role.toLowerCase().includes(query);
        const matchBio = member.bio.toLowerCase().includes(query) || (member.fullBio && member.fullBio.toLowerCase().includes(query));
        const matchPractice = member.practiceAreas?.some((p) => p.toLowerCase().includes(query));
        const matchLoc = member.location?.toLowerCase().includes(query);
        if (!matchName && !matchRole && !matchBio && !matchPractice && !matchLoc) {
          return false;
        }
      }

      // 2. Role Category
      if (selectedRole !== 'All') {
        if (selectedRole === 'Partners') {
          if (!member.role.toLowerCase().includes('partner')) return false;
        } else if (selectedRole === 'Managing Counsel') {
          if (!member.role.toLowerCase().includes('managing counsel')) return false;
        } else if (selectedRole === 'Senior Associates') {
          if (!member.role.toLowerCase().includes('senior associate')) return false;
        } else if (selectedRole === 'Associates') {
          if (member.role.toLowerCase().includes('senior associate') || !member.role.toLowerCase().includes('associate')) return false;
        }
      }

      // 3. Practice Area
      if (selectedPractice !== 'All') {
        if (!member.practiceAreas || !member.practiceAreas.includes(selectedPractice)) {
          return false;
        }
      }

      // 4. Location
      if (selectedLocation !== 'All') {
        if (member.location !== selectedLocation) {
          return false;
        }
      }

      // 5. Letter Filter (Matches first letter of first name or last name)
      if (selectedLetter !== 'All') {
        const nameParts = member.name.replace(/[^a-zA-Z\s]/g, '').split(' ');
        const matchesLetter = nameParts.some((part) => part.toUpperCase().startsWith(selectedLetter));
        if (!matchesLetter) return false;
      }

      return true;
    });
  }, [searchTerm, selectedRole, selectedPractice, selectedLocation, selectedLetter]);

  // Generate and download a standard vCard (.vcf)
  const handleDownloadVCard = (member: TeamMember, e: React.MouseEvent) => {
    e.stopPropagation();
    const vCardContent = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      `FN:${member.name}`,
      `ORG:Three Edge Practice (TEP)`,
      `TITLE:${member.role}`,
      `EMAIL;TYPE=INTERNET,WORK:${member.email || 'info@tep.com.ng'}`,
      `TEL;TYPE=WORK,VOICE:${member.phone || '+234 1 270 3980'}`,
      `ADR;TYPE=WORK:;;${member.location || 'Lagos'};Nigeria`,
      `URL:https://tep.com.ng`,
      `NOTE:${member.bio}`,
      'END:VCARD'
    ].join('\r\n');

    const blob = new Blob([vCardContent], { type: 'text/vcard;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${member.name.replace(/\s+/g, '_')}_TEP.vcf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const hasActiveFilters = searchTerm !== '' || selectedRole !== 'All' || selectedPractice !== 'All' || selectedLocation !== 'All' || selectedLetter !== 'All';

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedRole('All');
    setSelectedPractice('All');
    setSelectedLocation('All');
    setSelectedLetter('All');
  };

  return (
    <div className="bg-[#fcfcfc] min-h-screen text-black">
      {/* Templars-style Hero Section */}
      <section className="bg-[#0f1115] text-white pt-16 pb-20 px-6 sm:px-12 md:px-20 border-b border-gray-800 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-[#990000]/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex items-center space-x-3 mb-4">
            <span className="w-8 h-[2px] bg-[#990000]"></span>
            <span className="text-[#990000] text-xs font-bold tracking-[0.35em] uppercase">Our People</span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-serif tracking-tight leading-tight max-w-4xl text-white mb-6">
            Meet our experts in diverse areas of law.
          </h1>
          
          <p className="text-gray-300 text-base sm:text-lg max-w-3xl leading-relaxed font-light">
            A multidisciplinary team of seasoned advocates, corporate counsel, and sector specialists delivering high-impact strategic advisory and decisive results across Sub-Saharan Africa.
          </p>

          {/* Key Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-12 pt-8 border-t border-white/10 text-xs uppercase tracking-widest text-gray-400">
            <div>
              <span className="block text-2xl font-serif font-bold text-white mb-1">30+</span>
              <span>Attorneys & Counsel</span>
            </div>
            <div>
              <span className="block text-2xl font-serif font-bold text-[#990000] mb-1">4</span>
              <span>Regional Offices</span>
            </div>
            <div>
              <span className="block text-2xl font-serif font-bold text-white mb-1">12</span>
              <span>Practice Disciplines</span>
            </div>
            <div>
              <span className="block text-2xl font-serif font-bold text-white mb-1">100%</span>
              <span>Partner-Led Client Care</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Directory & Filter Interface */}
      <section className="max-w-7xl mx-auto px-6 sm:px-12 md:px-20 py-12">
        {/* Search & Filter Toolbar */}
        <div className="bg-white p-6 sm:p-8 rounded-none border border-gray-200 shadow-sm mb-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            {/* Search Input */}
            <div className="md:col-span-5 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name, sector, or keyword..."
                className="w-full pl-11 pr-10 py-3 bg-gray-50 border border-gray-200 text-sm text-black placeholder-gray-400 focus:outline-none focus:border-[#990000] focus:bg-white transition-colors"
              />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Practice Area Dropdown */}
            <div className="md:col-span-3 relative">
              <select
                value={selectedPractice}
                onChange={(e) => setSelectedPractice(e.target.value)}
                className="w-full appearance-none py-3 px-4 bg-gray-50 border border-gray-200 text-sm text-gray-800 focus:outline-none focus:border-[#990000] focus:bg-white transition-colors pr-10"
              >
                <option value="All">All Practice Areas</option>
                {practiceAreaOptions.map((pa) => (
                  <option key={pa} value={pa}>{pa}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>

            {/* Location Dropdown */}
            <div className="md:col-span-2 relative">
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full appearance-none py-3 px-4 bg-gray-50 border border-gray-200 text-sm text-gray-800 focus:outline-none focus:border-[#990000] focus:bg-white transition-colors pr-10"
              >
                <option value="All">All Locations</option>
                {locationOptions.map((loc) => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>

            {/* Reset Action */}
            <div className="md:col-span-2 flex justify-end">
              {hasActiveFilters ? (
                <button
                  onClick={resetFilters}
                  className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-gray-100 hover:bg-[#990000] text-gray-700 hover:text-white text-xs font-bold uppercase tracking-wider transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              ) : (
                <div className="text-right text-xs text-gray-400 font-medium px-2 py-3">
                  {filteredTeam.length} {filteredTeam.length === 1 ? 'Expert' : 'Experts'}
                </div>
              )}
            </div>
          </div>

          {/* Role Category Filter Tabs */}
          <div className="mt-6 pt-6 border-t border-gray-100 flex flex-wrap items-center gap-2">
            <span className="text-xs uppercase font-bold text-gray-400 tracking-wider mr-2">Category:</span>
            {roleCategories.map((role) => (
              <button
                key={role}
                onClick={() => setSelectedRole(role)}
                className={`px-4 py-1.5 text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${
                  selectedRole === role 
                    ? 'bg-[#990000] text-white shadow-sm' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-black'
                }`}
              >
                {role}
              </button>
            ))}
          </div>

          {/* Templars-style A-Z Alphabet Filter Strip */}
          <div className="mt-6 pt-4 border-t border-gray-100 overflow-x-auto no-scrollbar">
            <div className="flex items-center space-x-1 min-w-max pb-1">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mr-3">Filter A–Z:</span>
              <button
                onClick={() => setSelectedLetter('All')}
                className={`w-7 h-7 text-xs font-bold transition-colors ${
                  selectedLetter === 'All'
                    ? 'bg-[#990000] text-white'
                    : 'text-gray-500 hover:text-black hover:bg-gray-100'
                }`}
              >
                ALL
              </button>
              {ALPHABET.map((char) => {
                const hasMatches = TEAM.some((m) => {
                  const parts = m.name.replace(/[^a-zA-Z\s]/g, '').split(' ');
                  return parts.some((p) => p.toUpperCase().startsWith(char));
                });
                return (
                  <button
                    key={char}
                    disabled={!hasMatches}
                    onClick={() => setSelectedLetter(char)}
                    className={`w-7 h-7 text-xs font-bold transition-colors ${
                      selectedLetter === char
                        ? 'bg-[#990000] text-white'
                        : hasMatches
                        ? 'text-gray-700 hover:text-black hover:bg-gray-100'
                        : 'text-gray-300 cursor-not-allowed'
                    }`}
                  >
                    {char}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Search Results Summary Header */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200">
          <p className="text-sm font-medium text-gray-600">
            Showing <span className="font-bold text-black">{filteredTeam.length}</span> of {TEAM.length} Legal Practitioners
            {hasActiveFilters && <span className="text-[#990000] ml-2">(Filtered)</span>}
          </p>
          {hasActiveFilters && (
            <button 
              onClick={resetFilters}
              className="text-xs font-bold text-[#990000] hover:underline uppercase tracking-wider"
            >
              Clear all filters
            </button>
          )}
        </div>

        {/* Templars-style People Grid */}
        {filteredTeam.length === 0 ? (
          <div className="text-center py-20 bg-white border border-gray-200 p-12">
            <h3 className="text-2xl font-serif font-bold text-black mb-3">No legal experts found</h3>
            <p className="text-gray-500 max-w-md mx-auto text-sm mb-6">
              We couldn’t find any team members matching your current filter criteria. Try resetting your search filters.
            </p>
            <button
              onClick={resetFilters}
              className="inline-flex items-center space-x-2 px-6 py-3 bg-[#990000] text-white text-xs font-bold uppercase tracking-widest hover:bg-black transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset All Filters</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredTeam.map((member, idx) => {
              const isSelected = memberToHighlight?.toLowerCase() === member.name.toLowerCase();

              return (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05, duration: 0.4 }}
                  onClick={() => setActiveMember(member)}
                  className={`group bg-white border cursor-pointer flex flex-col justify-between transition-all duration-300 hover:shadow-xl relative overflow-hidden ${
                    isSelected ? 'ring-2 ring-[#990000] border-[#990000]' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {/* Top Crimson Accent Border on Hover */}
                  <div className="h-1.5 w-full bg-transparent group-hover:bg-[#990000] transition-colors duration-300"></div>

                  <div>
                    {/* Portrait Photo Container */}
                    <div className="w-full aspect-[4/5] bg-gray-100 relative overflow-hidden">
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
                        referrerPolicy="no-referrer"
                      />
                      
                      {/* Dark Gradient Overlay for Crisp Legibility */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>

                      {/* Location Badge on Photo */}
                      {member.location && (
                        <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-white px-2.5 py-1 text-[10px] font-bold tracking-widest uppercase flex items-center space-x-1.5">
                          <MapPin className="w-3 h-3 text-[#990000]" />
                          <span>{member.location}</span>
                        </div>
                      )}

                      {/* Quick Profile Open Prompt */}
                      <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
                        <span className="uppercase tracking-wider text-[11px] text-[#ff6666]">Read Biography</span>
                        <ArrowRight className="w-4 h-4 text-white" />
                      </div>
                    </div>

                    {/* Member Meta Info */}
                    <div className="p-6">
                      <h3 className="text-xl font-bold font-serif text-black group-hover:text-[#990000] transition-colors duration-300 mb-1 leading-snug">
                        {member.name}
                      </h3>
                      
                      <p className="text-[#990000] text-xs font-bold tracking-wider uppercase mb-3">
                        {member.role}
                      </p>

                      {/* Primary Practice Specialization Tags */}
                      {member.practiceAreas && member.practiceAreas.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {member.practiceAreas.slice(0, 2).map((area) => (
                            <span 
                              key={area}
                              className="text-[10px] bg-gray-100 text-gray-700 px-2 py-0.5 font-medium rounded-none border border-gray-200"
                            >
                              {area}
                            </span>
                          ))}
                          {member.practiceAreas.length > 2 && (
                            <span className="text-[10px] bg-gray-50 text-gray-500 px-1.5 py-0.5 font-medium border border-gray-200">
                              +{member.practiceAreas.length - 2}
                            </span>
                          )}
                        </div>
                      )}

                      <p className="text-gray-500 text-xs leading-relaxed line-clamp-3 mb-2 font-light">
                        {member.bio}
                      </p>
                    </div>
                  </div>

                  {/* Card Action Footer */}
                  <div className="px-6 py-3.5 bg-gray-50/80 border-t border-gray-100 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {member.email && (
                        <a
                          href={`mailto:${member.email}`}
                          onClick={(e) => e.stopPropagation()}
                          title={`Email ${member.name}`}
                          className="text-gray-500 hover:text-[#990000] transition-colors p-1"
                        >
                          <Mail className="w-4 h-4" />
                        </a>
                      )}
                      {member.phone && (
                        <a
                          href={`tel:${member.phone.replace(/[^0-9+]/g, '')}`}
                          onClick={(e) => e.stopPropagation()}
                          title={`Call ${member.name}`}
                          className="text-gray-500 hover:text-[#990000] transition-colors p-1"
                        >
                          <Phone className="w-4 h-4" />
                        </a>
                      )}
                      {member.linkedin && (
                        <a
                          href={member.linkedin}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          title="LinkedIn / Professional Profile"
                          className="text-gray-500 hover:text-[#990000] transition-colors p-1"
                        >
                          <Globe className="w-4 h-4" />
                        </a>
                      )}
                      <button
                        onClick={(e) => handleDownloadVCard(member, e)}
                        title="Download vCard"
                        className="text-gray-500 hover:text-[#990000] transition-colors p-1"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>

                    <button
                      onClick={() => setActiveMember(member)}
                      className="text-[11px] font-bold uppercase tracking-wider text-black group-hover:text-[#990000] flex items-center space-x-1"
                    >
                      <span>Profile</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </section>

      {/* Templars-style Full Lawyer Biography Dossier Modal */}
      <AnimatePresence>
        {activeMember && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-10 overflow-y-auto">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveMember(null)}
              className="fixed inset-0 bg-black/75 backdrop-blur-sm"
            />

            {/* Modal Dialog Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 20 }}
              transition={{ duration: 0.3 }}
              className="relative bg-white w-full max-w-5xl max-h-[90vh] overflow-y-auto shadow-2xl z-10 border-t-4 border-[#990000]"
            >
              {/* Close Button */}
              <button
                onClick={() => setActiveMember(null)}
                className="absolute top-4 right-4 z-20 bg-gray-100 hover:bg-[#990000] text-black hover:text-white p-2.5 transition-colors"
                title="Close Profile"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="grid grid-cols-1 lg:grid-cols-12">
                {/* Left Column: Portrait & Direct Contact Panel */}
                <div className="lg:col-span-5 bg-gray-50 p-8 sm:p-10 border-b lg:border-b-0 lg:border-r border-gray-200 flex flex-col justify-between">
                  <div>
                    {/* Headshot */}
                    <div className="w-full aspect-[4/5] bg-gray-200 mb-8 relative shadow-md overflow-hidden">
                      <img
                        src={activeMember.image}
                        alt={activeMember.name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      {activeMember.location && (
                        <div className="absolute top-3 left-3 bg-black/75 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 flex items-center space-x-1.5">
                          <MapPin className="w-3.5 h-3.5 text-[#990000]" />
                          <span>{activeMember.location} Office</span>
                        </div>
                      )}
                    </div>

                    {/* Direct Contact Card */}
                    <div className="space-y-4 text-sm">
                      <h4 className="text-xs font-bold uppercase tracking-widest text-[#990000] border-b border-gray-200 pb-2">
                        Direct Contact
                      </h4>

                      {activeMember.email && (
                        <a
                          href={`mailto:${activeMember.email}`}
                          className="flex items-center space-x-3 text-gray-700 hover:text-[#990000] transition-colors"
                        >
                          <Mail className="w-4 h-4 text-[#990000] flex-shrink-0" />
                          <span className="truncate">{activeMember.email}</span>
                        </a>
                      )}

                      {activeMember.phone && (
                        <a
                          href={`tel:${activeMember.phone.replace(/[^0-9+]/g, '')}`}
                          className="flex items-center space-x-3 text-gray-700 hover:text-[#990000] transition-colors"
                        >
                          <Phone className="w-4 h-4 text-[#990000] flex-shrink-0" />
                          <span>{activeMember.phone}</span>
                        </a>
                      )}

                      {activeMember.linkedin && (
                        <a
                          href={activeMember.linkedin}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center space-x-3 text-gray-700 hover:text-[#990000] transition-colors"
                        >
                          <Globe className="w-4 h-4 text-[#990000] flex-shrink-0" />
                          <span>LinkedIn Professional Profile</span>
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Actions (vCard + Direct Consultation) */}
                  <div className="mt-8 pt-6 border-t border-gray-200 space-y-3">
                    <button
                      onClick={(e) => handleDownloadVCard(activeMember, e)}
                      className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-white border border-gray-300 hover:border-black text-xs font-bold uppercase tracking-widest text-black transition-colors"
                    >
                      <Download className="w-4 h-4 text-[#990000]" />
                      <span>Download vCard</span>
                    </button>

                    <Link
                      to={`/contact?attorney=${encodeURIComponent(activeMember.name)}`}
                      onClick={() => setActiveMember(null)}
                      className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-[#990000] hover:bg-black text-xs font-bold uppercase tracking-widest text-white transition-colors"
                    >
                      <span>Retain / Consult with {activeMember.name.split(' ')[0]}</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>

                {/* Right Column: In-depth Biography, Education, Admissions & Matters */}
                <div className="lg:col-span-7 p-8 sm:p-12 space-y-8">
                  {/* Header Title */}
                  <div>
                    <span className="text-[#990000] text-xs font-bold tracking-[0.3em] uppercase block mb-1">
                      {activeMember.role}
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-serif font-bold text-black mb-3">
                      {activeMember.name}
                    </h2>
                    <div className="w-16 h-1 bg-[#990000] mb-6"></div>

                    {/* Practice Area Badges */}
                    {activeMember.practiceAreas && activeMember.practiceAreas.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-6">
                        {activeMember.practiceAreas.map((pa) => (
                          <span
                            key={pa}
                            className="bg-gray-100 text-gray-800 text-xs px-3 py-1 font-semibold uppercase tracking-wider border border-gray-200"
                          >
                            {pa}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Overview Biography */}
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-widest text-black mb-3 flex items-center space-x-2">
                      <Briefcase className="w-4 h-4 text-[#990000]" />
                      <span>Professional Overview</span>
                    </h3>
                    <p className="text-gray-700 leading-relaxed text-sm sm:text-base mb-4 font-light">
                      {activeMember.fullBio || activeMember.bio}
                    </p>
                  </div>

                  {/* Representative Matters */}
                  {activeMember.keyMatters && activeMember.keyMatters.length > 0 && (
                    <div className="pt-4 border-t border-gray-100">
                      <h3 className="text-sm font-bold uppercase tracking-widest text-black mb-4 flex items-center space-x-2">
                        <Award className="w-4 h-4 text-[#990000]" />
                        <span>Representative Experience</span>
                      </h3>
                      <ul className="space-y-3">
                        {activeMember.keyMatters.map((matter, mIdx) => (
                          <li key={mIdx} className="flex items-start text-xs sm:text-sm text-gray-600 leading-relaxed">
                            <span className="w-1.5 h-1.5 bg-[#990000] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                            <span>{matter}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Education & Qualifications */}
                  {activeMember.education && activeMember.education.length > 0 && (
                    <div className="pt-4 border-t border-gray-100">
                      <h3 className="text-sm font-bold uppercase tracking-widest text-black mb-4 flex items-center space-x-2">
                        <GraduationCap className="w-4 h-4 text-[#990000]" />
                        <span>Education & Academic Credentials</span>
                      </h3>
                      <ul className="space-y-2">
                        {activeMember.education.map((edu, eIdx) => (
                          <li key={eIdx} className="text-xs sm:text-sm text-gray-700 font-medium flex items-center space-x-2">
                            <span className="text-[#990000]">•</span>
                            <span>{edu}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Bar Admissions & Professional Memberships */}
                  {activeMember.admissions && activeMember.admissions.length > 0 && (
                    <div className="pt-4 border-t border-gray-100">
                      <h3 className="text-sm font-bold uppercase tracking-widest text-black mb-4 flex items-center space-x-2">
                        <Award className="w-4 h-4 text-[#990000]" />
                        <span>Bar Admissions & Professional Affiliations</span>
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {activeMember.admissions.map((adm, aIdx) => (
                          <span
                            key={aIdx}
                            className="bg-gray-50 border border-gray-200 text-gray-700 text-xs px-3 py-1"
                          >
                            {adm}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Team;
