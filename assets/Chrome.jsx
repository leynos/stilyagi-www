// Stilyagi web presence · shared chrome
// Sticky masthead, footer/colophon, tweaks dock.

const { useState, useEffect } = React;

// ---------- Site masthead (sticky top bar) --------------------------
function SiteMast({ current = "home" }) {
  const nav = [
    ["home", "Overview", "index.html"],
    ["why", "Manifesto", "why.html"],
    ["how", "Mechanics", "how.html"],
    ["design", "Architecture", "design.html"],
    ["roadmap", "Roadmap", "roadmap.html"],
    ["docs", "Docs", "docs.html"],
  ];
  return (
    <header className="site-mast">
      <div className="site-mast-inner">
        <a
          className="brand-lockup"
          href="index.html"
          aria-label="Stilyagi home"
        >
          <span className="brand-stripe" aria-hidden="true" />
          <span className="brand-word">stilyagi</span>
          <span className="brand-imprint">
            df12 · deterministic prose analysis
          </span>
        </a>
        <nav aria-label="Primary">
          <ol>
            {nav.map(([id, label, href]) => (
              <li key={id}>
                <a href={href} className={current === id ? "active" : ""}>
                  <span>{label}</span>
                </a>
              </li>
            ))}
          </ol>
        </nav>
        <a className="manifesto-link" href="why.html">
          <span>Read the manifesto</span>
          <span aria-hidden="true">→</span>
        </a>
      </div>
    </header>
  );
}

// ---------- Colophon footer ----------------------------------------
function Colophon() {
  return (
    <footer className="colophon-footer">
      <div className="wrap">
        <div className="imprint">
          <strong>
            Stilyagi<span className="r"> / </span>df12
          </strong>
          A deterministic documentation-analysis pipeline with Rust extraction,
          Python rules, source-faithful regions, and diagnostics that stay
          anchored to the bytes they describe.
          <div className="sig">
            Edition № 001 · Warm cream stock · Press-red verdicts
          </div>
          <div className="sig" style={{ marginTop: 4 }}>
            Set in Big Shoulders Display, IBM Plex Sans, and EB Garamond
          </div>
        </div>
        <div>
          <h4>Read</h4>
          <ul>
            <li>
              <a href="why.html">Manifesto</a>
            </li>
            <li>
              <a href="how.html">Mechanics</a>
            </li>
            <li>
              <a href="design.html">Architecture</a>
            </li>
            <li>
              <a href="roadmap.html">Roadmap</a>
            </li>
          </ul>
        </div>
        <div>
          <h4>Reference</h4>
          <ul>
            <li>
              <a href="docs.html">Documentation</a>
            </li>
            <li>
              <a href="docs.html#catalogue">Rules catalogue</a>
            </li>
            <li>
              <a href="docs.html#config">Config schema</a>
            </li>
            <li>
              <a href="docs.html#suppress">Suppressions</a>
            </li>
          </ul>
        </div>
        <div>
          <h4>Verdicts</h4>
          <ul>
            <li>
              <span className="verdict red">Absolute fidelity</span>
            </li>
            <li>
              <span className="verdict ink">Typed rules</span>
            </li>
            <li>
              <span className="verdict sage">Offline by default</span>
            </li>
            <li>
              <span className="verdict ochre">CLI-first</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="colophon-strip">
        <span>§ A compiler for prose</span>
        <span>Separate the iron from the jazz</span>
        <span>Deterministic by default · deep by design</span>
      </div>
    </footer>
  );
}

// ---------- Tweaks panel -------------------------------------------
// Respects host __activate_edit_mode / __deactivate_edit_mode protocol,
// plus persists choice in localStorage so it survives navigation.
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/ {
  grid: "default",
  density: "default",
  stamp: "Draft",
}; /*EDITMODE-END*/

function useTweaks() {
  const stored = (() => {
    try {
      return JSON.parse(localStorage.getItem("stilyagi.tweaks") || "null");
    } catch {
      return null;
    }
  })();
  const [t, set] = useState(stored || TWEAK_DEFAULTS);
  useEffect(() => {
    localStorage.setItem("stilyagi.tweaks", JSON.stringify(t));
    document.body.classList.remove(
      "grid-off",
      "grid-faint",
      "density-compact",
      "density-roomy",
    );
    if (t.grid === "off") document.body.classList.add("grid-off");
    if (t.grid === "faint") document.body.classList.add("grid-faint");
    if (t.density === "compact") document.body.classList.add("density-compact");
    if (t.density === "roomy") document.body.classList.add("density-roomy");
    // broadcast for other components (hero stamp text)
    window.__stilyagiTweaks = t;
    window.dispatchEvent(new CustomEvent("stilyagi:tweaks", { detail: t }));
    // Also tell the host to persist the JSON edit block
    try {
      window.parent.postMessage(
        { type: "__edit_mode_set_keys", edits: t },
        "*",
      );
    } catch {}
  }, [t]);
  return [t, set];
}

function TweaksDock() {
  const [open, setOpen] = useState(false);
  const [t, set] = useTweaks();

  useEffect(() => {
    const onMsg = (e) => {
      const d = e?.data;
      if (!d || !d.type) return;
      if (d.type === "__activate_edit_mode") setOpen(true);
      if (d.type === "__deactivate_edit_mode") setOpen(false);
    };
    window.addEventListener("message", onMsg);
    // announce availability only AFTER listener attached
    try {
      window.parent.postMessage({ type: "__edit_mode_available" }, "*");
    } catch {}
    return () => window.removeEventListener("message", onMsg);
  }, []);

  const Seg = ({ label, k, opts }) => (
    <div>
      <label>{label}</label>
      <div className="seg">
        {opts.map((o) => (
          <button
            key={o.value}
            className={t[k] === o.value ? "on" : ""}
            onClick={() => set({ ...t, [k]: o.value })}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <aside className={`tweaks-dock ${open ? "open" : ""}`} aria-hidden={!open}>
      <header>
        <span>
          Tweaks <span className="accent">· № 001</span>
        </span>
        <button onClick={() => setOpen(false)} aria-label="Close">
          ×
        </button>
      </header>
      <div className="body">
        <Seg
          label="Grid ruling"
          k="grid"
          opts={[
            { value: "default", label: "Ruled" },
            { value: "faint", label: "Faint" },
            { value: "off", label: "Plain" },
          ]}
        />
        <Seg
          label="Density"
          k="density"
          opts={[
            { value: "compact", label: "Compact" },
            { value: "default", label: "Normal" },
            { value: "roomy", label: "Roomy" },
          ]}
        />
        <Seg
          label="Hero verdict stamp"
          k="stamp"
          opts={[
            { value: "Draft", label: "Draft" },
            { value: "Grounded", label: "Grounded" },
            { value: "Not shipped", label: "Not shipped" },
          ]}
        />
      </div>
    </aside>
  );
}

// ---------- PageHero (shared page introducer) ----------------------
function PageHero({ eyebrow, title, lede, stamp }) {
  return (
    <section className="page-intro">
      <div className="wrap">
        <div>
          {eyebrow && <div className="folio">{eyebrow}</div>}
          {title && <h1>{title}</h1>}
        </div>
        <div>
          {lede && <p className="lede editorial">{lede}</p>}
          {stamp && (
            <div style={{ marginTop: 18 }}>
              <span className="stamp small">{stamp}</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// Aliases for page-level code that expects Nav/Footer names
const Nav = ({ active }) => <SiteMast current={active} />;
const Footer = () => (
  <React.Fragment>
    <Colophon />
    <TweaksDock />
  </React.Fragment>
);

Object.assign(window, {
  SiteMast,
  Colophon,
  TweaksDock,
  useTweaks,
  TWEAK_DEFAULTS,
  Nav,
  Footer,
  PageHero,
});
