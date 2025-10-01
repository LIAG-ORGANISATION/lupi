import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Download, X } from 'lucide-react';
import { usePWAInstall } from '@/hooks/usePWAInstall';

export const PWAInstallPrompt = () => {
  const { isInstallable, promptInstall } = usePWAInstall();
  const [showPrompt, setShowPrompt] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Vérifier si l'utilisateur a déjà refusé
    const dismissed = localStorage.getItem('pwa-install-dismissed');
    if (dismissed) {
      setIsDismissed(true);
      return;
    }

    // Afficher le prompt après 3 secondes si installable
    if (isInstallable) {
      const timer = setTimeout(() => {
        setShowPrompt(true);
      }, 3000);
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

  if (!showPrompt || isDismissed || !isInstallable) {
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
            <Download className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-sm mb-1">
              Installer Lupi sur votre téléphone
            </h3>
            <p className="text-xs text-muted-foreground">
              Accédez rapidement à vos données, même hors ligne
            </p>
          </div>
        </div>

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
      </Card>
    </div>
  );
};
