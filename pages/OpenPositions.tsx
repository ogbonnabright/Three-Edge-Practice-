import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Briefcase, ArrowRight, ArrowLeft, Mail, FileText, CheckCircle2 } from 'lucide-react';
import ApplicationModal, { JobVacancy, VACANCIES_LIST } from '../components/ApplicationModal';

const OpenPositions: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<JobVacancy | null>(null);

  const handleOpenCvModal = () => {
    setSelectedJob({
      title: 'General Speculative Application',
      type: 'All Regional Offices',
      department: 'Three Edge Practice Talent Pool',
      overview: 'Submit an unsolicited dossier for rolling evaluation across our Abuja, Lagos, Port Harcourt, and Kano chambers.',
      requirements: 'Open to exceptional practitioners, litigators, and pupils across all practice groups.'
    });
    setIsModalOpen(true);
  };

  return (
    <div className="bg-white min-h-screen text-black flex flex-col justify-between">
      <div>
        {/* Compact Header */}
        <div className="bg-black text-white py-10 px-6 md:px-16 border-b border-gray-800">
          <div className="max-w-4xl mx-auto space-y-2">
            <Link
              to="/careers"
              className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider text-gray-400 hover:text-white transition-colors mb-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Careers</span>
            </Link>
            <div className="flex items-center gap-2 text-xs font-semibold tracking-[0.25em] uppercase text-[#990000]">
              <span>Three Edge Practice</span>
              <span aria-hidden="true">·</span>
              <span className="text-gray-400">Careers Portal</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-white">
              Open Positions
            </h1>
          </div>
        </div>

        {/* Main Content: Modeled on https://tnp.com.ng/careers/open-positions/ */}
        <div className="max-w-4xl mx-auto px-6 md:px-16 py-16 md:py-24">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="border border-gray-200 p-8 sm:p-14 text-center space-y-8 bg-gray-50/50"
          >
            <div className="w-16 h-16 bg-white border border-gray-200 flex items-center justify-center mx-auto text-[#990000] shadow-sm">
              <Briefcase className="w-8 h-8" />
            </div>

            <div className="space-y-3">
              <span className="text-[11px] font-mono tracking-widest uppercase px-3 py-1 bg-white border border-gray-200 text-gray-600">
                Current Intake Cycle: Closed
              </span>
              <h2 className="text-2xl sm:text-4xl font-serif font-bold text-black tracking-tight">
                There are currently no open positions.
              </h2>
            </div>

            <div className="space-y-4 max-w-xl mx-auto text-sm text-gray-600 leading-relaxed font-light">
              <p>
                Thank you for your interest in Three Edge Practice. All associate, pupil, and specialist billets for the
                current recruitment term have been filled across our Abuja, Lagos, Port Harcourt, and Kano chambers.
              </p>
              <p>
                We open new positions periodically as our practice expands. You are welcome to submit your curriculum vitae
                into our confidential talent repository so our recruitment desk can reach out when matching opportunities emerge.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                type="button"
                onClick={handleOpenCvModal}
                className="w-full sm:w-auto px-8 py-3.5 bg-[#990000] hover:bg-black text-white text-xs font-bold uppercase tracking-wider transition-colors inline-flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <span>Submit Your CV</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <Link
                to="/careers"
                className="w-full sm:w-auto px-6 py-3.5 border border-gray-300 hover:border-black text-gray-700 hover:text-black text-xs font-bold uppercase tracking-wider transition-colors inline-flex items-center justify-center"
              >
                Explore Firm Culture
              </Link>
            </div>

            <div className="pt-8 border-t border-gray-200 text-xs text-gray-500 space-y-1">
              <p className="font-semibold text-gray-700">Direct Recruitment Inquiries</p>
              <p>Email: <a href="mailto:careers@tep.com.ng" className="text-[#990000] hover:underline">careers@tep.com.ng</a> · Registry: registry@tep.com.ng</p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Application Form Modal */}
      <ApplicationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedJob={selectedJob}
        allJobs={VACANCIES_LIST}
      />
    </div>
  );
};

export default OpenPositions;
