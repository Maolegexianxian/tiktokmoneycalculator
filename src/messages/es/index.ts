import auth from './auth';
import calculator from './calculator';
import common from './common';
import dashboard from './dashboard';
import faq from './faq';
import features from './features';
import header from './header';
import hero from './hero';
import metadata from './metadata';
import notFound from './not-found';

export default {
  auth,
  calculator,
  common,
  dashboard,
  faq,
  features,
  header,
  hero,
  metadata,
  'not-found': notFound
} as const;