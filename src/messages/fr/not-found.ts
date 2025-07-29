export default {
  // Page Not Found
  title: "Page Non Trouvée",
  subtitle: "Erreur 404",
  
  // Main Message
  message: {
    heading: "Oups ! Cette page n'existe pas",
    description: "La page que vous recherchez a peut-être été déplacée, supprimée ou n'a jamais existé.",
    alternative: "Voici quelques suggestions pour vous aider à trouver ce que vous cherchez :"
  },
  
  // Suggestions
  suggestions: {
    title: "Que pouvez-vous faire ?",
    
    items: [
      {
        title: "Vérifiez l'URL",
        description: "Assurez-vous que l'adresse est correctement saisie",
        icon: "link"
      },
      {
        title: "Retournez à l'accueil",
        description: "Commencez depuis notre page d'accueil",
        icon: "home"
      },
      {
        title: "Utilisez la recherche",
        description: "Recherchez le contenu que vous souhaitez",
        icon: "search"
      },
      {
        title: "Consultez notre aide",
        description: "Trouvez des réponses dans notre section d'aide",
        icon: "help"
      }
    ]
  },
  
  // Actions
  actions: {
    goHome: "Retour à l'Accueil",
    goBack: "Page Précédente",
    search: "Rechercher",
    contact: "Nous Contacter",
    reportIssue: "Signaler un Problème"
  },
  
  // Popular Pages
  popularPages: {
    title: "Pages Populaires",
    subtitle: "Voici quelques-unes de nos pages les plus visitées",
    
    pages: [
      {
        title: "Calculateur TikTok",
        description: "Calculez vos revenus potentiels sur TikTok",
        href: "/calculator/tiktok",
        icon: "tiktok"
      },
      {
        title: "Calculateur Instagram",
        description: "Estimez vos gains sur Instagram",
        href: "/calculator/instagram",
        icon: "instagram"
      },
      {
        title: "Calculateur YouTube",
        description: "Découvrez vos revenus YouTube potentiels",
        href: "/calculator/youtube",
        icon: "youtube"
      },
      {
        title: "Comparateur de Plateformes",
        description: "Comparez les revenus entre différentes plateformes",
        href: "/compare",
        icon: "compare"
      },
      {
        title: "Analytics",
        description: "Analysez vos performances et obtenez des insights",
        href: "/analytics",
        icon: "analytics"
      },
      {
        title: "FAQ",
        description: "Questions fréquemment posées",
        href: "/faq",
        icon: "question"
      }
    ]
  },
  
  // Help Section
  help: {
    title: "Besoin d'Aide ?",
    subtitle: "Notre équipe de support est là pour vous aider",
    
    options: [
      {
        title: "Centre d'Aide",
        description: "Consultez notre documentation complète",
        href: "/help",
        icon: "book"
      },
      {
        title: "Chat en Direct",
        description: "Parlez directement avec notre équipe",
        action: "openChat",
        icon: "chat"
      },
      {
        title: "Email Support",
        description: "Envoyez-nous un email détaillé",
        href: "mailto:support@tiktokmoneycalculator.com",
        icon: "email"
      },
      {
        title: "Communauté",
        description: "Rejoignez notre communauté d'utilisateurs",
        href: "/community",
        icon: "users"
      }
    ]
  },
  
  // Search
  search: {
    placeholder: "Rechercher sur notre site...",
    button: "Rechercher",
    noResults: "Aucun résultat trouvé",
    
    suggestions: {
      title: "Recherches Populaires",
      items: [
        "Calculateur de revenus",
        "Comment monétiser TikTok",
        "Taux d'engagement Instagram",
        "Revenus YouTube",
        "Stratégies d'influenceur"
      ]
    }
  },
  
  // Error Details
  errorDetails: {
    code: "404",
    message: "Page Non Trouvée",
    timestamp: "Horodatage",
    requestId: "ID de Requête",
    
    technical: {
      title: "Détails Techniques",
      description: "Si vous pensez qu'il s'agit d'une erreur de notre part, veuillez inclure ces informations lors de votre signalement :"
    }
  },
  
  // Contact Information
  contact: {
    title: "Contactez-Nous",
    subtitle: "Nous sommes là pour vous aider",
    
    methods: [
      {
        type: "email",
        label: "Email",
        value: "support@tiktokmoneycalculator.com",
        description: "Réponse sous 24h"
      },
      {
        type: "chat",
        label: "Chat en Direct",
        value: "Disponible 24/7",
        description: "Réponse immédiate"
      },
      {
        type: "phone",
        label: "Téléphone",
        value: "+33 1 23 45 67 89",
        description: "Lun-Ven 9h-18h"
      }
    ]
  },
  
  // Social Links
  social: {
    title: "Suivez-Nous",
    subtitle: "Restez connecté pour les dernières mises à jour",
    
    platforms: [
      {
        name: "Twitter",
        href: "https://twitter.com/tiktokcalculator",
        icon: "twitter"
      },
      {
        name: "Facebook",
        href: "https://facebook.com/tiktokcalculator",
        icon: "facebook"
      },
      {
        name: "Instagram",
        href: "https://instagram.com/tiktokcalculator",
        icon: "instagram"
      },
      {
        name: "LinkedIn",
        href: "https://linkedin.com/company/tiktokcalculator",
        icon: "linkedin"
      }
    ]
  },
  
  // Footer
  footer: {
    copyright: "© 2024 TikTok Money Calculator. Tous droits réservés.",
    
    links: [
      {
        title: "Confidentialité",
        href: "/privacy"
      },
      {
        title: "Conditions d'Utilisation",
        href: "/terms"
      },
      {
        title: "Cookies",
        href: "/cookies"
      },
      {
        title: "Plan du Site",
        href: "/sitemap"
      }
    ]
  },
  
  // Meta Information
  meta: {
    title: "Page Non Trouvée - TikTok Money Calculator",
    description: "La page que vous recherchez n'existe pas. Découvrez nos calculateurs de revenus pour TikTok, Instagram, YouTube et plus encore."
  },
  
  // Accessibility
  accessibility: {
    skipToContent: "Aller au contenu principal",
    backToTop: "Retour en haut",
    mainContent: "Contenu principal",
    navigation: "Navigation",
    searchForm: "Formulaire de recherche"
  },
  
  // Loading States
  loading: {
    search: "Recherche en cours...",
    suggestions: "Chargement des suggestions...",
    popularPages: "Chargement des pages populaires..."
  },
  
  // Error Messages
  errors: {
    searchFailed: "La recherche a échoué. Veuillez réessayer.",
    loadFailed: "Échec du chargement du contenu.",
    networkError: "Erreur de réseau. Vérifiez votre connexion.",
    serverError: "Erreur du serveur. Veuillez réessayer plus tard."
  }
} as const;