import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, Mail } from 'lucide-react';

interface StartupScreenProps {
  onSelect: (type: 'guitar' | 'bass') => void;
}

export const StartupScreen: React.FC<StartupScreenProps> = ({ onSelect }) => {
  const [scrollY, setScrollY] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [viewportHeight, setViewportHeight] = useState(800);

  // Hover states for Specimens
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

  // Calculate scroll ratios for custom entry animations
  const progress01 = Math.min(1, scrollY / (viewportHeight || 800));

  // Section 03 progress: active scroll range between 300px and 1200px
  const progress03 = Math.max(0, Math.min(1, (scrollY - 200) / 800));

  // Section 04 progress: active scroll range between 900px and 1900px
  const progress04 = Math.max(0, Math.min(1, (scrollY - 800) / 900));

  // Section 05 progress: active scroll range between 1500px and 2500px
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
  const leftColY = (progress03 - 0.5) * -150; // left col moves upward
  const rightColY = (progress03 - 0.5) * 150;  // right col moves downward

  // Section 04: Unique staggered heights + rotations on scroll
  const card1Style = {
    transform: `translateY(${(progress04 - 0.5) * -110}px) rotate(${-2 + progress04 * 4}deg)`,
  };
  const card2Style = {
    transform: `translateY(${(progress04 - 0.5) * -240}px) rotate(${3 - progress04 * 5}deg)`,
  };
  const card3Style = {
    transform: `translateY(${(progress04 - 0.5) * -60}px) rotate(${-1 + progress04 * 2}deg)`,
  };

  // Section 05: Converging splits (left and right meet in the center)
  const leftConvergeX = (1 - progress05) * -140;
  const rightConvergeX = (1 - progress05) * 140;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 bg-[#000000] text-[#e3e3e5] overflow-y-auto h-screen scroll-smooth font-sans select-none rounded-none"
    >

      {/* BACKGROUND FLOATING GRIDLINES - MORPHS OPACITY ON SCROLL */}
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

      {/* STAGE 2: THE ABOUT SECTION (03 / THE PHILOSOPHY) - DUAL DIRECTION PARALLAX SHEAR */}
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
              03 / THE ESSENCE
            </span>
            <h3 className="text-4xl md:text-5xl font-black tracking-[0.15em] text-[#e3e3e5] uppercase leading-none">
              PURE ANATOMY.
            </h3>
            <p className="text-xs md:text-sm leading-relaxed text-[#5a554f] uppercase tracking-wider font-bold max-w-sm">
              STRUCTURAL RIGOR REJECTS SUPERFICIAL DECORATION. EACH PIECE EMERGES AS A HIGH-PERFORMANCE OBJECT SCULPTED FOR TIMELESSNESS.
            </p>
          </div>

          {/* Right Column: Slides Downwards */}
          <div
            className="flex flex-col justify-center space-y-8 border-l border-[#1c1c1f] pl-8 md:pl-16"
            style={{
              transform: `translateY(${rightColY}px)`,
              transition: 'transform 0.1s ease-out'
            }}
          >
            <p className="text-xs leading-relaxed text-[#8a857e] uppercase tracking-widest font-black">
              DESIGNED IN GENÈVE. ZERO EXTRA DETAIL. MONOCOQUE CARBON MATRIX AND DENSE COMPOSITE MATERIALS COMBINE IN UNCOMPROMISING FORM.
            </p>
            <div className="space-y-1 text-[8px] text-[#423f40] uppercase font-bold tracking-widest">
              <div>[ COORDINATES : 46.2044° N, 6.1432° E ]</div>
              <div>[ STATUS : MONOLITHIC RAW ]</div>
            </div>
          </div>

        </div>
      </section>

      {/* STAGE 3: THE GALLERY (04 / RAW SPECIMENS) - STAGGERED FLOATING CARDS */}
      <section
        id="gallery"
        className="w-full bg-[#050506] border-b border-[#1c1c1f] py-40 px-6 md:px-20 relative overflow-hidden"
      >
        <div className="max-w-6xl mx-auto space-y-20 relative z-10">

          <div className="flex flex-col gap-2">
            <span className="text-[10px] tracking-[0.6em] text-[#a39081] font-black uppercase">
              04 / SPECIMENS
            </span>
            <h3 className="text-3xl md:text-4xl font-black tracking-[0.2em] text-[#e3e3e5] uppercase">
              ARCHITECTURAL OBJECTS
            </h3>
          </div>

          {/* Staggered Cards with distinct custom translates & tilts on scroll */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8">

            {/* Specimen 01: Low translation, slight negative tilt */}
            <div
              onMouseEnter={() => setHoveredSpecimen(1)}
              onMouseLeave={() => setHoveredSpecimen(null)}
              style={{ ...card1Style, transition: 'transform 0.1s ease-out, border-color 0.5s, background-color 0.5s' }}
              className={`border p-8 bg-[#000000] flex flex-col justify-between h-[380px] rounded-none ${
                hoveredSpecimen === 1 ? 'border-[#a39081]/60 bg-[#0c0c0e]' : 'border-[#1c1c1f]'
              }`}
            >
              <div className="flex justify-between items-start">
                <span className="text-[10px] text-[#423f40] font-mono">SPEC_001_CARBON</span>
                <span className="text-[8px] text-[#5a554f] font-mono">[ 78% VOID ]</span>
              </div>

              <div className="my-auto text-center font-black tracking-[0.2em] text-[#e3e3e5] text-lg uppercase">
                CARBON CORE
              </div>

              <div className="space-y-1">
                <p className="text-[9px] text-[#5a554f] uppercase font-bold tracking-wider leading-relaxed">
                  Monocoque high-tension carbon acoustics with zero interior bracing.
                </p>
              </div>
            </div>

            {/* Specimen 02: High translation, sharp positive tilt */}
            <div
              onMouseEnter={() => setHoveredSpecimen(2)}
              onMouseLeave={() => setHoveredSpecimen(null)}
              style={{ ...card2Style, transition: 'transform 0.1s ease-out, border-color 0.5s, background-color 0.5s' }}
              className={`border p-8 bg-[#000000] flex flex-col justify-between h-[380px] rounded-none ${
                hoveredSpecimen === 2 ? 'border-[#a39081]/60 bg-[#0c0c0e]' : 'border-[#1c1c1f]'
              }`}
            >
              <div className="flex justify-between items-start">
                <span className="text-[10px] text-[#423f40] font-mono">SPEC_002_RICHLITE</span>
                <span className="text-[8px] text-[#5a554f] font-mono">[ 24k PSI ]</span>
              </div>

              <div className="my-auto text-center font-black tracking-[0.2em] text-[#e3e3e5] text-lg uppercase">
                RICHLITE MATRIX
              </div>

              <div className="space-y-1">
                <p className="text-[9px] text-[#5a554f] uppercase font-bold tracking-wider leading-relaxed">
                  Dense composite paper matrix ensuring exceptional structural response.
                </p>
              </div>
            </div>

            {/* Specimen 03: Moderate translation, subtle rotation */}
            <div
              onMouseEnter={() => setHoveredSpecimen(3)}
              onMouseLeave={() => setHoveredSpecimen(null)}
              style={{ ...card3Style, transition: 'transform 0.1s ease-out, border-color 0.5s, background-color 0.5s' }}
              className={`border p-8 bg-[#000000] flex flex-col justify-between h-[380px] rounded-none ${
                hoveredSpecimen === 3 ? 'border-[#a39081]/60 bg-[#0c0c0e]' : 'border-[#1c1c1f]'
              }`}
            >
              <div className="flex justify-between items-start">
                <span className="text-[10px] text-[#423f40] font-mono">SPEC_003_MULTISCALE</span>
                <span className="text-[8px] text-[#5a554f] font-mono">[ FAN_SCALE ]</span>
              </div>

              <div className="my-auto text-center font-black tracking-[0.2em] text-[#e3e3e5] text-lg uppercase">
                FANNED METRICS
              </div>

              <div className="space-y-1">
                <p className="text-[9px] text-[#5a554f] uppercase font-bold tracking-wider leading-relaxed">
                  Dual-length multiscale layout balancing high tension response.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* STAGE 4: CONTACT & SOCIALS (05 / INQUIRIES) - CONVERGING BRUTALIST PANELS */}
      <section
        id="contact"
        className="w-full bg-[#000000] py-40 px-6 md:px-20 relative overflow-hidden"
      >
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-0 relative z-10 border border-[#1c1c1f]">

          {/* Left Panel: Converges from the left on scroll */}
          <div
            className="p-12 md:p-20 bg-[#040405] border-b md:border-b-0 md:border-r border-[#1c1c1f] flex flex-col justify-between space-y-12"
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
              DIGITAL COMMISSIONS ARE ENTERED VIA CONFIGURATION SEQUENCES. FOR PERSONAL DIRECT INQUIRIES, CONNECT VIA THE SECURE CHANNELS OPPOSITE.
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
                DIRECT CHANNELS
              </span>

              <div className="space-y-3 text-[11px] font-black text-[#8a857e] tracking-widest uppercase">
                <a
                  href="mailto:studio@luxeluthiers.com"
                  className="flex items-center justify-between group border-b border-[#1c1c1f] pb-2 hover:text-[#e3e3e5] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Mail className="w-3.5 h-3.5 text-[#a39081]/60" />
                    <span>STUDIO@LUXELUTHIERS.COM</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-[#a39081]/40 group-hover:translate-x-1.5 transition-transform" />
                </a>

                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between group border-b border-[#1c1c1f] pb-2 hover:text-[#e3e3e5] transition-colors"
                >
                  <span>INSTAGRAM</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#a39081]/40 group-hover:translate-x-1.5 transition-transform" />
                </a>

                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between group border-b border-[#1c1c1f] pb-2 hover:text-[#e3e3e5] transition-colors"
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