import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, FileText, Image as ImageIcon, Trash2, ExternalLink, Share2, Users, Camera, Upload, Receipt, Download } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { capitalizeWords } from "@/lib/utils";
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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAuth } from "@/hooks/useAuth";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
  category: string;
  professional_type: string | null;
  dogs?: {
    name: string;
  };
}

const PROFESSIONAL_TYPES = [
  { value: "veterinaire", label: "Vétérinaire" },
  { value: "educateur", label: "Éducateur" },
  { value: "comportementaliste", label: "Comportementaliste" },
  { value: "toiletteur", label: "Toiletteur" },
  { value: "pension", label: "Pension" },
  { value: "autre", label: "Autre" },
];

const GuardianDocuments = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, userRole, loading: authLoading, isProfessional } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  
  const userId = user?.id;
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [uploadCategory, setUploadCategory] = useState<"medical" | "invoice">("medical");
  const [uploadProfessionalType, setUploadProfessionalType] = useState<string>("");
  
  const [documents, setDocuments] = useState<Document[]>([]);
  const [dogs, setDogs] = useState<any[]>([]);
  const [selectedDog, setSelectedDog] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; doc: Document | null }>({ open: false, doc: null });
  const [shareDialog, setShareDialog] = useState<{ open: boolean; doc: Document | null }>({ open: false, doc: null });
  const [sharedProfessionals, setSharedProfessionals] = useState<any[]>([]);
  const [filterProfessional, setFilterProfessional] = useState<string>("all");

  useEffect(() => {
    if (!authLoading && user && userId && userRole !== null) {
      fetchDogs();
      fetchDocuments();
    } else if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [authLoading, user, userRole]);

  const fetchDogs = async () => {
    try {
      if (isProfessional) {
        const { data, error } = await supabase
          .from("patients_for_pro")
          .select("*");
        
        if (error) throw error;
        setDogs(data || []);
        if (data && data.length > 0) {
          setSelectedDog(data[0].id);
        }
      } else {
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

  const handleFileSelect = (category: "medical" | "invoice" = "medical") => {
    if (!selectedDog) {
      toast({
        title: "Aucun chien sélectionné",
        description: "Veuillez sélectionner un chien avant d'ajouter un document.",
        variant: "destructive",
      });
      return;
    }
    setUploadCategory(category);
    setUploadProfessionalType("");
    setShowUploadDialog(true);
  };

  const handleUploadOption = (type: 'pdf' | 'photo' | 'camera') => {
    setShowUploadDialog(false);
    // Use setTimeout to ensure the dialog is closed before triggering the input
    setTimeout(() => {
      if (type === 'pdf' && fileInputRef.current) {
        fileInputRef.current.click();
      } else if (type === 'photo' && photoInputRef.current) {
        photoInputRef.current.click();
      } else if (type === 'camera' && cameraInputRef.current) {
        cameraInputRef.current.click();
      }
    }, 100);
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
    const maxSize = 10 * 1024 * 1024;

    setUploading(true);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

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
        const fileExt = file.name.split('.').pop();
        const fileName = `${crypto.randomUUID()}.${fileExt}`;
        const storagePath = `${userId}/${selectedDog}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("dog-documents")
          .upload(storagePath, file);

        if (uploadError) throw uploadError;

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
            category: uploadCategory,
            professional_type: uploadProfessionalType || null,
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
      const { error: storageError } = await supabase.storage
        .from("dog-documents")
        .remove([deleteDialog.doc.storage_path]);

      if (storageError) throw storageError;

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

  const handleExport = async (doc: Document) => {
    try {
      const { data } = supabase.storage
        .from("dog-documents")
        .getPublicUrl(doc.storage_path);

      if (data?.publicUrl) {
        const response = await fetch(data.publicUrl);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = doc.file_name;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        toast({
          title: "Document exporté",
          description: "Le téléchargement a commencé.",
        });
      }
    } catch (error) {
      console.error("Error exporting document:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'exporter le document.",
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

  const filteredDocuments = documents.filter((doc) => {
    if (filterProfessional === "all") return doc.category === "medical";
    return doc.category === "medical" && doc.professional_type === filterProfessional;
  });

  const invoiceDocuments = documents.filter((doc) => doc.category === "invoice");

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
    <div className="min-h-screen bg-background pb-24">
      <div className="bg-gradient-to-br from-[#6B1C1C] to-[#4A0F0F] p-5 pb-12 rounded-b-[3rem] shadow-card">
        <div className="max-w-4xl mx-auto">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="rounded-full mb-4 text-white hover:bg-white/10"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-white">Documents</h1>
            <p className="text-white/80 text-sm">Gérez les documents de vos chiens</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 -mt-6 space-y-4 animate-fade-in">
        {!isProfessional && (
          <div className="space-y-3">
            <select
              value={selectedDog}
              onChange={(e) => setSelectedDog(e.target.value)}
              className="w-full h-12 px-4 rounded-2xl border-2 border-primary/20 bg-white text-foreground shadow-sm"
            >
              <option value="">Sélectionner un chien</option>
              {dogs.map((dog) => (
                <option key={dog.id} value={dog.id}>
                  {dog.name}
                </option>
              ))}
            </select>

            <div className="flex gap-2">
              <Button
                onClick={() => handleFileSelect("medical")}
                disabled={!selectedDog || uploading}
                className="flex-1 rounded-full h-12"
                size="lg"
              >
                <Plus className="h-5 w-5 mr-2" />
                {uploading ? "Upload..." : "Document"}
              </Button>
              <Button
                onClick={() => handleFileSelect("invoice")}
                disabled={!selectedDog || uploading}
                variant="outline"
                className="flex-1 rounded-full h-12"
                size="lg"
              >
                <Plus className="h-5 w-5 mr-2" />
                Facture
              </Button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf"
              multiple
              onChange={handleFileChange}
              className="hidden"
            />
            <input
              ref={photoInputRef}
              type="file"
              accept="image/jpeg,image/png,image/jpg"
              multiple
              onChange={handleFileChange}
              className="hidden"
            />
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        )}

        {loading ? (
          <Card className="lupi-card p-8 text-center">
            <p className="text-muted-foreground">Chargement...</p>
          </Card>
        ) : (
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-title">Documents Médicaux</h2>
                {documents.filter((d) => d.category === "medical").length > 0 && (
                  <Select value={filterProfessional} onValueChange={setFilterProfessional}>
                    <SelectTrigger className="w-[180px] rounded-full">
                      <SelectValue placeholder="Filtrer" />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl bg-white z-50">
                      <SelectItem value="all">Tous</SelectItem>
                      {PROFESSIONAL_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>

              {filteredDocuments.length === 0 ? (
                <Card className="lupi-card p-8 text-center">
                  <FileText className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
                  <p className="text-muted-foreground">Aucun document médical</p>
                </Card>
              ) : (
                <div className="space-y-3">
                  {filteredDocuments.map((doc) => (
                    <Card key={doc.id} className="lupi-card overflow-hidden">
                      <div className="p-4">
                        <div className="flex items-start gap-3 mb-3">
                          <div className="flex-shrink-0">
                            {getFileIcon(doc.file_type)}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-title truncate mb-1">
                              {doc.title || doc.file_name}
                            </h3>
                            <div className="space-y-0.5">
                              {doc.professional_type && (
                                <span className="inline-block px-2 py-0.5 text-xs rounded-full bg-primary/10 text-primary font-medium mb-1">
                                  {PROFESSIONAL_TYPES.find(t => t.value === doc.professional_type)?.label}
                                </span>
                              )}
                              <p className="text-xs text-muted-foreground">
                                {formatDate(doc.created_at)}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {doc.file_type.split("/")[1].toUpperCase()} • {formatFileSize(doc.file_size)}
                              </p>
                              {doc.dogs?.name && (
                                <div className="flex items-center gap-2 mt-1">
                                  <img 
                                    src={dogs.find(d => d.id === doc.dog_id)?.avatar_url || ''} 
                                    alt={doc.dogs.name}
                                    className="w-5 h-5 rounded-full object-cover"
                                    onError={(e) => {
                                      (e.target as HTMLImageElement).style.display = 'none';
                                    }}
                                  />
                                  <p className="text-xs text-muted-foreground">{doc.dogs.name}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleOpenDocument(doc)}
                            size="sm"
                            variant="outline"
                            className="flex-1 rounded-full"
                          >
                            <ExternalLink className="h-4 w-4 mr-1" />
                            Voir
                          </Button>

                          <Button
                            onClick={() => handleExport(doc)}
                            size="sm"
                            variant="outline"
                            className="rounded-full"
                          >
                            <Download className="h-4 w-4" />
                          </Button>

                          {!isProfessional && doc.owner_id === userId && (
                            <Button
                              onClick={() => setDeleteDialog({ open: true, doc })}
                              size="sm"
                              variant="outline"
                              className="rounded-full text-destructive hover:text-destructive"
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

            <div className="space-y-3">
              <h2 className="text-lg font-semibold text-title flex items-center gap-2">
                <Receipt className="h-5 w-5" />
                Factures
              </h2>

              {invoiceDocuments.length === 0 ? (
                <Card className="lupi-card p-8 text-center">
                  <Receipt className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
                  <p className="text-muted-foreground">Aucune facture</p>
                </Card>
              ) : (
                <div className="space-y-3">
                  {invoiceDocuments.map((doc) => (
                    <Card key={doc.id} className="lupi-card overflow-hidden">
                      <div className="p-4">
                        <div className="flex items-start gap-3 mb-3">
                          <div className="flex-shrink-0">
                            <Receipt className="h-8 w-8 text-[#444444]" />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-title truncate mb-1">
                              {doc.title || doc.file_name}
                            </h3>
                            <div className="space-y-0.5">
                              {doc.professional_type && (
                                <span className="inline-block px-2 py-0.5 text-xs rounded-full bg-primary/10 text-primary font-medium mb-1">
                                  {PROFESSIONAL_TYPES.find(t => t.value === doc.professional_type)?.label}
                                </span>
                              )}
                              <p className="text-xs text-muted-foreground">
                                {formatDate(doc.created_at)}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {doc.file_type.split("/")[1].toUpperCase()} • {formatFileSize(doc.file_size)}
                              </p>
                              {doc.dogs?.name && (
                                <div className="flex items-center gap-2 mt-1">
                                  <img 
                                    src={dogs.find(d => d.id === doc.dog_id)?.avatar_url || ''} 
                                    alt={doc.dogs.name}
                                    className="w-5 h-5 rounded-full object-cover"
                                    onError={(e) => {
                                      (e.target as HTMLImageElement).style.display = 'none';
                                    }}
                                  />
                                  <p className="text-xs text-muted-foreground">{doc.dogs.name}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleOpenDocument(doc)}
                            size="sm"
                            variant="outline"
                            className="flex-1 rounded-full"
                          >
                            <ExternalLink className="h-4 w-4 mr-1" />
                            Voir
                          </Button>

                          <Button
                            onClick={() => handleExport(doc)}
                            size="sm"
                            variant="outline"
                            className="rounded-full"
                          >
                            <Download className="h-4 w-4" />
                          </Button>

                          {!isProfessional && doc.owner_id === userId && (
                            <Button
                              onClick={() => setDeleteDialog({ open: true, doc })}
                              size="sm"
                              variant="outline"
                              className="rounded-full text-destructive hover:text-destructive"
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
          </div>
        )}
      </div>

      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent className="rounded-3xl max-w-[90vw] sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Ajouter {uploadCategory === "invoice" ? "une facture" : "un document"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Type de document</Label>
              <Select value={uploadCategory} onValueChange={(v) => setUploadCategory(v as "medical" | "invoice")}>
                <SelectTrigger className="rounded-2xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-2xl bg-white z-50">
                  <SelectItem value="medical">Document médical</SelectItem>
                  <SelectItem value="invoice">Facture</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Type de professionnel (optionnel)</Label>
              <Select value={uploadProfessionalType} onValueChange={setUploadProfessionalType}>
                <SelectTrigger className="rounded-2xl">
                  <SelectValue placeholder="Sélectionner..." />
                </SelectTrigger>
                <SelectContent className="rounded-2xl bg-white z-50">
                  {PROFESSIONAL_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="pt-2 space-y-3">
              <Button
                onClick={() => handleUploadOption('pdf')}
                variant="outline"
                className="w-full h-16 rounded-2xl flex items-center justify-start gap-4"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <div className="text-left flex-1">
                  <p className="font-semibold">Importer un PDF</p>
                  <p className="text-xs text-muted-foreground">Ordonnances, analyses...</p>
                </div>
              </Button>

              <Button
                onClick={() => handleUploadOption('camera')}
                variant="outline"
                className="w-full h-16 rounded-2xl flex items-center justify-start gap-4"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Camera className="h-6 w-6 text-primary" />
                </div>
                <div className="text-left flex-1">
                  <p className="font-semibold">Prendre une photo</p>
                  <p className="text-xs text-muted-foreground">Utiliser l'appareil photo</p>
                </div>
              </Button>

              <Button
                onClick={() => handleUploadOption('photo')}
                variant="outline"
                className="w-full h-16 rounded-2xl flex items-center justify-start gap-4"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Upload className="h-6 w-6 text-primary" />
                </div>
                <div className="text-left flex-1">
                  <p className="font-semibold">Importer une photo</p>
                  <p className="text-xs text-muted-foreground">Depuis la galerie</p>
                </div>
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open, doc: null })}>
        <AlertDialogContent className="rounded-3xl max-w-[90vw] sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer ce document ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Le document sera définitivement supprimé.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
            <AlertDialogCancel className="rounded-full w-full sm:w-auto">Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="rounded-full bg-destructive hover:bg-destructive/90 w-full sm:w-auto"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={shareDialog.open} onOpenChange={(open) => setShareDialog({ open, doc: null })}>
        <AlertDialogContent className="rounded-3xl max-w-[90vw] sm:max-w-md max-h-[80vh] overflow-y-auto">
          <AlertDialogHeader>
            <AlertDialogTitle>Document partagé avec</AlertDialogTitle>
            <AlertDialogDescription>
              Ce document est accessible par les professionnels ayant accès à {shareDialog.doc?.dogs?.name || "ce chien"}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="space-y-2 py-4">
            {sharedProfessionals.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Aucun professionnel n'a accès à ce chien pour le moment.
                </p>
              </div>
            ) : (
              sharedProfessionals.map((share) => (
                <div key={share.id} className="flex items-center gap-3 p-3 rounded-2xl bg-secondary/50">
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
                    <p className="font-medium text-sm truncate">{capitalizeWords(share.professionals?.full_name)}</p>
                    <p className="text-xs text-muted-foreground">{capitalizeWords(share.professionals?.profession)}</p>
                  </div>
                </div>
              ))
            )}
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-full w-full">Fermer</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default GuardianDocuments;