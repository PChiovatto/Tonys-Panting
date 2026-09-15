import React, { useState, useEffect } from 'react';
import { Download, Share, PlusSquare } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [showInstall, setShowInstall] = useState(false);

  useEffect(() => {
    const isStandaloneMode = window.matchMedia('(display-mode: standalone)').matches || 
                           (window.navigator as any).standalone || 
                           document.referrer.includes('android-app://');
    
    setIsStandalone(isStandaloneMode);

    // Detect iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(isIOSDevice);

    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      if (!isStandaloneMode) setShowInstall(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    if (isIOSDevice && !isStandaloneMode) {
      setShowInstall(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (isIOS) {
      toast.info("Install Dashboard App", {
        description: "Tap 'Share' and then 'Add to Home Screen' to install the app on your iPhone.",
        duration: 8000,
      });
      return;
    }

    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      setShowInstall(false);
    }
  };

  if (!showInstall || isStandalone) return null;

  return (
    <div className="fixed bottom-20 right-4 z-50 animate-bounce-subtle md:bottom-8">
      <Button 
        onClick={handleInstallClick}
        className="bg-red-600 hover:bg-red-700 text-white rounded-full shadow-lg flex items-center gap-2 px-4 py-6"
      >
        <Download className="w-5 h-5" />
        <span className="font-semibold">Install Dashboard App</span>
      </Button>
    </div>
  );
}