import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';

const Footer: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleConsultClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (location.pathname === '/contact') {
      const formEl = document.getElementById('consultation-form');
      if (formEl) {
        formEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setTimeout(() => {
          const inputEl = document.getElementById('client-name-input');
          inputEl?.focus();
        }, 400);
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else {
      navigate('/contact#consultation-form');
    }
  };

  return (
    <footer className="bg-gray-50 py-12 sm:py-16 px-4 sm:px-8 md:px-12 lg:px-20 border-t border-gray-200">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10">
          <div>
            <p className="text-[#990000] text-[10px] font-bold tracking-[0.3em] uppercase mb-4">Headquarters</p>
            <p className="text-black font-semibold text-sm leading-relaxed mb-2">
              13 Sheda Close, Area 8, Garki,<br />
              Abuja, FCT, Nigeria
            </p>
            <span className="text-xs text-gray-500 font-light block">
              T: +234 703 952 7148
            </span>
          </div>

          <div>
            <p className="text-[#990000] text-[10px] font-bold tracking-[0.3em] uppercase mb-4">Regional Offices</p>
            <div className="space-y-3 text-xs text-gray-700">
              <div>
                <span className="font-bold text-black block">Lagos Office</span>
                <span className="text-gray-500">Walter Carrington Crescent, Victoria Island</span>
              </div>
              <div>
                <span className="font-bold text-black block">Kano Regional Office</span>
                <span className="text-gray-500">No. 4 Court House Close, off Miller Rd, Bompai, Kano</span>
              </div>
              <div>
                <span className="font-bold text-black block">Port Harcourt Office</span>
                <span className="text-gray-500">32 Mbonu Street, D/Line, Port Harcourt</span>
              </div>
            </div>
          </div>

          <div>
            <p className="text-[#990000] text-[10px] font-bold tracking-[0.3em] uppercase mb-4">Direct Channels</p>
            <p className="text-black font-semibold text-sm leading-relaxed mb-3">
              E: info@tep.com.ng<br />
              E: cservices@tep.com.ng
            </p>
            <div className="text-xs text-gray-500">
              <span className="font-bold text-black block mb-0.5">Operating Hours</span>
              <span>Mon-Fri: 08:00 - 19:00 (WAT)</span>
            </div>
          </div>

          <div className="flex flex-col items-start lg:items-end justify-between">
            <div>
              <p className="text-[#990000] text-[10px] font-bold tracking-[0.3em] uppercase mb-4">Engagement</p>
              <p className="text-xs text-gray-500 mb-4 lg:text-right max-w-xs">
                Partner-led advisory across Nigeria's vital economic and regulatory corridors.
              </p>
            </div>
            <button
              type="button"
              onClick={handleConsultClick}
              className="px-6 py-3 border border-black bg-transparent text-black text-[10px] font-bold uppercase tracking-widest hover:bg-[#990000] hover:text-white hover:border-[#990000] active:scale-95 transition-all duration-300 w-full sm:w-auto text-center cursor-pointer shadow-xs"
            >
              Consult an Attorney
            </button>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 sm:gap-6">
          <p className="text-[10px] text-gray-400 font-bold tracking-widest uppercase">
            &copy; 2026 THREE EDGE PRACTICE. ALL RIGHTS RESERVED.
          </p>
          <div className="flex flex-wrap gap-4 sm:gap-6">
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="text-[10px] text-gray-400 font-bold tracking-widest uppercase cursor-pointer hover:text-[#990000] transition-colors">LinkedIn</a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="text-[10px] text-gray-400 font-bold tracking-widest uppercase cursor-pointer hover:text-[#990000] transition-colors">Twitter</a>
            <NavLink to="/insights" className="text-[10px] text-gray-400 font-bold tracking-widest uppercase cursor-pointer hover:text-[#990000] transition-colors">Legal Insights</NavLink>
            <NavLink to="/contact" className="text-[10px] text-gray-400 font-bold tracking-widest uppercase cursor-pointer hover:text-[#990000] transition-colors">Offices</NavLink>
            <NavLink to="/portal" className="text-[10px] text-[#990000] font-bold tracking-widest uppercase cursor-pointer hover:text-black transition-colors">Login</NavLink>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;