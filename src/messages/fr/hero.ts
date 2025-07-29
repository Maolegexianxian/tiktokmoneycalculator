export default {
  // Main Calculator Section
  calculator: {
    title: "Calculateur de Revenus",
    subtitle: "Estimez vos revenus potentiels sur les réseaux sociaux",
    description: "Découvrez combien vous pourriez gagner en tant qu'influenceur sur TikTok, Instagram, YouTube et d'autres plateformes. Notre calculateur utilise des données réelles du marché pour fournir des estimations précises."
  },
  
  // Potential Earnings
  earnings: {
    title: "Vos Revenus Potentiels",
    subtitle: "Basé sur votre engagement et vos abonnés",
    
    ranges: {
      low: "Estimation Basse",
      average: "Estimation Moyenne",
      high: "Estimation Haute"
    },
    
    breakdown: {
      title: "Répartition des Revenus",
      sponsoredPosts: "Posts Sponsorisés",
      affiliateMarketing: "Marketing d'Affiliation",
      productSales: "Ventes de Produits",
      donations: "Dons/Tips",
      subscriptions: "Abonnements"
    },
    
    factors: {
      title: "Facteurs Influençant les Revenus",
      engagement: "Taux d'Engagement",
      niche: "Niche/Secteur",
      location: "Localisation",
      consistency: "Régularité",
      quality: "Qualité du Contenu"
    }
  },
  
  // Description
  description: {
    title: "Comment Ça Marche",
    subtitle: "Notre calculateur analyse plusieurs facteurs pour estimer vos revenus potentiels",
    
    features: [
      {
        title: "Analyse Multi-Plateformes",
        description: "Calculez vos revenus sur TikTok, Instagram, YouTube, Twitter et plus encore",
        icon: "platforms"
      },
      {
        title: "Données Réelles du Marché",
        description: "Basé sur des taux réels de l'industrie et des données de performance",
        icon: "data"
      },
      {
        title: "Estimations Personnalisées",
        description: "Prend en compte votre niche, localisation et style de contenu",
        icon: "personalized"
      },
      {
        title: "Insights Détaillés",
        description: "Obtenez des recommandations pour optimiser vos revenus",
        icon: "insights"
      }
    ]
  },
  
  // Call to Action
  cta: {
    primary: "Calculer Mes Revenus",
    secondary: "En Savoir Plus",
    
    benefits: {
      title: "Pourquoi Utiliser Notre Calculateur ?",
      items: [
        "Estimations précises basées sur des données réelles",
        "Support pour toutes les principales plateformes",
        "Conseils personnalisés pour augmenter vos revenus",
        "Gratuit et facile à utiliser",
        "Mis à jour régulièrement avec les dernières tendances"
      ]
    }
  },
  
  // Statistics
  stats: {
    title: "Statistiques de la Plateforme",
    
    items: [
      {
        number: "1M+",
        label: "Calculs Effectués",
        description: "Créateurs ont utilisé notre outil"
      },
      {
        number: "95%",
        label: "Précision",
        description: "Taux de précision de nos estimations"
      },
      {
        number: "50+",
        label: "Pays Supportés",
        description: "Données localisées disponibles"
      },
      {
        number: "24/7",
        label: "Disponibilité",
        description: "Accès gratuit à tout moment"
      }
    ]
  },
  
  // Trust Indicators
  trust: {
    title: "Approuvé par les Créateurs",
    subtitle: "Des milliers d'influenceurs nous font confiance pour leurs estimations de revenus",
    
    testimonials: [
      {
        name: "Marie Dubois",
        role: "Influenceuse Lifestyle",
        platform: "Instagram",
        followers: "250K",
        quote: "Ce calculateur m'a aidée à négocier de meilleurs tarifs avec les marques. Les estimations sont très précises !"
      },
      {
        name: "Thomas Martin",
        role: "Créateur Tech",
        platform: "YouTube",
        followers: "500K",
        quote: "Parfait pour planifier ma stratégie de monétisation. Je recommande vivement cet outil."
      },
      {
        name: "Sophie Laurent",
        role: "TikTokeuse",
        platform: "TikTok",
        followers: "1.2M",
        quote: "Interface simple et résultats détaillés. Exactement ce dont j'avais besoin pour développer mon business."
      }
    ],
    
    badges: [
      "Recommandé par les Experts",
      "Données Vérifiées",
      "Utilisé par 10K+ Créateurs",
      "Mis à Jour Quotidiennement"
    ]
  },
  
  // Platform Support
  platforms: {
    title: "Plateformes Supportées",
    subtitle: "Calculez vos revenus sur toutes les principales plateformes de réseaux sociaux",
    
    list: [
      {
        name: "TikTok",
        description: "Vidéos courtes et contenu viral",
        features: ["Creator Fund", "Live Gifts", "Brand Partnerships"],
        icon: "tiktok"
      },
      {
        name: "Instagram",
        description: "Photos, Stories et Reels",
        features: ["Posts Sponsorisés", "Stories", "IGTV", "Shopping"],
        icon: "instagram"
      },
      {
        name: "YouTube",
        description: "Contenu vidéo long format",
        features: ["AdSense", "Memberships", "Super Chat", "Sponsorships"],
        icon: "youtube"
      },
      {
        name: "Twitter",
        description: "Microblogging et engagement",
        features: ["Super Follows", "Tips", "Spaces"],
        icon: "twitter"
      },
      {
        name: "Twitch",
        description: "Streaming en direct",
        features: ["Subscriptions", "Bits", "Donations"],
        icon: "twitch"
      },
      {
        name: "LinkedIn",
        description: "Contenu professionnel",
        features: ["Newsletter", "Courses", "Consulting"],
        icon: "linkedin"
      }
    ]
  },
  
  // How It Works
  howItWorks: {
    title: "Comment Ça Marche",
    subtitle: "Obtenez vos estimations de revenus en 3 étapes simples",
    
    steps: [
      {
        number: "01",
        title: "Choisissez Votre Plateforme",
        description: "Sélectionnez la plateforme de réseaux sociaux pour laquelle vous voulez calculer vos revenus",
        icon: "platform-select"
      },
      {
        number: "02",
        title: "Entrez Vos Données",
        description: "Fournissez vos statistiques : abonnés, engagement, niche et localisation",
        icon: "data-input"
      },
      {
        number: "03",
        title: "Obtenez Vos Résultats",
        description: "Recevez des estimations détaillées et des conseils pour optimiser vos revenus",
        icon: "results"
      }
    ]
  }
} as const;