import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage, Center } from '@react-three/drei';
import { ReactGuitarModel } from './ReactGuitarModel';

// The main premium 3D Canvas Scene wrapping ReactGuitarModel
// It incorporates cinematic studio lighting, subtle shadow mapping, stage reflexivity,
// and OrbitControls with auto-rotation/inertial damping for a premium product feel.

interface SceneProps {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
}

export const Guitar3DScene: React.FC<SceneProps> = ({ canvasRef }) => {
  return (
    <div className="w-full h-full relative group/canvas bg-radial from-neutral-950 via-[#0d0d10] to-[#050507] rounded-3xl overflow-hidden border border-neutral-900 shadow-[0_10px_50px_rgba(0,0,0,0.9)]">

      {/* Premium Dark Glass Cinematic Backdrop */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-neutral-950 via-transparent to-transparent z-10" />

      {/* Interactive controls tip overlay */}
      <div className="absolute top-4 left-4 z-20 pointer-events-none transition-all duration-300 opacity-60 group-hover/canvas:opacity-100">
        <div className="flex items-center gap-2 bg-[#0d0d10]/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-neutral-900 text-[10px] font-mono tracking-widest text-neutral-400 shadow-xl">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
          INTERACTIVE 3D STUDIO
        </div>
      </div>

      <div className="absolute bottom-4 right-4 z-20 pointer-events-none transition-all duration-300 opacity-40 group-hover/canvas:opacity-80 text-[10px] text-neutral-500 font-medium tracking-wide">
        DRAG TO ROTATE  •  SCROLL TO ZOOM
      </div>

      <Canvas
        ref={canvasRef}
        shadows
        gl={{ preserveDrawingBuffer: true, antialias: true, alpha: false, powerPreference: 'high-performance' }}
        camera={{ position: [0, 0, 4.5], fov: 45 }}
        className="w-full h-full"
      >
        <color attach="background" args={['#0a0a0c']} />

        {/* Subtle, ambient background lighting */}
        <ambientLight intensity={0.2} />

        {/* Cinematic Studio Light Setup */}
        <Stage
          intensity={0.6}
          environment="studio"
          shadows={{ type: 'contact', opacity: 0.6, blur: 2.5 }}
          adjustCamera={false}
          position={[0, 0, 0]}
        >
          <Center>
            <Suspense fallback={null}>
              <ReactGuitarModel />
            </Suspense>
          </Center>
        </Stage>

        {/* Custom dramatic accent lighting to pop the clearcoat and translucency */}
        <directionalLight
          position={[3, 5, 4]}
          intensity={1.2}
          castShadow
          shadow-mapSize={1024}
        />
        <directionalLight
          position={[-3, 2, 2]}
          intensity={0.5}
        />
        {/* Colorful rim highlights */}
        <spotLight
          position={[0, 5, -3]}
          intensity={0.8}
          angle={Math.PI / 4}
          penumbra={1}
        />
        <pointLight
          position={[2, -2, 2]}
          intensity={0.4}
          color="#38bdf8" // cyber blue tint under guitar
        />

        <OrbitControls
          enablePan={false}
          enableZoom={true}
          minDistance={2.5}
          maxDistance={7}
          makeDefault
          dampingFactor={0.05}
          enableDamping
          autoRotate={false}
          autoRotateSpeed={0.8}
        />
      </Canvas>
    </div>
  );
};
