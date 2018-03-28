/**
 *
 */
const Bundler = require('parcel-bundler');
const express = require('express');
const httpProxyMiddleware = require('http-proxy-middleware');

let config = {
    main: 'index.html',
    port: '1234',
    //配置代理,解决跨域问题
    proxy: [
        {
            context: ['/33/noohle-message/**'],
            target: 'ws://192.168.1.33',
            ws: true,
            toProxy: true,
            changeOrigin: true,
            pathRewrite: {"/33": ''},
            secure: false
        },
        {
            context: ['/75/noohle-message/**'],
            target: 'ws://192.168.1.75',
            ws: true,
            toProxy: true,
            changeOrigin: true,
            pathRewrite: {"/75": ''},
            secure: false
        },
        {
            context: ['/33/**'],
            target: 'http://192.168.1.33',
            changeOrigin: true,
            pathRewrite: {"/33": ''},
            secure: false
        },
        {
            context: ['/75/**'],
            target: 'http://192.168.1.75',
            changeOrigin: true,
            pathRewrite: {"/75": ''},
            secure: false
        }
    ],
    parcel: {
        sourceMaps: false,
        outDir: 'dist',
        cacheDir: '.cache'
    },
    env: 'development',
};

process.env.NODE_ENV = config.env;

let app = express();
let bundler = new Bundler(config.main, config.parcel);

config.proxy.forEach(function (proxyConfig) {
    let bypass = typeof proxyConfig.bypass === 'function';
    let context = proxyConfig.context || proxyConfig.path;
    let proxyMiddleware;
    // It is possible to use the `bypass` method without a `target`.
    // However, the proxy middleware has no use in this case, and will fail to instantiate.
    if (proxyConfig.target) {
        proxyMiddleware = httpProxyMiddleware(context, proxyConfig);
    }
    app.use(function (req, res, next) {
        let bypassUrl = bypass && proxyConfig.bypass(req, res, proxyConfig) || false;

        if (bypassUrl) {
            req.url = bypassUrl;
            next();
        } else if (proxyMiddleware) {
            return proxyMiddleware(req, res, next);
        }
    });
});

app.use(bundler.middleware());
app.listen(config.port);//服务端口
