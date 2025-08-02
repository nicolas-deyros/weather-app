import 'kleur/colors';
import { p as decodeKey } from './chunks/astro/server_Csm82XNw.mjs';
import 'clsx';
import 'cookie';
import { N as NOOP_MIDDLEWARE_FN } from './chunks/astro-designed-error-pages_CRZ_soOf.mjs';
import 'es-module-lexer';

function sanitizeParams(params) {
  return Object.fromEntries(
    Object.entries(params).map(([key, value]) => {
      if (typeof value === "string") {
        return [key, value.normalize().replace(/#/g, "%23").replace(/\?/g, "%3F")];
      }
      return [key, value];
    })
  );
}
function getParameter(part, params) {
  if (part.spread) {
    return params[part.content.slice(3)] || "";
  }
  if (part.dynamic) {
    if (!params[part.content]) {
      throw new TypeError(`Missing parameter: ${part.content}`);
    }
    return params[part.content];
  }
  return part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]");
}
function getSegment(segment, params) {
  const segmentPath = segment.map((part) => getParameter(part, params)).join("");
  return segmentPath ? "/" + segmentPath : "";
}
function getRouteGenerator(segments, addTrailingSlash) {
  return (params) => {
    const sanitizedParams = sanitizeParams(params);
    let trailing = "";
    if (addTrailingSlash === "always" && segments.length) {
      trailing = "/";
    }
    const path = segments.map((segment) => getSegment(segment, sanitizedParams)).join("") + trailing;
    return path || "/";
  };
}

function deserializeRouteData(rawRouteData) {
  return {
    route: rawRouteData.route,
    type: rawRouteData.type,
    pattern: new RegExp(rawRouteData.pattern),
    params: rawRouteData.params,
    component: rawRouteData.component,
    generate: getRouteGenerator(rawRouteData.segments, rawRouteData._meta.trailingSlash),
    pathname: rawRouteData.pathname || void 0,
    segments: rawRouteData.segments,
    prerender: rawRouteData.prerender,
    redirect: rawRouteData.redirect,
    redirectRoute: rawRouteData.redirectRoute ? deserializeRouteData(rawRouteData.redirectRoute) : void 0,
    fallbackRoutes: rawRouteData.fallbackRoutes.map((fallback) => {
      return deserializeRouteData(fallback);
    }),
    isIndex: rawRouteData.isIndex,
    origin: rawRouteData.origin
  };
}

function deserializeManifest(serializedManifest) {
  const routes = [];
  for (const serializedRoute of serializedManifest.routes) {
    routes.push({
      ...serializedRoute,
      routeData: deserializeRouteData(serializedRoute.routeData)
    });
    const route = serializedRoute;
    route.routeData = deserializeRouteData(serializedRoute.routeData);
  }
  const assets = new Set(serializedManifest.assets);
  const componentMetadata = new Map(serializedManifest.componentMetadata);
  const inlinedScripts = new Map(serializedManifest.inlinedScripts);
  const clientDirectives = new Map(serializedManifest.clientDirectives);
  const serverIslandNameMap = new Map(serializedManifest.serverIslandNameMap);
  const key = decodeKey(serializedManifest.key);
  return {
    // in case user middleware exists, this no-op middleware will be reassigned (see plugin-ssr.ts)
    middleware() {
      return { onRequest: NOOP_MIDDLEWARE_FN };
    },
    ...serializedManifest,
    assets,
    componentMetadata,
    inlinedScripts,
    clientDirectives,
    routes,
    serverIslandNameMap,
    key
  };
}

const manifest = deserializeManifest({"hrefRoot":"file:///C:/Users/ndeyros/dev/weather-app/","cacheDir":"file:///C:/Users/ndeyros/dev/weather-app/node_modules/.astro/","outDir":"file:///C:/Users/ndeyros/dev/weather-app/dist/","srcDir":"file:///C:/Users/ndeyros/dev/weather-app/src/","publicDir":"file:///C:/Users/ndeyros/dev/weather-app/public/","buildClientDir":"file:///C:/Users/ndeyros/dev/weather-app/dist/client/","buildServerDir":"file:///C:/Users/ndeyros/dev/weather-app/dist/server/","adapterName":"@astrojs/vercel","routes":[{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"page","component":"_server-islands.astro","params":["name"],"segments":[[{"content":"_server-islands","dynamic":false,"spread":false}],[{"content":"name","dynamic":true,"spread":false}]],"pattern":"^\\/_server-islands\\/([^/]+?)\\/?$","prerender":false,"isIndex":false,"fallbackRoutes":[],"route":"/_server-islands/[name]","origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/","isIndex":true,"type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_image","pattern":"^\\/_image\\/?$","segments":[[{"content":"_image","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/astro/dist/assets/endpoint/generic.js","pathname":"/_image","prerender":false,"fallbackRoutes":[],"origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/weather.json","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/weather\\.json\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"weather.json","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/weather.json.ts","pathname":"/api/weather.json","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}}],"base":"/","trailingSlash":"ignore","compressHTML":true,"componentMetadata":[["C:/Users/ndeyros/dev/weather-app/src/pages/index.astro",{"propagation":"none","containsHead":true}]],"renderers":[],"clientDirectives":[["idle","(()=>{var l=(n,t)=>{let i=async()=>{await(await n())()},e=typeof t.value==\"object\"?t.value:void 0,s={timeout:e==null?void 0:e.timeout};\"requestIdleCallback\"in window?window.requestIdleCallback(i,s):setTimeout(i,s.timeout||200)};(self.Astro||(self.Astro={})).idle=l;window.dispatchEvent(new Event(\"astro:idle\"));})();"],["load","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).load=e;window.dispatchEvent(new Event(\"astro:load\"));})();"],["media","(()=>{var n=(a,t)=>{let i=async()=>{await(await a())()};if(t.value){let e=matchMedia(t.value);e.matches?i():e.addEventListener(\"change\",i,{once:!0})}};(self.Astro||(self.Astro={})).media=n;window.dispatchEvent(new Event(\"astro:media\"));})();"],["only","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).only=e;window.dispatchEvent(new Event(\"astro:only\"));})();"],["visible","(()=>{var a=(s,i,o)=>{let r=async()=>{await(await s())()},t=typeof i.value==\"object\"?i.value:void 0,c={rootMargin:t==null?void 0:t.rootMargin},n=new IntersectionObserver(e=>{for(let l of e)if(l.isIntersecting){n.disconnect(),r();break}},c);for(let e of o.children)n.observe(e)};(self.Astro||(self.Astro={})).visible=a;window.dispatchEvent(new Event(\"astro:visible\"));})();"]],"entryModules":{"\u0000noop-middleware":"_noop-middleware.mjs","\u0000noop-actions":"_noop-actions.mjs","\u0000@astro-page:src/pages/api/weather.json@_@ts":"pages/api/weather.json.astro.mjs","\u0000@astro-page:src/pages/index@_@astro":"pages/index.astro.mjs","\u0000@astrojs-ssr-virtual-entry":"entry.mjs","\u0000@astro-renderers":"renderers.mjs","\u0000@astro-page:node_modules/astro/dist/assets/endpoint/generic@_@js":"pages/_image.astro.mjs","\u0000@astrojs-ssr-adapter":"_@astrojs-ssr-adapter.mjs","\u0000@astrojs-manifest":"manifest_F1UXmrpS.mjs","C:/Users/ndeyros/dev/weather-app/node_modules/astro/dist/assets/services/sharp.js":"chunks/sharp_7sPFortr.mjs","C:/Users/ndeyros/dev/weather-app/src/pages/index.astro?astro&type=script&index=0&lang.ts":"_astro/index.astro_astro_type_script_index_0_lang.BSIrJiA5.js","C:/Users/ndeyros/dev/weather-app/src/components/page/LocationSearch.astro?astro&type=script&index=0&lang.ts":"_astro/LocationSearch.astro_astro_type_script_index_0_lang.W3xgjaCQ.js","astro:scripts/before-hydration.js":""},"inlinedScripts":[["C:/Users/ndeyros/dev/weather-app/src/components/page/LocationSearch.astro?astro&type=script&index=0&lang.ts","async function m(t){try{const s=await(await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(t)}&limit=1&addressdetails=1`)).json();if(s&&s.length>0){const e=s[0];return{city:e.display_name.split(\",\")[0],country:e.address?.country||\"Unknown\",lat:parseFloat(e.lat),lon:parseFloat(e.lon),full_name:e.display_name}}else throw new Error(\"Location not found\")}catch{throw new Error(\"Failed to search location\")}}async function y(t,a){try{const e=await(await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${t}&lon=${a}&addressdetails=1`)).json();if(e)return{city:e.address?.city||e.address?.town||e.address?.village||\"Unknown\",country:e.address?.country||\"Unknown\",lat:t,lon:a,full_name:e.display_name};throw new Error(\"Location not found\")}catch{throw new Error(\"Failed to get location details\")}}function d(){document.getElementById(\"loadingState\")?.classList.remove(\"hidden\"),document.getElementById(\"errorMessage\")?.classList.add(\"hidden\"),document.getElementById(\"locationResult\")?.classList.add(\"hidden\")}function l(){document.getElementById(\"loadingState\")?.classList.add(\"hidden\")}function r(t){l();const a=document.getElementById(\"errorMessage\");if(a){a.classList.remove(\"hidden\");const s=a.querySelector(\"p\");s&&(s.textContent=t)}}function i(t){l(),document.getElementById(\"errorMessage\")?.classList.add(\"hidden\");const a=document.getElementById(\"locationResult\");if(a){a.classList.remove(\"hidden\");const s=document.getElementById(\"resultCity\"),e=document.getElementById(\"resultCountry\"),n=document.getElementById(\"resultLat\"),o=document.getElementById(\"resultLon\");s&&(s.textContent=t.city),e&&(e.textContent=t.country),n&&(n.textContent=t.lat.toFixed(4)),o&&(o.textContent=t.lon.toFixed(4));const c=document.getElementById(\"useLocationButton\");c&&(c.onclick=()=>{window.loadWeather?window.loadWeather(t.lat,t.lon,t.city):window.location.replace(`/?lat=${t.lat}&lon=${t.lon}`)})}}document.addEventListener(\"DOMContentLoaded\",function(){const t=document.getElementById(\"locationSearch\"),a=document.getElementById(\"searchButton\"),s=document.getElementById(\"geolocationButton\");async function e(){const n=t?.value?.trim();if(!n){r(\"Please enter a city name\");return}d();try{const o=await m(n);i(o)}catch(o){r(o instanceof Error?o.message:\"Search failed\")}}a?.addEventListener(\"click\",e),t?.addEventListener(\"keypress\",function(n){n.key===\"Enter\"&&e()}),s?.addEventListener(\"click\",function(){if(!navigator.geolocation){r(\"Geolocation is not supported by this browser\");return}d(),navigator.geolocation.getCurrentPosition(async function(n){const o=n.coords.latitude,c=n.coords.longitude;try{const u=await y(o,c);i(u)}catch{i({city:\"Current Location\",country:\"Unknown\",lat:o,lon:c})}},function(n){let o=\"Failed to get location\";switch(n.code){case n.PERMISSION_DENIED:o=\"Location access denied by user\";break;case n.POSITION_UNAVAILABLE:o=\"Location information unavailable\";break;case n.TIMEOUT:o=\"Location request timed out\";break}r(o)},{enableHighAccuracy:!0,timeout:1e4,maximumAge:3e5})})});"]],"assets":["/_astro/index.CZm8BHQv.css","/favicon-animated.html","/favicon-animated.svg","/favicon-gif-generator.html","/favicon.svg","/site.webmanifest","/_astro/index.astro_astro_type_script_index_0_lang.BSIrJiA5.js","/index.html"],"buildFormat":"directory","checkOrigin":true,"serverIslandNameMap":[],"key":"G1imFFwjMDK8O3qQ7snp5Vl5R6q1NzO/Dk3zGtl+1Lc="});
if (manifest.sessionConfig) manifest.sessionConfig.driverModule = null;

export { manifest };
