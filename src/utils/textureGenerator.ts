import * as THREE from 'three';

// Procedural Wood Grain Generator
// Generates high-resolution organic wood grains using a deterministic sine-wave noise approach on HTML5 Canvas.
// Returns an object containing the diffuse (color) and bump (tactile roughness) CanvasTextures.

interface WoodTextureMaps {
  diffuse: THREE.CanvasTexture;
  bump: THREE.CanvasTexture;
}

// Simple seeded/pseudo-random noise for seamless/organic waves
function noise2D(x: number, y: number): number {
  const n = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453123;
  return n - Math.floor(n);
}

// Simple bilinear-filtered value noise for wood grains
function smoothNoise(x: number, y: number): number {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const fx = x - ix;
  const fy = y - iy;

  // Fade curves
  const ux = fx * fx * (3.0 - 2.0 * fx);
  const uy = fy * fy * (3.0 - 2.0 * fy);

  // Four corners
  const a = noise2D(ix, iy);
  const b = noise2D(ix + 1, iy);
  const c = noise2D(ix, iy + 1);
  const d = noise2D(ix + 1, iy + 1);

  // Interpolate
  return a * (1 - ux) * (1 - uy) +
         b * ux * (1 - uy) +
         c * (1 - ux) * uy +
         d * ux * uy;
}

// Fractional Brownian Motion for complex details
function fbm(x: number, y: number, octaves = 4): number {
  let value = 0.0;
  let amplitude = 0.5;
  let frequency = 1.0;
  for (let i = 0; i < octaves; i++) {
    value += amplitude * smoothNoise(x * frequency, y * frequency);
    frequency *= 2.0;
    amplitude *= 0.5;
  }
  return value;
}

export function generateWoodTexture(
  type: 'mahogany' | 'flamed_maple' | 'swamp_ash' | 'rosewood' | 'walnut' | 'ebony' | 'alder',
  width = 512,
  height = 512
): WoodTextureMaps {
  const diffuseCanvas = document.createElement('canvas');
  diffuseCanvas.width = width;
  diffuseCanvas.height = height;
  const diffuseCtx = diffuseCanvas.getContext('2d')!;

  const bumpCanvas = document.createElement('canvas');
  bumpCanvas.width = width;
  bumpCanvas.height = height;
  const bumpCtx = bumpCanvas.getContext('2d')!;

  const diffuseImgData = diffuseCtx.createImageData(width, height);
  const bumpImgData = bumpCtx.createImageData(width, height);

  // Define properties based on the wood species
  let baseColor = { r: 139, g: 69, b: 19 }; // Default Mahogany
  let grainColor = { r: 70, g: 30, b: 10 };
  let grainTurbulence = 4.0;
  let isFlame = false;

  switch (type) {
    case 'mahogany':
      baseColor = { r: 110, g: 45, b: 22 };
      grainColor = { r: 60, g: 20, b: 8 };
      grainTurbulence = 2.0;
      break;
    case 'flamed_maple':
      baseColor = { r: 242, g: 220, b: 175 };
      grainColor = { r: 215, g: 185, b: 135 };
      grainTurbulence = 1.0;
      isFlame = true;
      break;
    case 'swamp_ash':
      baseColor = { r: 228, g: 206, b: 173 };
      grainColor = { r: 115, g: 82, b: 49 };
      grainTurbulence = 12.0;
      break;
    case 'rosewood':
      baseColor = { r: 78, g: 45, b: 31 };
      grainColor = { r: 35, g: 15, b: 10 };
      grainTurbulence = 6.0;
      break;
    case 'walnut':
      baseColor = { r: 84, g: 61, b: 48 };
      grainColor = { r: 40, g: 28, b: 21 };
      grainTurbulence = 5.0;
      break;
    case 'ebony':
      baseColor = { r: 24, g: 24, b: 25 };
      grainColor = { r: 12, g: 12, b: 13 };
      grainTurbulence = 1.5;
      break;
    case 'alder':
      baseColor = { r: 226, g: 204, b: 172 };
      grainColor = { r: 180, g: 150, b: 120 };
      grainTurbulence = 3.0;
      break;
  }

  // Generate pixels
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;

      // Transform coordinates
      const nx = x / width;
      const ny = y / height;

      // Primary wood rings/stripes using radial-sine calculation or layered sine function
      // A typical wood grain uses coordinates perturbed by a low-frequency noise
      const perturbation = fbm(nx * 5, ny * 5, 4) * grainTurbulence;

      let grainValue = 0;
      if (type === 'swamp_ash') {
        // Swamp ash has very bold, contrasting, flowing grain lines
        const wave = Math.sin((ny * 3.5 + perturbation) * Math.PI * 2);
        grainValue = Math.pow((wave + 1) * 0.5, 4); // sharp peaks
      } else if (type === 'mahogany') {
        // Mahogany has uniform, finely textured pores
        const wave = Math.sin((nx * 15 + perturbation * 0.5) * Math.PI);
        grainValue = (wave + 1) * 0.5 * 0.4 + smoothNoise(nx * 100, ny * 100) * 0.6;
      } else if (type === 'ebony') {
        // Ebony has very straight, ultra-dense subtle lines
        const wave = Math.sin((nx * 40 + perturbation * 0.1) * Math.PI);
        grainValue = Math.pow((wave + 1) * 0.5, 8) * 0.8;
      } else {
        // Standard high-quality wood grain
        const wave = Math.sin((nx * 6 + perturbation) * Math.PI);
        grainValue = (wave + 1) * 0.5;
      }

      // Special overlay for Flame Maple (tiger stripes)
      let flameMultiplier = 1.0;
      if (isFlame) {
        // Flamed maple stripes perpendicular to the vertical axis, modulated by noise
        const flameWave = Math.sin(ny * 45 + fbm(nx * 10, ny * 10, 2) * 2.0);
        flameMultiplier = 0.75 + ((flameWave + 1) * 0.5) * 0.25;
      }

      // Clamp grainValue to [0, 1]
      grainValue = Math.min(Math.max(grainValue, 0), 1);

      // Interpolate colors
      let r = baseColor.r * (1 - grainValue) + grainColor.r * grainValue;
      let g = baseColor.g * (1 - grainValue) + grainColor.g * grainValue;
      let b = baseColor.b * (1 - grainValue) + grainColor.b * grainValue;

      // Apply flame maple stripes to color
      r *= flameMultiplier;
      g *= flameMultiplier;
      b *= flameMultiplier;

      // Add micro-noise texture for realism (pores)
      const microNoise = (noise2D(x, y) - 0.5) * 8;
      r = Math.min(Math.max(r + microNoise, 0), 255);
      g = Math.min(Math.max(g + microNoise, 0), 255);
      b = Math.min(Math.max(b + microNoise, 0), 255);

      // Write Diffuse Texture
      diffuseImgData.data[idx] = r;
      diffuseImgData.data[idx + 1] = g;
      diffuseImgData.data[idx + 2] = b;
      diffuseImgData.data[idx + 3] = 255; // Alpha

      // Write Bump Map Texture
      // We convert grain value and flame details to a beautiful grayscale bump map
      // Pores/dark lines are recessed, wood meat is raised
      let bumpVal = (1.0 - grainValue) * 255;
      if (isFlame) {
        bumpVal = bumpVal * 0.7 + (flameMultiplier) * 0.3 * 255;
      }

      // Add fine pore scratches for tactile finish
      const fineScratches = smoothNoise(nx * 300, ny * 300) * 15;
      bumpVal = Math.min(Math.max(bumpVal - fineScratches, 0), 255);

      bumpImgData.data[idx] = bumpVal;
      bumpImgData.data[idx + 1] = bumpVal;
      bumpImgData.data[idx + 2] = bumpVal;
      bumpImgData.data[idx + 3] = 255;
    }
  }

  diffuseCtx.putImageData(diffuseImgData, 0, 0);
  bumpCtx.putImageData(bumpImgData, 0, 0);

  // Convert to ThreeJS textures
  const diffuseTexture = new THREE.CanvasTexture(diffuseCanvas);
  const bumpTexture = new THREE.CanvasTexture(bumpCanvas);

  // Set wrapping parameters for seamless tiling
  diffuseTexture.wrapS = THREE.RepeatWrapping;
  diffuseTexture.wrapT = THREE.RepeatWrapping;
  bumpTexture.wrapS = THREE.RepeatWrapping;
  bumpTexture.wrapT = THREE.RepeatWrapping;

  return {
    diffuse: diffuseTexture,
    bump: bumpTexture
  };
}
