import React from 'react';

export default function MobileContainer({ children }) {
  return (
    <div className="flex justify-center items-center h-screen bg-tertiary overflow-hidden p-2 sm:p-4">
      {/* Android Phone Frame */}
      <div className="relative w-full max-w-[412px] h-full max-h-[892px] bg-background overflow-hidden border-[8px] border-tertiary-container rounded-[40px] shadow-2xl flex flex-col">
        {children}
      </div>
    </div>
  );
}
