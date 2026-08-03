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

export type InlayStyle = 'none' | 'dots' | 'blocks' | 'custom';

export interface ExtraFretboardConfig {
  id: string;
  material: RichliteType;
  inlay: InlayStyle;
  edoValue: number; // customizable divisions (e.g. 12, 19, 31, etc)
  isFretless: boolean;
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

  // Premium Custom Specifications
  measurementSystem: MeasurementSystem;

  // Neck Options
  neckProfile: NeckProfile;
  relaxedHandMeasurement: number; // input
  customThicknessInput: string;   // override string to type any custom thickness
  useCustomThickness: boolean;

  // Fretboard Options
  fretboardMaterial: RichliteType;
  modularFretboard: boolean;
  radiusNut: string;
  radiusLastFret: string;
  edoValue: number; // customizable divisions input, default 12
  isFretless: boolean;
  numberOfFrets: number;
  scalloped: boolean;
  scallopedStartFret: number;
  fretboardInlay: InlayStyle;
  extraFretboards: ExtraFretboardConfig[];

  // Scale length inputs (Supports multiscale/fanned frets if desired)
  multiscaleEnabled: boolean;
  bassScaleLength: number;   // e.g. 25.5 (guitar) / 34.0 (bass)
  trebleScaleLength: number; // e.g. 25.0 / 33.0

  // Body Posture & Ergonomics
  seatedPosition: SeatedPosition;
  neckAngle: number; // degrees, default 0, strict range 0 to 60

  // Hardware additions
  bridgeType: string;
  tunerType: string;
  knobType: string;
  nutType: string;

  // Electronics additions
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
