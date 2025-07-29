export default {
  // Logo and Brand
  logo: {
    text: "TikTok Money Calculator",
    alt: "Logo du Calculateur de Revenus TikTok"
  },
  
  // Navigation
  nav: {
    home: "Accueil",
    calculator: "Calculateur",
    compare: "Comparer",
    analytics: "Analytics",
    features: "Fonctionnalités",
    faq: "FAQ",
    blog: "Blog",
    
    // Dropdown menus
    calculators: {
      title: "Calculateurs",
      tiktok: "TikTok",
      instagram: "Instagram",
      youtube: "YouTube",
      twitter: "Twitter",
      twitch: "Twitch",
      linkedin: "LinkedIn",
      all: "Toutes les Plateformes"
    },
    
    tools: {
      title: "Outils",
      compare: "Comparateur de Plateformes",
      analytics: "Analytics Avancées",
      growth: "Conseils de Croissance",
      trends: "Tendances du Marché"
    },
    
    resources: {
      title: "Ressources",
      guides: "Guides",
      templates: "Modèles",
      case_studies: "Études de Cas",
      industry_reports: "Rapports Sectoriels"
    }
  },
  
  // Authentication
  auth: {
    login: "Connexion",
    register: "Inscription",
    logout: "Déconnexion",
    profile: "Profil",
    dashboard: "Tableau de Bord",
    settings: "Paramètres",
    
    // User menu
    userMenu: {
      myCalculations: "Mes Calculs",
      savedResults: "Résultats Sauvegardés",
      accountSettings: "Paramètres du Compte",
      billing: "Facturation",
      support: "Support",
      feedback: "Commentaires"
    }
  },
  
  // Call to Action
  cta: {
    primary: "Calculer Maintenant",
    secondary: "Essai Gratuit",
    getStarted: "Commencer",
    learnMore: "En Savoir Plus"
  },
  
  // Mobile Navigation
  mobile: {
    menu: "Menu",
    close: "Fermer",
    search: "Rechercher",
    
    // Mobile-specific items
    quickCalculate: "Calcul Rapide",
    mobileApp: "App Mobile",
    contact: "Contact"
  },
  
  // Language Selector
  language: {
    current: "Français",
    selector: "Choisir la langue",
    
    options: {
      en: "English",
      es: "Español",
      fr: "Français",
      de: "Deutsch",
      it: "Italiano",
      pt: "Português",
      ru: "Русский",
      zh: "中文",
      ja: "日本語",
      ko: "한국어"
    }
  },
  
  // Search
  search: {
    placeholder: "Rechercher...",
    button: "Rechercher",
    noResults: "Aucun résultat trouvé",
    suggestions: "Suggestions",
    
    popular: {
      title: "Recherches Populaires",
      items: [
        "Revenus TikTok",
        "Calculateur Instagram",
        "Gains YouTube",
        "Monétisation",
        "Taux d'engagement"
      ]
    }
  },
  
  // Notifications
  notifications: {
    badge: "Nouvelles notifications",
    empty: "Aucune notification",
    viewAll: "Voir toutes",
    markAllRead: "Marquer toutes comme lues",
    
    types: {
      update: "Mise à jour",
      feature: "Nouvelle fonctionnalité",
      tip: "Conseil",
      achievement: "Réussite"
    }
  },
  
  // Breadcrumbs
  breadcrumbs: {
    home: "Accueil",
    separator: "/",
    current: "Page actuelle"
  },
  
  // Accessibility
  accessibility: {
    skipToContent: "Aller au contenu principal",
    skipToNavigation: "Aller à la navigation",
    openMenu: "Ouvrir le menu",
    closeMenu: "Fermer le menu",
    toggleTheme: "Basculer le thème",
    
    // Screen reader labels
    mainNavigation: "Navigation principale",
    userNavigation: "Navigation utilisateur",
    languageSelector: "Sélecteur de langue",
    searchForm: "Formulaire de recherche"
  },
  
  // Theme Toggle
  theme: {
    light: "Mode Clair",
    dark: "Mode Sombre",
    auto: "Automatique",
    toggle: "Basculer le thème"
  },
  
  // Status Indicators
  status: {
    online: "En ligne",
    offline: "Hors ligne",
    connecting: "Connexion...",
    syncing: "Synchronisation...",
    saved: "Sauvegardé",
    saving: "Sauvegarde...",
    error: "Erreur"
  },
  
  // Quick Actions
  quickActions: {
    title: "Actions Rapides",
    newCalculation: "Nouveau Calcul",
    compareEarnings: "Comparer les Revenus",
    viewAnalytics: "Voir les Analytics",
    exportData: "Exporter les Données"
  },
  
  // Help and Support
  help: {
    title: "Aide",
    documentation: "Documentation",
    tutorials: "Tutoriels",
    faq: "FAQ",
    contact: "Contacter le Support",
    chat: "Chat en Direct",
    
    // Tooltips
    tooltips: {
      calculator: "Calculez vos revenus potentiels",
      compare: "Comparez les revenus entre plateformes",
      analytics: "Analysez vos performances",
      profile: "Gérez votre profil",
      settings: "Configurez vos préférences"
    }
  },
  
  // Social Links
  social: {
    title: "Suivez-nous",
    twitter: "Twitter",
    facebook: "Facebook",
    instagram: "Instagram",
    linkedin: "LinkedIn",
    youtube: "YouTube",
    tiktok: "TikTok"
  },
  
  // Legal
  legal: {
    privacy: "Confidentialité",
    terms: "Conditions d'Utilisation",
    cookies: "Politique des Cookies",
    disclaimer: "Avertissement"
  },
  
  // Loading States
  loading: {
    menu: "Chargement du menu...",
    user: "Chargement du profil utilisateur...",
    notifications: "Chargement des notifications..."
  },
  
  // Error States
  errors: {
    menuLoadFailed: "Échec du chargement du menu",
    userLoadFailed: "Échec du chargement du profil",
    notificationsFailed: "Échec du chargement des notifications",
    retry: "Réessayer"
  }
} as const;