import React from 'react';
import { ArrowRight } from 'lucide-react';

interface StartupScreenProps {
  onSelect: (type: 'guitar' | 'bass') => void;
}

export const StartupScreen: React.FC<StartupScreenProps> = ({ onSelect }) => {
  return (
    <div className="fixed inset-0 z-50 bg-[#0c0c0d] text-[#e3e3e5] flex flex-col md:flex-row overflow-hidden font-sans select-none rounded-none">

      {/* Stark architectural structural gridlines */}
      <div className="absolute inset-0 pointer-events-none z-10">
        <div className="absolute top-[35%] left-0 w-full h-[1px] bg-[#1a1a1c]" />
        <div className="absolute top-[65%] left-0 w-full h-[1px] bg-[#1a1a1c]" />
        <div className="absolute top-0 left-[50%] w-[1px] h-full bg-[#1a1a1c] hidden md:block" />
      </div>

      {/* Elegant minimalist sand-gray header */}
      <div className="absolute top-12 left-0 right-0 z-30 flex flex-col items-center justify-center text-center px-4 pointer-events-none rounded-none">
        <span className="text-[9px] tracking-[0.6em] text-[#a39081] font-bold uppercase mb-2">
          BESPOKE LUTHERIE STUDIO
        </span>
        <h1 className="text-xl md:text-2xl font-black tracking-[0.5em] text-[#e3e3e5] uppercase">
          LUXE LUTHIERS
        </h1>
      </div>

      {/* LEFT HALF: BASS */}
      <button
        onClick={() => onSelect('bass')}
        className="group relative flex-1 flex flex-col justify-end p-8 md:p-16 text-left border-b md:border-b-0 md:border-r border-[#1a1a1c] focus:outline-none transition-colors duration-500 hover:bg-[#121213] rounded-none"
      >
        <div className="relative z-20 flex flex-col gap-2 rounded-none">
          <div className="text-[9px] tracking-[0.4em] text-[#5a554f] font-bold uppercase">
            SERIES I / FOUR STRING
          </div>
          <h2 className="text-2xl md:text-4xl font-extrabold tracking-[0.3em] text-[#a39081] uppercase">
            BASS
          </h2>
          <p className="max-w-md text-[11px] leading-relaxed text-[#5a554f] mt-1 uppercase tracking-wider font-medium">
            Deep acoustic architecture with expanded neck scale length, solid resonant low-end body cores, and custom high-output bar pickups.
          </p>
          <div className="flex items-center gap-2 mt-4 text-[9px] tracking-[0.3em] text-[#a39081] uppercase font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span>SELECT ARCHITECTURE</span>
            <ArrowRight className="w-3 h-3 text-[#a39081]" />
          </div>
        </div>
      </button>

      {/* RIGHT HALF: GUITAR */}
      <button
        onClick={() => onSelect('guitar')}
        className="group relative flex-1 flex flex-col justify-end p-8 md:p-16 text-left focus:outline-none transition-colors duration-500 hover:bg-[#121213] rounded-none"
      >
        <div className="relative z-20 flex flex-col gap-2 rounded-none">
          <div className="text-[9px] tracking-[0.4em] text-[#5a554f] font-bold uppercase">
            SERIES II / SIX STRING
          </div>
          <h2 className="text-2xl md:text-4xl font-extrabold tracking-[0.3em] text-[#a39081] uppercase">
            GUITAR
          </h2>
          <p className="max-w-md text-[11px] leading-relaxed text-[#5a554f] mt-1 uppercase tracking-wider font-medium">
            Dynamic melodic clarity featuring fluid double and single-cut contours, high-definition clearcoat shaders, and premium custom assemblies.
          </p>
          <div className="flex items-center gap-2 mt-4 text-[9px] tracking-[0.3em] text-[#a39081] uppercase font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span>SELECT ARCHITECTURE</span>
            <ArrowRight className="w-3 h-3 text-[#a39081]" />
          </div>
        </div>
      </button>

    </div>
  );
};
