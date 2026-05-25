'use client';

import { useEffect, useState } from 'react';

export default function DynamicAtmosphere() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
      {/* Background base */}
      <div className="absolute inset-0 bg-transition duration-1000 ease-in-out" 
           style={{ backgroundColor: 'var(--bg-tone, #f8fafa)' }} />

      {/* Atmospheric Blobs */}
      <div 
        className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full opacity-30 mix-blend-multiply blur-[120px] animate-blob"
        style={{ 
          backgroundColor: 'var(--accent-tone-1, #72c1c1)',
          transform: `translate(${scrollY * 0.05}px, ${scrollY * 0.1}px) rotate(${scrollY * 0.02}deg)`
        }}
      />
      <div 
        className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full opacity-20 mix-blend-multiply blur-[100px] animate-blob-delayed"
        style={{ 
          backgroundColor: 'var(--accent-tone-2, #b7b0d3)',
          transform: `translate(-${scrollY * 0.08}px, -${scrollY * 0.05}px) scale(${1 + scrollY * 0.0001})`
        }}
      />
      
      {/* Texture Layer */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/natural-paper.png")' }} />

      <style jsx global>{`
        @keyframes blob {
          0%, 100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
          50% { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; }
        }
        .animate-blob {
          animation: blob 20s infinite alternate cubic-bezier(0.45, 0, 0.55, 1);
        }
        .animate-blob-delayed {
          animation: blob 25s infinite alternate-reverse cubic-bezier(0.45, 0, 0.55, 1);
        }
        .bg-transition {
          transition: background-color 1.2s cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>
    </div>
  );
}
