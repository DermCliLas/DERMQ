'use client';

import { useEffect, useRef } from 'react';

interface ScrollColorOrchestratorProps {
  sectionId: string;
  bgTone: string;
  accent1: string;
  accent2: string;
  children: React.ReactNode;
}

export default function SectionWrapper({
  bgTone,
  accent1,
  accent2,
  children
}: ScrollColorOrchestratorProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          document.documentElement.style.setProperty('--bg-tone', bgTone);
          document.documentElement.style.setProperty('--accent-tone-1', accent1);
          document.documentElement.style.setProperty('--accent-tone-2', accent2);
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [bgTone, accent1, accent2]);

  return (
    <div ref={ref} className="relative z-10 transition-colors duration-1000">
      {children}
    </div>
  );
}
