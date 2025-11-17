# Feature Flags - Documentation

Ce document décrit les variables d'environnement utilisées pour contrôler l'affichage de certaines fonctionnalités dans l'application.

## Variables d'environnement

### VITE_SHOW_PRO_SIGNUP

**Type**: `string` (boolean)  
**Valeurs possibles**: `"true"` ou `"false"`  
**Par défaut**: `false` (si non défini)

Contrôle l'affichage de l'option d'inscription PRO dans la page de sélection du type de compte (`/choose-account-type`).

- Si `"true"`: Les utilisateurs peuvent voir et accéder à l'option d'inscription professionnelle
- Si `"false"`: L'option d'inscription PRO est cachée

**Fichiers affectés**:
- `src/pages/ChooseAccountType.tsx`

### VITE_SHOW_PRO_DIRECTORY_AND_MESSAGING

**Type**: `string` (boolean)  
**Valeurs possibles**: `"true"` ou `"false"`  
**Par défaut**: `false` (si non défini)

Contrôle l'affichage des fonctionnalités "Annuaire pro" et "Messagerie" dans l'application.

- Si `"true"`: Les fonctionnalités Annuaire pro et Messagerie sont visibles dans l'interface
- Si `"false"`: Ces fonctionnalités sont cachées dans l'interface

**Fichiers affectés**:
- `src/pages/Home.tsx`
- `src/pages/GuardianDashboard.tsx`
- `src/pages/DogsOrPatients.tsx`
- `src/components/WelcomeTutorial.tsx`
- `src/pages/ProfessionalDashboard.tsx`
- `src/pages/GuardianMessages.tsx`

## Configuration

### Fichier .env

Créez un fichier `.env` à la racine du projet avec les variables suivantes :

```env
# Feature Flags
VITE_SHOW_PRO_SIGNUP=false
VITE_SHOW_PRO_DIRECTORY_AND_MESSAGING=false
```

### Utilisation

Les variables sont accessibles via les fonctions utilitaires dans `src/lib/featureFlags.ts`:

```typescript
import { isProSignupEnabled, isProDirectoryAndMessagingEnabled } from "@/lib/featureFlags";

// Vérifier si l'inscription PRO est activée
const showProSignup = isProSignupEnabled();

// Vérifier si l'Annuaire pro et la Messagerie sont activés
const showProDirectoryAndMessaging = isProDirectoryAndMessagingEnabled();
```

## Notes importantes

1. **Format des valeurs**: Les variables doivent être des chaînes de caractères (`"true"` ou `"false"`), pas des booléens JavaScript
2. **Redémarrage requis**: Après modification des variables d'environnement, redémarrez le serveur de développement (`npm run dev`)
3. **Routes protégées**: Les routes `/professionals`, `/guardian/messages`, et `/professional/messages` restent accessibles directement via l'URL même si les feature flags sont désactivés. Pour une protection complète, ajoutez des guards dans `src/App.tsx`

## Exemple de configuration

### Configuration pour développement (features activées)
```env
VITE_SHOW_PRO_SIGNUP=true
VITE_SHOW_PRO_DIRECTORY_AND_MESSAGING=true
```

### Configuration pour production (features désactivées)
```env
VITE_SHOW_PRO_SIGNUP=false
VITE_SHOW_PRO_DIRECTORY_AND_MESSAGING=false
```

