import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function TopBar({ 
  title, 
  subtitle, 
  imageUrl, 
  showNotification = false, 
  hasUnread = false,
  showBack = false,
  onBack
}) {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    // We would ideally listen to the main scroll container, but for this component 
    // we can assume it's passed or handled via context if we need dynamic shadows.
    // We'll just leave it static for now or add a shadow class.
  }, []);

  return (
    <header className="glass-header z-20 w-full px-edge_margin pt-xl pb-md flex flex-col gap-xs sticky top-0 transition-all duration-300">
      <div className="flex justify-between items-center w-full">
        <div className="flex items-center gap-sm">
          {showBack ? (
            <button 
              onClick={() => onBack ? onBack() : navigate(-1)}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-high transition-colors text-primary"
            >
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
          ) : imageUrl ? (
            <div className="w-10 h-10 rounded-full border-2 border-primary overflow-hidden">
              <img className="w-full h-full object-cover" src={imageUrl} alt="Profile" />
            </div>
          ) : null}
          
          <div className="flex flex-col">
            {subtitle && (
              <span className="text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider">
                {subtitle}
              </span>
            )}
            <h1 className={`text-primary font-headline-md text-headline-md ${subtitle ? '-mt-1' : ''}`}>
              {title}
            </h1>
          </div>
        </div>
        
        {showNotification && (
          <button className="relative w-10 h-10 flex items-center justify-center rounded-full bg-surface-container-high transition-transform active:scale-95">
            <span className="material-symbols-outlined text-primary">notifications</span>
            {hasUnread && (
              <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full"></span>
            )}
          </button>
        )}
      </div>
    </header>
  );
}
