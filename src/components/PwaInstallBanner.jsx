import React, { useState, useEffect } from 'react';
import { Download, Smartphone, X, Sparkles } from 'lucide-react';

export const PwaInstallBanner = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    // Also check if on iOS Safari
    const isIos = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;

    if (isIos && !isStandalone) {
      setShowBanner(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setShowBanner(false);
      }
      setDeferredPrompt(null);
    } else {
      alert("📱 To install Ghibli Kitchen on iPhone:\nTap the Share button 📤 in Safari and select 'Add to Home Screen'!");
    }
  };

  if (!showBanner) return null;

  return (
    <div className="pwa-install-banner">
      <div className="pwa-content">
        <span className="pwa-emoji calcifer-anim">🔥</span>
        <div className="pwa-text">
          <strong>Install Ghibli Kitchen App</strong>
          <span>Add to your phone's Home Screen for instant offline meal planning!</span>
        </div>
      </div>
      <div className="pwa-buttons">
        <button className="pwa-btn-install" onClick={handleInstallClick}>
          <Download size={16} />
          <span>Install</span>
        </button>
        <button className="pwa-btn-close" onClick={() => setShowBanner(false)} title="Dismiss">
          <X size={16} />
        </button>
      </div>
    </div>
  );
};
