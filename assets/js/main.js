(function () {
  "use strict";

  function normalize(value) {
    return String(value || "").trim().toLowerCase();
  }

  function getSearchText(project) {
    return [
      project.title,
      project.category,
      project.role,
      project.summary,
      project.problem,
      project.approach,
      project.result,
      ...(project.software || [])
    ].join(" ").toLowerCase();
  }

  function filterProjects(projects, query, category) {
    var normalizedQuery = normalize(query);
    var activeCategory = category || "All";

    return projects.filter(function (project) {
      var matchesCategory = activeCategory === "All" || project.category === activeCategory;
      var matchesQuery = !normalizedQuery || getSearchText(project).indexOf(normalizedQuery) !== -1;
      return matchesCategory && matchesQuery;
    });
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function createProjectCard(project) {
    var software = (project.software || []).map(function (item) {
      return "<span>" + escapeHtml(item) + "</span>";
    }).join("");

    var links = (project.links || []).map(function (link) {
      return "<a href=\"" + escapeHtml(link.url) + "\" target=\"_blank\" rel=\"noreferrer\">" + escapeHtml(link.label) + " ↗</a>";
    }).join("");

    return "" +
      "<article class=\"project-card reveal\" data-category=\"" + escapeHtml(project.category) + "\">" +
        "<div class=\"project-visual\"><span>" + escapeHtml(project.category) + "</span></div>" +
        "<div class=\"project-body\">" +
          "<div class=\"project-meta\"><span>" + escapeHtml(project.role) + "</span></div>" +
          "<h3>" + escapeHtml(project.title) + "</h3>" +
          "<p>" + escapeHtml(project.summary) + "</p>" +
          "<dl class=\"project-breakdown\">" +
            "<div><dt>Problem</dt><dd>" + escapeHtml(project.problem) + "</dd></div>" +
            "<div><dt>Approach</dt><dd>" + escapeHtml(project.approach) + "</dd></div>" +
            "<div><dt>Result</dt><dd>" + escapeHtml(project.result) + "</dd></div>" +
          "</dl>" +
          "<div class=\"tag-list\">" + software + "</div>" +
          "<div class=\"project-links\">" + links + "</div>" +
        "</div>" +
      "</article>";
  }

  function renderProjects(root, projects) {
    var limit = Number(root.getAttribute("data-limit") || 0);
    var visibleProjects = limit > 0 ? projects.filter(function (project) { return project.featured; }).slice(0, limit) : projects;

    if (!visibleProjects.length) {
      root.innerHTML = "<div class=\"empty-state\">No matching projects. Try another category or keyword.</div>";
      return;
    }

    root.innerHTML = visibleProjects.map(createProjectCard).join("");
    revealVisibleElements();
  }

  function setupProjectFiltering() {
    var root = document.querySelector("[data-project-grid]");
    if (!root || !window.PORTFOLIO_PROJECTS) return;

    var projects = window.PORTFOLIO_PROJECTS;
    var searchInput = document.querySelector("[data-project-search]");
    var filterButtons = Array.prototype.slice.call(document.querySelectorAll("[data-filter]"));
    var activeCategory = "All";

    function update() {
      var query = searchInput ? searchInput.value : "";
      var filtered = filterProjects(projects, query, activeCategory);
      renderProjects(root, filtered);
    }

    if (searchInput) {
      searchInput.addEventListener("input", update);
    }

    filterButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        activeCategory = button.getAttribute("data-filter") || "All";
        filterButtons.forEach(function (item) { item.classList.remove("is-active"); });
        button.classList.add("is-active");
        update();
      });
    });

    update();
  }

  function setupNavigation() {
    var toggle = document.querySelector("[data-nav-toggle]");
    var links = document.querySelector("[data-nav-links]");
    if (!toggle || !links) return;

    toggle.addEventListener("click", function () {
      var isOpen = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!isOpen));
      links.classList.toggle("is-open", !isOpen);
    });
  }

  function setupYear() {
    Array.prototype.slice.call(document.querySelectorAll("[data-year]")).forEach(function (item) {
      item.textContent = new Date().getFullYear();
    });
  }

  function revealVisibleElements() {
    var elements = Array.prototype.slice.call(document.querySelectorAll(".reveal"));

    if (!("IntersectionObserver" in window)) {
      elements.forEach(function (element) { element.classList.add("is-visible"); });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    elements.forEach(function (element) {
      if (!element.classList.contains("is-visible")) observer.observe(element);
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    setupNavigation();
    setupYear();
    setupProjectFiltering();
    revealVisibleElements();
  });

  window.PortfolioUtils = {
    normalize: normalize,
    getSearchText: getSearchText,
    filterProjects: filterProjects,
    createProjectCard: createProjectCard
  };
})();
