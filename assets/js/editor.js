(function () {
  const form = document.querySelector("[data-portfolio-form]");
  const projectList = document.querySelector("[data-project-list]");
  const projectPreview = document.querySelector("[data-project-preview]");
  const projectTemplate = document.querySelector("[data-project-template]");
  const status = document.querySelector("[data-status]");
  const addProject = document.querySelector("[data-add-project]");
  const resetProjects = document.querySelector("[data-reset-projects]");
  const downloadDataButton = document.querySelector("[data-download-data]");
  const copyDataButton = document.querySelector("[data-copy-data]");

  if (!form || !projectList || !projectPreview || !projectTemplate) return;

  const originalProjects = JSON.parse(JSON.stringify((window.portfolioData && window.portfolioData.projects) || []));

  function escapeHtml(value) {
    return String(value || "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function setStatus(message) {
    status.textContent = message;
    window.clearTimeout(setStatus.timer);
    setStatus.timer = window.setTimeout(() => {
      status.textContent = "";
    }, 2200);
  }

  function fillFields(item, values) {
    Object.entries(values).forEach(([field, value]) => {
      const input = item.querySelector(`[data-field="${field}"]`);
      if (input) input.value = value || "";
    });
  }

  function readItem(item, fields) {
    return fields.reduce((values, field) => {
      const input = item.querySelector(`[data-field="${field}"]`);
      values[field] = input ? input.value.trim() : "";
      return values;
    }, {});
  }

  function tagsFromText(value) {
    return String(value || "")
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
  }

  function addProjectItem(project) {
    const item = projectTemplate.content.firstElementChild.cloneNode(true);
    fillFields(item, {
      title: project.title || "New Post",
      type: project.type || "Project",
      summary: project.summary || "",
      tags: Array.isArray(project.tags) ? project.tags.join(", ") : project.tags || "",
      href: project.href || "posts/new-post.html",
      image: project.image || "",
      label: project.label || "POST",
      repositoryUrl: project.repositoryUrl || "",
      demoUrl: project.demoUrl || ""
    });
    projectList.appendChild(item);
  }

  function getProjects() {
    return Array.from(projectList.querySelectorAll(".builder-item")).map((item) => {
      const values = readItem(item, [
        "title",
        "type",
        "summary",
        "tags",
        "href",
        "image",
        "label",
        "repositoryUrl",
        "demoUrl"
      ]);
      const project = {
        title: values.title || "Untitled Post",
        type: values.type || "Project",
        summary: values.summary || "",
        tags: tagsFromText(values.tags),
        href: values.href || "#",
        label: values.label || "POST",
        image: values.image || ""
      };
      if (values.repositoryUrl) project.repositoryUrl = values.repositoryUrl;
      if (values.demoUrl) project.demoUrl = values.demoUrl;
      return project;
    });
  }

  function cardTemplate(item) {
    const tags = item.tags.map((tag) => `<span>${escapeHtml(tag)}</span>`).join("");
    const visual = item.image
      ? `<img class="post-thumb" src="${escapeHtml(item.image)}" alt="${escapeHtml(item.title)} thumbnail">`
      : `<span>${escapeHtml(item.label || item.type)}</span>`;
    return `
      <article class="post-card">
        <a class="post-visual ${item.image ? "has-image" : "no-image"}" href="${escapeHtml(item.href || "#")}">
          ${visual}
        </a>
        <div class="post-body">
          <p class="post-type">${escapeHtml(item.type)}</p>
          <h3><a href="${escapeHtml(item.href || "#")}">${escapeHtml(item.title)}</a></h3>
          <p>${escapeHtml(item.summary)}</p>
          <div class="tag-list">${tags}</div>
        </div>
      </article>`;
  }

  function renderPreview() {
    projectPreview.innerHTML = getProjects().map(cardTemplate).join("");
  }

  function generatedDataJs() {
    const data = {
      reels: (window.portfolioData && Array.isArray(window.portfolioData.reels)) ? window.portfolioData.reels : [],
      projects: getProjects()
    };
    return `window.portfolioData = ${JSON.stringify(data, null, 2)};\n`;
  }

  function handleListClick(event) {
    const button = event.target.closest("button");
    if (!button) return;

    const item = button.closest(".builder-item");
    if (button.matches("[data-remove]")) item.remove();
    if (button.matches("[data-move-up]") && item.previousElementSibling) {
      projectList.insertBefore(item, item.previousElementSibling);
    }
    if (button.matches("[data-move-down]") && item.nextElementSibling) {
      projectList.insertBefore(item.nextElementSibling, item);
    }
    renderPreview();
  }

  projectList.addEventListener("click", handleListClick);
  form.addEventListener("input", renderPreview);

  addProject.addEventListener("click", () => {
    addProjectItem({
      title: "New Post",
      type: "Project",
      summary: "",
      tags: ["Coming Soon"],
      href: "posts/new-post.html",
      label: "POST",
      image: "assets/img/posts/new-project.svg"
    });
    renderPreview();
  });

  resetProjects.addEventListener("click", () => {
    projectList.innerHTML = "";
    originalProjects.forEach(addProjectItem);
    renderPreview();
    setStatus("Reset from current data.js.");
  });

  copyDataButton.addEventListener("click", async () => {
    await navigator.clipboard.writeText(generatedDataJs());
    setStatus("data.js copied.");
  });

  downloadDataButton.addEventListener("click", () => {
    const blob = new Blob([generatedDataJs()], { type: "text/javascript" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "data.js";
    link.click();
    URL.revokeObjectURL(url);
    setStatus("data.js download started.");
  });

  originalProjects.forEach(addProjectItem);
  renderPreview();
})();
