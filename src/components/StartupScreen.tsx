import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';

interface StartupScreenProps {
  onSelect: (type: 'guitar' | 'bass') => void;
}

export const StartupScreen: React.FC<StartupScreenProps> = ({ onSelect }) => {
  const [scrollY, setScrollY] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [viewportHeight, setViewportHeight] = useState(800);
  const [windowWidth, setWindowWidth] = useState(1200);

  // Refs for precise dynamic offset calculations
  const heroRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);
  const innovationsRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);

  // Offset states
  const [offsets, setOffsets] = useState({
    hero: 0,
    about: 300,
    innovations: 1100,
    gallery: 2000,
    contact: 3800,
  });

  const [heights, setHeights] = useState({
    about: 800,
    innovations: 900,
    gallery: 2000, // expanded scroll height to provide robust vertical scroll padding
    contact: 500,  // sleek and tight vertical padding
  });

  // Hover states for Specimens
  const [hoveredSpecimen, setHoveredSpecimen] = useState<number | null>(null);

  const calculateOffsets = () => {
    if (containerRef.current) {
      setViewportHeight(window.innerHeight);
      setWindowWidth(window.innerWidth);

      setOffsets({
        hero: heroRef.current?.offsetTop ?? 0,
        about: aboutRef.current?.offsetTop ?? 400,
        innovations: innovationsRef.current?.offsetTop ?? 1200,
        gallery: galleryRef.current?.offsetTop ?? 2100,
        contact: contactRef.current?.offsetTop ?? 3800,
      });

      setHeights({
        about: aboutRef.current?.offsetHeight ?? 800,
        innovations: innovationsRef.current?.offsetHeight ?? 900,
        gallery: galleryRef.current?.offsetHeight ?? 2000,
        contact: contactRef.current?.offsetHeight ?? 500,
      });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        setScrollY(containerRef.current.scrollTop);
      }
    };

    const handleResize = () => {
      calculateOffsets();
    };

    const currentContainer = containerRef.current;
    if (currentContainer) {
      currentContainer.addEventListener('scroll', handleScroll, { passive: true });
    }
    window.addEventListener('resize', handleResize);

    // Initial run & timeout to ensure components render completely
    calculateOffsets();
    const timer = setTimeout(calculateOffsets, 200);

    return () => {
      if (currentContainer) {
        currentContainer.removeEventListener('scroll', handleScroll);
      }
      window.removeEventListener('resize', handleResize);
      clearTimeout(timer);
    };
  }, []);

  // Programmatic smooth scrolling with an exquisite, satisfying decelerating ease-out animation
  const activeScrollAnim = useRef<number | null>(null);
  const scrollToPosition = (targetY: number) => {
    const container = containerRef.current;
    if (!container) return;

    if (activeScrollAnim.current) {
      cancelAnimationFrame(activeScrollAnim.current);
    }

    const startY = container.scrollTop;
    const distance = targetY - startY;
    const duration = 900; // 900ms - perfect length to clearly feel the luxurious decelerating glide
    let startTime: number | null = null;

    // Premium decelerating quintic ease-out curve (feels incredibly smooth)
    const easeOutQuint = (t: number) => 1 - Math.pow(1 - t, 5);

    const step = (currentTime: number) => {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);

      container.scrollTop = startY + distance * easeOutQuint(progress);

      if (progress < 1) {
        activeScrollAnim.current = requestAnimationFrame(step);
      } else {
        activeScrollAnim.current = null;
      }
    };

    activeScrollAnim.current = requestAnimationFrame(step);
  };

  // Click handlers for menu navigation
  const navigateTo = (section: '01' | '02' | '03' | '04' | '05' | '06') => {
    if (section === '01') {
      scrollToPosition(0);
    } else if (section === '02') {
      scrollToPosition(0);
    } else if (section === '03') {
      scrollToPosition(offsets.about - 70);
    } else if (section === '04') {
      scrollToPosition(offsets.innovations - 70);
    } else if (section === '05') {
      scrollToPosition(offsets.gallery - 70);
    } else if (section === '06') {
      scrollToPosition(offsets.contact - 70);
    }
  };

  // Scroll Progress Calculations
  const progress01 = Math.min(1, scrollY / (viewportHeight || 800));

  // 03 / Essence progress
  const progress03 = Math.max(0, Math.min(1, (scrollY - offsets.about + viewportHeight) / (viewportHeight + heights.about)));
  const leftColY = (progress03 - 0.5) * -120;
  const rightColY = (progress03 - 0.5) * 120;

  // 04 / Innovations progress - Align rotations to be mathematically 0deg at exactly the 16th tick (1600px)
  // Each mousewheel tick is typically 100px, making the 16th tick correspond exactly to scrollY = 1600.
  const rotationOffset = scrollY - 1600;
  const card1Rotation = rotationOffset * 0.015;  // 0deg at scrollY = 1600
  const card2Rotation = rotationOffset * -0.02;  // 0deg at scrollY = 1600
  const card3Rotation = rotationOffset * 0.01;   // 0deg at scrollY = 1600

  const card1Style = {
    transform: `translateY(${(progress03 - 0.5) * -40}px) rotate(${card1Rotation}deg) scale(${hoveredSpecimen === 1 ? 1.02 : 1})`,
  };
  const card2Style = {
    transform: `translateY(${(progress03 - 0.5) * -80}px) rotate(${card2Rotation}deg) scale(${hoveredSpecimen === 2 ? 1.02 : 1})`,
  };
  const card3Style = {
    transform: `translateY(${(progress03 - 0.5) * -20}px) rotate(${card3Rotation}deg) scale(${hoveredSpecimen === 3 ? 1.02 : 1})`,
  };

  // 05 / Gallery Horizontal Scroll Progress
  const galleryProgress = Math.max(0, Math.min(1, (scrollY - offsets.gallery) / (heights.gallery - (viewportHeight - 70))));

  // To allow padding after the last image, we multiply the scroll factor such that translation ends before galleryProgress reaches 1.0.
  // We cap the horizontal translation at 100% of maxTranslateWidth when scroll reaches 60% progress, giving 40% scroll padding.
  const translationFactor = Math.min(1.0, galleryProgress / 0.60);
  const maxTranslateWidth = Math.max(200, 2850 - windowWidth);
  const horizontalTranslateX = -translationFactor * maxTranslateWidth;

  // 06 / Portal (Contact) converging gates - closes completely at the center of the screen
  // And it MUST stay closed when scrolled all the way down.
  const contactEntryY = offsets.contact - viewportHeight;
  const contactScrollRange = (containerRef.current?.scrollHeight || 5000) - viewportHeight - contactEntryY;
  const contactProgress = contactScrollRange > 0 ? Math.max(0, Math.min(1, (scrollY - contactEntryY) / contactScrollRange)) : 0;

  // The gates close rapidly as soon as Section 06 enters view, reaching 100% closed (convergeFactor = 0) at 35% of the entry scroll
  const convergeFactor = Math.max(0, 1.0 - (contactProgress / 0.35));
  const leftConvergeX = convergeFactor * -250;
  const rightConvergeX = convergeFactor * 250;

  // Visual Morph Style Calculations for Hero Portal
  const gridLineOpacity = Math.max(0.05, 1 - progress01 * 2.5);
  const textFadeOut = Math.max(0, 1 - progress01 * 3.0);

  // Background drift offsets for hero screen
  const num01Transform = `translate(${progress01 * -220}px, ${progress01 * -80}px) scale(${1 + progress01 * 0.4})`;
  const num02Transform = `translate(${progress01 * 220}px, ${progress01 * -80}px) scale(${1 + progress01 * 0.4})`;

  const splitScale = 1 - progress01 * 0.08;
  const splitTranslateY = progress01 * -50;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 bg-[#000000] text-[#e3e3e5] overflow-y-auto h-screen font-sans select-none rounded-none"
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
      <div className="sticky top-0 left-0 right-0 z-40 bg-[#000000]/90 backdrop-blur-md border-b border-[#111112] py-6 px-8 flex justify-between items-center transition-all duration-300">
        <div className="flex flex-col">
          <span className="text-[8px] tracking-[0.6em] text-[#a39081] font-black uppercase mb-0.5">
            BESPOKE LUTHERIE STUDIO
          </span>
          <h1 className="text-sm font-black tracking-[0.4em] text-[#e3e3e5] uppercase">
            LUXE LUTHIERS
          </h1>
        </div>
        <div className="flex items-center gap-4 md:gap-6 text-[8px] tracking-[0.3em] text-[#5a554f] font-bold uppercase">
          <button onClick={() => navigateTo('01')} className="hover:text-[#a39081] transition-colors focus:outline-none cursor-pointer">01 / ACOUSTIC</button>
          <button onClick={() => navigateTo('02')} className="hover:text-[#a39081] transition-colors focus:outline-none cursor-pointer">02 / ELECTRIC</button>
          <button onClick={() => navigateTo('03')} className="hover:text-[#a39081] transition-colors focus:outline-none cursor-pointer">03 / ESSENCE</button>
          <button onClick={() => navigateTo('04')} className="hover:text-[#a39081] transition-colors focus:outline-none cursor-pointer">04 / INNOVATIONS</button>
          <button onClick={() => navigateTo('05')} className="hover:text-[#a39081] transition-colors focus:outline-none cursor-pointer">05 / GALLERY</button>
          <button onClick={() => navigateTo('06')} className="hover:text-[#a39081] transition-colors focus:outline-none cursor-pointer">06 / PORTAL</button>
        </div>
      </div>

      {/* STAGE 1: MORPHING HERO PORTAL */}
      <div
        ref={heroRef}
        className="relative w-full h-[calc(100vh-70px)] flex flex-col md:flex-row border-b border-[#1c1c1f] overflow-hidden"
        style={{
          transform: `translateY(${splitTranslateY}px) scale(${splitScale})`,
          transition: 'transform 0.1s ease-out'
        }}
      >

        {/* SECTOR 01: ACOUSTIC PORTAL */}
        <button
          onClick={() => onSelect('bass')}
          className="group relative flex-1 flex flex-col justify-end p-8 md:p-16 text-left border-b md:border-b-0 md:border-r border-[#1c1c1f] focus:outline-none transition-all duration-700 hover:bg-[#060607]/80 bg-transparent rounded-none z-20 overflow-hidden cursor-pointer"
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
          className="group relative flex-1 flex flex-col justify-end p-8 md:p-16 text-left focus:outline-none transition-all duration-700 hover:bg-[#060607]/80 bg-transparent rounded-none z-20 overflow-hidden cursor-pointer"
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
        ref={aboutRef}
        id="about"
        className="w-full bg-[#000000] border-b border-[#1c1c1f] py-48 px-6 md:px-20 relative overflow-hidden"
      >
        {/* PERSONALITY SIGNATURE: Premium abstract multi-layer lens & geometry blueprint background */}
        <div className="absolute inset-0 pointer-events-none z-0 opacity-[0.06] flex items-center justify-center">
          <svg
            className="w-[800px] h-[800px] stroke-[#a39081] fill-none"
            viewBox="0 0 200 200"
            style={{
              transform: `rotate(${scrollY * -0.04}deg)`,
              transition: 'transform 0.05s linear',
            }}
          >
            <circle cx="100" cy="100" r="85" strokeWidth="0.5" strokeDasharray="2,4" />
            <circle cx="100" cy="100" r="70" strokeWidth="0.2" />
            <circle cx="100" cy="100" r="55" strokeWidth="0.5" />
            <polygon points="100,5 195,100 100,195 5,100" strokeWidth="0.3" />
            <line x1="100" y1="0" x2="100" y2="200" strokeWidth="0.2" />
            <line x1="0" y1="100" x2="200" y2="100" strokeWidth="0.2" />
          </svg>
        </div>

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

      {/* STAGE 3: THE INNOVATIONS SECTION (04 / SPECIMENS) - LANDO NORRIS "HELMETS" STYLE GALLERY */}
      <section
        ref={innovationsRef}
        id="gallery"
        className="w-full bg-[#050506] border-b border-[#1c1c1f] py-48 px-6 md:px-20 relative overflow-hidden"
      >
        {/* PERSONALITY SIGNATURE: Technical design coordinate wireframe grid (no cringe text) */}
        <div className="absolute inset-0 pointer-events-none z-0 opacity-[0.04]">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#a39081_1px,transparent_1px),linear-gradient(to_bottom,#a39081_1px,transparent_1px)] bg-[size:50px_50px]" />
          <div className="absolute top-[30%] left-[10%] w-[80%] h-[1px] bg-[#a39081]" />
          <div className="absolute top-[70%] left-[10%] w-[80%] h-[1px] bg-[#a39081]" />
        </div>

        <div className="max-w-6xl mx-auto space-y-16 relative z-10">

          <div className="flex flex-col gap-2">
            <span className="text-[10px] tracking-[0.6em] text-[#a39081] font-black uppercase">
              04 / INNOVATIONS
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
                <span className="text-[11px] text-[#423f40] font-mono tracking-widest">M-01</span>
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
                <span className="text-[11px] text-[#423f40] font-mono tracking-widest">M-02</span>
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
                <span className="text-[11px] text-[#423f40] font-mono tracking-widest">M-03</span>
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

      {/* STAGE 4: THE GALLERY SECTION (05 / MASTERBUILT GALLERY) - HORIZONTAL SCROLL ON VERTICAL SCROLL WITH PADDING */}
      <section
        ref={galleryRef}
        id="gallery"
        className="w-full bg-[#000000] relative h-[250vh]"
      >
        <div className="sticky top-[70px] h-[calc(100vh-70px)] w-full overflow-hidden flex flex-col justify-center">

          {/* PERSONALITY SIGNATURE: Fine coordinate frames and crop marks at the top/bottom edges */}
          <div className="absolute top-8 left-12 right-12 flex justify-between text-[8px] font-mono tracking-[0.2em] text-[#423f40] border-b border-[#111112] pb-2">
            <span>[ STAGE field 05 ]</span>
            <span>GALLERY COMPOSITION</span>
          </div>

          <div className="max-w-7xl mx-auto w-full px-12 md:px-20 mb-8 flex flex-col gap-1">
            <span className="text-[10px] tracking-[0.6em] text-[#a39081] font-black uppercase">
              05 / GALLERY
            </span>
            <h3 className="text-2xl md:text-3xl font-black tracking-[0.2em] text-[#e3e3e5] uppercase">
              MASTERBUILT SPECIMENS
            </h3>
          </div>

          {/* Horizontal Track Wrapper */}
          <div className="w-full relative overflow-hidden h-[420px] flex items-center">
            <div
              className="flex gap-8 px-12 md:px-20 absolute left-0 top-0 h-full items-center whitespace-nowrap transition-transform duration-75 ease-out"
              style={{ transform: `translateX(${horizontalTranslateX}px)` }}
            >

              {/* Item 1 */}
              <div className="w-[450px] h-[360px] border border-[#1c1c1f] p-8 bg-[#050506] flex flex-col justify-between shrink-0 relative overflow-hidden group">
                {/* Crop-marks framing */}
                <div className="absolute top-2 left-2 text-[7px] text-[#423f40] font-mono font-bold">+</div>
                <div className="absolute top-2 right-2 text-[7px] text-[#423f40] font-mono font-bold">+</div>
                <div className="absolute bottom-2 left-2 text-[7px] text-[#423f40] font-mono font-bold">+</div>
                <div className="absolute bottom-2 right-2 text-[7px] text-[#423f40] font-mono font-bold">+</div>

                <div className="flex justify-between items-center">
                  <span className="text-[9px] font-mono text-[#a39081] tracking-widest">[ SPECIMEN M-01 ]</span>
                </div>
                <div className="my-auto flex justify-center py-4">
                  <svg className="w-28 h-28 stroke-[#a39081]/40 group-hover:stroke-[#a39081] transition-colors duration-500 fill-none" viewBox="0 0 100 100" strokeWidth="1">
                    <path d="M50,15 C30,15 20,30 20,55 C20,75 35,90 50,90 C65,90 80,75 80,55 C80,30 70,15 50,15 Z" />
                    <circle cx="50" cy="55" r="10" strokeDasharray="2,2" />
                    <line x1="50" y1="15" x2="50" y2="90" strokeDasharray="3,3" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-xs font-black text-[#e3e3e5] tracking-[0.2em] uppercase mb-1">ANODIZED BLACK ACOUSTIC</h4>
                  <p className="text-[8.5px] text-[#5a554f] font-bold tracking-widest uppercase">RAW MATTE RESIN / MULTISCALE 26.5"</p>
                </div>
              </div>

              {/* Item 2 */}
              <div className="w-[450px] h-[360px] border border-[#1c1c1f] p-8 bg-[#050506] flex flex-col justify-between shrink-0 relative overflow-hidden group">
                <div className="absolute top-2 left-2 text-[7px] text-[#423f40] font-mono font-bold">+</div>
                <div className="absolute top-2 right-2 text-[7px] text-[#423f40] font-mono font-bold">+</div>
                <div className="absolute bottom-2 left-2 text-[7px] text-[#423f40] font-mono font-bold">+</div>
                <div className="absolute bottom-2 right-2 text-[7px] text-[#423f40] font-mono font-bold">+</div>

                <div className="flex justify-between items-center">
                  <span className="text-[9px] font-mono text-[#a39081] tracking-widest">[ SPECIMEN M-02 ]</span>
                </div>
                <div className="my-auto flex justify-center py-4">
                  <svg className="w-28 h-28 stroke-[#a39081]/40 group-hover:stroke-[#a39081] transition-colors duration-500 fill-none" viewBox="0 0 100 100" strokeWidth="1">
                    <path d="M50,10 L30,50 L40,90 L60,90 L70,50 Z" />
                    <line x1="50" y1="10" x2="50" y2="90" />
                    <line x1="30" y1="50" x2="70" y2="50" strokeDasharray="4,4" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-xs font-black text-[#e3e3e5] tracking-[0.2em] uppercase mb-1">BASALT RICHLITE SOLID</h4>
                  <p className="text-[8.5px] text-[#5a554f] font-bold tracking-widest uppercase">STEALTH BRUTALIST LACQUER / DOUBLE HB</p>
                </div>
              </div>

              {/* Item 3 */}
              <div className="w-[450px] h-[360px] border border-[#1c1c1f] p-8 bg-[#050506] flex flex-col justify-between shrink-0 relative overflow-hidden group">
                <div className="absolute top-2 left-2 text-[7px] text-[#423f40] font-mono font-bold">+</div>
                <div className="absolute top-2 right-2 text-[7px] text-[#423f40] font-mono font-bold">+</div>
                <div className="absolute bottom-2 left-2 text-[7px] text-[#423f40] font-mono font-bold">+</div>
                <div className="absolute bottom-2 right-2 text-[7px] text-[#423f40] font-mono font-bold">+</div>

                <div className="flex justify-between items-center">
                  <span className="text-[9px] font-mono text-[#a39081] tracking-widest">[ SPECIMEN M-03 ]</span>
                </div>
                <div className="my-auto flex justify-center py-4">
                  <svg className="w-28 h-28 stroke-[#a39081]/40 group-hover:stroke-[#a39081] transition-colors duration-500 fill-none" viewBox="0 0 100 100" strokeWidth="1">
                    <rect x="25" y="15" width="50" height="70" rx="10" />
                    <line x1="25" y1="50" x2="75" y2="50" strokeDasharray="1,1" />
                    <circle cx="50" cy="50" r="15" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-xs font-black text-[#e3e3e5] tracking-[0.2em] uppercase mb-1">SERIES II BRONZE METRIC</h4>
                  <p className="text-[8.5px] text-[#5a554f] font-bold tracking-widest uppercase">OXIDIZED CORE / ACTIVE PREAMP</p>
                </div>
              </div>

              {/* Item 4 */}
              <div className="w-[450px] h-[360px] border border-[#1c1c1f] p-8 bg-[#050506] flex flex-col justify-between shrink-0 relative overflow-hidden group">
                <div className="absolute top-2 left-2 text-[7px] text-[#423f40] font-mono font-bold">+</div>
                <div className="absolute top-2 right-2 text-[7px] text-[#423f40] font-mono font-bold">+</div>
                <div className="absolute bottom-2 left-2 text-[7px] text-[#423f40] font-mono font-bold">+</div>
                <div className="absolute bottom-2 right-2 text-[7px] text-[#423f40] font-mono font-bold">+</div>

                <div className="flex justify-between items-center">
                  <span className="text-[9px] font-mono text-[#a39081] tracking-widest">[ SPECIMEN M-04 ]</span>
                </div>
                <div className="my-auto flex justify-center py-4">
                  <svg className="w-28 h-28 stroke-[#a39081]/40 group-hover:stroke-[#a39081] transition-colors duration-500 fill-none" viewBox="0 0 100 100" strokeWidth="1">
                    <polygon points="50,15 80,45 65,85 35,85 20,45" />
                    <circle cx="50" cy="50" r="25" strokeDasharray="2,5" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-xs font-black text-[#e3e3e5] tracking-[0.2em] uppercase mb-1">CUSTOM SCALE CARBON BASS</h4>
                  <p className="text-[8.5px] text-[#5a554f] font-bold tracking-widest uppercase">HIGH-TENSION CORE / 34" MONOCOQUE</p>
                </div>
              </div>

              {/* Item 5 - New image/wireframe for gallery richness */}
              <div className="w-[450px] h-[360px] border border-[#1c1c1f] p-8 bg-[#050506] flex flex-col justify-between shrink-0 relative overflow-hidden group">
                <div className="absolute top-2 left-2 text-[7px] text-[#423f40] font-mono font-bold">+</div>
                <div className="absolute top-2 right-2 text-[7px] text-[#423f40] font-mono font-bold">+</div>
                <div className="absolute bottom-2 left-2 text-[7px] text-[#423f40] font-mono font-bold">+</div>
                <div className="absolute bottom-2 right-2 text-[7px] text-[#423f40] font-mono font-bold">+</div>

                <div className="flex justify-between items-center">
                  <span className="text-[9px] font-mono text-[#a39081] tracking-widest">[ SPECIMEN M-05 ]</span>
                </div>
                <div className="my-auto flex justify-center py-4">
                  <svg className="w-28 h-28 stroke-[#a39081]/40 group-hover:stroke-[#a39081] transition-colors duration-500 fill-none" viewBox="0 0 100 100" strokeWidth="1">
                    <path d="M20,15 L80,15 L80,85 L20,85 Z" strokeDasharray="4,4" />
                    <path d="M30,25 L70,25 L70,75 L30,75 Z" />
                    <line x1="50" y1="5" x2="50" y2="95" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-xs font-black text-[#e3e3e5] tracking-[0.2em] uppercase mb-1">RECTILINEAR STUDIO MODEL</h4>
                  <p className="text-[8.5px] text-[#5a554f] font-bold tracking-widest uppercase">MINERAL TEXTURED FINISH / HARDTAIL</p>
                </div>
              </div>

              {/* Item 6 - New image/wireframe for gallery richness */}
              <div className="w-[450px] h-[360px] border border-[#1c1c1f] p-8 bg-[#050506] flex flex-col justify-between shrink-0 relative overflow-hidden group">
                <div className="absolute top-2 left-2 text-[7px] text-[#423f40] font-mono font-bold">+</div>
                <div className="absolute top-2 right-2 text-[7px] text-[#423f40] font-mono font-bold">+</div>
                <div className="absolute bottom-2 left-2 text-[7px] text-[#423f40] font-mono font-bold">+</div>
                <div className="absolute bottom-2 right-2 text-[7px] text-[#423f40] font-mono font-bold">+</div>

                <div className="flex justify-between items-center">
                  <span className="text-[9px] font-mono text-[#a39081] tracking-widest">[ SPECIMEN M-06 ]</span>
                </div>
                <div className="my-auto flex justify-center py-4">
                  <svg className="w-28 h-28 stroke-[#a39081]/40 group-hover:stroke-[#a39081] transition-colors duration-500 fill-none" viewBox="0 0 100 100" strokeWidth="1">
                    <ellipse cx="50" cy="50" rx="40" ry="25" />
                    <ellipse cx="50" cy="50" rx="25" ry="15" strokeDasharray="3,3" />
                    <line x1="10" y1="50" x2="90" y2="50" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-xs font-black text-[#e3e3e5] tracking-[0.2em] uppercase mb-1">ELLIPTICAL HOLLOW BODY</h4>
                  <p className="text-[8.5px] text-[#5a554f] font-bold tracking-widest uppercase">BASALT PAPER MATRIX / ARCHED SOUNDBOARD</p>
                </div>
              </div>

            </div>
          </div>

          <div className="absolute bottom-8 left-12 right-12 flex justify-between text-[8px] font-mono tracking-[0.2em] text-[#423f40] border-t border-[#111112] pt-2">
            <span>SCROLL PROGRESS: {Math.round(galleryProgress * 100)}%</span>
          </div>

        </div>
      </section>

      {/* STAGE 5: CONTACT & SOCIALS (06 / PORTAL) - CLEAN ULTRA-MINIMAL COMMUNICATIONS PORTAL */}
      <section
        ref={contactRef}
        id="contact"
        className="w-full bg-[#000000] py-16 px-6 md:px-20 relative overflow-hidden border-t border-[#111112]"
      >
        {/* PERSONALITY SIGNATURE: Refined split sine wave that converges and aligns when the gates lock */}
        <div className="absolute inset-0 pointer-events-none z-0 flex items-center justify-center opacity-[0.08]">
          <div className="w-[800px] h-[100px] flex relative justify-between overflow-hidden">

            {/* Left wave on left side */}
            <div
              className="w-[50%] h-full flex justify-end"
              style={{
                transform: `translateX(${leftConvergeX}px)`,
                transition: 'transform 0.1s ease-out'
              }}
            >
              <svg className="w-full h-full stroke-[#a39081] fill-none" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path d="M 0 50 Q 25 10 50 50 T 100 50 Q 125 10 150 50" strokeWidth="0.5" />
              </svg>
            </div>

            {/* Right wave on right side (offset to match and complete wave perfectly on converge) */}
            <div
              className="w-[50%] h-full flex justify-start"
              style={{
                transform: `translateX(${rightConvergeX}px)`,
                transition: 'transform 0.1s ease-out'
              }}
            >
              <svg className="w-full h-full stroke-[#a39081] fill-none" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path d="M -100 50 Q -75 10 -50 50 T 0 50 Q 25 10 50 50 T 100 50" strokeWidth="0.5" />
              </svg>
            </div>

          </div>
        </div>

        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-0 relative z-10 border border-[#1c1c1f]">

          {/* Left Panel: Converges from the left on scroll */}
          <div
            className="p-12 md:p-16 bg-[#040405] border-b md:border-b-0 md:border-r border-[#1c1c1f] flex flex-col justify-between space-y-12 animate-none"
            style={{
              transform: `translateX(${leftConvergeX}px)`,
              transition: 'transform 0.1s ease-out'
            }}
          >
            <div className="space-y-4">
              <span className="text-[9px] tracking-[0.5em] text-[#a39081] font-black uppercase block">
                06 / THE PORTAL
              </span>
              <h3 className="text-3xl font-black tracking-[0.2em] text-[#e3e3e5] uppercase leading-none">
                CONTACT
              </h3>
            </div>

            <p className="text-xs leading-relaxed text-[#5a554f] uppercase tracking-widest font-black max-w-xs">
              COMMISSIONS ARE EXCLUSIVELY ROUTED VIA SECURE CORRESPONDENCE CHANNELS.
            </p>
          </div>

          {/* Right Panel: Converges from the right on scroll */}
          <div
            className="p-12 md:p-16 bg-[#08080a] flex flex-col justify-between space-y-12"
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