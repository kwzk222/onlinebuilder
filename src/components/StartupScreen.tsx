import React from 'react';
import { ArrowRight } from 'lucide-react';

interface StartupScreenProps {
  onSelect: (type: 'guitar' | 'bass') => void;
}

export const StartupScreen: React.FC<StartupScreenProps> = ({ onSelect }) => {
  return (
    <div className="fixed inset-0 z-50 bg-[#000000] text-neutral-100 flex flex-col md:flex-row overflow-hidden font-sans select-none">

      {/* Stark architectural gridlines */}
      <div className="absolute inset-0 pointer-events-none z-10">
        <div className="absolute top-[30%] left-0 w-full h-[1px] bg-neutral-900" />
        <div className="absolute top-[70%] left-0 w-full h-[1px] bg-neutral-900" />
        <div className="absolute top-0 left-[50%] w-[1px] h-full bg-neutral-900 hidden md:block" />
      </div>

      {/* Understated Minimalist Brand Header */}
      <div className="absolute top-12 left-0 right-0 z-30 flex flex-col items-center justify-center text-center px-4 pointer-events-none">
        <span className="text-[9px] tracking-[0.6em] text-amber-600/80 font-mono font-bold uppercase mb-2">
          BESPOKE LUTHERIE STUDIO
        </span>
        <h1 className="text-2xl md:text-3xl font-black tracking-[0.4em] text-neutral-200 font-serif">
          LUXE LUTHIERS
        </h1>
      </div>

      {/* LEFT HALF: BASS */}
      <button
        onClick={() => onSelect('bass')}
        className="group relative flex-1 flex flex-col justify-end p-8 md:p-16 text-left border-b md:border-b-0 md:border-r border-neutral-900 focus:outline-none transition-colors duration-500 hover:bg-[#070708]"
      >
        <div className="relative z-20 flex flex-col gap-2">
          <div className="text-[10px] font-mono tracking-[0.3em] text-neutral-600">
            SERIES I / FOUR STRING
          </div>
          <h2 className="text-3xl md:text-5xl font-serif font-black tracking-widest text-neutral-300">
            BASS
          </h2>
          <p className="max-w-md text-xs leading-relaxed text-neutral-600 font-sans mt-2">
            Deep acoustic architecture with expanded neck scale length, solid resonant low-end body cores, and custom high-output bar pickups.
          </p>
          <div className="flex items-center gap-2 mt-4 text-[9px] font-mono tracking-widest text-amber-600 uppercase font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span>SELECT INSTRUMENT</span>
            <ArrowRight className="w-3 h-3" />
          </div>
        </div>
      </button>

      {/* RIGHT HALF: GUITAR */}
      <button
        onClick={() => onSelect('guitar')}
        className="group relative flex-1 flex flex-col justify-end p-8 md:p-16 text-left focus:outline-none transition-colors duration-500 hover:bg-[#070708]"
      >
        <div className="relative z-20 flex flex-col gap-2">
          <div className="text-[10px] font-mono tracking-[0.3em] text-neutral-600">
            SERIES II / SIX STRING
          </div>
          <h2 className="text-3xl md:text-5xl font-serif font-black tracking-widest text-neutral-300">
            GUITAR
          </h2>
          <p className="max-w-md text-xs leading-relaxed text-neutral-600 font-sans mt-2">
            Dynamic melodic clarity featuring fluid double and single-cut contours, high-definition clearcoat shaders, and premium custom assemblies.
          </p>
          <div className="flex items-center gap-2 mt-4 text-[9px] font-mono tracking-widest text-amber-600 uppercase font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span>SELECT INSTRUMENT</span>
            <ArrowRight className="w-3 h-3" />
          </div>
        </div>
      </button>

    </div>
  );
};
