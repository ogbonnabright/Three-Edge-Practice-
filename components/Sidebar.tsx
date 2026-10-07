import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Menu, X, Lock, KeyRound } from 'lucide-react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { auth } from '../firebase';
import { isAssociatedAdminEmail } from '../pages/ClientPortal';
import { NAV_ITEMS } from '../constants';

const Sidebar: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const location = useLocation();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setCurrentUser(u);
    });
    return () => unsub();
  }, []);

  const isAdmin = currentUser && isAssociatedAdminEmail(currentUser.email);

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
        <div className="flex items-center gap-3">
          <NavLink
            to="/portal/client"
            className="flex items-center gap-1.5 px-3 py-1 bg-gray-100 border border-gray-200 text-[11px] font-bold uppercase tracking-wider text-black hover:text-[#990000]"
          >
            <Lock className="w-3 h-3 text-[#990000]" />
            <span>Portal</span>
          </NavLink>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 text-black hover:text-[#990000] transition-colors"
            aria-label="Toggle Menu"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Slide-over Drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-[55] flex flex-col justify-between bg-white pt-20 px-8 pb-10">
          <nav className="flex flex-col space-y-6">
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
        <div className="p-10">
          <NavLink to="/" className="flex flex-col">
            <span className="text-3xl font-bold tracking-tight text-black flex items-center">
              TEP<span className="w-2 h-2 rounded-full bg-[#990000] ml-1"></span>
            </span>
            <span className="text-[10px] font-medium tracking-[0.2em] text-gray-400 mt-1 uppercase">
              Three Edge Practice
            </span>
          </NavLink>
        </div>

        <nav className="flex-1 px-10 flex flex-col justify-center space-y-4">
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

        <div className="p-10">
          <div className="text-[10px] text-gray-300 font-medium tracking-widest uppercase">
            &copy; 2026 TEP. <br /> All Rights Reserved.
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;