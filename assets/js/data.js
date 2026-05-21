window.PORTFOLIO_PROJECTS = [
  {
    id: "maya-muddy-terrain",
    title: "Maya Python Script — Muddy Terrain Generator",
    category: "Pipeline",
    featured: true,
    role: "Technical Artist / Python Tooling",
    software: ["Maya", "Python"],
    summary: "Artist-facing tool for generating muddy terrain variations with controllable procedural parameters.",
    problem: "Manual terrain iteration can become slow when artists need many surface variations quickly.",
    approach: "Built a Maya Python workflow with exposed controls for repeatable generation, iteration, and cleanup.",
    result: "Improves iteration speed and keeps procedural terrain tests readable for lookdev or shot setup.",
    links: [
      { label: "ArtStation", url: "https://hyunsuyang.artstation.com" },
      { label: "Code / Demo", url: "#" }
    ]
  },
  {
    id: "nuke-aov-relight",
    title: "AOV Relight Toolkit — Nuke",
    category: "Nuke",
    featured: true,
    role: "Compositing Tool / LookDev",
    software: ["Nuke", "Python", "AOV"],
    summary: "Nuke workflow for using render passes to relight, rebalance, and test shot-level look variations.",
    problem: "Small lighting or material adjustments can become expensive if every look change requires a rerender.",
    approach: "Organized AOV controls into a clearer compositing workflow for predictable relight operations.",
    result: "Supports faster look iteration and cleaner presentation of before/after relight decisions.",
    links: [
      { label: "Breakdown", url: "#" },
      { label: "ArtStation", url: "https://hyunsuyang.artstation.com" }
    ]
  },
  {
    id: "lookdev-variant-manager",
    title: "LookDev Variant Manager",
    category: "Pipeline",
    featured: true,
    role: "Pipeline UX / Technical Art",
    software: ["Python", "Maya", "LookDev"],
    summary: "Tool concept for managing look variants, notes, and repeatable review states during asset development.",
    problem: "Lookdev iterations can be difficult to compare when shader, lighting, and render-state changes are scattered.",
    approach: "Designed a structured variant workflow with clear naming, state switching, and artist-readable controls.",
    result: "Makes review states easier to reproduce and reduces confusion during asset handoff.",
    links: [
      { label: "Case Study", url: "#" }
    ]
  },
  {
    id: "arnold-render-manager",
    title: "Arnold Render Manager",
    category: "Pipeline",
    featured: false,
    role: "Render Pipeline Tool",
    software: ["Arnold", "Maya", "Python"],
    summary: "Render management utility focused on safer render setup, validation, and repeatable artist output.",
    problem: "Render setup errors can waste time and make previews inconsistent across shots or artists.",
    approach: "Centralized common render controls and validation into one production-oriented utility.",
    result: "Reduces setup mistakes and makes render submissions easier to audit.",
    links: [
      { label: "Tool Notes", url: "#" }
    ]
  },
  {
    id: "swirl-trail-hda",
    title: "Swirl Trail HDA",
    category: "Houdini",
    featured: false,
    role: "Houdini Digital Asset",
    software: ["Houdini", "VEX", "HDA"],
    summary: "Reusable Houdini setup for controllable swirling trails with exposed procedural controls.",
    problem: "Motion-design style trail effects need art-directable parameters without rebuilding the network each time.",
    approach: "Packaged the node setup as an HDA with clear controls for motion, density, shape, and output behavior.",
    result: "Enables faster shot or style exploration while keeping the setup reusable.",
    links: [
      { label: "HDA Breakdown", url: "#" }
    ]
  },
  {
    id: "carrot-generator-houdini",
    title: "Carrot Generator — Houdini",
    category: "Houdini",
    featured: false,
    role: "Procedural Asset Study",
    software: ["Houdini", "Procedural Modeling"],
    summary: "Procedural generator study focused on controllable shape variation and asset readability.",
    problem: "Repeated organic props need variation without manual modeling for every asset instance.",
    approach: "Created procedural controls for silhouette, scale, bend, and surface-level variation.",
    result: "Demonstrates practical procedural modeling logic for asset generation workflows.",
    links: [
      { label: "Breakdown", url: "#" }
    ]
  },
  {
    id: "ue5-shader-material",
    title: "UE5 Shader / Material Work",
    category: "Realtime",
    featured: false,
    role: "Realtime LookDev",
    software: ["Unreal Engine 5", "Materials", "Lighting"],
    summary: "Realtime material and lighting tests for readable lookdev presentation and shader iteration.",
    problem: "Realtime lookdev needs clear material controls and lighting conditions that communicate the asset intent.",
    approach: "Built material tests and presentation scenes focused on readable parameter changes.",
    result: "Shows realtime technical art range alongside offline VFX tooling work.",
    links: [
      { label: "Demo", url: "#" }
    ]
  }
];
