# GEC - Gestion Électronique de Courrier

Une application web moderne pour la gestion électronique de courrier destinée aux institutions publiques, développée avec React et Material-UI.

## 🎯 Objectif

L'application GEC permet le traitement, la traçabilité et le suivi des courriers entrants et sortants entre différentes entités administratives d'une institution publique (ex. Présidence de la République).

## ✨ Fonctionnalités

### Fonctionnalités Principales
- **Tableau de bord** : Vue d'ensemble avec statistiques et métriques
- **Gestion des courriers entrants** : Réception, traitement et suivi
- **Gestion des courriers sortants** : Création, envoi et traçabilité
- **Archivage** : Conservation et recherche dans les archives
- **Suivi** : Traçabilité complète des courriers
- **Administration** : Gestion des utilisateurs et entités

### Fonctionnalités Techniques
- Interface moderne et responsive
- Filtres et recherche avancée
- Système de priorités et statuts
- Historique des actions
- Gestion des pièces jointes
- Notifications en temps réel

## 🎨 Design

### Style Visuel
- **Design moderne et épuré** avec un style institutionnel
- **Couleurs sobres** : #007481 (bleu institutionnel), blanc, gris clair
- **Polices lisibles** : Sans-serif, style administratif
- **Interface responsive** : Adaptée aux écrans desktop et mobile

### Composants UI
- Material-UI pour une interface cohérente
- Thème personnalisé avec les couleurs institutionnelles
- Composants réutilisables et accessibles
- Navigation intuitive avec sidebar et header

## 🛠️ Technologies Utilisées

- **React 18** avec TypeScript
- **Material-UI (MUI)** pour l'interface utilisateur
- **React Router** pour la navigation
- **MUI Data Grid** pour les tableaux de données
- **Emotion** pour le styling

## 📦 Installation

1. **Cloner le repository**
   ```bash
   git clone <repository-url>
   cd gec-frontend
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Lancer l'application en mode développement**
   ```bash
   npm start
   ```

4. **Ouvrir l'application**
   L'application sera accessible à l'adresse : http://localhost:3000

## 🚀 Scripts Disponibles

- `npm start` : Lance l'application en mode développement
- `npm run build` : Construit l'application pour la production
- `npm test` : Lance les tests
- `npm run eject` : Éjecte la configuration (irréversible)

## 📁 Structure du Projet

```
src/
├── components/          # Composants réutilisables
│   └── Layout/         # Composants de mise en page
│       ├── Header.tsx
│       ├── Sidebar.tsx
│       └── Layout.tsx
├── pages/              # Pages de l'application
│   ├── Dashboard.tsx
│   └── CourriersEntrants.tsx
├── types/              # Définitions TypeScript
│   └── index.ts
├── theme/              # Configuration du thème
│   └── index.ts
├── utils/              # Utilitaires
├── contexts/           # Contextes React
└── App.tsx            # Composant principal
```

## 🎯 Fonctionnalités Implémentées

### ✅ Complétées
- [x] Structure de base de l'application
- [x] Thème personnalisé avec couleurs institutionnelles
- [x] Navigation avec sidebar et header
- [x] Tableau de bord avec statistiques
- [x] Gestion des courriers entrants
- [x] Système de filtres et recherche
- [x] Interface responsive

### 🔄 En Cours
- [ ] Gestion des courriers sortants
- [ ] Formulaire de création de courrier
- [ ] Système d'archivage
- [ ] Module de suivi

### 📋 À Implémenter
- [ ] Authentification et autorisation
- [ ] Gestion des utilisateurs
- [ ] Administration des entités
- [ ] Système de notifications
- [ ] Gestion des pièces jointes
- [ ] Rapports et statistiques avancées
- [ ] API backend
- [ ] Tests unitaires et d'intégration

## 🎨 Guide de Style

### Couleurs
- **Primaire** : #007481 (Bleu institutionnel)
- **Secondaire** : #f5f5f5 (Gris clair)
- **Arrière-plan** : #fafafa (Gris très clair)
- **Texte** : #333333 (Gris foncé)

### Typographie
- **Famille** : Roboto, Helvetica, Arial, sans-serif
- **Titres** : Poids 500, couleur primaire
- **Corps** : Poids 400, couleur texte

### Composants
- **Boutons** : Border-radius 8px, sans transformation de texte
- **Cartes** : Border-radius 12px, ombre légère
- **Champs** : Border-radius 8px, focus sur couleur primaire

## 🔧 Configuration

### Variables d'Environnement
Créer un fichier `.env` à la racine du projet :

```env
REACT_APP_API_URL=http://localhost:8000/api
REACT_APP_APP_NAME=GEC
REACT_APP_VERSION=1.0.0
```

## 📱 Responsive Design

L'application est entièrement responsive et s'adapte aux différentes tailles d'écran :
- **Desktop** : Sidebar fixe, navigation complète
- **Tablet** : Sidebar rétractable
- **Mobile** : Navigation hamburger, interface optimisée

## 🤝 Contribution

1. Fork le projet
2. Créer une branche pour votre fonctionnalité
3. Commiter vos changements
4. Pousser vers la branche
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est développé pour une institution publique et est soumis aux règles de confidentialité appropriées.

## 📞 Support

Pour toute question ou support technique, contactez l'équipe de développement.

---

**GEC - Gestion Électronique de Courrier**  
*Une solution moderne pour la gestion administrative*
