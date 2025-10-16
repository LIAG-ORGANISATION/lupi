-- Supprimer les professionnels sauf les 4 demandés
DELETE FROM professionals 
WHERE user_id NOT IN (
  '863585f4-f747-43ce-b2fe-64b3f9499b96', -- Alice Remblait
  'a85c8330-00fa-4560-b188-c7958fd85b10', -- Dorothée Barclet
  '63f37c2d-f13b-499c-a4ac-69a2a1201c63', -- Dr Pallaut
  'f4fcb0df-da01-4f9e-8d5f-9d12877e007e'  -- Ethik Dog
);