import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ChevronRight, User, Bell, Lock, CreditCard, HelpCircle, LogOut } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

const Profile = () => {
  const navigate = useNavigate();
  const { signOut, user } = useAuth();
  const { toast } = useToast();

  const handleSignOut = async () => {
    console.log('[Profile] Bouton Se déconnecter cliqué');
    try {
      console.log('[Profile] Appel de signOut()...');
      await signOut();
      console.log('[Profile] signOut() réussi');
      toast({
        title: "Déconnexion réussie",
        description: "À bientôt !",
      });
      navigate("/");
    } catch (error) {
      console.error('[Profile] Erreur lors de la déconnexion:', error);
      toast({
        title: "Erreur",
        description: "Impossible de se déconnecter.",
        variant: "destructive",
      });
    }
  };

  const menuItems = [
    { icon: User, label: "Modifier mon profil", path: "/profile/edit" },
    { icon: Bell, label: "Notifications", path: "/profile/notifications" },
    { icon: Lock, label: "Confidentialité", path: "/profile/privacy" },
    { icon: CreditCard, label: "Abonnement & paiement", path: "/profile/billing" },
    { icon: HelpCircle, label: "Support & FAQ", path: "/profile/support" },
  ];

  return (
    <div className="min-h-screen p-4 space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-title">Profil</h1>

      <Card className="p-6 rounded-3xl text-center space-y-4">
        <Avatar className="w-24 h-24 mx-auto">
          <AvatarFallback className="bg-secondary text-title text-2xl font-bold">
            JD
          </AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-xl font-bold text-title">Jean Dupont</h2>
          <p className="text-sm text-muted-foreground">Propriétaire de chien</p>
        </div>
      </Card>

      <div className="space-y-2">
        {menuItems.map((item, index) => (
          <Card
            key={index}
            className="p-4 rounded-2xl cursor-pointer hover:shadow-md transition-all"
            onClick={() => navigate(item.path)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                  <item.icon className="h-5 w-5 text-primary" />
                </div>
                <span className="font-medium text-foreground">{item.label}</span>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </div>
          </Card>
        ))}
      </div>

      <Button
        onClick={handleSignOut}
        variant="outline"
        className="w-full rounded-full border-destructive text-destructive hover:bg-destructive/10"
        size="lg"
      >
        <LogOut className="mr-2 h-4 w-4" />
        Se déconnecter
      </Button>
    </div>
  );
};

export default Profile;
