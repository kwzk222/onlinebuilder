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

  const [loadingPercent, setLoadingPercent] = useState(0);

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

  // Sleek progress bar percentage tick count simulator
  useEffect(() => {
    if (transitionState.active && transitionState.target === 'dashboard') {
      setLoadingPercent(0);
      const interval = setInterval(() => {
        setLoadingPercent((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + Math.floor(Math.random() * 12) + 6; // Fast, realistic tick loader
        });
      }, 50);
      return () => clearInterval(interval);
    }
  }, [transitionState.active, transitionState.target]);

  useEffect(() => {
    if (transitionState.active) {
      if (transitionState.target === 'dashboard') {
        const hideTimer = setTimeout(() => {
          setTransitionState({ active: false, target: null });
        }, 1200); // 1.2s total presentation time
        return () => clearTimeout(hideTimer);
      }

      if (transitionState.target === 'startup') {
        // Instant overlay coverage prevents dashboard flash. Switch to startup at 350ms.
        const swapTimer = setTimeout(() => {
          setShowDashboard(false);
        }, 350);

        // Hide transition screen after total duration
        const hideTimer = setTimeout(() => {
          setTransitionState({ active: false, target: null });
        }, 1000);

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
            // Instant cover on return prevents any dashboard frame flashing
            initial={{ opacity: transitionState.target === 'startup' ? 1 : 0 }}
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

              {/* SLEEK PROGRESS BAR & PROGRESS TEXT */}
              {transitionState.target === 'dashboard' && (
                <div className="mt-8 flex flex-col items-center gap-2">
                  <div className="w-48 h-[2px] bg-[#1c1c1f] relative overflow-hidden">
                    <motion.div
                      className="h-full bg-[#a39081]"
                      style={{ width: `${Math.min(100, loadingPercent)}%` }}
                    />
                  </div>
                  <span className="text-[8px] font-mono tracking-[0.25em] text-[#5a554f]">
                    LOADING PROTOCOL ... {Math.min(100, loadingPercent)}%
                  </span>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
