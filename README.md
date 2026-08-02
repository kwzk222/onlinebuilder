# Luxe Luthiers Bespoke 3D Electric Guitar Configurator

A ultra-premium, cinematic single-page application built to showcase bespoke electric guitars. The app features procedural high-resolution seamless PBR wood grain maps, dynamic gloss/matte/translucent material shaders, real-time pricing breakdowns, local-storage persistence, and shared compression URLs.

## Features & Deliverables

1.  **Full Single Page App:** Zero multistep wizards. All option categories (Body Profile, Lacquer & Finish, Neck Profile, Pickups, and Hardware Accessories) are fully reachable in one gorgeous glassmorphic screen.
2.  **Cinematic 3D Studio Preview:** Updated with maximum fluid responsiveness (stable 60fps on standard hardware, with customized lighting, reflection stages, and camera controls).
3.  **Procedural Seamless PBR Grains:** Beautiful, self-contained textures for 6 species (Mahogany, Flamed Maple, Swamp Ash, Rosewood, Walnut, Ebony) generated via HTML5 Canvas on-the-fly.
4.  **12 Custom Finish Shaders:** Dynamic clearcoat, metallic flakes, and transmission setups for premium finishes (e.g. 2-Color Sunburst, Translucent Sapphire Blue, Candy Apple Red, etc.).
5.  **Interactive pricing:** Interactive estimated price counter using smooth easing requestAnimationFrame, and a complete breakdown tooltip of additional custom selections.
6.  **Full Utilities:** Undo/Redo history, browser LocalStorage builds, shareable url strings compressed with `lz-string`, high-resolution image captures, and bespoke branded layout PDF Spec Sheets via `jspdf`.
7.  **Production-Ready Asset Pipeline / Utility:** An integrated developer button allows generating the exact customized procedural setups as fully optimized, binary-packed standard `.glb` models, enabling instant dropped-in production swaps.

---

## Swap the 3D GLB Model

Luxe Luthiers uses standard Three.js group sub-meshes. To swap out the procedural placeholder with a high-poly production model:
1. Save your artists' production 3D model as `guitar.glb`.
2. Ensure the mesh nodes inside the model are cleanly named:
   - `body` (for the guitar body wood & lacquer finish)
   - `neck` (for neck wood)
   - `fretboard` (for fretboard wood)
   - `pickguard` (for the pickguard style)
   - `pickups_group` (with sub-children `pickup_bridge`, `pickup_middle`, `pickup_neck` for electronics layouts)
   - `hardware_bridge`, `hardware_knob_vol`, `hardware_knob_tone` (for metal platings)
3. Drop the file inside `/public/models/guitar.glb`.
4. Replace the procedural R3F model loaded in `ReactGuitarModel.tsx` with standard `@react-three/drei`'s `useGLTF('/models/guitar.glb')` hooks mapping the materials.

---

## Add an Option to the Catalog

To add a customized selection (such as a new bridge or pickup layout):
1. Navigate to `src/constants/catalog.ts`.
2. Append the new item to the respective record with its specific identifier, title, description, and custom price delta:
   ```typescript
   export const PICKUPS_LAYOUTS: Record<string, Option> = {
     // ...
     custom_layout: {
       id: 'custom_layout',
       name: 'Tri-Sonic Vintage',
       priceDelta: 180,
       description: 'Classic warm woody single-coils perfect for nostalgic glam-rock.'
     }
   }
   ```
3. Types are fully automated. The application will instantly display the new option in the control panel.

---

## Add a Wood/Finish Texture

1. **To add a wood core:**
   - Go to `src/utils/textureGenerator.ts` and add the custom color thresholds and grain waviness parameters inside `generateWoodTexture()`'s switch statement (e.g. adjusting `baseColor`, `grainColor`, or adding custom noise layers).
   - Go to `src/constants/catalog.ts` and list the option in `BODY_WOODS` or `WOOD_TEXTURES_CATALOG`.

2. **To add a finish:**
   - Go to `src/constants/catalog.ts` and append a configuration block to `FINISH_PRESETS` specifying base color, secondary color (for sunburst gradients), roughness, metalness, clearcoat, or transmission values.
   - The React render engine automatically translates the presets into the respective custom material shaders.

---

## Technical Setup & Deployment

### Environment Variables
No third-party backend keys are needed. All logic is self-contained.

### Local Development
```bash
# Install dependencies
pnpm install

# Start local server
pnpm dev

# Build production assets
pnpm build
```

### Deploy to Vercel (Static SPA)
Luxe Luthiers is optimized as a static single-page application.
1. Push this repository to your GitHub/GitLab account.
2. Visit [Vercel](https://vercel.com) and click **"Import Project"**.
3. Select your repository. Vercel automatically recognizes the Vite project setup.
4. Click **"Deploy"**.
