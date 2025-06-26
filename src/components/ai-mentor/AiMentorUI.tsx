'use client';

import { useEffect, useState, useRef } from 'react';
import Vapi from '@vapi-ai/web';

const AiMentorUI = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [callStarted, setCallStarted] = useState(false);
  const vapiRef = useRef<any>(null);

  useEffect(() => {
    const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY!);
    vapiRef.current = vapi;

    vapi.on('call-start', () => {
      console.log('📞 Call started');
      setIsSpeaking(true);
      setCallStarted(true);
    });

    vapi.on('call-end', () => {
      console.log('🛑 Call ended');
      setIsSpeaking(false);
      setCallStarted(false);
    });

    vapi.on('error', (e: any) => {
      console.error('❗ Vapi error:', e);
      setIsSpeaking(false);
      setCallStarted(false);
    });

    return () => {
      vapi.stop();
    };
  }, []);

  const handleStartCall = () => {
    vapiRef.current?.start(process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID!);
  };

  const handleEndCall = () => {
    vapiRef.current?.stop();
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-center min-h-screen w-full px-4 text-center bg-gradient-to-br from-indigo-200 via-blue-100 to-[#f8fafc] gap-8">
      {/* Static image on the left (hidden on mobile) */}
      <div className="hidden md:flex items-center justify-center h-full">
        <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-200 flex items-center justify-center bg-transparent" style={{ width: 340, height: 400 }}>
          <img
            src="/ai-mentor-avatar.png"
            alt="AI Mentor Avatar"
            className="object-contain w-full h-full"
            style={{ maxHeight: 400, maxWidth: 340 }}
          />
        </div>
      </div>
      {/* AI Mentor UI Card */}
      <div className="relative max-w-md w-full mx-auto rounded-3xl p-8 shadow-2xl border border-white/30 bg-transparent" style={{ boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18)' }}>
        {/* Animated glowing border and floating avatar */}
        <div className="flex flex-col items-center">
          <div className={`relative w-32 h-32 mb-4 flex items-center justify-center`}>
            <div className={`absolute inset-0 rounded-full ${isSpeaking ? 'animate-glow border-4 border-indigo-400/80' : 'border-2 border-gray-200'} transition-all`}></div>
            <div className={`absolute inset-0 rounded-full bg-gradient-to-tr from-indigo-200/60 to-indigo-400/30 blur-2xl ${isSpeaking ? 'animate-pulse' : ''}`}></div>
            <div className="relative z-10 w-28 h-28 rounded-full bg-gradient-to-br from-indigo-500 to-blue-400 flex items-center justify-center shadow-xl">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`w-14 h-14 ${isSpeaking ? 'text-white drop-shadow-lg' : 'text-indigo-100'}`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 2a2 2 0 00-2 2v6a2 2 0 004 0V4a2 2 0 00-2-2z" />
                <path
                  fillRule="evenodd"
                  d="M4 10a6 6 0 0012 0h-1.5a4.5 4.5 0 01-9 0H4z"
                  clipRule="evenodd"
                />
                <path d="M9 18h2v-2H9v2z" />
              </svg>
            </div>
          </div>
          <p className="mt-2 text-xl font-semibold text-indigo-700 drop-shadow-sm">
            AI Voice Mentor
          </p>
          <p className="mt-1 text-base font-medium text-gray-600">
            {isSpeaking ? (
              <span className="flex items-center gap-2 animate-pulse text-indigo-600">
                <span className="w-2 h-2 bg-indigo-500 rounded-full animate-ping"></span>
                Assistant is listening...
              </span>
            ) : (
              'Click Start to begin your immersive session'
            )}
          </p>
        </div>
        <div className="flex flex-col items-center mt-8">
          {!callStarted ? (
            <button
              onClick={handleStartCall}
              className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 text-white rounded-xl font-bold text-lg shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-300"
            >
              <span className="inline-flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                Start Call
              </span>
            </button>
          ) : (
            <button
              onClick={handleEndCall}
              className="px-8 py-3 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white rounded-xl font-bold text-lg shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-300"
            >
              <span className="inline-flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                End Call
              </span>
            </button>
          )}
        </div>
      </div>
      <style jsx>{`
        .animate-glow {
          box-shadow: 0 0 32px 8px rgba(99, 102, 241, 0.4), 0 0 64px 16px rgba(99, 102, 241, 0.15);
        }
      `}</style>
    </div>
  );
};

export default AiMentorUI;
