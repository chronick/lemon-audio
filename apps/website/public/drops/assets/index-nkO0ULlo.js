(function(){const r=document.createElement("link").relList;if(r&&r.supports&&r.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))p(e);new MutationObserver(e=>{for(const n of e)if(n.type==="childList")for(const u of n.addedNodes)u.tagName==="LINK"&&u.rel==="modulepreload"&&p(u)}).observe(document,{childList:!0,subtree:!0});function l(e){const n={};return e.integrity&&(n.integrity=e.integrity),e.referrerPolicy&&(n.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?n.credentials="include":e.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function p(e){if(e.ep)return;e.ep=!0;const n=l(e);fetch(e.href,n)}})();const L="modulepreload",P=function(t){return"/drops/"+t},h={},O=function(r,l,p){let e=Promise.resolve();if(l&&l.length>0){let m=function(o){return Promise.all(o.map(a=>Promise.resolve(a).then(d=>({status:"fulfilled",value:d}),d=>({status:"rejected",reason:d}))))};var u=m;document.getElementsByTagName("link");const i=document.querySelector("meta[property=csp-nonce]"),s=i?.nonce||i?.getAttribute("nonce");e=m(l.map(o=>{if(o=P(o),o in h)return;h[o]=!0;const a=o.endsWith(".css"),d=a?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${o}"]${d}`))return;const c=document.createElement("link");if(c.rel=a?"stylesheet":L,a||(c.as="script"),c.crossOrigin="",c.href=o,s&&c.setAttribute("nonce",s),document.head.appendChild(c),a)return new Promise((E,w)=>{c.addEventListener("load",E),c.addEventListener("error",()=>w(new Error(`Unable to preload CSS for ${o}`)))})}))}function n(i){const s=new Event("vite:preloadError",{cancelable:!0});if(s.payload=i,window.dispatchEvent(s),!s.defaultPrevented)throw i}return e.then(i=>{for(const s of i||[])s.status==="rejected"&&n(s.reason);return r().catch(n)})},y={"001-acid-techno":()=>O(()=>import("./index-DTQUF1IN.js"),[]).then(t=>t.default)};function g(){return Object.keys(y)}async function b(t){const r=y[t];if(!r)throw new Error(`Unknown drop: ${t}`);return r()}const f=document.getElementById("app");async function v(){const t=window.location.hash.slice(1);if(t&&g().includes(t)){const r=await b(t);f.innerHTML="",r.mount(f)}else $()}function $(){const t=g();f.innerHTML=`
    <div class="drops-index">
      <pre class="drops-logo">🍋 LEMON DROPS</pre>
      <p class="drops-tagline">interactive music toys by <a href="https://lemon.audio">lemon.audio</a></p>
      <div class="drops-grid">
        ${t.map(r=>`
          <a href="#${r}" class="drop-card">
            <span class="drop-number">#${r.split("-")[0]}</span>
            <span class="drop-title">${r.replace(/^\d+-/,"").replace(/-/g," ").toUpperCase()}</span>
          </a>
        `).join("")}
      </div>
    </div>
  `}window.addEventListener("hashchange",v);v();
