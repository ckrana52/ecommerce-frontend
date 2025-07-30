import React, { useState } from "react";
import { BsTelegram, BsHeadphones } from "react-icons/bs";

export default function Support() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Support Widget */}
      <div className="fixed bottom-6 right-6 z-50">
        <div className="relative">
          {/* Telegram Support Option */}
          <div className={`absolute bottom-16 right-0 transition-all duration-300 ${
            isOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible translate-y-4'
          }`}>
            <div className="flex flex-col gap-3 mb-4">
              <a
                href="https://t.me/coxtopup2"
                target="_blank"
                rel="noreferrer"
                className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-200 group relative"
              >
                <BsTelegram className="support-icon" />
                {/* Tooltip */}
                <div className="absolute right-full mr-3 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white px-2 py-1 rounded text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  Telegram Support
                  <div className="absolute left-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-l-gray-800"></div>
                </div>
              </a>
            </div>
          </div>

          {/* Main Support Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl transform transition-all duration-200 ${
              isOpen ? 'rotate-45 scale-110' : 'hover:scale-110'
            }`}
          >
            <BsHeadphones className="w-6 h-6" />
          </button>

          {/* Support Label */}
          <div className={`absolute bottom-full mb-2 right-0 bg-gray-800 text-white px-3 py-1 rounded-lg text-sm whitespace-nowrap transition-all duration-200 ${
            isOpen ? 'opacity-0 invisible' : 'opacity-100 visible'
          }`}>
            Need Help?
            <div className="absolute top-full right-4 border-4 border-transparent border-t-gray-800"></div>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-20"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* CSS Animations */}
      <style jsx>{`
        .support-icon {
          width: 24px;
          height: 24px;
        }
      `}</style>
    </>
  );
}