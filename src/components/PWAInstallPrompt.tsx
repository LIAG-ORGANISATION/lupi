import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Download, X, Share } from 'lucide-react';
import { usePWAInstall } from '@/hooks/usePWAInstall';

export const PWAInstallPrompt = () => {
  const { isInstallable, promptInstall } = usePWAInstall();
  const [showPrompt, setShowPrompt] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Détecter iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(iOS);
    
    // Réinitialiser le localStorage pour forcer l'affichage
    localStorage.removeItem('pwa-install-dismissed');
    
    // Afficher le prompt après 2 secondes si installable OU si iOS
    if (isInstallable || iOS) {
      const timer = setTimeout(() => {
        setShowPrompt(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isInstallable]);

  const handleInstall = async () => {
    const installed = await promptInstall();
    if (installed) {
      setShowPrompt(false);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    setIsDismissed(true);
    localStorage.setItem('pwa-install-dismissed', 'true');
  };

  if (!showPrompt || isDismissed) {
    return null;
  }

  return (
    <div className="fixed bottom-20 left-4 right-4 z-50 animate-fade-in md:left-auto md:right-4 md:w-96">
      <Card className="p-4 shadow-lg border-primary/20 bg-card">
        <button
          onClick={handleDismiss}
          className="absolute top-2 right-2 p-1 hover:bg-accent rounded-full transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
        
        <div className="flex items-start gap-3 mb-3">
          <div className="bg-primary/10 p-2 rounded-lg">
            {isIOS ? <Share className="h-5 w-5 text-primary" /> : <Download className="h-5 w-5 text-primary" />}
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-sm mb-1">
              Installer Lupi sur votre téléphone
            </h3>
            {isIOS ? (
              <p className="text-xs text-muted-foreground">
                Appuyez sur <Share className="inline h-3 w-3" /> puis "Sur l'écran d'accueil"
              </p>
            ) : (
              <p className="text-xs text-muted-foreground">
                Accédez rapidement à vos données, même hors ligne
              </p>
            )}
          </div>
        </div>

        {!isIOS && (
          <div className="flex gap-2">
            <Button
              onClick={handleInstall}
              className="flex-1 rounded-full"
              size="sm"
            >
              Installer
            </Button>
            <Button
              onClick={handleDismiss}
              variant="outline"
              className="rounded-full"
              size="sm"
            >
              Plus tard
            </Button>
          </div>
        )}
        
        {isIOS && (
          <Button
            onClick={handleDismiss}
            variant="outline"
            className="w-full rounded-full"
            size="sm"
          >
            J'ai compris
          </Button>
        )}
      </Card>
    </div>
  );
};
