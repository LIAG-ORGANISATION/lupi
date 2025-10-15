import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, FileText, Image as ImageIcon, Trash2, ExternalLink, Share2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useAuth } from "@/hooks/useAuth";

interface Document {
  id: string;
  dog_id: string;
  owner_id: string;
  title: string | null;
  file_name: string;
  file_type: string;
  file_size: number | null;
  storage_path: string;
  created_at: string;
  dogs?: {
    name: string;
  };
}

const GuardianDocuments = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, userRole, loading: authLoading, isProfessional } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const userId = user?.id;
  
  const [documents, setDocuments] = useState<Document[]>([]);
  const [dogs, setDogs] = useState<any[]>([]);
  const [selectedDog, setSelectedDog] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; doc: Document | null }>({ open: false, doc: null });
  const [shareDialog, setShareDialog] = useState<{ open: boolean; doc: Document | null }>({ open: false, doc: null });
  const [sharedProfessionals, setSharedProfessionals] = useState<any[]>([]);

  useEffect(() => {
    if (!authLoading && user && userId && userRole !== null) {
      fetchDogs();
      fetchDocuments();
    } else if (!authLoading && !user) {
      // Si pas d'utilisateur après le chargement, rediriger vers auth
      navigate("/auth");
    }
  }, [authLoading, user, userRole]);

  const fetchDogs = async () => {
    try {
      if (isProfessional) {
        // Fetch shared dogs for pros
        const { data, error } = await supabase
          .from("patients_for_pro")
          .select("*");
        
        if (error) throw error;
        setDogs(data || []);
        if (data && data.length > 0) {
          setSelectedDog(data[0].id);
        }
      } else {
        // Fetch own dogs for owners
        const { data, error } = await supabase
          .from("dogs")
          .select("*")
          .eq("owner_id", userId);
        
        if (error) throw error;
        setDogs(data || []);
        if (data && data.length > 0) {
          setSelectedDog(data[0].id);
        }
      }
    } catch (error) {
      console.error("Error fetching dogs:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les chiens.",
        variant: "destructive",
      });
    }
  };

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("dog_documents")
        .select(`
          *,
          dogs (
            name
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setDocuments(data || []);
    } catch (error) {
      console.error("Error fetching documents:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les documents.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = () => {
    if (!selectedDog) {
      toast({
        title: "Aucun chien sélectionné",
        description: "Veuillez sélectionner un chien avant d'ajouter un document.",
        variant: "destructive",
      });
      return;
    }
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
    const maxSize = 10 * 1024 * 1024; // 10 MB

    setUploading(true);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // Validation
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Format non pris en charge",
          description: "Utilisez une image (JPG/PNG) ou un PDF.",
          variant: "destructive",
        });
        continue;
      }

      if (file.size > maxSize) {
        toast({
          title: "Fichier trop volumineux",
          description: `${file.name} dépasse la limite de 10 Mo.`,
          variant: "destructive",
        });
        continue;
      }

      try {
        // Generate unique file path
        const fileExt = file.name.split('.').pop();
        const fileName = `${crypto.randomUUID()}.${fileExt}`;
        const storagePath = `${userId}/${selectedDog}/${fileName}`;

        // Upload to Storage
        const { error: uploadError } = await supabase.storage
          .from("dog-documents")
          .upload(storagePath, file);

        if (uploadError) throw uploadError;

        // Save metadata to database
        const { error: dbError } = await supabase
          .from("dog_documents")
          .insert({
            dog_id: selectedDog,
            owner_id: userId,
            title: file.name.replace(`.${fileExt}`, ""),
            file_name: file.name,
            file_type: file.type,
            file_size: file.size,
            storage_path: storagePath,
          });

        if (dbError) throw dbError;

        toast({
          title: "Document ajouté avec succès",
          description: file.name,
        });
      } catch (error) {
        console.error("Error uploading file:", error);
        toast({
          title: "Erreur d'upload",
          description: `Impossible d'ajouter ${file.name}.`,
          variant: "destructive",
        });
      }
    }

    setUploading(false);
    fetchDocuments();
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleOpenDocument = async (doc: Document) => {
    try {
      const { data } = supabase.storage
        .from("dog-documents")
        .getPublicUrl(doc.storage_path);

      if (data?.publicUrl) {
        window.open(data.publicUrl, "_blank");
      }
    } catch (error) {
      console.error("Error opening document:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'ouvrir le document.",
        variant: "destructive",
      });
    }
  };

  const handleShare = async (doc: Document) => {
    try {
      // Fetch professionals who have access to this dog
      const { data, error } = await supabase
        .from("dog_shares")
        .select(`
          id,
          status,
          professionals (
            user_id,
            full_name,
            profession,
            avatar_url
          )
        `)
        .eq("dog_id", doc.dog_id)
        .eq("status", "accepted");

      if (error) throw error;
      
      setSharedProfessionals(data || []);
      setShareDialog({ open: true, doc });
    } catch (error) {
      console.error("Error fetching shared professionals:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger la liste des professionnels.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    if (!deleteDialog.doc) return;

    try {
      // Delete from Storage
      const { error: storageError } = await supabase.storage
        .from("dog-documents")
        .remove([deleteDialog.doc.storage_path]);

      if (storageError) throw storageError;

      // Delete from database
      const { error: dbError } = await supabase
        .from("dog_documents")
        .delete()
        .eq("id", deleteDialog.doc.id);

      if (dbError) throw dbError;

      toast({
        title: "Document supprimé",
        description: "Le document a été supprimé avec succès.",
      });

      fetchDocuments();
      setDeleteDialog({ open: false, doc: null });
    } catch (error) {
      console.error("Error deleting document:", error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le document.",
        variant: "destructive",
      });
    }
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return "N/A";
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith("image/")) {
      return <ImageIcon className="h-8 w-8 text-[#444444]" />;
    }
    return <FileText className="h-8 w-8 text-[#444444]" />;
  };

  // Vérifier l'authentification
  if (authLoading || userRole === null) {
    return (
      <div className="min-h-screen p-4 flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Chargement...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen p-4 space-y-6 animate-fade-in bg-background pb-24">
      <div className="flex items-center gap-4 max-w-4xl mx-auto">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
          className="rounded-full"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold text-[#5C0A0A]">Documents</h1>
      </div>

      <div className="max-w-4xl mx-auto space-y-4">
        {/* Dog selector + Add button */}
        {!isProfessional && (
          <div className="flex gap-3 items-center">
            <select
              value={selectedDog}
              onChange={(e) => setSelectedDog(e.target.value)}
              className="flex-1 h-12 px-4 rounded-full border border-input bg-background text-foreground"
            >
              <option value="">Sélectionner un chien</option>
              {dogs.map((dog) => (
                <option key={dog.id} value={dog.id}>
                  {dog.name}
                </option>
              ))}
            </select>

            <Button
              onClick={handleFileSelect}
              disabled={!selectedDog || uploading}
              className="rounded-full bg-[#FF6B6B] hover:bg-[#FF6B6B]/90 text-white border border-white/20 shadow-lg"
            >
              <Plus className="h-5 w-5 mr-2" />
              Ajouter un document
            </Button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,application/pdf"
              multiple
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        )}

        {/* Documents list */}
        {loading ? (
          <Card className="p-8 rounded-3xl text-center">
            <p className="text-muted-foreground">Chargement...</p>
          </Card>
        ) : documents.length === 0 ? (
          <Card className="p-8 rounded-3xl text-center">
            <p className="text-muted-foreground">Aucun document</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {documents.map((doc) => (
              <Card key={doc.id} className="p-4 rounded-3xl">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1">
                    {getFileIcon(doc.file_type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-[#5C0A0A] truncate">
                      {doc.title || doc.file_name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(doc.created_at)} • {doc.file_type.split("/")[1].toUpperCase()} • {formatFileSize(doc.file_size)}
                    </p>
                    {doc.dogs?.name && (
                      <p className="text-sm text-muted-foreground">
                        Chien: {doc.dogs.name}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-2 flex-shrink-0">
                    <Button
                      onClick={() => handleShare(doc)}
                      size="sm"
                      variant="ghost"
                      className="rounded-full"
                      title="Partager"
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>

                    <Button
                      onClick={() => handleOpenDocument(doc)}
                      size="sm"
                      variant="ghost"
                      className="rounded-full"
                      title="Afficher"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>

                    {!isProfessional && doc.owner_id === userId && (
                      <Button
                        onClick={() => setDeleteDialog({ open: true, doc })}
                        size="sm"
                        variant="ghost"
                        className="rounded-full text-destructive"
                        title="Supprimer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Delete confirmation dialog */}
      <AlertDialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open, doc: null })}>
        <AlertDialogContent className="rounded-3xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer ce document ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Le document sera définitivement supprimé.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-full">Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="rounded-full bg-destructive hover:bg-destructive/90"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Share dialog */}
      <AlertDialog open={shareDialog.open} onOpenChange={(open) => setShareDialog({ open, doc: null })}>
        <AlertDialogContent className="rounded-3xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Document partagé avec</AlertDialogTitle>
            <AlertDialogDescription>
              Ce document est accessible par les professionnels ayant accès à {shareDialog.doc?.dogs?.name || "ce chien"}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="space-y-3 py-4">
            {sharedProfessionals.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                Aucun professionnel n'a accès à ce chien pour le moment.
              </p>
            ) : (
              sharedProfessionals.map((share) => (
                <div key={share.id} className="flex items-center gap-3 p-3 rounded-2xl bg-muted/50">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    {share.professionals?.avatar_url ? (
                      <img 
                        src={share.professionals.avatar_url} 
                        alt={share.professionals?.full_name}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-sm font-semibold text-primary">
                        {share.professionals?.full_name?.charAt(0)}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{share.professionals?.full_name}</p>
                    <p className="text-xs text-muted-foreground">{share.professionals?.profession}</p>
                  </div>
                </div>
              ))
            )}
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-full">Fermer</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default GuardianDocuments;
