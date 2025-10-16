-- Ajouter des contraintes de suppression en cascade pour toutes les tables liées aux chiens
-- Cela permet de supprimer automatiquement toutes les données liées quand on supprime un chien

-- Dog questionnaires
ALTER TABLE dog_questionnaires
DROP CONSTRAINT IF EXISTS dog_questionnaires_dog_id_fkey;

ALTER TABLE dog_questionnaires
ADD CONSTRAINT dog_questionnaires_dog_id_fkey
FOREIGN KEY (dog_id) REFERENCES dogs(id) ON DELETE CASCADE;

-- Dog vaccinations
ALTER TABLE dog_vaccinations
DROP CONSTRAINT IF EXISTS dog_vaccinations_dog_id_fkey;

ALTER TABLE dog_vaccinations
ADD CONSTRAINT dog_vaccinations_dog_id_fkey
FOREIGN KEY (dog_id) REFERENCES dogs(id) ON DELETE CASCADE;

-- Dog calendar events
ALTER TABLE dog_calendar_events
DROP CONSTRAINT IF EXISTS dog_calendar_events_dog_id_fkey;

ALTER TABLE dog_calendar_events
ADD CONSTRAINT dog_calendar_events_dog_id_fkey
FOREIGN KEY (dog_id) REFERENCES dogs(id) ON DELETE CASCADE;

-- Dog health alerts
ALTER TABLE dog_health_alerts
DROP CONSTRAINT IF EXISTS dog_health_alerts_dog_id_fkey;

ALTER TABLE dog_health_alerts
ADD CONSTRAINT dog_health_alerts_dog_id_fkey
FOREIGN KEY (dog_id) REFERENCES dogs(id) ON DELETE CASCADE;

-- Dog documents
ALTER TABLE dog_documents
DROP CONSTRAINT IF EXISTS dog_documents_dog_id_fkey;

ALTER TABLE dog_documents
ADD CONSTRAINT dog_documents_dog_id_fkey
FOREIGN KEY (dog_id) REFERENCES dogs(id) ON DELETE CASCADE;

-- Dog shares (partages avec les professionnels)
ALTER TABLE dog_shares
DROP CONSTRAINT IF EXISTS dog_shares_dog_id_fkey;

ALTER TABLE dog_shares
ADD CONSTRAINT dog_shares_dog_id_fkey
FOREIGN KEY (dog_id) REFERENCES dogs(id) ON DELETE CASCADE;

-- Conversations (mettre à NULL le dog_id au lieu de supprimer la conversation)
ALTER TABLE conversations
DROP CONSTRAINT IF EXISTS conversations_dog_id_fkey;

ALTER TABLE conversations
ADD CONSTRAINT conversations_dog_id_fkey
FOREIGN KEY (dog_id) REFERENCES dogs(id) ON DELETE SET NULL;