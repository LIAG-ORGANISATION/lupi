# Users storys stripe Lupi

SPEC DEV – Structure Stripe UPI (Lupi)

1. Tarifs Carnet de Santé (CDS – Premium)
- Abonnement mensuel : 4.99 €
- Abonnement annuel : 50 €
    
    (dont 5 € reversés à une association côté business, pas Stripe)
    
- Freemium : 90 jours gratuits pour tout nouveau gardien
    
    (trial_period_days = 90)
    
1. Test ADN
- Prix one-off générique : 187.70 €
- Product : test_adn
- Payment : Checkout Stripe (one-time)
1. Réduction Premium via achat test ADN
    
    Créer dans Stripe :
    
    A) Coupon
    
- percent_off: 50
- duration: repeating
- duration_in_months: 12

B) Promotion Code

- lié au coupon
- non public
- uniquement appliqué par le backend (pas visible utilisateur)
1. Logique Backend (Webhook)
    
    Évènement : checkout.session.completed
    
    Condition : le produit acheté est test_adn
    

Actions :

1. Identifier le gardien (metadata user_id)
2. S’il a déjà un abonnement Premium actif :
    - appliquer le promotion code à l’abonnement Stripe existant
3. S’il n’a pas encore d’abonnement (ex : en freemium) :
    - enregistrer en base :
        
        has_premium_discount = true
        
        discount_expiry = date_achat_test + 12 mois
        
    - à la fin du trial : appliquer le coupon lors de la création/subscription du Premium
4. Règles à respecter
- L’achat du test ADN déclenche automatiquement une réduction de 50 % sur le Premium (mensuel ou annuel)
- Durée : 12 mois à partir de la date d’achat du test
- Si l’utilisateur est en freemium : la réduction s’applique à partir de la fin des 90 jours
- Si le gardien change de formule (mensuel ↔ annuel) : la réduction reste active jusqu’à la fin des 12 mois
- Réduction non cumulable
- Promotion code non visible publiquement
1. Résumé dev
    
    Achat test ADN (187.70 €) → générer automatiquement un coupon –50 % valable 12 mois sur l’abonnement Premium du gardien, qu’il soit déjà actif ou qu’il démarre après la période d’essai de 90 jours.