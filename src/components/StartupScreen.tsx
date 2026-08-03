import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, Mail, MessageSquare, Compass } from 'lucide-react';

interface StartupScreenProps {
  onSelect: (type: 'guitar' | 'bass') => void;
}

export const StartupScreen: React.FC<StartupScreenProps> = ({ onSelect }) => {
  const [scrollY, setScrollY] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [viewportHeight, setViewportHeight] = useState(800);

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

  // Visual Morph Style Calculations
  const gridLineOpacity = Math.max(0.05, 1 - scrollRatio * 2.5);
  const textFadeOut = Math.max(0, 1 - scrollRatio * 3.0);

  // Background big numbers drift out of screen
  const num01Transform = `translate(${scrollRatio * -180}px, ${scrollRatio * -60}px) scale(${1 + scrollRatio * 0.4})`;
  const num02Transform = `translate(${scrollRatio * 180}px, ${scrollRatio * -60}px) scale(${1 + scrollRatio * 0.4})`;

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
          className="group relative flex-1 flex flex-col justify-end p-8 md:p-16 text-left border-b md:border-b-0 md:border-r border-[#1c1c1f] focus:outline-none transition-all duration-700 hover:bg-[#060607]/80 bg-transparent rounded-none z-20"
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
          className="group relative flex-1 flex flex-col justify-end p-8 md:p-16 text-left focus:outline-none transition-all duration-700 hover:bg-[#060607]/80 bg-transparent rounded-none z-20"
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

      {/* STAGE 2: THE ABOUT SECTION (03 / THE PHILOSOPHY) */}
      <section
        id="about"
        className="w-full bg-[#030304] border-b border-[#1c1c1f] py-24 px-8 md:px-20 relative overflow-hidden"
      >
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="flex flex-col gap-1.5">
            <span className="text-[9px] tracking-[0.5em] text-[#a39081] font-extrabold uppercase">
              STATEMENT OF INTENT
            </span>
            <h3 className="text-3xl md:text-4xl font-black tracking-[0.2em] text-[#e3e3e5] uppercase">
              03 / PHILOSOPHY
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-4">
            <p className="text-xs md:text-[13px] leading-relaxed text-[#8a857e] uppercase tracking-wider font-bold">
              We reject the industrial homogenization of instrument crafting. Luxe Luthiers bridges raw brutalist structural lines with extreme bespoke performance specifications. Every monocoque Carbon-Core and recycled Richlite alternative we sculpt serves as an extension of architectural anatomy.
            </p>
            <div className="space-y-6 text-[10px] uppercase tracking-widest text-[#5a554f] font-bold">
              <div className="border-l-2 border-[#a39081]/30 pl-4 space-y-1">
                <span className="block text-[#a39081]">MATERIAL PURITY</span>
                <p className="text-[9px]">We employ FSC®-certified Richlite paper-composites and dense monocoque carbon fibers, leaving old growth rain forests completely untouched.</p>
              </div>
              <div className="border-l-2 border-[#a39081]/30 pl-4 space-y-1">
                <span className="block text-[#a39081]">EDO MICROTONAL MATHEMATICS</span>
                <p className="text-[9px]">Infinite customizable mathematical intervals replace standard Western 12-tet temperaments seamlessly with proportional visual alignments.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STAGE 3: THE GALLERY (04 / RAW SPECIMENS) */}
      <section
        id="gallery"
        className="w-full bg-[#000000] border-b border-[#1c1c1f] py-24 px-8 md:px-20"
      >
        <div className="max-w-6xl mx-auto space-y-16">
          <div className="flex flex-col gap-1.5">
            <span className="text-[9px] tracking-[0.5em] text-[#a39081] font-extrabold uppercase">
              DESIGN BLUEPRINTS & RENDER ARCHIVES
            </span>
            <h3 className="text-3xl md:text-4xl font-black tracking-[0.2em] text-[#e3e3e5] uppercase">
              04 / SPECIMENS
            </h3>
          </div>

          {/* Brutalist Grid of Wireframes / Finishes */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* Specimen 01 */}
            <div className="border border-[#1c1c1f] p-6 bg-[#040405] relative flex flex-col justify-between h-[280px]">
              <span className="text-[10px] text-[#5a554f] font-mono">SPEC_NO. 001/A</span>
              <div className="my-auto flex flex-col items-center">
                <div className="w-24 h-24 border-2 border-dashed border-[#a39081]/15 rounded-full flex items-center justify-center animate-spin-slow">
                  <Compass className="w-10 h-10 text-[#a39081]/30" />
                </div>
              </div>
              <div className="space-y-1">
                <span className="block text-[9px] text-[#a39081] font-black tracking-widest">MONOCOQUE CARBON CORE</span>
                <p className="text-[8px] text-[#5a554f] uppercase font-bold tracking-wider">Acoustic Soundboards with zero internal wood bracing</p>
              </div>
            </div>

            {/* Specimen 02 */}
            <div className="border border-[#1c1c1f] p-6 bg-[#040405] relative flex flex-col justify-between h-[280px]">
              <span className="text-[10px] text-[#5a554f] font-mono">SPEC_NO. 002/E</span>
              <div className="my-auto space-y-1.5 text-center">
                <div className="text-[2.2rem] font-black tracking-[0.15em] text-[#1a1a1c]">
                  RICHLITE
                </div>
                <div className="flex justify-center gap-1.5">
                  <span className="w-3 h-3 bg-[#0d0d0f] border border-[#a39081]/40" />
                  <span className="w-3 h-3 bg-[#42312b] border border-[#a39081]/40" />
                  <span className="w-3 h-3 bg-[#505459] border border-[#a39081]/40" />
                </div>
              </div>
              <div className="space-y-1">
                <span className="block text-[9px] text-[#a39081] font-black tracking-widest">SUSTAINABLE TONESTEEL</span>
                <p className="text-[8px] text-[#5a554f] uppercase font-bold tracking-wider">High density Black Diamond, Sloan, and Glacier slabs</p>
              </div>
            </div>

            {/* Specimen 03 */}
            <div className="border border-[#1c1c1f] p-6 bg-[#040405] relative flex flex-col justify-between h-[280px]">
              <span className="text-[10px] text-[#5a554f] font-mono">SPEC_NO. 003/X</span>
              <div className="my-auto flex flex-col items-center">
                {/* Visual SVG diagram representation of custom fanned frets */}
                <div className="w-full flex flex-col gap-1 items-center opacity-40">
                  <div className="w-24 h-[1.5px] bg-[#a39081] rotate-[-5deg]" />
                  <div className="w-24 h-[1.5px] bg-[#a39081] rotate-[-2deg]" />
                  <div className="w-24 h-[1.5px] bg-[#a39081] rotate-0" />
                  <div className="w-24 h-[1.5px] bg-[#a39081] rotate-[3deg]" />
                  <div className="w-24 h-[1.5px] bg-[#a39081] rotate-[7deg]" />
                </div>
              </div>
              <div className="space-y-1">
                <span className="block text-[9px] text-[#a39081] font-black tracking-widest">FANNED MULTISCALE MATRIX</span>
                <p className="text-[8px] text-[#5a554f] uppercase font-bold tracking-wider">Perfect separate bass-side and treble-side scale lengths</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* STAGE 4: CONTACT & SOCIALS (05 / INQUIRIES) */}
      <section
        id="contact"
        className="w-full bg-[#050506] py-28 px-8 md:px-20"
      >
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16">
          <div className="space-y-6">
            <div className="flex flex-col gap-1.5">
              <span className="text-[9px] tracking-[0.5em] text-[#a39081] font-extrabold uppercase">
                ACQUISITIONS & BESPOKE COMMISSIONS
              </span>
              <h3 className="text-3xl md:text-4xl font-black tracking-[0.2em] text-[#e3e3e5] uppercase">
                05 / INQUIRIES
              </h3>
            </div>
            <p className="text-[11px] leading-relaxed text-[#5a554f] uppercase tracking-wider font-bold">
              Our atelier operates strictly via bespoke booking and individual queue allotment. Complete an online blueprint using our customizable interface above to initiate your commission order sequence.
            </p>
          </div>

          {/* Contact Details & Links */}
          <div className="flex flex-col justify-end space-y-8 border-t md:border-t-0 md:border-l border-[#1c1c1f] pt-12 md:pt-0 md:pl-16">
            <div className="space-y-4">
              <h4 className="text-[10px] tracking-[0.3em] text-[#a39081] font-black uppercase">
                COMMUNICATIONS HUB
              </h4>

              <div className="space-y-3.5 text-[10px] uppercase font-black text-[#8a857e] tracking-widest">
                <a href="mailto:atelier@luxeluthiers.com" className="flex items-center gap-3 hover:text-[#e3e3e5] transition-colors">
                  <Mail className="w-4 h-4 text-[#a39081]/60" />
                  <span>ATELIER@LUXELUTHIERS.COM</span>
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-[#e3e3e5] transition-colors">
                  {/* Inline SVG for Instagram */}
                  <svg className="w-4 h-4 text-[#a39081]/60 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="2">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                  <span>@LUXE_LUTHIERS</span>
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-[#e3e3e5] transition-colors">
                  {/* Inline SVG for Twitter / X */}
                  <svg className="w-4 h-4 text-[#a39081]/60 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="2">
                    <path d="M4 4l11.733 16h4.267l-11.733 -16z"></path>
                    <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772"></path>
                  </svg>
                  <span>@LUXE_STUDIO</span>
                </a>
                <div className="flex items-center gap-3 text-[#5a554f]">
                  <MessageSquare className="w-4 h-4 text-[#5a554f]/40" />
                  <span>SECURE TELEGRAM ENCRYPTED PORTAL</span>
                </div>
              </div>
            </div>

            <div className="text-[8px] text-[#423f40] uppercase font-bold tracking-widest space-y-0.5 border-t border-[#111112] pt-4">
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