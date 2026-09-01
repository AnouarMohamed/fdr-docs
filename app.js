import { pages } from "./data.js";

const navigationOrder = [
  "contents",
  "concepts",
  "getting-started",
  "walkthroughs",
  "configuration",
  "command-line",
  "systemd",
  "kubernetes",
  "deployment-reference",
  "kind-lab",
  "vm-validation",
  "observability",
  "incident-response",
  "troubleshooting",
  "security",
  "performance",
  "benchmark-catalog",
  "validation",
  "development",
  "packaging",
  "roadmap",
  "release-notes",
];
const sourcePages = new Map(pages.map((page) => [page.slug, page]));
const navigationPages = navigationOrder.map((slug) => sourcePages.get(slug));
const pageMap = new Map(navigationPages.map((page, index) => [page.slug, { ...page, index }]));
const article = document.querySelector("#article");
const prevLink = document.querySelector("#prev-link");
const nextLink = document.querySelector("#next-link");
const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#search-input");
const editionButton = document.querySelector("#edition-button");
const editionOptions = document.querySelector("#edition-options");

function escapeHtml(value) {
  return value.replace(/[&<>'"]/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#39;",
    '"': "&quot;",
  })[character]);
}

function textFromHtml(html) {
  const element = document.createElement("div");
  element.innerHTML = html.replace(/></g, "> <");
  return element.textContent.replace(/\s+/g, " ").trim();
}

function pageIndex(toc = []) {
  if (!toc.length) return "";
  return `
    <aside class="page-index" aria-label="On this page">
      <strong>On this page</strong>
      <ul>${toc.map(([id, label]) => `<li><a href="#${id}">${label}</a></li>`).join("")}</ul>
    </aside>`;
}

function updatePageLinks(index) {
  const previous = navigationPages[(index - 1 + navigationPages.length) % navigationPages.length];
  const next = navigationPages[(index + 1) % navigationPages.length];
  prevLink.href = `#/${previous.slug}`;
  prevLink.textContent = `Previous: ${previous.title.replace(/^Welcome to the /, "")}`;
  prevLink.dataset.short = "Previous";
  nextLink.href = `#/${next.slug}`;
  nextLink.textContent = `Next: ${next.title}`;
  nextLink.dataset.short = "Next";
}

function addCopyButtons() {
  article.querySelectorAll("pre").forEach((block) => {
    const button = document.createElement("button");
    button.className = "copy-button";
    button.type = "button";
    button.textContent = "Copy";
    button.setAttribute("aria-label", "Copy code block");
    button.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(block.textContent);
        button.textContent = "Copied";
        window.setTimeout(() => {
          button.textContent = "Copy";
        }, 1600);
      } catch {
        button.textContent = "Select text";
      }
    });
    block.before(button);
  });
}

function makeWideTablesScrollable() {
  article.querySelectorAll("table:not(.contents-table)").forEach((table) => {
    const columns = table.querySelector("tr")?.children.length || 0;
    if (columns < 3) return;
    const wrapper = document.createElement("div");
    wrapper.className = "table-scroll";
    wrapper.tabIndex = 0;
    wrapper.setAttribute("role", "region");
    wrapper.setAttribute("aria-label", "Scrollable reference table");
    table.before(wrapper);
    wrapper.append(table);
  });
}

function renderPage(slug) {
  const page = pageMap.get(slug) || pageMap.get("contents");
  document.title = `${page.title} | FDR Operator Guide`;
  article.innerHTML = `${pageIndex(page.toc)}${page.html}`;
  updatePageLinks(page.index);
  makeWideTablesScrollable();
  addCopyButtons();
  editionOptions.hidden = true;
  editionButton.setAttribute("aria-expanded", "false");
  window.scrollTo({ top: 0, behavior: "instant" });
}

function renderSearch(query) {
  const normalized = query.trim().toLocaleLowerCase();
  document.title = `Search: ${query} | FDR Operator Guide`;
  updatePageLinks(0);

  if (!normalized) {
    window.location.hash = "#/contents";
    return;
  }

  const matches = pages
    .map((page) => {
      const body = textFromHtml(page.html);
      const haystack = `${page.title} ${page.description} ${body}`.toLocaleLowerCase();
      if (!haystack.includes(normalized)) return null;
      const position = Math.max(0, body.toLocaleLowerCase().indexOf(normalized));
      const start = Math.max(0, position - 95);
      const excerpt = body.slice(start, start + 240);
      return {
        page,
        excerpt: `${start > 0 ? "…" : ""}${excerpt}${start + 240 < body.length ? "…" : ""}`,
      };
    })
    .filter(Boolean);

  article.innerHTML = `
    <h1>Search the FDR Operator Guide</h1>
    <p class="search-summary">${matches.length} ${matches.length === 1 ? "page" : "pages"} found for <strong>${escapeHtml(query)}</strong>.</p>
    ${matches.length
      ? matches.map(({ page, excerpt }) => `
        <section class="search-result">
          <h2><a href="#/${page.slug}">${page.title}</a></h2>
          <p>${escapeHtml(excerpt)}</p>
        </section>`).join("")
      : `
        <div class="empty-search">
          <p><strong>No matching page.</strong></p>
          <p>Try a metric name, directive, endpoint, deployment type, or failure symptom.</p>
        </div>`}
  `;
  window.scrollTo({ top: 0, behavior: "instant" });
}

function route() {
  const hash = window.location.hash || "#/contents";
  if (hash.startsWith("#/search?")) {
    const params = new URLSearchParams(hash.split("?")[1]);
    const query = params.get("q") || "";
    searchInput.value = query;
    renderSearch(query);
    return;
  }

  const slug = hash.replace(/^#\/?/, "").split("?")[0] || "contents";
  renderPage(slug);
}

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const query = searchInput.value.trim();
  window.location.hash = `#/search?q=${encodeURIComponent(query)}`;
});

editionButton.addEventListener("click", () => {
  const willOpen = editionOptions.hidden;
  editionOptions.hidden = !willOpen;
  editionButton.setAttribute("aria-expanded", String(willOpen));
});

document.addEventListener("click", (event) => {
  if (!event.target.closest(".edition-menu")) {
    editionOptions.hidden = true;
    editionButton.setAttribute("aria-expanded", "false");
  }
});

window.addEventListener("hashchange", route);
route();
