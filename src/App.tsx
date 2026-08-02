import React from 'react';
import { MainDashboard } from './components/MainDashboard';
import './App.css';

const App: React.FC = () => {
  return (
    <div className="w-full min-h-screen bg-[#050507]">
      <MainDashboard />
    </div>
  );
};

export default App;
