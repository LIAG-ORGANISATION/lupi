import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Plus, FileText, Image as ImageIcon, Download, Share2, Edit2, Trash2, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Document {
  id: string;
  title: string;
  file_name: string;
  file_type: string;
  storage_path: string;
  created_at: string;
  file_size?: number;
}

const VaccinationPassport = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isProfessional } = useAuth();
  const { id: dogId } = useParams();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [dogData, setDogData] = useState<any>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; docId: string | null }>({ open: false, docId: null });
  const [renameDialog, setRenameDialog] = useState<{ open: boolean; docId: string | null; currentName: string }>({ 
    open: false, 
    docId: null, 
    currentName: "" 
  });
  const [shareDialog, setShareDialog] = useState<{ open: boolean; docId: string | null }>({ open: false, docId: null });
  const [newTitle, setNewTitle] = useState("");
  const [professionals, setProfessionals] = useState<any[]>([]);

  useEffect(() => {
    if (dogId && user) {
      fetchDogData();
      fetchDocuments();
      if (!isProfessional) {
        fetchSharedProfessionals();
      }
    }
  }, [dogId, user]);

  const fetchDogData = async () => {
    try {
      const { data, error } = await supabase
        .from('dogs')
        .select('*')
        .eq('id', dogId)
        .maybeSingle();

      if (error) throw error;
      setDogData(data);
    } catch (error) {
      console.error('Error fetching dog data:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les données du chien.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchDocuments = async () => {
    try {
      const { data, error } = await supabase
        .from('dog_documents')
        .select('*')
        .eq('dog_id', dogId)
        .eq('category', 'vaccination')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDocuments(data || []);
    } catch (error) {
      console.error('Error fetching documents:', error);
    }
  };

  const fetchSharedProfessionals = async () => {
    try {
      const { data, error } = await supabase
        .from('dog_shares')
        .select(`
          id,
          professional_id,
          professionals (
            full_name,
            profession
          )
        `)
        .eq('dog_id', dogId)
        .eq('status', 'accepted');

      if (error) throw error;
      setProfessionals(data || []);
    } catch (error) {
      console.error('Error fetching professionals:', error);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user || !dogId) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Type de fichier non supporté",
        description: "Seuls les fichiers JPG, PNG et PDF sont acceptés.",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "Fichier trop volumineux",
        description: "La taille maximale est de 10 Mo.",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${dogId}/${crypto.randomUUID()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('dog-documents')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Save document metadata
      const { error: insertError } = await supabase
        .from('dog_documents')
        .insert({
          dog_id: dogId,
          owner_id: user.id,
          title: file.name,
          file_name: file.name,
          file_type: file.type,
          file_size: file.size,
          storage_path: fileName,
          category: 'vaccination',
        });

      if (insertError) throw insertError;

      toast({
        title: "Document ajouté",
        description: "Le document a été ajouté au passeport vaccinal.",
      });

      fetchDocuments();
    } catch (error) {
      console.error('Error uploading document:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter le document.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleOpenDocument = async (doc: Document) => {
    try {
      const { data, error } = await supabase.storage
        .from('dog-documents')
        .createSignedUrl(doc.storage_path, 300); // 5 minutes

      if (error) throw error;
      if (data?.signedUrl) {
        window.open(data.signedUrl, '_blank');
      }
    } catch (error) {
      console.error('Error opening document:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ouvrir le document.",
        variant: "destructive",
      });
    }
  };

  const handleDownload = async (doc: Document) => {
    try {
      const { data, error } = await supabase.storage
        .from('dog-documents')
        .download(doc.storage_path);

      if (error) throw error;

      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = doc.file_name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Téléchargement réussi",
        description: "Le document a été téléchargé.",
      });
    } catch (error) {
      console.error('Error downloading document:', error);
      toast({
        title: "Erreur",
        description: "Impossible de télécharger le document.",
        variant: "destructive",
      });
    }
  };

  const handleRename = async () => {
    if (!renameDialog.docId || !newTitle.trim()) return;

    try {
      const { error } = await supabase
        .from('dog_documents')
        .update({ title: newTitle.trim() })
        .eq('id', renameDialog.docId);

      if (error) throw error;

      toast({
        title: "Document renommé",
        description: "Le nom du document a été modifié.",
      });

      fetchDocuments();
      setRenameDialog({ open: false, docId: null, currentName: "" });
      setNewTitle("");
    } catch (error) {
      console.error('Error renaming document:', error);
      toast({
        title: "Erreur",
        description: "Impossible de renommer le document.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    if (!deleteDialog.docId) return;

    try {
      const doc = documents.find(d => d.id === deleteDialog.docId);
      if (!doc) return;

      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('dog-documents')
        .remove([doc.storage_path]);

      if (storageError) throw storageError;

      // Delete from database
      const { error: dbError } = await supabase
        .from('dog_documents')
        .delete()
        .eq('id', deleteDialog.docId);

      if (dbError) throw dbError;

      toast({
        title: "Document supprimé",
        description: "Le document a été supprimé du passeport.",
      });

      fetchDocuments();
      setDeleteDialog({ open: false, docId: null });
    } catch (error) {
      console.error('Error deleting document:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le document.",
        variant: "destructive",
      });
    }
  };

  const handleShare = () => {
    if (professionals.length === 0) {
      toast({
        title: "Aucun professionnel",
        description: "Partagez d'abord le profil du chien avec un professionnel.",
      });
      setShareDialog({ open: false, docId: null });
      return;
    }

    toast({
      title: "Bientôt disponible",
      description: "Le partage de documents sera disponible prochainement.",
    });
    setShareDialog({ open: false, docId: null });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDECEC]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!dogData) {
    return (
      <div className="min-h-screen p-4 bg-[#FDECEC]">
        <p className="text-center text-muted-foreground">Chien non trouvé</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 space-y-6 animate-fade-in pb-24 bg-background">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(`/dogs/${dogId}`)}
          className="rounded-full"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold text-title">Passeport vaccinal</h1>
      </div>

      {/* Dog Info Header */}
      <Card className="lupi-card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px', textAlign: 'center' }}>
        <Avatar className="w-24 h-24 mx-auto">
          {dogData.avatar_url && <AvatarImage src={dogData.avatar_url} />}
          <AvatarFallback className="bg-secondary text-title text-2xl font-bold">
            {dogData.name?.[0]?.toUpperCase() || '🐕'}
          </AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-xl font-bold text-title">{dogData.name}</h2>
          {dogData.breed && (
            <p className="text-sm text-muted-foreground" style={{ marginTop: '4px' }}>{dogData.breed}</p>
          )}
          <p className="text-xs text-muted-foreground" style={{ marginTop: '8px' }}>
            Ajoutez vos certificats et vaccins
          </p>
        </div>
      </Card>

      {/* Professional Read-Only Banner */}
      {isProfessional && (
        <Card className="p-4 rounded-2xl bg-muted">
          <p className="text-sm text-muted-foreground text-center">
            Documents fournis par le propriétaire. Accès révocable.
          </p>
        </Card>
      )}

      {/* Add Document Button (Owner only) */}
      {!isProfessional && (
        <>
          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="w-full rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
            size="lg"
          >
            <Plus className="mr-2 h-5 w-5" />
            {uploading ? "Upload en cours..." : "Ajouter un document"}
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,application/pdf"
            className="hidden"
            onChange={handleFileSelect}
          />
        </>
      )}

      {/* Documents List */}
      <div className="space-y-3">
        {documents.length === 0 ? (
          <Card className="lupi-card text-center">
            <p className="text-muted-foreground">Aucun document pour le moment</p>
          </Card>
        ) : (
          documents.map((doc) => (
            <Card key={doc.id} className="p-4 rounded-2xl space-y-3">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 icon-container">
                  <FileText className="h-6 w-6" strokeWidth={1.5} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-title truncate">{doc.title}</h3>
                  <p className="text-xs text-muted-foreground">
                    {new Date(doc.created_at).toLocaleDateString('fr-FR')}
                    {doc.file_size && ` • ${(doc.file_size / 1024 / 1024).toFixed(2)} Mo`}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="rounded-full text-xs"
                  onClick={() => handleOpenDocument(doc)}
                >
                  <Eye className="h-3 w-3 mr-1" />
                  Ouvrir
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="rounded-full text-xs"
                  onClick={() => handleDownload(doc)}
                >
                  <Download className="h-3 w-3 mr-1" />
                  Télécharger
                </Button>
                {!isProfessional && (
                  <>
                    <Button
                      size="sm"
                      variant="outline"
                      className="rounded-full text-xs"
                      onClick={() => setShareDialog({ open: true, docId: doc.id })}
                    >
                      <Share2 className="h-3 w-3 mr-1" />
                      Partager
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="rounded-full text-xs"
                      onClick={() => {
                        setRenameDialog({ open: true, docId: doc.id, currentName: doc.title });
                        setNewTitle(doc.title);
                      }}
                    >
                      <Edit2 className="h-3 w-3 mr-1" />
                      Renommer
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      className="rounded-full text-xs"
                      onClick={() => setDeleteDialog({ open: true, docId: doc.id })}
                    >
                      <Trash2 className="h-3 w-3 mr-1" />
                      Supprimer
                    </Button>
                  </>
                )}
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open, docId: null })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer le document ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Le document sera définitivement supprimé.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Rename Dialog */}
      <Dialog open={renameDialog.open} onOpenChange={(open) => setRenameDialog({ open, docId: null, currentName: "" })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Renommer le document</DialogTitle>
            <DialogDescription>
              Modifiez le nom du document pour mieux l'identifier.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="new-title">Nouveau nom</Label>
            <Input
              id="new-title"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="rounded-2xl"
              placeholder="Ex: Vaccin rage 2025"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRenameDialog({ open: false, docId: null, currentName: "" })}>
              Annuler
            </Button>
            <Button onClick={handleRename} disabled={!newTitle.trim()}>
              Renommer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Share Dialog */}
      <Dialog open={shareDialog.open} onOpenChange={(open) => setShareDialog({ open, docId: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Partager le document</DialogTitle>
            <DialogDescription>
              Partagez ce document avec un professionnel.
            </DialogDescription>
          </DialogHeader>
          <Button onClick={handleShare}>
            Partager avec un professionnel
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VaccinationPassport;