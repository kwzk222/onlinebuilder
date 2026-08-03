import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, Mail, MessageSquare, Compass, Shield, Activity, HardDrive, Cpu } from 'lucide-react';

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

  // Calculate morph factors based on scroll
  const scrollRatio = Math.min(1, scrollY / (viewportHeight || 800));

  // Parallax ratio for lower sections
  const totalScrollableHeight = containerRef.current ? (containerRef.current.scrollHeight - viewportHeight) : 2400;
  const generalScrollRatio = scrollY / (totalScrollableHeight || 2400);

  // Visual Morph Style Calculations
  const gridLineOpacity = Math.max(0.05, 1 - scrollRatio * 2.5);
  const textFadeOut = Math.max(0, 1 - scrollRatio * 3.0);

  // Background drift offsets for hero screen
  const num01Transform = `translate(${scrollRatio * -220}px, ${scrollRatio * -80}px) scale(${1 + scrollRatio * 0.4})`;
  const num02Transform = `translate(${scrollRatio * 220}px, ${scrollRatio * -80}px) scale(${1 + scrollRatio * 0.4})`;

  // Parallax background drift offsets for lower sections (03, 04, 05)
  const num03Transform = `translate(${generalScrollRatio * -160}px, ${generalScrollRatio * -60}px) scale(${1.1 - generalScrollRatio * 0.25})`;
  const num04Transform = `translate(${generalScrollRatio * 200}px, ${generalScrollRatio * -120}px) scale(${1.0 + generalScrollRatio * 0.35})`;
  const num05Transform = `translate(${generalScrollRatio * -220}px, ${generalScrollRatio * -140}px) scale(${1.2 - generalScrollRatio * 0.2})`;

  // Central architectural panel scale/collapse
  const splitScale = 1 - scrollRatio * 0.08;
  const splitTranslateY = scrollRatio * -50;

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
          <a href="#about" className="hover:text-[#a39081] transition-colors">03 / PHILOSOPHY</a>
          <a href="#gallery" className="hover:text-[#a39081] transition-colors">04 / SPECIMENS</a>
          <a href="#contact" className="hover:text-[#a39081] transition-colors">05 / INQUIRIES</a>
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
          onClick={() => onSelect('bass')} // Maps to bass procedural parameters
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

          {/* Redesigned Side Technical Specifications - Positioned Lower to Prevent Viewport Overflows */}
          <div
            className="absolute left-6 bottom-[10%] origin-left -rotate-90 hidden xl:flex items-center gap-6 text-[7.5px] tracking-[0.35em] text-[#423f40] group-hover:text-[#a39081]/60 uppercase font-black pointer-events-none transition-colors duration-500"
            style={{ opacity: textFadeOut }}
          >
            <span>CHAMBER LAYOUT: HOLLOW CORE</span>
            <span>•</span>
            <span>TONAL SPECTRUM: 80Hz - 12.0kHz</span>
            <span>•</span>
            <span>MULTISCALE ARCHITECTURE</span>
            <span>•</span>
            <span>CARBON FIBER RESONATOR</span>
          </div>

          {/* Interactive Portal Specs */}
          <div className="relative z-20 flex flex-col gap-2 rounded-none max-w-lg mt-auto">
            <div className="text-[8.5px] tracking-[0.4em] text-[#5a554f] font-black uppercase">
              SERIES I / HOLLOW CORE
            </div>
            <h2 className="text-2xl md:text-4xl font-black tracking-[0.25em] text-[#a39081] uppercase transition-all duration-500 group-hover:text-[#e3e3e5] group-hover:translate-x-2">
              ACOUSTIC
            </h2>
            <p className="text-[10px] leading-relaxed text-[#5a554f] mt-1.5 uppercase tracking-wider font-bold group-hover:text-[#78726a] transition-colors">
              Resonant soundboard architectures built using high-tension monocoque carbon fiber panels, acoustic chamber ports, and customized multiscale playability.
            </p>
            <div className="flex items-center gap-2 mt-4 text-[8px] tracking-[0.3em] text-[#a39081] uppercase font-black opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span>INITIALIZE SPECIFICATION</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#a39081]" />
            </div>
          </div>
        </button>

        {/* SECTOR 02: ELECTRIC PORTAL */}
        <button
          onClick={() => onSelect('guitar')} // Maps to guitar parameters
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

          {/* Redesigned Side Technical Specifications - Positioned Lower to Prevent Viewport Overflows */}
          <div
            className="absolute right-6 bottom-[10%] origin-right rotate-90 hidden xl:flex items-center gap-6 text-[7.5px] tracking-[0.35em] text-[#423f40] group-hover:text-[#a39081]/60 uppercase font-black pointer-events-none transition-colors duration-500"
            style={{ opacity: textFadeOut }}
          >
            <span>ACTIVE 18V PREAMP CONTROLS</span>
            <span>•</span>
            <span>TONAL SPECTRUM: 50Hz - 8.0kHz</span>
            <span>•</span>
            <span>SOLID WOOD LACQUERS</span>
            <span>•</span>
            <span>ELECTROMAGNETIC HUMBUCKERS</span>
          </div>

          {/* Interactive Portal Specs */}
          <div className="relative z-20 flex flex-col gap-2 rounded-none max-w-lg mt-auto">
            <div className="text-[8.5px] tracking-[0.4em] text-[#5a554f] font-black uppercase">
              SERIES II / SOLID SOLIDUS
            </div>
            <h2 className="text-2xl md:text-4xl font-black tracking-[0.25em] text-[#a39081] uppercase transition-all duration-500 group-hover:text-[#e3e3e5] group-hover:translate-x-2">
              ELECTRIC
            </h2>
            <p className="text-[10px] leading-relaxed text-[#5a554f] mt-1.5 uppercase tracking-wider font-bold group-hover:text-[#78726a] transition-colors">
              High-output electromagnetic pickups, modular double-cutaway bodies, premium lacquer clearcoats, and active 18V analog tone filter circuits.
            </p>
            <div className="flex items-center gap-2 mt-4 text-[8px] tracking-[0.3em] text-[#a39081] uppercase font-black opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span>INITIALIZE SPECIFICATION</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#a39081]" />
            </div>
          </div>
        </button>

      </div>

      {/* STAGE 2: THE ABOUT SECTION (03 / THE PHILOSOPHY) - ASYMMETRICAL LUXURY LAYOUT */}
      <section
        id="about"
        className="w-full bg-[#030304] border-b border-[#1c1c1f] py-32 px-6 md:px-20 relative overflow-hidden"
      >
        {/* PARALLAX DRIFTING "03" IDENTIFIER */}
        <div
          className="absolute top-[10%] left-[25%] text-[18rem] md:text-[28rem] font-black text-[#070708] pointer-events-none select-none z-0"
          style={{
            transform: num03Transform,
            transition: 'transform 0.1s ease-out'
          }}
        >
          03
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 relative z-10">

          {/* Vertical Editorial Column */}
          <div className="lg:col-span-4 flex flex-col justify-between border-r border-[#1c1c1f] pr-8 pb-8 lg:pb-0">
            <div className="space-y-4">
              <span className="text-[9px] tracking-[0.5em] text-[#a39081] font-extrabold uppercase block">
                STATEMENT OF INTENT
              </span>
              <h3 className="text-3xl md:text-4xl font-black tracking-[0.2em] text-[#e3e3e5] uppercase leading-none">
                03 / PHILOSOPHY
              </h3>
            </div>

            <div className="mt-12 lg:mt-auto space-y-2 text-[8px] text-[#423f40] uppercase font-black tracking-widest">
              <div>[ REGISTRY : ATELIER-03 ]</div>
              <div>[ COORDINATES : 46.2044° N, 6.1432° E ]</div>
              <div>[ STATUS : ONLINE / RAW SECURE ]</div>
            </div>
          </div>

          {/* Large Editorial Headline & Detailed Interactive Columns */}
          <div className="lg:col-span-8 space-y-12">
            <div className="space-y-6">
              <h4 className="text-xl md:text-2xl font-black tracking-[0.1em] text-[#a39081] uppercase leading-relaxed max-w-3xl">
                WE SEEK EXTREME ARCHITECTURAL EXPRESSION. BRUTALIST RAW STRUCTURAL RIGOR INTEGRATED WITH ABSOLUTE PERFORMANCE FIDELITY.
              </h4>
              <p className="text-xs md:text-[13px] leading-relaxed text-[#8a857e] uppercase tracking-wider font-bold max-w-2xl">
                We reject the industrial homogenization of instrument crafting. Every monocoque Carbon-Core and recycled Richlite alternative we sculpt serves as an extension of architectural anatomy. No compromise, zero unnecessary ornamentation.
              </p>
            </div>

            {/* Asymmetrical grid with hover cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">

              <div className="border border-[#1c1c1f] p-6 bg-[#000000] hover:border-[#a39081]/30 transition-all duration-500 flex flex-col gap-4 group">
                <div className="flex justify-between items-center">
                  <Shield className="w-5 h-5 text-[#a39081]/40 group-hover:text-[#a39081] transition-colors" />
                  <span className="text-[8px] font-mono text-[#423f40]">03.01 / ANATOMY</span>
                </div>
                <div className="space-y-1.5">
                  <span className="block text-[10px] text-[#e3e3e5] tracking-widest font-black uppercase group-hover:text-[#a39081] transition-colors">
                    MONOCOQUE MATERIAL PURITY
                  </span>
                  <p className="text-[9px] text-[#5a554f] uppercase tracking-wide font-bold leading-relaxed">
                    We employ FSC®-certified Richlite paper-composites and dense monocoque carbon fibers, leaving old growth rain forests completely untouched.
                  </p>
                </div>
              </div>

              <div className="border border-[#1c1c1f] p-6 bg-[#000000] hover:border-[#a39081]/30 transition-all duration-500 flex flex-col gap-4 group">
                <div className="flex justify-between items-center">
                  <Activity className="w-5 h-5 text-[#a39081]/40 group-hover:text-[#a39081] transition-colors" />
                  <span className="text-[8px] font-mono text-[#423f40]">03.02 / TUNING</span>
                </div>
                <div className="space-y-1.5">
                  <span className="block text-[10px] text-[#e3e3e5] tracking-widest font-black uppercase group-hover:text-[#a39081] transition-colors">
                    MICROTONAL GEOMETRIES
                  </span>
                  <p className="text-[9px] text-[#5a554f] uppercase tracking-wide font-bold leading-relaxed">
                    Infinite customizable mathematical intervals replace standard Western 12-tet temperaments seamlessly with proportional visual alignments.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* STAGE 3: THE GALLERY (04 / RAW SPECIMENS) - HIGH-END GALLERY BLUEPRINTS */}
      <section
        id="gallery"
        className="w-full bg-[#000000] border-b border-[#1c1c1f] py-32 px-6 md:px-20 relative overflow-hidden"
      >
        {/* PARALLAX DRIFTING "04" IDENTIFIER */}
        <div
          className="absolute top-[5%] right-[20%] text-[18rem] md:text-[28rem] font-black text-[#070708] pointer-events-none select-none z-0"
          style={{
            transform: num04Transform,
            transition: 'transform 0.1s ease-out'
          }}
        >
          04
        </div>

        <div className="max-w-6xl mx-auto space-y-16 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="flex flex-col gap-1.5">
              <span className="text-[9px] tracking-[0.5em] text-[#a39081] font-extrabold uppercase">
                DESIGN BLUEPRINTS & RENDER ARCHIVES
              </span>
              <h3 className="text-3xl md:text-4xl font-black tracking-[0.2em] text-[#e3e3e5] uppercase leading-none">
                04 / SPECIMENS
              </h3>
            </div>
            <p className="text-[10px] text-[#5a554f] font-mono uppercase tracking-widest">[ SPECIMEN CATALOG : ACTIVE REVEAL_MODE ]</p>
          </div>

          {/* High-end Asymmetric Blueprint Gallery Cards with Interactive Hover State */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            {/* Specimen 01 */}
            <div
              onMouseEnter={() => setHoveredSpecimen(1)}
              onMouseLeave={() => setHoveredSpecimen(null)}
              className={`border p-8 bg-[#040405] relative flex flex-col justify-between h-[360px] transition-all duration-500 rounded-none ${
                hoveredSpecimen === 1 ? 'border-[#a39081]/60 shadow-[0_0_20px_rgba(163,144,129,0.05)] bg-[#070709]' : 'border-[#1c1c1f]'
              }`}
            >
              <div className="flex justify-between items-start">
                <span className="text-[10px] text-[#5a554f] font-mono">SPEC_NO. 001/A</span>
                <HardDrive className={`w-4 h-4 transition-colors duration-500 ${hoveredSpecimen === 1 ? 'text-[#a39081]' : 'text-[#2a2a2f]'}`} />
              </div>

              <div className="my-auto flex flex-col items-center">
                <div className={`w-32 h-32 border border-dashed rounded-full flex items-center justify-center transition-all duration-700 ${
                  hoveredSpecimen === 1 ? 'border-[#a39081]/40 rotate-45 scale-110' : 'border-[#1c1c1f]'
                }`}>
                  <Compass className={`w-12 h-12 transition-colors duration-500 ${hoveredSpecimen === 1 ? 'text-[#a39081]' : 'text-[#2a2a2f]'}`} />
                </div>
              </div>

              <div className="space-y-2">
                <span className="block text-[10px] text-[#a39081] font-black tracking-widest uppercase">
                  CARBON SOUNDBOARD
                </span>
                <p className="text-[9px] text-[#5a554f] uppercase font-black tracking-wider leading-relaxed">
                  Monocoque Carbon Core with zero internal wood bracing, producing flawless acoustic resonance dynamics.
                </p>
                <div className={`text-[8px] font-mono text-[#a39081]/80 transition-opacity duration-300 ${
                  hoveredSpecimen === 1 ? 'opacity-100' : 'opacity-0'
                }`}>
                  [ HOLLOW VOLUME : 78.4% • FREQ CAP : 12kHz ]
                </div>
              </div>
            </div>

            {/* Specimen 02 */}
            <div
              onMouseEnter={() => setHoveredSpecimen(2)}
              onMouseLeave={() => setHoveredSpecimen(null)}
              className={`border p-8 bg-[#040405] relative flex flex-col justify-between h-[360px] transition-all duration-500 rounded-none ${
                hoveredSpecimen === 2 ? 'border-[#a39081]/60 shadow-[0_0_20px_rgba(163,144,129,0.05)] bg-[#070709]' : 'border-[#1c1c1f]'
              }`}
            >
              <div className="flex justify-between items-start">
                <span className="text-[10px] text-[#5a554f] font-mono">SPEC_NO. 002/E</span>
                <Cpu className={`w-4 h-4 transition-colors duration-500 ${hoveredSpecimen === 2 ? 'text-[#a39081]' : 'text-[#2a2a2f]'}`} />
              </div>

              <div className="my-auto space-y-1.5 text-center">
                <div className={`text-[2.2rem] font-black tracking-[0.15em] transition-all duration-500 ${
                  hoveredSpecimen === 2 ? 'text-[#a39081] scale-105' : 'text-[#1a1a1c]'
                }`}>
                  RICHLITE
                </div>
                <div className="flex justify-center gap-2">
                  <span className="w-3.5 h-3.5 bg-[#0d0d0f] border border-[#a39081]/20" />
                  <span className="w-3.5 h-3.5 bg-[#42312b] border border-[#a39081]/20" />
                  <span className="w-3.5 h-3.5 bg-[#505459] border border-[#a39081]/20" />
                </div>
              </div>

              <div className="space-y-2">
                <span className="block text-[10px] text-[#a39081] font-black tracking-widest uppercase">
                  SUSTAINABLE COMPOSITES
                </span>
                <p className="text-[9px] text-[#5a554f] uppercase font-black tracking-wider leading-relaxed">
                  FSC® certified paper composite fretboards offering premium dense response comparable to ebony.
                </p>
                <div className={`text-[8px] font-mono text-[#a39081]/80 transition-opacity duration-300 ${
                  hoveredSpecimen === 2 ? 'opacity-100' : 'opacity-0'
                }`}>
                  [ COMPRESSION STRENGTH : 24,000 PSI ]
                </div>
              </div>
            </div>

            {/* Specimen 03 */}
            <div
              onMouseEnter={() => setHoveredSpecimen(3)}
              onMouseLeave={() => setHoveredSpecimen(null)}
              className={`border p-8 bg-[#040405] relative flex flex-col justify-between h-[360px] transition-all duration-500 rounded-none ${
                hoveredSpecimen === 3 ? 'border-[#a39081]/60 shadow-[0_0_20px_rgba(163,144,129,0.05)] bg-[#070709]' : 'border-[#1c1c1f]'
              }`}
            >
              <div className="flex justify-between items-start">
                <span className="text-[10px] text-[#5a554f] font-mono">SPEC_NO. 003/X</span>
                <Activity className={`w-4 h-4 transition-colors duration-500 ${hoveredSpecimen === 3 ? 'text-[#a39081]' : 'text-[#2a2a2f]'}`} />
              </div>

              <div className="my-auto flex flex-col items-center">
                <div className={`w-full flex flex-col gap-1.5 items-center transition-all duration-500 ${
                  hoveredSpecimen === 3 ? 'scale-110 opacity-100' : 'opacity-40'
                }`}>
                  <div className="w-32 h-[1.5px] bg-[#a39081] rotate-[-5deg]" />
                  <div className="w-32 h-[1.5px] bg-[#a39081] rotate-[-2deg]" />
                  <div className="w-32 h-[1.5px] bg-[#a39081] rotate-0" />
                  <div className="w-32 h-[1.5px] bg-[#a39081] rotate-[3deg]" />
                  <div className="w-32 h-[1.5px] bg-[#a39081] rotate-[7deg]" />
                </div>
              </div>

              <div className="space-y-2">
                <span className="block text-[10px] text-[#a39081] font-black tracking-widest uppercase">
                  FANNED FRETS SYSTEM
                </span>
                <p className="text-[9px] text-[#5a554f] uppercase font-black tracking-wider leading-relaxed">
                  Tailored separate multiscale layouts balancing bass-side tension against treble-side clarity.
                </p>
                <div className={`text-[8px] font-mono text-[#a39081]/80 transition-opacity duration-300 ${
                  hoveredSpecimen === 3 ? 'opacity-100' : 'opacity-0'
                }`}>
                  [ SCALE RATIO : 25.5" TO 25.0" FANNING ]
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* STAGE 4: CONTACT & SOCIALS (05 / INQUIRIES) - HIGH-FASHION COMMUNICATIONS ATELIER */}
      <section
        id="contact"
        className="w-full bg-[#050506] py-32 px-6 md:px-20 relative overflow-hidden"
      >
        {/* PARALLAX DRIFTING "05" IDENTIFIER */}
        <div
          className="absolute bottom-[20%] left-[10%] text-[18rem] md:text-[28rem] font-black text-[#070708] pointer-events-none select-none z-0"
          style={{
            transform: num05Transform,
            transition: 'transform 0.1s ease-out'
          }}
        >
          05
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 relative z-10">

          <div className="lg:col-span-5 space-y-8 flex flex-col justify-between">
            <div className="space-y-4">
              <span className="text-[9px] tracking-[0.5em] text-[#a39081] font-extrabold uppercase block">
                ACQUISITIONS & ATELIER BOOKINGS
              </span>
              <h3 className="text-3xl md:text-4xl font-black tracking-[0.2em] text-[#e3e3e5] uppercase leading-none">
                05 / INQUIRIES
              </h3>
            </div>

            <p className="text-xs md:text-[13px] leading-relaxed text-[#5a554f] uppercase tracking-wider font-bold max-w-md">
              Our studio operates strictly via bespoke booking and individual slot allotment. Complete a custom digital blueprint configuration above to initialize your commission order sequence.
            </p>

            {/* Live secure status ledger */}
            <div className="hidden lg:flex items-center gap-3">
              <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping" />
              <span className="text-[9px] font-mono text-emerald-400 uppercase tracking-widest">Atelier booking queue open for {new Date().getFullYear()} / q4</span>
            </div>
          </div>

          {/* Contact Details & Links with beautiful underline slide hover effects */}
          <div className="lg:col-span-7 flex flex-col justify-end space-y-10 border-t lg:border-t-0 lg:border-l border-[#1c1c1f] pt-12 lg:pt-0 lg:pl-16">
            <div className="space-y-6">
              <h4 className="text-[11px] tracking-[0.4em] text-[#a39081] font-black uppercase">
                SECURE COMMUNICATIONS HUB
              </h4>

              <div className="space-y-4 text-[11px] uppercase font-black text-[#8a857e] tracking-widest">

                <a
                  href="mailto:atelier@luxeluthiers.com"
                  className="flex items-center justify-between group border-b border-[#111112] pb-3 hover:text-[#e3e3e5] transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <Mail className="w-4 h-4 text-[#a39081]/60" />
                    <span>ATELIER@LUXELUTHIERS.COM</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#a39081]/40 group-hover:translate-x-1.5 transition-transform" />
                </a>

                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between group border-b border-[#111112] pb-3 hover:text-[#e3e3e5] transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <svg className="w-4 h-4 text-[#a39081]/60 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="2">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                    </svg>
                    <span>@LUXE_LUTHIERS</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#a39081]/40 group-hover:translate-x-1.5 transition-transform" />
                </a>

                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between group border-b border-[#111112] pb-3 hover:text-[#e3e3e5] transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <svg className="w-4 h-4 text-[#a39081]/60 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="2">
                      <path d="M4 4l11.733 16h4.267l-11.733 -16z"></path>
                      <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772"></path>
                    </svg>
                    <span>@LUXE_STUDIO</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#a39081]/40 group-hover:translate-x-1.5 transition-transform" />
                </a>

                <div className="flex items-center justify-between border-b border-[#111112] pb-3 text-[#5a554f]">
                  <div className="flex items-center gap-4">
                    <MessageSquare className="w-4 h-4 text-[#5a554f]/40" />
                    <span>SECURE TELEGRAM CHANNEL</span>
                  </div>
                  <span className="text-[8px] font-mono text-[#5a554f]/60">[ COMM_OFFLINE ]</span>
                </div>

              </div>
            </div>

            <div className="text-[8.5px] text-[#423f40] uppercase font-bold tracking-widest space-y-1 border-t border-[#111112] pt-6">
              <div>LUXE LUTHIERS INTERNATIONAL S.A.</div>
              <div>RUE DU BRUTALISME 48, GENÈVE, SWITZERLAND</div>
              <div>© {new Date().getFullYear()} ALL RIGHTS RESERVED</div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};