
import React from 'react';
import { NavLink } from 'react-router-dom';
import { NAV_ITEMS } from '../constants';

const Sidebar: React.FC = () => {
  return (
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
          &copy; 2024 TEP. <br /> All Rights Reserved.
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
