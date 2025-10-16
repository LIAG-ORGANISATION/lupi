import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Share2, Star, ThumbsUp, MessageCircle, Clock, DollarSign, Award, Globe, Phone, Mail } from "lucide-react";

const ProfessionalProfile = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const professional = {
    name: "Olivia Bennett",
    profession: "Spécialiste en soins animaliers",
    location: "Paris, France",
    phone: "+33 6 12 34 56 78",
    email: "olivia.bennett@example.com",
    phoneVisible: true,
    emailVisible: true,
    rating: 4.9,
    clients: "100+",
    years: 5,
    specializations: ["Modification comportementale", "Dressage de chiots", "Gestion de l'agressivité"],
    bio: "Olivia est une comportementaliste canine certifiée avec plus de 5 ans d'expérience aidant les chiens et leurs propriétaires à construire des relations plus fortes. Spécialisée dans la modification comportementale, le dressage de chiots et la gestion de l'agressivité, elle utilise des techniques de renforcement positif pour obtenir des résultats durables.",
    certifications: [
      "Éducateur canin professionnel certifié (CPDT-KA)",
      "Consultant en comportement canin certifié (CBCC-KA)",
    ],
    languages: ["Français", "Anglais"],
    services: [
      { name: "Consultation comportementale", duration: "60 min" },
      { name: "Programme de dressage pour chiots", duration: "4 semaines" },
      { name: "Programme de gestion de l'agressivité", duration: "8 semaines" },
    ],
    pricing: "60 € / heure",
    reviews: [
      {
        name: "Sophie Martin",
        date: "Il y a 2 mois",
        rating: 5,
        text: "Olivia est une éducatrice extraordinaire ! Notre chien, Max, avait des problèmes comportementaux, et elle nous a aidés à les résoudre efficacement. Nous lui sommes très reconnaissants pour son expertise et sa patience.",
        likes: 2,
      },
      {
        name: "Thomas Dubois",
        date: "Il y a 4 mois",
        rating: 5,
        text: "Olivia est fantastique ! Elle nous a aidés à dresser notre nouveau chiot, Luna, et nous a fourni des conseils précieux. Nous recommandons vivement ses services.",
        likes: 1,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border p-4 flex items-center justify-between z-10">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="rounded-full"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
          >
            <Share2 className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-4 space-y-6">
          {/* Profile Header */}
          <div className="text-center space-y-4">
            <div className="w-32 h-32 rounded-full bg-secondary mx-auto flex items-center justify-center">
              <Avatar className="w-32 h-32">
                <AvatarFallback className="bg-secondary text-title text-2xl font-bold">
                  {professional.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-title">{professional.name}</h1>
              <p className="text-sm text-primary font-medium">{professional.profession}</p>
              <p className="text-sm text-muted-foreground">{professional.location}</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <Card className="p-4 rounded-2xl text-center">
              <div className="text-2xl font-bold text-title">{professional.rating}</div>
              <div className="text-xs text-muted-foreground">Note</div>
            </Card>
            <Card className="p-4 rounded-2xl text-center">
              <div className="text-2xl font-bold text-title">{professional.clients}</div>
              <div className="text-xs text-muted-foreground">Clients</div>
            </Card>
            <Card className="p-4 rounded-2xl text-center">
              <div className="text-2xl font-bold text-title">{professional.years}</div>
              <div className="text-xs text-muted-foreground">Années</div>
            </Card>
          </div>

          {/* Specializations */}
          <div className="flex flex-wrap gap-2">
            {professional.specializations.map((spec, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-secondary rounded-full text-sm font-medium"
              >
                {spec}
              </span>
            ))}
          </div>

          {/* Bio */}
          <Card className="lupi-card">
            <p className="text-sm text-foreground leading-relaxed">{professional.bio}</p>
          </Card>

          {/* Certifications */}
          <Card className="lupi-card space-y-3">
            <h3 className="font-bold text-title flex items-center gap-2">
              <Award className="h-5 w-5 text-primary" />
              Certifications
            </h3>
            <div className="space-y-2">
              {professional.certifications.map((cert, index) => (
                <div key={index} className="flex items-start gap-3">
                  <Award className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                  <span className="text-sm">{cert}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Languages */}
          <Card className="lupi-card space-y-3">
            <h3 className="font-bold text-title flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary" />
              Langues
            </h3>
            <div className="space-y-2">
              {professional.languages.map((lang, index) => (
                <div key={index} className="flex items-center gap-3">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{lang}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Services */}
          <Card className="lupi-card space-y-3">
            <h3 className="font-bold text-title flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Services
            </h3>
            <div className="space-y-3">
              {professional.services.map((service, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                    <Clock className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{service.name}</p>
                    <p className="text-xs text-muted-foreground">{service.duration}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Pricing */}
          <Card className="lupi-card">
            <h3 className="font-bold text-title flex items-center gap-2 mb-3">
              <DollarSign className="h-5 w-5 text-primary" />
              Tarifs
            </h3>
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span className="text-lg font-semibold text-title">{professional.pricing}</span>
            </div>
          </Card>

          {/* Reviews */}
          <Card className="lupi-card space-y-4">
            <h3 className="font-bold text-title flex items-center gap-2">
              <Star className="h-5 w-5 text-primary" />
              Avis
            </h3>
            <div className="space-y-4">
              {professional.reviews.map((review, index) => (
                <div key={index} className="space-y-2 pb-4 border-b border-border last:border-0">
                  <div className="flex items-start gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className="bg-secondary">
                        {review.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-semibold text-sm">{review.name}</p>
                        <p className="text-xs text-muted-foreground">{review.date}</p>
                      </div>
                      <div className="flex gap-0.5 mb-2">
                        {Array.from({ length: review.rating }).map((_, i) => (
                          <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <p className="text-sm text-foreground leading-relaxed">{review.text}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary">
                          <ThumbsUp className="h-3 w-3" />
                          <span>{review.likes}</span>
                        </button>
                        <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary">
                          <MessageCircle className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Actions */}
          <div className="space-y-3 pb-8">
            <Button
              className="w-full rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
              size="lg"
            >
              Prendre RDV
            </Button>
            {professional.phoneVisible && professional.phone && (
              <Button
                variant="outline"
                className="w-full rounded-full"
                size="lg"
                onClick={() => window.location.href = `tel:${professional.phone}`}
              >
                <Phone className="h-5 w-5 mr-2" />
                Appeler
              </Button>
            )}
            {professional.emailVisible && professional.email && (
              <Button
                variant="outline"
                className="w-full rounded-full"
                size="lg"
                onClick={() => window.location.href = `mailto:${professional.email}`}
              >
                <Mail className="h-5 w-5 mr-2" />
                Envoyer un email
              </Button>
            )}
            <Button
              variant="outline"
              className="w-full rounded-full"
              size="lg"
            >
              Envoyer un message
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalProfile;
