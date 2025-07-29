export default {
  // TikTok Calculator
  tiktok: {
    title: "Calculateur de Revenus TikTok",
    subtitle: "Calculez vos gains potentiels sur TikTok",
    description: "Découvrez combien vous pourriez gagner en tant que créateur TikTok en fonction de vos followers, engagement et niche",
    
    form: {
      followers: {
        label: "Nombre de Followers",
        placeholder: "Ex: 100000",
        description: "Votre nombre actuel de followers TikTok"
      },
      
      engagement: {
        label: "Taux d'Engagement (%)",
        placeholder: "Ex: 5.2",
        description: "Pourcentage moyen de likes/commentaires par rapport aux vues"
      },
      
      avgViews: {
        label: "Vues Moyennes par Vidéo",
        placeholder: "Ex: 50000",
        description: "Nombre moyen de vues par publication"
      },
      
      niche: {
        label: "Niche/Catégorie",
        placeholder: "Sélectionnez votre niche",
        description: "Votre domaine de contenu principal",
        
        options: {
          lifestyle: "Style de vie",
          beauty: "Beauté",
          fitness: "Fitness",
          food: "Cuisine",
          travel: "Voyage",
          tech: "Technologie",
          gaming: "Gaming",
          education: "Éducation",
          comedy: "Comédie",
          music: "Musique",
          dance: "Danse",
          fashion: "Mode",
          pets: "Animaux",
          diy: "DIY/Bricolage",
          business: "Business",
          other: "Autre"
        }
      },
      
      location: {
        label: "Localisation",
        placeholder: "Sélectionnez votre pays",
        description: "Votre localisation principale d'audience"
      },
      
      contentType: {
        label: "Type de Contenu",
        description: "Type principal de votre contenu",
        
        options: {
          original: "Contenu Original",
          trending: "Tendances/Challenges",
          educational: "Éducatif",
          entertainment: "Divertissement",
          promotional: "Promotionnel"
        }
      }
    },
    
    calculate: "Calculer les Revenus",
    calculating: "Calcul en cours..."
  },
  
  // Instagram Calculator
  instagram: {
    title: "Calculateur de Revenus Instagram",
    subtitle: "Estimez vos gains potentiels sur Instagram",
    description: "Calculez vos revenus potentiels d'influenceur Instagram basés sur vos métriques et engagement",
    
    form: {
      followers: {
        label: "Nombre de Followers",
        placeholder: "Ex: 50000",
        description: "Votre nombre actuel de followers Instagram"
      },
      
      engagement: {
        label: "Taux d'Engagement (%)",
        placeholder: "Ex: 3.5",
        description: "Pourcentage moyen de likes/commentaires"
      },
      
      postType: {
        label: "Type de Publication",
        description: "Type principal de vos publications",
        
        options: {
          photo: "Photos",
          video: "Vidéos",
          reel: "Reels",
          story: "Stories",
          igtv: "IGTV",
          mixed: "Mixte"
        }
      },
      
      niche: {
        label: "Niche/Catégorie",
        placeholder: "Sélectionnez votre niche",
        description: "Votre domaine de contenu principal"
      }
    }
  },
  
  // YouTube Calculator
  youtube: {
    title: "Calculateur de Revenus YouTube",
    subtitle: "Découvrez vos gains potentiels YouTube",
    description: "Estimez vos revenus YouTube basés sur vos vues, abonnés et métriques d'engagement",
    
    form: {
      subscribers: {
        label: "Nombre d'Abonnés",
        placeholder: "Ex: 25000",
        description: "Votre nombre actuel d'abonnés YouTube"
      },
      
      monthlyViews: {
        label: "Vues Mensuelles",
        placeholder: "Ex: 500000",
        description: "Nombre total de vues par mois"
      },
      
      avgWatchTime: {
        label: "Durée de Visionnage Moyenne",
        placeholder: "Ex: 4.5",
        description: "Durée moyenne de visionnage en minutes"
      },
      
      cpm: {
        label: "CPM Estimé ($)",
        placeholder: "Ex: 2.50",
        description: "Coût pour mille impressions dans votre région"
      },
      
      videoLength: {
        label: "Durée Moyenne des Vidéos",
        description: "Durée typique de vos vidéos",
        
        options: {
          short: "Courte (< 4 min)",
          medium: "Moyenne (4-10 min)",
          long: "Longue (> 10 min)"
        }
      }
    }
  },
  
  // Results
  results: {
    title: "Vos Revenus Estimés",
    subtitle: "Basé sur vos métriques actuelles",
    
    earnings: {
      perPost: "Par Publication",
      perMonth: "Par Mois",
      perYear: "Par An",
      
      ranges: {
        min: "Minimum",
        avg: "Moyenne",
        max: "Maximum"
      }
    },
    
    breakdown: {
      title: "Répartition des Revenus",
      
      sources: {
        sponsoredPosts: "Publications Sponsorisées",
        affiliateMarketing: "Marketing d'Affiliation",
        productPlacements: "Placements de Produits",
        brandPartnerships: "Partenariats de Marque",
        adRevenue: "Revenus Publicitaires",
        merchandise: "Merchandising",
        donations: "Dons/Tips",
        subscriptions: "Abonnements",
        courses: "Cours/Formations",
        consulting: "Consulting"
      }
    },
    
    factors: {
      title: "Facteurs Influençant les Revenus",
      
      positive: {
        title: "Facteurs Positifs",
        items: [
          "Taux d'engagement élevé",
          "Niche rentable",
          "Audience ciblée",
          "Contenu de qualité",
          "Régularité de publication",
          "Forte interaction communautaire"
        ]
      },
      
      negative: {
        title: "Points d'Amélioration",
        items: [
          "Augmenter le taux d'engagement",
          "Diversifier les sources de revenus",
          "Améliorer la qualité du contenu",
          "Optimiser la fréquence de publication",
          "Développer les partenariats de marque",
          "Analyser les performances"
        ]
      }
    },
    
    disclaimer: {
      title: "Avertissement",
      text: "Ces estimations sont basées sur des moyennes du secteur et peuvent varier considérablement selon de nombreux facteurs. Les revenus réels dépendent de votre contenu, audience, engagement et stratégie de monétisation."
    }
  },
  
  // History
  history: {
    title: "Historique des Calculs",
    subtitle: "Vos calculs précédents",
    
    table: {
      date: "Date",
      platform: "Plateforme",
      followers: "Followers",
      engagement: "Engagement",
      estimatedEarnings: "Revenus Estimés",
      actions: "Actions"
    },
    
    actions: {
      view: "Voir",
      recalculate: "Recalculer",
      share: "Partager",
      delete: "Supprimer",
      export: "Exporter"
    },
    
    empty: {
      title: "Aucun calcul sauvegardé",
      description: "Commencez par calculer vos revenus potentiels",
      action: "Nouveau Calcul"
    }
  },
  
  // Share
  share: {
    title: "Partager les Résultats",
    subtitle: "Partagez vos revenus estimés",
    
    options: {
      link: {
        title: "Lien de Partage",
        description: "Copiez le lien pour partager vos résultats",
        copy: "Copier le Lien",
        copied: "Lien Copié !"
      },
      
      social: {
        title: "Réseaux Sociaux",
        description: "Partagez directement sur vos réseaux",
        
        platforms: {
          twitter: "Partager sur Twitter",
          facebook: "Partager sur Facebook",
          linkedin: "Partager sur LinkedIn",
          instagram: "Partager sur Instagram"
        }
      },
      
      embed: {
        title: "Code d'Intégration",
        description: "Intégrez les résultats sur votre site",
        copy: "Copier le Code",
        copied: "Code Copié !"
      }
    },
    
    templates: {
      twitter: "Je viens de calculer mes revenus potentiels avec le Calculateur TikTok Money ! 💰 Découvrez le vôtre :",
      facebook: "Curieux de connaître vos revenus potentiels en tant qu'influenceur ? J'ai utilisé ce calculateur génial :",
      linkedin: "Analyse intéressante de mes revenus potentiels d'influenceur. Outil utile pour les créateurs de contenu :"
    }
  },
  
  // Save Calculation
  saveCalculation: {
    title: "Sauvegarder le Calcul",
    subtitle: "Enregistrez vos résultats pour plus tard",
    
    form: {
      name: {
        label: "Nom du Calcul",
        placeholder: "Ex: Calcul TikTok Janvier 2024",
        description: "Donnez un nom à ce calcul pour le retrouver facilement"
      },
      
      notes: {
        label: "Notes (Optionnel)",
        placeholder: "Ajoutez des notes ou commentaires...",
        description: "Informations supplémentaires sur ce calcul"
      },
      
      tags: {
        label: "Tags",
        placeholder: "Ex: tiktok, janvier, croissance",
        description: "Tags pour organiser vos calculs"
      }
    },
    
    actions: {
      save: "Sauvegarder",
      cancel: "Annuler",
      saving: "Sauvegarde..."
    }
  },
  
  // Growth Tips
  growthTips: {
    title: "Conseils de Croissance",
    subtitle: "Augmentez vos revenus d'influenceur",
    
    categories: {
      content: {
        title: "Stratégie de Contenu",
        tips: [
          "Publiez régulièrement et de manière cohérente",
          "Créez du contenu de haute qualité et engageant",
          "Suivez les tendances de votre niche",
          "Utilisez des hashtags pertinents",
          "Collaborez avec d'autres créateurs",
          "Analysez les performances de vos publications"
        ]
      },
      
      engagement: {
        title: "Améliorer l'Engagement",
        tips: [
          "Répondez rapidement aux commentaires",
          "Posez des questions à votre audience",
          "Créez du contenu interactif",
          "Organisez des lives réguliers",
          "Partagez du contenu behind-the-scenes",
          "Créez une communauté autour de votre marque"
        ]
      },
      
      monetization: {
        title: "Stratégies de Monétisation",
        tips: [
          "Diversifiez vos sources de revenus",
          "Développez des partenariats à long terme",
          "Créez vos propres produits",
          "Proposez des services de consulting",
          "Lancez un programme d'affiliation",
          "Vendez des formations ou cours"
        ]
      },
      
      growth: {
        title: "Croissance de l'Audience",
        tips: [
          "Optimisez votre profil et bio",
          "Utilisez les analytics pour comprendre votre audience",
          "Collaborez avec des influenceurs de votre niche",
          "Participez aux tendances et challenges",
          "Créez du contenu viral",
          "Utilisez le cross-posting sur plusieurs plateformes"
        ]
      }
    }
  },
  
  // Platform Comparison
  platformComparison: {
    title: "Comparaison des Plateformes",
    subtitle: "Comparez vos revenus potentiels",
    
    metrics: {
      followers: "Followers",
      engagement: "Engagement",
      cpm: "CPM",
      avgEarningsPerPost: "Revenus Moyens/Publication",
      monthlyPotential: "Potentiel Mensuel",
      difficulty: "Difficulté de Monétisation"
    },
    
    platforms: {
      tiktok: "TikTok",
      instagram: "Instagram",
      youtube: "YouTube",
      twitter: "Twitter",
      facebook: "Facebook",
      linkedin: "LinkedIn",
      snapchat: "Snapchat",
      pinterest: "Pinterest"
    },
    
    recommendations: {
      title: "Recommandations",
      subtitle: "Basées sur votre profil",
      
      best: "Meilleure plateforme pour vous",
      alternative: "Alternatives recommandées",
      growth: "Plateformes pour la croissance"
    }
  },
  
  // Advanced Settings
  advancedSettings: {
    title: "Paramètres Avancés",
    subtitle: "Personnalisez vos calculs",
    
    sections: {
      rates: {
        title: "Taux Personnalisés",
        description: "Ajustez les taux selon votre expérience",
        
        sponsoredPostRate: {
          label: "Taux Publication Sponsorisée",
          description: "Montant par 1000 followers"
        },
        
        affiliateCommission: {
          label: "Commission d'Affiliation (%)",
          description: "Pourcentage moyen de commission"
        },
        
        cpmRate: {
          label: "Taux CPM",
          description: "Coût pour mille impressions"
        }
      },
      
      factors: {
        title: "Facteurs d'Ajustement",
        description: "Ajustez selon votre situation",
        
        nicheMultiplier: {
          label: "Multiplicateur de Niche",
          description: "Facteur basé sur la rentabilité de votre niche"
        },
        
        locationMultiplier: {
          label: "Multiplicateur de Localisation",
          description: "Facteur basé sur votre marché géographique"
        },
        
        seasonalityFactor: {
          label: "Facteur de Saisonnalité",
          description: "Ajustement pour les variations saisonnières"
        }
      },
      
      projections: {
        title: "Projections",
        description: "Paramètres de projection future",
        
        growthRate: {
          label: "Taux de Croissance Mensuel (%)",
          description: "Croissance attendue des followers"
        },
        
        engagementTrend: {
          label: "Tendance d'Engagement",
          description: "Évolution attendue de l'engagement"
        }
      }
    },
    
    actions: {
      reset: "Réinitialiser",
      save: "Sauvegarder",
      apply: "Appliquer"
    }
  },
  
  // Error Messages
  errors: {
    invalidFollowers: "Nombre de followers invalide",
    invalidEngagement: "Taux d'engagement invalide (0-100%)",
    invalidViews: "Nombre de vues invalide",
    calculationFailed: "Échec du calcul. Veuillez réessayer.",
    saveFailed: "Échec de la sauvegarde",
    loadFailed: "Échec du chargement des données",
    networkError: "Erreur de réseau",
    invalidInput: "Données d'entrée invalides"
  },
  
  // Loading States
  loading: {
    calculating: "Calcul en cours...",
    saving: "Sauvegarde...",
    loading: "Chargement...",
    generating: "Génération...",
    processing: "Traitement..."
  },
  
  // Empty States
  empty: {
    noResults: "Aucun résultat à afficher",
    noHistory: "Aucun historique de calculs",
    noComparison: "Aucune comparaison disponible",
    noTips: "Aucun conseil disponible"
  },
  
  // Actions
  actions: {
    calculate: "Calculer",
    recalculate: "Recalculer",
    save: "Sauvegarder",
    share: "Partager",
    export: "Exporter",
    print: "Imprimer",
    reset: "Réinitialiser",
    back: "Retour",
    next: "Suivant",
    previous: "Précédent",
    close: "Fermer",
    cancel: "Annuler",
    confirm: "Confirmer",
    edit: "Modifier",
    delete: "Supprimer",
    view: "Voir",
    copy: "Copier",
    download: "Télécharger"
  }
} as const;