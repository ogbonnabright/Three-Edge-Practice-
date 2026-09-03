import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import Home from './pages/Home';
import TheFirm from './pages/TheFirm';
import Practice from './pages/Practice';
import BigWins from './pages/BigWins';
import Team from './pages/Team';
import Insights from './pages/Insights';
import Careers from './pages/Careers';
import Contact from './pages/Contact';
import { AnimatePresence, motion } from 'framer-motion';

const ScrollToTop: React.FC = () => {
  const { pathname, hash } = useLocation();
  
  useEffect(() => {
    if (hash) {
      const element = document.getElementById(hash.replace('#', ''));
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 150);
        return;
      }
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);

  return null;
};

const PageTransition: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <ScrollToTop />
      <div className="flex bg-white min-h-screen">
        <Sidebar />
        
        {/* Main Content Area */}
        <main className="flex-1 md:ml-64 w-full overflow-x-hidden flex flex-col min-h-screen pt-16 md:pt-0">
          <div className="flex-grow">
            <PageTransition>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/firm" element={<TheFirm />} />
                <Route path="/practice" element={<Practice />} />
                <Route path="/wins" element={<BigWins />} />
                <Route path="/team" element={<Team />} />
                <Route path="/insights" element={<Insights />} />
                <Route path="/careers" element={<Careers />} />
                <Route path="/contact" element={<Contact />} />
              </Routes>
            </PageTransition>
          </div>
          <Footer />
        </main>
      </div>
    </Router>
  );
};

export default App;