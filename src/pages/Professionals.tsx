import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { Search, MapPin, MessageCircle, Filter, X } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ProfessionalData {
  user_id: string;
  full_name: string;
  email: string;
  phone: string | null;
  profession_id: string | null;
  specialisations_ids: string[] | null;
  localisation: string | null;
  tarifs: string | null;
  photo_url: string | null;
  professions?: {
    label: string;
  };
}

const Professionals = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [professionals, setProfessionals] = useState<ProfessionalData[]>([]);
  const [professions, setProfessions] = useState<Array<{ id: string; label: string }>>([]);
  const [specialisations, setSpecialisations] = useState<Record<string, string>>({});
  const [specialisationsList, setSpecialisationsList] = useState<Array<{ id: string; label: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProfession, setSelectedProfession] = useState<string>("");
  const [selectedSpecialisation, setSelectedSpecialisation] = useState<string>("");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadProfessionals();
  }, []);

  const loadProfessionals = async () => {
    try {
      // Load professions
      const { data: profsData } = await supabase
        .from("professions")
        .select("id, label")
        .order("label");
      
      setProfessions(profsData || []);

      // Load all specialisations
      const { data: specsData } = await supabase
        .from("specialisations")
        .select("id, label")
        .order("label");
      
      const specsMap: Record<string, string> = {};
      specsData?.forEach(spec => {
        specsMap[spec.id] = spec.label;
      });
      setSpecialisations(specsMap);
      setSpecialisationsList(specsData || []);

      // Load professionals with their profession
      const { data, error } = await supabase
        .from("professionals")
        .select(`
          user_id,
          full_name,
          email,
          phone,
          profession_id,
          specialisations_ids,
          localisation,
          tarifs,
          photo_url,
          professions (
            label
          )
        `)
        .order("full_name");

      if (error) throw error;
      setProfessionals(data || []);
    } catch (error) {
      console.error("Error loading professionals:", error);
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const filteredProfessionals = professionals.filter((pro) => {
    // Search filter
    const searchLower = searchQuery.toLowerCase();
    const nameMatch = pro.full_name.toLowerCase().includes(searchLower);
    const professionMatch = pro.professions?.label.toLowerCase().includes(searchLower);
    const locationMatch = pro.localisation?.toLowerCase().includes(searchLower);
    const searchMatch = !searchQuery || nameMatch || professionMatch || locationMatch;

    // Profession filter
    const professionFilterMatch = !selectedProfession || pro.profession_id === selectedProfession;

    // Specialisation filter
    const specialisationFilterMatch = !selectedSpecialisation || 
      (pro.specialisations_ids && pro.specialisations_ids.includes(selectedSpecialisation));

    return searchMatch && professionFilterMatch && specialisationFilterMatch;
  });

  const clearFilters = () => {
    setSelectedProfession("");
    setSelectedSpecialisation("");
    setSearchQuery("");
  };

  const hasActiveFilters = selectedProfession || selectedSpecialisation || searchQuery;

  const handleSendMessage = async (e: React.MouseEvent, professionalId: string) => {
    e.stopPropagation();
    
    if (!user) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour envoyer un message",
        variant: "destructive",
      });
      return;
    }

    try {
      // Check if conversation already exists
      const { data: existingConv, error: searchError } = await supabase
        .from("conversations")
        .select("id")
        .eq("owner_id", user.id)
        .eq("professional_id", professionalId)
        .is("dog_id", null)
        .maybeSingle();

      if (searchError && searchError.code !== "PGRST116") throw searchError;

      let conversationId = existingConv?.id;

      // Create conversation if it doesn't exist
      if (!conversationId) {
        const { data: newConv, error: createError } = await supabase
          .from("conversations")
          .insert({
            owner_id: user.id,
            professional_id: professionalId,
            dog_id: null,
          })
          .select("id")
          .single();

        if (createError) throw createError;
        conversationId = newConv.id;
      }

      // Navigate to messages page
      navigate("/guardian/messages");
    } catch (error) {
      console.error("Error creating conversation:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'ouvrir la conversation",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen p-4 space-y-6 animate-fade-in bg-background">
      <div>
        <h1 className="text-2xl font-bold text-title mb-2">Annuaire Pros</h1>
        <p className="text-sm text-muted-foreground">
          Trouvez des professionnels vérifiés près de chez vous
        </p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          placeholder="Rechercher un professionnel..."
          className="pl-10 rounded-2xl"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Filters */}
      <div className="space-y-3">
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="w-full rounded-2xl flex items-center justify-center gap-2"
        >
          <Filter className="h-4 w-4" />
          Filtres
          {hasActiveFilters && (
            <Badge variant="default" className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center">
              !
            </Badge>
          )}
        </Button>

        {showFilters && (
          <Card className="lupi-card space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm">Filtrer par</h3>
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-xs"
                >
                  <X className="h-3 w-3 mr-1" />
                  Effacer
                </Button>
              )}
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs text-muted-foreground mb-2 block">Profession</label>
                <Select value={selectedProfession} onValueChange={setSelectedProfession}>
                  <SelectTrigger className="rounded-2xl">
                    <SelectValue placeholder="Toutes les professions" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les professions</SelectItem>
                    {professions.map((prof) => (
                      <SelectItem key={prof.id} value={prof.id}>
                        {prof.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-xs text-muted-foreground mb-2 block">Spécialité</label>
                <Select value={selectedSpecialisation} onValueChange={setSelectedSpecialisation}>
                  <SelectTrigger className="rounded-2xl">
                    <SelectValue placeholder="Toutes les spécialités" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les spécialités</SelectItem>
                    {specialisationsList.map((spec) => (
                      <SelectItem key={spec.id} value={spec.id}>
                        {spec.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>
        )}

        {hasActiveFilters && !showFilters && (
          <div className="flex flex-wrap gap-2">
            {searchQuery && (
              <Badge variant="secondary" className="gap-1">
                Recherche: {searchQuery}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => setSearchQuery("")}
                />
              </Badge>
            )}
            {selectedProfession && (
              <Badge variant="secondary" className="gap-1">
                {professions.find(p => p.id === selectedProfession)?.label}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => setSelectedProfession("")}
                />
              </Badge>
            )}
            {selectedSpecialisation && (
              <Badge variant="secondary" className="gap-1">
                {specialisations[selectedSpecialisation]}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => setSelectedSpecialisation("")}
                />
              </Badge>
            )}
          </div>
        )}
      </div>

      {loading ? (
        <div className="text-center py-8 text-muted-foreground">
          Chargement des professionnels...
        </div>
      ) : filteredProfessionals.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          {searchQuery ? "Aucun professionnel trouvé pour votre recherche" : "Aucun professionnel disponible"}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredProfessionals.map((pro) => (
            <Card
              key={pro.user_id}
              className="lupi-card cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => navigate(`/professional/${pro.user_id}`)}
            >
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Avatar className="w-12 h-12 flex-shrink-0">
                    <AvatarImage src={pro.photo_url || undefined} alt={pro.full_name} />
                    <AvatarFallback className="bg-secondary text-title font-semibold">
                      {getInitials(pro.full_name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-title truncate">{pro.full_name}</h3>
                    <p className="text-sm text-primary">{pro.professions?.label || "Professionnel"}</p>
                    {pro.localisation && (
                      <div className="flex items-center gap-1 mt-1">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{pro.localisation}</span>
                      </div>
                    )}
                  </div>
                </div>

                {pro.specialisations_ids && pro.specialisations_ids.length > 0 && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-2">Spécialités :</p>
                    <div className="flex flex-wrap gap-2">
                      {pro.specialisations_ids.slice(0, 3).map((specId) => (
                        <Badge
                          key={specId}
                          variant="secondary"
                          className="bg-secondary text-xs"
                        >
                          {specialisations[specId] || specId}
                        </Badge>
                      ))}
                      {pro.specialisations_ids.length > 3 && (
                        <Badge variant="secondary" className="bg-secondary text-xs">
                          +{pro.specialisations_ids.length - 3}
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-2 gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground">Tarif horaire :</p>
                    <span className="text-sm font-medium text-title">
                      {pro.tarifs ? `${pro.tarifs} €` : "Sur demande"}
                    </span>
                  </div>
                  <Button
                    onClick={(e) => handleSendMessage(e, pro.user_id)}
                    className="rounded-full bg-primary hover:bg-primary/90 flex-shrink-0"
                    size="sm"
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Message
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Professionals;
