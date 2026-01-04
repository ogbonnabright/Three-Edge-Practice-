
import React from 'react';
import { NavLink } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-50 py-16 px-8 md:px-24">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-12">
          <div className="md:col-span-1">
            <h4 className="text-[#990000] text-[10px] font-bold tracking-[0.3em] uppercase mb-6">Headquarters</h4>
            <p className="text-black font-semibold text-sm leading-relaxed">
              Plot 483 Ajose Adeogun Street, Utako,<br />
              Abuja, Federal Capital Territory,<br />
              Nigeria
            </p>
          </div>
          <div>
            <h4 className="text-[#990000] text-[10px] font-bold tracking-[0.3em] uppercase mb-6">Direct Channels</h4>
            <p className="text-black font-semibold text-sm leading-relaxed">
              T: +234-9079140069<br />
              E: info@tep.com.ng
            </p>
          </div>
          <div>
            <h4 className="text-[#990000] text-[10px] font-bold tracking-[0.3em] uppercase mb-6">Availability</h4>
            <p className="text-black font-semibold text-sm leading-relaxed">
              Mon-Fri: 08:00 - 19:00<br />
              Sat-Sun: By Appointment
            </p>
          </div>
          <div className="flex flex-col items-start md:items-end">
            <h4 className="text-[#990000] text-[10px] font-bold tracking-[0.3em] uppercase mb-6">Engagement</h4>
            <NavLink 
              to="/contact" 
              className="px-6 py-3 border border-black text-[10px] font-bold uppercase tracking-widest hover:bg-[#990000] hover:text-white hover:border-[#990000] transition-all duration-300"
            >
              Get in Touch
            </NavLink>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] text-gray-400 font-bold tracking-widest uppercase">
            &copy; {new Date().getFullYear()} THREE EDGE PRACTICE. ALL RIGHTS RESERVED.
          </p>
          <div className="flex space-x-6">
            <a href="#" className="text-[10px] text-gray-400 font-bold tracking-widest uppercase cursor-pointer hover:text-[#990000] transition-colors">LinkedIn</a>
            <a href="#" className="text-[10px] text-gray-400 font-bold tracking-widest uppercase cursor-pointer hover:text-[#990000] transition-colors">Twitter</a>
            <NavLink to="/insights" className="text-[10px] text-gray-400 font-bold tracking-widest uppercase cursor-pointer hover:text-[#990000] transition-colors">Legal Insights</NavLink>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
