// ============================================================
// ARDIA PRIME CHRONICLE — Reporters Page Script
// ============================================================

(function () {
  "use strict";

  function setCurrentDate() {
    const el = document.getElementById("current-date");
    if (!el) return;
    const ardiaMonths = (typeof ARDIA_MONTHS !== "undefined")
      ? ARDIA_MONTHS.map((m) => m.name)
      : ["Frosthold","Iceveil","Thawbreak","Bloomrise","Brightmantle","Highsun",
         "Embertide","Harvestmoon","Goldenveil","Shadowfall","Ashgale","Starnight"];
    const now = new Date();
    el.textContent = `${now.getDate()} ${ardiaMonths[now.getMonth()]}, Year 847 AP`;
  }

  function countStoriesByReporter(reporterId) {
    return STORIES.filter((s) => s.reporter === reporterId).length;
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function renderReporters() {
    const grid = document.getElementById("reporters-page-grid");
    if (!grid) return;

    grid.innerHTML = REPORTERS.map((r) => {
      const storyCount = countStoriesByReporter(r.id);
      const avatarHtml = r.image
        ? `<img
              class="reporter-card-portrait"
              src="${escapeHtml(r.image)}"
              alt="Portrait of ${escapeHtml(r.name)}"
            />`
        : `<div
              class="reporter-card-avatar"
              style="background-color: ${escapeHtml(r.avatarColor)};"
            >${escapeHtml(r.avatar)}</div>`;
      return `
        <div class="reporter-card">
          <div class="reporter-card-top">
            ${avatarHtml}
            <div>
              <div class="reporter-card-name">${escapeHtml(r.name)}</div>
              <div class="reporter-card-title">${escapeHtml(r.title)}</div>
            </div>
          </div>
          <div class="reporter-card-stats">
            <div>
              <span class="reporter-stat-label">Beat</span>
              ${escapeHtml(r.beat)}
            </div>
            <div>
              <span class="reporter-stat-label">Articles Published</span>
              ${escapeHtml(String(r.articles))}
            </div>
            <div>
              <span class="reporter-stat-label">Stories This Issue</span>
              ${storyCount}
            </div>
          </div>
          <p class="reporter-card-bio">${escapeHtml(r.bio)}</p>
          <a href="index.html" class="sidebar-see-all" style="margin-top:8px; display:block; text-align:center; font-size:0.75rem; font-style:italic; color:#8b1a1a;">
            Read stories by ${escapeHtml(r.name)} &rarr;
          </a>
        </div>
      `;
    }).join("");
  }

  function renderEditorialBoard() {
    const grid = document.getElementById("editorial-board-grid");
    if (!grid || typeof EDITORIAL_BOARD === "undefined") return;

    grid.innerHTML = EDITORIAL_BOARD.map((member) => {
      const portraitHtml = member.image
        ? `<img
              class="reporter-card-portrait editorial-portrait"
              src="${escapeHtml(member.image)}"
              alt="Portrait of ${escapeHtml(member.name)}"
              onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
            />
            <div
              class="reporter-card-avatar"
              style="background-color: ${escapeHtml(member.avatarColor)}; flex-shrink:0; display:none;"
            >${escapeHtml(member.avatar)}</div>`
        : `<div
              class="reporter-card-avatar"
              style="background-color: ${escapeHtml(member.avatarColor)}; flex-shrink:0;"
            >${escapeHtml(member.avatar)}</div>`;

      return `
        <div class="editorial-member">
          <div class="editorial-member-top">
            ${portraitHtml}
            <div>
              <div class="editorial-member-name">${escapeHtml(member.name)}</div>
              <div class="editorial-member-title">${escapeHtml(member.title)}</div>
              <div class="editorial-member-years">${escapeHtml(String(member.yearsAtChronicle))} years at the Chronicle</div>
            </div>
          </div>
          <p class="editorial-member-bio">${escapeHtml(member.bio)}</p>
        </div>
      `;
    }).join("");
  }

  function init() {
    setCurrentDate();
    renderReporters();
    renderEditorialBoard();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
