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
import { capitalizeWords } from "@/lib/utils";
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
    <div className="min-h-screen pb-20 animate-fade-in" style={{ background: '#FFFFFF' }}>
      {/* Header N26 style */}
      <div style={{ background: 'hsl(0 0% 96%)', padding: '20px 16px', marginBottom: '16px' }}>
        <div className="max-w-4xl mx-auto">
          <h1 className="text-foreground text-center" style={{ fontSize: '20px', fontWeight: 600 }}>
            Annuaire Pros
          </h1>
          <p className="text-secondary text-center" style={{ fontSize: '12px', fontWeight: 300, marginTop: '4px' }}>
            Trouvez des professionnels vérifiés près de chez vous
          </p>
        </div>
      </div>

      <div className="px-4 max-w-4xl mx-auto" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Rechercher un professionnel..."
            className="pl-10"
            style={{ borderRadius: '12px' }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Filters */}
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="w-full flex items-center justify-center gap-2"
          style={{ borderRadius: '12px' }}
        >
          <Filter className="h-4 w-4" strokeWidth={1.5} />
          Filtres
          {hasActiveFilters && (
            <Badge variant="default" className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center">
              !
            </Badge>
          )}
        </Button>

        {showFilters && (
          <div className="n26-card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div className="flex items-center justify-between">
              <h3 style={{ fontSize: '14px', fontWeight: 500 }}>Filtrer par</h3>
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  style={{ fontSize: '12px' }}
                >
                  <X className="h-3 w-3 mr-1" strokeWidth={1.5} />
                  Effacer
                </Button>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '12px', color: 'hsl(240 3% 57%)' }}>Profession</label>
                <Select value={selectedProfession} onValueChange={setSelectedProfession}>
                  <SelectTrigger style={{ borderRadius: '12px' }}>
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

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '12px', color: 'hsl(240 3% 57%)' }}>Spécialité</label>
                <Select value={selectedSpecialisation} onValueChange={setSelectedSpecialisation}>
                  <SelectTrigger style={{ borderRadius: '12px' }}>
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
          </div>
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

        {loading ? (
          <div className="text-center py-8" style={{ color: 'hsl(240 3% 57%)' }}>
            Chargement des professionnels...
          </div>
        ) : filteredProfessionals.length === 0 ? (
          <div className="text-center py-8" style={{ color: 'hsl(240 3% 57%)' }}>
            {searchQuery ? "Aucun professionnel trouvé pour votre recherche" : "Aucun professionnel disponible"}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {filteredProfessionals.map((pro) => (
              <div
                key={pro.user_id}
                className="n26-card cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => navigate(`/professional/${pro.user_id}`)}
                style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}
              >
                <div className="flex items-start gap-3">
                  <Avatar style={{ width: '48px', height: '48px', flexShrink: 0, borderRadius: '12px' }}>
                    <AvatarImage src={pro.photo_url || undefined} alt={pro.full_name} />
                    <AvatarFallback className="bg-secondary" style={{ color: 'hsl(240 6% 11%)', fontWeight: 600, borderRadius: '12px' }}>
                      {getInitials(pro.full_name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h3 style={{ fontSize: '14px', fontWeight: 500, color: 'hsl(240 6% 11%)' }}>{capitalizeWords(pro.full_name)}</h3>
                    <p style={{ fontSize: '12px', color: '#5B9D8C', fontWeight: 400 }}>{capitalizeWords(pro.professions?.label) || "Professionnel"}</p>
                    {pro.localisation && (
                      <div className="flex items-center gap-1 mt-1">
                        <MapPin className="h-3 w-3" style={{ color: 'hsl(240 3% 57%)' }} strokeWidth={1.5} />
                        <span style={{ fontSize: '12px', color: 'hsl(240 3% 57%)', fontWeight: 300 }}>{capitalizeWords(pro.localisation)}</span>
                      </div>
                    )}
                  </div>
                </div>

                {pro.specialisations_ids && pro.specialisations_ids.length > 0 && (
                  <div>
                    <p style={{ fontSize: '12px', color: 'hsl(240 3% 57%)', marginBottom: '8px' }}>Spécialités :</p>
                    <div className="flex flex-wrap gap-2">
                      {pro.specialisations_ids.slice(0, 3).map((specId) => (
                        <Badge
                          key={specId}
                          variant="secondary"
                          style={{ fontSize: '12px', backgroundColor: 'hsl(0 0% 96%)', borderRadius: '8px' }}
                        >
                          {capitalizeWords(specialisations[specId]) || specId}
                        </Badge>
                      ))}
                      {pro.specialisations_ids.length > 3 && (
                        <Badge variant="secondary" style={{ fontSize: '12px', backgroundColor: 'hsl(0 0% 96%)', borderRadius: '8px' }}>
                          +{pro.specialisations_ids.length - 3}
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-2 gap-3">
                  <div className="flex-1 min-w-0">
                    <p style={{ fontSize: '12px', color: 'hsl(240 3% 57%)' }}>Tarif horaire :</p>
                    <span style={{ fontSize: '14px', fontWeight: 500, color: 'hsl(240 6% 11%)' }}>
                      {pro.tarifs ? `${pro.tarifs} €` : "Sur demande"}
                    </span>
                  </div>
                  <Button
                    onClick={(e) => handleSendMessage(e, pro.user_id)}
                    className="flex-shrink-0 btn-action"
                    size="sm"
                  >
                    <MessageCircle className="h-4 w-4 mr-2" strokeWidth={1.5} />
                    Message
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Professionals;
