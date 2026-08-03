import React, { useState, useEffect } from 'react';
import { useGuitarStore } from '../store/guitarStore';
import { BODY_SHAPES, BODY_WOODS, NECK_WOODS, FRETBOARD_WOODS, PICKUPS_LAYOUTS, HARDWARE_COLORS, PICKGUARD_STYLES, FINISH_PRESETS } from '../constants/catalog';
import { ChevronDown, ChevronUp, Check, Info } from 'lucide-react';

export const OptionsControlPanel: React.FC = () => {
  const { config, updateConfig } = useGuitarStore();
  const [activeCategory, setActiveCategory] = useState<string>('body');

  const toggleCategory = (cat: string) => {
    setActiveCategory(activeCategory === cat ? '' : cat);
  };

  const isBass = config.instrumentType === 'bass';

  useEffect(() => {
    if (activeCategory) {
      const el = document.getElementById(`category-header-${activeCategory}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }, [activeCategory]);

  return (
    <div className="space-y-4">

      {/* SECTION 1: BODY DESIGN */}
      <div className="border border-neutral-900 bg-black rounded-none overflow-hidden">
        <button
          id="category-header-body"
          onClick={() => toggleCategory('body')}
          className="w-full flex items-center justify-between px-5 py-4 text-left font-serif font-bold text-neutral-200 hover:bg-neutral-900/40 transition-colors rounded-none"
        >
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-mono text-amber-600/80 tracking-widest">01 /</span>
            <span className="tracking-widest text-xs uppercase">BODY ARCHITECTURE</span>
          </div>
          {activeCategory === 'body' ? <ChevronUp className="w-4 h-4 text-amber-600" /> : <ChevronDown className="w-4 h-4 text-neutral-700" />}
        </button>

        {activeCategory === 'body' && (
          <div className="p-5 border-t border-neutral-900 space-y-6">
            {/* Body Shapes */}
            <div>
              <span className="block text-[10px] font-mono font-bold tracking-widest text-neutral-600 mb-3">BODY SILHOUETTE</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {Object.values(BODY_SHAPES).map((shape) => (
                  <button
                    key={shape.id}
                    onClick={() => updateConfig({ bodyShape: shape.id as any })}
                    className={`relative p-3.5 text-left rounded-none border transition-all duration-200 ${
                      config.bodyShape === shape.id
                        ? 'border-amber-600/50 bg-[#070708] text-amber-600'
                        : 'border-neutral-900 bg-[#000000] text-neutral-500 hover:border-neutral-800 hover:text-neutral-300'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1.5">
                      <span className="text-xs font-bold tracking-wide">{shape.name.split(' (')[0]}</span>
                      {config.bodyShape === shape.id && <Check className="w-3.5 h-3.5 text-amber-600" />}
                    </div>
                    <span className="block text-[9px] font-mono tracking-wide opacity-80">
                      {shape.priceDelta === 0 ? 'STANDARD' : `+$${shape.priceDelta}`}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Body Woods */}
            <div>
              <span className="block text-[10px] font-mono font-bold tracking-widest text-neutral-600 mb-3">BODY CORE WOOD</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {Object.values(BODY_WOODS).map((wood) => (
                  <button
                    key={wood.id}
                    onClick={() => updateConfig({ bodyWood: wood.id as any })}
                    className={`relative p-3.5 text-left rounded-none border transition-all duration-200 ${
                      config.bodyWood === wood.id
                        ? 'border-amber-600/50 bg-[#070708] text-amber-600'
                        : 'border-neutral-900 bg-[#000000] text-neutral-500 hover:border-neutral-800 hover:text-neutral-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <span
                          className="w-2.5 h-2.5 rounded-none border border-black/10 shadow-sm"
                          style={{ backgroundColor: wood.color }}
                        />
                        <span className="text-xs font-bold tracking-wide">{wood.name}</span>
                      </div>
                      {config.bodyWood === wood.id && <Check className="w-3.5 h-3.5 text-amber-600" />}
                    </div>
                    <span className="block text-[9px] font-mono tracking-wide opacity-80">
                      {wood.priceDelta === 0 ? 'STANDARD' : `+$${wood.priceDelta}`}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* SECTION 2: THE LACQUER & FINISHES */}
      <div className="border border-neutral-900 bg-black rounded-none overflow-hidden">
        <button
          id="category-header-finish"
          onClick={() => toggleCategory('finish')}
          className="w-full flex items-center justify-between px-5 py-4 text-left font-serif font-bold text-neutral-200 hover:bg-neutral-900/40 transition-colors rounded-none"
        >
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-mono text-amber-600/80 tracking-widest">02 /</span>
            <span className="tracking-widest text-xs uppercase">LACQUER & COATINGS</span>
          </div>
          {activeCategory === 'finish' ? <ChevronUp className="w-4 h-4 text-amber-600" /> : <ChevronDown className="w-4 h-4 text-neutral-700" />}
        </button>

        {activeCategory === 'finish' && (
          <div className="p-5 border-t border-neutral-900">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {FINISH_PRESETS.map((finish) => (
                <button
                  key={finish.id}
                  onClick={() => updateConfig({ finishPreset: finish.id })}
                  className={`relative p-3 text-left rounded-none border transition-all duration-200 ${
                    config.finishPreset === finish.id
                      ? 'border-amber-600/50 bg-[#070708] text-amber-600'
                      : 'border-neutral-900 bg-[#000000] text-neutral-500 hover:border-neutral-800 hover:text-neutral-300'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className="w-3 h-3 rounded-none border border-black/20 shrink-0"
                      style={{
                        background: finish.colorSecondary
                          ? `linear-gradient(135deg, ${finish.color} 0%, ${finish.colorSecondary} 100%)`
                          : finish.color,
                      }}
                    />
                    <span className="text-xs font-bold leading-tight truncate">{finish.name}</span>
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-[9px] font-mono uppercase tracking-wide opacity-40">
                      {finish.type}
                    </span>
                    <span className="text-[9px] font-mono font-bold">
                      {finish.priceDelta === 0 ? 'STANDARD' : `+$${finish.priceDelta}`}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* SECTION 3: NECK & PLAYABILITY */}
      <div className="border border-neutral-900 bg-black rounded-none overflow-hidden">
        <button
          id="category-header-neck"
          onClick={() => toggleCategory('neck')}
          className="w-full flex items-center justify-between px-5 py-4 text-left font-serif font-bold text-neutral-200 hover:bg-neutral-900/40 transition-colors rounded-none"
        >
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-mono text-amber-600/80 tracking-widest">03 /</span>
            <span className="tracking-widest text-xs uppercase">NECK & FRETS</span>
          </div>
          {activeCategory === 'neck' ? <ChevronUp className="w-4 h-4 text-amber-600" /> : <ChevronDown className="w-4 h-4 text-neutral-700" />}
        </button>

        {activeCategory === 'neck' && (
          <div className="p-5 border-t border-neutral-900 space-y-6">
            {/* Neck Wood */}
            <div>
              <span className="block text-[10px] font-mono font-bold tracking-widest text-neutral-600 mb-3">NECK SHAFT WOOD</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {Object.values(NECK_WOODS).map((wood) => (
                  <button
                    key={wood.id}
                    onClick={() => updateConfig({ neckWood: wood.id as any })}
                    className={`relative p-3.5 text-left rounded-none border transition-all duration-200 ${
                      config.neckWood === wood.id
                        ? 'border-amber-600/50 bg-[#070708] text-amber-600'
                        : 'border-neutral-900 bg-[#000000] text-neutral-500 hover:border-neutral-800 hover:text-neutral-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <span
                          className="w-2.5 h-2.5 rounded-none border border-black/10"
                          style={{ backgroundColor: wood.color }}
                        />
                        <span className="text-xs font-bold tracking-wide">{wood.name}</span>
                      </div>
                      {config.neckWood === wood.id && <Check className="w-3.5 h-3.5 text-amber-600" />}
                    </div>
                    <span className="block text-[9px] font-mono tracking-wide opacity-80">
                      {wood.priceDelta === 0 ? 'STANDARD' : `+$${wood.priceDelta}`}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Fretboard Wood */}
            <div>
              <span className="block text-[10px] font-mono font-bold tracking-widest text-neutral-600 mb-3">FRETBOARD WOOD</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {Object.values(FRETBOARD_WOODS).map((wood) => (
                  <button
                    key={wood.id}
                    onClick={() => updateConfig({ fretboardWood: wood.id as any })}
                    className={`relative p-3.5 text-left rounded-none border transition-all duration-200 ${
                      config.fretboardWood === wood.id
                        ? 'border-amber-600/50 bg-[#070708] text-amber-600'
                        : 'border-neutral-900 bg-[#000000] text-neutral-500 hover:border-neutral-800 hover:text-neutral-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <span
                          className="w-2.5 h-2.5 rounded-none border border-black/10"
                          style={{ backgroundColor: wood.color }}
                        />
                        <span className="text-xs font-bold tracking-wide">{wood.name}</span>
                      </div>
                      {config.fretboardWood === wood.id && <Check className="w-3.5 h-3.5 text-amber-600" />}
                    </div>
                    <span className="block text-[9px] font-mono tracking-wide opacity-80">
                      {wood.priceDelta === 0 ? 'STANDARD' : `+$${wood.priceDelta}`}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* SECTION 4: PICKUPS & CONTROLS */}
      <div className="border border-neutral-900 bg-black rounded-none overflow-hidden">
        <button
          id="category-header-pickups"
          onClick={() => toggleCategory('pickups')}
          className="w-full flex items-center justify-between px-5 py-4 text-left font-serif font-bold text-neutral-200 hover:bg-neutral-900/40 transition-colors rounded-none"
        >
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-mono text-amber-600/80 tracking-widest">04 /</span>
            <span className="tracking-widest text-xs uppercase">ELECTRONICS & TRANSDUCERS</span>
          </div>
          {activeCategory === 'pickups' ? <ChevronUp className="w-4 h-4 text-amber-600" /> : <ChevronDown className="w-4 h-4 text-neutral-700" />}
        </button>

        {activeCategory === 'pickups' && (
          <div className="p-5 border-t border-neutral-900">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {Object.values(PICKUPS_LAYOUTS).map((layout) => (
                <button
                  key={layout.id}
                  onClick={() => updateConfig({ pickupsLayout: layout.id as any })}
                  className={`relative p-3.5 text-left rounded-none border transition-all duration-200 ${
                    config.pickupsLayout === layout.id
                      ? 'border-amber-600/50 bg-[#070708] text-amber-600'
                      : 'border-neutral-900 bg-[#000000] text-neutral-500 hover:border-neutral-800 hover:text-neutral-300'
                  }`}
                >
                  <div className="flex justify-between items-start mb-1.5">
                    <span className="text-xs font-bold tracking-wide">{isBass ? layout.name.replace('Humbucker', 'Bass Coil').replace('Single', 'Soapbar').split(' (')[0] : layout.name.split(' (')[0]}</span>
                    {config.pickupsLayout === layout.id && <Check className="w-3.5 h-3.5 text-amber-600" />}
                  </div>
                  <span className="block text-[9px] font-mono tracking-wide opacity-80 mb-1">
                    {layout.priceDelta === 0 ? 'STANDARD' : `+$${layout.priceDelta}`}
                  </span>
                  <p className="text-[10px] opacity-40 line-clamp-2 leading-relaxed">
                    {isBass ? (layout.description || '').replace('humbucker', 'bass humbucker').replace('single-coils', 'soapbars') : layout.description}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* SECTION 5: HARDWARE & ACCESSORIES */}
      <div className="border border-neutral-900 bg-black rounded-none overflow-hidden">
        <button
          id="category-header-hardware"
          onClick={() => toggleCategory('hardware')}
          className="w-full flex items-center justify-between px-5 py-4 text-left font-serif font-bold text-neutral-200 hover:bg-neutral-900/40 transition-colors rounded-none"
        >
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-mono text-amber-600/80 tracking-widest">05 /</span>
            <span className="tracking-widest text-xs uppercase">PLATINGS & ACCENTUATION</span>
          </div>
          {activeCategory === 'hardware' ? <ChevronUp className="w-4 h-4 text-amber-600" /> : <ChevronDown className="w-4 h-4 text-neutral-700" />}
        </button>

        {activeCategory === 'hardware' && (
          <div className="p-5 border-t border-neutral-900 space-y-6">
            {/* Hardware color */}
            <div>
              <span className="block text-[10px] font-mono font-bold tracking-widest text-neutral-600 mb-3">HARDWARE METALLIC PLATING</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {Object.values(HARDWARE_COLORS).map((color) => (
                  <button
                    key={color.id}
                    onClick={() => updateConfig({ hardwareColor: color.id as any })}
                    className={`relative p-3.5 text-left rounded-none border transition-all duration-200 ${
                      config.hardwareColor === color.id
                        ? 'border-amber-600/50 bg-[#070708] text-amber-600'
                        : 'border-neutral-900 bg-[#000000] text-neutral-500 hover:border-neutral-800 hover:text-neutral-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <span
                          className="w-2.5 h-2.5 rounded-none border border-neutral-850"
                          style={{ backgroundColor: color.hex }}
                        />
                        <span className="text-xs font-bold tracking-wide">{color.name.split(' (')[0].replace(' Finish', '').replace(' Plated', '')}</span>
                      </div>
                      {config.hardwareColor === color.id && <Check className="w-3.5 h-3.5 text-amber-600" />}
                    </div>
                    <span className="block text-[9px] font-mono tracking-wide opacity-80">
                      {color.priceDelta === 0 ? 'STANDARD' : `+$${color.priceDelta}`}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Pickguards */}
            <div>
              <div className="flex items-center gap-1 mb-3">
                <span className="block text-[10px] font-mono font-bold tracking-widest text-neutral-600">PROTECTIVE PICKGUARD STYLE</span>
                <div className="group/info relative cursor-pointer">
                  <Info className="w-3.5 h-3.5 text-neutral-700 hover:text-neutral-500 transition-colors" />
                  <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-48 hidden group-hover/info:block bg-neutral-950 border border-neutral-900 text-[10px] text-neutral-500 p-2 rounded-none shadow-xl z-30">
                    Choosing "No Pickguard" exposes the premium wood core and finishes.
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {Object.values(PICKGUARD_STYLES).map((style) => (
                  <button
                    key={style.id}
                    onClick={() => updateConfig({ pickguardStyle: style.id as any })}
                    className={`relative p-3 text-left rounded-none border transition-all duration-200 ${
                      config.pickguardStyle === style.id
                        ? 'border-amber-600/50 bg-[#070708] text-amber-600'
                        : 'border-neutral-900 bg-[#000000] text-neutral-500 hover:border-neutral-800 hover:text-neutral-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5">
                        {style.color && (
                          <span
                            className="w-2.5 h-2.5 rounded-none border border-black/10"
                            style={{ backgroundColor: style.color }}
                          />
                        )}
                        <span className="text-xs font-bold tracking-wide">{style.name.replace(' (Bare Top)', '')}</span>
                      </div>
                      {config.pickguardStyle === style.id && <Check className="w-3.5 h-3.5 text-amber-600" />}
                    </div>
                    <p className="text-[10px] opacity-40 leading-snug truncate">{style.description}</p>
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
