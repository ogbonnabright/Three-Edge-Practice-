import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  X, 
  Users, 
  BookOpen, 
  ArrowRight
} from 'lucide-react';
import { TeamMember, Insight } from '../types';
import { TEAM, INSIGHTS } from '../constants';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuery?: string;
}

type FilterCategory = 'all' | 'team' | 'insights';

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  initialQuery = ''
}) => {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  const [queryText, setQueryText] = useState(initialQuery);
  const [activeCategory, setActiveCategory] = useState<FilterCategory>('all');

  // Sync initial query
  useEffect(() => {
    if (initialQuery) {
      setQueryText(initialQuery);
    }
  }, [initialQuery]);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  // Search filtering logic
  const normalizedQuery = queryText.trim().toLowerCase();
  const tokens = normalizedQuery ? normalizedQuery.split(/\s+/).filter(Boolean) : [];

  const matchedTeam = useMemo(() => {
    if (!tokens.length) return TEAM.slice(0, 6);
    return TEAM.filter((m) => {
      const searchTarget = `
        ${m.name}
        ${m.role}
        ${m.location || ''}
        ${m.category || ''}
        ${(m.practiceAreas || []).join(' ')}
        ${m.bio}
        ${m.fullBio || ''}
      `.toLowerCase();
      return tokens.every((tok) => searchTarget.includes(tok));
    });
  }, [tokens]);

  const matchedInsights = useMemo(() => {
    if (!tokens.length) return INSIGHTS.slice(0, 6);
    return INSIGHTS.filter((i) => {
      const searchTarget = `
        ${i.title}
        ${i.category}
        ${i.author || ''}
        ${i.excerpt}
        ${i.content}
      `.toLowerCase();
      return tokens.every((tok) => searchTarget.includes(tok));
    });
  }, [tokens]);

  const totalResults = matchedTeam.length + matchedInsights.length;

  // Keyboard navigation (Esc to close)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSelectTeamMember = (member: TeamMember) => {
    onClose();
    navigate(`/team?member=${encodeURIComponent(member.name)}`);
  };

  const handleSelectInsight = (insight: Insight) => {
    onClose();
    navigate(`/insights?article=${encodeURIComponent(insight.title)}`);
  };

  return (
    <div className="fixed inset-0 z-[120] bg-black/80 backdrop-blur-xs flex items-start justify-center p-4 pt-12 sm:pt-20 overflow-y-auto">
      <div 
        className="bg-white border-t-4 border-[#990000] shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Search Input Bar */}
        <div className="p-4 sm:p-5 border-b border-gray-200 flex items-center gap-3 bg-white sticky top-0 z-10">
          <Search className="w-5 h-5 text-[#990000] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={queryText}
            onChange={(e) => setQueryText(e.target.value)}
            placeholder="Search team members, partners, or insights & publications..."
            className="flex-1 text-sm sm:text-base text-black placeholder-gray-400 focus:outline-none font-medium"
          />
          {queryText && (
            <button
              onClick={() => {
                setQueryText('');
                inputRef.current?.focus();
              }}
              className="p-1 text-gray-400 hover:text-black transition-colors"
              title="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-2.5 py-1 text-[11px] font-mono font-bold uppercase bg-gray-100 hover:bg-black hover:text-white transition-colors border border-gray-200 cursor-pointer"
          >
            ESC
          </button>
        </div>

        {/* Filter Pills */}
        <div className="px-5 py-2.5 bg-gray-50 border-b border-gray-200 flex items-center gap-2 overflow-x-auto text-xs">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-3 py-1 font-bold uppercase tracking-wider rounded-xs transition-colors shrink-0 cursor-pointer ${
              activeCategory === 'all'
                ? 'bg-black text-white'
                : 'bg-white text-gray-600 hover:text-black border border-gray-200'
            }`}
          >
            All Results ({totalResults})
          </button>
          <button
            onClick={() => setActiveCategory('team')}
            className={`px-3 py-1 font-bold uppercase tracking-wider rounded-xs transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer ${
              activeCategory === 'team'
                ? 'bg-[#990000] text-white'
                : 'bg-white text-gray-600 hover:text-[#990000] border border-gray-200'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Team & Counsel ({matchedTeam.length})</span>
          </button>
          <button
            onClick={() => setActiveCategory('insights')}
            className={`px-3 py-1 font-bold uppercase tracking-wider rounded-xs transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer ${
              activeCategory === 'insights'
                ? 'bg-[#990000] text-white'
                : 'bg-white text-gray-600 hover:text-[#990000] border border-gray-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Insights & Publications ({matchedInsights.length})</span>
          </button>
        </div>

        {/* Scrollable Results Area */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {totalResults === 0 ? (
            <div className="text-center py-12 space-y-3">
              <Search className="w-10 h-10 text-gray-300 mx-auto" />
              <p className="font-serif font-bold text-gray-700">No matching records found for &ldquo;{queryText}&rdquo;</p>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                Try searching for keywords like <span className="font-mono text-black font-semibold">&ldquo;Tax&rdquo;</span>, <span className="font-mono text-black font-semibold">&ldquo;NDPA&rdquo;</span>, <span className="font-mono text-black font-semibold">&ldquo;Al&apos;Qasim Jafar&rdquo;</span>, <span className="font-mono text-black font-semibold">&ldquo;Energy&rdquo;</span>, or <span className="font-mono text-black font-semibold">&ldquo;Tamunoibi&rdquo;</span>.
              </p>
            </div>
          ) : (
            <>
              {/* Category: Team Members & Counsel */}
              {(activeCategory === 'all' || activeCategory === 'team') && matchedTeam.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-1 border-b border-gray-200">
                    <span className="text-[11px] font-bold uppercase tracking-widest text-gray-500 flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-[#990000]" />
                      <span>Legal Team & Partners ({matchedTeam.length})</span>
                    </span>
                    <span className="text-[10px] text-gray-400 font-mono">Click to view profile & credentials</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {matchedTeam.map((m) => (
                      <div
                        key={m.name}
                        onClick={() => handleSelectTeamMember(m)}
                        className="p-3 border border-gray-200 hover:border-[#990000] bg-white hover:bg-red-50/20 transition-all cursor-pointer flex items-start gap-3 rounded-xs group"
                      >
                        <img
                          src={m.image}
                          alt={m.name}
                          className="w-12 h-14 object-cover object-top border border-gray-200 shrink-0 filter grayscale group-hover:grayscale-0 transition-all"
                        />
                        <div className="space-y-1 min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-1">
                            <h4 className="font-serif font-bold text-sm text-black group-hover:text-[#990000] transition-colors truncate">
                              {m.name}
                            </h4>
                            {m.location && (
                              <span className="text-[10px] font-mono text-gray-500 bg-gray-100 px-1.5 py-0.2 shrink-0">
                                {m.location}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-600 line-clamp-1">{m.role}</p>
                          {m.practiceAreas && m.practiceAreas.length > 0 && (
                            <p className="text-[10px] text-gray-400 line-clamp-1">
                              {m.practiceAreas.slice(0, 2).join(' • ')}
                            </p>
                          )}
                          <div className="pt-1 flex items-center gap-1 text-[11px] font-semibold text-[#990000] opacity-0 group-hover:opacity-100 transition-opacity">
                            <span>View Bio & Articles</span>
                            <ArrowRight className="w-3 h-3" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Category: Insights & Publications */}
              {(activeCategory === 'all' || activeCategory === 'insights') && matchedInsights.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-1 border-b border-gray-200">
                    <span className="text-[11px] font-bold uppercase tracking-widest text-gray-500 flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-[#990000]" />
                      <span>Thought Leadership & Insights ({matchedInsights.length})</span>
                    </span>
                    <span className="text-[10px] text-gray-400 font-mono">Click to read analysis</span>
                  </div>

                  <div className="divide-y divide-gray-100">
                    {matchedInsights.map((insight) => (
                      <div
                        key={insight.title}
                        onClick={() => handleSelectInsight(insight)}
                        className="py-3 px-3 -mx-3 hover:bg-gray-50 transition-colors group cursor-pointer space-y-1 rounded-xs"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 bg-[#990000] text-white">
                            {insight.category}
                          </span>
                          <span className="text-[10px] text-gray-400 font-mono">{insight.date}</span>
                          {insight.author && (
                            <span className="text-[10px] text-gray-500 ml-auto font-medium">
                              By {insight.author}
                            </span>
                          )}
                        </div>
                        <h4 className="font-serif font-bold text-sm text-black group-hover:text-[#990000] transition-colors leading-snug">
                          {insight.title}
                        </h4>
                        <p className="text-xs text-gray-600 line-clamp-2 font-light">
                          {insight.excerpt}
                        </p>
                        <div className="pt-0.5 flex items-center gap-1 text-[11px] font-semibold text-[#990000]">
                          <span>Read Full Briefing</span>
                          <ArrowRight className="w-3 h-3" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer shortcuts info */}
        <div className="p-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between text-[11px] text-gray-500">
          <div className="flex items-center gap-3">
            <span>Navigation: <kbd className="font-mono bg-white border border-gray-300 px-1.5 py-0.5 text-[10px]">Click</kbd> or press item</span>
            <span>Dismiss: <kbd className="font-mono bg-white border border-gray-300 px-1.5 py-0.5 text-[10px]">ESC</kbd></span>
          </div>
          <span className="font-serif font-semibold text-black">Three Edge Practice</span>
        </div>
      </div>
    </div>
  );
};

export default GlobalSearchModal;
