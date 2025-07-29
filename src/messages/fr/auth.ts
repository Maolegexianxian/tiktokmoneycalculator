export default {
  // Login
  login: {
    title: "Connexion",
    subtitle: "Connectez-vous à votre compte",
    welcome: "Bon retour !",
    description: "Connectez-vous pour accéder à vos calculs sauvegardés et fonctionnalités premium",
    
    form: {
      email: "Email",
      password: "Mot de passe",
      rememberMe: "Se souvenir de moi",
      forgotPassword: "Mot de passe oublié ?",
      submit: "Se connecter",
      submitting: "Connexion en cours..."
    },
    
    social: {
      title: "Ou connectez-vous avec",
      google: "Continuer avec Google",
      facebook: "Continuer avec Facebook",
      twitter: "Continuer avec Twitter",
      github: "Continuer avec GitHub",
      apple: "Continuer avec Apple"
    },
    
    footer: {
      noAccount: "Pas encore de compte ?",
      signUp: "S'inscrire",
      backToHome: "Retour à l'accueil"
    }
  },
  
  // Register
  register: {
    title: "Inscription",
    subtitle: "Créez votre compte",
    welcome: "Commençons !",
    description: "Créez un compte pour sauvegarder vos calculs et accéder aux fonctionnalités premium",
    
    form: {
      firstName: "Prénom",
      lastName: "Nom",
      email: "Email",
      password: "Mot de passe",
      confirmPassword: "Confirmer le mot de passe",
      acceptTerms: "J'accepte les conditions d'utilisation",
      acceptPrivacy: "J'accepte la politique de confidentialité",
      subscribe: "Recevoir les mises à jour par email",
      submit: "Créer un compte",
      submitting: "Création du compte..."
    },
    
    social: {
      title: "Ou inscrivez-vous avec",
      google: "S'inscrire avec Google",
      facebook: "S'inscrire avec Facebook",
      twitter: "S'inscrire avec Twitter",
      github: "S'inscrire avec GitHub",
      apple: "S'inscrire avec Apple"
    },
    
    footer: {
      hasAccount: "Déjà un compte ?",
      signIn: "Se connecter",
      backToHome: "Retour à l'accueil"
    }
  },
  
  // Forgot Password
  forgotPassword: {
    title: "Mot de passe oublié",
    subtitle: "Réinitialisez votre mot de passe",
    description: "Entrez votre email et nous vous enverrons un lien pour réinitialiser votre mot de passe",
    
    form: {
      email: "Email",
      submit: "Envoyer le lien",
      submitting: "Envoi en cours..."
    },
    
    footer: {
      backToLogin: "Retour à la connexion",
      noAccount: "Pas de compte ?",
      signUp: "S'inscrire"
    }
  },
  
  // Reset Password
  resetPassword: {
    title: "Réinitialiser le mot de passe",
    subtitle: "Créez un nouveau mot de passe",
    description: "Entrez votre nouveau mot de passe ci-dessous",
    
    form: {
      password: "Nouveau mot de passe",
      confirmPassword: "Confirmer le nouveau mot de passe",
      submit: "Réinitialiser le mot de passe",
      submitting: "Réinitialisation..."
    },
    
    footer: {
      backToLogin: "Retour à la connexion"
    }
  },
  
  // Email Verification
  emailVerification: {
    title: "Vérifiez votre email",
    subtitle: "Confirmation requise",
    description: "Nous avons envoyé un email de vérification à",
    instructions: "Cliquez sur le lien dans l'email pour vérifier votre compte",
    
    actions: {
      resend: "Renvoyer l'email",
      resending: "Renvoi en cours...",
      changeEmail: "Changer d'email",
      backToLogin: "Retour à la connexion"
    },
    
    status: {
      sent: "Email envoyé !",
      verified: "Email vérifié !",
      expired: "Le lien a expiré",
      invalid: "Lien invalide"
    }
  },
  
  // Profile
  profile: {
    title: "Profil",
    subtitle: "Gérez vos informations personnelles",
    
    sections: {
      personal: {
        title: "Informations personnelles",
        description: "Mettez à jour vos informations de base",
        
        form: {
          firstName: "Prénom",
          lastName: "Nom",
          email: "Email",
          phone: "Téléphone",
          bio: "Biographie",
          website: "Site web",
          location: "Localisation",
          timezone: "Fuseau horaire",
          language: "Langue",
          avatar: "Photo de profil",
          submit: "Sauvegarder les modifications",
          submitting: "Sauvegarde..."
        }
      },
      
      security: {
        title: "Sécurité",
        description: "Gérez votre mot de passe et la sécurité du compte",
        
        changePassword: {
          title: "Changer le mot de passe",
          currentPassword: "Mot de passe actuel",
          newPassword: "Nouveau mot de passe",
          confirmPassword: "Confirmer le nouveau mot de passe",
          submit: "Changer le mot de passe",
          submitting: "Changement..."
        },
        
        twoFactor: {
          title: "Authentification à deux facteurs",
          description: "Ajoutez une couche de sécurité supplémentaire",
          enable: "Activer 2FA",
          disable: "Désactiver 2FA",
          status: {
            enabled: "Activé",
            disabled: "Désactivé"
          }
        },
        
        sessions: {
          title: "Sessions actives",
          description: "Gérez vos sessions de connexion",
          current: "Session actuelle",
          revokeAll: "Révoquer toutes les sessions",
          revoke: "Révoquer"
        }
      },
      
      preferences: {
        title: "Préférences",
        description: "Personnalisez votre expérience",
        
        notifications: {
          title: "Notifications",
          email: "Notifications par email",
          push: "Notifications push",
          sms: "Notifications SMS",
          marketing: "Emails marketing",
          updates: "Mises à jour produit",
          security: "Alertes de sécurité"
        },
        
        display: {
          title: "Affichage",
          theme: "Thème",
          language: "Langue",
          currency: "Devise",
          dateFormat: "Format de date",
          timeFormat: "Format d'heure"
        }
      },
      
      billing: {
        title: "Facturation",
        description: "Gérez votre abonnement et facturation",
        
        subscription: {
          title: "Abonnement actuel",
          plan: "Plan",
          status: "Statut",
          nextBilling: "Prochaine facturation",
          amount: "Montant",
          upgrade: "Mettre à niveau",
          downgrade: "Rétrograder",
          cancel: "Annuler"
        },
        
        paymentMethods: {
          title: "Méthodes de paiement",
          add: "Ajouter une méthode",
          edit: "Modifier",
          delete: "Supprimer",
          setDefault: "Définir par défaut"
        },
        
        invoices: {
          title: "Factures",
          download: "Télécharger",
          view: "Voir",
          date: "Date",
          amount: "Montant",
          status: "Statut"
        }
      }
    }
  },
  
  // Settings
  settings: {
    title: "Paramètres",
    subtitle: "Configurez votre compte",
    
    navigation: {
      general: "Général",
      security: "Sécurité",
      notifications: "Notifications",
      billing: "Facturation",
      privacy: "Confidentialité",
      advanced: "Avancé"
    },
    
    actions: {
      save: "Sauvegarder",
      cancel: "Annuler",
      reset: "Réinitialiser",
      export: "Exporter les données",
      delete: "Supprimer le compte"
    }
  },
  
  // Error Messages
  errors: {
    // Validation
    required: "Ce champ est requis",
    invalidEmail: "Email invalide",
    passwordTooShort: "Le mot de passe doit contenir au moins 8 caractères",
    passwordMismatch: "Les mots de passe ne correspondent pas",
    weakPassword: "Mot de passe trop faible",
    
    // Authentication
    invalidCredentials: "Email ou mot de passe incorrect",
    accountNotFound: "Compte non trouvé",
    accountDisabled: "Compte désactivé",
    accountLocked: "Compte verrouillé",
    emailNotVerified: "Email non vérifié",
    
    // Registration
    emailExists: "Cet email est déjà utilisé",
    registrationFailed: "Échec de l'inscription",
    
    // Password Reset
    resetTokenInvalid: "Lien de réinitialisation invalide ou expiré",
    resetFailed: "Échec de la réinitialisation du mot de passe",
    
    // General
    networkError: "Erreur de réseau",
    serverError: "Erreur du serveur",
    unknownError: "Une erreur inattendue s'est produite",
    sessionExpired: "Session expirée",
    unauthorized: "Non autorisé",
    forbidden: "Accès interdit",
    rateLimited: "Trop de tentatives. Réessayez plus tard"
  },
  
  // Success Messages
  success: {
    loginSuccess: "Connexion réussie !",
    registrationSuccess: "Compte créé avec succès !",
    passwordChanged: "Mot de passe modifié avec succès",
    passwordReset: "Mot de passe réinitialisé avec succès",
    emailVerified: "Email vérifié avec succès",
    profileUpdated: "Profil mis à jour avec succès",
    settingsSaved: "Paramètres sauvegardés",
    emailSent: "Email envoyé avec succès",
    logoutSuccess: "Déconnexion réussie"
  },
  
  // Confirmation Messages
  confirmations: {
    deleteAccount: {
      title: "Supprimer le compte",
      message: "Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.",
      confirm: "Oui, supprimer",
      cancel: "Annuler"
    },
    
    logout: {
      title: "Se déconnecter",
      message: "Êtes-vous sûr de vouloir vous déconnecter ?",
      confirm: "Se déconnecter",
      cancel: "Annuler"
    },
    
    changePassword: {
      title: "Changer le mot de passe",
      message: "Vous serez déconnecté de tous les appareils après le changement.",
      confirm: "Continuer",
      cancel: "Annuler"
    }
  },
  
  // Validation
  validation: {
    email: {
      required: "L'email est requis",
      invalid: "Format d'email invalide",
      exists: "Cet email est déjà utilisé"
    },
    
    password: {
      required: "Le mot de passe est requis",
      minLength: "Au moins 8 caractères requis",
      maxLength: "Maximum 128 caractères",
      uppercase: "Au moins une majuscule requise",
      lowercase: "Au moins une minuscule requise",
      number: "Au moins un chiffre requis",
      special: "Au moins un caractère spécial requis",
      mismatch: "Les mots de passe ne correspondent pas"
    },
    
    name: {
      required: "Le nom est requis",
      minLength: "Au moins 2 caractères requis",
      maxLength: "Maximum 50 caractères",
      invalid: "Caractères invalides"
    },
    
    phone: {
      invalid: "Numéro de téléphone invalide",
      required: "Le numéro de téléphone est requis"
    },
    
    terms: {
      required: "Vous devez accepter les conditions d'utilisation"
    }
  },
  
  // Placeholders
  placeholders: {
    email: "votre@email.com",
    password: "Entrez votre mot de passe",
    firstName: "Votre prénom",
    lastName: "Votre nom",
    phone: "+33 1 23 45 67 89",
    bio: "Parlez-nous de vous...",
    website: "https://votre-site.com",
    location: "Paris, France",
    search: "Rechercher..."
  },
  
  // Loading States
  loading: {
    authenticating: "Authentification...",
    loading: "Chargement...",
    saving: "Sauvegarde...",
    sending: "Envoi...",
    verifying: "Vérification...",
    processing: "Traitement..."
  },
  
  // Status
  status: {
    online: "En ligne",
    offline: "Hors ligne",
    active: "Actif",
    inactive: "Inactif",
    verified: "Vérifié",
    unverified: "Non vérifié",
    pending: "En attente",
    approved: "Approuvé",
    rejected: "Rejeté"
  }
} as const;