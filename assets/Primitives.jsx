// Primitive components for the Stilyagi docs site kit.
// Each component is a small, mainly-cosmetic recreation of the
// classes from the reference CSS.

const { useState } = React;

// ---------- Masthead / contents bar ----------
function Masthead({ onJump = () => {} }) {
  const links = [
    ["Manifesto", "manifesto"],
    ["Principles", "principles"],
    ["Palette", "palette"],
    ["Type", "type"],
    ["Motifs", "motifs"],
    ["Components", "components"],
  ];
  return (
    <nav className="contents">
      <div className="contents-inner">
        <span className="mark">
          Stilyagi · <span className="r">Design Language</span>
        </span>
        <ol>
          {links.map(([label, id]) => (
            <li key={id}>
              <a
                href={`#${id}`}
                onClick={(e) => {
                  e.preventDefault();
                  onJump(id);
                }}
              >
                {label}
              </a>
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
}

// ---------- Cover ----------
function Cover() {
  return (
    <section id="manifesto" className="cover relative">
      <div className="splatter" aria-hidden="true" />
      <div className="swash" aria-hidden="true" />
      <span className="eyebrow">df12 · Design System · v0.1</span>
      <h1>
        The <span className="accent">Stilyagi</span> Design Language
      </h1>
      <p className="subtitle editorial">
        Agitprop rigour. Jazz-age swagger. University-press authority. A
        rebellion conducted in grid-ruled margins, under a red pencil.
      </p>
      <div className="colophon">
        <span>No. 001</span>
        <span>Edinburgh</span>
        <span>Oxford spelling</span>
      </div>
    </section>
  );
}

// ---------- Chapter wrapper ----------
function Chapter({ id, label, title, children }) {
  return (
    <section id={id} className="chapter">
      <span className="chapter-label">{label}</span>
      <h2>{title}</h2>
      {children}
    </section>
  );
}

// ---------- Panel ----------
function Panel({
  label,
  heavy = false,
  red = false,
  children,
  shade = false,
  style,
}) {
  const cls = ["panel", heavy && "heavy", red && "red"]
    .filter(Boolean)
    .join(" ");
  const s = shade ? { background: "var(--paper-shade)", ...style } : style;
  return (
    <div className={cls} style={s}>
      {label && <span className="panel-label">{label}</span>}
      {children}
    </div>
  );
}

// ---------- Agitprop block ----------
function Agitprop({ thesis, title, children }) {
  return (
    <div className="agitprop">
      {thesis && (
        <span className="chip red" style={{ background: "var(--press-red)" }}>
          {thesis}
        </span>
      )}
      {title && <h3 style={{ marginTop: 10 }}>{title}</h3>}
      <div className="editorial" style={{ color: "var(--paper)" }}>
        {children}
      </div>
    </div>
  );
}

// ---------- Punchcard ----------
function Punchcard({ blocked = false, title, children }) {
  return (
    <div className={`punchcard ${blocked ? "blocked" : ""}`}>
      {title && <h4>{title}</h4>}
      <div className="editorial">{children}</div>
    </div>
  );
}

// ---------- Callout ----------
function Callout({ kind = "note", title, mark, children }) {
  const defaultMark = { note: "§", warning: "!", ok: "✓" }[kind] || "§";
  return (
    <div className={`callout ${kind}`}>
      <div className="callout-mark">{mark || defaultMark}</div>
      <div>
        {title && <h4>{title}</h4>}
        <div className="editorial">{children}</div>
      </div>
    </div>
  );
}

// ---------- Button ----------
function Button({ kind = "ink", children, ...rest }) {
  const cls = kind === "ink" ? "btn" : `btn ${kind}`;
  return (
    <button className={cls} {...rest}>
      {children}
    </button>
  );
}

// ---------- Chip ----------
function Chip({ kind = "", children }) {
  return <span className={`chip ${kind}`}>{children}</span>;
}

// ---------- Stamp ----------
function Stamp({ small = false, ink = false, children }) {
  const cls = ["stamp", small && "small", ink && "ink"]
    .filter(Boolean)
    .join(" ");
  return <span className={cls}>{children}</span>;
}

// ---------- Pullquote ----------
function Pullquote({ cite, children }) {
  return (
    <div className="pullquote">
      {children}
      {cite && <cite>{cite}</cite>}
    </div>
  );
}

// ---------- Manicule list ----------
function ManiculeList({ color = "", items }) {
  return (
    <ul className={`manicule-list ${color}`}>
      {items.map((it, i) => (
        <li key={i}>{it}</li>
      ))}
    </ul>
  );
}

// ---------- Scholar table ----------
function ScholarTable({ caption, columns, rows }) {
  return (
    <table className="scholar">
      {caption && <caption>{caption}</caption>}
      <thead>
        <tr>
          {columns.map((c) => (
            <th key={c}>{c}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i}>
            {row.map((cell, j) => (
              <td key={j}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// ---------- Code block (pre-tokenized children) ----------
function Code({ children }) {
  return <pre className="code">{children}</pre>;
}

// ---------- Field ----------
function Field({ label, help, children }) {
  return (
    <div className="field">
      {label && <label>{label}</label>}
      {children}
      {help && <span className="help">{help}</span>}
    </div>
  );
}

// ---------- Hazard frame ----------
function HazardFrame({ children, height = 160 }) {
  return (
    <div
      className="relative"
      style={{
        height,
        border: "2px solid var(--ink)",
        background: "var(--paper)",
      }}
    >
      <div className="hazard-corner tl" />
      <div className="hazard-corner tr" />
      <div className="hazard-corner bl" />
      <div className="hazard-corner br" />
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "grid",
          placeItems: "center",
          padding: 20,
          textAlign: "center",
        }}
      >
        {children}
      </div>
    </div>
  );
}

// Share on window so other scripts see these.
Object.assign(window, {
  Masthead,
  Cover,
  Chapter,
  Panel,
  Agitprop,
  Punchcard,
  Callout,
  Button,
  Chip,
  Stamp,
  Pullquote,
  ManiculeList,
  ScholarTable,
  Code,
  Field,
  HazardFrame,
});
