import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const NotificationsSettings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    dnaResults: true,
    appointments: true,
    recommendations: false,
    messages: true,
    marketing: false,
  });

  const handleSave = () => {
    toast({
      title: "Paramètres enregistrés",
      description: "Vos préférences de notifications ont été mises à jour.",
    });
  };

  return (
    <div className="min-h-screen p-4 space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/profile")}
          className="rounded-full"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold text-title">Notifications</h1>
      </div>

      <div className="space-y-4">
        <Card className="p-6 rounded-3xl space-y-4">
          <h2 className="text-lg font-bold text-title">Canaux de notification</h2>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="email" className="flex-1">Notifications par email</Label>
            <Switch
              id="email"
              checked={settings.emailNotifications}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, emailNotifications: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="push" className="flex-1">Notifications push</Label>
            <Switch
              id="push"
              checked={settings.pushNotifications}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, pushNotifications: checked })
              }
            />
          </div>
        </Card>

        <Card className="p-6 rounded-3xl space-y-4">
          <h2 className="text-lg font-bold text-title">Préférences</h2>
          
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <Label htmlFor="dna">Résultats ADN</Label>
              <p className="text-xs text-muted-foreground">
                Recevoir une notification quand les résultats sont prêts
              </p>
            </div>
            <Switch
              id="dna"
              checked={settings.dnaResults}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, dnaResults: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex-1">
              <Label htmlFor="appointments">Rendez-vous</Label>
              <p className="text-xs text-muted-foreground">
                Rappels de rendez-vous à venir
              </p>
            </div>
            <Switch
              id="appointments"
              checked={settings.appointments}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, appointments: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex-1">
              <Label htmlFor="recommendations">Recommandations</Label>
              <p className="text-xs text-muted-foreground">
                Conseils personnalisés pour votre chien
              </p>
            </div>
            <Switch
              id="recommendations"
              checked={settings.recommendations}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, recommendations: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex-1">
              <Label htmlFor="messages">Messages</Label>
              <p className="text-xs text-muted-foreground">
                Nouveaux messages des professionnels
              </p>
            </div>
            <Switch
              id="messages"
              checked={settings.messages}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, messages: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex-1">
              <Label htmlFor="marketing">Marketing</Label>
              <p className="text-xs text-muted-foreground">
                Offres et nouveautés LupiApp
              </p>
            </div>
            <Switch
              id="marketing"
              checked={settings.marketing}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, marketing: checked })
              }
            />
          </div>
        </Card>

        <Button
          onClick={handleSave}
          className="w-full rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
          size="lg"
        >
          Enregistrer
        </Button>
      </div>
    </div>
  );
};

export default NotificationsSettings;
