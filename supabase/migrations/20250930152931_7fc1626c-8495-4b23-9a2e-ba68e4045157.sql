-- Drop and recreate the view without SECURITY DEFINER
-- The view will use the querying user's permissions (SECURITY INVOKER by default)
DROP VIEW IF EXISTS patients_for_pro;

CREATE VIEW patients_for_pro 
WITH (security_invoker = true)
AS
SELECT d.*
FROM dogs d
JOIN dog_shares s ON s.dog_id = d.id
WHERE s.professional_id = auth.uid()
  AND s.status = 'accepted'
  AND (s.expires_at IS NULL OR s.expires_at > now());