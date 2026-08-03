import React, { useRef, useState, useEffect } from 'react';
import { useGuitarStore, calculateTotalPrice } from '../store/guitarStore';
import { Guitar3DScene } from './Guitar3DScene';
import { OptionsControlPanel } from './OptionsControlPanel';
import { PriceCounter } from './PriceCounter';
import confetti from 'canvas-confetti';

interface MainDashboardProps {
  onReturnToStartup?: () => void;
}

export const MainDashboard: React.FC<MainDashboardProps> = ({ onReturnToStartup }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const {
    config,
    loadFromShareCode,
  } = useGuitarStore();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const bCode = params.get('b');
    if (bCode) {
      const success = loadFromShareCode(bCode);
      if (success) {
        window.history.replaceState({}, document.title, window.location.pathname);
        confetti({
          particleCount: 50,
          spread: 40,
          colors: ['#a39081', '#ffffff']
        });
      }
    }
  }, [loadFromShareCode]);

  const { total, base, breakdown } = calculateTotalPrice(config);

  const handleBuy = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      alert('Please provide your name and email address to proceed.');
      return;
    }

    // Calculations for biometric estimation
    const estThickness = Math.max(16, Math.min(26, config.relaxedHandMeasurement * (config.measurementSystem === 'metric' ? 0.15 : 0.15 * 25.4)));
    const thicknessMetricStr = `${estThickness.toFixed(1)} mm`;
    const thicknessImperialStr = `${(estThickness / 25.4).toFixed(2)} in`;

    const finalThicknessStr = config.useCustomThickness ? config.customThicknessInput : (config.measurementSystem === 'metric' ? thicknessMetricStr : thicknessImperialStr);

    const orderDetails = `==========================================================
BESPOKE CUSTOM SHOP SPECIFICATIONS & ORDER DETAILS
==========================================================
CLIENT PROFILE:
- Name: ${name.trim()}
- Email: ${email.trim()}

INSTRUMENT MODEL:
- Type: ${config.instrumentType === 'bass' ? 'ACOUSTIC' : 'ELECTRIC'}
- Body Shape: ${config.bodyShape.toUpperCase()}

NECK SPECIFICATIONS (BOLT-THROUGH CARBON FIBER):
- Profile: ${config.neckProfile.toUpperCase()}
- Calculated Neck Thickness: ${finalThicknessStr}
- Base Shaft Wood: ${config.neckWood.toUpperCase().replace('_', ' ')}

FRETBOARD MATRIX (RICHLITE):
- Richlite Material: ${config.fretboardMaterial.toUpperCase().replace('_', ' ')}
- Compound Radius: Nut (${config.radiusNut}) -> Last Fret (${config.radiusLastFret})
- Tuning Mode: ${config.isFretless ? 'PURE FRETLESS' : `${config.edoValue}-EDO`}
- Number of Frets: ${config.isFretless ? 'FRETLESS (NONE)' : config.numberOfFrets}
- Scalloped: ${config.scalloped && !config.isFretless ? `YES (From Fret ${config.scallopedStartFret})` : 'NO'}
- Inlay Style: ${config.fretboardInlay.toUpperCase()}
- Modular Swap System: ${config.modularFretboard ? 'YES (Interchangeable magnetic pin assembly)' : 'NO'}

${config.extraFretboards.length > 0 ? `MODULAR ACCESSORY BOARDS:\n${config.extraFretboards.map((b, i) => `--- EXTRA BOARD #0${i+1} ---\n  - Material: ${b.material.toUpperCase().replace('_', ' ')}\n  - Tuning Mode: ${b.isFretless ? 'PURE FRETLESS' : `${b.edoValue}-EDO`}\n  - Inlay: ${b.inlay.toUpperCase()}\n  - Frets length: ${b.isFretless ? 'FRETLESS' : b.numberOfFrets}\n`).join('\n')}` : ''}
CORE MATERIALS & LACQUERS:
- Body Wood: ${config.bodyWood.toUpperCase()}
- Lacquer Finish: ${config.finishPreset.toUpperCase().replace(/_/g, ' ')}

ERGONOMIC SPECIFICATIONS:
- Intended Seated Posture: ${config.seatedPosition.toUpperCase().replace(/_/g, ' ')}
- Target Attack Neck Angle: ${config.neckAngle}°

HARDWARE & PLATING ANCHORAGE:
- Bridge: ${config.bridgeType.toUpperCase().replace(/_/g, ' ')}
- Tuners: ${config.tunerType.toUpperCase().replace(/_/g, ' ')}
- Knob Type: ${config.knobType.toUpperCase().replace(/_/g, ' ')}
- Nut: ${config.nutType.toUpperCase().replace(/_/g, ' ')}
- Metallic Plating: ${config.hardwareColor.toUpperCase().replace('_', ' ')}
- Pickguard / Cover: ${config.pickguardStyle.toUpperCase().replace(/_/g, ' ')}

ELECTRONICS & ANALOG FILTERS:
- Electromagnetic Layout: ${config.pickupsLayout.toUpperCase()}
- Active Preamplifier (18V): ${config.activePreamp ? 'YES' : 'NO'}
- Tone Capacitor: ${config.toneCapacitor.toUpperCase().replace(/_/g, ' ')}

SPECIAL INSTRUCTIONS / DESIGN NOTES:
${specialInstructions.trim() ? specialInstructions.trim() : 'None provided.'}

==========================================================
FINANCIAL VALUATION:
- Base Price: $${base.toLocaleString()}.00 USD
${breakdown.map(item => `- ${item.category} (${item.name}): +$${item.price}.00 USD`).join('\n')}
----------------------------------------------------------
TOTAL PRICE: $${total.toLocaleString()}.00 USD
==========================================================`;

    const blob = new Blob([orderDetails], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Luxe_Luthiers_Order_${config.instrumentType === 'bass' ? 'Acoustic' : 'Electric'}_${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);

    confetti({
      particleCount: 100,
      spread: 60,
      colors: ['#a39081', '#ffffff']
    });
  };

  return (
    <div className="min-h-screen bg-[#0c0c0d] text-[#e3e3e5] flex flex-col font-sans selection:bg-[#a39081]/20 selection:text-[#e3e3e5] rounded-none">

      {/* HEADER SECTION - Raw, brutalist borders and square Return button */}
      <header className="border-b border-[#1a1a1c] bg-[#0c0c0d] px-6 py-4 flex flex-row items-center justify-between rounded-none">
        <div className="flex items-center gap-4 rounded-none">
          {onReturnToStartup && (
            <button
              onClick={onReturnToStartup}
              title="Return"
              className="w-10 h-10 flex items-center justify-center text-sm font-bold text-[#a39081] border border-[#1a1a1c] hover:border-[#a39081] hover:text-[#e3e3e5] bg-[#0c0c0d] rounded-none transition-colors"
            >
              ←
            </button>
          )}
          <div className="rounded-none">
            <h1 className="text-base font-black tracking-[0.4em] text-[#e3e3e5] uppercase">LUXE LUTHIERS</h1>
            <p className="text-[9px] text-[#5a554f] font-bold tracking-[0.2em] uppercase mt-0.5">
              BESPOKE {config.instrumentType === 'bass' ? 'ACOUSTIC' : 'ELECTRIC'} STUDIO
            </p>
          </div>
        </div>

        {/* Sticky Always-Visible Valuation in Top Bar */}
        <div className="flex items-center gap-3">
          <span className="text-[9px] tracking-[0.3em] text-[#5a554f] font-bold uppercase hidden sm:inline-block">ESTIMATED VALUATION</span>
          <div className="border border-[#1a1a1c] px-3 py-1.5 bg-[#000000] rounded-none">
            <PriceCounter value={total} />
          </div>
        </div>
      </header>

      {/* MAIN VIEWPORT - EXACT 50/50 SPLIT WITHOUT ROUNDED CORNERS */}
      <main className="flex-1 grid grid-cols-1 md:grid-cols-2 rounded-none">

        {/* LEFT COLUMN: THE CINEMATIC 3D SCREEN - NO OVERLAYS OR BUTTONS */}
        <section className="relative border-b md:border-b-0 md:border-r border-[#1a1a1c] h-[50vh] md:h-auto min-h-[350px] rounded-none bg-[#050506]">
          <Guitar3DScene canvasRef={canvasRef} />
        </section>

        {/* RIGHT COLUMN: SCROLLABLE OPTIONS AND MINIMALIST BUY FORM */}
        <section className="flex flex-col h-auto md:h-[calc(100vh-73px)] overflow-y-auto bg-[#0c0c0d] rounded-none">

          <div className="p-6 space-y-6 flex-1 rounded-none">
            <OptionsControlPanel />

            {/* ORDER INITIATION FORM */}
            <form onSubmit={handleBuy} className="border-t border-[#1a1a1c] pt-8 space-y-5 rounded-none">
              <div className="rounded-none">
                <h3 className="text-[10px] tracking-[0.3em] text-[#a39081] font-bold uppercase mb-2">
                  CLIENT ARCHIVE
                </h3>
                <p className="text-[10px] leading-relaxed text-[#5a554f] uppercase tracking-wider font-bold">
                  Provide your profile to compile full bespoke build blueprints and financial specifications.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-none">
                <div className="rounded-none">
                  <label className="block text-[9px] text-[#5a554f] tracking-[0.25em] uppercase font-bold mb-1.5">
                    FIRST AND LAST NAME
                  </label>
                  <input
                    type="text"
                    required
                    placeholder=""
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#121213] border border-[#1a1a1c] rounded-none px-3 py-2 text-[10px] uppercase tracking-wider font-bold text-[#e3e3e5] focus:outline-none focus:border-[#a39081]"
                  />
                </div>
                <div className="rounded-none">
                  <label className="block text-[9px] text-[#5a554f] tracking-[0.25em] uppercase font-bold mb-1.5">
                    EMAIL ADDRESS
                  </label>
                  <input
                    type="email"
                    required
                    placeholder=""
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#121213] border border-[#1a1a1c] rounded-none px-3 py-2 text-[10px] uppercase tracking-wider font-bold text-[#e3e3e5] focus:outline-none focus:border-[#a39081]"
                  />
                </div>
              </div>

              <div className="rounded-none">
                <label className="block text-[9px] text-[#5a554f] tracking-[0.25em] uppercase font-bold mb-1.5">
                  SPECIAL INSTRUCTIONS & DESIGN NOTES
                </label>
                <textarea
                  rows={4}
                  placeholder=""
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  className="w-full bg-[#121213] border border-[#1a1a1c] rounded-none p-3 text-[10px] uppercase tracking-wider font-bold text-[#e3e3e5] focus:outline-none focus:border-[#a39081] resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#e3e3e5] hover:bg-[#ffffff] text-[#000000] font-sans font-black tracking-[0.3em] text-[10px] py-4 rounded-none transition-all hover:tracking-[0.35em] uppercase"
              >
                COMPLETE ORDER
              </button>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
};
