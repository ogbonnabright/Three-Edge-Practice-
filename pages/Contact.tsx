
import React from 'react';
import { motion } from 'framer-motion';

const Contact: React.FC = () => {
  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-6xl mx-auto px-8 py-16">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold tracking-widest text-black mb-4 uppercase font-serif">Contact</h1>
          <div className="w-16 h-1 bg-[#990000] mx-auto"></div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start mb-20">
          {/* Info Box */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="border-2 border-gray-100 p-12 text-center flex flex-col items-center justify-center space-y-6"
          >
            <p className="text-lg text-black font-medium leading-relaxed max-w-xs">
              Plot 483 Ajose Adeogun Street, Utako, Abuja, Federal Capital Territory, Nigeria
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center justify-center space-x-3 text-black hover:text-[#990000] transition-colors">
                <svg className="w-5 h-5 text-[#990000]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span className="font-semibold">+234-9079140069</span>
              </div>

              <div className="flex items-center justify-center space-x-3 text-black hover:text-[#990000] transition-colors">
                <svg className="w-5 h-5 text-[#990000]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="font-semibold">info@tep.com.ng</span>
              </div>

              <div className="flex items-center justify-center space-x-3 text-black">
                <svg className="w-5 h-5 text-[#990000]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-semibold">Mon-Fri - 08:00-19:00</span>
              </div>
            </div>
          </motion.div>

          {/* Form Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-2 gap-4">
              <input 
                type="text" 
                placeholder="Name" 
                className="w-full bg-white border border-gray-200 px-6 py-4 outline-none focus:border-[#990000] text-sm text-gray-700 placeholder-gray-400 transition-colors"
              />
              <input 
                type="text" 
                placeholder="Phone" 
                className="w-full bg-white border border-gray-200 px-6 py-4 outline-none focus:border-[#990000] text-sm text-gray-700 placeholder-gray-400 transition-colors"
              />
            </div>
            <input 
              type="email" 
              placeholder="Email address" 
              className="w-full bg-white border border-gray-200 px-6 py-4 outline-none focus:border-[#990000] text-sm text-gray-700 placeholder-gray-400 transition-colors"
            />
            <textarea 
              placeholder="Message" 
              rows={5}
              className="w-full bg-white border border-gray-200 px-6 py-4 outline-none focus:border-[#990000] text-sm text-gray-700 placeholder-gray-400 transition-colors resize-none"
            ></textarea>
            
            <button className="w-full bg-[#990000] text-white py-5 font-bold tracking-[0.2em] uppercase text-xs hover:bg-black transition-colors duration-300">
              Contact Us
            </button>
          </motion.div>
        </div>
      </div>

      {/* Map Section */}
      <div className="w-full h-[500px] relative overflow-hidden bg-gray-100 grayscale-[0.5] hover:grayscale-0 transition-all duration-700">
        <iframe 
          title="TEP Location"
          width="100%" 
          height="100%" 
          frameBorder="0" 
          scrolling="no" 
          marginHeight={0} 
          marginWidth={0} 
          src="https://maps.google.com/maps?q=Plot%20483%20Ajose%20Adeogun%20Street,%20Utako,%20Abuja&t=&z=15&ie=UTF8&iwloc=&output=embed"
        ></iframe>
      </div>
    </div>
  );
};

export default Contact;
