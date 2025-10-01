import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Mail, MessageCircle, FileText, Shield } from "lucide-react";

const SupportFAQ = () => {
  const faqs = [
    {
      question: "Comment ajouter un chien dans LupiApp ?",
      answer: "Allez dans l'onglet **Chiens**, puis appuyez sur **Ajouter un chien** et complétez les informations demandées."
    },
    {
      question: "Comment partager le profil de mon chien avec un professionnel ?",
      answer: "Ouvrez le profil de votre chien, puis utilisez l'option **Partager avec un pro** pour choisir un professionnel et définir les autorisations."
    },
    {
      question: "Je suis professionnel, où voir mes patients ?",
      answer: "Si vous êtes connecté en tant que professionnel, l'onglet **Patients** vous permet de consulter uniquement les chiens que leurs propriétaires vous ont partagés."
    },
    {
      question: "Quels types de documents puis-je ajouter ?",
      answer: "Vous pouvez importer des images (JPG, PNG) et des fichiers PDF directement dans l'onglet **Documents partagés** du profil de votre chien."
    },
    {
      question: "Mes données et celles de mon chien sont-elles sécurisées ?",
      answer: "Oui. Toutes les données sont stockées sur des serveurs sécurisés et vous contrôlez les partages avec les professionnels."
    }
  ];

  const handleEmailSupport = () => {
    window.location.href = "mailto:support@lupiapp.com";
  };

  return (
    <div className="min-h-screen p-4 space-y-6 animate-fade-in pb-24">
      {/* En-tête */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-title">Support & FAQ</h1>
        <p className="text-sm text-muted-foreground">
          Besoin d'aide ? Consultez nos réponses aux questions fréquentes ou contactez-nous.
        </p>
      </div>

      {/* Bloc FAQ */}
      <Card className="p-4 rounded-2xl">
        <h2 className="text-lg font-bold text-title mb-4">Questions fréquentes</h2>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Card>

      {/* Bloc Contact */}
      <Card className="p-6 rounded-2xl space-y-4">
        <h2 className="text-lg font-bold text-title mb-4">Contactez-nous</h2>
        
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
            <Mail className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1">
            <p className="font-medium mb-2">Écrivez-nous un e-mail</p>
            <Button 
              onClick={handleEmailSupport}
              className="w-full sm:w-auto"
            >
              Contacter le support
            </Button>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
            <MessageCircle className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1">
            <p className="font-medium mb-2">Besoin d'assistance rapide ?</p>
            <Button 
              variant="outline"
              className="w-full sm:w-auto"
            >
              Envoyer un message
            </Button>
          </div>
        </div>
      </Card>

      {/* Bloc Ressources */}
      <Card className="p-6 rounded-2xl">
        <h2 className="text-lg font-bold text-title mb-4">Ressources</h2>
        <div className="space-y-3">
          <button className="flex items-center gap-3 w-full text-left p-3 rounded-lg hover:bg-secondary/50 transition-colors">
            <FileText className="h-5 w-5 text-primary" />
            <span className="font-medium">Conditions générales d'utilisation</span>
          </button>
          <button className="flex items-center gap-3 w-full text-left p-3 rounded-lg hover:bg-secondary/50 transition-colors">
            <Shield className="h-5 w-5 text-primary" />
            <span className="font-medium">Politique de confidentialité</span>
          </button>
        </div>
      </Card>
    </div>
  );
};

export default SupportFAQ;
