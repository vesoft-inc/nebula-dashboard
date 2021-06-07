import { Context } from 'egg';
import { createProxyMiddleware } from 'http-proxy-middleware';
import k2c from 'koa2-connect';

export default () => {
  const metricsProxyPath = /\/api-metrics\//;
  const proxyPath = /\/api-nebula\//;

  return async function proxyHandler (ctx: Context, next: any) {
    if (metricsProxyPath.test(ctx.request.url)) {
      const importProxy = k2c(
        createProxyMiddleware({
          // target: 'http://localhost:8080',
          target: 'http://192.168.8.157:9090',
          pathRewrite: {
            '/api-metrics': '/api/v1',
          },
          changeOrigin: true,
        }),
      );
      await importProxy(ctx, next);
    }else if(proxyPath.test(ctx.request.url)){ // proxy to nebula-http-gateway
      const nebulaProxy = k2c(
        createProxyMiddleware({
          target: `http://${(ctx.request.header.host as string).split(':')[0]}:8080`,
          pathRewrite: {
            '/api-nebula': '/api',
          },
          changeOrigin: true,
        }),
      );
      await nebulaProxy(ctx, next);
    } else {
      await next();
    }
  };
};
