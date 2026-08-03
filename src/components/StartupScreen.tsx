import React from 'react';
import { ArrowRight } from 'lucide-react';

interface StartupScreenProps {
  onSelect: (type: 'guitar' | 'bass') => void;
}

export const StartupScreen: React.FC<StartupScreenProps> = ({ onSelect }) => {
  return (
    <div className="fixed inset-0 z-50 bg-[#000000] text-[#e3e3e5] flex flex-col md:flex-row overflow-hidden font-sans select-none rounded-none">

      {/* Stark architectural structural gridlines */}
      <div className="absolute inset-0 pointer-events-none z-10">
        <div className="absolute top-[40%] left-0 w-full h-[1px] bg-[#1c1c1f]" />
        <div className="absolute top-[60%] left-0 w-full h-[1px] bg-[#1c1c1f]" />
        <div className="absolute top-0 left-[50%] w-[1px] h-full bg-[#1c1c1f] hidden md:block" />
        <div className="absolute top-0 left-[10%] w-[1px] h-full bg-[#111112] hidden md:block" />
        <div className="absolute top-0 left-[90%] w-[1px] h-full bg-[#111112] hidden md:block" />
      </div>

      {/* Elegant minimalist sand-gray header */}
      <div className="absolute top-12 left-0 right-0 z-30 flex flex-col items-center justify-center text-center px-4 pointer-events-none rounded-none">
        <span className="text-[9px] tracking-[0.8em] text-[#a39081] font-black uppercase mb-1">
          BESPOKE LUTHERIE STUDIO
        </span>
        <h1 className="text-xl md:text-3xl font-black tracking-[0.6em] text-[#e3e3e5] uppercase">
          LUXE LUTHIERS
        </h1>
        <div className="w-16 h-[2px] bg-[#a39081]/30 mt-3" />
      </div>

      {/* LEFT HALF: BASS */}
      <button
        onClick={() => onSelect('bass')}
        className="group relative flex-1 flex flex-col justify-end p-8 md:p-20 text-left border-b md:border-b-0 md:border-r border-[#1c1c1f] focus:outline-none transition-all duration-700 hover:bg-[#0c0c0d] rounded-none"
      >
        {/* Large back numbering */}
        <div className="absolute top-1/3 left-10 md:left-24 text-[12rem] md:text-[18rem] font-extrabold text-[#111112] group-hover:text-[#1a1a1c] transition-colors duration-500 pointer-events-none z-0">
          01
        </div>

        {/* Vertical Tech-Spec Sidebar */}
        <div className="absolute left-4 top-1/2 -translate-y-1/2 rotate-270 origin-left hidden xl:flex items-center gap-4 text-[7.5px] tracking-[0.3em] text-[#3e3c3d] uppercase font-bold pointer-events-none">
          <span>SCALE: 34.00 IN</span>
          <span>•</span>
          <span>TUNING: E-A-D-G</span>
          <span>•</span>
          <span>TENSION: HIGH</span>
          <span>•</span>
          <span>SPECTRUM: 40Hz - 1.2kHz</span>
        </div>

        <div className="relative z-20 flex flex-col gap-2 rounded-none">
          <div className="text-[9px] tracking-[0.4em] text-[#5a554f] font-bold uppercase">
            SERIES I / FOUR STRING
          </div>
          <h2 className="text-3xl md:text-5xl font-black tracking-[0.3em] text-[#a39081] uppercase transition-all duration-500 group-hover:text-[#e3e3e5] group-hover:translate-x-2">
            BASS
          </h2>
          <p className="max-w-md text-[11px] leading-relaxed text-[#5a554f] mt-2 uppercase tracking-wider font-semibold">
            Deep acoustic architecture with expanded neck scale length, solid resonant low-end body cores, and custom high-output bar pickups.
          </p>
          <div className="flex items-center gap-2 mt-4 text-[9px] tracking-[0.3em] text-[#a39081] uppercase font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span>SELECT ARCHITECTURE</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#a39081]" />
          </div>
        </div>
      </button>

      {/* RIGHT HALF: GUITAR */}
      <button
        onClick={() => onSelect('guitar')}
        className="group relative flex-1 flex flex-col justify-end p-8 md:p-20 text-left focus:outline-none transition-all duration-700 hover:bg-[#0c0c0d] rounded-none"
      >
        {/* Large back numbering */}
        <div className="absolute top-1/3 right-10 md:right-24 text-[12rem] md:text-[18rem] font-extrabold text-[#111112] group-hover:text-[#1a1a1c] transition-colors duration-500 pointer-events-none z-0">
          02
        </div>

        {/* Vertical Tech-Spec Sidebar */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 -rotate-270 origin-right hidden xl:flex items-center gap-4 text-[7.5px] tracking-[0.3em] text-[#3e3c3d] uppercase font-bold pointer-events-none">
          <span>SCALE: 25.50 IN</span>
          <span>•</span>
          <span>TUNING: E-A-D-G-B-E</span>
          <span>•</span>
          <span>TENSION: MEDIUM</span>
          <span>•</span>
          <span>SPECTRUM: 80Hz - 8.0kHz</span>
        </div>

        <div className="relative z-20 flex flex-col gap-2 rounded-none">
          <div className="text-[9px] tracking-[0.4em] text-[#5a554f] font-bold uppercase">
            SERIES II / SIX STRING
          </div>
          <h2 className="text-3xl md:text-5xl font-black tracking-[0.3em] text-[#a39081] uppercase transition-all duration-500 group-hover:text-[#e3e3e5] group-hover:translate-x-2">
            GUITAR
          </h2>
          <p className="max-w-md text-[11px] leading-relaxed text-[#5a554f] mt-2 uppercase tracking-wider font-semibold">
            Dynamic melodic clarity featuring fluid double and single-cut contours, high-definition clearcoat shaders, and premium custom assemblies.
          </p>
          <div className="flex items-center gap-2 mt-4 text-[9px] tracking-[0.3em] text-[#a39081] uppercase font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span>SELECT ARCHITECTURE</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#a39081]" />
          </div>
        </div>
      </button>

    </div>
  );
};
