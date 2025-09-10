# 🍅 Pomodoro Timer App

Une application web React moderne et élégante pour appliquer la technique Pomodoro et améliorer votre productivité.

## 📋 Fonctionnalités

- **Timer Pomodoro complet** : 25 minutes de travail, 5 minutes de pause courte
- **Pauses longues** : 20 minutes de pause après 4 sessions de travail
- **Interface visuelle attrayante** : Design moderne avec animations et gradients
- **Indicateur de progression** : Cercle de progression animé
- **Compteur de sessions** : Visualisation des sessions complétées
- **Notifications** : Alertes visuelles et notifications du navigateur
- **Contrôles intuitifs** : Boutons pour démarrer, mettre en pause, réinitialiser et passer
- **Design responsive** : Optimisé pour desktop et mobile
- **Changements de thème** : Couleurs différentes pour travail et pauses

## 🚀 Installation et utilisation

### Prérequis
- Node.js (version 14 ou supérieure)
- npm ou yarn

### Installation
```bash
# Cloner le projet
git clone <url-du-repo>
cd pomodoro-app

# Installer les dépendances
npm install

# Lancer l'application en mode développement
npm start
```

L'application sera disponible sur `http://localhost:3000`

### Build de production
```bash
npm run build
```

## 🎯 La technique Pomodoro

La technique Pomodoro est une méthode de gestion du temps développée par Francesco Cirillo :

1. **25 minutes de travail concentré** (Pomodoro)
2. **5 minutes de pause courte**
3. **Répéter 4 fois**
4. **20 minutes de pause longue**
5. **Recommencer le cycle**

## 🛠️ Technologies utilisées

- **React** avec TypeScript
- **CSS3** avec animations et gradients
- **Hooks React** (useState, useEffect, useCallback)
- **API Notifications** du navigateur
- **Design responsive** avec CSS Grid et Flexbox

## 📱 Fonctionnalités détaillées

### Timer intelligent
- Décompte automatique avec affichage temps réel
- Gestion automatique des transitions entre sessions
- Sauvegarde de l'état actuel

### Interface utilisateur
- Cercle de progression animé
- Indicateurs visuels des sessions complétées
- Changements de couleur selon le type de session
- Animations fluides et transitions

### Notifications
- Notifications du navigateur à la fin de chaque session
- Messages informatifs sur l'état du timer
- Demande de permission pour les notifications

### Contrôles
- **Démarrer/Pause** : Contrôle du timer
- **Réinitialiser** : Retour au début du cycle
- **Passer** : Passer à la session suivante
- **Démarrage automatique** : Option pour la session suivante

## 🎨 Personnalisation

Le design utilise des variables CSS et peut être facilement personnalisé :

- **Couleurs des sessions** : Modifiables dans `PomodoroTimer.css`
- **Durées** : Configurables dans les constantes du composant
- **Animations** : Personnalisables via les classes CSS

## 📦 Structure du projet

```
src/
├── components/
│   ├── PomodoroTimer.tsx    # Composant principal
│   └── PomodoroTimer.css    # Styles du timer
├── App.tsx                  # Composant racine
├── App.css                  # Styles globaux
└── index.css               # Styles de base
```

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :

1. Fork le projet
2. Créer une branche pour votre fonctionnalité
3. Commiter vos changements
4. Pusher vers la branche
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT.

## 🙋‍♂️ Support

Pour toute question ou suggestion, n'hésitez pas à ouvrir une issue ou à me contacter.

---

**Bonne productivité avec votre timer Pomodoro ! 🍅✨**
