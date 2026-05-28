(function () {
  const form = document.querySelector("[data-builder-form]");
  const buttonList = document.querySelector("[data-button-list]");
  const blockList = document.querySelector("[data-block-list]");
  const buttonTemplate = document.querySelector("[data-button-template]");
  const blockTemplate = document.querySelector("[data-block-template]");
  const preview = document.querySelector("[data-preview]");
  const status = document.querySelector("[data-status]");
  const addButton = document.querySelector("[data-add-button]");
  const addBlock = document.querySelector("[data-add-block]");
  const resetButton = document.querySelector("[data-reset]");
  const downloadButton = document.querySelector("[data-download]");
  const copyButton = document.querySelector("[data-copy]");

  if (!form || !buttonList || !blockList || !buttonTemplate || !blockTemplate || !preview) return;

  const sampleButtons = [
    { style: "secondary", label: "All Posts", url: "../posts.html" }
  ];

  const sampleBlocks = [
    { kind: "image", title: "", body: "Risograph Shader preview", source: "../assets/img/posts/risograph-shader.webp", alt: "Risograph Shader preview" },
    { kind: "heading", title: "Goal", body: "", source: "", alt: "" },
    { kind: "text", title: "", body: "Recreate the look of Risograph printing inside Nuke using BlinkScript. The tool takes an RGB image and simulates ink separation, physical grain, and final print assembly.", source: "", alt: "" },
    { kind: "image", title: "", body: "Add images between paragraphs to show process stills, node graphs, or rendered comparisons.", source: "", alt: "" },
    { kind: "heading", title: "Process", body: "", source: "", alt: "" },
    { kind: "list", title: "", body: "Ink Separation converts RGB into three ink coverage channels using cosine similarity and luminance matching.\nInk Texture applies procedural fBm noise to each coverage channel with independent seed offsets.\nPrint Assembly composites the final image using multiply blend and offset sampling to simulate plate misregistration.", source: "", alt: "" },
    { kind: "video", title: "", body: "Use a local mp4/webm file path, YouTube URL, Vimeo URL, or embed URL.", source: "", alt: "" },
    { kind: "heading", title: "Technical Details", body: "", source: "", alt: "" },
    { kind: "text", title: "", body: "Hue-based separation looked artificial, so the shader combines color-direction comparison with luminance matching. The grain pipeline uses value noise and fBm, while final assembly uses subtractive ink compositing.", source: "", alt: "" }
  ];

  function escapeHtml(value) {
    return String(value || "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function slugify(value) {
    const slug = String(value || "")
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    return slug || "new-post";
  }

  function setStatus(message) {
    status.textContent = message;
    window.clearTimeout(setStatus.timer);
    setStatus.timer = window.setTimeout(() => {
      status.textContent = "";
    }, 2200);
  }

  function readItem(item, fields) {
    return fields.reduce((values, field) => {
      const input = item.querySelector(`[data-field="${field}"]`);
      values[field] = input ? input.value.trim() : "";
      return values;
    }, {});
  }

  function getButtons() {
    return Array.from(buttonList.querySelectorAll(".builder-item"))
      .map((item) => readItem(item, ["style", "label", "url"]))
      .filter((button) => button.label && button.url);
  }

  function getBlocks() {
    return Array.from(blockList.querySelectorAll(".builder-item"))
      .map((item) => readItem(item, ["kind", "title", "body", "source", "alt"]));
  }

  function getFormData() {
    const data = new FormData(form);
    const title = data.get("title") || "New Post";
    const fileName = String(data.get("fileName") || "").trim() || `${slugify(title)}.html`;
    return {
      author: data.get("author") || "Hyunsu Yang",
      title,
      type: data.get("type") || "Project",
      summary: data.get("summary") || "",
      tags: data.get("tags") || "",
      fileName: fileName.endsWith(".html") ? fileName : `${fileName}.html`,
      accent: data.get("accent") || "#fca311",
      ink: data.get("ink") || "#000000",
      background: data.get("background") || "#ffffff",
      mediaShape: data.get("mediaShape") || "soft",
      buttons: getButtons(),
      blocks: getBlocks()
    };
  }

  function fillFields(item, values) {
    Object.entries(values).forEach(([field, value]) => {
      const input = item.querySelector(`[data-field="${field}"]`);
      if (input) input.value = value || "";
    });
  }

  function setLabel(item, field, text) {
    const label = item.querySelector(`[data-label="${field}"]`);
    const labelText = label && label.querySelector("[data-label-text]");
    if (labelText) labelText.textContent = text;
  }

  function setVisible(item, field, visible) {
    const label = item.querySelector(`[data-label="${field}"]`);
    if (label) label.hidden = !visible;
  }

  function syncBlockItem(item) {
    const kind = item.querySelector('[data-field="kind"]').value;
    const body = item.querySelector('[data-field="body"]');
    setVisible(item, "title", kind === "heading" || kind === "text" || kind === "list");
    setVisible(item, "body", kind !== "heading");
    setVisible(item, "source", kind === "image" || kind === "video" || kind === "embed");
    setVisible(item, "alt", false);
    setLabel(item, "title", kind === "list" ? "List heading" : "Heading");
    if (kind === "image" || kind === "video" || kind === "embed") {
      setLabel(item, "body", "Caption text");
      body.rows = 2;
      body.placeholder = "One or two short lines under the media.";
    } else if (kind === "list") {
      setLabel(item, "body", "Bullet items");
      body.rows = 4;
      body.placeholder = "Put each item on a new line.";
    } else {
      setLabel(item, "body", "Text");
      body.rows = 4;
      body.placeholder = "";
    }
  }

  function addButtonItem(button) {
    const item = buttonTemplate.content.firstElementChild.cloneNode(true);
    fillFields(item, { style: button.style || "primary", label: button.label || "GitHub", url: button.url || "" });
    buttonList.appendChild(item);
    updatePreview();
  }

  function addBlockItem(block) {
    const item = blockTemplate.content.firstElementChild.cloneNode(true);
    fillFields(item, {
      kind: block.kind || "text",
      title: block.title || "",
      body: block.body || "",
      source: block.source || "",
      alt: block.alt || ""
    });
    blockList.appendChild(item);
    syncBlockItem(item);
    updatePreview();
  }

  function paragraphs(value) {
    return String(value || "")
      .split(/\n{2,}/)
      .map((part) => part.trim())
      .filter(Boolean)
      .map((part) => `<p>${escapeHtml(part).replace(/\n/g, "<br>")}</p>`)
      .join("");
  }

  function externalAttrs(url) {
    return /^https?:\/\//i.test(url) ? ' target="_blank" rel="noreferrer"' : "";
  }

  function videoUrl(url) {
    const youtube = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?/]+)/i);
    if (youtube) return `https://www.youtube.com/embed/${youtube[1]}`;
    const vimeo = url.match(/vimeo\.com\/(\d+)/i);
    if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`;
    return url;
  }

  function embedFrame(url, title) {
    return `<div class="video-embed"><iframe src="${escapeHtml(url)}" title="${escapeHtml(title)}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe></div>`;
  }

  function blockHtml(block) {
    const title = escapeHtml(block.title);
    const body = paragraphs(block.body);
    const source = escapeHtml(block.source);
    const alt = escapeHtml(block.alt || block.body || block.title || "Project media");
    const caption = block.body ? `<p class="post-builder-caption">${escapeHtml(block.body).replace(/\n/g, "<br>")}</p>` : "";
    if (block.kind === "heading") return `<h2>${title || "Section"}</h2>${body}`;
    if (block.kind === "list") {
      const items = String(block.body || "").split("\n").map((item) => item.trim()).filter(Boolean).map((item) => `<li>${escapeHtml(item)}</li>`).join("");
      return `${title ? `<h2>${title}</h2>` : ""}<ul class="detail-list">${items}</ul>`;
    }
    if (block.kind === "image") {
      const media = source ? `<img src="${source}" alt="${alt}">` : `<div class="media-placeholder">Image</div>`;
      return `<figure class="post-builder-media"><div class="post-builder-frame">${media}</div>${caption}</figure>`;
    }
    if (block.kind === "video") {
      if (!block.source) return `<figure class="post-builder-media"><div class="post-builder-frame"><div class="media-placeholder">Video</div></div>${caption}</figure>`;
      if (/\.(mp4|webm|ogg)(\?.*)?$/i.test(block.source)) return `<figure class="post-builder-media"><div class="post-builder-frame"><video src="${source}" controls playsinline></video></div>${caption}</figure>`;
      return `<figure class="post-builder-media"><div class="post-builder-frame">${embedFrame(videoUrl(block.source), block.body || "Video")}</div>${caption}</figure>`;
    }
    if (block.kind === "embed") {
      const media = source ? embedFrame(block.source, block.body || "Embedded media") : `<div class="media-placeholder">Embed</div>`;
      return `<figure class="post-builder-media"><div class="post-builder-frame">${media}</div>${caption}</figure>`;
    }
    return `${title ? `<h2>${title}</h2>` : ""}${body}`;
  }

  function generatedHtml(data, options) {
    const tags = data.tags.split(",").map((tag) => tag.trim()).filter(Boolean).map((tag) => `<span>${escapeHtml(tag)}</span>`).join("");
    const buttons = data.buttons.map((button) => {
      const className = button.style === "secondary" ? "button button-secondary" : "button button-gold";
      return `<a class="${className}" href="${escapeHtml(button.url)}"${externalAttrs(button.url)}>${escapeHtml(button.label)}</a>`;
    }).join("");
    const base = options && options.preview ? `<base href="${window.location.origin}${window.location.pathname.replace(/\/[^/]*$/, "/")}posts/">` : "";
    return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  ${base}
  <meta name="description" content="${escapeHtml(data.summary)}">
  <title>${escapeHtml(data.title)} - ${escapeHtml(data.author)}</title>
  <link rel="stylesheet" href="../assets/css/styles.css">
  <style>
    :root { --gold: ${data.accent}; --black: ${data.ink}; --white: ${data.background}; }
    body.post-detail { background: var(--white); color: var(--black); }
    .post-builder-media { margin: 1.8rem 0; }
    .post-builder-frame { overflow: hidden; border: 1px solid var(--line); border-radius: ${data.mediaShape === "square" ? "0" : data.mediaShape === "cinema" ? "8px" : "18px"}; background: var(--gray); }
    .post-builder-frame img, .post-builder-frame video { display: block; width: 100%; height: auto; }
    .post-builder-media video { background: var(--black); }
    .post-builder-frame .video-embed { margin: 0; border: 0; border-radius: 0; }
    .post-builder-caption { margin: .75rem 0 0; color: var(--muted); font-size: .95rem; line-height: 1.55; }
    .media-placeholder { display: grid; min-height: 260px; place-items: center; background: var(--soft); color: var(--muted); font-weight: 900; }
    .post-main > p { color: var(--muted); font-size: 1.03rem; line-height: 1.75; }
    .post-main > p + p { margin-top: 1rem; }
  </style>
</head>
<body class="post-detail">
  <a class="skip-link" href="#main">Skip to content</a>
  <header class="site-header" data-header>
    <nav class="nav" aria-label="Main navigation">
      <a class="brand" href="../index.html">${escapeHtml(data.author)}</a>
      <button class="nav-toggle" type="button" aria-label="Open navigation" aria-expanded="false" data-nav-toggle><span></span><span></span><span></span></button>
      <div class="nav-links" data-nav-links><a href="../index.html">Home</a><a href="../posts.html">Posts</a><a href="../CV.html">CV</a><a href="../about.html">About</a></div>
    </nav>
  </header>
  <main id="main">
    <section class="page-hero section-pad">
      <div class="container narrow reveal">
        <p class="eyebrow">${escapeHtml(data.type)}</p>
        <h1>${escapeHtml(data.title)}</h1>
        <p class="lead">${escapeHtml(data.summary)}</p>
        <div class="hero-actions">${buttons || '<a class="button button-secondary" href="../posts.html">All Posts</a>'}</div>
      </div>
    </section>
    <section class="section-pad">
      <div class="container post-layout">
        <article class="post-main reveal">${data.blocks.map(blockHtml).join("\n          ")}</article>
        <aside class="post-side reveal"><h2>Built With</h2><div class="tag-list">${tags}</div></aside>
      </div>
    </section>
  </main>
  <footer class="site-footer"><div class="container footer-inner"><span>© <span data-year></span> ${escapeHtml(data.author)}</span><a href="../index.html">Back home</a></div></footer>
  <script src="../assets/js/main.js?v=image-lightbox"></script>
</body>
</html>`;
  }

  function updatePreview() {
    preview.srcdoc = generatedHtml(getFormData(), { preview: true });
  }

  function handleListClick(list, event) {
    const button = event.target.closest("button");
    if (!button) return;
    const item = button.closest(".builder-item");
    if (button.matches("[data-remove]")) item.remove();
    if (button.matches("[data-move-up]") && item.previousElementSibling) list.insertBefore(item, item.previousElementSibling);
    if (button.matches("[data-move-down]") && item.nextElementSibling) list.insertBefore(item.nextElementSibling, item);
    updatePreview();
  }

  buttonList.addEventListener("click", (event) => handleListClick(buttonList, event));
  blockList.addEventListener("click", (event) => handleListClick(blockList, event));
  blockList.addEventListener("change", (event) => {
    if (event.target.matches('[data-field="kind"]')) {
      syncBlockItem(event.target.closest(".builder-item"));
      updatePreview();
    }
  });
  form.addEventListener("input", updatePreview);
  addButton.addEventListener("click", () => addButtonItem({ style: "primary", label: "GitHub", url: "" }));
  addBlock.addEventListener("click", () => addBlockItem({ kind: "text", body: "New paragraph." }));
  resetButton.addEventListener("click", () => {
    buttonList.innerHTML = "";
    blockList.innerHTML = "";
    sampleButtons.forEach(addButtonItem);
    sampleBlocks.forEach(addBlockItem);
    updatePreview();
  });
  copyButton.addEventListener("click", async () => {
    await navigator.clipboard.writeText(generatedHtml(getFormData()));
    setStatus("Post HTML copied.");
  });
  downloadButton.addEventListener("click", () => {
    const data = getFormData();
    const blob = new Blob([generatedHtml(data)], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = data.fileName;
    link.click();
    URL.revokeObjectURL(url);
    setStatus(`${data.fileName} download started.`);
  });

  sampleButtons.forEach(addButtonItem);
  sampleBlocks.forEach(addBlockItem);
  updatePreview();
})();
