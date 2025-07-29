export default {
  // Main FAQ
  title: "Questions Fréquemment Posées",
  subtitle: "Trouvez des réponses à vos questions sur notre calculateur de revenus",
  description: "Tout ce que vous devez savoir sur le calcul des revenus d'influenceur et l'utilisation de notre plateforme",
  
  // Categories
  categories: {
    general: {
      title: "Général",
      description: "Questions générales sur notre service",
      icon: "info"
    },
    
    calculator: {
      title: "Calculateur",
      description: "Comment utiliser nos calculateurs de revenus",
      icon: "calculator"
    },
    
    earnings: {
      title: "Revenus",
      description: "Comprendre les estimations de revenus",
      icon: "money"
    },
    
    platforms: {
      title: "Plateformes",
      description: "Questions spécifiques aux plateformes",
      icon: "platforms"
    },
    
    account: {
      title: "Compte",
      description: "Gestion de compte et fonctionnalités",
      icon: "user"
    },
    
    technical: {
      title: "Technique",
      description: "Support technique et dépannage",
      icon: "settings"
    }
  },
  
  // Questions and Answers
  questions: {
    // General
    general: [
      {
        id: "what-is-calculator",
        question: "Qu'est-ce que le Calculateur TikTok Money ?",
        answer: "Le Calculateur TikTok Money est un outil gratuit qui vous aide à estimer vos revenus potentiels en tant qu'influenceur sur diverses plateformes de médias sociaux comme TikTok, Instagram, YouTube et plus encore. Il utilise des données du secteur et vos métriques personnelles pour fournir des estimations réalistes.",
        tags: ["général", "introduction", "outil"]
      },
      {
        id: "how-accurate",
        question: "Quelle est la précision des estimations ?",
        answer: "Nos estimations sont basées sur des données moyennes du secteur et des algorithmes éprouvés. Bien qu'elles fournissent une bonne indication de votre potentiel de revenus, les gains réels peuvent varier en fonction de nombreux facteurs comme la qualité du contenu, l'engagement de l'audience, les stratégies de monétisation et les conditions du marché.",
        tags: ["précision", "estimations", "revenus"]
      },
      {
        id: "is-free",
        question: "L'utilisation du calculateur est-elle gratuite ?",
        answer: "Oui, notre calculateur de base est entièrement gratuit à utiliser. Nous proposons également des fonctionnalités premium comme l'analyse avancée, l'historique des calculs et les insights personnalisés pour les utilisateurs qui souhaitent des outils plus approfondis.",
        tags: ["gratuit", "prix", "premium"]
      },
      {
        id: "data-privacy",
        question: "Mes données sont-elles sécurisées ?",
        answer: "Absolument. Nous prenons la confidentialité des données très au sérieux. Toutes les informations que vous saisissez sont cryptées et stockées de manière sécurisée. Nous ne partageons jamais vos données personnelles avec des tiers sans votre consentement explicite.",
        tags: ["confidentialité", "sécurité", "données"]
      }
    ],
    
    // Calculator
    calculator: [
      {
        id: "how-to-use",
        question: "Comment utiliser le calculateur ?",
        answer: "C'est simple ! Sélectionnez votre plateforme (TikTok, Instagram, YouTube, etc.), entrez vos métriques actuelles comme le nombre de followers, le taux d'engagement et votre niche. Notre algorithme calculera instantanément vos revenus potentiels avec différents scénarios de monétisation.",
        tags: ["utilisation", "étapes", "guide"]
      },
      {
        id: "required-metrics",
        question: "Quelles métriques dois-je fournir ?",
        answer: "Les métriques de base incluent le nombre de followers, le taux d'engagement, les vues moyennes par publication et votre niche de contenu. Pour des estimations plus précises, vous pouvez également fournir votre localisation, le type de contenu et d'autres métriques avancées.",
        tags: ["métriques", "données", "précision"]
      },
      {
        id: "engagement-rate",
        question: "Comment calculer mon taux d'engagement ?",
        answer: "Le taux d'engagement = (Likes + Commentaires + Partages) ÷ Nombre de Followers × 100. Vous pouvez calculer cela pour vos dernières publications et faire une moyenne. La plupart des plateformes d'analytics fournissent également cette métrique directement.",
        tags: ["engagement", "calcul", "formule"]
      },
      {
        id: "multiple-platforms",
        question: "Puis-je calculer pour plusieurs plateformes ?",
        answer: "Oui ! Vous pouvez utiliser notre calculateur pour TikTok, Instagram, YouTube, Twitter, Facebook et d'autres plateformes. Chaque plateforme a ses propres métriques et facteurs de monétisation que nous prenons en compte.",
        tags: ["plateformes", "multi-plateforme", "comparaison"]
      }
    ],
    
    // Earnings
    earnings: [
      {
        id: "revenue-sources",
        question: "Quelles sources de revenus sont incluses ?",
        answer: "Nous incluons plusieurs sources de revenus : publications sponsorisées, marketing d'affiliation, placements de produits, partenariats de marque, revenus publicitaires, merchandising, dons/tips, abonnements payants, vente de cours et services de consulting.",
        tags: ["revenus", "sources", "monétisation"]
      },
      {
        id: "earnings-range",
        question: "Pourquoi y a-t-il une fourchette de revenus ?",
        answer: "Les revenus d'influenceur varient énormément selon de nombreux facteurs. Nous fournissons une fourchette (minimum, moyenne, maximum) pour refléter cette variabilité et vous donner une perspective réaliste de votre potentiel de gains.",
        tags: ["fourchette", "variabilité", "réalisme"]
      },
      {
        id: "increase-earnings",
        question: "Comment puis-je augmenter mes revenus estimés ?",
        answer: "Concentrez-vous sur l'amélioration de votre taux d'engagement, la croissance de votre audience, la création de contenu de haute qualité, la diversification de vos sources de revenus et la construction de relations solides avec les marques dans votre niche.",
        tags: ["augmentation", "conseils", "croissance"]
      },
      {
        id: "niche-impact",
        question: "Comment ma niche affecte-t-elle mes revenus ?",
        answer: "Certaines niches comme la technologie, la finance et la beauté ont généralement des taux de monétisation plus élevés en raison de la valeur commerciale plus importante et des budgets marketing plus importants des marques dans ces secteurs.",
        tags: ["niche", "impact", "secteurs"]
      }
    ],
    
    // Platforms
    platforms: [
      {
        id: "tiktok-monetization",
        question: "Comment fonctionne la monétisation TikTok ?",
        answer: "TikTok offre plusieurs options de monétisation : le Fonds Créateur, les cadeaux en live, les partenariats de marque via TikTok Creator Marketplace, et les revenus directs des marques. Les taux varient selon la région et l'engagement.",
        tags: ["tiktok", "monétisation", "fonds créateur"]
      },
      {
        id: "instagram-vs-tiktok",
        question: "Instagram ou TikTok : quelle plateforme paie mieux ?",
        answer: "Cela dépend de votre audience et niche. Instagram a généralement des taux plus élevés pour les publications sponsorisées, mais TikTok offre plus d'opportunités de viralité. Nous recommandons d'utiliser les deux plateformes de manière complémentaire.",
        tags: ["comparaison", "instagram", "tiktok"]
      },
      {
        id: "youtube-requirements",
        question: "Quels sont les prérequis pour monétiser YouTube ?",
        answer: "Pour rejoindre le Programme Partenaire YouTube, vous devez avoir 1 000 abonnés et 4 000 heures de visionnage au cours des 12 derniers mois, ou 1 000 abonnés et 10 millions de vues de Shorts en 90 jours.",
        tags: ["youtube", "prérequis", "monétisation"]
      },
      {
        id: "platform-algorithms",
        question: "Comment les algorithmes affectent-ils mes revenus ?",
        answer: "Les algorithmes déterminent la portée de votre contenu, ce qui affecte directement vos revenus. Un contenu qui performe bien dans l'algorithme obtient plus de vues, d'engagement et d'opportunités de monétisation.",
        tags: ["algorithmes", "portée", "performance"]
      }
    ],
    
    // Account
    account: [
      {
        id: "create-account",
        question: "Dois-je créer un compte pour utiliser le calculateur ?",
        answer: "Non, vous pouvez utiliser notre calculateur de base sans créer de compte. Cependant, créer un compte vous permet de sauvegarder vos calculs, accéder à l'historique et utiliser des fonctionnalités avancées.",
        tags: ["compte", "inscription", "fonctionnalités"]
      },
      {
        id: "save-calculations",
        question: "Puis-je sauvegarder mes calculs ?",
        answer: "Oui, avec un compte gratuit, vous pouvez sauvegarder vos calculs, les nommer, ajouter des notes et y accéder plus tard. C'est parfait pour suivre votre progression au fil du temps.",
        tags: ["sauvegarde", "historique", "suivi"]
      },
      {
        id: "premium-features",
        question: "Quelles sont les fonctionnalités premium ?",
        answer: "Les fonctionnalités premium incluent l'analyse avancée, les projections de croissance, les comparaisons détaillées entre plateformes, les rapports personnalisés, l'accès API et le support prioritaire.",
        tags: ["premium", "fonctionnalités", "avancé"]
      },
      {
        id: "delete-account",
        question: "Comment supprimer mon compte ?",
        answer: "Vous pouvez supprimer votre compte à tout moment depuis les paramètres de votre profil. Toutes vos données seront définitivement supprimées conformément à notre politique de confidentialité.",
        tags: ["suppression", "compte", "données"]
      }
    ],
    
    // Technical
    technical: [
      {
        id: "browser-support",
        question: "Quels navigateurs sont supportés ?",
        answer: "Notre calculateur fonctionne sur tous les navigateurs modernes : Chrome, Firefox, Safari, Edge. Nous recommandons d'utiliser la dernière version de votre navigateur pour une expérience optimale.",
        tags: ["navigateurs", "compatibilité", "support"]
      },
      {
        id: "mobile-app",
        question: "Y a-t-il une application mobile ?",
        answer: "Actuellement, nous n'avons pas d'application mobile dédiée, mais notre site web est entièrement responsive et fonctionne parfaitement sur tous les appareils mobiles et tablettes.",
        tags: ["mobile", "application", "responsive"]
      },
      {
        id: "api-access",
        question: "Proposez-vous un accès API ?",
        answer: "Oui, nous proposons un accès API pour les utilisateurs premium et les développeurs qui souhaitent intégrer nos calculs dans leurs propres applications ou sites web. Contactez-nous pour plus de détails.",
        tags: ["api", "intégration", "développeurs"]
      },
      {
        id: "data-export",
        question: "Puis-je exporter mes données ?",
        answer: "Oui, vous pouvez exporter vos calculs et données en formats CSV, PDF ou JSON. Cette fonctionnalité est disponible pour tous les utilisateurs enregistrés.",
        tags: ["export", "données", "formats"]
      }
    ]
  },
  
  // Contact
  contact: {
    title: "Vous ne trouvez pas votre réponse ?",
    subtitle: "Notre équipe de support est là pour vous aider",
    description: "Si vous avez d'autres questions ou besoin d'aide personnalisée, n'hésitez pas à nous contacter.",
    
    methods: [
      {
        type: "email",
        title: "Email Support",
        description: "Envoyez-nous un email détaillé",
        value: "support@tiktokmoneycalculator.com",
        responseTime: "Réponse sous 24h",
        icon: "email"
      },
      {
        type: "chat",
        title: "Chat en Direct",
        description: "Parlez directement avec notre équipe",
        value: "Disponible 24/7",
        responseTime: "Réponse immédiate",
        icon: "chat"
      },
      {
        type: "help",
        title: "Centre d'Aide",
        description: "Consultez notre documentation",
        value: "Base de connaissances complète",
        responseTime: "Accès instantané",
        icon: "help"
      }
    ]
  },
  
  // Popular Questions
  popular: {
    title: "Questions Populaires",
    subtitle: "Les questions les plus fréquemment posées",
    
    questions: [
      "Comment calculer mon taux d'engagement ?",
      "Quelle est la précision des estimations ?",
      "Puis-je utiliser le calculateur gratuitement ?",
      "Comment augmenter mes revenus estimés ?",
      "Quelles plateformes sont supportées ?",
      "Comment sauvegarder mes calculs ?"
    ]
  },
  
  // Updates
  updates: {
    title: "Mises à Jour Récentes",
    subtitle: "Dernières améliorations et nouvelles fonctionnalités",
    
    items: [
      {
        date: "2024-01-15",
        title: "Nouveau Calculateur YouTube Shorts",
        description: "Ajout du support pour les revenus YouTube Shorts avec des métriques spécialisées."
      },
      {
        date: "2024-01-10",
        title: "Amélioration des Estimations TikTok",
        description: "Mise à jour des algorithmes avec les dernières données du secteur pour des estimations plus précises."
      },
      {
        date: "2024-01-05",
        title: "Nouvelles Fonctionnalités Premium",
        description: "Lancement des projections de croissance et des rapports personnalisés."
      }
    ]
  },
  
  // Statistics
  stats: {
    title: "Statistiques de la Plateforme",
    subtitle: "Données en temps réel sur notre communauté",
    
    metrics: [
      {
        label: "Calculs Effectués",
        value: "500K+",
        description: "Calculs de revenus réalisés"
      },
      {
        label: "Utilisateurs Actifs",
        value: "50K+",
        description: "Créateurs utilisant notre plateforme"
      },
      {
        label: "Plateformes Supportées",
        value: "8",
        description: "Réseaux sociaux couverts"
      },
      {
        label: "Précision Moyenne",
        value: "85%",
        description: "Précision de nos estimations"
      }
    ]
  },
  
  // Feedback
  feedback: {
    title: "Votre Avis Compte",
    subtitle: "Aidez-nous à améliorer notre service",
    description: "Vos commentaires nous aident à créer de meilleures fonctionnalités et à améliorer l'expérience utilisateur.",
    
    form: {
      rating: {
        label: "Évaluez votre expérience",
        description: "Comment évalueriez-vous notre calculateur ?"
      },
      
      category: {
        label: "Catégorie",
        options: {
          bug: "Signaler un Bug",
          feature: "Demande de Fonctionnalité",
          improvement: "Suggestion d'Amélioration",
          general: "Commentaire Général"
        }
      },
      
      message: {
        label: "Votre Message",
        placeholder: "Partagez vos pensées, suggestions ou problèmes..."
      },
      
      contact: {
        label: "Email (Optionnel)",
        placeholder: "votre@email.com",
        description: "Si vous souhaitez une réponse"
      }
    },
    
    actions: {
      submit: "Envoyer le Feedback",
      submitting: "Envoi en cours..."
    }
  },
  
  // Search
  search: {
    placeholder: "Rechercher dans la FAQ...",
    button: "Rechercher",
    noResults: "Aucune question trouvée",
    resultsCount: "{{count}} résultat(s) trouvé(s)",
    
    suggestions: {
      title: "Recherches Populaires",
      items: [
        "taux d'engagement",
        "revenus TikTok",
        "monétisation Instagram",
        "YouTube Partner Program",
        "calculateur gratuit"
      ]
    }
  },
  
  // Navigation
  navigation: {
    all: "Toutes",
    category: "Catégorie",
    search: "Rechercher",
    popular: "Populaires",
    recent: "Récentes",
    helpful: "Utiles"
  },
  
  // Actions
  actions: {
    readMore: "Lire Plus",
    readLess: "Lire Moins",
    helpful: "Utile",
    notHelpful: "Pas Utile",
    share: "Partager",
    copy: "Copier le Lien",
    print: "Imprimer",
    feedback: "Donner un Avis",
    contact: "Nous Contacter",
    backToTop: "Retour en Haut"
  },
  
  // Loading States
  loading: {
    questions: "Chargement des questions...",
    search: "Recherche en cours...",
    feedback: "Envoi du feedback..."
  },
  
  // Error States
  errors: {
    loadFailed: "Échec du chargement des questions",
    searchFailed: "Échec de la recherche",
    feedbackFailed: "Échec de l'envoi du feedback",
    networkError: "Erreur de réseau"
  }
} as const;