export default {
  // Login
  login: {
    title: "Iniciar Sesión",
    subtitle: "Accede a tu cuenta",
    email: "Correo Electrónico",
    password: "Contraseña",
    rememberMe: "Recordarme",
    forgotPassword: "¿Olvidaste tu contraseña?",
    loginButton: "Iniciar Sesión",
    noAccount: "¿No tienes una cuenta?",
    signUp: "Regístrate",
    
    socialLogin: {
      title: "O inicia sesión con",
      google: "Continuar con Google",
      facebook: "Continuar con Facebook",
      twitter: "Continuar con Twitter",
      github: "Continuar con GitHub"
    }
  },
  
  // Register
  register: {
    title: "Crear Cuenta",
    subtitle: "Únete a nuestra comunidad",
    firstName: "Nombre",
    lastName: "Apellido",
    email: "Correo Electrónico",
    password: "Contraseña",
    confirmPassword: "Confirmar Contraseña",
    agreeTerms: "Acepto los términos y condiciones",
    agreePrivacy: "Acepto la política de privacidad",
    registerButton: "Crear Cuenta",
    haveAccount: "¿Ya tienes una cuenta?",
    signIn: "Inicia sesión",
    
    socialRegister: {
      title: "O regístrate con",
      google: "Registrarse con Google",
      facebook: "Registrarse con Facebook",
      twitter: "Registrarse con Twitter",
      github: "Registrarse con GitHub"
    }
  },
  
  // Forgot Password
  forgotPassword: {
    title: "Recuperar Contraseña",
    subtitle: "Te enviaremos un enlace para restablecer tu contraseña",
    email: "Correo Electrónico",
    sendButton: "Enviar Enlace",
    backToLogin: "Volver al inicio de sesión",
    checkEmail: "Revisa tu correo electrónico",
    emailSent: "Hemos enviado un enlace de recuperación a tu correo electrónico."
  },
  
  // Reset Password
  resetPassword: {
    title: "Restablecer Contraseña",
    subtitle: "Ingresa tu nueva contraseña",
    newPassword: "Nueva Contraseña",
    confirmPassword: "Confirmar Nueva Contraseña",
    resetButton: "Restablecer Contraseña",
    success: "Tu contraseña ha sido restablecida exitosamente",
    backToLogin: "Volver al inicio de sesión"
  },
  
  // Email Verification
  verification: {
    title: "Verificar Correo Electrónico",
    subtitle: "Hemos enviado un código de verificación a tu correo",
    code: "Código de Verificación",
    verifyButton: "Verificar",
    resendCode: "Reenviar código",
    changeEmail: "Cambiar correo electrónico",
    success: "Tu correo electrónico ha sido verificado exitosamente",
    expired: "El código de verificación ha expirado",
    invalid: "Código de verificación inválido"
  },
  
  // Profile
  profile: {
    title: "Mi Perfil",
    personalInfo: "Información Personal",
    firstName: "Nombre",
    lastName: "Apellido",
    email: "Correo Electrónico",
    phone: "Teléfono",
    bio: "Biografía",
    website: "Sitio Web",
    location: "Ubicación",
    birthday: "Fecha de Nacimiento",
    gender: "Género",
    
    socialMedia: {
      title: "Redes Sociales",
      tiktok: "TikTok",
      instagram: "Instagram",
      youtube: "YouTube",
      twitter: "Twitter",
      facebook: "Facebook"
    },
    
    preferences: {
      title: "Preferencias",
      language: "Idioma",
      timezone: "Zona Horaria",
      currency: "Moneda",
      notifications: "Notificaciones"
    },
    
    actions: {
      save: "Guardar Cambios",
      cancel: "Cancelar",
      edit: "Editar",
      delete: "Eliminar Cuenta"
    }
  },
  
  // Settings
  settings: {
    title: "Configuración",
    
    account: {
      title: "Cuenta",
      changePassword: "Cambiar Contraseña",
      twoFactor: "Autenticación de Dos Factores",
      deleteAccount: "Eliminar Cuenta"
    },
    
    privacy: {
      title: "Privacidad",
      profileVisibility: "Visibilidad del Perfil",
      dataSharing: "Compartir Datos",
      analytics: "Analíticas"
    },
    
    notifications: {
      title: "Notificaciones",
      email: "Notificaciones por Correo",
      push: "Notificaciones Push",
      sms: "Notificaciones SMS",
      marketing: "Correos de Marketing"
    },
    
    billing: {
      title: "Facturación",
      subscription: "Suscripción",
      paymentMethod: "Método de Pago",
      billingHistory: "Historial de Facturación"
    }
  },
  
  // Errors
  errors: {
    invalidEmail: "Correo electrónico inválido",
    invalidPassword: "La contraseña debe tener al menos 8 caracteres",
    passwordMismatch: "Las contraseñas no coinciden",
    emailExists: "Este correo electrónico ya está registrado",
    emailNotFound: "Correo electrónico no encontrado",
    invalidCredentials: "Credenciales inválidas",
    accountLocked: "Cuenta bloqueada. Contacta soporte",
    sessionExpired: "Sesión expirada. Por favor inicia sesión nuevamente",
    networkError: "Error de conexión. Inténtalo de nuevo",
    serverError: "Error del servidor. Inténtalo más tarde",
    requiredField: "Este campo es requerido",
    weakPassword: "La contraseña es muy débil",
    invalidCode: "Código de verificación inválido",
    codeExpired: "El código ha expirado",
    tooManyAttempts: "Demasiados intentos. Inténtalo más tarde"
  },
  
  // Success Messages
  success: {
    loginSuccess: "Inicio de sesión exitoso",
    registerSuccess: "Cuenta creada exitosamente",
    passwordReset: "Contraseña restablecida exitosamente",
    emailVerified: "Correo electrónico verificado",
    profileUpdated: "Perfil actualizado exitosamente",
    settingsSaved: "Configuración guardada",
    passwordChanged: "Contraseña cambiada exitosamente",
    emailSent: "Correo electrónico enviado",
    accountDeleted: "Cuenta eliminada exitosamente"
  },
  
  // Validation
  validation: {
    required: "Este campo es requerido",
    minLength: "Debe tener al menos {min} caracteres",
    maxLength: "No puede tener más de {max} caracteres",
    email: "Debe ser un correo electrónico válido",
    password: "La contraseña debe tener al menos 8 caracteres",
    confirmPassword: "Las contraseñas deben coincidir",
    phone: "Número de teléfono inválido",
    url: "URL inválida",
    date: "Fecha inválida"
  },
  
  // Placeholders
  placeholders: {
    email: "tu@correo.com",
    password: "Ingresa tu contraseña",
    firstName: "Tu nombre",
    lastName: "Tu apellido",
    phone: "+1 (555) 123-4567",
    bio: "Cuéntanos sobre ti...",
    website: "https://tusitio.com",
    location: "Ciudad, País",
    verificationCode: "123456"
  }
} as const;