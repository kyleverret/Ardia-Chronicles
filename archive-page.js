// ============================================================
// ARDIA PRIME CHRONICLE — Archive Page Script
// Fetches archive.json, renders all stories, and handles
// filtering by section, Ardia month, and reporter.
// ============================================================

(function () {
  "use strict";

  // ---- STATE ----

  let allStories  = [];
  let activeCategory = "all";
  let activeMonth    = "all";
  let activeReporter = "all";

  // ---- HELPERS ----

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function setCurrentDate() {
    const el = document.getElementById("current-date");
    if (!el) return;
    const ARDIA_MONTHS = [
      "Frosthold", "Iceveil", "Thawbreak", "Bloomrise", "Brightmantle", "Highsun",
      "Embertide", "Harvestmoon", "Goldenveil", "Shadowfall", "Ashgale", "Starnight",
    ];
    const now = new Date();
    el.textContent = `${now.getDate()} ${ARDIA_MONTHS[now.getMonth()]}, Year 847 AP`;
  }

  function getCategoryLabel(categoryId) {
    if (typeof CATEGORIES !== "undefined") {
      const cat = CATEGORIES.find((c) => c.id === categoryId);
      if (cat) return cat.label;
    }
    return categoryId;
  }

  function getCategoryColor(categoryId) {
    if (typeof CATEGORIES !== "undefined") {
      const cat = CATEGORIES.find((c) => c.id === categoryId);
      if (cat) return cat.color;
    }
    return "#888";
  }

  function getReporter(reporterId) {
    if (typeof REPORTERS !== "undefined") {
      return REPORTERS.find((r) => r.id === reporterId);
    }
    return null;
  }

  // Extract the Ardia month from a story, supporting both old and new story formats
  function getStoryMonth(story) {
    if (story.ardiaMonth) return story.ardiaMonth;
    // Legacy stories have date like "21 March, Year 847 AP" — not an Ardia month
    // Return null so they fall under "other" in filters
    return null;
  }

  // ---- FILTER LOGIC ----

  function applyFilters() {
    return allStories.filter((s) => {
      if (activeCategory !== "all" && s.category !== activeCategory) return false;
      if (activeMonth !== "all" && getStoryMonth(s) !== activeMonth) return false;
      if (activeReporter !== "all" && s.reporter !== activeReporter) return false;
      return true;
    });
  }

  // ---- RENDER ----

  function renderStoryRow(story) {
    const reporter = getReporter(story.reporter);
    const reporterName = reporter ? reporter.name : story.reporter;
    const catLabel = getCategoryLabel(story.category);
    const catColor = getCategoryColor(story.category);

    return `
      <div class="archive-item" tabindex="0" role="button" data-story-id="${escapeHtml(story.id)}">
        <div class="archive-item-image-wrap">
          <img
            class="archive-item-image"
            src="${escapeHtml(story.image || "")}"
            alt="${escapeHtml(story.imageAlt || "")}"
            loading="lazy"
            onerror="this.style.display='none'"
          />
        </div>
        <div class="archive-item-body">
          <div class="archive-item-meta">
            <span class="archive-item-category" style="background-color:${escapeHtml(catColor)};">${escapeHtml(catLabel)}</span>
            <span class="archive-item-date">${escapeHtml(story.date)}</span>
            <span class="archive-item-reporter">${escapeHtml(reporterName)}</span>
          </div>
          <div class="archive-item-headline">${escapeHtml(story.headline)}</div>
          <div class="archive-item-deck">${escapeHtml(story.subheadline || "")}</div>
        </div>
      </div>
    `;
  }

  function renderList() {
    const list = document.getElementById("archive-list");
    const countEl = document.getElementById("archive-count");
    if (!list) return;

    const filtered = applyFilters();

    if (countEl) {
      countEl.textContent = filtered.length === allStories.length
        ? `${allStories.length} stories`
        : `${filtered.length} of ${allStories.length} stories`;
    }

    if (filtered.length === 0) {
      list.innerHTML = `<p class="no-results">No stories match the selected filters.</p>`;
      return;
    }

    list.innerHTML = filtered.map(renderStoryRow).join("");
  }

  // ---- MODAL (reuses the modal from app.js if present, otherwise inline) ----

  function openModal(storyId) {
    const story = allStories.find((s) => s.id === storyId);
    if (!story) return;

    const reporter  = getReporter(story.reporter);
    const catLabel  = getCategoryLabel(story.category);
    const catColor  = getCategoryColor(story.category);
    const repName   = reporter ? reporter.name  : story.reporter;
    const repTitle  = reporter ? reporter.title : "";
    const repBio    = reporter ? reporter.bio   : "";
    const repAvatar = reporter ? reporter.avatar      : "?";
    const repColor  = reporter ? reporter.avatarColor : "#888";
    const repCount  = reporter ? reporter.articles    : "";

    const overlay = document.getElementById("modal-overlay");
    const article = document.getElementById("modal-article");
    if (!overlay || !article) return;

    article.innerHTML = `
      <img
        class="story-hero-image"
        src="${escapeHtml(story.image || "")}"
        alt="${escapeHtml(story.imageAlt || "")}"
      />
      <div class="modal-article-body">
        <span class="story-category" style="background-color:${escapeHtml(catColor)};">${escapeHtml(catLabel)}</span>
        <h1 class="story-headline" id="modal-headline">${escapeHtml(story.headline)}</h1>
        <p class="story-deck">${escapeHtml(story.subheadline || "")}</p>
        <div class="story-byline">
          <div class="byline-avatar-lg" style="background-color:${escapeHtml(repColor)};">${escapeHtml(repAvatar)}</div>
          <div class="byline-text">
            <span class="byline-reporter-name">By ${escapeHtml(repName)}</span>
            <span class="byline-reporter-title">${escapeHtml(repTitle)}</span>
          </div>
          <div class="byline-date">${escapeHtml(story.date)}</div>
        </div>
        <div class="story-body">${story.body}</div>
        <div class="reporter-bio-footer">
          <div class="bio-avatar" style="background-color:${escapeHtml(repColor)};">${escapeHtml(repAvatar)}</div>
          <div class="bio-content">
            <div class="bio-name">${escapeHtml(repName)}</div>
            <div class="bio-title">${escapeHtml(repTitle)}${repCount ? " · " + repCount + " articles published" : ""}</div>
            <div class="bio-text">${escapeHtml(repBio)}</div>
          </div>
        </div>
      </div>
    `;

    overlay.classList.add("visible");
    document.body.style.overflow = "hidden";
    document.getElementById("modal-close").focus();
  }

  function closeModal() {
    const overlay = document.getElementById("modal-overlay");
    if (overlay) overlay.classList.remove("visible");
    document.body.style.overflow = "";
  }

  // ---- REPORTER FILTER POPULATION ----

  function populateReporterFilter() {
    const sel = document.getElementById("filter-reporter");
    if (!sel || typeof REPORTERS === "undefined") return;
    REPORTERS.forEach((r) => {
      const opt = document.createElement("option");
      opt.value = r.id;
      opt.textContent = r.name;
      sel.appendChild(opt);
    });
  }

  // ---- EVENTS ----

  function attachEvents() {
    document.getElementById("filter-category").addEventListener("change", function () {
      activeCategory = this.value;
      renderList();
    });
    document.getElementById("filter-month").addEventListener("change", function () {
      activeMonth = this.value;
      renderList();
    });
    document.getElementById("filter-reporter").addEventListener("change", function () {
      activeReporter = this.value;
      renderList();
    });

    // Story row clicks (delegated)
    document.getElementById("archive-list").addEventListener("click", function (e) {
      const item = e.target.closest("[data-story-id]");
      if (item) openModal(item.dataset.storyId);
    });

    document.getElementById("archive-list").addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        const item = e.target.closest("[data-story-id]");
        if (item) openModal(item.dataset.storyId);
      }
    });

    // Close modal
    const closeBtn = document.getElementById("modal-close");
    if (closeBtn) closeBtn.addEventListener("click", closeModal);
    const overlay = document.getElementById("modal-overlay");
    if (overlay) overlay.addEventListener("click", function (e) {
      if (e.target === this) closeModal();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeModal();
    });
  }

  // ---- INIT ----

  function init() {
    setCurrentDate();
    populateReporterFilter();
    attachEvents();

    fetch("archive.json")
      .then((r) => r.json())
      .then((data) => {
        allStories = data;
        renderList();
      })
      .catch((err) => {
        const list = document.getElementById("archive-list");
        if (list) list.innerHTML = `<p class="no-results">Could not load archives: ${escapeHtml(err.message)}</p>`;
      });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

})();
