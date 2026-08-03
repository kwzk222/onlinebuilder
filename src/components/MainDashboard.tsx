import React, { useRef, useState, useEffect } from 'react';
import { useGuitarStore, calculateTotalPrice } from '../store/guitarStore';
import { Guitar3DScene } from './Guitar3DScene';
import { OptionsControlPanel } from './OptionsControlPanel';
import { PriceCounter } from './PriceCounter';
import { exportGuitarToGLB } from '../utils/glbGenerator';
import {
  Undo2,
  Redo2,
  Share2,
  Download,
  FileText,
  Save,
  Trash2,
  Sparkles,
  RotateCcw,
  Check,
  Guitar
} from 'lucide-react';
import jsPDF from 'jspdf';
import confetti from 'canvas-confetti';

interface MainDashboardProps {
  onReturnToStartup?: () => void;
}

export const MainDashboard: React.FC<MainDashboardProps> = ({ onReturnToStartup }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const {
    config,
    undo,
    redo,
    resetConfig,
    historyIndex,
    history,
    savedBuilds,
    saveBuild,
    loadBuild,
    deleteBuild,
    getShareUrl,
    loadFromShareCode,
  } = useGuitarStore();

  const [slotInput, setSlotInput] = useState('');
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'build' | 'saved'>('build');

  // Load configuration from share parameter 'b' if it exists in URL on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const bCode = params.get('b');
    if (bCode) {
      const success = loadFromShareCode(bCode);
      if (success) {
        // Clean URL to avoid infinite reloading state
        window.history.replaceState({}, document.title, window.location.pathname);
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#d4af37', '#ffffff', '#1a1a1a']
        });
      }
    }
  }, [loadFromShareCode]);

  // Pricing calculations
  const { total, base, breakdown } = calculateTotalPrice(config);

  // Undo/Redo availability checks
  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  // Actions
  const handleShare = () => {
    const shareUrl = getShareUrl();
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportImage = () => {
    if (canvasRef.current) {
      const dataUrl = canvasRef.current.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `custom-guitar-spec-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    }
  };

  const handleExportPDF = () => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    // Premium minimal PDF layout
    doc.setFillColor(15, 15, 17); // Dark solid background top band
    doc.rect(0, 0, 210, 45, 'F');

    // Title / Brand
    doc.setTextColor(212, 175, 55); // Premium Gold
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(22);
    doc.text('LUXE LUTHIERS', 15, 18);

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont('Helvetica', 'normal');
    doc.text('CUSTOM SHOP SPECIFICATION SHEET', 15, 25);
    doc.text(`DATE: ${new Date().toLocaleDateString()}`, 15, 30);

    // Price top-right
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.setFont('Helvetica', 'bold');
    doc.text(`$${total.toLocaleString()}.00`, 195, 22, { align: 'right' });

    // Spec body
    doc.setFillColor(248, 248, 248);
    doc.rect(10, 50, 190, 235, 'F');

    doc.setFontSize(12);
    doc.setTextColor(20, 20, 20);
    doc.text('YOUR BESPOKE CONFIGURATION', 15, 62);

    // Add list of specs
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(60, 60, 60);

    const specs = [
      { key: 'Base Instrument', val: `Bespoke Electric Guitar (Base Price $${base.toLocaleString()})` },
      { key: 'Body Silhouette', val: config.bodyShape.toUpperCase().replace('_', ' ') },
      { key: 'Body Core Wood', val: config.bodyWood.toUpperCase() },
      { key: 'Lacquer Finish', val: config.finishPreset.toUpperCase().replace(/_/g, ' ') },
      { key: 'Neck Profile', val: config.neckWood.toUpperCase().replace('_', ' ') },
      { key: 'Fretboard Wood', val: config.fretboardWood.toUpperCase() },
      { key: 'Pickups Layout', val: config.pickupsLayout.toUpperCase() },
      { key: 'Hardware Plating', val: config.hardwareColor.toUpperCase().replace('_', ' ') },
      { key: 'Pickguard Style', val: config.pickguardStyle.toUpperCase().replace(/_/g, ' ') },
    ];

    let startY = 72;
    specs.forEach((s) => {
      doc.setFont('Helvetica', 'bold');
      doc.text(`${s.key}:`, 15, startY);
      doc.setFont('Helvetica', 'normal');
      doc.text(s.val, 60, startY);
      doc.setDrawColor(220, 220, 220);
      doc.line(15, startY + 2, 195, startY + 2);
      startY += 8;
    });

    // Detailed breakdown pricing
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(20, 20, 20);
    doc.text('ADDITIONAL SELECTIONS & DELTAS', 15, startY + 5);

    startY += 12;
    if (breakdown.length === 0) {
      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(120, 120, 120);
      doc.text('None (Standard Options Configured)', 15, startY);
      startY += 10;
    } else {
      breakdown.forEach((item) => {
        doc.setFont('Helvetica', 'normal');
        doc.setFontSize(10);
        doc.setTextColor(80, 80, 80);
        doc.text(`${item.category} (${item.name})`, 15, startY);
        doc.text(`+$${item.price}.00`, 195, startY, { align: 'right' });
        startY += 6;
      });
    }

    doc.setDrawColor(212, 175, 55);
    doc.setLineWidth(0.5);
    doc.line(15, startY + 2, 195, startY + 2);
    startY += 10;

    // Total Price Summary
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(20, 20, 20);
    doc.text('TOTAL PRICE:', 15, startY);
    doc.text(`$${total.toLocaleString()}.00 USD`, 195, startY, { align: 'right' });

    // Footer statement
    doc.setFont('Helvetica', 'italic');
    doc.setFontSize(8);
    doc.setTextColor(120, 120, 120);
    doc.text('Luxe Luthiers premium hand-crafted custom series. Each instrument is custom built to order in our local studio.', 15, 280);

    // Try to draw canvas screenshot thumbnail if available
    try {
      if (canvasRef.current) {
        const dataUrl = canvasRef.current.toDataURL('image/png');
        // Add image to spec sheet
        doc.addImage(dataUrl, 'PNG', 115, 62, 75, 75);
      }
    } catch (e) {
      console.warn("Could not add 3D canvas thumb to PDF spec.", e);
    }

    doc.save(`Luxe-Guitar-Spec-${config.bodyShape}-${Date.now()}.pdf`);
  };

  const handleSaveBuild = (e: React.FormEvent) => {
    e.preventDefault();
    if (slotInput.trim()) {
      saveBuild(slotInput.trim());
      setSlotInput('');
      confetti({
        particleCount: 50,
        spread: 40,
        colors: ['#10b981', '#ffffff']
      });
    }
  };

  const handleDownloadGLB = () => {
    exportGuitarToGLB(config.bodyShape, config.instrumentType);
  };

  return (
    <div className="min-h-screen bg-[#070709] text-neutral-100 flex flex-col font-sans selection:bg-amber-500/20 selection:text-amber-200">

      {/* HEADER SECTION */}
      <header className="border-b border-neutral-900 bg-[#070709]/80 backdrop-blur-md px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            {onReturnToStartup && (
              <button
                onClick={onReturnToStartup}
                title="Return to selection screen"
                className="flex items-center gap-2 px-3 py-2 text-xs font-mono font-bold tracking-wider text-amber-500 border border-amber-500/30 hover:border-amber-500/80 hover:bg-amber-500/5 bg-neutral-950 rounded-xl transition-all"
              >
                ← Return
              </button>
            )}
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-neutral-900/60 border border-neutral-800/80 flex items-center justify-center text-amber-500/90 shadow-lg shadow-amber-500/5">
                <Guitar className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-lg font-black tracking-[0.25em] text-neutral-100 font-serif">LUXE LUTHIERS</h1>
                <p className="text-[10px] text-neutral-500 font-mono tracking-widest uppercase mt-0.5">
                  Bespoke 3D {config.instrumentType.toUpperCase()} Configurator
                </p>
              </div>
          </div>
        </div>

        {/* Global Action buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={undo}
            disabled={!canUndo}
            title="Undo"
            className="p-2.5 rounded-xl border border-neutral-900 bg-neutral-950/40 text-neutral-400 hover:text-amber-500/90 hover:border-amber-500/25 disabled:opacity-20 disabled:pointer-events-none transition-all"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            onClick={redo}
            disabled={!canRedo}
            title="Redo"
            className="p-2.5 rounded-xl border border-neutral-900 bg-neutral-950/40 text-neutral-400 hover:text-amber-500/90 hover:border-amber-500/25 disabled:opacity-20 disabled:pointer-events-none transition-all"
          >
            <Redo2 className="w-4 h-4" />
          </button>

          <div className="w-[1px] h-6 bg-neutral-900 mx-1" />

          <button
            onClick={resetConfig}
            title="Reset to default build"
            className="flex items-center gap-2 px-3 py-2.5 text-xs font-mono font-bold rounded-xl border border-neutral-900 bg-neutral-950/40 text-neutral-400 hover:text-amber-500/90 hover:border-amber-500/25 transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">RESET</span>
          </button>

          <button
            onClick={handleShare}
            className={`flex items-center gap-2 px-4.5 py-2.5 text-xs font-mono font-bold rounded-xl border transition-all ${
              copied
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-500'
                : 'bg-neutral-950/40 border-neutral-900 text-neutral-400 hover:border-amber-500/30 hover:text-amber-500'
            }`}
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copied ? 'COPIED LINK' : 'SHARE URL'}</span>
          </button>
        </div>
      </header>

      {/* MAIN SINGLE-PAGE APP BODY */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">

        {/* LEFT COLUMN: THE CINEMATIC 3D SCREEN (Lg span 7) */}
        <section className="lg:col-span-7 xl:col-span-8 flex flex-col gap-4">

          {/* Main viewport */}
          <div className="flex-1 min-h-[450px] lg:min-h-0 h-full relative">
            <Guitar3DScene canvasRef={canvasRef} />
          </div>

          {/* Sub-viewport actions bar (Export PNG, PDF, developer GLB utility) */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-[#0a0a0d] border border-neutral-900 rounded-2xl shadow-xl">
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleExportImage}
                className="flex items-center gap-2 px-4 py-2.5 text-xs font-mono font-bold rounded-xl bg-neutral-950 border border-neutral-900 hover:border-amber-500/30 hover:text-amber-500 text-neutral-400 transition-all"
              >
                <Download className="w-3.5 h-3.5 text-neutral-500" />
                CAPTURE IMAGE
              </button>

              <button
                onClick={handleExportPDF}
                className="flex items-center gap-2 px-4 py-2.5 text-xs font-mono font-bold rounded-xl bg-neutral-950 border border-neutral-900 hover:border-amber-500/30 hover:text-amber-500 text-neutral-400 transition-all"
              >
                <FileText className="w-3.5 h-3.5 text-neutral-500" />
                EXPORT SPEC PDF
              </button>
            </div>

            <div className="group/dev relative">
              <button
                onClick={handleDownloadGLB}
                className="flex items-center gap-2 px-4 py-2.5 text-xs font-mono font-bold rounded-xl bg-amber-500/5 border border-amber-500/20 hover:bg-amber-500/10 text-amber-400 transition-all"
              >
                <Sparkles className="w-3.5 h-3.5" />
                EXPORT GLB
              </button>
              <div className="absolute right-0 bottom-full mb-2 w-56 hidden group-hover/dev:block bg-neutral-950 border border-neutral-800 text-[10px] text-neutral-400 p-2.5 rounded-lg shadow-2xl z-40">
                Exports the current customized setup as an optimized binary .glb file. Use this to save customized versions to `/public/models`.
              </div>
            </div>
          </div>
        </section>

        {/* RIGHT COLUMN: INTERACTIVE PRICE & CATEGORIES PANELS (Lg span 5) */}
        <section className="lg:col-span-5 xl:col-span-4 flex flex-col gap-5">

          {/* Price & Cost Breakdown Panel */}
          <div className="relative overflow-hidden bg-gradient-to-br from-[#0c0c0f] to-[#070709] border border-neutral-900 p-5 rounded-3xl shadow-[0_4px_30px_rgba(0,0,0,0.6)] flex flex-col gap-4">

            {/* Subtle Bronze accent highlight glow overlay */}
            <div className="absolute -top-12 -left-12 w-48 h-48 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-center justify-between z-10">
              <span className="text-xs font-mono font-bold tracking-widest text-neutral-500 uppercase">ESTIMATED VALUATION</span>
              <div className="group/cost relative flex items-center gap-1 cursor-pointer">
                <span className="text-[9px] font-mono text-amber-500/80 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-md font-bold tracking-wider hover:border-amber-500/60 transition-all">
                  VIEW COST BREAKDOWN
                </span>

                {/* Cost split breakdown tooltip on hover */}
                <div className="absolute right-0 top-full mt-2.5 w-72 hidden group-hover/cost:block bg-neutral-950 border border-neutral-800/80 p-4 rounded-2xl shadow-2xl z-30 transition-all">
                  <span className="block text-[10px] font-mono tracking-widest text-neutral-400 font-bold mb-2 uppercase">COST BREAKDOWN</span>
                  <div className="space-y-1.5 text-xs text-neutral-400">
                    <div className="flex justify-between font-mono">
                      <span>Base Luthier Instrument</span>
                      <span>${base.toLocaleString()}.00</span>
                    </div>
                    {breakdown.map((item, idx) => (
                      <div key={idx} className="flex justify-between font-mono border-t border-neutral-900 pt-1.5">
                        <span className="text-[11px] opacity-70">{item.category} ({item.name.split(' (')[0]})</span>
                        <span>+${item.price}.00</span>
                      </div>
                    ))}
                    <div className="flex justify-between font-bold text-neutral-100 border-t border-neutral-800 pt-2 font-mono">
                      <span>Total</span>
                      <span>${total.toLocaleString()}.00</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-baseline gap-1.5 z-10">
              <PriceCounter value={total} />
              <span className="text-[10px] font-mono text-amber-500 font-bold uppercase tracking-widest">USD</span>
            </div>
          </div>

          {/* Collapsible Panel Tabs */}
          <div className="flex items-stretch border-b border-neutral-900">
            <button
              onClick={() => setActiveTab('build')}
              className={`flex-1 py-3 text-center text-xs font-mono font-bold tracking-widest uppercase transition-all border-b ${
                activeTab === 'build'
                  ? 'border-amber-500/60 text-amber-500 font-black'
                  : 'border-transparent text-neutral-500 hover:text-neutral-300'
              }`}
            >
              SPECIFICATIONS
            </button>
            <button
              onClick={() => setActiveTab('saved')}
              className={`flex-1 py-3 text-center text-xs font-mono font-bold tracking-widest uppercase transition-all border-b ${
                activeTab === 'saved'
                  ? 'border-amber-500/60 text-amber-500 font-black'
                  : 'border-transparent text-neutral-500 hover:text-neutral-300'
              }`}
            >
              SAVED ARCHIVE ({Object.keys(savedBuilds).length})
            </button>
          </div>

          <div className="flex-1 overflow-y-auto max-h-[500px] lg:max-h-[calc(100vh-320px)] pr-1">
            {activeTab === 'build' ? (
              <OptionsControlPanel />
            ) : (
              <div className="space-y-4">
                {/* Save Current Build Form */}
                <form onSubmit={handleSaveBuild} className="p-4 bg-neutral-950/40 border border-neutral-900 rounded-2xl flex flex-col gap-3">
                  <span className="block text-[10px] font-mono font-bold tracking-widest text-neutral-500 uppercase">ARCHIVE CURRENT SPEC</span>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. AMBER CUSTOM SC"
                      value={slotInput}
                      onChange={(e) => setSlotInput(e.target.value)}
                      maxLength={24}
                      className="flex-1 bg-neutral-950 border border-neutral-900 rounded-xl px-3 py-2 text-xs text-neutral-200 font-mono focus:outline-none focus:border-amber-500/50"
                    />
                    <button
                      type="submit"
                      disabled={!slotInput.trim()}
                      className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-mono font-bold bg-amber-500 text-neutral-950 hover:bg-amber-400 disabled:opacity-20 disabled:pointer-events-none rounded-xl transition-all"
                    >
                      <Save className="w-3.5 h-3.5" />
                      SAVE
                    </button>
                  </div>
                </form>

                {/* List saved slots */}
                {Object.keys(savedBuilds).length === 0 ? (
                  <div className="text-center py-12 text-neutral-500 text-xs">
                    No custom builds saved yet. Create a beautiful build and save it to your local browser!
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-2.5">
                    {Object.entries(savedBuilds).map(([slotName, savedConfig]) => {
                      const savedPrice = calculateTotalPrice(savedConfig).total;
                      const isCurrent = JSON.stringify(config) === JSON.stringify(savedConfig);

                      return (
                        <div
                          key={slotName}
                          className={`p-4 rounded-2xl border flex items-center justify-between gap-3 bg-neutral-900/10 transition-all ${
                            isCurrent ? 'border-neutral-200/40 bg-neutral-800/10' : 'border-neutral-800/60'
                          }`}
                        >
                          <div>
                            <span className="block text-xs font-bold text-neutral-200 truncate max-w-[150px]">{slotName}</span>
                            <span className="block text-[10px] font-mono text-neutral-400 mt-0.5">${savedPrice.toLocaleString()}.00</span>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => loadBuild(slotName)}
                              className="px-3 py-1.5 text-[11px] font-mono font-bold border border-neutral-800 hover:border-amber-500/30 hover:text-amber-500 bg-neutral-950 text-neutral-400 rounded-lg transition-all"
                            >
                              LOAD
                            </button>
                            <button
                              onClick={() => deleteBuild(slotName)}
                              className="p-1.5 text-neutral-600 hover:text-red-400 border border-transparent hover:border-neutral-900 rounded-lg transition-all"
                              title="Delete build slot"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};
