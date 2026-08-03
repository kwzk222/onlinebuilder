import React from 'react';
import { ArrowRight, ShieldCheck, Cpu } from 'lucide-react';

interface StartupScreenProps {
  onSelect: (type: 'guitar' | 'bass') => void;
}

export const StartupScreen: React.FC<StartupScreenProps> = ({ onSelect }) => {
  return (
    <div className="fixed inset-0 z-50 bg-[#070709] text-neutral-100 flex flex-col md:flex-row overflow-hidden font-sans select-none">

      {/* Decorative Luxury Brutalist gridlines */}
      <div className="absolute inset-0 pointer-events-none z-10">
        {/* Subtle Horizontal & Vertical Lines */}
        <div className="absolute top-[20%] left-0 w-full h-[1px] bg-neutral-900/40" />
        <div className="absolute top-[80%] left-0 w-full h-[1px] bg-neutral-900/40" />
        <div className="absolute top-0 left-[50%] w-[1px] h-full bg-neutral-900/40 hidden md:block" />
        <div className="absolute top-0 left-[25%] w-[1px] h-full bg-neutral-900/40 hidden md:block" />
        <div className="absolute top-0 left-[75%] w-[1px] h-full bg-neutral-900/40 hidden md:block" />
      </div>

      {/* Floating Center Brand Header */}
      <div className="absolute top-8 left-0 right-0 z-30 flex flex-col items-center justify-center text-center px-4 pointer-events-none">
        <span className="text-[10px] tracking-[0.4em] text-amber-500/80 font-mono font-bold uppercase mb-2">
          BESPOKE LUTHERIE STUDIO
        </span>
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-[0.25em] text-neutral-100 font-serif drop-shadow-lg">
          LUXE LUTHIERS
        </h1>
        <div className="h-[1px] w-24 bg-gradient-to-r from-transparent via-amber-500/40 to-transparent mt-4" />
      </div>

      {/* LEFT HALF: BASS */}
      <button
        onClick={() => onSelect('bass')}
        className="group relative flex-1 flex flex-col justify-end p-8 md:p-16 text-left border-b md:border-b-0 md:border-r border-neutral-900/60 focus:outline-none transition-all duration-700 hover:bg-neutral-950"
      >
        {/* Subtle Radial Glow on Hover */}
        <div className="absolute inset-0 bg-radial from-amber-950/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />

        {/* Abstract Architectural Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-0" />

        {/* Cinematic Vertical Line on Left */}
        <div className="absolute left-6 top-1/4 bottom-1/4 w-[1px] bg-gradient-to-b from-transparent via-neutral-800 to-transparent group-hover:via-amber-500/30 transition-all duration-700" />

        {/* Content */}
        <div className="relative z-20 flex flex-col gap-3">
          <div className="text-[11px] font-mono tracking-[0.3em] text-neutral-500 group-hover:text-amber-500/70 transition-colors">
            SERIES I / FOUR STRING
          </div>
          <h2 className="text-4xl md:text-6xl font-serif font-black tracking-widest text-neutral-200 group-hover:text-neutral-100 transition-colors">
            BASS
          </h2>
          <p className="max-w-md text-xs leading-relaxed text-neutral-500 group-hover:text-neutral-400 transition-colors font-sans mt-2">
            Deep acoustic architecture with expanded neck scale length, solid resonant low-end body cores, and custom high-output bar pickups. Hand-built for profound vibration.
          </p>
          <div className="flex items-center gap-2 mt-4 text-[10px] font-mono tracking-widest text-amber-500/80 uppercase font-bold opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-500">
            <span>ENTER DESIGN STAGE</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Backing Large Lettering (Avant-garde Brutalist Detail) */}
        <div className="absolute right-0 bottom-0 translate-y-1/3 translate-x-1/4 text-[14rem] md:text-[22rem] font-serif font-black text-neutral-900/05 select-none pointer-events-none group-hover:text-amber-500/[0.02] transition-colors duration-700">
          B
        </div>
      </button>

      {/* RIGHT HALF: GUITAR */}
      <button
        onClick={() => onSelect('guitar')}
        className="group relative flex-1 flex flex-col justify-end p-8 md:p-16 text-left focus:outline-none transition-all duration-700 hover:bg-neutral-950"
      >
        {/* Subtle Radial Glow on Hover */}
        <div className="absolute inset-0 bg-radial from-amber-950/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />

        {/* Abstract Architectural Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-0" />

        {/* Cinematic Vertical Line on Right */}
        <div className="absolute right-6 top-1/4 bottom-1/4 w-[1px] bg-gradient-to-b from-transparent via-neutral-800 to-transparent group-hover:via-amber-500/30 transition-all duration-700" />

        {/* Content */}
        <div className="relative z-20 flex flex-col gap-3">
          <div className="text-[11px] font-mono tracking-[0.3em] text-neutral-500 group-hover:text-amber-500/70 transition-colors">
            SERIES II / SIX STRING
          </div>
          <h2 className="text-4xl md:text-6xl font-serif font-black tracking-widest text-neutral-200 group-hover:text-neutral-100 transition-colors">
            GUITAR
          </h2>
          <p className="max-w-md text-xs leading-relaxed text-neutral-500 group-hover:text-neutral-400 transition-colors font-sans mt-2">
            Dynamic melodic clarity featuring fluid double and single-cut contours, high-definition clearcoat shaders, and premium custom multi-pickup assemblies.
          </p>
          <div className="flex items-center gap-2 mt-4 text-[10px] font-mono tracking-widest text-amber-500/80 uppercase font-bold opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-500">
            <span>ENTER DESIGN STAGE</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Backing Large Lettering (Avant-garde Brutalist Detail) */}
        <div className="absolute right-0 bottom-0 translate-y-1/3 translate-x-1/4 text-[14rem] md:text-[22rem] font-serif font-black text-neutral-900/05 select-none pointer-events-none group-hover:text-amber-500/[0.02] transition-colors duration-700">
          G
        </div>
      </button>

      {/* Floating Bottom Quality Assurance Statement */}
      <div className="absolute bottom-6 left-0 right-0 z-30 hidden md:flex items-center justify-between px-12 pointer-events-none text-neutral-600 text-[9px] font-mono tracking-widest uppercase">
        <div className="flex items-center gap-2">
          <Cpu className="w-3 h-3 text-amber-500/40" />
          <span>60 FPS procedural rendering</span>
        </div>
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-3 h-3 text-amber-500/40" />
          <span>Masterbuilt in the UK</span>
        </div>
      </div>

    </div>
  );
};
