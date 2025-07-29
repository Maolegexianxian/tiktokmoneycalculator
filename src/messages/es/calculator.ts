export default {
  // TikTok Calculator
  tiktok: {
    title: "Calculadora de Ingresos TikTok",
    subtitle: "Calcula tus ganancias potenciales en TikTok",
    description: "Estima tus ingresos basándote en seguidores, engagement y nicho de contenido",
    
    form: {
      followers: {
        label: "Número de Seguidores",
        placeholder: "Ej: 100000",
        help: "Tu número actual de seguidores en TikTok"
      },
      
      engagement: {
        label: "Tasa de Engagement (%)",
        placeholder: "Ej: 5.2",
        help: "Promedio de likes, comentarios y shares por post"
      },
      
      niche: {
        label: "Nicho de Contenido",
        placeholder: "Selecciona tu nicho",
        options: {
          lifestyle: "Lifestyle",
          beauty: "Belleza",
          fashion: "Moda",
          fitness: "Fitness",
          food: "Comida",
          travel: "Viajes",
          tech: "Tecnología",
          gaming: "Gaming",
          music: "Música",
          dance: "Baile",
          comedy: "Comedia",
          education: "Educación",
          business: "Negocios",
          other: "Otro"
        }
      },
      
      location: {
        label: "Ubicación Principal",
        placeholder: "Selecciona tu país",
        help: "Afecta las tarifas de CPM y brand deals"
      },
      
      postFrequency: {
        label: "Frecuencia de Posts",
        placeholder: "Posts por semana",
        options: {
          daily: "Diario (7+ por semana)",
          frequent: "Frecuente (4-6 por semana)",
          regular: "Regular (2-3 por semana)",
          occasional: "Ocasional (1 por semana)",
          rare: "Raro (menos de 1 por semana)"
        }
      }
    },
    
    calculate: "Calcular Ingresos",
    calculating: "Calculando..."
  },
  
  // Instagram Calculator
  instagram: {
    title: "Calculadora de Ingresos Instagram",
    subtitle: "Estima tus ganancias en Instagram",
    description: "Calcula ingresos de posts, stories, reels e IGTV",
    
    form: {
      followers: {
        label: "Seguidores de Instagram",
        placeholder: "Ej: 50000"
      },
      
      engagement: {
        label: "Tasa de Engagement (%)",
        placeholder: "Ej: 3.5"
      },
      
      contentTypes: {
        label: "Tipos de Contenido",
        posts: "Posts en Feed",
        stories: "Stories",
        reels: "Reels",
        igtv: "IGTV"
      }
    }
  },
  
  // YouTube Calculator
  youtube: {
    title: "Calculadora de Ingresos YouTube",
    subtitle: "Calcula ganancias de YouTube",
    description: "Estima ingresos de AdSense, membresías y Super Chat",
    
    form: {
      subscribers: {
        label: "Suscriptores",
        placeholder: "Ej: 10000"
      },
      
      views: {
        label: "Visualizaciones Mensuales",
        placeholder: "Ej: 100000"
      },
      
      cpm: {
        label: "CPM Estimado ($)",
        placeholder: "Ej: 2.50",
        help: "Costo por mil impresiones"
      }
    }
  },
  
  // Results
  results: {
    title: "Estimación de Ingresos",
    subtitle: "Basado en tus métricas actuales",
    
    earnings: {
      daily: "Ingresos Diarios",
      weekly: "Ingresos Semanales",
      monthly: "Ingresos Mensuales",
      yearly: "Ingresos Anuales"
    },
    
    breakdown: {
      title: "Desglose de Ingresos",
      brandDeals: "Brand Deals",
      creatorFund: "Creator Fund",
      liveGifts: "Regalos en Vivo",
      merchandise: "Merchandising",
      affiliateMarketing: "Marketing de Afiliados",
      sponsoredContent: "Contenido Patrocinado"
    },
    
    factors: {
      title: "Factores que Afectan los Ingresos",
      engagement: "Tasa de Engagement",
      niche: "Nicho de Contenido",
      audience: "Demografía de Audiencia",
      consistency: "Consistencia de Contenido",
      quality: "Calidad de Contenido"
    },
    
    disclaimer: {
      title: "Descargo de Responsabilidad",
      text: "Estas son estimaciones basadas en promedios de la industria. Los ingresos reales pueden variar significativamente según múltiples factores como calidad del contenido, engagement de la audiencia, temporada y tendencias del mercado."
    }
  },
  
  // History
  history: {
    title: "Historial de Cálculos",
    subtitle: "Tus cálculos anteriores",
    empty: "No tienes cálculos guardados aún",
    
    table: {
      date: "Fecha",
      platform: "Plataforma",
      followers: "Seguidores",
      engagement: "Engagement",
      earnings: "Ingresos Est.",
      actions: "Acciones"
    },
    
    actions: {
      view: "Ver Detalles",
      recalculate: "Recalcular",
      delete: "Eliminar",
      export: "Exportar"
    }
  },
  
  // Sharing
  sharing: {
    title: "Compartir Resultados",
    subtitle: "Comparte tu estimación de ingresos",
    
    options: {
      link: "Copiar Enlace",
      social: "Redes Sociales",
      email: "Enviar por Email",
      pdf: "Descargar PDF"
    },
    
    social: {
      twitter: "Compartir en Twitter",
      facebook: "Compartir en Facebook",
      linkedin: "Compartir en LinkedIn",
      whatsapp: "Compartir en WhatsApp"
    },
    
    messages: {
      linkCopied: "Enlace copiado al portapapeles",
      emailSent: "Email enviado exitosamente",
      pdfGenerated: "PDF generado exitosamente"
    }
  },
  
  // Save Calculation
  save: {
    title: "Guardar Cálculo",
    name: {
      label: "Nombre del Cálculo",
      placeholder: "Ej: Mi Estimación TikTok Enero 2024"
    },
    notes: {
      label: "Notas (Opcional)",
      placeholder: "Agrega notas sobre este cálculo..."
    },
    tags: {
      label: "Etiquetas",
      placeholder: "Agrega etiquetas separadas por comas"
    },
    privacy: {
      label: "Configuración de Privacidad",
      private: "Privado (solo yo)",
      public: "Público (visible para otros)",
      shared: "Compartido (con enlace)"
    },
    actions: {
      save: "Guardar Cálculo",
      cancel: "Cancelar"
    }
  },
  
  // Growth Tips
  growthTips: {
    title: "Consejos para Aumentar Ingresos",
    subtitle: "Estrategias basadas en tu perfil",
    
    engagement: {
      title: "Mejorar Engagement",
      tips: [
        "Responde a todos los comentarios en las primeras horas",
        "Haz preguntas en tus captions para generar interacción",
        "Usa trending hashtags relevantes a tu nicho",
        "Colabora con otros creadores de tu nicho",
        "Publica cuando tu audiencia esté más activa"
      ]
    },
    
    content: {
      title: "Optimizar Contenido",
      tips: [
        "Mantén consistencia en tu estilo visual",
        "Crea contenido educativo y de valor",
        "Sigue las tendencias pero con tu toque personal",
        "Usa música trending en tus videos",
        "Optimiza la duración de tus videos para tu audiencia"
      ]
    },
    
    monetization: {
      title: "Estrategias de Monetización",
      tips: [
        "Diversifica tus fuentes de ingresos",
        "Construye un email list de tu audiencia",
        "Crea productos digitales relacionados a tu nicho",
        "Ofrece servicios de consultoría o coaching",
        "Desarrolla partnerships a largo plazo con marcas"
      ]
    },
    
    audience: {
      title: "Hacer Crecer tu Audiencia",
      tips: [
        "Publica contenido regularmente",
        "Optimiza tu bio y foto de perfil",
        "Participa en challenges y trends",
        "Cross-promote en otras plataformas",
        "Analiza tu audiencia y crea contenido para ellos"
      ]
    }
  },
  
  // Comparison
  comparison: {
    title: "Comparar Plataformas",
    subtitle: "Compara tus ingresos potenciales en diferentes plataformas",
    
    metrics: {
      platform: "Plataforma",
      followers: "Seguidores",
      engagement: "Engagement",
      cpm: "CPM",
      monthlyEarnings: "Ingresos Mensuales",
      potential: "Potencial"
    },
    
    recommendations: {
      title: "Recomendaciones",
      focus: "Enfócate en",
      diversify: "Diversifica en",
      optimize: "Optimiza"
    }
  },
  
  // Advanced Settings
  advanced: {
    title: "Configuración Avanzada",
    
    customRates: {
      title: "Tarifas Personalizadas",
      description: "Ajusta las tarifas basándote en tu experiencia",
      
      brandDealRate: {
        label: "Tarifa por Brand Deal (por 1K seguidores)",
        placeholder: "Ej: 10"
      },
      
      cpmRate: {
        label: "CPM Personalizado",
        placeholder: "Ej: 2.50"
      }
    },
    
    audienceInsights: {
      title: "Insights de Audiencia",
      
      demographics: {
        title: "Demografía",
        ageGroups: "Grupos de Edad",
        gender: "Género",
        location: "Ubicación Geográfica"
      },
      
      behavior: {
        title: "Comportamiento",
        activeHours: "Horas Activas",
        deviceUsage: "Uso de Dispositivos",
        contentPreferences: "Preferencias de Contenido"
      }
    }
  },
  
  // Errors
  errors: {
    invalidFollowers: "Número de seguidores inválido",
    invalidEngagement: "Tasa de engagement debe estar entre 0-100%",
    missingNiche: "Por favor selecciona un nicho",
    calculationFailed: "Error en el cálculo. Inténtalo de nuevo",
    saveError: "Error al guardar el cálculo",
    loadError: "Error al cargar los datos"
  },
  
  // Loading States
  loading: {
    calculating: "Calculando tus ingresos...",
    saving: "Guardando cálculo...",
    loading: "Cargando datos...",
    generating: "Generando reporte..."
  }
} as const;