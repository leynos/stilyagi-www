// Stilyagi web presence · shared chrome
// Sticky masthead, footer/colophon, tweaks dock.

const { useState, useEffect } = React;

// ---------- Site masthead (sticky top bar) --------------------------
function SiteMast({ current = "home" }) {
  const nav = [
    ["home",    "Home",    "index.html"],
    ["why",     "Why",     "why.html"],
    ["how",     "How",     "how.html"],
    ["design",  "Design",  "design.html"],
    ["roadmap", "Roadmap", "roadmap.html"],
    ["docs",    "Docs",    "docs.html"],
  ];
  return (
    <header className="site-mast">
      <div className="site-mast-inner">
        <a className="mark" href="index.html">
          Stilyagi<span className="suffix">df12</span>
        </a>
        <nav>
          <ol>
            {nav.map(([id, label, href]) => (
              <li key={id}><a href={href} className={current === id ? "active" : ""}>{label}</a></li>
            ))}
          </ol>
        </nav>
        <div className="edition">
          Draft · v1 under construction<br/>
          <strong>Edition № 001 · April 26</strong>
        </div>
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
          <strong>Stilyagi<span className="r"> · </span>df12</strong>
          A prose, documentation, comment, and docstring linter.
          Rust extraction, Python rules. Not a Vale wrapper, not a grammar
          checker, not an LLM assistant.
          <div className="sig">☞ Set in EB Garamond &amp; Big Shoulders Display</div>
          <div className="sig" style={{marginTop:4}}>Oxford spelling throughout · Printed on warm cream stock</div>
        </div>
        <div>
          <h4>Manual</h4>
          <ul>
            <li><a href="why.html">Why Stilyagi</a></li>
            <li><a href="how.html">How it works</a></li>
            <li><a href="design.html">Design notes</a></li>
            <li><a href="roadmap.html">Roadmap</a></li>
          </ul>
        </div>
        <div>
          <h4>Documents</h4>
          <ul>
            <li><a href="docs.html#rules">Rules catalog</a></li>
            <li><a href="docs.html#config">Config schema</a></li>
            <li><a href="docs.html#suppressions">Suppressions</a></li>
            <li><a href="docs.html#adrs">ADRs &amp; RFCs</a></li>
          </ul>
        </div>
        <div>
          <h4>Verdicts</h4>
          <ul>
            <li><span className="verdict ink">Draft</span></li>
            <li><span className="verdict red">Not shipped</span></li>
            <li><span className="verdict sage">Offline</span></li>
            <li><span className="verdict ochre">Preview · MDX</span></li>
          </ul>
        </div>
      </div>
      <div className="colophon-strip">
        <span>№ 001 · April 26 · Printed in ink &amp; press-red</span>
        <span>☞ An agitprop object · no user-tracking</span>
        <span>Made for the red pencil</span>
      </div>
    </footer>
  );
}

// ---------- Tweaks panel -------------------------------------------
// Respects host __activate_edit_mode / __deactivate_edit_mode protocol,
// plus persists choice in localStorage so it survives navigation.
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "grid": "default",
  "density": "default",
  "stamp": "Draft"
}/*EDITMODE-END*/;

function useTweaks() {
  const stored = (() => {
    try { return JSON.parse(localStorage.getItem("stilyagi.tweaks") || "null"); }
    catch { return null; }
  })();
  const [t, set] = useState(stored || TWEAK_DEFAULTS);
  useEffect(() => {
    localStorage.setItem("stilyagi.tweaks", JSON.stringify(t));
    document.body.classList.remove("grid-off","grid-faint","density-compact","density-roomy");
    if (t.grid === "off")   document.body.classList.add("grid-off");
    if (t.grid === "faint") document.body.classList.add("grid-faint");
    if (t.density === "compact") document.body.classList.add("density-compact");
    if (t.density === "roomy")   document.body.classList.add("density-roomy");
    // broadcast for other components (hero stamp text)
    window.__stilyagiTweaks = t;
    window.dispatchEvent(new CustomEvent("stilyagi:tweaks", { detail: t }));
    // Also tell the host to persist the JSON edit block
    try {
      window.parent.postMessage({ type: "__edit_mode_set_keys", edits: t }, "*");
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
    try { window.parent.postMessage({ type: "__edit_mode_available" }, "*"); } catch {}
    return () => window.removeEventListener("message", onMsg);
  }, []);

  const Seg = ({ label, k, opts }) => (
    <div>
      <label>{label}</label>
      <div className="seg">
        {opts.map((o) => (
          <button key={o.value}
                  className={t[k] === o.value ? "on" : ""}
                  onClick={() => set({ ...t, [k]: o.value })}>
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <aside className={`tweaks-dock ${open ? "open" : ""}`} aria-hidden={!open}>
      <header>
        <span>Tweaks <span className="accent">· № 001</span></span>
        <button onClick={() => setOpen(false)} aria-label="Close">×</button>
      </header>
      <div className="body">
        <Seg label="Grid ruling" k="grid" opts={[
          { value: "default", label: "Ruled" },
          { value: "faint",   label: "Faint" },
          { value: "off",     label: "Plain" },
        ]} />
        <Seg label="Density" k="density" opts={[
          { value: "compact", label: "Compact" },
          { value: "default", label: "Normal" },
          { value: "roomy",   label: "Roomy" },
        ]} />
        <Seg label="Hero verdict stamp" k="stamp" opts={[
          { value: "Draft",        label: "Draft" },
          { value: "Grounded",     label: "Grounded" },
          { value: "Not shipped",  label: "Not shipped" },
        ]} />
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
            <div style={{marginTop: 18}}>
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
const Footer = () => (<React.Fragment><Colophon /><TweaksDock /></React.Fragment>);

Object.assign(window, { SiteMast, Colophon, TweaksDock, useTweaks, TWEAK_DEFAULTS, Nav, Footer, PageHero });
