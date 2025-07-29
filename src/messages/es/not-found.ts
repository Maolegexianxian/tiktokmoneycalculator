export default {
  title: "Página No Encontrada",
  heading: "404 - Página No Encontrada",
  message: "Lo sentimos, la página que estás buscando no existe o ha sido movida.",
  description: "La URL que ingresaste puede estar incorrecta o la página puede haber sido eliminada.",
  
  suggestions: {
    title: "¿Qué puedes hacer?",
    items: [
      "Verifica la URL en la barra de direcciones",
      "Regresa a la página anterior",
      "Visita nuestra página de inicio",
      "Usa la función de búsqueda",
      "Contacta nuestro equipo de soporte"
    ]
  },
  
  actions: {
    goHome: "Ir al Inicio",
    goBack: "Regresar",
    search: "Buscar",
    contact: "Contactar Soporte"
  },
  
  popular: {
    title: "Páginas Populares",
    links: [
      {
        title: "Calculadora TikTok",
        description: "Calcula tus ingresos potenciales en TikTok",
        href: "/calculator/tiktok"
      },
      {
        title: "Calculadora Instagram",
        description: "Estima ganancias de Instagram",
        href: "/calculator/instagram"
      },
      {
        title: "Calculadora YouTube",
        description: "Analiza ingresos de YouTube",
        href: "/calculator/youtube"
      },
      {
        title: "Preguntas Frecuentes",
        description: "Encuentra respuestas a preguntas comunes",
        href: "/faq"
      }
    ]
  },
  
  help: {
    title: "¿Necesitas Ayuda?",
    description: "Si continúas teniendo problemas, nuestro equipo de soporte está aquí para ayudarte.",
    email: "soporte@tiktokmoneycalculator.com",
    response: "Responderemos en 24 horas"
  }
} as const;