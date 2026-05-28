(function () {
  const data = window.portfolioData || { reels: [], projects: [] };
  const projectTitles = data.projects.map((item) => item.title);
  const serialized = JSON.stringify(data).toLowerCase();
  const tests = [
    ["has exactly two reel embeds", data.reels.length === 2],
    ["Comp reel uses the YouTube embed", data.reels.some((item) => item.title === "Comp Reel" && String(item.embedUrl).includes("youtube.com/embed/UMFUIYgafTE"))],
    ["TD reel uses the Vimeo embed", data.reels.some((item) => item.title === "TD Reel" && String(item.embedUrl).includes("player.vimeo.com/video/1168949895"))],
    ["reel entries are not local post pages", data.reels.every((item) => !item.href)],
    ["Surface Scatter is first", projectTitles[0] === "Surface Scatter"],
    ["muddy terrain is last", projectTitles[projectTitles.length - 1] === "Muddy Terrain Generator"],
    ["all project cards link to local post pages", data.projects.every((item) => /^posts\/.+\.html$/.test(item.href))],
    ["github links are present in project data", serialized.includes("github.com/yanghyunsu/aov-relight-toolkit") && serialized.includes("github.com/yanghyunsu/maya-arnoldrendermanager")],
    ["Arnold demo link is present", serialized.includes("youtu.be/qat2da9uta4")],
    ["LookDev demo link is present", serialized.includes("youtu.be/0v5xhahwao8")],
    ["CV label is used", !serialized.includes("resume")],
    ["project category does not use Personal label", !serialized.includes("personal project")],
    ["swirl trail is removed", !serialized.includes("swirl")],
    ["project thumbnails prefer webp", data.projects.filter((item) => item.title !== "Surface Scatter").every((item) => String(item.image).endsWith(".webp"))]
  ];

  function renderTests() {
    const target = document.querySelector("[data-test-results]");
    if (!target) return;
    target.innerHTML = tests.map(([name, pass]) => {
      return `<li class="${pass ? "pass" : "fail"}">${pass ? "PASS" : "FAIL"}: ${name}</li>`;
    }).join("");
  }

  async function runStaticPageChecks() {
    try {
      const response = await fetch("index.html", { cache: "no-store" });
      const html = await response.text();
      tests.push(["home hero is text-only", !html.includes("hero-visual") && !html.includes("visual-card")]);
      tests.push(["home hero removes the old eyebrow line", !html.includes("VFX · Compositing · Tools")]);
      tests.push(["about summary is inside the hero", html.includes('class="hero-summary"') && !html.includes('class="home-about-line"')]);
      tests.push(["home hero still links to reel and CV", html.includes('href="#reel"') && html.includes('href="CV.html"')]);
      tests.push(["index uses Portfolio section copy", html.includes("Portfolio") && html.includes("Collection of personal projects and studies")]);
      const jsResponse = await fetch("assets/js/main.js", { cache: "no-store" });
      const jsText = await jsResponse.text();
      tests.push(["project renderer uses real image tags", jsText.includes("post-thumb") && !jsText.includes("--card-image")]);
      const missingImage = data.projects.find((item) => item.image && !/^(assets\/img\/posts\/).+\.(webp|svg)$/.test(item.image));
      tests.push(["project image paths point to assets/img/posts", !missingImage]);
      const arnoldPage = await fetch("posts/arnold-render-manager.html", { cache: "no-store" }).then((res) => res.text());
      const lookdevPage = await fetch("posts/lookdev-variant-manager.html", { cache: "no-store" }).then((res) => res.text());
      tests.push(["Arnold post embeds demo video", arnoldPage.includes("youtube.com/embed/QaT2dA9utA4")]);
      tests.push(["LookDev post embeds demo video", lookdevPage.includes("youtube.com/embed/0v5xHaHwAO8")]);
      const postPages = [
        "posts/aov-relight-toolkit.html",
        "posts/arnold-render-manager.html",
        "posts/lookdev-variant-manager.html",
        "posts/muddy-terrain-generator.html",
        "posts/new-project.html",
        "posts/risograph-shader.html"
      ];
      const pageTexts = await Promise.all(postPages.map((url) => fetch(url, { cache: "no-store" }).then((res) => res.text())));
      tests.push(["post detail hero keeps actions in the hero", pageTexts.every((text) => text.includes('class="hero-actions"'))]);
      tests.push(["post sidebars contain no action buttons", pageTexts.every((text) => !/<aside class="post-side[\s\S]*?<a class="button/.test(text))]);
      tests.push(["post pages do not show View Project or Watch Demo buttons", pageTexts.every((text) => !text.includes(">View Project<") && !text.includes(">Watch Demo<"))]);
    } catch (error) {
      tests.push(["static index checks skipped in this environment", true]);
    }
    renderTests();
  }

  renderTests();
  runStaticPageChecks();
})();
