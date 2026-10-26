import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Menu, X, Lock, KeyRound, Search } from 'lucide-react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { auth } from '../firebase';
import { isAssociatedAdminEmail } from '../pages/ClientPortal';
import { NAV_ITEMS } from '../constants';
import GlobalSearchModal from './GlobalSearchModal';

const Sidebar: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setCurrentUser(u);
    });
    return () => unsub();
  }, []);

  const isAdmin = currentUser && isAssociatedAdminEmail(currentUser.email);

  // Global Keyboard Shortcut: ⌘K or Ctrl+K opens search palette
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchModalOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close drawer on navigation
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <>
      {/* Mobile Top Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white/95 backdrop-blur-sm border-b border-gray-200 flex items-center justify-between px-6 z-[60]">
        <NavLink to="/" className="flex items-center">
          <span className="text-2xl font-bold tracking-tight text-black flex items-center">
            TEP<span className="w-1.5 h-1.5 rounded-full bg-[#990000] ml-1"></span>
          </span>
        </NavLink>
        <div className="flex items-center gap-2">
          {/* Mobile Search Button */}
          <button
            onClick={() => setSearchModalOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-black border border-gray-200 text-xs font-semibold rounded-xs transition-colors cursor-pointer"
            title="Search firm team & insights (⌘K / Ctrl+K)"
          >
            <Search className="w-3.5 h-3.5 text-[#990000]" />
            <span className="hidden xs:inline text-[11px] uppercase tracking-wider">Search</span>
          </button>

          <NavLink
            to="/portal/client"
            className="flex items-center gap-1.5 px-3 py-1 bg-gray-100 border border-gray-200 text-[11px] font-bold uppercase tracking-wider text-black hover:text-[#990000]"
          >
            <Lock className="w-3 h-3 text-[#990000]" />
            <span>Login</span>
          </NavLink>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 text-black hover:text-[#990000] transition-colors cursor-pointer"
            aria-label="Toggle Menu"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Slide-over Drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-[55] flex flex-col justify-between bg-white pt-20 px-8 pb-10 overflow-y-auto">
          <nav className="flex flex-col space-y-5">
            {/* Mobile Drawer Search Bar */}
            <button
              type="button"
              onClick={() => {
                setMobileOpen(false);
                setSearchModalOpen(true);
              }}
              className="w-full flex items-center justify-between px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xs text-left text-xs font-medium text-gray-600 hover:border-[#990000] hover:text-black transition-colors mb-2 cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-[#990000]" />
                <span>Search team, insights...</span>
              </div>
              <span className="text-[10px] font-mono text-gray-400 bg-white px-1.5 py-0.5 border border-gray-200">
                FIND
              </span>
            </button>

            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `text-lg font-bold tracking-wider uppercase transition-colors flex items-center justify-between ${
                    isActive ? 'text-[#990000]' : 'text-gray-600 hover:text-black'
                  }`
                }
              >
                <span>{item.label}</span>
                {item.path.startsWith('/portal') && (
                  <span className="text-[10px] font-mono px-2 py-0.5 bg-[#990000]/10 text-[#990000] font-bold">
                    SECURE
                  </span>
                )}
              </NavLink>
            ))}

            {/* Admin Management Link for Firm Partners */}
            {isAdmin && (
              <NavLink
                to="/portal/admin"
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `text-sm font-bold tracking-wider uppercase py-2 px-3 border transition-colors flex items-center justify-between ${
                    isActive ? 'bg-[#990000] text-white border-[#990000]' : 'bg-gray-100 text-black border-gray-300 hover:border-[#990000]'
                  }`
                }
              >
                <div className="flex items-center gap-2">
                  <KeyRound className="w-3.5 h-3.5 text-[#990000]" />
                  <span>ADMIN PORTAL</span>
                </div>
                <span className="text-[9px] font-mono font-bold uppercase bg-[#990000] text-white px-1.5 py-0.5">ADMIN</span>
              </NavLink>
            )}
          </nav>

          <div className="pt-8 border-t border-gray-100 text-xs text-gray-400">
            <p className="font-semibold text-black mb-1">Three Edge Practice</p>
            <p>Advocacy, Strategy & Corporate Law</p>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-100 hidden md:flex flex-col z-50">
        <div className="p-8 pb-5">
          <NavLink to="/" className="flex flex-col">
            <span className="text-3xl font-bold tracking-tight text-black flex items-center">
              TEP<span className="w-2 h-2 rounded-full bg-[#990000] ml-1"></span>
            </span>
            <span className="text-[10px] font-medium tracking-[0.2em] text-gray-400 mt-1 uppercase">
              Three Edge Practice
            </span>
          </NavLink>
        </div>

        {/* Global Search Bar in Desktop Sidebar */}
        <div className="px-8 pb-4">
          <button
            type="button"
            onClick={() => setSearchModalOpen(true)}
            className="w-full flex items-center justify-between px-3 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 hover:border-gray-400 text-left transition-all group rounded-xs cursor-pointer shadow-2xs"
            title="Search team members, partners, or insights (⌘K / Ctrl+K)"
          >
            <div className="flex items-center gap-2 min-w-0">
              <Search className="w-3.5 h-3.5 text-[#990000]" shrink-0 />
              <span className="text-xs text-gray-500 group-hover:text-black truncate">Search team & insights...</span>
            </div>
            <kbd className="hidden sm:inline-block text-[9px] font-mono font-semibold px-1.5 py-0.5 bg-white border border-gray-300 text-gray-500 rounded-xs shadow-2xs shrink-0">
              ⌘K
            </kbd>
          </button>
        </div>

        <nav className="flex-1 px-8 flex flex-col justify-center space-y-3.5">
          {NAV_ITEMS.map((item) => {
            const isPortal = item.path.startsWith('/portal');
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  isPortal
                    ? `text-xs font-bold tracking-widest uppercase py-2 px-3 border transition-all flex items-center justify-between ${
                        isActive
                          ? 'bg-[#990000] text-white border-[#990000]'
                          : 'bg-gray-50 text-black border-gray-200 hover:border-[#990000] hover:text-[#990000]'
                      }`
                    : `text-sm font-semibold tracking-widest transition-colors duration-300 ${
                        isActive ? 'text-[#990000]' : 'text-gray-400 hover:text-black'
                      }`
                }
              >
                <span>{item.label}</span>
                {isPortal && <Lock className="w-3 h-3 text-[#990000] group-hover:text-white" />}
              </NavLink>
            );
          })}

          {/* Dedicated Admin Portal Link for verified Firm Administrators */}
          {isAdmin && (
            <NavLink
              to="/portal/admin"
              className={({ isActive }) =>
                `text-xs font-bold tracking-widest uppercase py-2 px-3 border transition-all flex items-center justify-between ${
                  isActive
                    ? 'bg-black text-white border-black shadow-sm'
                    : 'bg-red-50 text-[#990000] border-red-200 hover:border-[#990000]'
                }`
              }
            >
              <div className="flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5" />
                <span>ADMIN PORTAL</span>
              </div>
              <span className="text-[9px] font-mono font-bold uppercase bg-[#990000] text-white px-1.5 py-0.2">ADMIN</span>
            </NavLink>
          )}
        </nav>

        <div className="p-8 pt-4">
          <div className="text-[10px] text-gray-300 font-medium tracking-widest uppercase">
            &copy; 2026 TEP. <br /> All Rights Reserved.
          </div>
        </div>
      </aside>

      {/* Global Search Command Palette Modal */}
      <GlobalSearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
      />
    </>
  );
};

export default Sidebar;