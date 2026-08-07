import React, { useState } from 'react';
import { useGuitarStore } from '../store/guitarStore';
import { BODY_SHAPES, BODY_WOODS, PICKUPS_LAYOUTS, HARDWARE_COLORS, PICKGUARD_STYLES, FINISH_PRESETS } from '../constants/catalog';
import { ChevronDown, ChevronUp, Check, Plus, Trash2, Sliders } from 'lucide-react';
import type { RichliteType, InlayStyle, ExtraFretboardConfig, SeatedPosition, NeckProfile } from '../types/guitar';

// Genuine Richlite colors
const RICHLITE_OPTIONS: { id: RichliteType; name: string; color: string }[] = [
  { id: 'black_diamond', name: 'Black Diamond', color: '#151516' },
  { id: 'maple_valley', name: 'Maple Valley', color: '#8b5a2b' },
  { id: 'grays_harbor', name: 'Grays Harbor', color: '#565a5c' },
  { id: 'rosedale', name: 'Rosedale', color: '#2f1f17' },
  { id: 'redstone', name: 'Redstone', color: '#8a3324' },
  { id: 'browns_point', name: 'Browns Point', color: '#4a3b32' },
  { id: 'chocolate_glacier', name: 'Chocolate Glacier', color: '#32251a' },
  { id: 'blue_canyon', name: 'Blue Canyon', color: '#202e3b' },
  { id: 'columbia', name: 'Columbia', color: '#1c352d' },
  { id: 'luna', name: 'Luna', color: '#a6a29a' },
  { id: 'eldorado', name: 'Eldorado', color: '#7a5a3a' },
  { id: 'dragontail', name: 'Dragontail', color: '#3d1c1c' },
  { id: 'glacier', name: 'Glacier', color: '#d1d5db' },
  { id: 'forbidden', name: 'Forbidden', color: '#111827' },
  { id: 'sloan', name: 'Sloan', color: '#4b5563' },
];

export const OptionsControlPanel: React.FC = () => {
  const { config, updateConfig } = useGuitarStore();
  const [activeCategory, setActiveCategory] = useState<string>('neck');

  const toggleCategory = (cat: string) => {
    setActiveCategory(activeCategory === cat ? '' : cat);
  };

  const isBass = config.instrumentType === 'bass';

  // Thickness math for estimation (when useCustomThickness is false)
  const estimatedThicknessMetric = Math.max(16, Math.min(26, config.relaxedHandMeasurement * 0.15));
  const estimatedThicknessImperial = estimatedThicknessMetric / 25.4;

  const currentThicknessStr = config.useCustomThickness
    ? config.customThicknessInput
    : (config.measurementSystem === 'metric'
        ? `${estimatedThicknessMetric.toFixed(1)} mm`
        : `${estimatedThicknessImperial.toFixed(2)} in`);

  // Handle EDO change with proportional fret count update
  const handleEdoChange = (newEdo: number) => {
    const oldEdo = config.edoValue || 12;
    const oldFrets = config.numberOfFrets || 24;
    // proportional scaling: newFrets = oldFrets * (newEdo / oldEdo)
    const ratio = newEdo / oldEdo;
    const newFrets = Math.max(12, Math.min(72, Math.round(oldFrets * ratio)));
    updateConfig({ edoValue: newEdo, numberOfFrets: newFrets });
  };

  // Ergonomic recommendations mapping
  const getErgonomicRecommendation = (pos: SeatedPosition): { shape: string; explanation: string; shapeId: string } => {
    if (pos === 'classical_chair' || pos === 'classical_left_leg_stool') {
      return {
        shape: 'SINGLE CUT',
        shapeId: 'single_cut',
        explanation: 'Anchors perfectly on the left thigh, stabilizing neck rise.'
      };
    } else if (pos === 'right_leg_strap') {
      return {
        shape: 'OFFSET WAIST',
        shapeId: 'offset',
        explanation: 'Balanced weight distribution for standing and low strap plays.'
      };
    } else {
      return {
        shape: 'MODERN ST',
        shapeId: 'modern_st',
        explanation: 'Double cutaway geometry offers maximum body comfort.'
      };
    }
  };

  const recommendation = getErgonomicRecommendation(config.seatedPosition);

  // Modular extra fretboards
  const addExtraFretboard = () => {
    if (config.extraFretboards.length >= 3) return;
    const newBoard: ExtraFretboardConfig = {
      id: Math.random().toString(36).substr(2, 9),
      material: 'black_diamond',
      inlay: 'dots',
      edoValue: 12,
      isFretless: false,
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

      {/* MEASUREMENT SYSTEM SWITCHER */}
      <div className="flex items-center justify-between border-b border-[#1c1c1f] pb-4 rounded-none">
        <div className="flex flex-col">
          <span className="text-[9px] text-[#a39081] tracking-[0.25em] font-bold uppercase">SYSTEM STANDARDS</span>
          <span className="text-[10px] text-[#e3e3e5] tracking-wider uppercase font-bold">MEASUREMENT METRICS</span>
        </div>
        <div className="flex border border-[#1c1c1f] bg-[#000000] p-0.5 rounded-none">
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

      {/* SECTION 1: NECK */}
      <div className="border border-[#1c1c1f] bg-[#000000] rounded-none overflow-hidden">
        <button
          id="category-header-neck"
          onClick={() => toggleCategory('neck')}
          className="w-full flex items-center justify-between px-5 py-4 text-left font-bold text-[#e3e3e5] hover:bg-[#000000] transition-colors rounded-none font-sans"
        >
          <div className="flex items-center gap-3">
            <span className="text-[9px] text-[#a39081] tracking-[0.25em] font-bold font-sans">01 /</span>
            <span className="tracking-[0.2em] text-[10px] uppercase font-bold font-sans">NECK</span>
          </div>
          {activeCategory === 'neck' ? <ChevronUp className="w-4 h-4 text-[#a39081]" /> : <ChevronDown className="w-4 h-4 text-[#5a554f]" />}
        </button>

        {activeCategory === 'neck' && (
          <div className="p-5 border-t border-[#1c1c1f] space-y-6">

            {/* Shortened Joint Explanation */}
            <div className="bg-[#050506] border-l-2 border-[#a39081] p-3 text-[10px] leading-relaxed text-[#5a554f] uppercase tracking-wider font-semibold rounded-none">
              Monocoque one-piece carbon fiber body core. Integrated via a rigid "bolt through" neck joint featuring custom pillar bedding, with locking anchorage screws driven directly through the top face.
            </div>

            {/* Profile Selection - Clean & Inline Vector Profiles */}
            <div>
              <span className="block text-[9px] font-bold tracking-[0.25em] text-[#5a554f] mb-3 uppercase">PROFILE</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {(['teardrop', 'scooped', 'trapezoid'] as NeckProfile[]).map((profile) => (
                  <button
                    key={profile}
                    onClick={() => updateConfig({ neckProfile: profile })}
                    className={`relative p-3.5 text-left rounded-none border transition-all duration-200 font-sans flex flex-col justify-between h-32 ${
                      config.neckProfile === profile
                        ? 'border-[#a39081]/60 bg-[#000000] text-[#a39081]'
                        : 'border-[#1c1c1f] bg-[#000000] text-[#5a554f] hover:border-[#333132] hover:text-[#e3e3e5]'
                    }`}
                  >
                    <div className="flex justify-between items-start w-full">
                      <span className="text-[10px] font-bold tracking-wider uppercase">{profile}</span>
                      {config.neckProfile === profile && <Check className="w-3.5 h-3.5 text-[#a39081]" />}
                    </div>

                    {/* Simple inline SVG profile preview */}
                    <div className="w-full flex justify-center py-2">
                      <svg width="60" height="20" viewBox="0 0 60 20" className="stroke-current opacity-80">
                        {profile === 'teardrop' && (
                          <path d="M 5 2 C 5 2, 20 18, 30 18 C 45 18, 55 2, 55 2" fill="none" strokeWidth="1.5" />
                        )}
                        {profile === 'scooped' && (
                          <path d="M 5 2 C 5 2, 15 11, 30 11 C 45 11, 55 2, 55 2" fill="none" strokeWidth="1.5" />
                        )}
                        {profile === 'trapezoid' && (
                          <path d="M 5 2 L 18 16 L 42 16 L 55 2" fill="none" strokeWidth="1.5" />
                        )}
                      </svg>
                    </div>

                    <span className="block text-[8px] text-center tracking-widest uppercase font-bold opacity-70">
                      {profile === 'teardrop' && 'SOFT ASYMMETRICAL'}
                      {profile === 'scooped' && 'LOW-PROFILE THIN'}
                      {profile === 'trapezoid' && 'INDEXED FACETS'}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Thickness Selection - Uncluttered direct metric/typed inputs */}
            <div className="space-y-4">
              <span className="block text-[9px] font-bold tracking-[0.25em] text-[#5a554f] uppercase">THICKNESS</span>

              <div className="flex border border-[#1c1c1f] bg-[#000000] p-0.5 w-max rounded-none">
                <button
                  type="button"
                  onClick={() => updateConfig({ useCustomThickness: false })}
                  className={`px-3 py-1 text-[8px] font-bold tracking-widest uppercase transition-colors rounded-none ${
                    !config.useCustomThickness
                      ? 'bg-[#a39081] text-[#000000]'
                      : 'text-[#5a554f] hover:text-[#e3e3e5]'
                  }`}
                >
                  BIOMETRIC ESTIMATE
                </button>
                <button
                  type="button"
                  onClick={() => updateConfig({ useCustomThickness: true })}
                  className={`px-3 py-1 text-[8px] font-bold tracking-widest uppercase transition-colors rounded-none ${
                    config.useCustomThickness
                      ? 'bg-[#a39081] text-[#000000]'
                      : 'text-[#5a554f] hover:text-[#e3e3e5]'
                  }`}
                >
                  CUSTOM TYPED
                </button>
              </div>

              {!config.useCustomThickness ? (
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    step="0.1"
                    value={config.relaxedHandMeasurement}
                    onChange={(e) => updateConfig({ relaxedHandMeasurement: parseFloat(e.target.value) || 0 })}
                    className="w-32 bg-[#000000] border border-[#1c1c1f] text-white px-3 py-2 text-xs font-bold tracking-widest text-center focus:outline-none focus:border-[#a39081] rounded-none"
                  />
                  <span className="text-[9px] text-[#5a554f] tracking-widest uppercase font-bold">
                    {config.measurementSystem === 'metric' ? 'MM GRIP SPAN' : 'IN GRIP SPAN'}
                  </span>
                  <div className="h-[1px] bg-[#1a1a1c] flex-1" />
                  <span className="text-[9.5px] text-[#a39081] font-bold uppercase tracking-wider">
                    TARGET thickness: {currentThicknessStr}
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={config.customThicknessInput}
                    onChange={(e) => updateConfig({ customThicknessInput: e.target.value })}
                    placeholder={config.measurementSystem === 'metric' ? 'e.g. 19.5mm' : 'e.g. 0.78"'}
                    className="w-full max-w-xs bg-[#000000] border border-[#1c1c1f] text-white px-3 py-2 text-xs font-bold tracking-widest focus:outline-none focus:border-[#a39081] rounded-none"
                  />
                  <span className="text-[9px] text-[#5a554f] tracking-widest uppercase font-bold">
                    SPECIFIED OVERRIDE
                  </span>
                </div>
              )}
            </div>

          </div>
        )}
      </div>

      {/* SECTION 2: FRETBOARD */}
      <div className="border border-[#1c1c1f] bg-[#000000] rounded-none overflow-hidden">
        <button
          id="category-header-fretboard"
          onClick={() => toggleCategory('fretboard')}
          className="w-full flex items-center justify-between px-5 py-4 text-left font-bold text-[#e3e3e5] hover:bg-[#000000] transition-colors rounded-none font-sans"
        >
          <div className="flex items-center gap-3">
            <span className="text-[9px] text-[#a39081] tracking-[0.25em] font-bold font-sans">02 /</span>
            <span className="tracking-[0.2em] text-[10px] uppercase font-bold font-sans">FRETBOARD</span>
          </div>
          {activeCategory === 'fretboard' ? <ChevronUp className="w-4 h-4 text-[#a39081]" /> : <ChevronDown className="w-4 h-4 text-[#5a554f]" />}
        </button>

        {activeCategory === 'fretboard' && (
          <div className="p-5 border-t border-[#1c1c1f] space-y-6">

            {/* Concise Richlite Explanation */}
            <div className="bg-[#050506] border-l-2 border-[#a39081] p-3 text-[10px] leading-relaxed text-[#5a554f] uppercase tracking-wider font-semibold rounded-none">
              Acoustically superior, stable, moisture-proof recycled paper tonewood composites. Exceptional speed and organic ebony tactile response.
            </div>

            {/* Richlite Swatch choices */}
            <div>
              <span className="block text-[9px] font-bold tracking-[0.25em] text-[#5a554f] mb-3 uppercase">MATERIAL (RICHLITE TYPE)</span>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {RICHLITE_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => updateConfig({ fretboardMaterial: opt.id })}
                    className={`relative p-2 rounded-none border transition-all duration-200 flex flex-col items-center gap-1.5 ${
                      config.fretboardMaterial === opt.id
                        ? 'border-[#a39081]/60 bg-[#000000] text-[#a39081]'
                        : 'border-[#1c1c1f] bg-[#000000] text-[#5a554f] hover:border-[#333132] hover:text-[#e3e3e5]'
                    }`}
                  >
                    <div className="w-10 h-10 border border-[#1c1c1f] rounded-none shrink-0" style={{ backgroundColor: opt.color }} />
                    <span className="text-[8px] font-bold tracking-wider text-center truncate w-full uppercase">{opt.name}</span>
                    {config.fretboardMaterial === opt.id && <Check className="w-3 h-3 text-[#a39081] absolute top-1 right-1" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Modular Fretboard system: Magnets & Pins */}
            <div className="flex items-center justify-between border-t border-[#1c1c1f] pt-5 rounded-none">
              <div className="flex flex-col">
                <span className="text-[10px] text-[#e3e3e5] tracking-wider uppercase font-bold">MODULAR FRETBOARD SYSTEM</span>
                <span className="text-[9px] text-[#5a554f] tracking-wider uppercase font-bold mt-1">Interchangeable magnetic PIN assembly (+$250)</span>
              </div>
              <div className="flex border border-[#1c1c1f] bg-[#000000] p-0.5 rounded-none">
                <button
                  onClick={() => updateConfig({ modularFretboard: false, extraFretboards: [] })}
                  className={`px-3 py-1 text-[9px] font-bold tracking-widest uppercase transition-colors rounded-none ${
                    !config.modularFretboard
                      ? 'bg-[#a39081] text-[#000000]'
                      : 'text-[#5a554f] hover:text-[#e3e3e5]'
                  }`}
                >
                  NO
                </button>
                <button
                  onClick={() => updateConfig({ modularFretboard: true })}
                  className={`px-3 py-1 text-[9px] font-bold tracking-widest uppercase transition-colors rounded-none ${
                    config.modularFretboard
                      ? 'bg-[#a39081] text-[#000000]'
                      : 'text-[#5a554f] hover:text-[#e3e3e5]'
                  }`}
                >
                  YES
                </button>
              </div>
            </div>

            {/* EDO / Fretless explanations */}
            <div className="border-t border-[#1c1c1f] pt-5 space-y-4 rounded-none">
              <div className="flex justify-between items-center">
                <span className="block text-[9px] font-bold tracking-[0.25em] text-[#5a554f] uppercase">EDO / FRETLESS</span>
                <div className="flex border border-[#1c1c1f] bg-[#000000] p-0.5 rounded-none">
                  <button
                    onClick={() => updateConfig({ isFretless: false })}
                    className={`px-3 py-1 text-[9px] font-bold tracking-widest uppercase transition-colors rounded-none ${
                      !config.isFretless
                        ? 'bg-[#a39081] text-[#000000]'
                        : 'text-[#5a554f] hover:text-[#e3e3e5]'
                    }`}
                  >
                    EDO (FRETTED)
                  </button>
                  <button
                    onClick={() => updateConfig({ isFretless: true })}
                    className={`px-3 py-1 text-[9px] font-bold tracking-widest uppercase transition-colors rounded-none ${
                      config.isFretless
                        ? 'bg-[#a39081] text-[#000000]'
                        : 'text-[#5a554f] hover:text-[#e3e3e5]'
                    }`}
                  >
                    FRETLESS
                  </button>
                </div>
              </div>

              {!config.isFretless ? (
                <div className="space-y-3 rounded-none">
                  <p className="text-[9.5px] text-[#5a554f] uppercase tracking-wider font-bold">
                    Custom Equal Divisions of the Octave. Type your EDO target to automatically recalculate fret counts proportionally.
                  </p>
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      min="6"
                      max="72"
                      value={config.edoValue}
                      onChange={(e) => handleEdoChange(parseInt(e.target.value) || 12)}
                      className="w-24 bg-[#000000] border border-[#1c1c1f] text-white px-3 py-1.5 text-xs font-bold tracking-widest text-center focus:outline-none focus:border-[#a39081] rounded-none"
                    />
                    <span className="text-[9px] text-[#5a554f] tracking-widest uppercase font-bold">
                      DIVISIONS (EDO)
                    </span>
                  </div>
                </div>
              ) : (
                <div className="bg-[#050506] border-l-2 border-[#a39081] p-3 text-[10px] leading-relaxed text-[#5a554f] uppercase tracking-wider font-semibold rounded-none">
                  Fretless configuration: Flat, liquid slate playing surface providing microtonal sliding freedom with zero physical barriers.
                </div>
              )}
            </div>

            {/* Scale Length & Multiscale inputs */}
            <div className="border-t border-[#1c1c1f] pt-5 space-y-4 rounded-none">
              <div className="flex justify-between items-center">
                <span className="block text-[9px] font-bold tracking-[0.25em] text-[#5a554f] uppercase">MULTISCALE LAYOUT</span>
                <div className="flex border border-[#1c1c1f] bg-[#000000] p-0.5 rounded-none">
                  <button
                    onClick={() => updateConfig({ multiscaleEnabled: false })}
                    className={`px-3 py-1 text-[9px] font-bold tracking-widest uppercase transition-colors rounded-none ${
                      !config.multiscaleEnabled
                        ? 'bg-[#a39081] text-[#000000]'
                        : 'text-[#5a554f] hover:text-[#e3e3e5]'
                    }`}
                  >
                    SINGLE SCALE
                  </button>
                  <button
                    onClick={() => updateConfig({ multiscaleEnabled: true })}
                    className={`px-3 py-1 text-[9px] font-bold tracking-widest uppercase transition-colors rounded-none ${
                      config.multiscaleEnabled
                        ? 'bg-[#a39081] text-[#000000]'
                        : 'text-[#5a554f] hover:text-[#e3e3e5]'
                    }`}
                  >
                    MULTISCALE (+$150)
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-none">
                <div>
                  <span className="block text-[8px] font-bold tracking-[0.2em] text-[#5a554f] mb-1.5 uppercase">BASS-SIDE SCALE LENGTH</span>
                  <input
                    type="number"
                    step="0.1"
                    value={config.bassScaleLength}
                    onChange={(e) => updateConfig({ bassScaleLength: parseFloat(e.target.value) || (isBass ? 34.0 : 25.5) })}
                    className="w-full bg-[#000000] border border-[#1c1c1f] text-white px-3 py-2 text-xs font-bold tracking-widest focus:outline-none focus:border-[#a39081] rounded-none"
                  />
                </div>
                {config.multiscaleEnabled && (
                  <div>
                    <span className="block text-[8px] font-bold tracking-[0.2em] text-[#5a554f] mb-1.5 uppercase">TREBLE-SIDE SCALE LENGTH</span>
                    <input
                      type="number"
                      step="0.1"
                      value={config.trebleScaleLength}
                      onChange={(e) => updateConfig({ trebleScaleLength: parseFloat(e.target.value) || (isBass ? 32.0 : 25.0) })}
                      className="w-full bg-[#000000] border border-[#1c1c1f] text-white px-3 py-2 text-xs font-bold tracking-widest focus:outline-none focus:border-[#a39081] rounded-none"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Number of Frets Selection */}
            {!config.isFretless && (
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="block text-[9px] font-bold tracking-[0.25em] text-[#5a554f] uppercase">NUMBER OF FRETS / SCALE SPAN</span>
                  <span className="text-[9.5px] text-[#a39081] font-bold uppercase tracking-widest">{config.numberOfFrets} FRETS</span>
                </div>
                <input
                  type="range"
                  min="12"
                  max="72"
                  value={config.numberOfFrets}
                  onChange={(e) => updateConfig({ numberOfFrets: parseInt(e.target.value) })}
                  className="w-full h-[1px] bg-[#1a1a1c] appearance-none cursor-pointer accent-[#a39081]"
                />
              </div>
            )}

            {/* Inlay Selection */}
            <div>
              <span className="block text-[9px] font-bold tracking-[0.25em] text-[#5a554f] mb-3 uppercase">INLAY MATRIX</span>
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
                        ? 'border-[#a39081]/60 bg-[#000000] text-[#a39081]'
                        : 'border-[#1c1c1f] bg-[#000000] text-[#5a554f] hover:border-[#333132] hover:text-[#e3e3e5]'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold tracking-wider uppercase">{style.label}</span>
                      {config.fretboardInlay === style.id && <Check className="w-3.5 h-3.5 text-[#a39081]" />}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Compound Radius Custom Text Boxes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-[#1c1c1f] pt-5 rounded-none">
              <div>
                <span className="block text-[9px] font-bold tracking-[0.25em] text-[#5a554f] mb-1.5 uppercase">NUT RADIUS PROFILE</span>
                <input
                  type="text"
                  value={config.radiusNut}
                  onChange={(e) => updateConfig({ radiusNut: e.target.value })}
                  placeholder={config.measurementSystem === 'metric' ? 'e.g. 241' : 'e.g. 9.5'}
                  className="w-full bg-[#000000] border border-[#1c1c1f] text-white px-3 py-2 text-xs font-bold tracking-widest focus:outline-none focus:border-[#a39081] rounded-none"
                />
              </div>
              <div>
                <span className="block text-[9px] font-bold tracking-[0.25em] text-[#5a554f] mb-1.5 uppercase">LAST FRET RADIUS PROFILE</span>
                <input
                  type="text"
                  value={config.radiusLastFret}
                  onChange={(e) => updateConfig({ radiusLastFret: e.target.value })}
                  placeholder={config.measurementSystem === 'metric' ? 'e.g. 406' : 'e.g. 16.0'}
                  className="w-full bg-[#000000] border border-[#1c1c1f] text-white px-3 py-2 text-xs font-bold tracking-widest focus:outline-none focus:border-[#a39081] rounded-none"
                />
              </div>
            </div>

            {/* Scalloping controls */}
            {!config.isFretless && (
              <div className="border-t border-[#1c1c1f] pt-5 space-y-4 rounded-none">
                <div className="flex justify-between items-center">
                  <span className="block text-[9px] font-bold tracking-[0.25em] text-[#5a554f] uppercase">SCALLOPING</span>
                  <div className="flex border border-[#1c1c1f] bg-[#000000] p-0.5 rounded-none">
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
                  <div className="flex items-center gap-3 bg-[#050506] p-3 border border-[#1c1c1f] rounded-none">
                    <span className="text-[9px] text-[#5a554f] font-bold uppercase tracking-wider">SCALLOP INTEGRATION START FRET</span>
                    <input
                      type="number"
                      min="1"
                      max={config.numberOfFrets - 1}
                      value={config.scallopedStartFret}
                      onChange={(e) => updateConfig({ scallopedStartFret: parseInt(e.target.value) || 12 })}
                      className="w-16 bg-[#000000] border border-[#1c1c1f] text-white px-2 py-1 text-[10px] font-bold tracking-widest text-center focus:outline-none focus:border-[#a39081] rounded-none"
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
              <div className="border-t border-[#1c1c1f] pt-6 space-y-4 rounded-none">
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
                  <div key={board.id} className="border border-[#1c1c1f] bg-[#050506] p-4 space-y-4 rounded-none relative">
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
                          className="w-full bg-[#000000] border border-[#1c1c1f] text-[#e3e3e5] text-[10px] uppercase font-bold tracking-widest px-2 py-1.5 focus:outline-none focus:border-[#a39081] rounded-none"
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
                          className="w-full bg-[#000000] border border-[#1c1c1f] text-[#e3e3e5] text-[10px] uppercase font-bold tracking-widest px-2 py-1.5 focus:outline-none focus:border-[#a39081] rounded-none"
                        >
                          <option value="none">STEALTH (NONE)</option>
                          <option value="dots">MICRO DOTS</option>
                          <option value="blocks">BRUTALIST BLOCKS</option>
                          <option value="custom">CUSTOM ARTWORK</option>
                        </select>
                      </div>

                      {/* EDO / Fretless */}
                      <div>
                        <span className="block text-[8px] font-bold tracking-[0.2em] text-[#5a554f] mb-1 uppercase">EDO TUNING MATRIX</span>
                        <select
                          value={board.isFretless ? 'fretless' : board.edoValue}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (val === 'fretless') {
                              updateExtraFretboard(board.id, { isFretless: true });
                            } else {
                              updateExtraFretboard(board.id, { isFretless: false, edoValue: parseInt(val) || 12 });
                            }
                          }}
                          className="w-full bg-[#000000] border border-[#1c1c1f] text-[#e3e3e5] text-[10px] uppercase font-bold tracking-widest px-2 py-1.5 focus:outline-none focus:border-[#a39081] rounded-none"
                        >
                          <option value="12">12-EDO (STANDARD)</option>
                          <option value="19">19-EDO</option>
                          <option value="31">31-EDO</option>
                          <option value="fretless">FRETLESS</option>
                        </select>
                      </div>

                      {/* Frets Count */}
                      {!board.isFretless && (
                        <div>
                          <span className="block text-[8px] font-bold tracking-[0.2em] text-[#5a554f] mb-1 uppercase">FRETS LENGTH</span>
                          <input
                            type="number"
                            min="12"
                            max="72"
                            value={board.numberOfFrets}
                            onChange={(e) => updateExtraFretboard(board.id, { numberOfFrets: parseInt(e.target.value) || 24 })}
                            className="w-full bg-[#000000] border border-[#1c1c1f] text-white text-[10px] font-bold tracking-widest px-2 py-1 focus:outline-none focus:border-[#a39081] rounded-none"
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

      {/* SECTION 3: BODY SILHOUETTE & ERGONOMICS */}
      <div className="border border-[#1c1c1f] bg-[#000000] rounded-none overflow-hidden">
        <button
          id="category-header-body"
          onClick={() => toggleCategory('body')}
          className="w-full flex items-center justify-between px-5 py-4 text-left font-bold text-[#e3e3e5] hover:bg-[#000000] transition-colors rounded-none font-sans"
        >
          <div className="flex items-center gap-3">
            <span className="text-[9px] text-[#a39081] tracking-[0.25em] font-bold font-sans">03 /</span>
            <span className="tracking-[0.2em] text-[10px] uppercase font-bold font-sans">BODY SILHOUETTE & ERGONOMICS</span>
          </div>
          {activeCategory === 'body' ? <ChevronUp className="w-4 h-4 text-[#a39081]" /> : <ChevronDown className="w-4 h-4 text-[#5a554f]" />}
        </button>

        {activeCategory === 'body' && (
          <div className="p-5 border-t border-[#1c1c1f] space-y-6">

            {/* Seated Posture */}
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
                        ? 'border-[#a39081]/60 bg-[#000000] text-[#a39081]'
                        : 'border-[#1c1c1f] bg-[#000000] text-[#5a554f] hover:border-[#333132] hover:text-[#e3e3e5]'
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

            {/* Neck Angle strict 0 to 60 bounds */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="block text-[9px] font-bold tracking-[0.25em] text-[#5a554f] uppercase">NECK ANGLE</span>
                <span className="text-[9.5px] text-[#a39081] font-bold uppercase tracking-widest">{config.neckAngle}° ANGLE</span>
              </div>
              <input
                type="range"
                min="0"
                max="60"
                value={config.neckAngle}
                onChange={(e) => updateConfig({ neckAngle: parseInt(e.target.value) })}
                className="w-full h-[1px] bg-[#1a1a1c] appearance-none cursor-pointer accent-[#a39081]"
              />
            </div>

            {/* Concise, non-cluttered Ergonomic Report card */}
            <div className="border border-[#1c1c1f] bg-[#050506] p-4 rounded-none space-y-2">
              <div className="flex items-center gap-2 text-[8px] tracking-[0.25em] text-[#a39081] font-black uppercase">
                <Sliders className="w-3.5 h-3.5" />
                <span>ERGONOMIC RECOMMENDATION</span>
              </div>
              <div className="flex items-center justify-between border-t border-[#1c1c1f] pt-3 rounded-none">
                <div className="flex flex-col">
                  <span className="text-sm font-black text-white tracking-widest uppercase">{recommendation.shape}</span>
                  <span className="text-[9px] text-[#5a554f] tracking-wider uppercase font-bold mt-1">
                    {recommendation.explanation}
                  </span>
                </div>
                <button
                  onClick={() => updateConfig({ bodyShape: recommendation.shapeId as any })}
                  className={`px-3 py-1.5 border border-[#a39081] text-[#a39081] hover:bg-[#a39081] hover:text-black text-[9px] tracking-widest font-bold uppercase transition-all rounded-none ${
                    config.bodyShape === recommendation.shapeId ? 'opacity-40 pointer-events-none' : ''
                  }`}
                >
                  {config.bodyShape === recommendation.shapeId ? 'APPLIED' : 'APPLY'}
                </button>
              </div>
            </div>

            {/* Manual shape selection */}
            <div className="border-t border-[#1c1c1f] pt-5">
              <span className="block text-[9px] font-bold tracking-[0.25em] text-[#5a554f] mb-3 uppercase">MANUAL OVERRIDE SHAPE</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {Object.values(BODY_SHAPES).map((shape) => (
                  <button
                    key={shape.id}
                    onClick={() => updateConfig({ bodyShape: shape.id as any })}
                    className={`relative p-3.5 text-left rounded-none border transition-all duration-200 font-sans ${
                      config.bodyShape === shape.id
                        ? 'border-[#a39081]/60 bg-[#000000] text-[#a39081]'
                        : 'border-[#1c1c1f] bg-[#000000] text-[#5a554f] hover:border-[#333132] hover:text-[#e3e3e5]'
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
                        ? 'border-[#a39081]/60 bg-[#000000] text-[#a39081]'
                        : 'border-[#1c1c1f] bg-[#000000] text-[#5a554f] hover:border-[#333132] hover:text-[#e3e3e5]'
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
      <div className="border border-[#1c1c1f] bg-[#000000] rounded-none overflow-hidden">
        <button
          id="category-header-finish"
          onClick={() => toggleCategory('finish')}
          className="w-full flex items-center justify-between px-5 py-4 text-left font-bold text-[#e3e3e5] hover:bg-[#000000] transition-colors rounded-none font-sans"
        >
          <div className="flex items-center gap-3">
            <span className="text-[9px] text-[#a39081] tracking-[0.25em] font-bold font-sans">04 /</span>
            <span className="tracking-[0.2em] text-[10px] uppercase font-bold font-sans">COATINGS & LACQUER</span>
          </div>
          {activeCategory === 'finish' ? <ChevronUp className="w-4 h-4 text-[#a39081]" /> : <ChevronDown className="w-4 h-4 text-[#5a554f]" />}
        </button>

        {activeCategory === 'finish' && (
          <div className="p-5 border-t border-[#1c1c1f]">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {FINISH_PRESETS.map((finish) => (
                <button
                  key={finish.id}
                  onClick={() => updateConfig({ finishPreset: finish.id })}
                  className={`relative p-3 text-left rounded-none border transition-all duration-200 font-sans ${
                    config.finishPreset === finish.id
                      ? 'border-[#a39081]/60 bg-[#000000] text-[#a39081]'
                      : 'border-[#1c1c1f] bg-[#000000] text-[#5a554f] hover:border-[#333132] hover:text-[#e3e3e5]'
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
      <div className="border border-[#1c1c1f] bg-[#000000] rounded-none overflow-hidden">
        <button
          id="category-header-hardware"
          onClick={() => toggleCategory('hardware')}
          className="w-full flex items-center justify-between px-5 py-4 text-left font-bold text-[#e3e3e5] hover:bg-[#000000] transition-colors rounded-none font-sans"
        >
          <div className="flex items-center gap-3">
            <span className="text-[9px] text-[#a39081] tracking-[0.25em] font-bold font-sans">05 /</span>
            <span className="tracking-[0.2em] text-[10px] uppercase font-bold font-sans">PLATINGS, ANCHORAGES & NUT</span>
          </div>
          {activeCategory === 'hardware' ? <ChevronUp className="w-4 h-4 text-[#a39081]" /> : <ChevronDown className="w-4 h-4 text-[#5a554f]" />}
        </button>

        {activeCategory === 'hardware' && (
          <div className="p-5 border-t border-[#1c1c1f] space-y-6">

            {/* Metallic Plating */}
            <div>
              <span className="block text-[9px] font-bold tracking-[0.25em] text-[#5a554f] mb-3 uppercase">METALLIC ANODIZED COLOR</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {Object.values(HARDWARE_COLORS).map((color) => (
                  <button
                    key={color.id}
                    onClick={() => updateConfig({ hardwareColor: color.id as any })}
                    className={`relative p-3.5 text-left rounded-none border transition-all duration-200 font-sans ${
                      config.hardwareColor === color.id
                        ? 'border-[#a39081]/60 bg-[#000000] text-[#a39081]'
                        : 'border-[#1c1c1f] bg-[#000000] text-[#5a554f] hover:border-[#333132] hover:text-[#e3e3e5]'
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
              <span className="block text-[9px] font-bold tracking-[0.25em] text-[#5a554f] mb-3 uppercase">BRIDGE</span>
              <select
                value={config.bridgeType}
                onChange={(e) => updateConfig({ bridgeType: e.target.value })}
                className="w-full bg-[#000000] border border-[#1c1c1f] text-white text-[11px] font-bold tracking-widest px-3 py-2.5 uppercase focus:outline-none focus:border-[#a39081] rounded-none"
              >
                <option value="fixed_hardtail">SOLID BASALT-COUPLING FIXED HARDTAIL (STANDARD)</option>
                <option value="thru_body">HIGH-TENSION STRING THRU BODY RECESSED RAILS</option>
                <option value="floating_trem">E-Z ZERO COLD-STEEL FLOATING TREMOLO SYSTEM</option>
              </select>
            </div>

            {/* Tuners Selection */}
            <div>
              <span className="block text-[9px] font-bold tracking-[0.25em] text-[#5a554f] mb-3 uppercase">TUNERS</span>
              <select
                value={config.tunerType}
                onChange={(e) => updateConfig({ tunerType: e.target.value })}
                className="w-full bg-[#000000] border border-[#1c1c1f] text-white text-[11px] font-bold tracking-widest px-3 py-2.5 uppercase focus:outline-none focus:border-[#a39081] rounded-none"
              >
                <option value="locking_standard">1:21 LVI INDUSTRIAL BACK-LOCKING TUNERS</option>
                <option value="headless_knurled">COAXIAL REAR BRUTALIST HEADLESS CYLINDERS</option>
                <option value="traditional_closed">HERITAGE FINELY CALIBRATED CLOSED GEARS</option>
              </select>
            </div>

            {/* Knobs Selection */}
            <div>
              <span className="block text-[9px] font-bold tracking-[0.25em] text-[#5a554f] mb-3 uppercase">KNOB TYPE</span>
              <select
                value={config.knobType}
                onChange={(e) => updateConfig({ knobType: e.target.value })}
                className="w-full bg-[#000000] border border-[#1c1c1f] text-white text-[11px] font-bold tracking-widest px-3 py-2.5 uppercase focus:outline-none focus:border-[#a39081] rounded-none"
              >
                <option value="knurled_dome">KNURLED INDUSTRIAL COAL-BLACK SOLID DOME</option>
                <option value="skirted_brutalist">FLAT SKIRTED BRUTALIST MILLED BASALT CONE</option>
                <option value="stealth_recessed">STEALTH RECESSED FLAT HEAD DIAL INDICATORS</option>
              </select>
            </div>

            {/* Nut Selection */}
            <div>
              <span className="block text-[9px] font-bold tracking-[0.25em] text-[#5a554f] mb-3 uppercase">NUT</span>
              <select
                value={config.nutType}
                onChange={(e) => updateConfig({ nutType: e.target.value })}
                className="w-full bg-[#000000] border border-[#1c1c1f] text-white text-[11px] font-bold tracking-widest px-3 py-2.5 uppercase focus:outline-none focus:border-[#a39081] rounded-none"
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
                        ? 'border-[#a39081]/60 bg-[#000000] text-[#a39081]'
                        : 'border-[#1c1c1f] bg-[#000000] text-[#5a554f] hover:border-[#333132] hover:text-[#e3e3e5]'
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
      <div className="border border-[#1c1c1f] bg-[#000000] rounded-none overflow-hidden">
        <button
          id="category-header-electronics"
          onClick={() => toggleCategory('electronics')}
          className="w-full flex items-center justify-between px-5 py-4 text-left font-bold text-[#e3e3e5] hover:bg-[#000000] transition-colors rounded-none font-sans"
        >
          <div className="flex items-center gap-3">
            <span className="text-[9px] text-[#a39081] tracking-[0.25em] font-bold font-sans">06 /</span>
            <span className="tracking-[0.2em] text-[10px] uppercase font-bold font-sans">ELECTRONICS</span>
          </div>
          {activeCategory === 'electronics' ? <ChevronUp className="w-4 h-4 text-[#a39081]" /> : <ChevronDown className="w-4 h-4 text-[#5a554f]" />}
        </button>

        {activeCategory === 'electronics' && (
          <div className="p-5 border-t border-[#1c1c1f] space-y-6">

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
                        ? 'border-[#a39081]/60 bg-[#000000] text-[#a39081]'
                        : 'border-[#1c1c1f] bg-[#000000] text-[#5a554f] hover:border-[#333132] hover:text-[#e3e3e5]'
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
            <div className="flex items-center justify-between border-t border-[#1c1c1f] pt-5 rounded-none">
              <div className="flex flex-col">
                <span className="text-[10px] text-[#e3e3e5] tracking-wider uppercase font-bold">LVI 18V LOW-IMPEDANCE ACTIVE PREAMPLIFIER</span>
                <span className="text-[9px] text-[#5a554f] tracking-wider uppercase font-bold mt-1">High-fidelity clean gain & onboard active EQ (+$95)</span>
              </div>
              <div className="flex border border-[#1c1c1f] bg-[#000000] p-0.5 rounded-none">
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
                className="w-full bg-[#000000] border border-[#1c1c1f] text-white text-[11px] font-bold tracking-widest px-3 py-2.5 uppercase focus:outline-none focus:border-[#a39081] rounded-none"
              >
                <option value="orange_drop_022">SPRAGUE ORANGE DROP .022UF (CREAMY TREBLE ROLLOFF)</option>
                <option value="bumblebee_paper">LVI BUMBLEBEE PAPER-IN-OIL .047UF (VINTAGE WARM RESISTANCE)</option>
                <option value="silver_mica">SOVIET MILITARY SILVER MICA .01UF (GLASSY MODERN HIGHS)</option>
              </select>
            </div>

          </div>
        )}
      </div>

    </div>
  );
};
