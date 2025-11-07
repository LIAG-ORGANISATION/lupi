## 🧩 **User Stories Stripe – Abonnements Lupi**

### 1. Utilisateurs **Professionnels (Pros)**

**Objectif :** Permettre aux professionnels (éducateurs, vétérinaires, toiletteurs, éleveurs, etc.) de bénéficier d’une période freemium puis de passer automatiquement sur un abonnement payant via Stripe.

### **Scénario 1 : Engagement annuel**

- **En tant que** professionnel,
- **Je veux** pouvoir bénéficier de **3 mois gratuits** à compter de la date de mon inscription,
- **Afin de** tester Lupi sans engagement initial,
- **Puis** être automatiquement débité de **14,90 €/mois**, avec **engagement annuel (12 mois)**.
- **Conditions techniques :**
    - Le développeur doit créer un **plan Stripe** : `pro_annuel_14_90`
    - Une **période d’essai de 90 jours** doit être configurée dans Stripe.
    - Le **paiement mensuel** doit être récurrent et bloqué sur une durée minimale de 12 mois.
    - À la fin des 12 mois, l’abonnement se **renouvelle automatiquement** (sauf résiliation).
    - Le pro peut **résilier à tout moment après les 12 mois**, sans frais.

### **Scénario 2 : Sans engagement annuel**

- **En tant que** professionnel,
- **Je veux** pouvoir bénéficier d’**1 mois gratuit**,
- **Puis** être facturé **14,90 €/mois sans engagement**,
- **Afin de** pouvoir tester Lupi plus rapidement sans contrainte d’engagement.
- **Conditions techniques :**
    - Créer un **plan Stripe** : `pro_mensuel_14_90`
    - Configurer une **période d’essai de 30 jours** dans Stripe.
    - L’utilisateur peut **résilier à tout moment**, la facturation s’arrête à la fin du cycle de facturation.
    - En cas de résiliation avant la fin du mois payé, **aucun remboursement proratisé**.

---

### 2. Utilisateurs **Gardiens (Particuliers)**

**Objectif :** Offrir une formule accessible après une période d’essai gratuite, avec deux options : abonnement mensuel ou achat annuel unique.

### **Scénario 1 : Abonnement mensuel**

- **En tant que** gardien de chien,
- **Je veux** bénéficier d’un **mois d’essai gratuit**,
- **Puis** payer **4,90 €/mois**,
- **Afin de** continuer à accéder aux fonctionnalités premium (profils multiples, suivi, historique santé, etc.).
- **Conditions techniques :**
    - Créer un **plan Stripe** : `gardien_mensuel_4_90`
    - Configurer une **période d’essai de 30 jours**.
    - Le paiement est **récurrent et sans engagement**.
    - Possibilité de **résilier à tout moment**.

### **Scénario 2 : Achat annuel unique**

- **En tant que** gardien,
- **Je veux** payer **45 € pour un an d’accès complet**,
- **Afin de** bénéficier d’un tarif avantageux sans récurrence mensuelle.
- **Conditions techniques :**
    - Créer un **plan Stripe** : `gardien_annuel_45`
    - Ce plan **ne se renouvelle pas automatiquement**.
    - L’utilisateur reçoit un **rappel par email 15 jours avant la fin** de la période pour le renouveler manuellement s’il le souhaite.

---

## **Éléments communs à prévoir pour le développeur**

- **Intégration Stripe Checkout** avec redirection vers le dashboard Lupi après paiement ou essai.
- **Webhook Stripe** pour suivre :
    - Début et fin des périodes d’essai.
    - Activation des paiements.
    - État d’abonnement (actif, annulé, suspendu).
- **État affiché dans le compte utilisateur :**
    - “Essai en cours – se termine le [date]”
    - “Abonnement actif jusqu’au [date]”
    - “Abonnement annulé – accès jusqu’au [date]”
- **Relances automatiques** :
    - 3 jours avant la fin de l’essai.
    - 3 jours avant échéance annuelle (pour le plan `gardien_annuel_45`).