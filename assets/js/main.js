(function () {
  const yearNode = document.querySelector("[data-year]");
  if (yearNode) yearNode.textContent = new Date().getFullYear();

  const header = document.querySelector("[data-header]");
  const navToggle = document.querySelector("[data-nav-toggle]");
  const navLinks = document.querySelector("[data-nav-links]");

  if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
      const isOpen = navToggle.getAttribute("aria-expanded") === "true";
      navToggle.setAttribute("aria-expanded", String(!isOpen));
      navLinks.classList.toggle("is-open", !isOpen);
    });

    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navToggle.setAttribute("aria-expanded", "false");
        navLinks.classList.remove("is-open");
      });
    });
  }

  window.addEventListener("scroll", () => {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 8);
  });

  function observeReveals() {
    const revealNodes = document.querySelectorAll(".reveal:not(.is-observed)");
    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12 });
      revealNodes.forEach((node) => {
        node.classList.add("is-observed");
        observer.observe(node);
      });
    } else {
      revealNodes.forEach((node) => node.classList.add("is-visible"));
    }
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function cardTemplate(item, kind) {
    const tags = item.tags.map((tag) => `<span>${escapeHtml(tag)}</span>`).join("");
    const href = item.href || "#";
    const hasImage = Boolean(item.image);
    const imageClass = hasImage ? "has-image" : "no-image";
    const visualContent = hasImage
      ? `<img class="post-thumb" src="${escapeHtml(item.image)}" alt="${escapeHtml(item.title)} thumbnail" loading="lazy">`
      : `<span>${escapeHtml(item.label || item.type)}</span>`;

    return `
      <article class="post-card reveal ${kind === "reel" ? "reel-card" : ""}">
        <a class="post-visual ${imageClass}" href="${escapeHtml(href)}" aria-label="Open ${escapeHtml(item.title)}">
          ${visualContent}
        </a>
        <div class="post-body">
          <p class="post-type">${escapeHtml(item.type)}</p>
          <h3><a href="${escapeHtml(href)}">${escapeHtml(item.title)}</a></h3>
          <p>${escapeHtml(item.summary)}</p>
          <div class="tag-list">${tags}</div>
        </div>
      </article>`;
  }

  function renderCards() {
    const data = window.portfolioData || { reels: [], projects: [] };
    const reelsNode = document.querySelector("[data-reels]");
    const projectsNode = document.querySelector("[data-projects]");

    if (reelsNode) reelsNode.innerHTML = data.reels.map((item) => cardTemplate(item, "reel")).join("");
    if (projectsNode) projectsNode.innerHTML = data.projects.map((item) => cardTemplate(item, "project")).join("");
  }

  function setupImageLightbox() {
    const images = document.querySelectorAll(".post-detail .post-main img:not(.compare-img)");
    if (!images.length) return;

    const lightbox = document.createElement("div");
    lightbox.className = "image-lightbox";
    lightbox.hidden = true;
    lightbox.innerHTML = `
      <button class="image-lightbox-close" type="button" aria-label="Close image preview">Close</button>
      <img class="image-lightbox-img" alt="">
    `;
    document.body.appendChild(lightbox);

    const lightboxImage = lightbox.querySelector(".image-lightbox-img");
    const closeButton = lightbox.querySelector(".image-lightbox-close");

    function closeLightbox() {
      lightbox.hidden = true;
      document.body.classList.remove("has-image-lightbox");
      lightboxImage.removeAttribute("src");
      lightboxImage.alt = "";
    }

    images.forEach((image) => {
      if (image.closest("a")) return;
      image.tabIndex = 0;
      image.setAttribute("role", "button");
      image.setAttribute("aria-label", "Open image preview");
      image.addEventListener("click", () => {
        lightboxImage.src = image.currentSrc || image.src;
        lightboxImage.alt = image.alt || "";
        lightbox.hidden = false;
        document.body.classList.add("has-image-lightbox");
        closeButton.focus();
      });
      image.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          image.click();
        }
      });
    });

    closeButton.addEventListener("click", closeLightbox);
    lightbox.addEventListener("click", (event) => {
      if (event.target === lightbox) closeLightbox();
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !lightbox.hidden) closeLightbox();
    });
  }

  function setupCompareSliders() {
    document.querySelectorAll("[data-compare]").forEach((slider) => {
      const range = slider.querySelector(".compare-range");
      if (!range) return;

      function update() {
        slider.style.setProperty("--position", `${range.value}%`);
      }

      range.addEventListener("input", update);
      update();
    });
  }

  renderCards();
  setupCompareSliders();
  setupImageLightbox();
  observeReveals();
})();
