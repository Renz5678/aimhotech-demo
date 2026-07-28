import React, { useEffect } from 'react';

export default function QRScanModal({ isOpen, onClose, onScan }) {
  useEffect(() => {
    if(isOpen) {
      const t = setTimeout(() => onScan('QC-097-00310'), 1500);
      return () => clearTimeout(t);
    }
  }, [isOpen, onScan]);

  if(!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex flex-col items-center justify-center">
      <button onClick={onClose} className="absolute top-6 left-6 text-white"><span className="material-symbols-outlined text-3xl">close</span></button>
      
      <div className="relative w-64 h-64 mb-8">
        <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary rounded-tl-lg animate-pulse" />
        <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary rounded-tr-lg animate-pulse" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary rounded-bl-lg animate-pulse" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary rounded-br-lg animate-pulse" />
        <div className="absolute inset-0 bg-primary/10" />
      </div>
      
      <h2 className="text-white text-xl font-bold animate-pulse">Scanning...</h2>
      <p className="text-white/60 text-sm mt-2">Align QR code within the frame</p>
    </div>
  );
}
