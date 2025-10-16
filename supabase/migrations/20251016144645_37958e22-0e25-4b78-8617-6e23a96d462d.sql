-- Ajouter une politique pour permettre aux participants de supprimer leurs conversations
CREATE POLICY "participants_delete_conversations"
ON public.conversations
FOR DELETE
TO authenticated
USING (
  (owner_id = auth.uid()) OR (professional_id = auth.uid())
);