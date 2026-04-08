// ── Data ──────────────────────────────────────────────────────────────────────

const ELEMENTS = [
  { name: "Progress",       desc: "How much of the product you have shipped. It is the most visible metric, but not always the most truthful one.",           dotColor: "#60a5fa", borderColor: "rgba(59,130,246,0.3)",   bg: "rgba(59,130,246,0.06)"   },
  { name: "Technical Debt", desc: "The hidden cost of shortcuts. It helps you move faster now, but creates friction, fragility, and slowdown later.",          dotColor: "#f87171", borderColor: "rgba(239,68,68,0.3)",    bg: "rgba(239,68,68,0.06)"    },
  { name: "Bugs",           desc: "Errors and failures that accumulate as systems grow more rushed and complex.",                                              dotColor: "#fb923c", borderColor: "rgba(249,115,22,0.3)",   bg: "rgba(249,115,22,0.06)"   },
  { name: "Velocity",       desc: "The speed at which your team can build. Debt and coordination overhead gradually reduce it.",                              dotColor: "#34d399", borderColor: "rgba(52,211,153,0.3)",   bg: "rgba(52,211,153,0.06)"   },
  { name: "Team Size",      desc: "More people can increase capacity, but also create communication overhead and coordination costs.",                         dotColor: "#a78bfa", borderColor: "rgba(167,139,250,0.3)",  bg: "rgba(167,139,250,0.06)"  },
  { name: "Morale",         desc: "The human side of software work. Stress, disorder, and constant firefighting wear teams down over time.",                   dotColor: "#f472b6", borderColor: "rgba(244,114,182,0.3)",  bg: "rgba(244,114,182,0.06)"  },
];

const GUIDE = [
  {
    name: "Progress", dotColor: "#3b82f6",
    ranges: [
      { tier: "healthy", label: "Healthy", val: "40–100", note: "if debt & bugs stay controlled" },
      { tier: "warning", label: "Warning", val: "—",      note: "high progress with rising debt or bugs" },
      { tier: "danger",  label: "Danger",  val: "—",      note: "high progress while system stability fails" },
    ],
    meaning: "The most visible metric — but not the most truthful. Fast progress can hide structural weakness accumulating beneath the surface.",
  },
  {
    name: "Technical Debt", dotColor: "#ef4444",
    ranges: [
      { tier: "healthy", label: "Healthy", val: "0–20"  },
      { tier: "warning", label: "Warning", val: "21–50" },
      { tier: "danger",  label: "Danger",  val: "51+"   },
    ],
    meaning: "Debt acts like accumulated friction. Each shortcut costs more than it saved. Left unchecked, it throttles velocity and erodes morale.",
  },
  {
    name: "Bugs", dotColor: "#f97316",
    ranges: [
      { tier: "healthy", label: "Healthy", val: "0–15"  },
      { tier: "warning", label: "Warning", val: "16–35" },
      { tier: "danger",  label: "Danger",  val: "36+"   },
    ],
    meaning: "Bugs signal a loss of control. A rising count suggests rushed development — and each unresolved bug makes the codebase harder to reason about.",
  },
  {
    name: "Velocity", dotColor: "#10b981",
    ranges: [
      { tier: "healthy", label: "Healthy", val: "12+",  note: "pts / sprint" },
      { tier: "warning", label: "Warning", val: "6–11", note: "pts / sprint" },
      { tier: "danger",  label: "Danger",  val: "< 6",  note: "pts / sprint" },
    ],
    meaning: "Reflects the team's real ability to keep building. A falling velocity means debt and coordination costs are overwhelming forward progress.",
  },
  {
    name: "Team Size", dotColor: "#8b5cf6",
    ranges: [
      { tier: "healthy", label: "Healthy", val: "3–5", note: "developers" },
      { tier: "warning", label: "Warning", val: "6–7", note: "developers" },
      { tier: "danger",  label: "Danger",  val: "8+",  note: "developers" },
    ],
    meaning: "More people increase capacity, but also communication overhead. Headcount is not a substitute for reducing debt or improving process.",
  },
  {
    name: "Morale", dotColor: "#ec4899",
    ranges: [
      { tier: "healthy", label: "Healthy", val: "70–100", note: "%" },
      { tier: "warning", label: "Warning", val: "40–69",  note: "%" },
      { tier: "danger",  label: "Danger",  val: "< 40",   note: "%" },
    ],
    meaning: "The human sustainability of the project. Low morale signals a team in reactive mode — constantly firefighting, never building with intention.",
  },
];

const ACTIONS = [
  {
    key: "ship", label: "Ship Fast", cls: "ship",
    desc: "Prioritize visible progress and fast release cycles.",
    effects: [
      { label: "Progress", dir: "↑",  cls: "eff-blue"    },
      { label: "Debt",     dir: "↑",  cls: "eff-red"     },
      { label: "Bugs",     dir: "↑",  cls: "eff-orange"  },
      { label: "Velocity", dir: "↓",  cls: "eff-yellow",  note: "later"    },
      { label: "Morale",   dir: "↓",  cls: "eff-yellow"  },
    ],
    insight: "Short-term output at the cost of long-term fragility.",
  },
  {
    key: "refactor", label: "Refactor", cls: "refactor",
    desc: "Pause feature delivery to clean up and reduce structural friction.",
    effects: [
      { label: "Debt",     dir: "↓",  cls: "eff-emerald" },
      { label: "Bugs",     dir: "↓",  cls: "eff-emerald" },
      { label: "Velocity", dir: "↑",  cls: "eff-emerald", note: "over time" },
      { label: "Progress", dir: "↑",  cls: "eff-blue",    note: "slightly" },
      { label: "Morale",   dir: "↑",  cls: "eff-emerald" },
    ],
    insight: "Sacrifices immediate momentum to improve long-term sustainability.",
  },
  {
    key: "hire", label: "Add Developer", cls: "hire",
    desc: "Expand the team to increase capacity.",
    effects: [
      { label: "Team Size", dir: "↑", cls: "eff-purple"                       },
      { label: "Velocity",  dir: "↑", cls: "eff-purple",  note: "+ overhead"  },
      { label: "Debt",      dir: "↑", cls: "eff-red",     note: "slightly"    },
      { label: "Bugs",      dir: "↑", cls: "eff-orange",  note: "slightly"    },
      { label: "Morale",    dir: "↓", cls: "eff-yellow"                       },
    ],
    insight: "More people don't automatically solve complexity — coordination has a cost.",
  },
  {
    key: "stab", label: "Stabilize", cls: "stab",
    desc: "Focus on testing, debugging, and reducing system instability.",
    effects: [
      { label: "Bugs",     dir: "↓↓", cls: "eff-emerald"                   },
      { label: "Debt",     dir: "↓",  cls: "eff-emerald", note: "slightly" },
      { label: "Progress", dir: "↑",  cls: "eff-blue",    note: "modestly" },
      { label: "Morale",   dir: "↑",  cls: "eff-emerald"                  },
    ],
    insight: "Emphasizes maintenance and reliability over new feature progress.",
  },
];

// ── State ─────────────────────────────────────────────────────────────────────

let phase = "intro";

let sim = {
  progress: 10, debt: 10, bugs: 5,
  velocity: 12, baseVelocity: 12, morale: 80,
  teamSize: 3, sprint: 1, log: [], done: false, outcome: null,
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function clamp(v, lo = 0, hi = Infinity) {
  return Math.max(lo, Math.min(hi, v));
}

function calcVelocity(base, debt, team, bugs) {
  let v = base - (debt * 0.15) - ((team - 3) * 2.5) - (bugs * 0.05);
  if (debt > 75)      v *= 0.5;
  else if (debt > 50) v *= 0.7;
  if (bugs > 40)      v *= 0.8;
  return Math.max(0, v);
}

function resolveOutcome({ progress, debt, bugs, velocity }) {
  if (debt >= 80)                   return { label: "Project Collapsed Under Technical Debt", sub: "The codebase became unmaintainable. The team spent every sprint firefighting instead of shipping.",                                          cls: "red"    };
  if (bugs >= 70)                   return { label: "Fast Growth, Fragile Product",           sub: "You moved quickly but the product is riddled with bugs. Users are losing trust and the backlog is overwhelming.",                             cls: "orange" };
  if (velocity <= 3)                return { label: "Stable but Paralyzed",                   sub: "The codebase is pristine, but the team can barely move. Over-investing in quality killed all momentum.",                                     cls: "yellow" };
  if (progress >= 80 && debt <= 30) return { label: "Balanced & Sustainable",                 sub: "You shipped meaningful progress while keeping debt in check. This is what great engineering looks like.",                                    cls: "green"  };
  if (progress >= 50)               return { label: "Decent Progress Made",                   sub: "The project moved forward with manageable debt. Solid result — there's room to improve the balance.",                                        cls: "blue"   };
  return                                   { label: "Slow but Alive",                         sub: "The project survived but growth was limited. More aggressive shipping in early sprints would have helped.",                                   cls: "slate"  };
}

function round1(n) { return Math.round(n * 10) / 10; }

// ── Actions ───────────────────────────────────────────────────────────────────

function act(key) {
  if (sim.done) return;

  let { progress, debt, bugs, baseVelocity, morale, teamSize, sprint, log } = sim;
  let msg;

  if (key === "ship") {
    progress += sim.velocity;
    bugs     += 8 + sim.debt * 0.05;
    debt     += 12;
    morale   -= 2;
    msg = `Sprint ${sprint}  ·  Shipped fast — progress +${Math.round(sim.velocity)}. Debt and bugs crept up.`;
  } else if (key === "refactor") {
    debt         -= 10;
    bugs         -= 5;
    baseVelocity += 2;
    morale       += 2;
    progress     += 2;
    msg = `Sprint ${sprint}  ·  Refactored the codebase. Things are cleaner; future sprints will be faster.`;
  } else if (key === "hire") {
    teamSize     += 1;
    baseVelocity += 3;
    debt         += 3;
    bugs         += 2;
    morale       -= 1;
    msg = `Sprint ${sprint}  ·  New developer joined (${teamSize} total). More hands, more coordination overhead.`;
  } else {
    bugs     -= 10;
    debt     -= 3;
    progress += 4;
    morale   += 1;
    msg = `Sprint ${sprint}  ·  Stabilized the system. Bugs squashed; team can finally breathe.`;
  }

  progress     = clamp(Math.round(progress), 0, 200);
  debt         = clamp(Math.round(debt), 0);
  bugs         = clamp(Math.round(bugs), 0);
  baseVelocity = clamp(baseVelocity, 1);
  morale       = clamp(Math.round(morale), 0, 100);
  teamSize     = clamp(teamSize, 1);

  const velocity = round1(calcVelocity(baseVelocity, debt, teamSize, bugs));
  const newSprint = sprint + 1;
  const newLog    = [...log, msg];
  const done      = newSprint > 15 || debt >= 100 || progress >= 100;

  let outcome = null;
  if (done) {
    outcome = resolveOutcome({ progress, debt, bugs, velocity });
    newLog.push(`── Final result: ${outcome.label} ──`);
  }

  sim = { progress, debt, bugs, velocity, baseVelocity, morale, teamSize, sprint: newSprint, log: newLog, done, outcome };
  render();
}

function reset() {
  sim = {
    progress: 10, debt: 10, bugs: 5,
    velocity: 12, baseVelocity: 12, morale: 80,
    teamSize: 3, sprint: 1, log: [], done: false, outcome: null,
  };
  render();
}

// ── Navigation ────────────────────────────────────────────────────────────────

function goTo(next) {
  const root = document.getElementById("root");
  root.style.opacity = "0";
  root.style.transition = "opacity 0.28s ease";
  setTimeout(() => {
    phase = next;
    render();
    setTimeout(() => {
      root.style.opacity = "1";
      root.style.transition = "opacity 0.28s ease";
    }, 40);
  }, 280);
}

// ── HTML builders ─────────────────────────────────────────────────────────────

function arrow() {
  return `<svg width="13" height="13" viewBox="0 0 13 13" fill="none" style="flex-shrink:0">
    <path d="M1 6.5h11M6.5 1l5.5 5.5-5.5 5.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;
}

function buildIntro() {
  return `
    <div class="intro">
      <div class="intro-bg"></div>
      <div class="intro-dots"></div>
      <div class="intro-inner">
        <div class="anim a1" style="margin-bottom:32px;display:flex;justify-content:center">
          <span class="badge">
            <span class="badge-dot"></span>
            <span class="badge-text">Interactive Simulation</span>
          </span>
        </div>
        <div class="anim a2">
          <h1 style="margin-bottom:24px">
            <span class="intro-t1">Technical Debt</span>
            <span class="intro-t2">Dashboard</span>
          </h1>
        </div>
        <div class="anim a3">
          <p class="intro-sub">
            You are a startup founder. Every sprint, you must balance
            <strong>speed</strong>, <strong>stability</strong>,
            <strong>team growth</strong>, and <strong>long-term sustainability</strong>.
          </p>
        </div>
        <div class="anim a4">
          <p class="intro-body">
            Shortcuts can accelerate progress now while quietly making the system harder to
            maintain later. Your goal is not simply to ship fast, but to survive the
            consequences of your decisions.
          </p>
        </div>
        <div class="anim a5" style="display:flex;justify-content:center">
          <button class="btn-primary" onclick="goTo('elements')">
            Begin Simulation ${arrow()}
          </button>
        </div>
      </div>
    </div>
  `;
}

function buildElements() {
  const cards = ELEMENTS.map((el, i) => `
    <div class="el-card anim" style="animation-delay:${80 + i * 65}ms; border-color:${el.borderColor}; background:${el.bg}">
      <div class="el-header">
        <span class="el-dot" style="background:${el.dotColor}"></span>
        <span class="el-name">${el.name}</span>
      </div>
      <p class="el-desc">${el.desc}</p>
    </div>
  `).join("");

  return `
    <div class="elements">
      <div class="wrap" style="padding-top:0;padding-bottom:0">
        <div class="anim a1" style="text-align:center;margin-bottom:8px">
          <p class="eyebrow">6 Core Elements</p>
          <h2 class="section-title">What you're managing</h2>
          <p class="section-sub">
            These six metrics govern your project. Every decision you make will shift them —
            often in ways you didn't intend.
          </p>
        </div>
        <div class="el-grid">${cards}</div>
        <div class="anim a5" style="display:flex;justify-content:center">
          <button class="btn-primary" onclick="goTo('dashboard')">
            Enter Dashboard ${arrow()}
          </button>
        </div>
      </div>
    </div>
  `;
}

function barColor(val, goodAbove, warnAbove) {
  if (val >= goodAbove) return "c-green";
  if (val >= warnAbove) return "c-yellow";
  return "c-red";
}

function buildDashboard() {
  const { progress, debt, bugs, velocity, morale, teamSize, sprint, log, done, outcome } = sim;

  const debtCls = barColor(100 - debt,    40, 10);
  const bugCls  = barColor(100 - bugs,    60, 30);
  const velCls  = velocity >= 12 ? "c-green" : velocity >= 6 ? "c-yellow" : "c-red";
  const morCls  = barColor(morale, 70, 40);

  const debtNote  = debt < 30    ? "Under control"        : debt < 60    ? "Growing concern"   : "Critical — act now";
  const bugNote   = bugs < 20    ? "Manageable"           : bugs < 50    ? "Piling up"         : "Out of control";
  const velNote   = velocity >= 12 ? "Healthy throughput" : velocity >= 6 ? "Starting to slow" : "Critically slow";
  const teamNote  = teamSize > 5 ? "High overhead"        : teamSize > 3 ? "Growing"           : "Lean team";
  const morNote   = morale > 70  ? "Team motivated"       : morale > 40  ? "Feeling pressure"  : "Burning out";

  // Sprint pips
  const pips = Array.from({ length: 15 }, (_, i) => {
    const cls = i < sprint - 1 ? "done" : i === sprint - 1 ? "current" : "";
    return `<div class="pip ${cls}"></div>`;
  }).join("");

  // Metric cards
  function metricCard(label, value, unit, note, barPct, barCls) {
    return `
      <div class="metric-card">
        <span class="metric-label">${label}</span>
        <span class="metric-value">${value}${unit}</span>
        <div class="bar-track">
          <div class="bar-fill ${barCls}" style="width:${Math.min(barPct, 100)}%"></div>
        </div>
        <span class="metric-note">${note}</span>
      </div>
    `;
  }

  const metrics = `
    <div class="metrics-grid">
      ${metricCard("Progress",       progress,  "%",    "Project completion", progress,            "c-blue"  )}
      ${metricCard("Technical Debt", debt,       "",     debtNote,            debt,                debtCls   )}
      ${metricCard("Bugs",           bugs,       "",     bugNote,             bugs,                bugCls    )}
      ${metricCard("Velocity",       velocity,   " pts", velNote,             (velocity / 15)*100, velCls    )}
      ${metricCard("Team Size",      teamSize,   " devs",teamNote,            (teamSize / 8)*100,  "c-purple")}
      ${metricCard("Morale",         morale,     "%",    morNote,             morale,              morCls    )}
    </div>
  `;

  // Velocity warning
  const velWarn = velocity < 5 && !done ? `
    <div class="vel-warn">
      <span class="vel-warn-icon">⚠</span>
      <p class="vel-warn-text">
        <strong>Velocity critical.</strong>
        Development is slowing down due to accumulated complexity and coordination overhead.
      </p>
    </div>
  ` : "";

  // Actions or outcome
  let actionArea;
  if (!done) {
    const btns = ACTIONS.map(a => {
      const effs = a.effects.map(e =>
        `<span class="eff ${e.cls}">${e.dir} ${e.label}${e.note ? `<span class="note"> ${e.note}</span>` : ""}</span>`
      ).join("");
      return `
        <button class="action-btn ${a.cls}" onclick="act('${a.key}')">
          <div class="action-label">${a.label}</div>
          <p class="action-desc">${a.desc}</p>
          <div class="effects">${effs}</div>
          <p class="action-insight">${a.insight}</p>
        </button>
      `;
    }).join("");
    actionArea = `<div class="actions-grid" style="margin-bottom:20px">${btns}</div>`;
  } else {
    actionArea = `
      <div class="outcome ${outcome.cls}" style="margin-bottom:20px">
        <div class="outcome-label">${outcome.label}</div>
        <div class="outcome-sub">${outcome.sub}</div>
        <button class="btn-restart" onclick="reset()">Start New Project →</button>
      </div>
    `;
  }

  // Log
  const logEntries = log.length === 0
    ? `<p class="log-empty">No events yet. Choose an action above to begin.</p>`
    : log.map((line, i) =>
        `<div class="log-entry ${i === log.length - 1 ? "latest" : ""}">${line}</div>`
      ).join("");

  // Guide
  const guideCards = GUIDE.map(m => {
    const ranges = m.ranges.map(r => `
      <div class="guide-range-row">
        <span class="rbadge ${r.tier}">${r.label}</span>
        <span class="rval">${r.val}</span>
        ${r.note ? `<span class="rnote">${r.note}</span>` : ""}
      </div>
    `).join("");
    return `
      <div class="guide-card">
        <div class="guide-card-header">
          <span class="guide-dot" style="background:${m.dotColor}"></span>
          <span class="guide-card-name">${m.name}</span>
        </div>
        <div class="guide-ranges">${ranges}</div>
        <p class="guide-meaning">${m.meaning}</p>
      </div>
    `;
  }).join("");

  return `
    <div style="min-height:100vh;background:#030712;color:white">
      <div class="wrap">

        <div class="dash-header">
          <div>
            <div class="dash-title">Technical Debt Dashboard</div>
            <div class="dash-sub">Ship fast now, pay later.</div>
          </div>
          <button class="btn-reset" onclick="reset()">Reset</button>
        </div>

        <div class="sprint-row">
          <span class="sprint-label">Sprint ${sprint} / 15</span>
          <div class="sprint-pips">${pips}</div>
        </div>

        ${metrics}
        ${velWarn}
        ${actionArea}

        <div class="log-card" id="log-card">
          <div class="log-title">Sprint Log</div>
          <div class="log-body" id="log-body">${logEntries}</div>
        </div>

        <p class="footer-note">15 sprints to ship your project — every decision has consequences</p>

        <div class="guide">
          <p class="guide-eyebrow">Reference</p>
          <h2 class="guide-title">How to Read the System</h2>
          <p class="guide-intro">
            A healthy project is not one that simply maximizes progress. It balances visible output
            with maintainability, stability, sustainable team dynamics, and long-term development capacity.
          </p>
          <div class="guide-grid">${guideCards}</div>
          <p class="guide-closing">
            "Software projects can appear successful in the short term while quietly becoming more fragile underneath."
          </p>
        </div>

      </div>
    </div>
  `;
}

// ── Render ────────────────────────────────────────────────────────────────────

function render() {
  const root = document.getElementById("root");

  if (phase === "intro")         root.innerHTML = buildIntro();
  else if (phase === "elements") root.innerHTML = buildElements();
  else                           root.innerHTML = buildDashboard();

  // Scroll log to bottom after each update
  const logBody = document.getElementById("log-body");
  if (logBody) logBody.scrollTop = logBody.scrollHeight;
}

// ── Boot ──────────────────────────────────────────────────────────────────────

render();
