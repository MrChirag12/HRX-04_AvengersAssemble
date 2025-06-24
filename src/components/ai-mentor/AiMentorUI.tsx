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
    <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center bg-white">
      <div className="relative">
        <div
          className={`w-28 h-28 rounded-full flex items-center justify-center border-4 transition-all duration-500 ${
            isSpeaking
              ? 'border-indigo-500 animate-pulse shadow-xl shadow-indigo-300'
              : 'border-gray-300'
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`w-12 h-12 ${
              isSpeaking ? 'text-indigo-600' : 'text-gray-400'
            }`}
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
        <p className="mt-4 text-lg font-medium text-gray-600">
          {isSpeaking ? 'Assistant is listening...' : 'Click Start to begin'}
        </p>
      </div>

      {!callStarted ? (
        <button
          onClick={handleStartCall}
          className="mt-6 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition"
        >
          Start Call
        </button>
      ) : (
        <button
          onClick={handleEndCall}
          className="mt-6 px-5 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition"
        >
          End Call
        </button>
      )}
    </div>
  );
};

export default AiMentorUI;
