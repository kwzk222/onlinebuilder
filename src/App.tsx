import React, { useState, useEffect } from 'react';
import { StartupScreen } from './components/StartupScreen';
import { MainDashboard } from './components/MainDashboard';
import { useGuitarStore } from './store/guitarStore';
import { AnimatePresence, motion } from 'framer-motion';
import './App.css';

const App: React.FC = () => {
  const [showDashboard, setShowDashboard] = useState(false);
  const [transitionState, setTransitionState] = useState<{
    active: boolean;
    target: 'dashboard' | 'startup' | null;
  }>({
    active: false,
    target: null
  });

  const updateConfig = useGuitarStore((state) => state.updateConfig);

  const handleSelectInstrument = (type: 'guitar' | 'bass') => {
    // 1. Immediately configure the store
    updateConfig({ instrumentType: type });

    // 2. Start the transition overlay
    setTransitionState({
      active: true,
      target: 'dashboard'
    });

    // 3. IMMEDIATELY mount the dashboard so the 3D model starts loading in the background
    setShowDashboard(true);
  };

  const handleReturnToStartup = () => {
    // 1. Start transition overlay
    setTransitionState({
      active: true,
      target: 'startup'
    });
  };

  useEffect(() => {
    if (transitionState.active) {
      if (transitionState.target === 'dashboard') {
        // Since dashboard was mounted immediately, just wait for the animation to finish
        const hideTimer = setTimeout(() => {
          setTransitionState({ active: false, target: null });
        }, 1200); // Allow 1.2s for beautiful logo animation and background load
        return () => clearTimeout(hideTimer);
      }

      if (transitionState.target === 'startup') {
        // For return, wait 500ms (until overlay is opaque) to unmount dashboard
        const swapTimer = setTimeout(() => {
          setShowDashboard(false);
        }, 500);

        // Hide overlay after animation finishes
        const hideTimer = setTimeout(() => {
          setTransitionState({ active: false, target: null });
        }, 1200);

        return () => {
          clearTimeout(swapTimer);
          clearTimeout(hideTimer);
        };
      }
    }
  }, [transitionState.active, transitionState.target]);

  return (
    <div className="w-full min-h-screen bg-[#000000]">
      <AnimatePresence mode="wait">
        {!showDashboard ? (
          <motion.div
            key="startup"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            <StartupScreen onSelect={handleSelectInstrument} />
          </motion.div>
        ) : (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9 }}
          >
            <MainDashboard onReturnToStartup={handleReturnToStartup} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* BRIEF CINEMATIC LOGO TRANSITION OVERLAY */}
      <AnimatePresence>
        {transitionState.active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-[#000000] flex flex-col items-center justify-center pointer-events-auto"
          >
            <div className="flex flex-col items-center justify-center">
              <motion.h1
                initial={{ opacity: 0, scale: 0.95, letterSpacing: '0.4em' }}
                animate={{ opacity: 1, scale: 1, letterSpacing: '0.8em' }}
                exit={{ opacity: 0, scale: 1.02, letterSpacing: '0.9em' }}
                transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
                className="text-3xl md:text-4xl font-black text-[#e3e3e5] uppercase text-center"
              >
                LVI
              </motion.h1>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
