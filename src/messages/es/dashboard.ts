export default {
  title: "Panel de Control",
  
  welcome: {
    title: "¡Bienvenido de vuelta!",
    subtitle: "Aquí tienes un resumen de tu actividad reciente",
    newUser: "¡Bienvenido! Comienza calculando tus primeros ingresos."
  },
  
  // Activity Feed
  activityFeed: {
    title: "Actividad Reciente",
    empty: "No hay actividad reciente",
    
    types: {
      calculation: "Nuevo cálculo",
      save: "Cálculo guardado",
      share: "Cálculo compartido",
      export: "Datos exportados",
      profile: "Perfil actualizado"
    },
    
    actions: {
      view: "Ver",
      edit: "Editar",
      delete: "Eliminar"
    }
  },
  
  // Header
  header: {
    greeting: {
      morning: "Buenos días",
      afternoon: "Buenas tardes",
      evening: "Buenas noches"
    },
    
    stats: {
      totalCalculations: "Total de Cálculos",
      savedCalculations: "Cálculos Guardados",
      avgEarnings: "Ingresos Promedio",
      lastCalculation: "Último Cálculo"
    }
  },
  
  // Overview Cards
  overview: {
    title: "Resumen General",
    
    cards: {
      totalEarnings: {
        title: "Ingresos Totales Estimados",
        subtitle: "Basado en todos tus cálculos",
        period: "Este mes"
      },
      
      bestPlatform: {
        title: "Mejor Plataforma",
        subtitle: "Mayor potencial de ingresos",
        change: "vs mes anterior"
      },
      
      engagement: {
        title: "Engagement Promedio",
        subtitle: "Todas las plataformas",
        trend: "Tendencia"
      },
      
      growth: {
        title: "Crecimiento",
        subtitle: "Seguidores este mes",
        projection: "Proyección"
      }
    }
  },
  
  // Earnings Chart
  earningsChart: {
    title: "Tendencia de Ingresos",
    subtitle: "Ingresos estimados a lo largo del tiempo",
    
    periods: {
      week: "7 días",
      month: "30 días",
      quarter: "3 meses",
      year: "12 meses"
    },
    
    metrics: {
      revenue: "Ingresos",
      growth: "Crecimiento",
      engagement: "Engagement",
      followers: "Seguidores"
    },
    
    noData: "No hay datos suficientes para mostrar el gráfico"
  },
  
  // Quick Actions
  quickActions: {
    title: "Acciones Rápidas",
    
    actions: [
      {
        title: "Nueva Calculadora",
        description: "Calcula ingresos para una plataforma",
        icon: "calculator",
        href: "/calculator"
      },
      {
        title: "Comparar Plataformas",
        description: "Compara ingresos entre plataformas",
        icon: "compare",
        href: "/compare"
      },
      {
        title: "Analizar Tendencias",
        description: "Ve insights de tu crecimiento",
        icon: "trending-up",
        href: "/analytics"
      },
      {
        title: "Exportar Datos",
        description: "Descarga tus cálculos",
        icon: "download",
        action: "export"
      }
    ]
  },
  
  // Recent Calculations
  recentCalculations: {
    title: "Cálculos Recientes",
    subtitle: "Tus últimos cálculos de ingresos",
    empty: "No tienes cálculos recientes",
    
    table: {
      platform: "Plataforma",
      date: "Fecha",
      followers: "Seguidores",
      engagement: "Engagement",
      earnings: "Ingresos Est.",
      actions: "Acciones"
    },
    
    actions: {
      view: "Ver Detalles",
      edit: "Editar",
      duplicate: "Duplicar",
      delete: "Eliminar",
      share: "Compartir"
    },
    
    viewAll: "Ver Todos los Cálculos"
  },
  
  // Saved Calculations
  savedCalculations: {
    title: "Cálculos Guardados",
    subtitle: "Tus cálculos favoritos y guardados",
    empty: "No tienes cálculos guardados",
    
    filters: {
      all: "Todos",
      tiktok: "TikTok",
      instagram: "Instagram",
      youtube: "YouTube",
      twitter: "Twitter"
    },
    
    sort: {
      newest: "Más Recientes",
      oldest: "Más Antiguos",
      highest: "Ingresos Más Altos",
      lowest: "Ingresos Más Bajos"
    }
  },
  
  // Notifications
  notifications: {
    title: "Notificaciones",
    empty: "No tienes notificaciones",
    markAllRead: "Marcar todas como leídas",
    
    types: {
      update: "Actualización",
      tip: "Consejo",
      achievement: "Logro",
      reminder: "Recordatorio",
      news: "Noticias"
    },
    
    examples: [
      {
        type: "tip",
        title: "Mejora tu engagement",
        message: "Responder a comentarios en las primeras horas puede aumentar tu alcance hasta un 30%",
        time: "hace 2 horas"
      },
      {
        type: "update",
        title: "Nueva función disponible",
        message: "Ahora puedes comparar ingresos entre múltiples plataformas",
        time: "hace 1 día"
      },
      {
        type: "achievement",
        title: "¡Felicitaciones!",
        message: "Has completado 10 cálculos. Sigue así para obtener insights más precisos",
        time: "hace 3 días"
      }
    ]
  },
  
  // Goals
  goals: {
    title: "Mis Objetivos",
    subtitle: "Rastrea tu progreso hacia tus metas",
    empty: "No tienes objetivos establecidos",
    addGoal: "Agregar Objetivo",
    
    types: {
      followers: "Seguidores",
      engagement: "Engagement",
      earnings: "Ingresos",
      posts: "Posts"
    },
    
    examples: [
      {
        title: "Alcanzar 100K seguidores",
        current: 75000,
        target: 100000,
        progress: 75,
        deadline: "Dic 2024"
      },
      {
        title: "Ganar $5000/mes",
        current: 3200,
        target: 5000,
        progress: 64,
        deadline: "Nov 2024"
      }
    ]
  },
  
  // Insights
  insights: {
    title: "Insights Personalizados",
    subtitle: "Recomendaciones basadas en tu actividad",
    
    categories: {
      growth: "Crecimiento",
      monetization: "Monetización",
      content: "Contenido",
      engagement: "Engagement"
    },
    
    examples: [
      {
        category: "growth",
        title: "Oportunidad de crecimiento en TikTok",
        description: "Tu engagement rate está 20% por encima del promedio. Considera aumentar la frecuencia de posts.",
        action: "Ver estrategias",
        priority: "high"
      },
      {
        category: "monetization",
        title: "Diversifica tus ingresos",
        description: "Estás dependiendo mucho de una sola fuente. Explora affiliate marketing.",
        action: "Aprender más",
        priority: "medium"
      }
    ]
  },
  
  // Settings Quick Access
  settings: {
    title: "Configuración Rápida",
    
    options: [
      {
        title: "Preferencias de Notificaciones",
        description: "Gestiona qué notificaciones recibir",
        icon: "bell",
        href: "/settings/notifications"
      },
      {
        title: "Configuración de Privacidad",
        description: "Controla la visibilidad de tus datos",
        icon: "shield",
        href: "/settings/privacy"
      },
      {
        title: "Conectar Cuentas",
        description: "Vincula tus perfiles de redes sociales",
        icon: "link",
        href: "/settings/accounts"
      }
    ]
  },
  
  // Loading States
  loading: {
    dashboard: "Cargando panel...",
    calculations: "Cargando cálculos...",
    chart: "Cargando gráfico...",
    insights: "Generando insights..."
  },
  
  // Empty States
  empty: {
    calculations: {
      title: "No tienes cálculos aún",
      description: "Comienza creando tu primer cálculo de ingresos",
      action: "Crear Cálculo"
    },
    
    goals: {
      title: "Establece tus objetivos",
      description: "Define metas para hacer crecer tu presencia en redes sociales",
      action: "Agregar Objetivo"
    },
    
    insights: {
      title: "Necesitamos más datos",
      description: "Realiza algunos cálculos para obtener insights personalizados",
      action: "Comenzar"
    }
  },
  
  // Error States
  errors: {
    loadFailed: "Error al cargar el panel",
    calculationsFailed: "Error al cargar cálculos",
    chartFailed: "Error al cargar gráfico",
    retry: "Reintentar"
  }
} as const;