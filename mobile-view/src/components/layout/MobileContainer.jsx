import React from 'react';

export default function MobileContainer({ children }) {
  return (
    <div className="flex justify-center items-center h-[100dvh] bg-tertiary w-full">
      <div className="relative w-full max-w-[412px] h-full bg-background overflow-hidden flex flex-col shadow-lg sm:border-x sm:border-surface-variant">
        {children}
      </div>
    </div>
  );
}
