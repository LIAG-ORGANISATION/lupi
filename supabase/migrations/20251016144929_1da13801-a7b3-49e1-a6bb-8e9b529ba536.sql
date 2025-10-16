-- Supprimer tous les professionnels et leurs données associées
-- Les conversations, messages et accès seront supprimés en cascade si configuré,
-- sinon on les supprime manuellement

-- Supprimer les messages des conversations avec les professionnels
DELETE FROM messages 
WHERE conversation_id IN (
  SELECT id FROM conversations 
  WHERE professional_id IN (SELECT user_id FROM professionals)
);

-- Supprimer les conversations
DELETE FROM conversations 
WHERE professional_id IN (SELECT user_id FROM professionals);

-- Supprimer les accès professionnels
DELETE FROM dog_professional_access 
WHERE professional_id IN (SELECT user_id FROM professionals);

-- Supprimer les partages de chiens
DELETE FROM dog_shares 
WHERE professional_id IN (SELECT user_id FROM professionals);

-- Supprimer les professionnels
DELETE FROM professionals;