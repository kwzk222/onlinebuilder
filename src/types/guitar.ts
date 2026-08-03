export interface Option {
  id: string;
  name: string;
  priceDelta: number;
  description?: string;
}

export type InstrumentType = 'guitar' | 'bass';
export type BodyShape = 'modern_st' | 'single_cut' | 'offset';
export type BodyWood = 'mahogany' | 'swamp_ash' | 'alder';
export type NeckWood = 'roasted_maple' | 'mahogany' | 'walnut';
export type FretboardWood = 'maple' | 'rosewood' | 'ebony';
export type PickupsLayout = 'hss' | 'hh' | 'sss';
export type HardwareColor = 'chrome' | 'gold' | 'cosmo_black';
export type PickguardStyle = 'three_ply_black' | 'tortoiseshell' | 'white_pearl' | 'no_pickguard';

export type FinishType = 'solid' | 'metallic' | 'translucent' | 'matte' | 'satin';

export type MeasurementSystem = 'metric' | 'imperial';
export type NeckProfile = 'teardrop' | 'scooped' | 'trapezoid';

export type RichliteType =
  | 'black_diamond'
  | 'maple_valley'
  | 'grays_harbor'
  | 'rosedale'
  | 'redstone'
  | 'browns_point'
  | 'chocolate_glacier'
  | 'blue_canyon'
  | 'columbia'
  | 'luna'
  | 'eldorado'
  | 'dragontail'
  | 'glacier'
  | 'forbidden'
  | 'sloan';

export type EdoFretlessMode = 'standard_12_edo' | 'microtonal_19_edo' | 'microtonal_31_edo' | 'fretless';
export type InlayStyle = 'none' | 'dots' | 'blocks' | 'custom';

export interface ExtraFretboardConfig {
  id: string; // unique identifier
  material: RichliteType;
  inlay: InlayStyle;
  edoMode: EdoFretlessMode;
  scalloped: boolean;
  scallopedStartFret: number;
  numberOfFrets: number;
}

export type SeatedPosition =
  | 'classical_chair'
  | 'classical_left_leg_stool'
  | 'standard'
  | 'standard_right_leg_stool'
  | 'right_leg_strap';

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
  instrumentType: InstrumentType;
  bodyShape: BodyShape;
  bodyWood: BodyWood;
  neckWood: NeckWood;
  fretboardWood: FretboardWood;
  pickupsLayout: PickupsLayout;
  hardwareColor: HardwareColor;
  pickguardStyle: PickguardStyle;
  finishPreset: string; // id of the finish preset

  // Premium Custom Specifications Addition
  measurementSystem: MeasurementSystem;

  // Neck Options
  neckProfile: NeckProfile;
  relaxedHandMeasurement: number; // in mm or inches based on measurementSystem

  // Fretboard Options
  fretboardMaterial: RichliteType;
  modularFretboard: boolean;
  radiusNut: string;       // compound radius start (e.g. "9.5" or "241")
  radiusLastFret: string;  // compound radius end (e.g. "16" or "406")
  edoMode: EdoFretlessMode;
  numberOfFrets: number;
  scalloped: boolean;
  scallopedStartFret: number;
  fretboardInlay: InlayStyle;
  extraFretboards: ExtraFretboardConfig[];

  // Body Ergonomics Recommendation Inputs
  seatedPosition: SeatedPosition;
  neckAngle: number; // degrees, default 0

  // Hardware Expanded Choices
  bridgeType: string;
  tunerType: string;
  knobType: string;
  nutType: string;

  // Electronics Expanded Options
  activePreamp: boolean;
  toneCapacitor: string;
}

export interface CostBreakdownItem {
  category: string;
  name: string;
  price: number;
}
export interface FretboardMaterialOption {
  id: RichliteType;
  name: string;
  description: string;
  color: string;
}
