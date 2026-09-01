import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { NAV_ITEMS } from '../constants';

const Sidebar: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  // Close drawer on navigation
  React.useEffect(() => {
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
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 text-black hover:text-[#990000] transition-colors"
          aria-label="Toggle Menu"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
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
                  `text-lg font-bold tracking-wider uppercase transition-colors ${
                    isActive ? 'text-[#990000]' : 'text-gray-600 hover:text-black'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
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

        <nav className="flex-1 px-10 flex flex-col justify-center space-y-6">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `text-sm font-semibold tracking-widest transition-colors duration-300 ${
                  isActive ? 'text-[#990000]' : 'text-gray-400 hover:text-black'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
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