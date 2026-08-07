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
    instrumentType?: 'guitar' | 'bass';
  }>({
    active: false,
    target: null
  });

  const updateConfig = useGuitarStore((state) => state.updateConfig);

  const handleSelectInstrument = (type: 'guitar' | 'bass') => {
    // Start transition
    setTransitionState({
      active: true,
      target: 'dashboard',
      instrumentType: type
    });
  };

  const handleReturnToStartup = () => {
    // Start transition
    setTransitionState({
      active: true,
      target: 'startup'
    });
  };

  useEffect(() => {
    if (transitionState.active) {
      const timer = setTimeout(() => {
        if (transitionState.target === 'dashboard') {
          updateConfig({ instrumentType: transitionState.instrumentType });
          setShowDashboard(true);
        } else if (transitionState.target === 'startup') {
          setShowDashboard(false);
        }

        // Hide transition overlay after a brief moment to allow screen to mount
        const hideTimer = setTimeout(() => {
          setTransitionState({ active: false, target: null });
        }, 500);

        return () => clearTimeout(hideTimer);
      }, 1000); // Brief moment for the expanding logo animation

      return () => clearTimeout(timer);
    }
  }, [transitionState.active, transitionState.target, transitionState.instrumentType, updateConfig]);

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
              <span className="text-[8px] tracking-[0.8em] text-[#a39081] font-black uppercase mb-3 animate-pulse">
                INITIALIZING CORE
              </span>
              <motion.h1
                initial={{ opacity: 0, scale: 0.95, letterSpacing: '0.4em' }}
                animate={{ opacity: 1, scale: 1, letterSpacing: '0.7em' }}
                exit={{ opacity: 0, scale: 1.02, letterSpacing: '0.8em' }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                className="text-lg md:text-xl font-black text-[#e3e3e5] uppercase text-center"
              >
                LVI Custom
              </motion.h1>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
