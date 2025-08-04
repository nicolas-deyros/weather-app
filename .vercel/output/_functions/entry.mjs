import { renderers } from './renderers.mjs';
import { c as createExports, s as serverEntrypointModule } from './chunks/_@astrojs-ssr-adapter_Ce4TdFXi.mjs';
import { manifest } from './manifest_D409Cqi4.mjs';

const serverIslandMap = new Map();;

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/api/simple.json.astro.mjs');
const _page2 = () => import('./pages/api/test.json.astro.mjs');
const _page3 = () => import('./pages/api/weather-simple.json.astro.mjs');
const _page4 = () => import('./pages/api/weather.json.astro.mjs');
const _page5 = () => import('./pages/icons.astro.mjs');
const _page6 = () => import('./pages/index.astro.mjs');
const pageMap = new Map([
    ["node_modules/astro/dist/assets/endpoint/generic.js", _page0],
    ["src/pages/api/simple.json.ts", _page1],
    ["src/pages/api/test.json.ts", _page2],
    ["src/pages/api/weather-simple.json.ts", _page3],
    ["src/pages/api/weather.json.ts", _page4],
    ["src/pages/icons.astro", _page5],
    ["src/pages/index.astro", _page6]
]);

const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    actions: () => import('./_noop-actions.mjs'),
    middleware: () => import('./_noop-middleware.mjs')
});
const _args = {
    "middlewareSecret": "da57420f-f33f-4f83-ac59-83e94741cea3",
    "skewProtection": false
};
const _exports = createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;
const _start = 'start';
if (Object.prototype.hasOwnProperty.call(serverEntrypointModule, _start)) ;

export { __astrojsSsrVirtualEntry as default, pageMap };
