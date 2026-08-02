import React, { useState, useEffect } from 'react';
import { useGuitarStore } from '../store/guitarStore';
import { BODY_SHAPES, BODY_WOODS, NECK_WOODS, FRETBOARD_WOODS, PICKUPS_LAYOUTS, HARDWARE_COLORS, PICKGUARD_STYLES, FINISH_PRESETS } from '../constants/catalog';
import { ChevronDown, ChevronUp, Check, Info } from 'lucide-react';

// Organized custom panel rendering catalog option tiles in neat, reachable layouts

export const OptionsControlPanel: React.FC = () => {
  const { config, updateConfig } = useGuitarStore();
  const [activeCategory, setActiveCategory] = useState<string>('body');

  const toggleCategory = (cat: string) => {
    setActiveCategory(activeCategory === cat ? '' : cat);
  };

  // Helper to ensure scroll sync works nicely on mobile
  useEffect(() => {
    if (activeCategory) {
      const el = document.getElementById(`category-header-${activeCategory}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }, [activeCategory]);

  return (
    <div className="space-y-4 pb-12">

      {/* SECTION 1: BODY DESIGN */}
      <div className="border border-neutral-800/40 bg-neutral-900/30 backdrop-blur-md rounded-2xl overflow-hidden transition-all duration-300">
        <button
          id="category-header-body"
          onClick={() => toggleCategory('body')}
          className="w-full flex items-center justify-between px-5 py-4 text-left font-semibold text-neutral-200 hover:bg-neutral-800/20 transition-all"
        >
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-neutral-500 tracking-wider">01</span>
            <span>BODY PROFILE & SHAPE</span>
          </div>
          {activeCategory === 'body' ? <ChevronUp className="w-4 h-4 text-neutral-400" /> : <ChevronDown className="w-4 h-4 text-neutral-400" />}
        </button>

        {activeCategory === 'body' && (
          <div className="p-5 border-t border-neutral-800/30 space-y-6">
            {/* Body Shapes */}
            <div>
              <span className="block text-xs font-mono font-bold tracking-widest text-neutral-500 mb-3">BODY SILHOUETTE</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {Object.values(BODY_SHAPES).map((shape) => (
                  <button
                    key={shape.id}
                    onClick={() => updateConfig({ bodyShape: shape.id as any })}
                    className={`relative p-3.5 text-left rounded-xl border transition-all duration-200 ${
                      config.bodyShape === shape.id
                        ? 'border-neutral-200 bg-neutral-100 text-neutral-950 shadow-md scale-[1.02]'
                        : 'border-neutral-800/60 bg-neutral-900/40 text-neutral-400 hover:border-neutral-700 hover:text-neutral-200'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1.5">
                      <span className="text-xs font-bold tracking-wide">{shape.name.split(' (')[0]}</span>
                      {config.bodyShape === shape.id && <Check className="w-3.5 h-3.5" />}
                    </div>
                    <span className="block text-[10px] font-mono tracking-wide opacity-80">
                      {shape.priceDelta === 0 ? 'Standard' : `+$${shape.priceDelta}`}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Body Woods */}
            <div>
              <span className="block text-xs font-mono font-bold tracking-widest text-neutral-500 mb-3">BODY CORE WOOD</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {Object.values(BODY_WOODS).map((wood) => (
                  <button
                    key={wood.id}
                    onClick={() => updateConfig({ bodyWood: wood.id as any })}
                    className={`relative p-3.5 text-left rounded-xl border transition-all duration-200 ${
                      config.bodyWood === wood.id
                        ? 'border-neutral-200 bg-neutral-100 text-neutral-950 shadow-md scale-[1.02]'
                        : 'border-neutral-800/60 bg-neutral-900/40 text-neutral-400 hover:border-neutral-700 hover:text-neutral-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <span
                          className="w-3 h-3 rounded-full border border-black/10 shadow-sm"
                          style={{ backgroundColor: wood.color }}
                        />
                        <span className="text-xs font-bold tracking-wide">{wood.name}</span>
                      </div>
                      {config.bodyWood === wood.id && <Check className="w-3.5 h-3.5" />}
                    </div>
                    <span className="block text-[10px] font-mono tracking-wide opacity-80">
                      {wood.priceDelta === 0 ? 'Standard' : `+$${wood.priceDelta}`}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* SECTION 2: THE LACQUER & FINISHES */}
      <div className="border border-neutral-800/40 bg-neutral-900/30 backdrop-blur-md rounded-2xl overflow-hidden transition-all duration-300">
        <button
          id="category-header-finish"
          onClick={() => toggleCategory('finish')}
          className="w-full flex items-center justify-between px-5 py-4 text-left font-semibold text-neutral-200 hover:bg-neutral-800/20 transition-all"
        >
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-neutral-500 tracking-wider">02</span>
            <span>CUSTOM LACQUER & FINISHES</span>
          </div>
          {activeCategory === 'finish' ? <ChevronUp className="w-4 h-4 text-neutral-400" /> : <ChevronDown className="w-4 h-4 text-neutral-400" />}
        </button>

        {activeCategory === 'finish' && (
          <div className="p-5 border-t border-neutral-800/30">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {FINISH_PRESETS.map((finish) => (
                <button
                  key={finish.id}
                  onClick={() => updateConfig({ finishPreset: finish.id })}
                  className={`relative p-3 text-left rounded-xl border transition-all duration-200 ${
                    config.finishPreset === finish.id
                      ? 'border-neutral-200 bg-neutral-100 text-neutral-950 shadow-md scale-[1.02]'
                      : 'border-neutral-800/60 bg-neutral-900/40 text-neutral-400 hover:border-neutral-700 hover:text-neutral-200'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    {/* Circle Swatch */}
                    <div
                      className="w-4 h-4 rounded-full border border-black/20 shadow-inner shrink-0"
                      style={{
                        background: finish.colorSecondary
                          ? `linear-gradient(135deg, ${finish.color} 0%, ${finish.colorSecondary} 100%)`
                          : finish.color,
                      }}
                    />
                    <span className="text-xs font-bold leading-tight truncate">{finish.name}</span>
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-[9px] font-mono uppercase tracking-wide opacity-60">
                      {finish.type}
                    </span>
                    <span className="text-[10px] font-mono font-bold">
                      {finish.priceDelta === 0 ? 'Standard' : `+$${finish.priceDelta}`}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* SECTION 3: NECK & PLAYABILITY */}
      <div className="border border-neutral-800/40 bg-neutral-900/30 backdrop-blur-md rounded-2xl overflow-hidden transition-all duration-300">
        <button
          id="category-header-neck"
          onClick={() => toggleCategory('neck')}
          className="w-full flex items-center justify-between px-5 py-4 text-left font-semibold text-neutral-200 hover:bg-neutral-800/20 transition-all"
        >
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-neutral-500 tracking-wider">03</span>
            <span>NECK & FRETBOARD PLAYABILITY</span>
          </div>
          {activeCategory === 'neck' ? <ChevronUp className="w-4 h-4 text-neutral-400" /> : <ChevronDown className="w-4 h-4 text-neutral-400" />}
        </button>

        {activeCategory === 'neck' && (
          <div className="p-5 border-t border-neutral-800/30 space-y-6">
            {/* Neck Wood */}
            <div>
              <span className="block text-xs font-mono font-bold tracking-widest text-neutral-500 mb-3">NECK SHAFT WOOD</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {Object.values(NECK_WOODS).map((wood) => (
                  <button
                    key={wood.id}
                    onClick={() => updateConfig({ neckWood: wood.id as any })}
                    className={`relative p-3.5 text-left rounded-xl border transition-all duration-200 ${
                      config.neckWood === wood.id
                        ? 'border-neutral-200 bg-neutral-100 text-neutral-950 shadow-md scale-[1.02]'
                        : 'border-neutral-800/60 bg-neutral-900/40 text-neutral-400 hover:border-neutral-700 hover:text-neutral-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <span
                          className="w-3 h-3 rounded-full border border-black/10"
                          style={{ backgroundColor: wood.color }}
                        />
                        <span className="text-xs font-bold tracking-wide">{wood.name}</span>
                      </div>
                      {config.neckWood === wood.id && <Check className="w-3.5 h-3.5" />}
                    </div>
                    <span className="block text-[10px] font-mono tracking-wide opacity-80">
                      {wood.priceDelta === 0 ? 'Standard' : `+$${wood.priceDelta}`}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Fretboard Wood */}
            <div>
              <span className="block text-xs font-mono font-bold tracking-widest text-neutral-500 mb-3">FRETBOARD WOOD</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {Object.values(FRETBOARD_WOODS).map((wood) => (
                  <button
                    key={wood.id}
                    onClick={() => updateConfig({ fretboardWood: wood.id as any })}
                    className={`relative p-3.5 text-left rounded-xl border transition-all duration-200 ${
                      config.fretboardWood === wood.id
                        ? 'border-neutral-200 bg-neutral-100 text-neutral-950 shadow-md scale-[1.02]'
                        : 'border-neutral-800/60 bg-neutral-900/40 text-neutral-400 hover:border-neutral-700 hover:text-neutral-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <span
                          className="w-3 h-3 rounded-full border border-black/10"
                          style={{ backgroundColor: wood.color }}
                        />
                        <span className="text-xs font-bold tracking-wide">{wood.name}</span>
                      </div>
                      {config.fretboardWood === wood.id && <Check className="w-3.5 h-3.5" />}
                    </div>
                    <span className="block text-[10px] font-mono tracking-wide opacity-80">
                      {wood.priceDelta === 0 ? 'Standard' : `+$${wood.priceDelta}`}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* SECTION 4: PICKUPS & CONTROLS */}
      <div className="border border-neutral-800/40 bg-neutral-900/30 backdrop-blur-md rounded-2xl overflow-hidden transition-all duration-300">
        <button
          id="category-header-pickups"
          onClick={() => toggleCategory('pickups')}
          className="w-full flex items-center justify-between px-5 py-4 text-left font-semibold text-neutral-200 hover:bg-neutral-800/20 transition-all"
        >
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-neutral-500 tracking-wider">04</span>
            <span>ELECTRONICS & PICKUPS</span>
          </div>
          {activeCategory === 'pickups' ? <ChevronUp className="w-4 h-4 text-neutral-400" /> : <ChevronDown className="w-4 h-4 text-neutral-400" />}
        </button>

        {activeCategory === 'pickups' && (
          <div className="p-5 border-t border-neutral-800/30">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {Object.values(PICKUPS_LAYOUTS).map((layout) => (
                <button
                  key={layout.id}
                  onClick={() => updateConfig({ pickupsLayout: layout.id as any })}
                  className={`relative p-3.5 text-left rounded-xl border transition-all duration-200 ${
                    config.pickupsLayout === layout.id
                      ? 'border-neutral-200 bg-neutral-100 text-neutral-950 shadow-md scale-[1.02]'
                      : 'border-neutral-800/60 bg-neutral-900/40 text-neutral-400 hover:border-neutral-700 hover:text-neutral-200'
                  }`}
                >
                  <div className="flex justify-between items-start mb-1.5">
                    <span className="text-xs font-bold tracking-wide">{layout.name.split(' (')[0]}</span>
                    {config.pickupsLayout === layout.id && <Check className="w-3.5 h-3.5" />}
                  </div>
                  <span className="block text-[10px] font-mono tracking-wide opacity-80 mb-1">
                    {layout.priceDelta === 0 ? 'Standard' : `+$${layout.priceDelta}`}
                  </span>
                  <p className="text-[10px] opacity-60 line-clamp-2 leading-relaxed">
                    {layout.description}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* SECTION 5: HARDWARE & ACCESSORIES */}
      <div className="border border-neutral-800/40 bg-neutral-900/30 backdrop-blur-md rounded-2xl overflow-hidden transition-all duration-300">
        <button
          id="category-header-hardware"
          onClick={() => toggleCategory('hardware')}
          className="w-full flex items-center justify-between px-5 py-4 text-left font-semibold text-neutral-200 hover:bg-neutral-800/20 transition-all"
        >
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-neutral-500 tracking-wider">05</span>
            <span>HARDWARE & PICKGUARD</span>
          </div>
          {activeCategory === 'hardware' ? <ChevronUp className="w-4 h-4 text-neutral-400" /> : <ChevronDown className="w-4 h-4 text-neutral-400" />}
        </button>

        {activeCategory === 'hardware' && (
          <div className="p-5 border-t border-neutral-800/30 space-y-6">
            {/* Hardware color */}
            <div>
              <span className="block text-xs font-mono font-bold tracking-widest text-neutral-500 mb-3">HARDWARE PLATING</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {Object.values(HARDWARE_COLORS).map((color) => (
                  <button
                    key={color.id}
                    onClick={() => updateConfig({ hardwareColor: color.id as any })}
                    className={`relative p-3.5 text-left rounded-xl border transition-all duration-200 ${
                      config.hardwareColor === color.id
                        ? 'border-neutral-200 bg-neutral-100 text-neutral-950 shadow-md scale-[1.02]'
                        : 'border-neutral-800/60 bg-neutral-900/40 text-neutral-400 hover:border-neutral-700 hover:text-neutral-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-neutral-800/60 shadow-inner"
                          style={{ backgroundColor: color.hex }}
                        />
                        <span className="text-xs font-bold tracking-wide">{color.name.split(' (')[0].replace(' Finish', '').replace(' Plated', '')}</span>
                      </div>
                      {config.hardwareColor === color.id && <Check className="w-3.5 h-3.5" />}
                    </div>
                    <span className="block text-[10px] font-mono tracking-wide opacity-80">
                      {color.priceDelta === 0 ? 'Standard' : `+$${color.priceDelta}`}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Pickguards */}
            <div>
              <div className="flex items-center gap-1 mb-3">
                <span className="block text-xs font-mono font-bold tracking-widest text-neutral-500">PICKGUARD STYLE</span>
                <div className="group/info relative cursor-pointer">
                  <Info className="w-3.5 h-3.5 text-neutral-600 hover:text-neutral-400 transition-colors" />
                  <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-48 hidden group-hover/info:block bg-neutral-950 border border-neutral-800 text-[10px] text-neutral-400 p-2 rounded-lg shadow-xl z-30">
                    Choosing "No Pickguard" exposes the premium wood core and finishes.
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {Object.values(PICKGUARD_STYLES).map((style) => (
                  <button
                    key={style.id}
                    onClick={() => updateConfig({ pickguardStyle: style.id as any })}
                    className={`relative p-3 text-left rounded-xl border transition-all duration-200 ${
                      config.pickguardStyle === style.id
                        ? 'border-neutral-200 bg-neutral-100 text-neutral-950 shadow-md scale-[1.02]'
                        : 'border-neutral-800/60 bg-neutral-900/40 text-neutral-400 hover:border-neutral-700 hover:text-neutral-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5">
                        {style.color && (
                          <span
                            className="w-3 h-3 rounded-sm border border-black/10 shadow-inner"
                            style={{ backgroundColor: style.color }}
                          />
                        )}
                        <span className="text-xs font-bold tracking-wide">{style.name.replace(' (Bare Top)', '')}</span>
                      </div>
                      {config.pickguardStyle === style.id && <Check className="w-3.5 h-3.5" />}
                    </div>
                    <p className="text-[10px] opacity-65 leading-snug truncate">{style.description}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};
