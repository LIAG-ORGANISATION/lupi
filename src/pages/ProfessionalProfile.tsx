import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Share2, Star, ThumbsUp, MessageCircle, Clock, DollarSign, Award, Globe, Phone } from "lucide-react";

const ProfessionalProfile = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const professional = {
    name: "Olivia Bennett",
    profession: "Pet Care Specialist",
    location: "San Francisco, CA",
    phone: "+33 6 12 34 56 78",
    phoneVisible: true,
    rating: 4.9,
    clients: "100+",
    years: 5,
    specializations: ["Behavior Modification", "Puppy Training", "Aggression Management"],
    bio: "Olivia is a certified canine behaviorist with over 5 years of experience helping dogs and their owners build stronger relationships. Specializing in behavior modification, puppy training, and aggression management, Alex uses positive reinforcement techniques to achieve lasting results.",
    certifications: [
      "Certified Professional Dog Trainer (CPDT-KA)",
      "Certified Behavior Consultant Canine (CBCC-KA)",
    ],
    languages: ["English", "Spanish"],
    services: [
      { name: "Behavior Consultation", duration: "60 min" },
      { name: "Puppy Training Program", duration: "4 weeks" },
      { name: "Aggression Management Program", duration: "8 weeks" },
    ],
    pricing: "$150 / hour",
    reviews: [
      {
        name: "Sophia Carter",
        date: "2 months ago",
        rating: 5,
        text: "Alex is an amazing trainer! Our dog, Max, had some behavioral issues, and Alex helped us address them effectively. We're so grateful for their expertise and patience.",
        likes: 2,
      },
      {
        name: "Ethan Walker",
        date: "4 months ago",
        rating: 5,
        text: "Alex is fantastic! They helped us train our new puppy, Luna, and provided valuable guidance. We highly recommend their services.",
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
            onClick={() => navigate("/professionals")}
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
              <div className="text-xs text-muted-foreground">Rating</div>
            </Card>
            <Card className="p-4 rounded-2xl text-center">
              <div className="text-2xl font-bold text-title">{professional.clients}</div>
              <div className="text-xs text-muted-foreground">Clients</div>
            </Card>
            <Card className="p-4 rounded-2xl text-center">
              <div className="text-2xl font-bold text-title">{professional.years}</div>
              <div className="text-xs text-muted-foreground">Years</div>
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
              Languages
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
              Pricing
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
              Reviews
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
