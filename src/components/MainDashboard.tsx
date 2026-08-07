import React, { useRef, useState, useEffect } from 'react';
import { useGuitarStore, calculateTotalPrice } from '../store/guitarStore';
import { Guitar3DScene } from './Guitar3DScene';
import { OptionsControlPanel } from './OptionsControlPanel';
import { PriceCounter } from './PriceCounter';
import confetti from 'canvas-confetti';
import { Save, FolderOpen, Trash2 } from 'lucide-react';

interface MainDashboardProps {
  onReturnToStartup?: () => void;
}

export const MainDashboard: React.FC<MainDashboardProps> = ({ onReturnToStartup }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const {
    config,
    loadFromShareCode,
    savedBuilds,
    saveBuild,
    loadBuild,
    deleteBuild,
  } = useGuitarStore();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');

  // States for the save/load model overlay inside the 3D Canvas
  const [showSaveLoadModal, setShowSaveLoadModal] = useState(false);
  const [newBuildName, setNewBuildName] = useState('');

  // Placeholder CAPTCHA states
  const [captchaCode, setCaptchaCode] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');

  useEffect(() => {
    generateCaptcha();
  }, []);

  const generateCaptcha = () => {
    const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
    let code = '';
    for (let i = 0; i < 4; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaCode(code);
  };

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

    if (captchaInput.trim().toUpperCase() !== captchaCode) {
      alert('Security Verification Failed. Please enter the correct CAPTCHA code.');
      generateCaptcha();
      setCaptchaInput('');
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

    // Generate text file in-memory using a byte stream / buffer
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(orderDetails);
    const blob = new Blob([dataBuffer], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `LVI_Custom_Order_${config.instrumentType === 'bass' ? 'Acoustic' : 'Electric'}_${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);

    confetti({
      particleCount: 100,
      spread: 60,
      colors: ['#a39081', '#ffffff']
    });
  };

  const handleSaveBuild = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBuildName.trim()) return;
    saveBuild(newBuildName.trim());
    setNewBuildName('');
    confetti({
      particleCount: 20,
      spread: 30,
      colors: ['#a39081']
    });
  };

  return (
    <div className="min-h-screen bg-[#000000] text-[#e3e3e5] flex flex-col font-sans selection:bg-[#a39081]/20 selection:text-[#e3e3e5] rounded-none">

      {/* HEADER SECTION - Raw, brutalist borders with Logo Back-Button */}
      <header className="border-b border-[#1c1c1f] bg-[#000000] px-6 py-4 flex flex-row items-center justify-between rounded-none">
        <div className="flex items-center gap-4 rounded-none">
          {onReturnToStartup ? (
            <button
              onClick={onReturnToStartup}
              title="Return to home portal"
              className="group text-left focus:outline-none rounded-none cursor-pointer"
            >
              <h1 className="text-base font-black tracking-[0.4em] text-[#e3e3e5] group-hover:text-[#a39081] transition-colors uppercase">
                LVI Custom
              </h1>
              <p className="text-[9px] text-[#5a554f] font-bold tracking-[0.2em] uppercase mt-0.5">
                BESPOKE {config.instrumentType === 'bass' ? 'ACOUSTIC' : 'ELECTRIC'} STUDIO
              </p>
            </button>
          ) : (
            <div className="rounded-none">
              <h1 className="text-base font-black tracking-[0.4em] text-[#e3e3e5] uppercase">LVI Custom</h1>
              <p className="text-[9px] text-[#5a554f] font-bold tracking-[0.2em] uppercase mt-0.5">
                BESPOKE {config.instrumentType === 'bass' ? 'ACOUSTIC' : 'ELECTRIC'} STUDIO
              </p>
            </div>
          )}
        </div>

        {/* Sticky Always-Visible Valuation in Top Bar */}
        <div className="flex items-center gap-3">
          <span className="text-[9px] tracking-[0.3em] text-[#5a554f] font-bold uppercase hidden sm:inline-block">ESTIMATED VALUATION</span>
          <div className="border border-[#1c1c1f] px-3 py-1.5 bg-[#000000] rounded-none">
            <PriceCounter value={total} />
          </div>
        </div>
      </header>

      {/* MAIN VIEWPORT - EXACT 50/50 SPLIT WITHOUT ROUNDED CORNERS */}
      <main className="flex-1 grid grid-cols-1 md:grid-cols-2 rounded-none">

        {/* LEFT COLUMN: THE CINEMATIC 3D SCREEN - NO OVERLAYS EXCEPT TOP-LEFT SAVE/LOAD UTILITY */}
        <section className="relative border-b md:border-b-0 md:border-r border-[#1c1c1f] h-[50vh] md:h-auto min-h-[350px] rounded-none bg-[#000000]">

          {/* Top-Left Save/Load Widgets directly on model canvas */}
          <div className="absolute top-4 left-4 z-20 flex gap-2 rounded-none">
            <button
              onClick={() => setShowSaveLoadModal(!showSaveLoadModal)}
              className="px-3 py-1.5 bg-[#000000]/80 backdrop-blur-md border border-[#1c1c1f] hover:border-[#a39081] hover:text-[#e3e3e5] text-[#8a857e] text-[8px] tracking-[0.25em] uppercase font-black flex items-center gap-1.5 transition-all rounded-none"
            >
              <FolderOpen className="w-3 h-3 text-[#a39081]" />
              <span>ARCHIVES / SLOTS ({Object.keys(savedBuilds).length})</span>
            </button>
          </div>

          {/* Quick Save/Load overlay widget */}
          {showSaveLoadModal && (
            <div className="absolute top-14 left-4 w-72 bg-[#000000]/95 backdrop-blur-lg border border-[#1c1c1f] p-4 z-30 rounded-none shadow-2xl flex flex-col gap-4 animate-fade-in text-[#e3e3e5]">
              <div className="flex justify-between items-center border-b border-[#1c1c1f] pb-2">
                <span className="text-[9px] font-black tracking-widest text-[#a39081] uppercase">SPECIFICATION ARCHIVES</span>
                <button
                  onClick={() => setShowSaveLoadModal(false)}
                  className="text-[9px] font-mono text-[#5a554f] hover:text-[#e3e3e5] cursor-pointer"
                >
                  [CLOSE]
                </button>
              </div>

              {/* Save Form */}
              <form onSubmit={handleSaveBuild} className="flex gap-1.5">
                <input
                  type="text"
                  required
                  maxLength={1000}
                  placeholder="SLOT NAME..."
                  value={newBuildName}
                  onChange={(e) => setNewBuildName(e.target.value)}
                  className="flex-1 bg-[#0c0c0d] border border-[#1a1a1c] px-2 py-1 text-[8.5px] font-mono uppercase tracking-widest text-[#e3e3e5] focus:outline-none focus:border-[#a39081] rounded-none"
                />
                <button
                  type="submit"
                  className="px-3 bg-[#e3e3e5] hover:bg-[#ffffff] text-[#000000] font-black text-[8px] tracking-widest uppercase flex items-center justify-center rounded-none"
                >
                  <Save className="w-2.5 h-2.5" />
                </button>
              </form>

              {/* Slot Registry */}
              <div className="flex flex-col gap-1.5 max-h-48 overflow-y-auto">
                {Object.keys(savedBuilds).length === 0 ? (
                  <div className="text-[8px] text-[#5a554f] font-mono uppercase tracking-wider py-4 text-center">
                    [ NO ACTIVE BLUEPRINTS SAVED ]
                  </div>
                ) : (
                  Object.keys(savedBuilds).map((slot) => (
                    <div key={slot} className="flex justify-between items-center bg-[#0c0c0d] p-2 border border-[#111112]">
                      <button
                        onClick={() => {
                          loadBuild(slot);
                          confetti({
                            particleCount: 15,
                            spread: 20,
                            colors: ['#a39081']
                          });
                        }}
                        className="text-left font-mono text-[8px] text-[#8a857e] hover:text-[#e3e3e5] tracking-widest uppercase flex-1 truncate cursor-pointer"
                      >
                        {slot} ({savedBuilds[slot].instrumentType.toUpperCase()})
                      </button>
                      <button
                        onClick={() => deleteBuild(slot)}
                        className="text-[#5a554f] hover:text-red-500 p-0.5"
                        title="Delete slot"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          <Guitar3DScene canvasRef={canvasRef} />
        </section>

        {/* RIGHT COLUMN: SCROLLABLE OPTIONS AND MINIMALIST BUY FORM */}
        <section className="flex flex-col h-auto md:h-[calc(100vh-73px)] overflow-y-auto bg-[#050506] rounded-none border-[#1c1c1f]">

          <div className="p-6 space-y-6 flex-1 rounded-none">
            <OptionsControlPanel />

            {/* ORDER INITIATION FORM */}
            <form onSubmit={handleBuy} className="border-t border-[#1c1c1f] pt-8 space-y-5 rounded-none">
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
                    maxLength={1000}
                    placeholder=""
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#000000] border border-[#1c1c1f] rounded-none px-3 py-2 text-[10px] uppercase tracking-wider font-bold text-[#e3e3e5] focus:outline-none focus:border-[#a39081]"
                  />
                </div>
                <div className="rounded-none">
                  <label className="block text-[9px] text-[#5a554f] tracking-[0.25em] uppercase font-bold mb-1.5">
                    EMAIL ADDRESS
                  </label>
                  <input
                    type="email"
                    required
                    maxLength={1000}
                    placeholder=""
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#000000] border border-[#1c1c1f] rounded-none px-3 py-2 text-[10px] uppercase tracking-wider font-bold text-[#e3e3e5] focus:outline-none focus:border-[#a39081]"
                  />
                </div>
              </div>

              <div className="rounded-none">
                <label className="block text-[9px] text-[#5a554f] tracking-[0.25em] uppercase font-bold mb-1.5">
                  SPECIAL INSTRUCTIONS & DESIGN NOTES
                </label>
                <textarea
                  rows={4}
                  maxLength={1000}
                  placeholder=""
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  className="w-full bg-[#000000] border border-[#1c1c1f] rounded-none p-3 text-[10px] uppercase tracking-wider font-bold text-[#e3e3e5] focus:outline-none focus:border-[#a39081] resize-none"
                />
              </div>

              {/* PLACEHOLDER CAPTCHA ELEMENT */}
              <div className="border border-[#1c1c1f] bg-[#000000] p-4 flex flex-col sm:flex-row items-center gap-4 rounded-none">
                <div className="flex flex-col">
                  <span className="text-[8px] tracking-[0.25em] text-[#a39081] font-black uppercase mb-1">
                    SECURITY PROTOCOL
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="bg-[#050506] border border-[#1c1c1f] px-3 py-1 font-mono text-sm tracking-[0.3em] text-[#e3e3e5] font-black uppercase select-none">
                      {captchaCode}
                    </span>
                    <button
                      type="button"
                      onClick={generateCaptcha}
                      className="text-[8px] text-[#5a554f] hover:text-[#a39081] font-mono tracking-widest uppercase cursor-pointer"
                    >
                      [REGEN]
                    </button>
                  </div>
                </div>
                <div className="flex-1 w-full">
                  <label className="block text-[8px] text-[#5a554f] tracking-[0.2em] uppercase font-black mb-1">
                    VERIFICATION CODE
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={4}
                    placeholder="ENTER CODE..."
                    value={captchaInput}
                    onChange={(e) => setCaptchaInput(e.target.value.toUpperCase())}
                    className="w-full bg-[#050506] border border-[#1c1c1f] rounded-none px-3 py-1.5 text-xs font-mono tracking-widest text-[#e3e3e5] focus:outline-none focus:border-[#a39081]"
                  />
                </div>
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
