import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';

interface StartupScreenProps {
  onSelect: (type: 'guitar' | 'bass') => void;
}

export const StartupScreen: React.FC<StartupScreenProps> = ({ onSelect }) => {
  const [viewportHeight, setViewportHeight] = useState(800);
  const [windowWidth, setWindowWidth] = useState(1200);

  // Tick States: each panel takes exactly 8 ticks to clear.
  // Panel 0: Hero (01 / 02)
  // Panel 1: Essence (03) -> reached at tick 8
  // Panel 2: Innovations (04) -> reached at tick 16
  // Panel 3: Gallery (05) -> reached at tick 24 (horizontal scroll starts)
  // Panel 3 Gallery scroll ends -> reached at tick 32 (horizontal scroll ends)
  // Panel 4: Portal (06) -> reached at tick 40
  const [targetTick, setTargetTick] = useState(0);
  const [currentTick, setCurrentTick] = useState(0);

  // Hover states for Specimens
  const [hoveredSpecimen, setHoveredSpecimen] = useState<number | null>(null);

  // Gallery dynamic horizontal track width
  const trackRef = useRef<HTMLDivElement>(null);
  const [maxTranslate, setMaxTranslate] = useState(1600);

  useEffect(() => {
    const handleResize = () => {
      setViewportHeight(window.innerHeight);
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    // Small delay to ensure render is complete before measuring track width
    const timer = setTimeout(() => {
      if (trackRef.current) {
        setMaxTranslate(Math.max(200, trackRef.current.scrollWidth - window.innerWidth));
      }
    }, 300);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timer);
    };
  }, [windowWidth]);

  // Dual-mode smooth interpolation loop
  const navAnimRef = useRef<{
    active: boolean;
    startTime: number;
    startTick: number;
    targetTick: number;
  }>({
    active: false,
    startTime: 0,
    startTick: 0,
    targetTick: 0,
  });

  const triggerNavAnimation = (target: number) => {
    navAnimRef.current = {
      active: true,
      startTime: Date.now(),
      startTick: currentTick,
      targetTick: target,
    };
    setTargetTick(target);
  };

  useEffect(() => {
    let animId: number;
    const animate = () => {
      const nav = navAnimRef.current;
      if (nav.active) {
        const elapsed = Date.now() - nav.startTime;
        const duration = 1200; // 1.2s luxury click glide
        const progress = Math.min(1, elapsed / duration);

        // Cubic ease-in-out curve
        const easeInOutCubic = progress < 0.5
          ? 4 * progress * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 3) / 2;

        setCurrentTick(nav.startTick + (nav.targetTick - nav.startTick) * easeInOutCubic);

        if (progress >= 1) {
          nav.active = false;
        }
      } else {
        setCurrentTick((prev) => {
          const diff = targetTick - prev;
          if (Math.abs(diff) < 0.005) {
            return targetTick;
          }
          return prev + diff * 0.12; // satisfying, luxurious decelerating ease-out glide
        });
      }
      animId = requestAnimationFrame(animate);
    };
    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, [targetTick, currentTick]);

  // Wheel interceptor for perfect tick-based navigation
  const deltaAccumulator = useRef(0);
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    // Interrupt menu navigation animation if user scrolls manually
    navAnimRef.current.active = false;

    let dy = e.deltaY;
    if (e.deltaMode === 1) dy *= 33; // lines
    if (e.deltaMode === 2) dy *= 400; // pages

    deltaAccumulator.current += dy;

    // Slow down scrolling while navigating inside the horizontal Gallery (ticks 24 to 32)
    const isInsideGallery = targetTick >= 24 && targetTick < 32;
    const threshold = isInsideGallery ? 180 : 100;

    if (deltaAccumulator.current >= threshold) {
      const ticks = Math.floor(deltaAccumulator.current / threshold);
      setTargetTick((prev) => Math.min(40, prev + ticks));
      deltaAccumulator.current = deltaAccumulator.current % threshold;
    } else if (deltaAccumulator.current <= -threshold) {
      const ticks = Math.floor(Math.abs(deltaAccumulator.current) / threshold);
      setTargetTick((prev) => Math.max(0, prev - ticks));
      deltaAccumulator.current = deltaAccumulator.current % threshold;
    }
  };

  // Touch support
  const touchStart = useRef<number | null>(null);
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 1) {
      touchStart.current = e.touches[0].clientY;
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    // Interrupt menu navigation animation if user touches/swipes manually
    navAnimRef.current.active = false;

    if (touchStart.current === null || e.touches.length !== 1) return;
    const currentY = e.touches[0].clientY;
    const diffY = touchStart.current - currentY;

    if (Math.abs(diffY) >= 40) {
      const ticks = Math.floor(diffY / 40);
      if (ticks !== 0) {
        setTargetTick((prev) => Math.max(0, Math.min(40, prev + ticks)));
        touchStart.current = currentY;
      }
    }
  };

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        navAnimRef.current.active = false;
        setTargetTick((prev) => Math.min(40, prev + 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        navAnimRef.current.active = false;
        setTargetTick((prev) => Math.max(0, prev - 1));
      } else if (e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault();
        navAnimRef.current.active = false;
        setTargetTick((prev) => Math.min(40, Math.ceil((prev + 1) / 8) * 8));
      } else if (e.key === 'PageUp') {
        e.preventDefault();
        navAnimRef.current.active = false;
        setTargetTick((prev) => Math.max(0, Math.floor((prev - 1) / 8) * 8));
      } else if (e.key === 'Home') {
        e.preventDefault();
        navAnimRef.current.active = false;
        setTargetTick(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        navAnimRef.current.active = false;
        setTargetTick(40);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Menu navigation click handlers targeting exact tick benchmarks with ease-in-out
  const navigateTo = (section: '01' | '02' | '03' | '04' | '05' | '06') => {
    if (section === '01' || section === '02') {
      triggerNavAnimation(0);
    } else if (section === '03') {
      triggerNavAnimation(8);
    } else if (section === '04') {
      triggerNavAnimation(16);
    } else if (section === '05') {
      triggerNavAnimation(24);
    } else if (section === '06') {
      triggerNavAnimation(40); // Glide fully to the bottom
    }
  };

  // Scroll Progress Calculations based on currentTick
  const progress01 = Math.min(1, currentTick / 8);

  // 03 / Essence progress and vertical column drifts
  const drift03 = (currentTick - 8) / 8; // -1 at Hero, 0 at Essence, 1 at Innovations
  const leftColY = drift03 * -80;
  const rightColY = drift03 * 80;

  // 04 / Innovations progress and precise tick alignments
  const card1Rotation = (currentTick - 16) * 1.5;
  const card2Rotation = (currentTick - 16) * -2.0;
  const card3Rotation = (currentTick - 16) * 1.0;

  const drift04 = (currentTick - 16) / 8; // -1 at Essence, 0 at Innovations, 1 at Gallery
  const card1Style = {
    transform: `translateY(${drift04 * -30}px) rotate(${card1Rotation}deg) scale(${hoveredSpecimen === 1 ? 1.02 : 1})`,
  };
  const card2Style = {
    transform: `translateY(${drift04 * -55}px) rotate(${card2Rotation}deg) scale(${hoveredSpecimen === 2 ? 1.02 : 1})`,
  };
  const card3Style = {
    transform: `translateY(${drift04 * -15}px) rotate(${card3Rotation}deg) scale(${hoveredSpecimen === 3 ? 1.02 : 1})`,
  };

  // 05 / Gallery horizontal scroll progress
  const galleryProgress = Math.max(0, Math.min(1, (currentTick - 24) / 8));
  const horizontalTranslateX = -galleryProgress * maxTranslate;

  // 06 / Portal (Contact) converging gates - closes completely only at 100% scroll progress (tick 40)
  const contactProgress = Math.max(0, Math.min(1, (currentTick - 32) / 8));
  const convergeFactor = Math.max(0, 1.0 - contactProgress);
  const leftConvergeX = convergeFactor * -250;
  const rightConvergeX = convergeFactor * 250;

  // Visual Morph Style Calculations for Hero Portal
  const gridLineOpacity = Math.max(0.05, 1 - progress01 * 2.5);
  const textFadeOut = Math.max(0, 1 - progress01 * 3.0);

  // Background drift offsets for hero screen
  const num01Transform = `translate(${progress01 * -220}px, ${progress01 * -80}px) scale(${1 + progress01 * 0.4})`;
  const num02Transform = `translate(${progress01 * 220}px, ${progress01 * -80}px) scale(${1 + progress01 * 0.4})`;

  const splitScale = 1 - progress01 * 0.08;

  // Vertical Translate for our unified viewport track
  const panelHeight = viewportHeight - 70;
  const getVerticalTranslateY = (tick: number, height: number) => {
    if (tick <= 24) {
      return (tick / 8) * height;
    }
    if (tick <= 32) {
      return 3 * height;
    }
    return (3 + (tick - 32) / 8) * height;
  };
  const verticalTranslateY = getVerticalTranslateY(currentTick, panelHeight);

  return (
    <div
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      className="fixed inset-0 z-50 bg-[#000000] text-[#e3e3e5] overflow-hidden h-screen font-sans select-none rounded-none"
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
      <div className="sticky top-0 left-0 right-0 z-40 h-[70px] bg-[#000000]/90 backdrop-blur-md border-b border-[#111112] px-8 flex justify-between items-center transition-all duration-300">
        <div className="flex flex-col">
          <span className="text-[8px] tracking-[0.6em] text-[#a39081] font-black uppercase mb-0.5">
            BESPOKE LUTHERIE STUDIO
          </span>
          <h1 className="text-sm font-black tracking-[0.4em] text-[#e3e3e5] uppercase">
            LVI Custom
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

      {/* PANELS VIEWPORT CONTAINER - OCCUPIES EXACTLY THE REMAINING HEIGHT */}
      <div className="w-full h-[calc(100vh-70px)] relative overflow-hidden">

        {/* INNER VERTICALLY TRANSLATING TRACK */}
        <div
          className="w-full flex flex-col transition-transform duration-75 ease-out"
          style={{
            transform: `translateY(-${verticalTranslateY}px)`,
          }}
        >

          {/* PANEL 0: HERO (01 & 02) */}
          <div
            className="relative w-full h-[calc(100vh-70px)] flex flex-col md:flex-row border-b border-[#1c1c1f] overflow-hidden shrink-0"
            style={{
              transform: `scale(${splitScale})`,
              transition: 'transform 0.1s ease-out'
            }}
          >
            {/* SECTOR 01: ACOUSTIC PORTAL */}
            <button
              onClick={() => onSelect('bass')}
              className="group relative flex-1 flex flex-col justify-end p-8 md:p-16 text-left border-b md:border-b-0 md:border-r border-[#1c1c1f] focus:outline-none transition-all duration-700 hover:bg-[#060607]/80 bg-transparent rounded-none z-20 overflow-hidden cursor-pointer h-full"
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
                className="absolute left-6 bottom-[15%] origin-left -rotate-90 hidden xl:flex items-center gap-6 text-[7.5px] tracking-[0.35em] text-[#423f40] group-hover:text-[#a39081]/60 uppercase font-black pointer-events-none transition-colors duration-500"
                style={{ opacity: textFadeOut }}
              >
                <span>HOLLOW CORE</span>
                <span>•</span>
                <span>MULTISCALE DESIGN</span>
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
                  RESONANT HOLLOW-CORE INSTRUMENTS COMBINING ARCHITECTURAL INTEGRITY WITH MULTISCALE FIDELITY.
                </p>
                <div className="flex items-center gap-2 mt-4 text-[8px] tracking-[0.3em] text-[#a39081] uppercase font-black opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span>CONFIGURE</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#a39081]" />
                </div>
              </div>
            </button>

            {/* SECTOR 02: ELECTRIC PORTAL */}
            <button
              onClick={() => onSelect('guitar')}
              className="group relative flex-1 flex flex-col justify-end p-8 md:p-16 text-left focus:outline-none transition-all duration-700 hover:bg-[#060607]/80 bg-transparent rounded-none z-20 overflow-hidden cursor-pointer h-full"
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
                className="absolute right-6 bottom-[15%] origin-right rotate-90 hidden xl:flex items-center gap-6 text-[7.5px] tracking-[0.35em] text-[#423f40] group-hover:text-[#a39081]/60 uppercase font-black pointer-events-none transition-colors duration-500"
                style={{ opacity: textFadeOut }}
              >
                <span>ACTIVE PREAMP</span>
                <span>•</span>
                <span>SOLID WOODS</span>
                <span>•</span>
                <span>HUMBUCKING CORE</span>
              </div>

              <div className="relative z-20 flex flex-col gap-2 rounded-none max-w-lg mt-auto">
                <div className="text-[8.5px] tracking-[0.4em] text-[#5a554f] font-black uppercase">
                  SERIES II
                </div>
                <h2 className="text-2xl md:text-4xl font-black tracking-[0.25em] text-[#a39081] uppercase transition-all duration-500 group-hover:text-[#e3e3e5] group-hover:translate-x-2">
                  ELECTRIC
                </h2>
                <p className="text-[10px] leading-relaxed text-[#5a554f] mt-1.5 uppercase tracking-wider font-bold group-hover:text-[#78726a] transition-colors">
                  HIGH-OUTPUT ELECTROMAGNETIC CORE CONSTRUCTIONS DESIGNED FOR UNCOMPROMISED SONIC POWER.
                </p>
                <div className="flex items-center gap-2 mt-4 text-[8px] tracking-[0.3em] text-[#a39081] uppercase font-black opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span>CONFIGURE</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#a39081]" />
                </div>
              </div>
            </button>
          </div>

          {/* PANEL 1: ESSENCE (03) */}
          <section
            id="about"
            className="w-full h-[calc(100vh-70px)] bg-[#000000] border-b border-[#1c1c1f] px-6 md:px-20 relative overflow-hidden flex items-center justify-center shrink-0"
          >
            {/* PERSONALITY SIGNATURE: Premium abstract multi-layer lens & geometry blueprint background */}
            <div className="absolute inset-0 pointer-events-none z-0 opacity-[0.06] flex items-center justify-center">
              <svg
                className="w-[800px] h-[800px] stroke-[#a39081] fill-none"
                viewBox="0 0 200 200"
                style={{
                  transform: `rotate(${currentTick * -4}deg)`,
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

            <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 relative z-10 w-full">
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

          {/* PANEL 2: INNOVATIONS (04) */}
          <section
            id="gallery"
            className="w-full h-[calc(100vh-70px)] bg-[#050506] border-b border-[#1c1c1f] px-6 md:px-20 relative overflow-hidden flex items-center justify-center shrink-0"
          >
            {/* PERSONALITY SIGNATURE: Technical design coordinate wireframe grid (no cringe text) */}
            <div className="absolute inset-0 pointer-events-none z-0 opacity-[0.04]">
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#a39081_1px,transparent_1px),linear-gradient(to_bottom,#a39081_1px,transparent_1px)] bg-[size:50px_50px]" />
              <div className="absolute top-[30%] left-[10%] w-[80%] h-[1px] bg-[#a39081]" />
              <div className="absolute top-[70%] left-[10%] w-[80%] h-[1px] bg-[#a39081]" />
            </div>

            <div className="max-w-6xl mx-auto space-y-8 relative z-10 w-full">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] tracking-[0.6em] text-[#a39081] font-black uppercase">
                  04 / INNOVATIONS
                </span>
                <h3 className="text-3xl md:text-4xl font-black tracking-[0.2em] text-[#e3e3e5] uppercase">
                  BLUEPRINT REVELATIONS
                </h3>
              </div>

              {/* Lando Norris-inspired grid of specimens */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-2">

                {/* Model M-01 / CARBON */}
                <div
                  onMouseEnter={() => setHoveredSpecimen(1)}
                  onMouseLeave={() => setHoveredSpecimen(null)}
                  style={{ ...card1Style, transition: 'transform 0.15s ease-out, border-color 0.4s, background-color 0.4s' }}
                  className={`border p-8 bg-[#000000] flex flex-col justify-between h-[380px] rounded-none relative overflow-hidden group cursor-pointer ${
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
                  </div>

                  {/* Precise Vector Schematic Visual representation */}
                  <div className="my-auto flex justify-center py-2">
                    <svg className={`w-24 h-24 transition-transform duration-700 ${
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
                  className={`border p-8 bg-[#000000] flex flex-col justify-between h-[380px] rounded-none relative overflow-hidden group cursor-pointer ${
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
                  </div>

                  {/* Solid Matrix Lattice Visual representation */}
                  <div className="my-auto flex justify-center py-2">
                    <svg className={`w-24 h-24 transition-transform duration-700 ${
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
                  className={`border p-8 bg-[#000000] flex flex-col justify-between h-[380px] rounded-none relative overflow-hidden group cursor-pointer ${
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
                  </div>

                  {/* Fanned Fretboard Layout Diagram Visual representation */}
                  <div className="my-auto flex justify-center py-2">
                    <svg className={`w-24 h-24 transition-transform duration-700 ${
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

          {/* PANEL 3: GALLERY (05) */}
          <section
            id="gallery-panel"
            className="w-full h-[calc(100vh-70px)] bg-[#000000] border-b border-[#1c1c1f] relative overflow-hidden flex flex-col justify-center shrink-0"
          >
            <div className="max-w-7xl mx-auto w-full px-12 md:px-20 mb-8 flex flex-col gap-1">
              <span className="text-[10px] tracking-[0.6em] text-[#a39081] font-black uppercase">
                05 / GALLERY
              </span>
              <h3 className="text-2xl md:text-3xl font-black tracking-[0.2em] text-[#e3e3e5] uppercase">
                MASTERBUILT SPECIMENS
              </h3>
            </div>

            {/* Horizontal Track Wrapper */}
            <div className="w-full relative overflow-hidden h-[360px] flex items-center">
              <div
                ref={trackRef}
                className="flex gap-8 px-12 md:px-20 absolute left-0 top-0 h-full items-center whitespace-nowrap transition-transform duration-75 ease-out pr-12 md:pr-20"
                style={{ transform: `translateX(${horizontalTranslateX}px)` }}
              >

                {/* Item 1 */}
                <div className="w-[450px] h-[330px] border border-[#1c1c1f] p-8 bg-[#050506] flex flex-col justify-between shrink-0 relative overflow-hidden group">
                  {/* Crop-marks framing */}
                  <div className="absolute top-2 left-2 text-[7px] text-[#423f40] font-mono font-bold">+</div>
                  <div className="absolute top-2 right-2 text-[7px] text-[#423f40] font-mono font-bold">+</div>
                  <div className="absolute bottom-2 left-2 text-[7px] text-[#423f40] font-mono font-bold">+</div>
                  <div className="absolute bottom-2 right-2 text-[7px] text-[#423f40] font-mono font-bold">+</div>

                  <div className="my-auto flex justify-center py-4">
                    <svg className="w-24 h-24 stroke-[#a39081]/40 group-hover:stroke-[#a39081] transition-colors duration-500 fill-none" viewBox="0 0 100 100" strokeWidth="1">
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
                <div className="w-[450px] h-[330px] border border-[#1c1c1f] p-8 bg-[#050506] flex flex-col justify-between shrink-0 relative overflow-hidden group">
                  <div className="absolute top-2 left-2 text-[7px] text-[#423f40] font-mono font-bold">+</div>
                  <div className="absolute top-2 right-2 text-[7px] text-[#423f40] font-mono font-bold">+</div>
                  <div className="absolute bottom-2 left-2 text-[7px] text-[#423f40] font-mono font-bold">+</div>
                  <div className="absolute bottom-2 right-2 text-[7px] text-[#423f40] font-mono font-bold">+</div>

                  <div className="my-auto flex justify-center py-4">
                    <svg className="w-24 h-24 stroke-[#a39081]/40 group-hover:stroke-[#a39081] transition-colors duration-500 fill-none" viewBox="0 0 100 100" strokeWidth="1">
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
                <div className="w-[450px] h-[330px] border border-[#1c1c1f] p-8 bg-[#050506] flex flex-col justify-between shrink-0 relative overflow-hidden group">
                  <div className="absolute top-2 left-2 text-[7px] text-[#423f40] font-mono font-bold">+</div>
                  <div className="absolute top-2 right-2 text-[7px] text-[#423f40] font-mono font-bold">+</div>
                  <div className="absolute bottom-2 left-2 text-[7px] text-[#423f40] font-mono font-bold">+</div>
                  <div className="absolute bottom-2 right-2 text-[7px] text-[#423f40] font-mono font-bold">+</div>

                  <div className="my-auto flex justify-center py-4">
                    <svg className="w-24 h-24 stroke-[#a39081]/40 group-hover:stroke-[#a39081] transition-colors duration-500 fill-none" viewBox="0 0 100 100" strokeWidth="1">
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
                <div className="w-[450px] h-[330px] border border-[#1c1c1f] p-8 bg-[#050506] flex flex-col justify-between shrink-0 relative overflow-hidden group">
                  <div className="absolute top-2 left-2 text-[7px] text-[#423f40] font-mono font-bold">+</div>
                  <div className="absolute top-2 right-2 text-[7px] text-[#423f40] font-mono font-bold">+</div>
                  <div className="absolute bottom-2 left-2 text-[7px] text-[#423f40] font-mono font-bold">+</div>
                  <div className="absolute bottom-2 right-2 text-[7px] text-[#423f40] font-mono font-bold">+</div>

                  <div className="my-auto flex justify-center py-4">
                    <svg className="w-24 h-24 stroke-[#a39081]/40 group-hover:stroke-[#a39081] transition-colors duration-500 fill-none" viewBox="0 0 100 100" strokeWidth="1">
                      <polygon points="50,15 80,45 65,85 35,85 20,45" />
                      <circle cx="50" cy="50" r="25" strokeDasharray="2,5" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-[#e3e3e5] tracking-[0.2em] uppercase mb-1">CUSTOM SCALE CARBON BASS</h4>
                    <p className="text-[8.5px] text-[#5a554f] font-bold tracking-widest uppercase">HIGH-TENSION CORE / 34" MONOCOQUE</p>
                  </div>
                </div>

                {/* Item 5 */}
                <div className="w-[450px] h-[330px] border border-[#1c1c1f] p-8 bg-[#050506] flex flex-col justify-between shrink-0 relative overflow-hidden group">
                  <div className="absolute top-2 left-2 text-[7px] text-[#423f40] font-mono font-bold">+</div>
                  <div className="absolute top-2 right-2 text-[7px] text-[#423f40] font-mono font-bold">+</div>
                  <div className="absolute bottom-2 left-2 text-[7px] text-[#423f40] font-mono font-bold">+</div>
                  <div className="absolute bottom-2 right-2 text-[7px] text-[#423f40] font-mono font-bold">+</div>

                  <div className="my-auto flex justify-center py-4">
                    <svg className="w-24 h-24 stroke-[#a39081]/40 group-hover:stroke-[#a39081] transition-colors duration-500 fill-none" viewBox="0 0 100 100" strokeWidth="1">
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

                {/* Item 6 */}
                <div className="w-[450px] h-[330px] border border-[#1c1c1f] p-8 bg-[#050506] flex flex-col justify-between shrink-0 relative overflow-hidden group">
                  <div className="absolute top-2 left-2 text-[7px] text-[#423f40] font-mono font-bold">+</div>
                  <div className="absolute top-2 right-2 text-[7px] text-[#423f40] font-mono font-bold">+</div>
                  <div className="absolute bottom-2 left-2 text-[7px] text-[#423f40] font-mono font-bold">+</div>
                  <div className="absolute bottom-2 right-2 text-[7px] text-[#423f40] font-mono font-bold">+</div>

                  <div className="my-auto flex justify-center py-4">
                    <svg className="w-24 h-24 stroke-[#a39081]/40 group-hover:stroke-[#a39081] transition-colors duration-500 fill-none" viewBox="0 0 100 100" strokeWidth="1">
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

            <div className="absolute bottom-8 left-12 right-12 flex justify-end text-[8px] font-mono tracking-[0.2em] text-[#423f40] border-t border-[#111112] pt-2">
              <span>{Math.round(galleryProgress * 100)}%</span>
            </div>
          </section>

          {/* PANEL 4: PORTAL (06) */}
          <section
            id="contact"
            className="w-full h-[calc(100vh-70px)] bg-[#000000] px-6 md:px-20 relative overflow-hidden border-t border-[#111112] flex items-center justify-center shrink-0"
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

            <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-0 relative z-10 border border-[#1c1c1f] w-full">

              {/* Left Panel: Converges from the left on scroll */}
              <div
                className="p-8 md:p-12 bg-[#040405] border-b md:border-b-0 md:border-r border-[#1c1c1f] flex flex-col justify-between space-y-8 animate-none"
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
                className="p-8 md:p-12 bg-[#08080a] flex flex-col justify-between space-y-8"
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
                      href="mailto:studio@lvicustom.com"
                      className="flex items-center justify-between group border-b border-[#1c1c1f] pb-3 hover:text-[#e3e3e5] transition-colors"
                    >
                      <span>STUDIO@LVICUSTOM.COM</span>
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
                  <div>Póvoa de Varzim, Portugal</div>
                  <div>© {new Date().getFullYear()} LVI Custom</div>
                </div>
              </div>

            </div>
          </section>

        </div>
      </div>

    </div>
  );
};
