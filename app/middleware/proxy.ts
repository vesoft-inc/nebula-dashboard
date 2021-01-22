import { Context } from 'egg';
import { createProxyMiddleware } from 'http-proxy-middleware';
import k2c from 'koa2-connect';

export default () => {
  const metricsProxyPath = /\/api-metrics\//;

  return async function proxyHandler(ctx: Context, next: any) {
    if (metricsProxyPath.test(ctx.request.url)) {
      const importProxy = k2c(
        createProxyMiddleware({
          target: 'http://localhost:9090',
          pathRewrite: {
            '/api-metrics': '/api/v1',
          },
          changeOrigin: true,
        }),
      );
      await importProxy(ctx, next);
    } else {
      await next();
    }
  };
};
