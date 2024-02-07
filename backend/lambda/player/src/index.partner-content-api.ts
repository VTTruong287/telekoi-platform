import { makeExpressApp } from 'lambda/common/config/routing';

import router from './lib/api-routes';

export const handler = makeExpressApp(function (app: any) {
  app.use('/partner-content', router);
});
