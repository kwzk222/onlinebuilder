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
    <div className="space-y-4 font-sans rounded-none">

      {/* SECTION 1: BODY DESIGN */}
      <div className="border border-[#1a1a1c] bg-[#0c0c0d] rounded-none overflow-hidden">
        <button
          id="category-header-body"
          onClick={() => toggleCategory('body')}
          className="w-full flex items-center justify-between px-5 py-4 text-left font-bold text-[#e3e3e5] hover:bg-[#121213] transition-colors rounded-none font-sans"
        >
          <div className="flex items-center gap-3">
            <span className="text-[9px] text-[#a39081] tracking-[0.25em] font-bold">01 /</span>
            <span className="tracking-[0.2em] text-[10px] uppercase font-bold">BODY ARCHITECTURE</span>
          </div>
          {activeCategory === 'body' ? <ChevronUp className="w-4 h-4 text-[#a39081]" /> : <ChevronDown className="w-4 h-4 text-[#5a554f]" />}
        </button>

        {activeCategory === 'body' && (
          <div className="p-5 border-t border-[#1a1a1c] space-y-6">
            {/* Body Shapes */}
            <div>
              <span className="block text-[9px] font-bold tracking-[0.25em] text-[#5a554f] mb-3 uppercase">BODY SILHOUETTE</span>
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
              <span className="block text-[9px] font-bold tracking-[0.25em] text-[#5a554f] mb-3 uppercase">BODY CORE WOOD</span>
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
                        <span
                          className="w-2 h-2 rounded-none border border-black/10"
                          style={{ backgroundColor: wood.color }}
                        />
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

      {/* SECTION 2: THE LACQUER & FINISHES */}
      <div className="border border-[#1a1a1c] bg-[#0c0c0d] rounded-none overflow-hidden">
        <button
          id="category-header-finish"
          onClick={() => toggleCategory('finish')}
          className="w-full flex items-center justify-between px-5 py-4 text-left font-bold text-[#e3e3e5] hover:bg-[#121213] transition-colors rounded-none font-sans"
        >
          <div className="flex items-center gap-3">
            <span className="text-[9px] text-[#a39081] tracking-[0.25em] font-bold">02 /</span>
            <span className="tracking-[0.2em] text-[10px] uppercase font-bold">LACQUER & COATINGS</span>
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

      {/* SECTION 3: NECK & PLAYABILITY */}
      <div className="border border-[#1a1a1c] bg-[#0c0c0d] rounded-none overflow-hidden">
        <button
          id="category-header-neck"
          onClick={() => toggleCategory('neck')}
          className="w-full flex items-center justify-between px-5 py-4 text-left font-bold text-[#e3e3e5] hover:bg-[#121213] transition-colors rounded-none font-sans"
        >
          <div className="flex items-center gap-3">
            <span className="text-[9px] text-[#a39081] tracking-[0.25em] font-bold">03 /</span>
            <span className="tracking-[0.2em] text-[10px] uppercase font-bold">NECK & FRETS</span>
          </div>
          {activeCategory === 'neck' ? <ChevronUp className="w-4 h-4 text-[#a39081]" /> : <ChevronDown className="w-4 h-4 text-[#5a554f]" />}
        </button>

        {activeCategory === 'neck' && (
          <div className="p-5 border-t border-[#1a1a1c] space-y-6">
            {/* Neck Wood */}
            <div>
              <span className="block text-[9px] font-bold tracking-[0.25em] text-[#5a554f] mb-3 uppercase">NECK SHAFT WOOD</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {Object.values(NECK_WOODS).map((wood) => (
                  <button
                    key={wood.id}
                    onClick={() => updateConfig({ neckWood: wood.id as any })}
                    className={`relative p-3.5 text-left rounded-none border transition-all duration-200 font-sans ${
                      config.neckWood === wood.id
                        ? 'border-[#a39081]/60 bg-[#121213] text-[#a39081]'
                        : 'border-[#1a1a1c] bg-[#0c0c0d] text-[#5a554f] hover:border-[#333132] hover:text-[#e3e3e5]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <span
                          className="w-2 h-2 rounded-none border border-black/10"
                          style={{ backgroundColor: wood.color }}
                        />
                        <span className="text-[10px] font-bold tracking-wider uppercase">{wood.name}</span>
                      </div>
                      {config.neckWood === wood.id && <Check className="w-3.5 h-3.5 text-[#a39081]" />}
                    </div>
                    <span className="block text-[9px] tracking-widest font-bold opacity-80 uppercase">
                      {wood.priceDelta === 0 ? 'STANDARD' : `+$${wood.priceDelta}`}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Fretboard Wood */}
            <div>
              <span className="block text-[9px] font-bold tracking-[0.25em] text-[#5a554f] mb-3 uppercase">FRETBOARD WOOD</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {Object.values(FRETBOARD_WOODS).map((wood) => (
                  <button
                    key={wood.id}
                    onClick={() => updateConfig({ fretboardWood: wood.id as any })}
                    className={`relative p-3.5 text-left rounded-none border transition-all duration-200 font-sans ${
                      config.fretboardWood === wood.id
                        ? 'border-[#a39081]/60 bg-[#121213] text-[#a39081]'
                        : 'border-[#1a1a1c] bg-[#0c0c0d] text-[#5a554f] hover:border-[#333132] hover:text-[#e3e3e5]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <span
                          className="w-2.5 h-2.5 rounded-none border border-black/10"
                          style={{ backgroundColor: wood.color }}
                        />
                        <span className="text-[10px] font-bold tracking-wider uppercase">{wood.name}</span>
                      </div>
                      {config.fretboardWood === wood.id && <Check className="w-3.5 h-3.5 text-[#a39081]" />}
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

      {/* SECTION 4: PICKUPS & CONTROLS */}
      <div className="border border-[#1a1a1c] bg-[#0c0c0d] rounded-none overflow-hidden">
        <button
          id="category-header-pickups"
          onClick={() => toggleCategory('pickups')}
          className="w-full flex items-center justify-between px-5 py-4 text-left font-bold text-[#e3e3e5] hover:bg-[#121213] transition-colors rounded-none font-sans"
        >
          <div className="flex items-center gap-3">
            <span className="text-[9px] text-[#a39081] tracking-[0.25em] font-bold">04 /</span>
            <span className="tracking-[0.2em] text-[10px] uppercase font-bold">ELECTRONICS & TRANSDUCERS</span>
          </div>
          {activeCategory === 'pickups' ? <ChevronUp className="w-4 h-4 text-[#a39081]" /> : <ChevronDown className="w-4 h-4 text-[#5a554f]" />}
        </button>

        {activeCategory === 'pickups' && (
          <div className="p-5 border-t border-[#1a1a1c]">
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
        )}
      </div>

      {/* SECTION 5: HARDWARE & ACCESSORIES */}
      <div className="border border-[#1a1a1c] bg-[#0c0c0d] rounded-none overflow-hidden">
        <button
          id="category-header-hardware"
          onClick={() => toggleCategory('hardware')}
          className="w-full flex items-center justify-between px-5 py-4 text-left font-bold text-[#e3e3e5] hover:bg-[#121213] transition-colors rounded-none font-sans"
        >
          <div className="flex items-center gap-3">
            <span className="text-[9px] text-[#a39081] tracking-[0.25em] font-bold">05 /</span>
            <span className="tracking-[0.2em] text-[10px] uppercase font-bold">PLATINGS & ACCENTUATION</span>
          </div>
          {activeCategory === 'hardware' ? <ChevronUp className="w-4 h-4 text-[#a39081]" /> : <ChevronDown className="w-4 h-4 text-[#5a554f]" />}
        </button>

        {activeCategory === 'hardware' && (
          <div className="p-5 border-t border-[#1a1a1c] space-y-6">
            {/* Hardware color */}
            <div>
              <span className="block text-[9px] font-bold tracking-[0.25em] text-[#5a554f] mb-3 uppercase">HARDWARE METALLIC PLATING</span>
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
                        <span
                          className="w-2.5 h-2.5 rounded-none border border-neutral-800"
                          style={{ backgroundColor: color.hex }}
                        />
                        <span className="text-[10px] font-bold tracking-wider uppercase">{color.name.split(' (')[0].replace(' Finish', '').replace(' Plated', '')}</span>
                      </div>
                      {config.hardwareColor === color.id && <Check className="w-3.5 h-3.5 text-[#a39081]" />}
                    </div>
                    <span className="block text-[9px] tracking-widest font-bold opacity-80 uppercase font-sans">
                      {color.priceDelta === 0 ? 'STANDARD' : `+$${color.priceDelta}`}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Pickguards */}
            <div>
              <div className="flex items-center gap-1 mb-3">
                <span className="block text-[9px] font-bold tracking-[0.25em] text-[#5a554f] uppercase">PROTECTIVE PICKGUARD STYLE</span>
                <div className="group/info relative cursor-pointer">
                  <Info className="w-3.5 h-3.5 text-[#5a554f] hover:text-[#a39081] transition-colors" />
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
                    className={`relative p-3 text-left rounded-none border transition-all duration-200 font-sans ${
                      config.pickguardStyle === style.id
                        ? 'border-[#a39081]/60 bg-[#121213] text-[#a39081]'
                        : 'border-[#1a1a1c] bg-[#0c0c0d] text-[#5a554f] hover:border-[#333132] hover:text-[#e3e3e5]'
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

    </div>
  );
};
