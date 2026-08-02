import type { Option, FinishPresetOption, BodyShape, BodyWood, NeckWood, FretboardWood, PickupsLayout, HardwareColor, PickguardStyle } from '../types/guitar';

export const BASE_PRICE = 1500;

export const BODY_SHAPES: Record<BodyShape, Option> = {
  modern_st: {
    id: 'modern_st',
    name: 'Modern ST (Double Cut)',
    priceDelta: 0,
    description: 'Sleek double-cutaway silhouette designed for maximum fret access and ergonomic comfort.',
  },
  single_cut: {
    id: 'single_cut',
    name: 'Single Cut (SC)',
    priceDelta: 100,
    description: 'Timeless single-cutaway design with heavy sustain and a powerful, resonant body profile.',
  },
  offset: {
    id: 'offset',
    name: 'Offset (Jazzmaster Style)',
    priceDelta: 150,
    description: 'Retro-modern offset design offering perfect physical balance and alternative-rock styling.',
  },
};

export const BODY_WOODS: Record<BodyWood, Option & { color: string; grainScale: number }> = {
  mahogany: {
    id: 'mahogany',
    name: 'Mahogany',
    priceDelta: 0,
    color: '#5c2d16',
    grainScale: 1.0,
    description: 'Dense, warm wood that provides incredible low-end response and singing mid-range sustain.',
  },
  swamp_ash: {
    id: 'swamp_ash',
    name: 'Swamp Ash',
    priceDelta: 50,
    color: '#dfcfb7',
    grainScale: 1.5,
    description: 'Highly resonant, lightweight wood with striking, wild grain lines and sweet, airy highs.',
  },
  alder: {
    id: 'alder',
    name: 'Alder',
    priceDelta: 50,
    color: '#e2ccac',
    grainScale: 0.8,
    description: 'Classic choice with a full, balanced frequency response and rich, clean resonance.',
  },
};

export const NECK_WOODS: Record<NeckWood, Option & { color: string }> = {
  roasted_maple: {
    id: 'roasted_maple',
    name: 'Roasted Maple',
    priceDelta: 100,
    color: '#b07a4e',
    description: 'Thermally treated maple for unparalleled stability, moisture resistance, and a gorgeous dark tint.',
  },
  mahogany: {
    id: 'mahogany',
    name: 'Mahogany',
    priceDelta: 0,
    color: '#633118',
    description: 'Traditional neck wood offering solid tuning stability and a warm acoustic connection to the body.',
  },
  walnut: {
    id: 'walnut',
    name: 'Walnut',
    priceDelta: 0,
    color: '#4e3b31',
    description: 'Dense, dark-grained hardwood offering crisp top-end attack and a modern aesthetic appeal.',
  },
};

export const FRETBOARD_WOODS: Record<FretboardWood, Option & { color: string }> = {
  maple: {
    id: 'maple',
    name: 'Maple',
    priceDelta: 0,
    color: '#ebd1ad',
    description: 'Bright sounding and visually striking, offering snappy attack and lightning-fast playability.',
  },
  rosewood: {
    id: 'rosewood',
    name: 'Rosewood',
    priceDelta: 0,
    color: '#422c1e',
    description: 'Ultra-smooth, oily feel that naturally softens highs and adds beautiful dark warmth to notes.',
  },
  ebony: {
    id: 'ebony',
    name: 'Ebony (Premium)',
    priceDelta: 80,
    color: '#1a1919',
    description: 'Crisp attack, luxurious jet-black appearance, and a dense glass-like surface feel.',
  },
};

export const PICKUPS_LAYOUTS: Record<PickupsLayout, Option> = {
  hss: {
    id: 'hss',
    name: 'HSS (Humbucker / Single / Single)',
    priceDelta: 100,
    description: 'Ultimate versatility: scream with the bridge humbucker or spark with pure single-coils.',
  },
  hh: {
    id: 'hh',
    name: 'HH (Dual Humbuckers)',
    priceDelta: 150,
    description: 'High output, noise-canceling humbuckers optimized for powerful riffs and thick, heavy tones.',
  },
  sss: {
    id: 'sss',
    name: 'SSS (Three Single Coils)',
    priceDelta: 50,
    description: 'Vintage-voiced configuration offering clean chime, woody quack, and transparent single-coil tone.',
  },
};

export const HARDWARE_COLORS: Record<HardwareColor, Option & { hex: string }> = {
  chrome: {
    id: 'chrome',
    name: 'Chrome Finish',
    priceDelta: 0,
    hex: '#e1e4e6',
    description: 'Traditional, brilliant mirror-chrome plating that matches everything.',
  },
  gold: {
    id: 'gold',
    name: 'Premium Gold Plated',
    priceDelta: 120,
    hex: '#e2ba5e',
    description: 'Prestigious, deep gold finish that exudes luxury and premium craftsmanship.',
  },
  cosmo_black: {
    id: 'cosmo_black',
    name: 'Cosmo Black (Smoke Chrome)',
    priceDelta: 90,
    hex: '#2e2e30',
    description: 'Sleek, smoky dark metallic nickel that gives an aggressive, futuristic edge.',
  },
};

export const PICKGUARD_STYLES: Record<PickguardStyle, Option & { type: 'solid' | 'pattern' | 'none'; color?: string }> = {
  three_ply_black: {
    id: 'three_ply_black',
    name: '3-Ply Tuxedo Black',
    priceDelta: 0,
    type: 'solid',
    color: '#121212',
    description: 'Classy black-white-black multi-layer guard that contrasts beautifully.',
  },
  tortoiseshell: {
    id: 'tortoiseshell',
    name: 'Vintage Tortoiseshell',
    priceDelta: 0,
    type: 'pattern',
    color: '#4a1504',
    description: 'Luxurious amber-brown tortoiseshell pattern for high-end boutique appeal.',
  },
  white_pearl: {
    id: 'white_pearl',
    name: 'White Mother of Pearl',
    priceDelta: 0,
    type: 'pattern',
    color: '#eae6df',
    description: 'Glistening, iridescent 3D pearl texture that reflects light beautifully.',
  },
  no_pickguard: {
    id: 'no_pickguard',
    name: 'No Pickguard (Bare Top)',
    priceDelta: 0,
    type: 'none',
    description: 'Shows off maximum wood grain and beautiful finishes without hardware clutter.',
  },
};

export const FINISH_PRESETS: FinishPresetOption[] = [
  {
    id: 'two_color_sunburst',
    name: '2-Color Sunburst',
    priceDelta: 100, // Translucent finish
    type: 'translucent',
    color: '#ffc107',         // Warm amber center
    colorSecondary: '#3e1c07', // Dark tobacco brown edge
    clearcoat: 1.0,
    roughness: 0.1,
    metalness: 0.05,
    transmission: 0.6,
    glossiness: 1.0,
    description: 'Deep amber-to-tobacco gloss gradient, showing the organic wood grain underneath.',
  },
  {
    id: 'translucent_blue',
    name: 'Translucent Sapphire Blue',
    priceDelta: 100, // Translucent finish
    type: 'translucent',
    color: '#0d47a1',
    clearcoat: 1.0,
    roughness: 0.08,
    metalness: 0.1,
    transmission: 0.7,
    glossiness: 1.0,
    description: 'Stunning gloss ocean lacquer that deepens in intensity over flamed maple or ash grain.',
  },
  {
    id: 'gloss_cherry',
    name: 'Gloss Cherry Red',
    priceDelta: 100, // Translucent finish
    type: 'translucent',
    color: '#c62828',
    clearcoat: 1.0,
    roughness: 0.1,
    metalness: 0.05,
    transmission: 0.65,
    glossiness: 1.0,
    description: 'Rich translucent crimson cherry finish. A historical staple for high-end electric models.',
  },
  {
    id: 'matte_black',
    name: 'Matte Stealth Black',
    priceDelta: 50, // Matte finish
    type: 'matte',
    color: '#1a1a1a',
    clearcoat: 0.0,
    roughness: 0.85,
    metalness: 0.1,
    glossiness: 0.0,
    description: 'Zero reflections, absolute sleekness. Ultra-smooth satin feel with a stealth look.',
  },
  {
    id: 'olympic_white',
    name: 'Olympic White',
    priceDelta: 0, // Standard finish
    type: 'solid',
    color: '#f5f5f0',
    clearcoat: 0.9,
    roughness: 0.15,
    metalness: 0.0,
    glossiness: 0.9,
    description: 'Classy, creamy white solid gloss coat. Understated, elegant, and timeless.',
  },
  {
    id: 'butterscotch_blonde',
    name: 'Butterscotch Blonde',
    priceDelta: 50, // Satin finish
    type: 'satin',
    color: '#ebd197',
    clearcoat: 0.3,
    roughness: 0.35,
    metalness: 0.0,
    transmission: 0.35, // Semi-translucent
    glossiness: 0.4,
    description: 'Semi-translucent warm butterscotch color with a smooth satin-matte topcoat.',
  },
  {
    id: 'metallic_gold',
    name: 'Metallic Gold Top',
    priceDelta: 150, // Metallic finish
    type: 'metallic',
    color: '#d4af37',
    clearcoat: 1.0,
    roughness: 0.18,
    metalness: 0.85,
    glossiness: 1.0,
    description: 'Brilliant metallic gold finish inspired by legendary 1950s gold-top models.',
  },
  {
    id: 'shell_pink',
    name: 'Shell Pink',
    priceDelta: 50, // Satin finish
    type: 'satin',
    color: '#f8c2ca',
    clearcoat: 0.2,
    roughness: 0.4,
    metalness: 0.0,
    glossiness: 0.3,
    description: 'A classic 60s pastel shade in a modern, ultra-soft satin tactile finish.',
  },
  {
    id: 'sonic_blue',
    name: 'Sonic Blue',
    priceDelta: 0, // Standard finish
    type: 'solid',
    color: '#b0e0e6',
    clearcoat: 0.9,
    roughness: 0.12,
    metalness: 0.0,
    glossiness: 0.9,
    description: 'Beautifully light and nostalgic pastel blue finish in brilliant high-gloss.',
  },
  {
    id: 'candy_apple_red',
    name: 'Candy Apple Red',
    priceDelta: 150, // Metallic/Gloss
    type: 'metallic',
    color: '#b71c1c',
    clearcoat: 1.0,
    roughness: 0.1,
    metalness: 0.7,
    glossiness: 1.0,
    description: 'Multi-layered candy metallic cherry under a high-gloss, ultra-reflective clearcoat.',
  },
  {
    id: 'inca_silver',
    name: 'Inca Silver Metallic',
    priceDelta: 150, // Metallic finish
    type: 'metallic',
    color: '#9e9e9e',
    clearcoat: 0.9,
    roughness: 0.2,
    metalness: 0.8,
    glossiness: 0.9,
    description: 'Warm silver-gray metallic flake coating with sleek, tech-forward styling.',
  },
  {
    id: 'fiesta_burst',
    name: 'Fiesta Sunburst',
    priceDelta: 100, // Translucent
    type: 'translucent',
    color: '#fbc02d',         // Yellow center
    colorSecondary: '#e64a19', // Vibrant red middle
    colorTertiary: '#212121',  // Deep black edges
    clearcoat: 1.0,
    roughness: 0.09,
    metalness: 0.05,
    transmission: 0.55,
    glossiness: 1.0,
    description: 'Striking 3-color cherry-to-yellow sunburst blending beautifully over natural wood grain.',
  },
];

export const WOOD_TEXTURES_CATALOG = [
  { id: 'mahogany', name: 'Mahogany' },
  { id: 'flamed_maple', name: 'Flamed Maple' },
  { id: 'swamp_ash', name: 'Swamp Ash' },
  { id: 'rosewood', name: 'Rosewood' },
  { id: 'walnut', name: 'Walnut' },
  { id: 'ebony', name: 'Ebony' },
];
