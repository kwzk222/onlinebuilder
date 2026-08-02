export interface Option {
  id: string;
  name: string;
  priceDelta: number;
  description?: string;
}

export type BodyShape = 'modern_st' | 'single_cut' | 'offset';
export type BodyWood = 'mahogany' | 'swamp_ash' | 'alder';
export type NeckWood = 'roasted_maple' | 'mahogany' | 'walnut';
export type FretboardWood = 'maple' | 'rosewood' | 'ebony';
export type PickupsLayout = 'hss' | 'hh' | 'sss';
export type HardwareColor = 'chrome' | 'gold' | 'cosmo_black';
export type PickguardStyle = 'three_ply_black' | 'tortoiseshell' | 'white_pearl' | 'no_pickguard';

export type FinishType = 'solid' | 'metallic' | 'translucent' | 'matte' | 'satin';

export interface FinishPresetOption extends Option {
  type: FinishType;
  color: string;           // Base hex color
  colorSecondary?: string;  // For sunburst or gradient
  colorTertiary?: string;   // For 3-color sunburst
  clearcoat: number;        // 0 to 1
  roughness: number;        // 0 to 1
  metalness: number;        // 0 to 1
  transmission?: number;    // For translucent lacquer layering
  glossiness?: number;      // General styling parameter
}

export interface GuitarConfig {
  bodyShape: BodyShape;
  bodyWood: BodyWood;
  neckWood: NeckWood;
  fretboardWood: FretboardWood;
  pickupsLayout: PickupsLayout;
  hardwareColor: HardwareColor;
  pickguardStyle: PickguardStyle;
  finishPreset: string; // id of the finish preset
}

export interface CostBreakdownItem {
  category: string;
  name: string;
  price: number;
}
