import React, { useRef, useState, useEffect } from 'react';
import { useGuitarStore, calculateTotalPrice } from '../store/guitarStore';
import { Guitar3DScene } from './Guitar3DScene';
import { OptionsControlPanel } from './OptionsControlPanel';
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

  // Load configuration from share parameter 'b' if it exists in URL on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const bCode = params.get('b');
    if (bCode) {
      const success = loadFromShareCode(bCode);
      if (success) {
        window.history.replaceState({}, document.title, window.location.pathname);
        confetti({
          particleCount: 100,
          spread: 60,
          colors: ['#c19a4e', '#ffffff']
        });
      }
    }
  }, [loadFromShareCode]);

  // Pricing calculations
  const { total, base, breakdown } = calculateTotalPrice(config);

  const handleBuy = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      alert('Please provide your name and email address to proceed.');
      return;
    }

    // Compile order details
    const orderDetails = `==========================================================
BESPOKE CUSTOM SHOP SPECIFICATIONS & ORDER DETAILS
==========================================================
CLIENT PROFILE:
- Name: ${name.trim()}
- Email: ${email.trim()}

INSTRUMENT MODEL:
- Type: ${config.instrumentType.toUpperCase()}
- Body Shape: ${config.bodyShape.toUpperCase()}

CORE MATERIALS & LACQUERS:
- Body Wood: ${config.bodyWood.toUpperCase()}
- Lacquer Finish: ${config.finishPreset.toUpperCase().replace(/_/g, ' ')}
- Neck Wood: ${config.neckWood.toUpperCase().replace('_', ' ')}
- Fretboard: ${config.fretboardWood.toUpperCase()}

HARDWARE & CONTROLS:
- Pickups Layout: ${config.pickupsLayout.toUpperCase()}
- Hardware Finish: ${config.hardwareColor.toUpperCase().replace('_', ' ')}
- Pickguard Style: ${config.pickguardStyle.toUpperCase().replace(/_/g, ' ')}

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
    link.download = `Luxe_Luthiers_Order_${config.instrumentType}_${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);

    confetti({
      particleCount: 150,
      spread: 80,
      colors: ['#c19a4e', '#ffffff', '#000000']
    });
  };

  return (
    <div className="min-h-screen bg-[#000000] text-neutral-100 flex flex-col font-sans selection:bg-amber-600/20 selection:text-amber-200 rounded-none">

      {/* HEADER SECTION - Raw, brutalist border and uppercase mono font */}
      <header className="border-b border-neutral-900 bg-[#000000] px-6 py-4 flex flex-row items-center justify-between rounded-none">
        <div className="flex items-center gap-4">
          {onReturnToStartup && (
            <button
              onClick={onReturnToStartup}
              title="Return to selection screen"
              className="px-3 py-1.5 text-[10px] font-mono tracking-widest text-neutral-400 border border-neutral-900 hover:border-amber-600 hover:text-amber-600 bg-black rounded-none transition-all uppercase"
            >
              ← RETURN
            </button>
          )}
          <div>
            <h1 className="text-base font-black tracking-[0.4em] text-neutral-200 font-serif">LUXE LUTHIERS</h1>
            <p className="text-[9px] text-neutral-600 font-mono tracking-widest uppercase mt-0.5">
              BESPOKE {config.instrumentType.toUpperCase()} STUDIO
            </p>
          </div>
        </div>

        <div className="text-[10px] font-mono tracking-widest text-neutral-600">
          SERIES CLASSIFICATION
        </div>
      </header>

      {/* MAIN VIEWPORT - EXACT 50/50 SPLIT WITHOUT ROUNDED CORNERS */}
      <main className="flex-1 grid grid-cols-1 md:grid-cols-2">

        {/* LEFT COLUMN: THE CINEMATIC 3D SCREEN - NO OVERLAYS OR BUTTONS */}
        <section className="relative border-b md:border-b-0 md:border-r border-neutral-900 h-[50vh] md:h-auto min-h-[350px]">
          <Guitar3DScene canvasRef={canvasRef} />
        </section>

        {/* RIGHT COLUMN: SCROLLABLE OPTIONS AND MINIMALIST BUY FORM */}
        <section className="flex flex-col h-auto md:h-[calc(100vh-69px)] overflow-y-auto bg-[#000000]">

          {/* Subtle minimal valuation block at the very top */}
          <div className="border-b border-neutral-900 px-6 py-4 flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold tracking-widest text-neutral-600 uppercase">VALUATION</span>
            <span className="text-sm font-mono font-bold tracking-widest text-amber-600">
              ${total.toLocaleString()}.00 USD
            </span>
          </div>

          <div className="p-6 space-y-6 flex-1">
            <OptionsControlPanel />

            {/* ORDER INITIATION FORM */}
            <form onSubmit={handleBuy} className="border-t border-neutral-900 pt-8 space-y-5">
              <div>
                <h3 className="text-xs font-mono font-bold tracking-widest text-neutral-400 uppercase mb-2">
                  CLIENT ARCHIVE
                </h3>
                <p className="text-[10px] leading-relaxed text-neutral-600 mb-4">
                  Provide your profile to compile full bespoke build blueprints and financial specifications.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] font-mono text-neutral-500 tracking-widest uppercase mb-1.5">
                    FULL NAME
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rick Owens"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#070708] border border-neutral-900 rounded-none px-3 py-2 text-xs font-mono text-neutral-200 focus:outline-none focus:border-amber-600/60"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-mono text-neutral-500 tracking-widest uppercase mb-1.5">
                    EMAIL ADDRESS
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. contact@luxe.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#070708] border border-neutral-900 rounded-none px-3 py-2 text-xs font-mono text-neutral-200 focus:outline-none focus:border-amber-600/60"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[9px] font-mono text-neutral-500 tracking-widest uppercase mb-1.5">
                  SPECIAL INSTRUCTIONS & DESIGN NOTES
                </label>
                <textarea
                  rows={4}
                  placeholder="e.g. Bespoke matte black satin lacquer request or specific neck diameter profiles..."
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  className="w-full bg-[#070708] border border-neutral-900 rounded-none p-3 text-xs font-mono text-neutral-200 focus:outline-none focus:border-amber-600/60 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-neutral-100 hover:bg-neutral-200 text-[#000000] font-mono font-bold tracking-[0.2em] text-xs py-3.5 rounded-none transition-all hover:tracking-[0.25em]"
              >
                COMPILE SPECIFICATIONS & BUY
              </button>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
};
