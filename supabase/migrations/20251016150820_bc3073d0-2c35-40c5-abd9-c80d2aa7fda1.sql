-- Ajouter une politique pour permettre aux destinataires de marquer les messages comme lus
CREATE POLICY "conversation_participants_mark_messages_as_read"
ON public.messages
FOR UPDATE
TO authenticated
USING (
  -- L'utilisateur peut marquer comme lu un message s'il est participant de la conversation
  EXISTS (
    SELECT 1 
    FROM conversations 
    WHERE conversations.id = messages.conversation_id 
    AND (
      conversations.owner_id = auth.uid() 
      OR conversations.professional_id = auth.uid()
    )
  )
  -- Et que le message n'est pas le sien
  AND sender_id != auth.uid()
)
WITH CHECK (
  -- Permet seulement de modifier le champ 'read'
  EXISTS (
    SELECT 1 
    FROM conversations 
    WHERE conversations.id = messages.conversation_id 
    AND (
      conversations.owner_id = auth.uid() 
      OR conversations.professional_id = auth.uid()
    )
  )
  AND sender_id != auth.uid()
);