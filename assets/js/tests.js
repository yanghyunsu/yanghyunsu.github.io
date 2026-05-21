(function () {
  "use strict";

  var resultsRoot = document.getElementById("test-results");
  var projects = window.PORTFOLIO_PROJECTS || [];
  var utils = window.PortfolioUtils;

  function test(name, assertion) {
    var passed = false;
    var error = null;

    try {
      passed = Boolean(assertion());
    } catch (caughtError) {
      error = caughtError;
    }

    if (!passed) {
      console.error("FAIL:", name, error || "Assertion returned false");
    } else {
      console.info("PASS:", name);
    }

    return { name: name, passed: passed, error: error };
  }

  var tests = [
    test("Project data exists", function () {
      return Array.isArray(projects) && projects.length >= 6;
    }),
    test("Every project has required fields", function () {
      return projects.every(function (project) {
        return project.id && project.title && project.category && project.role && project.summary && project.problem && project.approach && project.result;
      });
    }),
    test("All project IDs are unique", function () {
      var ids = projects.map(function (project) { return project.id; });
      return new Set(ids).size === ids.length;
    }),
    test("Featured projects are available for the home page", function () {
      return projects.filter(function (project) { return project.featured; }).length >= 3;
    }),
    test("Pipeline filter returns only Pipeline projects", function () {
      return utils.filterProjects(projects, "", "Pipeline").every(function (project) { return project.category === "Pipeline"; });
    }),
    test("Search matches software keywords", function () {
      return utils.filterProjects(projects, "houdini", "All").length >= 2;
    }),
    test("Unknown search returns no projects", function () {
      return utils.filterProjects(projects, "not-a-real-project-keyword", "All").length === 0;
    }),
    test("Project card escapes raw HTML", function () {
      var html = utils.createProjectCard({
        title: "<script>alert(1)</script>",
        category: "Pipeline",
        role: "TD",
        summary: "safe",
        problem: "safe",
        approach: "safe",
        result: "safe",
        software: ["Python"],
        links: []
      });
      return html.indexOf("<script>") === -1 && html.indexOf("&lt;script&gt;") !== -1;
    })
  ];

  if (resultsRoot) {
    var passedCount = tests.filter(function (item) { return item.passed; }).length;
    resultsRoot.innerHTML = "" +
      "<div class=\"test-summary " + (passedCount === tests.length ? "pass" : "fail") + "\">" +
        passedCount + " / " + tests.length + " tests passed" +
      "</div>" +
      "<ul>" + tests.map(function (item) {
        return "<li class=\"" + (item.passed ? "pass" : "fail") + "\"><strong>" + (item.passed ? "PASS" : "FAIL") + "</strong> — " + item.name + "</li>";
      }).join("") + "</ul>";
  }
})();
