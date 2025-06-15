import React, { createContext, useContext, useEffect, useState } from 'react';
import { useScreenStream, UseScreenStreamReturn } from '../modules/useScreenStream';

interface ScreenStreamContextType extends UseScreenStreamReturn {
  // Additional context-specific methods can be added here
}

const ScreenStreamContext = createContext<ScreenStreamContextType | undefined>(undefined);

export const useScreenStreamContext = (): ScreenStreamContextType => {
  const context = useContext(ScreenStreamContext);
  if (!context) {
    throw new Error('useScreenStreamContext must be used within a ScreenStreamProvider');
  }
  return context;
};

interface ScreenStreamProviderProps {
  children: React.ReactNode;
  intervalMs?: number;
  autoStart?: boolean;
  maxFrameBuffer?: number;
}

export const ScreenStreamProvider: React.FC<ScreenStreamProviderProps> = ({
  children,
  intervalMs = 500,
  autoStart = false,
  maxFrameBuffer = 10,
}) => {
  const screenStream = useScreenStream({
    intervalMs,
    autoStart,
    maxFrameBuffer,
  });

  return (
    <ScreenStreamContext.Provider value={screenStream}>
      {children}
    </ScreenStreamContext.Provider>
  );
};
