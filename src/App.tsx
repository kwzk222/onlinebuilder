import React, { useState } from 'react';
import { StartupScreen } from './components/StartupScreen';
import { MainDashboard } from './components/MainDashboard';
import { useGuitarStore } from './store/guitarStore';
import { AnimatePresence, motion } from 'framer-motion';
import './App.css';

const App: React.FC = () => {
  const [showDashboard, setShowDashboard] = useState(false);
  const updateConfig = useGuitarStore((state) => state.updateConfig);

  const handleSelectInstrument = (type: 'guitar' | 'bass') => {
    updateConfig({ instrumentType: type });
    setShowDashboard(true);
  };

  const handleReturnToStartup = () => {
    setShowDashboard(false);
  };

  return (
    <div className="w-full min-h-screen bg-[#050507]">
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
    </div>
  );
};

export default App;
