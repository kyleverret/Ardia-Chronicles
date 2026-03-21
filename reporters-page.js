// ============================================================
// ARDIA PRIME CHRONICLE — Reporters Page Script
// ============================================================

(function () {
  "use strict";

  function setCurrentDate() {
    const el = document.getElementById("current-date");
    if (!el) return;
    const months = [
      "Frost Month", "Thaw Month", "Planting Month", "Growing Month",
      "Harvest Month", "Sun Month", "Storm Month", "Shadow Month",
      "Gold Month", "Ember Month", "Frost Month", "Deep Winter"
    ];
    const now = new Date();
    el.textContent = `${now.getDate()} ${months[now.getMonth()]}, Year 847 AP`;
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
      return `
        <div class="reporter-card">
          <div class="reporter-card-top">
            <div
              class="reporter-card-avatar"
              style="background-color: ${escapeHtml(r.avatarColor)};"
            >${escapeHtml(r.avatar)}</div>
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

  function init() {
    setCurrentDate();
    renderReporters();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
