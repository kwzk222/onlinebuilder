import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage, Center } from '@react-three/drei';
import { ReactGuitarModel } from './ReactGuitarModel';

interface SceneProps {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
}

export const Guitar3DScene: React.FC<SceneProps> = ({ canvasRef }) => {
  return (
    <div className="w-full h-full relative bg-[#050506] rounded-none overflow-hidden">
      <Canvas
        ref={canvasRef}
        shadows
        gl={{ preserveDrawingBuffer: true, antialias: true, alpha: false, powerPreference: 'high-performance' }}
        camera={{ position: [0, 0, 4.5], fov: 45 }}
        className="w-full h-full"
      >
        <color attach="background" args={['#050506']} />

        <ambientLight intensity={0.2} />

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
        <spotLight
          position={[0, 5, -3]}
          intensity={0.8}
          angle={Math.PI / 4}
          penumbra={1}
        />
        <pointLight
          position={[2, -2, 2]}
          intensity={0.4}
          color="#c19a4e"
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
