// 西班牙语翻译模块入口文件
import { metadata } from './metadata';
import { auth } from './auth';
import { calculator } from './calculator';
import { common } from './common';
import { dashboard } from './dashboard';
import { faq } from './faq';
import { features } from './features';
import { header } from './header';
import { hero } from './hero';

// 创建缺失的模块
export const notFound = {
  title: 'Página no encontrada',
  description: 'La página que buscas no existe.',
  backToHome: 'Volver al inicio'
} as const;

export const testimonials = {
  title: 'Testimonios',
  subtitle: 'Lo que dicen nuestros usuarios'
} as const;

export const newsletter = {
  title: 'Boletín',
  subtitle: 'Mantente actualizado'
} as const;

export const platforms = {
  title: 'Plataformas',
  subtitle: 'Plataformas compatibles'
} as const;

export const socialProof = {
  title: 'Prueba social',
  subtitle: 'Confiado por miles'
} as const;

export const stats = {
  title: 'Estadísticas',
  subtitle: 'Números que importan'
} as const;

export const howItWorks = {
  title: 'Cómo funciona',
  subtitle: 'Proceso simple'
} as const;

export const trending = {
  title: 'Tendencias',
  subtitle: 'Contenido popular'
} as const;

export const successStories = {
  title: 'Historias de éxito',
  subtitle: 'Casos reales'
} as const;

export const cta = {
  title: 'Llamada a la acción',
  subtitle: 'Comienza ahora'
} as const;

export const breadcrumb = {
  home: 'Inicio',
  dashboard: 'Panel'
} as const;

export const es = {
  metadata,
  notFound,
  header,
  hero,
  calculator,
  dashboard,
  auth,
  common,
  faq,
  features,
  testimonials,
  newsletter,
  platforms,
  socialProof,
  stats,
  howItWorks,
  trending,
  successStories,
  cta,
  breadcrumb,
} as const;

export default es;