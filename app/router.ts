import { Application } from 'egg';

export default (app: Application) => {
  const { controller, router } = app;
  router.get('/api/app', controller.home.getAppInfo);
  router.get(/^(?!^\/api\/)/, controller.home.index);
};
