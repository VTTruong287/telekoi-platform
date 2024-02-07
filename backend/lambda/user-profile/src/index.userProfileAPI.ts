import { makeExpressApp } from 'common/config/routing';
import { API_ROUTE } from './defs';
import router from './lib/apiRoutes';

export const handler = makeExpressApp(function (app: any) {
  app.use(API_ROUTE, router);
});
