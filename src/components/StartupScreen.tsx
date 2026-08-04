import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';

interface StartupScreenProps {
  onSelect: (type: 'guitar' | 'bass') => void;
}

export const StartupScreen: React.FC<StartupScreenProps> = ({ onSelect }) => {
  const [scrollY, setScrollY] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [viewportHeight, setViewportHeight] = useState(800);

  // Hover states for Specimens (mimicking the Lando Norris helmet selection)
  const [hoveredSpecimen, setHoveredSpecimen] = useState<number | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        setScrollY(containerRef.current.scrollTop);
      }
    };

    const handleResize = () => {
      setViewportHeight(window.innerHeight);
    };

    const currentContainer = containerRef.current;
    if (currentContainer) {
      currentContainer.addEventListener('scroll', handleScroll, { passive: true });
    }
    window.addEventListener('resize', handleResize);
    setViewportHeight(window.innerHeight);

    return () => {
      if (currentContainer) {
        currentContainer.removeEventListener('scroll', handleScroll);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Calculate scroll progress for entry animations
  const progress01 = Math.min(1, scrollY / (viewportHeight || 800));

  // Section progress
  const progress03 = Math.max(0, Math.min(1, (scrollY - 200) / 800));
  const progress04 = Math.max(0, Math.min(1, (scrollY - 800) / 900));
  const progress05 = Math.max(0, Math.min(1, (scrollY - 1500) / 900));

  // Visual Morph Style Calculations for Hero Portal
  const gridLineOpacity = Math.max(0.05, 1 - progress01 * 2.5);
  const textFadeOut = Math.max(0, 1 - progress01 * 3.0);

  // Background drift offsets for hero screen
  const num01Transform = `translate(${progress01 * -220}px, ${progress01 * -80}px) scale(${1 + progress01 * 0.4})`;
  const num02Transform = `translate(${progress01 * 220}px, ${progress01 * -80}px) scale(${1 + progress01 * 0.4})`;

  const splitScale = 1 - progress01 * 0.08;
  const splitTranslateY = progress01 * -50;

  // --- MOTION CALCULATIONS FOR SECTIONS 03, 04, 05 ---

  // Section 03: Dual-direction shear slide
  const leftColY = (progress03 - 0.5) * -120; // left col moves upward
  const rightColY = (progress03 - 0.5) * 120;  // right col moves downward

  // Section 04: Lando Norris "Helmets" style layout transitions.
  // Staggered translate + subtle rotations + scale on scroll
  const card1Style = {
    transform: `translateY(${(progress04 - 0.5) * -70}px) rotate(${-1 + progress04 * 2}deg) scale(${hoveredSpecimen === 1 ? 1.02 : 1})`,
  };
  const card2Style = {
    transform: `translateY(${(progress04 - 0.5) * -140}px) rotate(${1.5 - progress04 * 3}deg) scale(${hoveredSpecimen === 2 ? 1.02 : 1})`,
  };
  const card3Style = {
    transform: `translateY(${(progress04 - 0.5) * -35}px) rotate(${-0.5 + progress04 * 1}deg) scale(${hoveredSpecimen === 3 ? 1.02 : 1})`,
  };

  // Section 05: Clean converging split panels
  const leftConvergeX = (1 - progress05) * -100;
  const rightConvergeX = (1 - progress05) * 100;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 bg-[#000000] text-[#e3e3e5] overflow-y-auto h-screen scroll-smooth font-sans select-none rounded-none"
    >

      {/* BACKGROUND FLOATING GRIDLINES */}
      <div className="absolute inset-0 pointer-events-none z-10" style={{ opacity: gridLineOpacity }}>
        <div className="absolute top-[35%] left-0 w-full h-[1px] bg-[#1c1c1f]" />
        <div className="absolute top-[65%] left-0 w-full h-[1px] bg-[#1c1c1f]" />
        <div className="absolute top-0 left-[50%] w-[1px] h-full bg-[#1c1c1f] hidden md:block" />
        <div className="absolute top-0 left-[8%] w-[1px] h-full bg-[#111112] hidden md:block" />
        <div className="absolute top-0 left-[92%] w-[1px] h-full bg-[#111112] hidden md:block" />
      </div>

      {/* ELEVATED EDITORIAL TOP-BAR */}
      <div className="sticky top-0 left-0 right-0 z-40 bg-[#000000]/85 backdrop-blur-md border-b border-[#111112] py-6 px-8 flex justify-between items-center transition-all duration-300">
        <div className="flex flex-col">
          <span className="text-[8px] tracking-[0.6em] text-[#a39081] font-black uppercase mb-0.5">
            BESPOKE LUTHERIE STUDIO
          </span>
          <h1 className="text-sm font-black tracking-[0.4em] text-[#e3e3e5] uppercase">
            LUXE LUTHIERS
          </h1>
        </div>
        <div className="flex items-center gap-6 text-[8px] tracking-[0.3em] text-[#5a554f] font-bold uppercase">
          <a href="#about" className="hover:text-[#a39081] transition-colors">03 / ESSENCE</a>
          <a href="#gallery" className="hover:text-[#a39081] transition-colors">04 / SPECIMENS</a>
          <a href="#contact" className="hover:text-[#a39081] transition-colors">05 / PORTAL</a>
        </div>
      </div>

      {/* STAGE 1: MORPHING HERO PORTAL */}
      <div
        className="relative w-full h-[calc(100vh-70px)] flex flex-col md:flex-row border-b border-[#1c1c1f] overflow-hidden"
        style={{
          transform: `translateY(${splitTranslateY}px) scale(${splitScale})`,
          transition: 'transform 0.1s ease-out'
        }}
      >

        {/* SECTOR 01: ACOUSTIC PORTAL */}
        <button
          onClick={() => onSelect('bass')}
          className="group relative flex-1 flex flex-col justify-end p-8 md:p-16 text-left border-b md:border-b-0 md:border-r border-[#1c1c1f] focus:outline-none transition-all duration-700 hover:bg-[#060607]/80 bg-transparent rounded-none z-20 overflow-hidden"
        >
          {/* Drifting large number background */}
          <div
            className="absolute top-[20%] left-6 md:left-20 text-[14rem] md:text-[22rem] font-black text-[#0a0a0b] group-hover:text-[#111112] transition-colors duration-500 pointer-events-none z-0 select-none"
            style={{
              transform: num01Transform,
              transition: 'transform 0.1s ease-out'
            }}
          >
            01
          </div>

          <div
            className="absolute left-6 bottom-[10%] origin-left -rotate-90 hidden xl:flex items-center gap-6 text-[7.5px] tracking-[0.35em] text-[#423f40] group-hover:text-[#a39081]/60 uppercase font-black pointer-events-none transition-colors duration-500"
            style={{ opacity: textFadeOut }}
          >
            <span>HOLLOW CORE</span>
            <span>•</span>
            <span>80Hz - 12.0kHz</span>
            <span>•</span>
            <span>MULTISCALE ARCHITECTURE</span>
            <span>•</span>
            <span>CARBON RESONATOR</span>
          </div>

          <div className="relative z-20 flex flex-col gap-2 rounded-none max-w-lg mt-auto">
            <div className="text-[8.5px] tracking-[0.4em] text-[#5a554f] font-black uppercase">
              SERIES I
            </div>
            <h2 className="text-2xl md:text-4xl font-black tracking-[0.25em] text-[#a39081] uppercase transition-all duration-500 group-hover:text-[#e3e3e5] group-hover:translate-x-2">
              ACOUSTIC
            </h2>
            <p className="text-[10px] leading-relaxed text-[#5a554f] mt-1.5 uppercase tracking-wider font-bold group-hover:text-[#78726a] transition-colors">
              Resonant architectural structures utilizing tensioned carbon fiber panels, precise acoustic porting, and customizable scale layouts.
            </p>
            <div className="flex items-center gap-2 mt-4 text-[8px] tracking-[0.3em] text-[#a39081] uppercase font-black opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span>INITIALIZE SPECIFICATION</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#a39081]" />
            </div>
          </div>
        </button>

        {/* SECTOR 02: ELECTRIC PORTAL */}
        <button
          onClick={() => onSelect('guitar')}
          className="group relative flex-1 flex flex-col justify-end p-8 md:p-16 text-left focus:outline-none transition-all duration-700 hover:bg-[#060607]/80 bg-transparent rounded-none z-20 overflow-hidden"
        >
          {/* Drifting large number background */}
          <div
            className="absolute top-[20%] right-6 md:right-20 text-[14rem] md:text-[22rem] font-black text-[#0a0a0b] group-hover:text-[#111112] transition-colors duration-500 pointer-events-none z-0 select-none"
            style={{
              transform: num02Transform,
              transition: 'transform 0.1s ease-out'
            }}
          >
            02
          </div>

          <div
            className="absolute right-6 bottom-[10%] origin-right rotate-90 hidden xl:flex items-center gap-6 text-[7.5px] tracking-[0.35em] text-[#423f40] group-hover:text-[#a39081]/60 uppercase font-black pointer-events-none transition-colors duration-500"
            style={{ opacity: textFadeOut }}
          >
            <span>ACTIVE PREAMP</span>
            <span>•</span>
            <span>50Hz - 8.0kHz</span>
            <span>•</span>
            <span>SOLID WOODS</span>
            <span>•</span>
            <span>HUMBUCKING LAYOUT</span>
          </div>

          <div className="relative z-20 flex flex-col gap-2 rounded-none max-w-lg mt-auto">
            <div className="text-[8.5px] tracking-[0.4em] text-[#5a554f] font-black uppercase">
              SERIES II
            </div>
            <h2 className="text-2xl md:text-4xl font-black tracking-[0.25em] text-[#a39081] uppercase transition-all duration-500 group-hover:text-[#e3e3e5] group-hover:translate-x-2">
              ELECTRIC
            </h2>
            <p className="text-[10px] leading-relaxed text-[#5a554f] mt-1.5 uppercase tracking-wider font-bold group-hover:text-[#78726a] transition-colors">
              High-output electromagnetic circuits, modular configurations, premium lacquer clears, and custom tone filters.
            </p>
            <div className="flex items-center gap-2 mt-4 text-[8px] tracking-[0.3em] text-[#a39081] uppercase font-black opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span>INITIALIZE SPECIFICATION</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#a39081]" />
            </div>
          </div>
        </button>

      </div>

      {/* STAGE 2: THE ABOUT SECTION (03 / THE PHILOSOPHY) - Stark High-Fashion Editorial statement */}
      <section
        id="about"
        className="w-full bg-[#000000] border-b border-[#1c1c1f] py-40 px-6 md:px-20 relative overflow-hidden"
      >
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 relative z-10">

          {/* Left Column: Slides Upwards */}
          <div
            className="flex flex-col justify-center space-y-6"
            style={{
              transform: `translateY(${leftColY}px)`,
              transition: 'transform 0.1s ease-out'
            }}
          >
            <span className="text-[10px] tracking-[0.6em] text-[#a39081] font-black uppercase">
              03 / ESSENCE
            </span>

            <h3 className="text-4xl md:text-5xl font-black tracking-[0.15em] text-[#e3e3e5] uppercase leading-none">
              PURE ANATOMY.
            </h3>

            <div className="w-12 h-[1px] bg-[#a39081]/30" />
          </div>

          {/* Right Column: Slides Downwards */}
          <div
            className="flex flex-col justify-center space-y-8 border-l border-[#1c1c1f] pl-8 md:pl-16"
            style={{
              transform: `translateY(${rightColY}px)`,
              transition: 'transform 0.1s ease-out'
            }}
          >
            <p className="text-sm md:text-md leading-relaxed text-[#8a857e] uppercase tracking-widest font-black">
              WE SEEK ABSOLUTE STRUCTURAL RIGOR. FORM STRIPPED BARE TO EXPOSE PERFORMANCE RADICALITY.
            </p>
          </div>

        </div>
      </section>

      {/* STAGE 3: THE GALLERY (04 / SPECIMENS) - LANDO NORRIS "HELMETS" STYLE GALLERY */}
      <section
        id="gallery"
        className="w-full bg-[#050506] border-b border-[#1c1c1f] py-40 px-6 md:px-20 relative overflow-hidden"
      >
        <div className="max-w-6xl mx-auto space-y-16 relative z-10">

          <div className="flex flex-col gap-2">
            <span className="text-[10px] tracking-[0.6em] text-[#a39081] font-black uppercase">
              04 / SPECIMENS
            </span>
            <h3 className="text-3xl md:text-4xl font-black tracking-[0.2em] text-[#e3e3e5] uppercase">
              BLUEPRINT REVELATIONS
            </h3>
          </div>

          {/* Lando Norris-inspired grid of specimens: clean background, stark wireframes, hover overlays */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">

            {/* Model M-01 / CARBON */}
            <div
              onMouseEnter={() => setHoveredSpecimen(1)}
              onMouseLeave={() => setHoveredSpecimen(null)}
              style={{ ...card1Style, transition: 'transform 0.15s ease-out, border-color 0.4s, background-color 0.4s' }}
              className={`border p-8 bg-[#000000] flex flex-col justify-between h-[450px] rounded-none relative overflow-hidden group cursor-pointer ${
                hoveredSpecimen === 1 ? 'border-[#a39081] bg-[#09090b]' : 'border-[#1c1c1f]'
              }`}
            >
              {/* Giant clean index overlay on hover */}
              <div className={`absolute -right-6 -bottom-10 text-[10rem] font-black transition-opacity duration-500 pointer-events-none select-none ${
                hoveredSpecimen === 1 ? 'text-[#121215]/40 opacity-100' : 'text-[#09090b]/10 opacity-0'
              }`}>
                01
              </div>

              <div className="flex justify-between items-start">
                <span className="text-[11px] text-[#423f40] font-mono tracking-widest">M-01 / RESONANCE</span>
                <span className="text-[9px] text-[#a39081] font-mono font-bold">[ CARBON ]</span>
              </div>

              {/* Precise Vector Schematic Visual representation */}
              <div className="my-auto flex justify-center py-4">
                <svg className={`w-32 h-32 transition-transform duration-700 ${
                  hoveredSpecimen === 1 ? 'scale-110 rotate-12 stroke-[#a39081]' : 'stroke-[#2a2a2f]'
                }`} viewBox="0 0 100 100" fill="none" strokeWidth="1">
                  <circle cx="50" cy="50" r="40" strokeDasharray="3,3" />
                  <circle cx="50" cy="50" r="28" />
                  <line x1="50" y1="10" x2="50" y2="90" />
                  <line x1="10" y1="50" x2="90" y2="50" />
                </svg>
              </div>

              <div className="space-y-2 relative z-20">
                <div className="h-[1px] bg-gradient-to-r from-[#1c1c1f] to-transparent w-full" />
                <h4 className="font-black tracking-[0.25em] text-[#e3e3e5] text-sm uppercase">
                  CARBON SOUNDBOARD
                </h4>
                <p className="text-[9px] text-[#5a554f] group-hover:text-[#8a857e] transition-colors uppercase font-bold tracking-wider leading-relaxed">
                  Monocoque high-tension carbon shell structures maximizing acoustic projection dynamics.
                </p>
              </div>
            </div>

            {/* Model M-02 / COMPOSITE */}
            <div
              onMouseEnter={() => setHoveredSpecimen(2)}
              onMouseLeave={() => setHoveredSpecimen(null)}
              style={{ ...card2Style, transition: 'transform 0.15s ease-out, border-color 0.4s, background-color 0.4s' }}
              className={`border p-8 bg-[#000000] flex flex-col justify-between h-[450px] rounded-none relative overflow-hidden group cursor-pointer ${
                hoveredSpecimen === 2 ? 'border-[#a39081] bg-[#09090b]' : 'border-[#1c1c1f]'
              }`}
            >
              <div className={`absolute -right-6 -bottom-10 text-[10rem] font-black transition-opacity duration-500 pointer-events-none select-none ${
                hoveredSpecimen === 2 ? 'text-[#121215]/40 opacity-100' : 'text-[#09090b]/10 opacity-0'
              }`}>
                02
              </div>

              <div className="flex justify-between items-start">
                <span className="text-[11px] text-[#423f40] font-mono tracking-widest">M-02 / INTEGRITY</span>
                <span className="text-[9px] text-[#a39081] font-mono font-bold">[ COMPOSITE ]</span>
              </div>

              {/* Solid Matrix Lattice Visual representation */}
              <div className="my-auto flex justify-center py-4">
                <svg className={`w-32 h-32 transition-transform duration-700 ${
                  hoveredSpecimen === 2 ? 'scale-110 rotate-[-12deg] stroke-[#a39081]' : 'stroke-[#2a2a2f]'
                }`} viewBox="0 0 100 100" fill="none" strokeWidth="1">
                  <rect x="20" y="20" width="60" height="60" strokeDasharray="2,2" />
                  <line x1="20" y1="20" x2="80" y2="80" />
                  <line x1="80" y1="20" x2="20" y2="80" />
                  <circle cx="50" cy="50" r="10" />
                </svg>
              </div>

              <div className="space-y-2 relative z-20">
                <div className="h-[1px] bg-gradient-to-r from-[#1c1c1f] to-transparent w-full" />
                <h4 className="font-black tracking-[0.25em] text-[#e3e3e5] text-sm uppercase">
                  RICHLITE MATRIX
                </h4>
                <p className="text-[9px] text-[#5a554f] group-hover:text-[#8a857e] transition-colors uppercase font-bold tracking-wider leading-relaxed">
                  Basalt dense paper composites optimized for complete structural and thermal integrity.
                </p>
              </div>
            </div>

            {/* Model M-03 / METRIC */}
            <div
              onMouseEnter={() => setHoveredSpecimen(3)}
              onMouseLeave={() => setHoveredSpecimen(null)}
              style={{ ...card3Style, transition: 'transform 0.15s ease-out, border-color 0.4s, background-color 0.4s' }}
              className={`border p-8 bg-[#000000] flex flex-col justify-between h-[450px] rounded-none relative overflow-hidden group cursor-pointer ${
                hoveredSpecimen === 3 ? 'border-[#a39081] bg-[#09090b]' : 'border-[#1c1c1f]'
              }`}
            >
              <div className={`absolute -right-6 -bottom-10 text-[10rem] font-black transition-opacity duration-500 pointer-events-none select-none ${
                hoveredSpecimen === 3 ? 'text-[#121215]/40 opacity-100' : 'text-[#09090b]/10 opacity-0'
              }`}>
                03
              </div>

              <div className="flex justify-between items-start">
                <span className="text-[11px] text-[#423f40] font-mono tracking-widest">M-03 / PROFILE</span>
                <span className="text-[9px] text-[#a39081] font-mono font-bold">[ METRICS ]</span>
              </div>

              {/* Fanned Fretboard Layout Diagram Visual representation */}
              <div className="my-auto flex justify-center py-4">
                <svg className={`w-32 h-32 transition-transform duration-700 ${
                  hoveredSpecimen === 3 ? 'scale-110 stroke-[#a39081]' : 'stroke-[#2a2a2f]'
                }`} viewBox="0 0 100 100" fill="none" strokeWidth="1">
                  <line x1="15" y1="20" x2="15" y2="80" />
                  <line x1="30" y1="22" x2="33" y2="78" />
                  <line x1="45" y1="24" x2="51" y2="76" />
                  <line x1="60" y1="26" x2="69" y2="74" />
                  <line x1="75" y1="28" x2="87" y2="72" />
                </svg>
              </div>

              <div className="space-y-2 relative z-20">
                <div className="h-[1px] bg-gradient-to-r from-[#1c1c1f] to-transparent w-full" />
                <h4 className="font-black tracking-[0.25em] text-[#e3e3e5] text-sm uppercase">
                  FANNED FRETS
                </h4>
                <p className="text-[9px] text-[#5a554f] group-hover:text-[#8a857e] transition-colors uppercase font-bold tracking-wider leading-relaxed">
                  Perfected fanned multi-scale spacing for customized register tensions.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* STAGE 4: CONTACT & SOCIALS (05 / INQUIRIES) - CLEAN ULTRA-MINIMAL COMMUNICATIONS PORTAL */}
      <section
        id="contact"
        className="w-full bg-[#000000] py-40 px-6 md:px-20 relative overflow-hidden"
      >
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-0 relative z-10 border border-[#1c1c1f]">

          {/* Left Panel: Converges from the left on scroll */}
          <div
            className="p-12 md:p-20 bg-[#040405] border-b md:border-b-0 md:border-r border-[#1c1c1f] flex flex-col justify-between space-y-12 animate-none"
            style={{
              transform: `translateX(${leftConvergeX}px)`,
              transition: 'transform 0.1s ease-out'
            }}
          >
            <div className="space-y-4">
              <span className="text-[9px] tracking-[0.5em] text-[#a39081] font-black uppercase block">
                05 / THE PORTAL
              </span>
              <h3 className="text-3xl font-black tracking-[0.2em] text-[#e3e3e5] uppercase leading-none">
                CONTACT
              </h3>
            </div>

            <p className="text-xs leading-relaxed text-[#5a554f] uppercase tracking-widest font-black max-w-xs">
              COMMISSIONS ARE EXCLUSIVELY ROUTED VIA DIGITAL BLUEPRINT SEQUENCES. SECURE CORRESPONDENCE CHANNELS ARE LISTED OPPOSITE.
            </p>
          </div>

          {/* Right Panel: Converges from the right on scroll */}
          <div
            className="p-12 md:p-20 bg-[#08080a] flex flex-col justify-between space-y-12"
            style={{
              transform: `translateX(${rightConvergeX}px)`,
              transition: 'transform 0.1s ease-out'
            }}
          >
            <div className="space-y-6">
              <span className="text-[8px] tracking-[0.4em] text-[#423f40] font-black uppercase block">
                CHANNELS
              </span>

              <div className="space-y-4 text-[11px] font-black text-[#8a857e] tracking-widest uppercase">
                <a
                  href="mailto:studio@luxeluthiers.com"
                  className="flex items-center justify-between group border-b border-[#1c1c1f] pb-3 hover:text-[#e3e3e5] transition-colors"
                >
                  <span>STUDIO@LUXELUTHIERS.COM</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#a39081]/40 group-hover:translate-x-1.5 transition-transform" />
                </a>

                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between group border-b border-[#1c1c1f] pb-3 hover:text-[#e3e3e5] transition-colors"
                >
                  <span>INSTAGRAM</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#a39081]/40 group-hover:translate-x-1.5 transition-transform" />
                </a>

                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between group border-b border-[#1c1c1f] pb-3 hover:text-[#e3e3e5] transition-colors"
                >
                  <span>TWITTER</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#a39081]/40 group-hover:translate-x-1.5 transition-transform" />
                </a>
              </div>
            </div>

            <div className="text-[8px] text-[#423f40] uppercase font-bold tracking-widest space-y-1 pt-6 border-t border-[#1c1c1f]">
              <div>GENÈVE, SWITZERLAND</div>
              <div>© {new Date().getFullYear()} LUXE LUTHIERS</div>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
};