// 法语翻译模块入口文件
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
  title: 'Page non trouvée',
  description: 'La page que vous cherchez n\'existe pas.',
  backToHome: 'Retour à l\'accueil'
} as const;

export const testimonials = {
  title: 'Témoignages',
  subtitle: 'Ce que disent nos utilisateurs'
} as const;

export const newsletter = {
  title: 'Newsletter',
  subtitle: 'Restez informé'
} as const;

export const platforms = {
  title: 'Plateformes',
  subtitle: 'Plateformes supportées'
} as const;

export const socialProof = {
  title: 'Preuve sociale',
  subtitle: 'Fait confiance par des milliers'
} as const;

export const stats = {
  title: 'Statistiques',
  subtitle: 'Chiffres qui comptent'
} as const;

export const howItWorks = {
  title: 'Comment ça marche',
  subtitle: 'Processus simple'
} as const;

export const trending = {
  title: 'Tendances',
  subtitle: 'Contenu populaire'
} as const;

export const successStories = {
  title: 'Histoires de succès',
  subtitle: 'Cas réels'
} as const;

export const cta = {
  title: 'Appel à l\'action',
  subtitle: 'Commencez maintenant'
} as const;

export const breadcrumb = {
  home: 'Accueil',
  dashboard: 'Tableau de bord'
} as const;

export const fr = {
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

export default fr;