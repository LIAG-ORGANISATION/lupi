import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ProfessionalSignUp = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    profession: "",
    zone: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Inscription réussie !",
      description: "Bienvenue dans la communauté Lupi Pro.",
    });
    navigate("/professional/welcome");
  };

  return (
    <div className="min-h-screen p-4 space-y-6 animate-fade-in bg-background">
      <div className="flex items-center gap-4 max-w-md mx-auto">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/")}
          className="rounded-full"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold text-title">Sign Up</h1>
      </div>

      <div className="max-w-md mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-title">
            Join our community of<br />professionals
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Card className="p-6 rounded-3xl space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                placeholder="John Doe"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="rounded-2xl"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Business Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="rounded-2xl"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="profession">Profession</Label>
              <Input
                id="profession"
                placeholder="Ex: Vétérinaire, Éducateur canin"
                value={formData.profession}
                onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
                className="rounded-2xl"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="zone">Zone</Label>
              <Input
                id="zone"
                placeholder="Ex: Paris, Île-de-France"
                value={formData.zone}
                onChange={(e) => setFormData({ ...formData, zone: e.target.value })}
                className="rounded-2xl"
                required
              />
            </div>
          </Card>

          <Card className="p-6 rounded-3xl space-y-4 bg-secondary/50">
            <h3 className="font-bold text-title">Subscription</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Pro</span>
                <span className="text-sm text-muted-foreground">€49/month</span>
              </div>
              <ul className="space-y-2 text-sm text-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary">✓</span>
                  <span>Unlimited connections</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">✓</span>
                  <span>Priority profile visibility</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">✓</span>
                  <span>Exclusive events access</span>
                </li>
              </ul>
            </div>
          </Card>

          <Button
            type="submit"
            className="w-full rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
            size="lg"
          >
            Start My Pro Subscription
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            By continuing, you agree to our{" "}
            <button type="button" className="text-primary underline">
              Terms of Service
            </button>{" "}
            and{" "}
            <button type="button" className="text-primary underline">
              Privacy Policy
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default ProfessionalSignUp;
