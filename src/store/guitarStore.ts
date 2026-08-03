import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import LZString from 'lz-string';
import type { GuitarConfig, BodyShape, BodyWood, NeckWood, FretboardWood, PickupsLayout, HardwareColor, PickguardStyle } from '../types/guitar';
import { BASE_PRICE, BODY_SHAPES, BODY_WOODS, NECK_WOODS, FRETBOARD_WOODS, PICKUPS_LAYOUTS, HARDWARE_COLORS, PICKGUARD_STYLES, FINISH_PRESETS } from '../constants/catalog';

interface StateHistoryItem {
  config: GuitarConfig;
}

interface GuitarStore {
  config: GuitarConfig;
  history: StateHistoryItem[];
  historyIndex: number;

  // Actions
  updateConfig: (updater: Partial<GuitarConfig>) => void;
  undo: () => void;
  redo: () => void;
  resetConfig: () => void;

  // Save/Load Slots
  savedBuilds: Record<string, GuitarConfig>;
  saveBuild: (slotName: string) => void;
  loadBuild: (slotName: string) => void;
  deleteBuild: (slotName: string) => void;

  // Sharing utils
  getShareUrl: () => string;
  loadFromShareCode: (code: string) => boolean;
}

const DEFAULT_CONFIG: GuitarConfig = {
  instrumentType: 'guitar',
  bodyShape: 'modern_st',
  bodyWood: 'alder',
  neckWood: 'roasted_maple',
  fretboardWood: 'rosewood',
  pickupsLayout: 'hss',
  hardwareColor: 'chrome',
  pickguardStyle: 'three_ply_black',
  finishPreset: 'two_color_sunburst',
};

export const useGuitarStore = create<GuitarStore>()(
  persist(
    (set, get) => ({
      config: { ...DEFAULT_CONFIG },
      history: [{ config: { ...DEFAULT_CONFIG } }],
      historyIndex: 0,
      savedBuilds: {},

      updateConfig: (updater) => {
        const { config, history, historyIndex } = get();
        const newConfig = { ...config, ...updater };

        // Wipe any redo history forward of current index and append new state
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push({ config: newConfig });

        set({
          config: newConfig,
          history: newHistory,
          historyIndex: newHistory.length - 1,
        });
      },

      undo: () => {
        const { history, historyIndex } = get();
        if (historyIndex > 0) {
          const nextIndex = historyIndex - 1;
          set({
            historyIndex: nextIndex,
            config: { ...history[nextIndex].config },
          });
        }
      },

      redo: () => {
        const { history, historyIndex } = get();
        if (historyIndex < history.length - 1) {
          const nextIndex = historyIndex + 1;
          set({
            historyIndex: nextIndex,
            config: { ...history[nextIndex].config },
          });
        }
      },

      resetConfig: () => {
        const { history, historyIndex } = get();
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push({ config: { ...DEFAULT_CONFIG } });

        set({
          config: { ...DEFAULT_CONFIG },
          history: newHistory,
          historyIndex: newHistory.length - 1,
        });
      },

      saveBuild: (slotName) => {
        const { config, savedBuilds } = get();
        set({
          savedBuilds: {
            ...savedBuilds,
            [slotName]: { ...config },
          },
        });
      },

      loadBuild: (slotName) => {
        const { savedBuilds, history, historyIndex } = get();
        const selectedBuild = savedBuilds[slotName];
        if (selectedBuild) {
          const newHistory = history.slice(0, historyIndex + 1);
          newHistory.push({ config: { ...selectedBuild } });
          set({
            config: { ...selectedBuild },
            history: newHistory,
            historyIndex: newHistory.length - 1,
          });
        }
      },

      deleteBuild: (slotName) => {
        const { savedBuilds } = get();
        const updated = { ...savedBuilds };
        delete updated[slotName];
        set({ savedBuilds: updated });
      },

      getShareUrl: () => {
        const { config } = get();
        const jsonStr = JSON.stringify(config);
        const compressed = LZString.compressToEncodedURIComponent(jsonStr);
        const url = new URL(window.location.href);
        url.searchParams.set('b', compressed);
        return url.toString();
      },

      loadFromShareCode: (code) => {
        try {
          const decompressed = LZString.decompressFromEncodedURIComponent(code);
          if (decompressed) {
            const parsed = JSON.parse(decompressed) as Partial<GuitarConfig>;

            // Validate keys to prevent injecting weird states
            const validatedConfig: GuitarConfig = {
              instrumentType: (parsed.instrumentType === 'bass' || parsed.instrumentType === 'guitar') ? parsed.instrumentType : DEFAULT_CONFIG.instrumentType,
              bodyShape: (BODY_SHAPES[parsed.bodyShape as BodyShape] ? parsed.bodyShape : DEFAULT_CONFIG.bodyShape) as BodyShape,
              bodyWood: (BODY_WOODS[parsed.bodyWood as BodyWood] ? parsed.bodyWood : DEFAULT_CONFIG.bodyWood) as BodyWood,
              neckWood: (NECK_WOODS[parsed.neckWood as NeckWood] ? parsed.neckWood : DEFAULT_CONFIG.neckWood) as NeckWood,
              fretboardWood: (FRETBOARD_WOODS[parsed.fretboardWood as FretboardWood] ? parsed.fretboardWood : DEFAULT_CONFIG.fretboardWood) as FretboardWood,
              pickupsLayout: (PICKUPS_LAYOUTS[parsed.pickupsLayout as PickupsLayout] ? parsed.pickupsLayout : DEFAULT_CONFIG.pickupsLayout) as PickupsLayout,
              hardwareColor: (HARDWARE_COLORS[parsed.hardwareColor as HardwareColor] ? parsed.hardwareColor : DEFAULT_CONFIG.hardwareColor) as HardwareColor,
              pickguardStyle: (PICKGUARD_STYLES[parsed.pickguardStyle as PickguardStyle] ? parsed.pickguardStyle : DEFAULT_CONFIG.pickguardStyle) as PickguardStyle,
              finishPreset: FINISH_PRESETS.some(f => f.id === parsed.finishPreset) ? (parsed.finishPreset as string) : DEFAULT_CONFIG.finishPreset,
            };

            const { history, historyIndex } = get();
            const newHistory = history.slice(0, historyIndex + 1);
            newHistory.push({ config: validatedConfig });

            set({
              config: validatedConfig,
              history: newHistory,
              historyIndex: newHistory.length - 1,
            });
            return true;
          }
        } catch (e) {
          console.error("Error parsing share URL code:", e);
        }
        return false;
      },
    }),
    {
      name: 'luxe-guitar-configurator-store',
      partialize: (state) => ({
        config: state.config,
        savedBuilds: state.savedBuilds,
      }),
    }
  )
);

// Price calculation helper hook or utility
export function calculateTotalPrice(config: GuitarConfig): {
  total: number;
  base: number;
  breakdown: { category: string; name: string; price: number }[];
} {
  const breakdown: { category: string; name: string; price: number }[] = [];

  const shape = BODY_SHAPES[config.bodyShape];
  if (shape && shape.priceDelta > 0) {
    breakdown.push({ category: 'Body Shape', name: shape.name, price: shape.priceDelta });
  }

  const wood = BODY_WOODS[config.bodyWood];
  if (wood && wood.priceDelta > 0) {
    breakdown.push({ category: 'Body Wood', name: wood.name, price: wood.priceDelta });
  }

  const neck = NECK_WOODS[config.neckWood];
  if (neck && neck.priceDelta > 0) {
    breakdown.push({ category: 'Neck Wood', name: neck.name, price: neck.priceDelta });
  }

  const fretboard = FRETBOARD_WOODS[config.fretboardWood];
  if (fretboard && fretboard.priceDelta > 0) {
    breakdown.push({ category: 'Fretboard Wood', name: fretboard.name, price: fretboard.priceDelta });
  }

  const pickups = PICKUPS_LAYOUTS[config.pickupsLayout];
  if (pickups && pickups.priceDelta > 0) {
    breakdown.push({ category: 'Pickups Layout', name: pickups.name, price: pickups.priceDelta });
  }

  const hardware = HARDWARE_COLORS[config.hardwareColor];
  if (hardware && hardware.priceDelta > 0) {
    breakdown.push({ category: 'Hardware Color', name: hardware.name, price: hardware.priceDelta });
  }

  const finish = FINISH_PRESETS.find(f => f.id === config.finishPreset);
  if (finish && finish.priceDelta > 0) {
    breakdown.push({ category: 'Finish Preset', name: finish.name, price: finish.priceDelta });
  }

  const totalDeltas = breakdown.reduce((sum, item) => sum + item.price, 0);

  return {
    total: BASE_PRICE + totalDeltas,
    base: BASE_PRICE,
    breakdown,
  };
}
