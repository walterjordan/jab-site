'use client';

import { useState } from 'react';
import ChatKitWrapper from './ChatKitWrapper';
import { MessageCircle, X } from 'lucide-react';

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
      {/* Chat Window */}
      {isOpen && (
        <div className="w-[380px] h-[600px] max-h-[80vh] bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col transition-all duration-300 ease-in-out">
          <div className="bg-[#010e63] p-4 flex justify-between items-center text-white shrink-0">
            <div>
              <h3 className="font-bold">JAB Assistant</h3>
              <p className="text-xs text-gray-300">Powered by OpenAI</p>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-white/10 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          <div className="flex-1 relative bg-white">
            <ChatKitWrapper />
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group flex items-center justify-center w-14 h-14 bg-[#7fff41] text-[#010e63] rounded-full shadow-lg hover:bg-[#a4ff82] hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#7fff41] focus:ring-offset-2"
        aria-label="Toggle chat"
      >
        {isOpen ? (
          <X size={28} />
        ) : (
          <MessageCircle size={28} className="fill-current" />
        )}
      </button>
    </div>
  );
}
