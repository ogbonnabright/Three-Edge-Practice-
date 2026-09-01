import React from 'react';
import { NavLink } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-50 py-16 px-6 sm:px-12 md:px-20 border-t border-gray-200">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <h4 className="text-[#990000] text-[10px] font-bold tracking-[0.3em] uppercase mb-4">Headquarters</h4>
            <p className="text-black font-semibold text-sm leading-relaxed mb-2">
              Plot 483 Ajose Adeogun Street, Utako,<br />
              Abuja, FCT, Nigeria
            </p>
            <span className="text-xs text-gray-500 font-light block">
              T: +234-9079140069
            </span>
          </div>

          <div>
            <h4 className="text-[#990000] text-[10px] font-bold tracking-[0.3em] uppercase mb-4">Regional Offices</h4>
            <div className="space-y-3 text-xs text-gray-700">
              <div>
                <span className="font-bold text-black block">Lagos Office</span>
                <span className="text-gray-500">Walter Carrington Crescent, Victoria Island</span>
              </div>
              <div>
                <span className="font-bold text-black block">Kano Regional Office</span>
                <span className="text-gray-500">Bank of Industry Tower, 25 Post Office Rd, Bompai</span>
              </div>
              <div>
                <span className="font-bold text-black block">Port Harcourt Office</span>
                <span className="text-gray-500">Trans-Amadi Industrial Layout, Rivers State</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-[#990000] text-[10px] font-bold tracking-[0.3em] uppercase mb-4">Direct Channels</h4>
            <p className="text-black font-semibold text-sm leading-relaxed mb-3">
              E: info@tep.com.ng<br />
              E: clientservices@tep.com.ng
            </p>
            <div className="text-xs text-gray-500">
              <span className="font-bold text-black block mb-0.5">Operating Hours</span>
              <span>Mon-Fri: 08:00 - 19:00 (WAT)</span>
            </div>
          </div>

          <div className="flex flex-col items-start lg:items-end justify-between">
            <div>
              <h4 className="text-[#990000] text-[10px] font-bold tracking-[0.3em] uppercase mb-4">Engagement</h4>
              <p className="text-xs text-gray-500 mb-4 lg:text-right max-w-xs">
                Partner-led advisory across Nigeria's vital economic and regulatory corridors.
              </p>
            </div>
            <NavLink 
              to="/contact" 
              className="px-6 py-3 border border-black text-[10px] font-bold uppercase tracking-widest hover:bg-[#990000] hover:text-white hover:border-[#990000] transition-all duration-300 w-full sm:w-auto text-center"
            >
              Consult an Attorney
            </NavLink>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] text-gray-400 font-bold tracking-widest uppercase">
            &copy; 2026 THREE EDGE PRACTICE. ALL RIGHTS RESERVED.
          </p>
          <div className="flex flex-wrap gap-6">
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="text-[10px] text-gray-400 font-bold tracking-widest uppercase cursor-pointer hover:text-[#990000] transition-colors">LinkedIn</a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="text-[10px] text-gray-400 font-bold tracking-widest uppercase cursor-pointer hover:text-[#990000] transition-colors">Twitter</a>
            <NavLink to="/insights" className="text-[10px] text-gray-400 font-bold tracking-widest uppercase cursor-pointer hover:text-[#990000] transition-colors">Legal Insights</NavLink>
            <NavLink to="/contact" className="text-[10px] text-gray-400 font-bold tracking-widest uppercase cursor-pointer hover:text-[#990000] transition-colors">Offices</NavLink>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;