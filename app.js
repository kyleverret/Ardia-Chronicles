// ============================================================
// ARDIA PRIME CHRONICLE — Application Logic
// ============================================================

(function () {
  "use strict";

  // --- HELPERS ---

  function getReporter(id) {
    return REPORTERS.find((r) => r.id === id);
  }

  function getCategory(id) {
    return CATEGORIES.find((c) => c.id === id);
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  // --- DATE ---

  function setCurrentDate() {
    const el = document.getElementById("current-date");
    if (!el) return;
    // Use Ardia date format
    const days = ["First", "Second", "Third", "Fourth", "Fifth", "Sixth", "Seventh"];
    const months = [
      "Frost Month", "Thaw Month", "Planting Month", "Growing Month",
      "Harvest Month", "Sun Month", "Storm Month", "Shadow Month",
      "Gold Month", "Ember Month", "Frost Month", "Deep Winter"
    ];
    const now = new Date();
    const dayNum = now.getDate();
    const monthName = months[now.getMonth()];
    el.textContent = `${dayNum} ${monthName}, Year 847 AP`;
  }

  // --- RENDER STORY CARD ---

  function renderStoryCard(story, size) {
    const reporter = getReporter(story.reporter);
    const category = getCategory(story.category);
    if (!reporter || !category) return "";

    const isFeatured = size === "featured";
    const cardClass = isFeatured ? "story-card featured" : "story-card";

    return `
      <article
        class="${cardClass}"
        tabindex="0"
        role="button"
        data-story-id="${escapeHtml(story.id)}"
        aria-label="Read story: ${escapeHtml(story.headline)}"
      >
        <img
          class="card-image"
          src="${escapeHtml(story.image)}"
          alt="${escapeHtml(story.imageAlt)}"
          loading="lazy"
        />
        <div class="card-body">
          <span
            class="card-category"
            style="background-color: ${escapeHtml(category.color)};"
          >${escapeHtml(category.label)}</span>
          <h3 class="card-headline">${escapeHtml(story.headline)}</h3>
          <p class="card-deck">${escapeHtml(story.subheadline)}</p>
          <div class="card-byline">
            <div
              class="byline-avatar"
              style="background-color: ${escapeHtml(reporter.avatarColor)};"
            >${escapeHtml(reporter.avatar)}</div>
            <div class="byline-info">
              <span class="byline-name">${escapeHtml(reporter.name)}</span>
              <span class="byline-meta">${escapeHtml(story.date)}</span>
            </div>
          </div>
        </div>
      </article>
    `;
  }

  // --- RENDER FEATURED SECTION ---

  function renderFeaturedStories() {
    const grid = document.getElementById("featured-grid");
    if (!grid) return;

    const featured = STORIES.filter((s) => s.featured);
    grid.innerHTML = featured.map((s) => renderStoryCard(s, "featured")).join("");
  }

  // --- RENDER ALL STORIES ---

  let currentFilter = "all";

  function renderAllStories(filter) {
    currentFilter = filter || "all";
    const grid = document.getElementById("stories-grid");
    if (!grid) return;

    const stories = currentFilter === "all"
      ? STORIES.filter((s) => !s.featured)
      : STORIES.filter((s) => s.category === currentFilter);

    if (stories.length === 0) {
      grid.innerHTML = `<p class="no-results">No stories found in this category yet.</p>`;
      return;
    }

    grid.innerHTML = stories.map((s) => renderStoryCard(s, "grid")).join("");
  }

  // --- RENDER SIDEBAR REPORTERS ---

  function renderSidebarReporters() {
    const list = document.getElementById("reporters-sidebar-list");
    if (!list) return;

    list.innerHTML = REPORTERS.map((r) => `
      <div class="sidebar-reporter" tabindex="0" role="button" data-reporter-id="${escapeHtml(r.id)}">
        <div
          class="sidebar-reporter-avatar"
          style="background-color: ${escapeHtml(r.avatarColor)};"
        >${escapeHtml(r.avatar)}</div>
        <div class="sidebar-reporter-info">
          <div class="sidebar-reporter-name">${escapeHtml(r.name)}</div>
          <div class="sidebar-reporter-beat">${escapeHtml(r.beat)}</div>
        </div>
      </div>
    `).join("");
  }

  // --- MODAL ---

  function openModal(storyId) {
    const story = STORIES.find((s) => s.id === storyId);
    if (!story) return;

    const reporter = getReporter(story.reporter);
    const category = getCategory(story.category);
    if (!reporter || !category) return;

    const article = document.getElementById("modal-article");
    if (!article) return;

    article.innerHTML = `
      <img
        class="story-hero-image"
        src="${escapeHtml(story.image)}"
        alt="${escapeHtml(story.imageAlt)}"
      />
      <div class="modal-article-body">
        <span
          class="story-category"
          style="background-color: ${escapeHtml(category.color)};"
        >${escapeHtml(category.label)}</span>
        <h1 class="story-headline" id="modal-headline">${escapeHtml(story.headline)}</h1>
        <p class="story-deck">${escapeHtml(story.subheadline)}</p>

        <div class="story-byline">
          <div
            class="byline-avatar-lg"
            style="background-color: ${escapeHtml(reporter.avatarColor)};"
          >${escapeHtml(reporter.avatar)}</div>
          <div class="byline-text">
            <span class="byline-reporter-name">By ${escapeHtml(reporter.name)}</span>
            <span class="byline-reporter-title">${escapeHtml(reporter.title)}</span>
          </div>
          <div class="byline-date">${escapeHtml(story.date)}</div>
        </div>

        <div class="story-body">${story.body}</div>

        <div class="reporter-bio-footer">
          <div
            class="bio-avatar"
            style="background-color: ${escapeHtml(reporter.avatarColor)};"
          >${escapeHtml(reporter.avatar)}</div>
          <div class="bio-content">
            <div class="bio-name">${escapeHtml(reporter.name)}</div>
            <div class="bio-title">${escapeHtml(reporter.title)} · ${escapeHtml(reporter.articles)} articles published</div>
            <div class="bio-text">${escapeHtml(reporter.bio)}</div>
          </div>
        </div>
      </div>
    `;

    const overlay = document.getElementById("modal-overlay");
    overlay.classList.add("visible");
    document.body.style.overflow = "hidden";

    // Focus the close button for accessibility
    document.getElementById("modal-close").focus();
  }

  function closeModal() {
    const overlay = document.getElementById("modal-overlay");
    overlay.classList.remove("visible");
    document.body.style.overflow = "";
  }

  // --- EVENT LISTENERS ---

  function attachEvents() {
    // Story card clicks (delegated)
    document.addEventListener("click", function (e) {
      // Story card
      const card = e.target.closest("[data-story-id]");
      if (card) {
        openModal(card.dataset.storyId);
        return;
      }

      // Sidebar reporter click — filter stories
      const sidebarReporter = e.target.closest("[data-reporter-id]");
      if (sidebarReporter) {
        const reporterId = sidebarReporter.dataset.reporterId;
        filterByReporter(reporterId);
        return;
      }
    });

    // Keyboard: Enter on story cards
    document.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        const card = e.target.closest("[data-story-id]");
        if (card) {
          openModal(card.dataset.storyId);
        }
      }
      if (e.key === "Escape") {
        closeModal();
      }
    });

    // Close modal
    document.getElementById("modal-close").addEventListener("click", closeModal);
    document.getElementById("modal-overlay").addEventListener("click", function (e) {
      if (e.target === this) closeModal();
    });

    // Nav filter links
    document.querySelectorAll(".nav-link[data-filter]").forEach(function (link) {
      link.addEventListener("click", function (e) {
        e.preventDefault();
        document.querySelectorAll(".nav-link").forEach((l) => l.classList.remove("active"));
        this.classList.add("active");
        const filter = this.dataset.filter;
        renderAllStories(filter);

        // Show/hide featured section on filter
        const featuredSection = document.getElementById("featured-section");
        if (featuredSection) {
          featuredSection.style.display = filter === "all" ? "" : "none";
        }

        // Scroll to stories
        document.getElementById("stories-section").scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
  }

  // Filter stories by reporter
  function filterByReporter(reporterId) {
    const reporter = getReporter(reporterId);
    if (!reporter) return;

    // Clear nav active states
    document.querySelectorAll(".nav-link").forEach((l) => l.classList.remove("active"));

    const grid = document.getElementById("stories-grid");
    if (!grid) return;

    const stories = STORIES.filter((s) => s.reporter === reporterId);

    const featuredSection = document.getElementById("featured-section");
    if (featuredSection) featuredSection.style.display = "none";

    const divider = document.querySelector(".content-divider");
    if (divider) {
      divider.innerHTML = `
        <span>⚜</span>
        <span>Stories by ${reporter.name}</span>
        <span>⚜</span>
      `;
    }

    grid.innerHTML = stories.length
      ? stories.map((s) => renderStoryCard(s, "grid")).join("")
      : `<p class="no-results">No stories found for this reporter.</p>`;

    document.getElementById("stories-section").scrollIntoView({ behavior: "smooth", block: "start" });
  }

  // --- INIT ---

  function init() {
    setCurrentDate();
    renderFeaturedStories();
    renderAllStories("all");
    renderSidebarReporters();
    attachEvents();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

})();
