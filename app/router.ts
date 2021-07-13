import { Application } from 'egg';

export default (app: Application) => {
  const { controller, router } = app;
  router.get('/api/app', controller.home.getAppInfo);
  router.get('/api/config/custom', controller.home.getCustomizeConfig);
  router.get('/api/config/annotation_line', controller.home.getAnnotationLineConfig);
  router.get(/^(?!^\/api\/)/, controller.home.index);
};
