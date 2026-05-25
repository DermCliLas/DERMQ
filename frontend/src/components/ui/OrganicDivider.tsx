import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface OrganicDividerProps {
  className?: string;
  fill?: string;
  flip?: boolean;
  type?: 'wave' | 'slope' | 'blob';
}

export default function OrganicDivider({
  className,
  fill = '#f8fafa',
  flip = false,
  type = 'wave'
}: OrganicDividerProps) {
  return (
    <div
      className={cn(
        "absolute left-0 w-full overflow-hidden leading-[0] z-20 pointer-events-none",
        flip ? "bottom-0 rotate-180" : "top-0",
        className
      )}
    >
      {type === 'wave' && (
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="relative block w-[calc(100%+1.3px)] h-[100px]"
          fill={fill}
        >
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118.43,181.67,118.4,321.39,56.44Z"></path>
        </svg>
      )}
      {type === 'slope' && (
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="relative block w-[calc(100%+1.3px)] h-[120px]"
          fill={fill}
        >
          <path d="M1200 120L0 120 307.75 0 1200 120z" className="opacity-10"></path>
          <path d="M1200 120L0 120 0 0 1200 120z"></path>
        </svg>
      )}
      {type === 'blob' && (
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="relative block w-[calc(100%+1.3px)] h-[150px]"
          fill={fill}
        >
          <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86C181.67,118.4,59.71,118.43,0,95.8V120H1200V13C1132.19,36.09,1055.71,28.48,985.66,92.83Z"></path>
        </svg>
      )}
    </div>
  );
}
