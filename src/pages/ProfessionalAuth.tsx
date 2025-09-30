import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";

const signUpSchema = z.object({
  fullName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Email invalide"),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
  profession: z.string().min(2, "La profession est requise"),
  zone: z.string().min(2, "La zone est requise"),
});

const signInSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(1, "Mot de passe requis"),
});

const ProfessionalAuth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [signUpData, setSignUpData] = useState({
    fullName: "",
    email: "",
    password: "",
    profession: "",
    zone: "",
  });
  const [signInData, setSignInData] = useState({
    email: "",
    password: "",
  });

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const validated = signUpSchema.parse(signUpData);
      const redirectUrl = `${window.location.origin}/professional/welcome`;

      const { error } = await supabase.auth.signUp({
        email: validated.email,
        password: validated.password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: validated.fullName,
            profession: validated.profession,
            zone: validated.zone,
            role: 'professional',
          },
        },
      });

      if (error) throw error;

      toast({
        title: "Inscription réussie !",
        description: "Vérifiez votre email pour confirmer votre compte.",
      });
      
      navigate('/professional/welcome');
    } catch (error: any) {
      toast({
        title: "Erreur d'inscription",
        description: error.message || "Une erreur est survenue",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const validated = signInSchema.parse(signInData);

      const { error } = await supabase.auth.signInWithPassword({
        email: validated.email,
        password: validated.password,
      });

      if (error) throw error;

      toast({
        title: "Connexion réussie !",
      });
      
      navigate('/professional/dashboard');
    } catch (error: any) {
      toast({
        title: "Erreur de connexion",
        description: error.message || "Email ou mot de passe incorrect",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-4 space-y-6 animate-fade-in bg-background">
      <div className="flex items-center gap-4 max-w-md mx-auto">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/choose-account-type")}
          className="rounded-full"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold text-title">Espace Professionnel</h1>
      </div>

      <div className="max-w-md mx-auto">
        <Tabs defaultValue="signin" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Connexion</TabsTrigger>
            <TabsTrigger value="signup">Inscription</TabsTrigger>
          </TabsList>

          <TabsContent value="signin">
            <form onSubmit={handleSignIn} className="space-y-4">
              <Card className="p-6 rounded-3xl space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signin-email">Email</Label>
                  <Input
                    id="signin-email"
                    type="email"
                    placeholder="votre@email.com"
                    value={signInData.email}
                    onChange={(e) => setSignInData({ ...signInData, email: e.target.value })}
                    className="rounded-2xl"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signin-password">Mot de passe</Label>
                  <Input
                    id="signin-password"
                    type="password"
                    placeholder="••••••••"
                    value={signInData.password}
                    onChange={(e) => setSignInData({ ...signInData, password: e.target.value })}
                    className="rounded-2xl"
                    required
                  />
                </div>
              </Card>

              <Button
                type="submit"
                className="w-full rounded-full"
                size="lg"
                disabled={loading}
              >
                {loading ? "Connexion..." : "Se connecter"}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="signup">
            <form onSubmit={handleSignUp} className="space-y-4">
              <Card className="p-6 rounded-3xl space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name">Nom complet</Label>
                  <Input
                    id="signup-name"
                    placeholder="Dr. Marie Martin"
                    value={signUpData.fullName}
                    onChange={(e) => setSignUpData({ ...signUpData, fullName: e.target.value })}
                    className="rounded-2xl"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="votre@email.com"
                    value={signUpData.email}
                    onChange={(e) => setSignUpData({ ...signUpData, email: e.target.value })}
                    className="rounded-2xl"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-password">Mot de passe</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="••••••••"
                    value={signUpData.password}
                    onChange={(e) => setSignUpData({ ...signUpData, password: e.target.value })}
                    className="rounded-2xl"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-profession">Profession</Label>
                  <Input
                    id="signup-profession"
                    placeholder="Ex: Vétérinaire, Éducateur canin"
                    value={signUpData.profession}
                    onChange={(e) => setSignUpData({ ...signUpData, profession: e.target.value })}
                    className="rounded-2xl"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-zone">Zone</Label>
                  <Input
                    id="signup-zone"
                    placeholder="Ex: Paris, Île-de-France"
                    value={signUpData.zone}
                    onChange={(e) => setSignUpData({ ...signUpData, zone: e.target.value })}
                    className="rounded-2xl"
                    required
                  />
                </div>
              </Card>

              <Button
                type="submit"
                className="w-full rounded-full"
                size="lg"
                disabled={loading}
              >
                {loading ? "Inscription..." : "Créer mon compte pro"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProfessionalAuth;
