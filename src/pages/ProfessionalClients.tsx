import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import AuthGuard from "@/components/AuthGuard";
import { useToast } from "@/hooks/use-toast";

interface AccessRequest {
  id: string;
  status: string;
  dog: {
    name: string;
    breed: string;
  };
  owner: {
    full_name: string;
  };
}

const ProfessionalClients = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [requests, setRequests] = useState<AccessRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchRequests();
    }
  }, [user]);

  const fetchRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('dog_professional_access')
        .select(`
          id,
          status,
          dog:dogs(name, breed, owner:dog_owner_profiles(full_name))
        `)
        .eq('professional_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRequests(data as any || []);
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (requestId: string) => {
    try {
      const { error } = await supabase
        .from('dog_professional_access')
        .update({ status: 'approved', granted_at: new Date().toISOString() })
        .eq('id', requestId);

      if (error) throw error;

      toast({
        title: "Accès accordé",
        description: "Vous pouvez maintenant accéder aux données du chien",
      });

      fetchRequests();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'approuver la demande",
        variant: "destructive",
      });
    }
  };

  return (
    <AuthGuard requiredRole="professional">
      <div className="min-h-screen p-4 space-y-6 animate-fade-in bg-background pb-24">
        <div className="flex items-center gap-4 max-w-4xl mx-auto">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/professional/dashboard")}
            className="rounded-full"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold text-title">Mes Clients</h1>
        </div>

        <div className="max-w-4xl mx-auto space-y-4">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : requests.length === 0 ? (
            <Card className="lupi-card text-center">
              <p className="text-muted-foreground">Aucune demande pour le moment</p>
            </Card>
          ) : (
            requests.map((request) => (
              <Card key={request.id} className="lupi-card">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-title">{request.dog.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {request.dog.breed} • Propriétaire: {request.owner.full_name}
                    </p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      request.status === 'approved' ? 'bg-green-100 text-green-700' :
                      request.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {request.status === 'approved' ? 'Approuvé' :
                       request.status === 'pending' ? 'En attente' : 'Révoqué'}
                    </span>
                  </div>
                  {request.status === 'pending' && (
                    <Button
                      onClick={() => handleApprove(request.id)}
                      className="rounded-full"
                      size="sm"
                    >
                      Approuver
                    </Button>
                  )}
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </AuthGuard>
  );
};

export default ProfessionalClients;
