export default {
  // Dashboard Title
  title: "Tableau de Bord",
  subtitle: "Votre centre de contrôle pour maximiser vos revenus d'influenceur",
  
  // Welcome Section
  welcome: {
    title: "Bon retour, {{name}} !",
    subtitle: "Voici un aperçu de vos performances récentes",
    defaultTitle: "Bienvenue sur votre Tableau de Bord",
    
    quickStats: {
      totalEarnings: "Revenus Totaux",
      thisMonth: "Ce Mois",
      growth: "Croissance",
      calculations: "Calculs"
    }
  },
  
  // Activity Feed
  activityFeed: {
    title: "Flux d'Activité",
    subtitle: "Vos dernières actions et mises à jour",
    
    types: {
      calculation: "Nouveau calcul effectué",
      milestone: "Objectif atteint",
      insight: "Nouvel insight disponible",
      update: "Mise à jour de plateforme",
      achievement: "Réussite débloquée",
      collaboration: "Nouvelle collaboration"
    },
    
    empty: {
      title: "Aucune activité récente",
      description: "Commencez par calculer vos revenus potentiels",
      action: "Nouveau Calcul"
    }
  },
  
  // Header
  header: {
    navigation: {
      overview: "Aperçu",
      calculations: "Calculs",
      analytics: "Analytics",
      growth: "Croissance",
      settings: "Paramètres"
    },
    
    userMenu: {
      profile: "Profil",
      settings: "Paramètres",
      billing: "Facturation",
      help: "Aide",
      logout: "Déconnexion"
    },
    
    notifications: {
      title: "Notifications",
      markAllRead: "Tout marquer comme lu",
      viewAll: "Voir tout",
      empty: "Aucune notification"
    }
  },
  
  // Overview Section
  overview: {
    title: "Aperçu",
    subtitle: "Vue d'ensemble de vos performances",
    
    metrics: {
      totalRevenue: {
        title: "Revenus Totaux",
        description: "Revenus estimés sur toutes les plateformes",
        period: "Ce mois"
      },
      
      avgEngagement: {
        title: "Engagement Moyen",
        description: "Taux d'engagement moyen sur toutes les plateformes",
        period: "30 derniers jours"
      },
      
      totalFollowers: {
        title: "Followers Totaux",
        description: "Nombre total de followers sur toutes les plateformes",
        period: "Actuellement"
      },
      
      growthRate: {
        title: "Taux de Croissance",
        description: "Croissance moyenne des followers",
        period: "Ce mois"
      }
    },
    
    trends: {
      title: "Tendances",
      up: "En hausse",
      down: "En baisse",
      stable: "Stable",
      
      periods: {
        day: "Aujourd'hui",
        week: "Cette semaine",
        month: "Ce mois",
        quarter: "Ce trimestre",
        year: "Cette année"
      }
    }
  },
  
  // Revenue Chart
  revenueChart: {
    title: "Évolution des Revenus",
    subtitle: "Vos revenus estimés au fil du temps",
    
    periods: {
      "7d": "7 jours",
      "30d": "30 jours",
      "90d": "90 jours",
      "1y": "1 an"
    },
    
    metrics: {
      revenue: "Revenus",
      growth: "Croissance",
      projections: "Projections"
    },
    
    tooltips: {
      revenue: "Revenus estimés : {{amount}}",
      date: "Date : {{date}}",
      growth: "Croissance : {{percentage}}"
    }
  },
  
  // Quick Actions
  quickActions: {
    title: "Actions Rapides",
    subtitle: "Accès rapide aux fonctionnalités principales",
    
    actions: [
      {
        title: "Nouveau Calcul",
        description: "Calculez vos revenus potentiels",
        icon: "calculator",
        href: "/calculator"
      },
      {
        title: "Analyser Performance",
        description: "Analysez vos métriques détaillées",
        icon: "analytics",
        href: "/analytics"
      },
      {
        title: "Comparer Plateformes",
        description: "Comparez vos revenus entre plateformes",
        icon: "compare",
        href: "/compare"
      },
      {
        title: "Conseils de Croissance",
        description: "Obtenez des conseils personnalisés",
        icon: "growth",
        href: "/growth"
      },
      {
        title: "Exporter Données",
        description: "Exportez vos données et rapports",
        icon: "export",
        action: "export"
      },
      {
        title: "Paramètres",
        description: "Configurez votre compte",
        icon: "settings",
        href: "/settings"
      }
    ]
  },
  
  // Recent Calculations
  recentCalculations: {
    title: "Calculs Récents",
    subtitle: "Vos derniers calculs de revenus",
    
    table: {
      headers: {
        date: "Date",
        platform: "Plateforme",
        followers: "Followers",
        engagement: "Engagement",
        revenue: "Revenus Estimés",
        actions: "Actions"
      }
    },
    
    actions: {
      view: "Voir",
      edit: "Modifier",
      duplicate: "Dupliquer",
      share: "Partager",
      delete: "Supprimer"
    },
    
    empty: {
      title: "Aucun calcul récent",
      description: "Commencez par calculer vos revenus potentiels",
      action: "Nouveau Calcul"
    }
  },
  
  // Saved Calculations
  savedCalculations: {
    title: "Calculs Sauvegardés",
    subtitle: "Vos calculs favoris et sauvegardés",
    
    filters: {
      all: "Tous",
      tiktok: "TikTok",
      instagram: "Instagram",
      youtube: "YouTube",
      other: "Autres"
    },
    
    sort: {
      newest: "Plus récent",
      oldest: "Plus ancien",
      revenue: "Revenus",
      name: "Nom"
    },
    
    empty: {
      title: "Aucun calcul sauvegardé",
      description: "Sauvegardez vos calculs pour y accéder rapidement",
      action: "Nouveau Calcul"
    }
  },
  
  // Notifications
  notifications: {
    title: "Notifications",
    subtitle: "Restez informé des dernières mises à jour",
    
    types: {
      info: "Information",
      success: "Succès",
      warning: "Avertissement",
      error: "Erreur",
      update: "Mise à jour",
      achievement: "Réussite"
    },
    
    actions: {
      markRead: "Marquer comme lu",
      markUnread: "Marquer comme non lu",
      delete: "Supprimer",
      viewAll: "Voir tout"
    },
    
    empty: {
      title: "Aucune notification",
      description: "Vous êtes à jour ! Aucune nouvelle notification."
    }
  },
  
  // Goals
  goals: {
    title: "Objectifs",
    subtitle: "Suivez vos objectifs de revenus et de croissance",
    
    types: {
      revenue: "Revenus",
      followers: "Followers",
      engagement: "Engagement",
      collaborations: "Collaborations"
    },
    
    status: {
      onTrack: "Sur la bonne voie",
      ahead: "En avance",
      behind: "En retard",
      completed: "Terminé"
    },
    
    actions: {
      create: "Créer un Objectif",
      edit: "Modifier",
      delete: "Supprimer",
      complete: "Marquer comme terminé"
    },
    
    empty: {
      title: "Aucun objectif défini",
      description: "Définissez des objectifs pour suivre vos progrès",
      action: "Créer un Objectif"
    }
  },
  
  // Insights
  insights: {
    title: "Insights",
    subtitle: "Découvertes et recommandations personnalisées",
    
    categories: {
      performance: "Performance",
      opportunities: "Opportunités",
      trends: "Tendances",
      optimization: "Optimisation"
    },
    
    priority: {
      high: "Haute",
      medium: "Moyenne",
      low: "Faible"
    },
    
    actions: {
      implement: "Implémenter",
      dismiss: "Ignorer",
      learnMore: "En savoir plus",
      share: "Partager"
    },
    
    empty: {
      title: "Aucun insight disponible",
      description: "Continuez à utiliser la plateforme pour générer des insights",
      action: "Nouveau Calcul"
    }
  },
  
  // Settings Preview
  settingsPreview: {
    title: "Paramètres Rapides",
    subtitle: "Accès rapide aux paramètres principaux",
    
    sections: {
      profile: {
        title: "Profil",
        description: "Informations personnelles et photo"
      },
      
      notifications: {
        title: "Notifications",
        description: "Préférences de notification"
      },
      
      privacy: {
        title: "Confidentialité",
        description: "Paramètres de confidentialité et données"
      },
      
      billing: {
        title: "Facturation",
        description: "Abonnement et méthodes de paiement"
      }
    },
    
    actions: {
      viewAll: "Voir tous les paramètres",
      save: "Sauvegarder",
      cancel: "Annuler"
    }
  },
  
  // Loading States
  loading: {
    dashboard: "Chargement du tableau de bord...",
    calculations: "Chargement des calculs...",
    analytics: "Chargement des analytics...",
    insights: "Génération des insights...",
    chart: "Chargement du graphique...",
    notifications: "Chargement des notifications..."
  },
  
  // Empty States
  empty: {
    dashboard: {
      title: "Bienvenue sur votre Tableau de Bord",
      description: "Commencez par calculer vos revenus potentiels pour voir vos données ici",
      action: "Commencer"
    },
    
    data: {
      title: "Aucune donnée disponible",
      description: "Effectuez quelques calculs pour voir vos statistiques",
      action: "Nouveau Calcul"
    },
    
    search: {
      title: "Aucun résultat trouvé",
      description: "Essayez de modifier vos critères de recherche",
      action: "Effacer les filtres"
    }
  },
  
  // Error States
  errors: {
    loadFailed: {
      title: "Échec du chargement",
      description: "Impossible de charger les données du tableau de bord",
      action: "Réessayer"
    },
    
    calculationFailed: {
      title: "Erreur de calcul",
      description: "Impossible d'effectuer le calcul demandé",
      action: "Réessayer"
    },
    
    networkError: {
      title: "Erreur de réseau",
      description: "Vérifiez votre connexion internet",
      action: "Réessayer"
    },
    
    serverError: {
      title: "Erreur du serveur",
      description: "Nos serveurs rencontrent des difficultés",
      action: "Réessayer plus tard"
    }
  },
  
  // Success Messages
  success: {
    calculationSaved: "Calcul sauvegardé avec succès",
    goalCreated: "Objectif créé avec succès",
    settingsUpdated: "Paramètres mis à jour",
    dataExported: "Données exportées avec succès",
    notificationRead: "Notification marquée comme lue"
  },
  
  // Tooltips
  tooltips: {
    revenue: "Revenus estimés basés sur vos métriques actuelles",
    engagement: "Pourcentage moyen d'interaction avec votre contenu",
    growth: "Taux de croissance de vos followers sur la période",
    projections: "Projections basées sur vos tendances actuelles",
    refresh: "Actualiser les données",
    export: "Exporter les données",
    settings: "Paramètres du tableau de bord",
    help: "Aide et support"
  },
  
  // Time Periods
  timePeriods: {
    today: "Aujourd'hui",
    yesterday: "Hier",
    thisWeek: "Cette semaine",
    lastWeek: "Semaine dernière",
    thisMonth: "Ce mois",
    lastMonth: "Mois dernier",
    thisQuarter: "Ce trimestre",
    lastQuarter: "Trimestre dernier",
    thisYear: "Cette année",
    lastYear: "Année dernière",
    allTime: "Depuis le début"
  },
  
  // Actions
  actions: {
    refresh: "Actualiser",
    export: "Exporter",
    share: "Partager",
    print: "Imprimer",
    save: "Sauvegarder",
    cancel: "Annuler",
    delete: "Supprimer",
    edit: "Modifier",
    view: "Voir",
    create: "Créer",
    update: "Mettre à jour",
    close: "Fermer",
    back: "Retour",
    next: "Suivant",
    previous: "Précédent",
    search: "Rechercher",
    filter: "Filtrer",
    sort: "Trier",
    customize: "Personnaliser"
  }
} as const;