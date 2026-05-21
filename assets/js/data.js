window.PORTFOLIO_PROJECTS = [
  {
    id: "lookdev-variant-manager",
    title: "LookDev Variant Manager",
    category: "Pipeline",
    featured: true,
    role: "Maya Python Tool / LookDev Pipeline",
    software: ["Python", "Maya Python API", "QtDesigner", "Arnold"],
    summary: "Maya Python tool for saving, managing, and sharing look development setups across scenes.",
    problem: "Lookdev iterations can become difficult to compare when shader, lighting, and render-state changes are scattered across files or scenes.",
    approach: "Built an artist-facing Maya workflow for organizing look development setups with clear controls and shareable states.",
    result: "Improves repeatability for lookdev review and reduces confusion during scene handoff.",
    links: [
      { label: "ArtStation", url: "https://hyunsuyang.artstation.com/projects/8B44dR" }
    ]
  },
  {
    id: "arnold-render-manager",
    title: "Arnold Render Manager",
    category: "Pipeline",
    featured: true,
    role: "Render Pipeline Tool",
    software: ["Python", "Maya Python API", "Arnold"],
    summary: "Maya Python tool for submitting and monitoring Arnold render passes with AOV management, resolution presets, and validation.",
    problem: "Render setup errors can waste time and make output inconsistent across artists, passes, and review states.",
    approach: "Centralized render controls, AOV management, preset handling, and validation into one production-oriented utility.",
    result: "Improves artist workflow by reducing setup mistakes and making render submissions easier to audit.",
    links: [
      { label: "ArtStation", url: "https://hyunsuyang.artstation.com/projects/QK9XxL" }
    ]
  },
  {
    id: "risograph-shader",
    title: "Risograph Shader — Nuke BlinkScript",
    category: "Nuke",
    featured: true,
    role: "Nuke Tool / BlinkScript",
    software: ["Nuke", "BlinkScript"],
    summary: "BlinkScript-based Nuke tool that simulates Risograph print effects including ink separation, grain generation, and print assembly.",
    problem: "Stylized print looks often require repetitive manual layer assembly and can be hard to iterate consistently.",
    approach: "Built a procedural Nuke tool that exposes the core print-effect controls through a reusable shader workflow.",
    result: "Enables faster, repeatable Risograph-style look development inside Nuke.",
    links: [
      { label: "ArtStation", url: "https://hyunsuyang.artstation.com/projects/Nqd2QJ" }
    ]
  },
  {
    id: "maya-muddy-terrain",
    title: "Maya Python Script — Muddy Terrain Generator",
    category: "Pipeline",
    featured: false,
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
