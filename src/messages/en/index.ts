// 英文翻译模块入口文件
import { metadata } from './metadata';
import { notFound } from './not-found';
import { header } from './header';
import { hero } from './hero';
import { calculator } from './calculator';
import { dashboard } from './dashboard';
import { auth } from './auth';
import { common } from './common';
import { faq } from './faq';
import { features } from './features';
import { testimonials } from './testimonials';
import { newsletter } from './newsletter';
import { platforms } from './platforms';
import { socialProof } from './socialProof';
import { stats } from "./stats";
import { howItWorks } from "./howItWorks";
import { trending } from "./trending";
import { successStories } from "./successStories";
import { cta } from "./cta";

export const en = {
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
} as const;

export type Messages = typeof en;
export default en;