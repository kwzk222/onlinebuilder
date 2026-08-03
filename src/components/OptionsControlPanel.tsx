import React, { useState } from 'react';
import { useGuitarStore } from '../store/guitarStore';
import { BODY_SHAPES, BODY_WOODS, PICKUPS_LAYOUTS, HARDWARE_COLORS, PICKGUARD_STYLES, FINISH_PRESETS } from '../constants/catalog';
import { ChevronDown, ChevronUp, Check, Plus, Trash2, Sliders } from 'lucide-react';
import type { RichliteType, EdoFretlessMode, InlayStyle, ExtraFretboardConfig, SeatedPosition, NeckProfile } from '../types/guitar';

// Real Richlite collection matching list: https://www.richlite.com/collections/fretboards
const RICHLITE_OPTIONS: { id: RichliteType; name: string; color: string; description: string }[] = [
  { id: 'black_diamond', name: 'Black Diamond', color: '#151516', description: 'Stark, dense ebony alternative. The pinnacle of responsive dark resonance.' },
  { id: 'maple_valley', name: 'Maple Valley', color: '#8b5a2b', description: 'Deep, luxurious warm golden amber fibers resembling premium core mahogany.' },
  { id: 'grays_harbor', name: 'Grays Harbor', color: '#565a5c', description: 'Stormy ocean gray mineral composition. Richly textured and highly tactile.' },
  { id: 'rosedale', name: 'Rosedale', color: '#2f1f17', description: 'Dark cocoa tones with organic linear grain. Exceptional feel and slide speed.' },
  { id: 'redstone', name: 'Redstone', color: '#8a3324', description: 'Bold volcanic clay rust tones. Unmatched hardness and sharp attack profiles.' },
  { id: 'browns_point', name: 'Browns Point', color: '#4a3b32', description: 'Earthy charcoal brown woodgrain weave. Balanced organic dampening properties.' },
  { id: 'chocolate_glacier', name: 'Chocolate Glacier', color: '#32251a', description: 'Highly dense dark chocolate composite with high moisture stability.' },
  { id: 'blue_canyon', name: 'Blue Canyon', color: '#202e3b', description: 'Midnight dark blue slate hue. Cold pressed high-tension resin performance.' },
  { id: 'columbia', name: 'Columbia', color: '#1c352d', description: 'Deep forest green mineral finish. Beautiful organic hue with ebony gloss.' },
  { id: 'luna', name: 'Luna', color: '#a6a29a', description: 'Ethereal concrete light stone ash. Incredible look on dark/matte instruments.' },
  { id: 'eldorado', name: 'Eldorado', color: '#7a5a3a', description: 'Rich medium-gold tone with industrial fiber textures.' },
  { id: 'dragontail', name: 'Dragontail', color: '#3d1c1c', description: 'Deep dried-blood crimson matrix. High response micro-fibers.' },
  { id: 'glacier', name: 'Glacier', color: '#d1d5db', description: 'Frosted gray. Highly compressed sustainable paper core.' },
  { id: 'forbidden', name: 'Forbidden', color: '#111827', description: 'Jet-black ultra-high density custom weave with premium resin finish.' },
  { id: 'sloan', name: 'Sloan', color: '#4b5563', description: 'Industrial cement-gray matte finish with ultra-smooth speed profile.' },
];

export const OptionsControlPanel: React.FC = () => {
  const { config, updateConfig } = useGuitarStore();
  const [activeCategory, setActiveCategory] = useState<string>('neck_tech');

  const toggleCategory = (cat: string) => {
    setActiveCategory(activeCategory === cat ? '' : cat);
  };

  const isBass = config.instrumentType === 'bass';

  // Calculations for relaxed hand measurements
  // neck thickness + fret height = inputed measurement
  // live estimate: neck thickness = input - fret_height
  const estimatedThicknessMetric = Math.max(16, Math.min(26, config.relaxedHandMeasurement * 0.15));
  const estimatedThicknessImperial = estimatedThicknessMetric / 25.4;

  const currentThicknessStr = config.measurementSystem === 'metric'
    ? `${estimatedThicknessMetric.toFixed(1)} mm`
    : `${estimatedThicknessImperial.toFixed(2)} in`;

  // Body ergonomic recommendation calculation
  const getErgonomicRecommendation = (pos: SeatedPosition): { shape: string; explanation: string; shapeId: string } => {
    if (pos === 'classical_chair' || pos === 'classical_left_leg_stool') {
      return {
        shape: 'SINGLE CUT',
        shapeId: 'single_cut',
        explanation: 'The standard Single Cut provides the maximal body surface contact and lower horn cutout, aligning the guitar perfectly on your left leg for standard or stool classical posture.'
      };
    } else if (pos === 'right_leg_strap') {
      return {
        shape: 'OFFSET WAIST',
        shapeId: 'offset',
        explanation: 'A balanced offset body structure offsets gravity points, preventing neck dives when using straps and maintaining a stable standard alignment.'
      };
    } else {
      return {
        shape: 'MODERN ST',
        shapeId: 'modern_st',
        explanation: 'The ergonomic double-cutaway horns of the Modern ST provide absolute lightweight balance and premium fret accessibility for standard relaxed seating positions.'
      };
    }
  };

  const recommendation = getErgonomicRecommendation(config.seatedPosition);

  // Modular Fretboard controls
  const addExtraFretboard = () => {
    if (config.extraFretboards.length >= 3) return;
    const newBoard: ExtraFretboardConfig = {
      id: Math.random().toString(36).substr(2, 9),
      material: 'black_diamond',
      inlay: 'dots',
      edoMode: 'standard_12_edo',
      scalloped: false,
      scallopedStartFret: 12,
      numberOfFrets: 24,
    };
    updateConfig({ extraFretboards: [...config.extraFretboards, newBoard] });
  };

  const removeExtraFretboard = (id: string) => {
    updateConfig({
      extraFretboards: config.extraFretboards.filter((b) => b.id !== id),
    });
  };

  const updateExtraFretboard = (id: string, updates: Partial<ExtraFretboardConfig>) => {
    updateConfig({
      extraFretboards: config.extraFretboards.map((b) => (b.id === id ? { ...b, ...updates } : b)),
    });
  };

  return (
    <div className="space-y-4 font-sans rounded-none select-none">

      {/* GLOBAL SYSTEM SWITCHER */}
      <div className="flex items-center justify-between border-b border-[#1a1a1c] pb-4 rounded-none">
        <div className="flex flex-col">
          <span className="text-[9px] text-[#a39081] tracking-[0.25em] font-bold uppercase">SYSTEM STANDARDS</span>
          <span className="text-[10px] text-[#e3e3e5] tracking-wider uppercase font-bold">MEASUREMENT METRICS</span>
        </div>
        <div className="flex border border-[#1a1a1c] bg-[#0c0c0d] p-0.5 rounded-none">
          <button
            onClick={() => {
              const oldVal = config.relaxedHandMeasurement;
              updateConfig({
                measurementSystem: 'metric',
                relaxedHandMeasurement: Math.round(oldVal * 25.4) || 150
              });
            }}
            className={`px-3 py-1 text-[9px] font-bold tracking-widest uppercase transition-colors rounded-none ${
              config.measurementSystem === 'metric'
                ? 'bg-[#a39081] text-[#000000]'
                : 'text-[#5a554f] hover:text-[#e3e3e5]'
            }`}
          >
            METRIC (MM)
          </button>
          <button
            onClick={() => {
              const oldVal = config.relaxedHandMeasurement;
              updateConfig({
                measurementSystem: 'imperial',
                relaxedHandMeasurement: parseFloat((oldVal / 25.4).toFixed(2)) || 5.9
              });
            }}
            className={`px-3 py-1 text-[9px] font-bold tracking-widest uppercase transition-colors rounded-none ${
              config.measurementSystem === 'imperial'
                ? 'bg-[#a39081] text-[#000000]'
                : 'text-[#5a554f] hover:text-[#e3e3e5]'
            }`}
          >
            IMPERIAL (IN)
          </button>
        </div>
      </div>

      {/* SECTION 1: NECK TECH & PROFILE */}
      <div className="border border-[#1a1a1c] bg-[#0c0c0d] rounded-none overflow-hidden">
        <button
          id="category-header-neck_tech"
          onClick={() => toggleCategory('neck_tech')}
          className="w-full flex items-center justify-between px-5 py-4 text-left font-bold text-[#e3e3e5] hover:bg-[#121213] transition-colors rounded-none font-sans"
        >
          <div className="flex items-center gap-3">
            <span className="text-[9px] text-[#a39081] tracking-[0.25em] font-bold font-sans">01 /</span>
            <span className="tracking-[0.2em] text-[10px] uppercase font-bold font-sans">CARBON ARCHITECTURE & NECK</span>
          </div>
          {activeCategory === 'neck_tech' ? <ChevronUp className="w-4 h-4 text-[#a39081]" /> : <ChevronDown className="w-4 h-4 text-[#5a554f]" />}
        </button>

        {activeCategory === 'neck_tech' && (
          <div className="p-5 border-t border-[#1a1a1c] space-y-6">
            {/* Structural tech description */}
            <div className="bg-[#111112] border-l-2 border-[#a39081] p-3 text-[10px] leading-relaxed text-[#5a554f] uppercase tracking-wider font-semibold rounded-none">
              <span className="text-[#a39081] font-bold block mb-1">MONOCOQUE CARBON INTEGRATION</span>
              Every Luxe instrument features an integrated monocoque carbon fiber core running through the entire length of the neck, fusing seamlessly at the neck joint via a patent-pending mechanical basalt block anchorage. This completely eliminates neck warping and dead notes, providing unparalleled vibrational transfer.
            </div>

            {/* Profile Selection */}
            <div>
              <span className="block text-[9px] font-bold tracking-[0.25em] text-[#5a554f] mb-3 uppercase">NECK BACK PROFILE SHAPE</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {(['teardrop', 'scooped', 'trapezoid'] as NeckProfile[]).map((profile) => (
                  <button
                    key={profile}
                    onClick={() => updateConfig({ neckProfile: profile })}
                    className={`relative p-3.5 text-left rounded-none border transition-all duration-200 font-sans ${
                      config.neckProfile === profile
                        ? 'border-[#a39081]/60 bg-[#121213] text-[#a39081]'
                        : 'border-[#1a1a1c] bg-[#0c0c0d] text-[#5a554f] hover:border-[#333132] hover:text-[#e3e3e5]'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1.5">
                      <span className="text-[10px] font-bold tracking-wider uppercase">{profile}</span>
                      {config.neckProfile === profile && <Check className="w-3.5 h-3.5 text-[#a39081]" />}
                    </div>
                    <span className="block text-[9.5px] leading-relaxed text-[#5a554f] tracking-wide font-bold uppercase mt-1">
                      {profile === 'teardrop' && 'Asymmetrical soft organic grip.'}
                      {profile === 'scooped' && 'Ultra-thin speed orientation.'}
                      {profile === 'trapezoid' && 'Brutalist ergonomic edge indexing.'}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Measurement Hand Input */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="block text-[9px] font-bold tracking-[0.25em] text-[#5a554f] uppercase">RELAXED THUMB-TO-INDEX HAND SPAN</span>
                <span className="text-[8px] tracking-wider text-[#a39081] font-bold uppercase">TAILORED BIOMETRICS</span>
              </div>
              <p className="text-[9.5px] text-[#5a554f] uppercase tracking-wider font-bold mb-3 leading-relaxed">
                Provide your relaxed thumb-to-index hand grip span. Our algorithms dynamically map this to sculpt your customized target neck thickness (Neck Thickness + Fret Height = {config.relaxedHandMeasurement} {config.measurementSystem === 'metric' ? 'mm' : 'in'}).
              </p>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  step="0.1"
                  value={config.relaxedHandMeasurement}
                  onChange={(e) => updateConfig({ relaxedHandMeasurement: parseFloat(e.target.value) || 0 })}
                  className="w-32 bg-[#121213] border border-[#1a1a1c] text-white px-3 py-2 text-xs font-bold tracking-widest text-center focus:outline-none focus:border-[#a39081] rounded-none"
                />
                <span className="text-[9px] text-[#5a554f] tracking-widest uppercase font-bold">
                  {config.measurementSystem === 'metric' ? 'MILLIMETERS' : 'INCHES'}
                </span>
                <div className="h-[1px] bg-[#1a1a1c] flex-1" />
                <span className="text-[9.5px] text-[#a39081] font-bold uppercase tracking-wider">
                  EST. THICKNESS: {currentThicknessStr}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* SECTION 2: THE RICHLITE FRETBOARD */}
      <div className="border border-[#1a1a1c] bg-[#0c0c0d] rounded-none overflow-hidden">
        <button
          id="category-header-fretboard_tech"
          onClick={() => toggleCategory('fretboard_tech')}
          className="w-full flex items-center justify-between px-5 py-4 text-left font-bold text-[#e3e3e5] hover:bg-[#121213] transition-colors rounded-none font-sans"
        >
          <div className="flex items-center gap-3">
            <span className="text-[9px] text-[#a39081] tracking-[0.25em] font-bold font-sans">02 /</span>
            <span className="tracking-[0.2em] text-[10px] uppercase font-bold font-sans">RICHLITE FRETBOARD METRICS</span>
          </div>
          {activeCategory === 'fretboard_tech' ? <ChevronUp className="w-4 h-4 text-[#a39081]" /> : <ChevronDown className="w-4 h-4 text-[#5a554f]" />}
        </button>

        {activeCategory === 'fretboard_tech' && (
          <div className="p-5 border-t border-[#1a1a1c] space-y-6">
            {/* Richlite Description */}
            <div className="bg-[#111112] border-l-2 border-[#a39081] p-3 text-[10px] leading-relaxed text-[#5a554f] uppercase tracking-wider font-semibold rounded-none">
              <span className="text-[#a39081] font-bold block mb-1">SUSTAINABLE PERFORMANCE WOOD COMPOSITES</span>
              Our Richlite fretboards offer the dense, glass-like touch of endangered African ebony without any environmental compromise. Formed of FSC®-certified recycled paper layers and custom-stabilized phenolic resins, it is immune to humidity swings, warping, or fret sprout.
            </div>

            {/* Richlite Material choice */}
            <div>
              <span className="block text-[9px] font-bold tracking-[0.25em] text-[#5a554f] mb-3 uppercase">RICHLITE SHADE COLLECTION</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {RICHLITE_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => updateConfig({ fretboardMaterial: opt.id })}
                    className={`relative p-3.5 text-left rounded-none border transition-all duration-200 font-sans ${
                      config.fretboardMaterial === opt.id
                        ? 'border-[#a39081]/60 bg-[#121213] text-[#a39081]'
                        : 'border-[#1a1a1c] bg-[#0c0c0d] text-[#5a554f] hover:border-[#333132] hover:text-[#e3e3e5]'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <span className="w-2.5 h-2.5 rounded-none border border-black/20" style={{ backgroundColor: opt.color }} />
                      <span className="text-[10px] font-bold tracking-wider uppercase truncate">{opt.name}</span>
                      {config.fretboardMaterial === opt.id && <Check className="w-3.5 h-3.5 text-[#a39081] ml-auto shrink-0" />}
                    </div>
                    <span className="block text-[9px] text-[#5a554f] tracking-wide font-bold uppercase leading-relaxed line-clamp-2">
                      {opt.description}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Modular Fretboard yes/no */}
            <div className="flex items-center justify-between border-t border-[#1a1a1c] pt-5 rounded-none">
              <div className="flex flex-col">
                <span className="text-[10px] text-[#e3e3e5] tracking-wider uppercase font-bold">MODULAR FRETBOARD SYSTEM</span>
                <span className="text-[9px] text-[#5a554f] tracking-wider uppercase font-bold mt-1">Interchangeable rail design (+$250)</span>
              </div>
              <div className="flex border border-[#1a1a1c] bg-[#0c0c0d] p-0.5 rounded-none">
                <button
                  onClick={() => updateConfig({ modularFretboard: false, extraFretboards: [] })}
                  className={`px-3 py-1 text-[9px] font-bold tracking-widest uppercase transition-colors rounded-none ${
                    !config.modularFretboard
                      ? 'bg-[#a39081] text-[#000000]'
                      : 'text-[#5a554f] hover:text-[#e3e3e5]'
                  }`}
                >
                  STANDARD
                </button>
                <button
                  onClick={() => updateConfig({ modularFretboard: true })}
                  className={`px-3 py-1 text-[9px] font-bold tracking-widest uppercase transition-colors rounded-none ${
                    config.modularFretboard
                      ? 'bg-[#a39081] text-[#000000]'
                      : 'text-[#5a554f] hover:text-[#e3e3e5]'
                  }`}
                >
                  MODULAR (RAIL)
                </button>
              </div>
            </div>

            {/* Inlay Selection */}
            <div>
              <span className="block text-[9px] font-bold tracking-[0.25em] text-[#5a554f] mb-3 uppercase">FRETBOARD INLAY SYSTEM</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {([
                  { id: 'none', label: 'None (Stealth)' },
                  { id: 'dots', label: 'Micro Dots' },
                  { id: 'blocks', label: 'Brutalist Blocks' },
                  { id: 'custom', label: 'Custom Artwork' }
                ] as { id: InlayStyle; label: string }[]).map((style) => (
                  <button
                    key={style.id}
                    onClick={() => updateConfig({ fretboardInlay: style.id })}
                    className={`relative p-3 text-left rounded-none border transition-all duration-200 font-sans ${
                      config.fretboardInlay === style.id
                        ? 'border-[#a39081]/60 bg-[#121213] text-[#a39081]'
                        : 'border-[#1a1a1c] bg-[#0c0c0d] text-[#5a554f] hover:border-[#333132] hover:text-[#e3e3e5]'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold tracking-wider uppercase">{style.label}</span>
                      {config.fretboardInlay === style.id && <Check className="w-3.5 h-3.5 text-[#a39081]" />}
                    </div>
                    {style.id === 'custom' && (
                      <span className="block text-[8px] text-[#a39081] tracking-wider uppercase font-bold mt-1">
                        *Detail in notes box
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Compound Radius Custom Text Boxes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-[#1a1a1c] pt-5 rounded-none">
              <div>
                <span className="block text-[9px] font-bold tracking-[0.25em] text-[#5a554f] mb-1.5 uppercase">NUT RADIUS PROFILE</span>
                <input
                  type="text"
                  value={config.radiusNut}
                  onChange={(e) => updateConfig({ radiusNut: e.target.value })}
                  placeholder={config.measurementSystem === 'metric' ? 'e.g. 241' : 'e.g. 9.5'}
                  className="w-full bg-[#121213] border border-[#1a1a1c] text-white px-3 py-2 text-xs font-bold tracking-widest focus:outline-none focus:border-[#a39081] rounded-none"
                />
              </div>
              <div>
                <span className="block text-[9px] font-bold tracking-[0.25em] text-[#5a554f] mb-1.5 uppercase">LAST FRET RADIUS PROFILE</span>
                <input
                  type="text"
                  value={config.radiusLastFret}
                  onChange={(e) => updateConfig({ radiusLastFret: e.target.value })}
                  placeholder={config.measurementSystem === 'metric' ? 'e.g. 406' : 'e.g. 16.0'}
                  className="w-full bg-[#121213] border border-[#1a1a1c] text-white px-3 py-2 text-xs font-bold tracking-widest focus:outline-none focus:border-[#a39081] rounded-none"
                />
              </div>
            </div>

            {/* Microtonal / EDO Mode Selection */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <span className="block text-[9px] font-bold tracking-[0.25em] text-[#5a554f] uppercase">EDO TUNING MATRIX</span>
                <span className="text-[8px] tracking-wider text-[#a39081] font-bold uppercase">TEMPERAMENT MODE</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {([
                  { id: 'standard_12_edo', name: 'Standard 12-EDO', desc: 'Default Western equal temperament. Absolute versatility.' },
                  { id: 'microtonal_19_edo', name: 'Microtonal 19-EDO', desc: 'Expanded acoustic architecture with 19 intervals per octave (+$120).' },
                  { id: 'microtonal_31_edo', name: 'Microtonal 31-EDO', desc: 'Ultra-pure microtonal spacing with 31 intervals per octave (+$120).' },
                  { id: 'fretless', name: 'Pure Fretless', desc: 'Complete freedom. Flat un-fretted slate face for liquid glass slides.' }
                ] as { id: EdoFretlessMode; name: string; desc: string }[]).map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => updateConfig({ edoMode: mode.id })}
                    className={`relative p-3.5 text-left rounded-none border transition-all duration-200 font-sans ${
                      config.edoMode === mode.id
                        ? 'border-[#a39081]/60 bg-[#121213] text-[#a39081]'
                        : 'border-[#1a1a1c] bg-[#0c0c0d] text-[#5a554f] hover:border-[#333132] hover:text-[#e3e3e5]'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-[10px] font-bold tracking-wider uppercase">{mode.name}</span>
                      {config.edoMode === mode.id && <Check className="w-3.5 h-3.5 text-[#a39081]" />}
                    </div>
                    <span className="block text-[9px] text-[#5a554f] tracking-wide font-bold uppercase leading-relaxed">
                      {mode.desc}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Number of Frets Selection */}
            {config.edoMode !== 'fretless' && (
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="block text-[9px] font-bold tracking-[0.25em] text-[#5a554f] uppercase">NUMBER OF FRETS / SCALE SPAN</span>
                  <span className="text-[9.5px] text-[#a39081] font-bold uppercase tracking-widest">{config.numberOfFrets} FRETS</span>
                </div>
                <input
                  type="range"
                  min="21"
                  max="36"
                  value={config.numberOfFrets}
                  onChange={(e) => updateConfig({ numberOfFrets: parseInt(e.target.value) })}
                  className="w-full h-[1px] bg-[#1a1a1c] appearance-none cursor-pointer accent-[#a39081]"
                />
              </div>
            )}

            {/* Scalloping controls */}
            {config.edoMode !== 'fretless' && (
              <div className="border-t border-[#1a1a1c] pt-5 space-y-4 rounded-none">
                <div className="flex justify-between items-center">
                  <span className="block text-[9px] font-bold tracking-[0.25em] text-[#5a554f] uppercase">BIOMETRIC SCALLOPED GUILD</span>
                  <div className="flex border border-[#1a1a1c] bg-[#0c0c0d] p-0.5 rounded-none">
                    <button
                      onClick={() => updateConfig({ scalloped: false })}
                      className={`px-3 py-1 text-[9px] font-bold tracking-widest uppercase transition-colors rounded-none ${
                        !config.scalloped
                          ? 'bg-[#a39081] text-[#000000]'
                          : 'text-[#5a554f] hover:text-[#e3e3e5]'
                      }`}
                    >
                      FLAT BOARD
                    </button>
                    <button
                      onClick={() => updateConfig({ scalloped: true })}
                      className={`px-3 py-1 text-[9px] font-bold tracking-widest uppercase transition-colors rounded-none ${
                        config.scalloped
                          ? 'bg-[#a39081] text-[#000000]'
                          : 'text-[#5a554f] hover:text-[#e3e3e5]'
                      }`}
                    >
                      SCALLOPED (+$180)
                    </button>
                  </div>
                </div>
                {config.scalloped && (
                  <div className="flex items-center gap-3 bg-[#111112] p-3 border border-[#1a1a1c] rounded-none">
                    <span className="text-[9px] text-[#5a554f] font-bold uppercase tracking-wider">SCALLOP INTEGRATION START FRET</span>
                    <input
                      type="number"
                      min="1"
                      max={config.numberOfFrets - 1}
                      value={config.scallopedStartFret}
                      onChange={(e) => updateConfig({ scallopedStartFret: parseInt(e.target.value) || 12 })}
                      className="w-16 bg-[#0c0c0d] border border-[#1a1a1c] text-white px-2 py-1 text-[10px] font-bold tracking-widest text-center focus:outline-none focus:border-[#a39081] rounded-none"
                    />
                    <span className="text-[9.5px] text-[#a39081] font-bold uppercase tracking-wider ml-auto">
                      TO LAST FRET ({config.numberOfFrets})
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* GET EXTRA FRETBOARD - MODULAR EXCLUSIVITY */}
            {config.modularFretboard && (
              <div className="border-t border-[#1a1a1c] pt-6 space-y-4 rounded-none">
                <div className="flex justify-between items-center">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-[#e3e3e5] tracking-wider uppercase font-bold">ADDITIONAL MODULAR FRETBOARDS</span>
                    <span className="text-[9px] text-[#5a554f] tracking-wider uppercase font-bold mt-1">Interchangeable accessory modules (+$150 ea, max 3)</span>
                  </div>
                  {config.extraFretboards.length < 3 && (
                    <button
                      onClick={addExtraFretboard}
                      className="flex items-center gap-1.5 px-3 py-1.5 border border-[#a39081] text-[#a39081] hover:bg-[#a39081] hover:text-[#000000] text-[9px] tracking-widest uppercase font-bold transition-all rounded-none"
                    >
                      <Plus className="w-3 h-3" />
                      ADD BLANK
                    </button>
                  )}
                </div>

                {config.extraFretboards.map((board, index) => (
                  <div key={board.id} className="border border-[#1a1a1c] bg-[#111112] p-4 space-y-4 rounded-none relative">
                    <div className="flex items-center justify-between border-b border-[#1c1c1f] pb-2 rounded-none">
                      <span className="text-[9px] text-[#a39081] tracking-[0.2em] font-bold uppercase">
                        MODULAR BOARD MODULE #0{index + 1}
                      </span>
                      <button
                        onClick={() => removeExtraFretboard(board.id)}
                        className="text-[#ef4444] hover:text-red-400 p-1 rounded-none"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 rounded-none">
                      {/* Material */}
                      <div>
                        <span className="block text-[8px] font-bold tracking-[0.2em] text-[#5a554f] mb-1 uppercase">MATERIAL COMPOSITION</span>
                        <select
                          value={board.material}
                          onChange={(e) => updateExtraFretboard(board.id, { material: e.target.value as any })}
                          className="w-full bg-[#0c0c0d] border border-[#1a1a1c] text-[#e3e3e5] text-[10px] uppercase font-bold tracking-widest px-2 py-1.5 focus:outline-none focus:border-[#a39081] rounded-none"
                        >
                          {RICHLITE_OPTIONS.map(opt => (
                            <option key={opt.id} value={opt.id}>{opt.name.toUpperCase()}</option>
                          ))}
                        </select>
                      </div>

                      {/* Inlay */}
                      <div>
                        <span className="block text-[8px] font-bold tracking-[0.2em] text-[#5a554f] mb-1 uppercase">INLAY MATRIX</span>
                        <select
                          value={board.inlay}
                          onChange={(e) => updateExtraFretboard(board.id, { inlay: e.target.value as any })}
                          className="w-full bg-[#0c0c0d] border border-[#1a1a1c] text-[#e3e3e5] text-[10px] uppercase font-bold tracking-widest px-2 py-1.5 focus:outline-none focus:border-[#a39081] rounded-none"
                        >
                          <option value="none">STEALTH (NONE)</option>
                          <option value="dots">MICRO DOTS</option>
                          <option value="blocks">BRUTALIST BLOCKS</option>
                          <option value="custom">CUSTOM ARTWORK</option>
                        </select>
                      </div>

                      {/* EDO */}
                      <div>
                        <span className="block text-[8px] font-bold tracking-[0.2em] text-[#5a554f] mb-1 uppercase">EDO TUNING MATRIX</span>
                        <select
                          value={board.edoMode}
                          onChange={(e) => updateExtraFretboard(board.id, { edoMode: e.target.value as any })}
                          className="w-full bg-[#0c0c0d] border border-[#1a1a1c] text-[#e3e3e5] text-[10px] uppercase font-bold tracking-widest px-2 py-1.5 focus:outline-none focus:border-[#a39081] rounded-none"
                        >
                          <option value="standard_12_edo">STANDARD 12-EDO</option>
                          <option value="microtonal_19_edo">MICROTONAL 19-EDO</option>
                          <option value="microtonal_31_edo">MICROTONAL 31-EDO</option>
                          <option value="fretless">PURE FRETLESS</option>
                        </select>
                      </div>

                      {/* Frets Count */}
                      {board.edoMode !== 'fretless' && (
                        <div>
                          <span className="block text-[8px] font-bold tracking-[0.2em] text-[#5a554f] mb-1 uppercase">FRETS LENGTH</span>
                          <input
                            type="number"
                            min="21"
                            max="36"
                            value={board.numberOfFrets}
                            onChange={(e) => updateExtraFretboard(board.id, { numberOfFrets: parseInt(e.target.value) || 24 })}
                            className="w-full bg-[#0c0c0d] border border-[#1a1a1c] text-white text-[10px] font-bold tracking-widest px-2 py-1 focus:outline-none focus:border-[#a39081] rounded-none"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* SECTION 3: BODY ARCHITECTURE & ERGONOMICS */}
      <div className="border border-[#1a1a1c] bg-[#0c0c0d] rounded-none overflow-hidden">
        <button
          id="category-header-body"
          onClick={() => toggleCategory('body')}
          className="w-full flex items-center justify-between px-5 py-4 text-left font-bold text-[#e3e3e5] hover:bg-[#121213] transition-colors rounded-none font-sans"
        >
          <div className="flex items-center gap-3">
            <span className="text-[9px] text-[#a39081] tracking-[0.25em] font-bold font-sans">03 /</span>
            <span className="tracking-[0.2em] text-[10px] uppercase font-bold font-sans">BODY SILHOUETTE & ERGONOMICS</span>
          </div>
          {activeCategory === 'body' ? <ChevronUp className="w-4 h-4 text-[#a39081]" /> : <ChevronDown className="w-4 h-4 text-[#5a554f]" />}
        </button>

        {activeCategory === 'body' && (
          <div className="p-5 border-t border-[#1a1a1c] space-y-6">

            {/* Seated Position */}
            <div>
              <span className="block text-[9px] font-bold tracking-[0.25em] text-[#5a554f] mb-3 uppercase">PREFERED SEATED POSTURE</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {([
                  { id: 'classical_chair', label: 'Classical on Standard Chair' },
                  { id: 'classical_left_leg_stool', label: 'Classical with Foot Stool' },
                  { id: 'standard', label: 'Standard Casual Right Leg' },
                  { id: 'standard_right_leg_stool', label: 'Standard with Right Foot Stool' },
                  { id: 'right_leg_strap', label: 'Resting on Leg with Strap Support' }
                ] as { id: SeatedPosition; label: string }[]).map((pos) => (
                  <button
                    key={pos.id}
                    onClick={() => updateConfig({ seatedPosition: pos.id })}
                    className={`relative p-3 text-left rounded-none border transition-all duration-200 font-sans ${
                      config.seatedPosition === pos.id
                        ? 'border-[#a39081]/60 bg-[#121213] text-[#a39081]'
                        : 'border-[#1a1a1c] bg-[#0c0c0d] text-[#5a554f] hover:border-[#333132] hover:text-[#e3e3e5]'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold tracking-wider uppercase">{pos.label}</span>
                      {config.seatedPosition === pos.id && <Check className="w-3.5 h-3.5 text-[#a39081]" />}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Neck Angle Input */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="block text-[9px] font-bold tracking-[0.25em] text-[#5a554f] uppercase">NECK ATTACK ANGLE</span>
                <span className="text-[9.5px] text-[#a39081] font-bold uppercase tracking-widest">{config.neckAngle}° ANGLE</span>
              </div>
              <p className="text-[9.5px] text-[#5a554f] uppercase tracking-wider font-bold mb-3">
                Target play angle (0° indicates perfectly parallel with the horizon).
              </p>
              <input
                type="range"
                min="-15"
                max="45"
                value={config.neckAngle}
                onChange={(e) => updateConfig({ neckAngle: parseInt(e.target.value) })}
                className="w-full h-[1px] bg-[#1a1a1c] appearance-none cursor-pointer accent-[#a39081]"
              />
            </div>

            {/* LIVE ERGONOMIC RECOMMENDATION CARD */}
            <div className="border border-[#1a1a1c] bg-[#111112] p-4 rounded-none space-y-3">
              <div className="flex items-center gap-2 text-[9px] tracking-[0.25em] text-[#a39081] font-bold uppercase">
                <Sliders className="w-3.5 h-3.5" />
                <span>ERGONOMIC COMPATIBILITY REPORT</span>
              </div>
              <p className="text-[10px] leading-relaxed text-[#5a554f] uppercase font-bold">
                Based on your preference for <span className="text-white">{config.seatedPosition.toUpperCase().replace(/_/g, ' ')}</span>, we highly recommend:
              </p>
              <div className="flex items-center justify-between border-t border-[#1c1c1f] pt-3 rounded-none">
                <div className="flex flex-col">
                  <span className="text-sm font-black text-white tracking-widest uppercase">{recommendation.shape}</span>
                  <span className="text-[9px] text-[#5a554f] tracking-wider uppercase font-bold mt-1 max-w-sm">
                    {recommendation.explanation}
                  </span>
                </div>
                <button
                  onClick={() => updateConfig({ bodyShape: recommendation.shapeId as any })}
                  className={`px-3 py-1.5 border border-[#a39081] text-[#a39081] hover:bg-[#a39081] hover:text-black text-[9px] tracking-widest font-bold uppercase transition-all rounded-none ${
                    config.bodyShape === recommendation.shapeId ? 'opacity-40 pointer-events-none' : ''
                  }`}
                >
                  {config.bodyShape === recommendation.shapeId ? 'APPLIED' : 'APPLY SPEC'}
                </button>
              </div>
            </div>

            {/* Custom Shapes (Original selection) */}
            <div className="border-t border-[#1a1a1c] pt-5">
              <span className="block text-[9px] font-bold tracking-[0.25em] text-[#5a554f] mb-3 uppercase">MANUAL OVERRIDE SHAPE</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {Object.values(BODY_SHAPES).map((shape) => (
                  <button
                    key={shape.id}
                    onClick={() => updateConfig({ bodyShape: shape.id as any })}
                    className={`relative p-3.5 text-left rounded-none border transition-all duration-200 font-sans ${
                      config.bodyShape === shape.id
                        ? 'border-[#a39081]/60 bg-[#121213] text-[#a39081]'
                        : 'border-[#1a1a1c] bg-[#0c0c0d] text-[#5a554f] hover:border-[#333132] hover:text-[#e3e3e5]'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1.5">
                      <span className="text-[10px] font-bold tracking-wider uppercase">{shape.name.split(' (')[0]}</span>
                      {config.bodyShape === shape.id && <Check className="w-3.5 h-3.5 text-[#a39081]" />}
                    </div>
                    <span className="block text-[9px] tracking-widest font-bold opacity-80 uppercase">
                      {shape.priceDelta === 0 ? 'STANDARD' : `+$${shape.priceDelta}`}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Body Woods */}
            <div>
              <span className="block text-[9px] font-bold tracking-[0.25em] text-[#5a554f] mb-3 uppercase">BODY CORE TONELUMBER</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {Object.values(BODY_WOODS).map((wood) => (
                  <button
                    key={wood.id}
                    onClick={() => updateConfig({ bodyWood: wood.id as any })}
                    className={`relative p-3.5 text-left rounded-none border transition-all duration-200 font-sans ${
                      config.bodyWood === wood.id
                        ? 'border-[#a39081]/60 bg-[#121213] text-[#a39081]'
                        : 'border-[#1a1a1c] bg-[#0c0c0d] text-[#5a554f] hover:border-[#333132] hover:text-[#e3e3e5]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-none border border-black/10" style={{ backgroundColor: wood.color }} />
                        <span className="text-[10px] font-bold tracking-wider uppercase">{wood.name}</span>
                      </div>
                      {config.bodyWood === wood.id && <Check className="w-3.5 h-3.5 text-[#a39081]" />}
                    </div>
                    <span className="block text-[9px] tracking-widest font-bold opacity-80 uppercase">
                      {wood.priceDelta === 0 ? 'STANDARD' : `+$${wood.priceDelta}`}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* SECTION 4: COATINGS & LACQUER */}
      <div className="border border-[#1a1a1c] bg-[#0c0c0d] rounded-none overflow-hidden">
        <button
          id="category-header-finish"
          onClick={() => toggleCategory('finish')}
          className="w-full flex items-center justify-between px-5 py-4 text-left font-bold text-[#e3e3e5] hover:bg-[#121213] transition-colors rounded-none font-sans"
        >
          <div className="flex items-center gap-3">
            <span className="text-[9px] text-[#a39081] tracking-[0.25em] font-bold font-sans">04 /</span>
            <span className="tracking-[0.2em] text-[10px] uppercase font-bold font-sans">COATINGS & LACQUER</span>
          </div>
          {activeCategory === 'finish' ? <ChevronUp className="w-4 h-4 text-[#a39081]" /> : <ChevronDown className="w-4 h-4 text-[#5a554f]" />}
        </button>

        {activeCategory === 'finish' && (
          <div className="p-5 border-t border-[#1a1a1c]">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {FINISH_PRESETS.map((finish) => (
                <button
                  key={finish.id}
                  onClick={() => updateConfig({ finishPreset: finish.id })}
                  className={`relative p-3 text-left rounded-none border transition-all duration-200 font-sans ${
                    config.finishPreset === finish.id
                      ? 'border-[#a39081]/60 bg-[#121213] text-[#a39081]'
                      : 'border-[#1a1a1c] bg-[#0c0c0d] text-[#5a554f] hover:border-[#333132] hover:text-[#e3e3e5]'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className="w-2.5 h-2.5 rounded-none border border-black/20 shrink-0"
                      style={{
                        background: finish.colorSecondary
                          ? `linear-gradient(135deg, ${finish.color} 0%, ${finish.colorSecondary} 100%)`
                          : finish.color,
                      }}
                    />
                    <span className="text-[10px] font-bold leading-tight truncate uppercase tracking-wider">{finish.name}</span>
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-[9px] uppercase tracking-widest font-bold opacity-50">
                      {finish.type}
                    </span>
                    <span className="text-[9px] font-bold tracking-widest uppercase">
                      {finish.priceDelta === 0 ? 'STANDARD' : `+$${finish.priceDelta}`}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* SECTION 5: PLATINGS & HARDWARE ACCENTS */}
      <div className="border border-[#1a1a1c] bg-[#0c0c0d] rounded-none overflow-hidden">
        <button
          id="category-header-hardware"
          onClick={() => toggleCategory('hardware')}
          className="w-full flex items-center justify-between px-5 py-4 text-left font-bold text-[#e3e3e5] hover:bg-[#121213] transition-colors rounded-none font-sans"
        >
          <div className="flex items-center gap-3">
            <span className="text-[9px] text-[#a39081] tracking-[0.25em] font-bold font-sans">05 /</span>
            <span className="tracking-[0.2em] text-[10px] uppercase font-bold font-sans">PLATINGS, ANCHORAGES & NUT</span>
          </div>
          {activeCategory === 'hardware' ? <ChevronUp className="w-4 h-4 text-[#a39081]" /> : <ChevronDown className="w-4 h-4 text-[#5a554f]" />}
        </button>

        {activeCategory === 'hardware' && (
          <div className="p-5 border-t border-[#1a1a1c] space-y-6">

            {/* Metallic Plating (Original color selection) */}
            <div>
              <span className="block text-[9px] font-bold tracking-[0.25em] text-[#5a554f] mb-3 uppercase">METALLIC ANODIZED COLOR</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {Object.values(HARDWARE_COLORS).map((color) => (
                  <button
                    key={color.id}
                    onClick={() => updateConfig({ hardwareColor: color.id as any })}
                    className={`relative p-3.5 text-left rounded-none border transition-all duration-200 font-sans ${
                      config.hardwareColor === color.id
                        ? 'border-[#a39081]/60 bg-[#121213] text-[#a39081]'
                        : 'border-[#1a1a1c] bg-[#0c0c0d] text-[#5a554f] hover:border-[#333132] hover:text-[#e3e3e5]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-none border border-neutral-800" style={{ backgroundColor: color.hex }} />
                        <span className="text-[10px] font-bold tracking-wider uppercase">{color.name.split(' (')[0].replace(' Finish', '').replace(' Plated', '')}</span>
                      </div>
                      {config.hardwareColor === color.id && <Check className="w-3.5 h-3.5 text-[#a39081]" />}
                    </div>
                    <span className="block text-[9px] tracking-widest font-bold opacity-80 uppercase">
                      {color.priceDelta === 0 ? 'STANDARD' : `+$${color.priceDelta}`}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Bridge Selection */}
            <div>
              <span className="block text-[9px] font-bold tracking-[0.25em] text-[#5a554f] mb-3 uppercase">BRIDGE COUPLING ARCHITECTURE</span>
              <select
                value={config.bridgeType}
                onChange={(e) => updateConfig({ bridgeType: e.target.value })}
                className="w-full bg-[#121213] border border-[#1a1a1c] text-white text-[11px] font-bold tracking-widest px-3 py-2.5 uppercase focus:outline-none focus:border-[#a39081] rounded-none"
              >
                <option value="fixed_hardtail">SOLID BASALT-COUPLING FIXED HARDTAIL (STANDARD)</option>
                <option value="thru_body">HIGH-TENSION STRING THRU BODY RECESSED RAILS</option>
                <option value="floating_trem">E-Z ZERO COLD-STEEL FLOATING TREMOLO SYSTEM</option>
              </select>
            </div>

            {/* Tuners Selection */}
            <div>
              <span className="block text-[9px] font-bold tracking-[0.25em] text-[#5a554f] mb-3 uppercase">ROTATING MACHINE HEAD TUNERS</span>
              <select
                value={config.tunerType}
                onChange={(e) => updateConfig({ tunerType: e.target.value })}
                className="w-full bg-[#121213] border border-[#1a1a1c] text-white text-[11px] font-bold tracking-widest px-3 py-2.5 uppercase focus:outline-none focus:border-[#a39081] rounded-none"
              >
                <option value="locking_standard">1:21 LUXE INDUSTRIAL BACK-LOCKING TUNERS</option>
                <option value="headless_knurled">COAXIAL REAR BRUTALIST HEADLESS CYLINDERS</option>
                <option value="traditional_closed">HERITAGE FINELY CALIBRATED CLOSED GEARS</option>
              </select>
            </div>

            {/* Knobs Selection */}
            <div>
              <span className="block text-[9px] font-bold tracking-[0.25em] text-[#5a554f] mb-3 uppercase">POTENTIOMETER KNOB ARCHITECTURE</span>
              <select
                value={config.knobType}
                onChange={(e) => updateConfig({ knobType: e.target.value })}
                className="w-full bg-[#121213] border border-[#1a1a1c] text-white text-[11px] font-bold tracking-widest px-3 py-2.5 uppercase focus:outline-none focus:border-[#a39081] rounded-none"
              >
                <option value="knurled_dome">KNURLED INDUSTRIAL COAL-BLACK SOLID DOME</option>
                <option value="skirted_brutalist">FLAT SKIRTED BRUTALIST MILLED BASALT CONE</option>
                <option value="stealth_recessed">STEALTH RECESSED FLAT HEAD DIAL INDICATORS</option>
              </select>
            </div>

            {/* Nut Selection */}
            <div>
              <span className="block text-[9px] font-bold tracking-[0.25em] text-[#5a554f] mb-3 uppercase">ZERO FRETS OR NUT COMPOSITION</span>
              <select
                value={config.nutType}
                onChange={(e) => updateConfig({ nutType: e.target.value })}
                className="w-full bg-[#121213] border border-[#1a1a1c] text-white text-[11px] font-bold tracking-widest px-3 py-2.5 uppercase focus:outline-none focus:border-[#a39081] rounded-none"
              >
                <option value="graph_tech_tusq">GRAPH TECH BLACK TUSQ SLEEK SLIDING COMPONENT</option>
                <option value="zero_fret_stainless">INTEGRATED STAINLESS-STEEL ZERO FRET SADDLE</option>
                <option value="solid_bell_bronze">SOLID MILLED BELL BRONZE HIGH-ATTACK COUPLER</option>
              </select>
            </div>

            {/* Pickguards */}
            <div>
              <span className="block text-[9px] font-bold tracking-[0.25em] text-[#5a554f] mb-3 uppercase">PROTECTIVE COVER SHIELD STYLE</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {Object.values(PICKGUARD_STYLES).map((style) => (
                  <button
                    key={style.id}
                    onClick={() => updateConfig({ pickguardStyle: style.id as any })}
                    className={`relative p-3 text-left rounded-none border transition-all duration-200 font-sans ${
                      config.pickguardStyle === style.id
                        ? 'border-[#a39081]/60 bg-[#121213] text-[#a39081]'
                        : 'border-[#1a1a1c] bg-[#0c0c0d] text-[#5a554f] hover:border-[#333132] hover:text-[#e3e3e5]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5">
                        {style.color && (
                          <span className="w-2.5 h-2.5 rounded-none border border-black/10" style={{ backgroundColor: style.color }} />
                        )}
                        <span className="text-[10px] font-bold tracking-wider uppercase">{style.name.replace(' (Bare Top)', '')}</span>
                      </div>
                      {config.pickguardStyle === style.id && <Check className="w-3.5 h-3.5 text-[#a39081]" />}
                    </div>
                    <p className="text-[9.5px] text-[#5a554f] uppercase tracking-wider font-bold truncate">{style.description}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* SECTION 6: COILS, CAPACITORS & PREAMPS */}
      <div className="border border-[#1a1a1c] bg-[#0c0c0d] rounded-none overflow-hidden">
        <button
          id="category-header-electronics"
          onClick={() => toggleCategory('electronics')}
          className="w-full flex items-center justify-between px-5 py-4 text-left font-bold text-[#e3e3e5] hover:bg-[#121213] transition-colors rounded-none font-sans"
        >
          <div className="flex items-center gap-3">
            <span className="text-[9px] text-[#a39081] tracking-[0.25em] font-bold font-sans">06 /</span>
            <span className="tracking-[0.2em] text-[10px] uppercase font-bold font-sans">COILS, FILTER CAPACITORS & PREAMPS</span>
          </div>
          {activeCategory === 'electronics' ? <ChevronUp className="w-4 h-4 text-[#a39081]" /> : <ChevronDown className="w-4 h-4 text-[#5a554f]" />}
        </button>

        {activeCategory === 'electronics' && (
          <div className="p-5 border-t border-[#1a1a1c] space-y-6">

            {/* Pickups Layout */}
            <div>
              <span className="block text-[9px] font-bold tracking-[0.25em] text-[#5a554f] mb-3 uppercase">TRANSDUCERS ELECTROMAGNETIC CONFIGURATION</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {Object.values(PICKUPS_LAYOUTS).map((layout) => (
                  <button
                    key={layout.id}
                    onClick={() => updateConfig({ pickupsLayout: layout.id as any })}
                    className={`relative p-3.5 text-left rounded-none border transition-all duration-200 font-sans ${
                      config.pickupsLayout === layout.id
                        ? 'border-[#a39081]/60 bg-[#121213] text-[#a39081]'
                        : 'border-[#1a1a1c] bg-[#0c0c0d] text-[#5a554f] hover:border-[#333132] hover:text-[#e3e3e5]'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1.5">
                      <span className="text-[10px] font-bold tracking-wider uppercase">{isBass ? layout.name.replace('Humbucker', 'Bass Coil').replace('Single', 'Soapbar').split(' (')[0] : layout.name.split(' (')[0]}</span>
                      {config.pickupsLayout === layout.id && <Check className="w-3.5 h-3.5 text-[#a39081]" />}
                    </div>
                    <span className="block text-[9px] tracking-widest font-bold opacity-80 mb-1 uppercase">
                      {layout.priceDelta === 0 ? 'STANDARD' : `+$${layout.priceDelta}`}
                    </span>
                    <p className="text-[9.5px] text-[#5a554f] uppercase tracking-wider font-bold line-clamp-2 leading-relaxed">
                      {isBass ? (layout.description || '').replace('humbucker', 'bass humbucker').replace('single-coils', 'soapbars') : layout.description}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Active Preamp Upgrade */}
            <div className="flex items-center justify-between border-t border-[#1a1a1c] pt-5 rounded-none">
              <div className="flex flex-col">
                <span className="text-[10px] text-[#e3e3e5] tracking-wider uppercase font-bold">LUXE 18V LOW-IMPEDANCE ACTIVE PREAMPLIFIER</span>
                <span className="text-[9px] text-[#5a554f] tracking-wider uppercase font-bold mt-1">High-fidelity clean gain & onboard active EQ (+$95)</span>
              </div>
              <div className="flex border border-[#1a1a1c] bg-[#0c0c0d] p-0.5 rounded-none">
                <button
                  onClick={() => updateConfig({ activePreamp: false })}
                  className={`px-3 py-1 text-[9px] font-bold tracking-widest uppercase transition-colors rounded-none ${
                    !config.activePreamp
                      ? 'bg-[#a39081] text-[#000000]'
                      : 'text-[#5a554f] hover:text-[#e3e3e5]'
                  }`}
                >
                  PASSIVE
                </button>
                <button
                  onClick={() => updateConfig({ activePreamp: true })}
                  className={`px-3 py-1 text-[9px] font-bold tracking-widest uppercase transition-colors rounded-none ${
                    config.activePreamp
                      ? 'bg-[#a39081] text-[#000000]'
                      : 'text-[#5a554f] hover:text-[#e3e3e5]'
                  }`}
                >
                  ACTIVE (+$95)
                </button>
              </div>
            </div>

            {/* Tone Capacitor Choice */}
            <div>
              <span className="block text-[9px] font-bold tracking-[0.25em] text-[#5a554f] mb-3 uppercase">ANALOG PAPER-IN-OIL FILTERING CAPACITOR</span>
              <select
                value={config.toneCapacitor}
                onChange={(e) => updateConfig({ toneCapacitor: e.target.value })}
                className="w-full bg-[#121213] border border-[#1a1a1c] text-white text-[11px] font-bold tracking-widest px-3 py-2.5 uppercase focus:outline-none focus:border-[#a39081] rounded-none"
              >
                <option value="orange_drop_022">SPRAGUE ORANGE DROP .022UF (CREAMY TREBLE ROLLOFF)</option>
                <option value="bumblebee_paper">LUXE BUMBLEBEE PAPER-IN-OIL .047UF (VINTAGE WARM RESISTANCE)</option>
                <option value="silver_mica">SOVIET MILITARY SILVER MICA .01UF (GLASSY MODERN HIGHS)</option>
              </select>
            </div>

          </div>
        )}
      </div>

    </div>
  );
};
