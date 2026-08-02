import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';

// Procedurally constructs a beautiful 3D electric guitar model with precise sub-meshes
// and exports it as a GLTF binary (GLB) file to download.
// This is used as the developer utility script to generate the actual /models/guitar.glb file!

export function buildGuitarMesh(shape: 'modern_st' | 'single_cut' | 'offset'): THREE.Group {
  const group = new THREE.Group();
  group.name = 'electric_guitar_root';

  // --- Body Geometry (Extruded Shape) ---
  const bodyShape = new THREE.Shape();
  if (shape === 'single_cut') {
    // Single Cutaway Body shape
    bodyShape.moveTo(0, 1.2);
    bodyShape.quadraticCurveTo(0.6, 1.2, 0.8, 0.7); // cutaway
    bodyShape.bezierCurveTo(1.1, 0.3, 1.2, -0.4, 0.9, -0.9);
    bodyShape.bezierCurveTo(0.6, -1.5, -0.6, -1.5, -0.9, -0.9);
    bodyShape.bezierCurveTo(-1.2, -0.4, -1.1, 0.3, -0.8, 0.7);
    bodyShape.quadraticCurveTo(-0.6, 1.0, -0.4, 1.2);
    bodyShape.closePath();
  } else if (shape === 'offset') {
    // Jazzmaster-like Offset Body shape
    bodyShape.moveTo(-0.2, 1.2);
    bodyShape.bezierCurveTo(0.3, 1.2, 0.7, 0.8, 0.8, 0.4); // horn
    bodyShape.bezierCurveTo(0.6, 0.2, 0.7, -0.2, 1.0, -0.6);
    bodyShape.bezierCurveTo(1.2, -1.1, 0.2, -1.6, -0.4, -1.4);
    bodyShape.bezierCurveTo(-1.0, -1.2, -1.3, -0.5, -1.1, 0.0);
    bodyShape.bezierCurveTo(-0.9, 0.4, -0.8, 0.8, -0.6, 1.2);
    bodyShape.closePath();
  } else {
    // Modern ST (Double Cutaway) Body shape
    bodyShape.moveTo(-0.1, 1.2);
    bodyShape.bezierCurveTo(0.3, 1.2, 0.6, 0.9, 0.8, 0.5); // Right Horn
    bodyShape.bezierCurveTo(0.7, 0.1, 0.5, 0.0, 0.8, -0.5);
    bodyShape.bezierCurveTo(1.1, -1.0, 0.7, -1.4, 0.0, -1.3);
    bodyShape.bezierCurveTo(-0.7, -1.4, -1.1, -1.0, -0.8, -0.5);
    bodyShape.bezierCurveTo(-0.5, 0.0, -0.7, 0.1, -0.8, 0.5); // Left Horn
    bodyShape.bezierCurveTo(-0.6, 0.9, -0.3, 1.2, -0.1, 1.2);
    bodyShape.closePath();
  }

  const extrudeSettings = {
    steps: 1,
    depth: 0.18,
    bevelEnabled: true,
    bevelThickness: 0.04,
    bevelSize: 0.03,
    bevelSegments: 5
  };

  const bodyGeo = new THREE.ExtrudeGeometry(bodyShape, extrudeSettings);
  bodyGeo.center(); // centers pivot
  // Rotate so the body is upright along the XY plane (since extruded depth extends along Z-axis)
  // No, ExtrudeGeometry extrudes along the positive Z-axis.
  // The shape path lives in the XY plane.
  // Thus, the front face is at Z = depth (or Z=0), and shape is fully in XY!
  // This means the front face of the body naturally aligns with the front of the neck and fretboard
  // which are standard BoxGeometries that also face along the positive Z-axis.
  // By omitting the rotateX, they align PERFECTLY without gaps or rotations!
  // Let's position things cleanly so the neck overlaps the body heel perfectly.

  // Body mesh
  const bodyMesh = new THREE.Mesh(bodyGeo);
  bodyMesh.name = 'body';
  bodyMesh.castShadow = true;
  bodyMesh.receiveShadow = true;
  group.add(bodyMesh);

  // --- Pickguard ---
  // Create a slightly smaller face-aligned mesh for the pickguard
  const pgShape = new THREE.Shape();
  pgShape.moveTo(0, 0.7);
  pgShape.quadraticCurveTo(0.4, 0.7, 0.4, 0.3);
  pgShape.bezierCurveTo(0.5, -0.1, 0.3, -0.5, 0.0, -0.6);
  pgShape.bezierCurveTo(-0.3, -0.5, -0.5, -0.1, -0.4, 0.3);
  pgShape.quadraticCurveTo(-0.4, 0.7, 0, 0.7);
  pgShape.closePath();

  const pgExtrudeSettings = {
    depth: 0.015,
    bevelEnabled: true,
    bevelThickness: 0.005,
    bevelSize: 0.005,
    bevelSegments: 2
  };

  const pgGeo = new THREE.ExtrudeGeometry(pgShape, pgExtrudeSettings);
  pgGeo.center();
  // Shift pickguard slightly forward on the Z-axis (which is guitar's front face)
  const pgMesh = new THREE.Mesh(pgGeo);
  pgMesh.name = 'pickguard';
  pgMesh.position.set(0, 0, 0.105); // sits on body top
  pgMesh.castShadow = true;
  pgMesh.receiveShadow = true;
  group.add(pgMesh);

  // --- Neck (extending upwards along Y-axis) ---
  const neckLength = 2.4;
  const neckWidth = 0.15;
  const neckDepth = 0.08;
  const neckGeo = new THREE.BoxGeometry(neckWidth, neckLength, neckDepth);
  neckGeo.translate(0, neckLength / 2, 0); // align pivot to neck heel

  const neckMesh = new THREE.Mesh(neckGeo);
  neckMesh.name = 'neck';
  // Position starting from top edge of body
  neckMesh.position.set(0, 0.3, -0.01);
  neckMesh.castShadow = true;
  group.add(neckMesh);

  // --- Fretboard (thin layer on neck) ---
  const fretboardGeo = new THREE.BoxGeometry(neckWidth + 0.01, neckLength - 0.1, 0.02);
  fretboardGeo.translate(0, (neckLength - 0.1) / 2, 0);

  const fretboardMesh = new THREE.Mesh(fretboardGeo);
  fretboardMesh.name = 'fretboard';
  fretboardMesh.position.set(0, 0.3, 0.04);
  fretboardMesh.castShadow = true;
  group.add(fretboardMesh);

  // --- Headstock ---
  const headstockShape = new THREE.Shape();
  headstockShape.moveTo(-0.08, 0);
  headstockShape.lineTo(0.08, 0);
  headstockShape.quadraticCurveTo(0.12, 0.2, 0.08, 0.45);
  headstockShape.bezierCurveTo(0.04, 0.55, -0.12, 0.55, -0.08, 0.45);
  headstockShape.closePath();

  const hsGeo = new THREE.ExtrudeGeometry(headstockShape, {
    depth: 0.06,
    bevelEnabled: true,
    bevelThickness: 0.01,
    bevelSize: 0.01,
    bevelSegments: 3
  });
  hsGeo.center();
  const hsMesh = new THREE.Mesh(hsGeo);
  hsMesh.name = 'headstock';
  hsMesh.position.set(0, 0.3 + neckLength + 0.2, 0.02);
  hsMesh.castShadow = true;
  group.add(hsMesh);

  // --- Hardware Parts ---
  // Bridge (Chrome/Gold block)
  const bridgeGeo = new THREE.BoxGeometry(0.24, 0.18, 0.04);
  const bridgeMesh = new THREE.Mesh(bridgeGeo);
  bridgeMesh.name = 'hardware_bridge';
  bridgeMesh.position.set(0, -0.4, 0.11);
  bridgeMesh.castShadow = true;
  group.add(bridgeMesh);

  // Knobs (Vol / Tone)
  const knobGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.05, 16);
  // Knobs face forward along Z-axis
  knobGeo.rotateX(Math.PI / 2);

  const volKnob = new THREE.Mesh(knobGeo);
  volKnob.name = 'hardware_knob_vol';
  volKnob.position.set(0.2, -0.6, 0.12);
  volKnob.castShadow = true;
  group.add(volKnob);

  const toneKnob = new THREE.Mesh(knobGeo);
  toneKnob.name = 'hardware_knob_tone';
  toneKnob.position.set(0.35, -0.5, 0.12);
  toneKnob.castShadow = true;
  group.add(toneKnob);

  // Jack Plate
  const jackGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.01, 12);
  jackGeo.rotateX(Math.PI / 3);
  const jackMesh = new THREE.Mesh(jackGeo);
  jackMesh.name = 'hardware_jack';
  jackMesh.position.set(0.6, -0.8, 0.08);
  jackMesh.castShadow = true;
  group.add(jackMesh);

  // Pickups
  // We'll create boxes for Neck, Middle, and Bridge pickups inside a sub-group
  const pickupGroup = new THREE.Group();
  pickupGroup.name = 'pickups_group';

  const pickupGeo = new THREE.BoxGeometry(0.22, 0.07, 0.035);

  const puBridge = new THREE.Mesh(pickupGeo);
  puBridge.name = 'pickup_bridge';
  puBridge.position.set(0, -0.2, 0.11);
  puBridge.castShadow = true;
  pickupGroup.add(puBridge);

  const puMiddle = new THREE.Mesh(pickupGeo);
  puMiddle.name = 'pickup_middle';
  puMiddle.position.set(0, 0.0, 0.11);
  puMiddle.castShadow = true;
  pickupGroup.add(puMiddle);

  const puNeck = new THREE.Mesh(pickupGeo);
  puNeck.name = 'pickup_neck';
  puNeck.position.set(0, 0.2, 0.11);
  puNeck.castShadow = true;
  pickupGroup.add(puNeck);

  group.add(pickupGroup);

  // Tuning pegs on headstock
  const pegGroup = new THREE.Group();
  pegGroup.name = 'hardware_pegs';
  const pegPostGeo = new THREE.CylinderGeometry(0.008, 0.008, 0.06, 8);
  const pegHeadGeo = new THREE.BoxGeometry(0.03, 0.015, 0.01);

  for (let i = 0; i < 6; i++) {
    const side = i < 3 ? -1 : 1;
    const yPos = 0.3 + neckLength + 0.1 + (i % 3) * 0.12;

    const post = new THREE.Mesh(pegPostGeo);
    post.position.set(side * 0.08, yPos, 0.04);
    post.rotation.x = Math.PI / 2;

    const head = new THREE.Mesh(pegHeadGeo);
    head.position.set(side * 0.12, yPos, 0.07);

    pegGroup.add(post);
    pegGroup.add(head);
  }
  group.add(pegGroup);

  return group;
}

// Exports the procedural group as a downloadable GLB file.
export function exportGuitarToGLB(shape: 'modern_st' | 'single_cut' | 'offset') {
  const model = buildGuitarMesh(shape);
  const exporter = new GLTFExporter();

  exporter.parse(
    model,
    (gltf) => {
      const output = gltf as ArrayBuffer;
      const blob = new Blob([output], { type: 'application/octet-stream' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `guitar_${shape}.glb`;
      link.click();
      URL.revokeObjectURL(url);
    },
    (error) => {
      console.error('Error exporting GLB:', error);
    },
    { binary: true }
  );
}
