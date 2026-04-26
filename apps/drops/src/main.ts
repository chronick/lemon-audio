import { getDropIds, loadDrop } from "./drops/registry.ts";
import "./style.css";

const app = document.getElementById("app")!;

/** Simple hash router: #001-acid-techno loads that drop, empty hash shows index */
async function route() {
  const dropId = window.location.hash.slice(1);

  if (dropId && getDropIds().includes(dropId)) {
    const drop = await loadDrop(dropId);
    app.innerHTML = "";
    drop.mount(app);
  } else {
    renderIndex();
  }
}

function renderIndex() {
  const ids = getDropIds();
  app.innerHTML = `
    <div class="drops-index">
      <pre class="drops-logo">🍋 LEMON DROPS</pre>
      <p class="drops-tagline">interactive music toys by <a href="https://lemon.audio">lemon.audio</a></p>
      <div class="drops-grid">
        ${ids
          .map(
            (id) => `
          <a href="#${id}" class="drop-card">
            <span class="drop-number">#${id.split("-")[0]}</span>
            <span class="drop-title">${id.replace(/^\d+-/, "").replace(/-/g, " ").toUpperCase()}</span>
          </a>
        `
          )
          .join("")}
      </div>
    </div>
  `;
}

window.addEventListener("hashchange", route);
route();
