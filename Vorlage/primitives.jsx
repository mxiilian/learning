/* global React */
// Shared sketchy primitives for 안녕 한국 wireframes.

const { useState } = React;

// ── Phone frame (iOS-ish, sketchy) ─────────────────────────────
function Phone({ children, time = '9:41', battery = 82 }) {
  return (
    <div className="phone">
      <div className="phone-screen">
        <div className="phone-status">
          <span>{time}</span>
          <span className="right">
            <svg width="14" height="10" viewBox="0 0 14 10"><path d="M1 7.5h2V9H1zM4 5.5h2V9H4zM7 3.5h2V9H7zM10 1.5h2V9h-2z" fill="currentColor"/></svg>
            <svg width="13" height="10" viewBox="0 0 13 10"><path d="M6.5 2.5c2 0 3.8 0.7 5.2 2L11 5.7c-1.2-1-2.8-1.7-4.5-1.7S3.2 4.7 2 5.7L1 4.5C2.2 3.2 4.5 2.5 6.5 2.5z M6.5 5.3c1.3 0 2.5 0.4 3.3 1.2L8.7 7.8C8.2 7.2 7.4 6.9 6.5 6.9s-1.7 0.3-2.2 0.9L3 6.5C3.8 5.7 5 5.3 6.5 5.3z M6.5 8.2a1 1 0 1 0 0 2 1 1 0 0 0 0-2z" fill="currentColor"/></svg>
            <span style={{border:'1px solid currentColor', borderRadius:2, padding:'1px 2px', display:'inline-flex', alignItems:'center', gap:1}}>
              <span style={{background:'currentColor', width:battery/8, height:5, display:'inline-block'}} />
            </span>
          </span>
        </div>
        {children}
      </div>
      <div className="phone-home" />
    </div>
  );
}

// ── Bottom tab bar ─────────────────────────────────────────────
function TabBar({ active = 'vokabeln' }) {
  const items = [
    { id: 'home',      label: 'Home',     icon: '◉' },
    { id: 'vokabeln',  label: 'Vokabeln', icon: '▣' },
    { id: 'grammatik', label: 'Grammatik',icon: '✎' },
    { id: 'profil',    label: 'Profil',   icon: '◔' },
  ];
  return (
    <div className="tabbar">
      {items.map(it => (
        <div key={it.id} className={`tabbar-item ${it.id===active?'active':''}`}>
          <div className="ico" style={{fontSize:15}}>{it.icon}</div>
          <div>{it.label}</div>
        </div>
      ))}
    </div>
  );
}

// ── Segmented ──────────────────────────────────────────────────
function Segmented({ items, active }) {
  return (
    <div className="segmented">
      {items.map(it => (
        <div key={it} className={`seg ${it===active?'active':''}`}>{it}</div>
      ))}
    </div>
  );
}

// ── Sketchy header inside phone ────────────────────────────────
function PhoneHeader({ title, ko, right }) {
  return (
    <div style={{display:'flex', alignItems:'baseline', justifyContent:'space-between', marginBottom:10, paddingTop:2}}>
      <div>
        <div style={{fontFamily:'var(--hand-title)', fontSize:24, fontWeight:700, lineHeight:1}}>{title}</div>
        {ko && <div className="ko" style={{fontSize:12, color:'var(--muted)', marginTop:2}}>{ko}</div>}
      </div>
      {right}
    </div>
  );
}

// ── Box token ──────────────────────────────────────────────────
function LeitnerBox({ n, count, total, highlight }) {
  const pct = total ? Math.min(100, (count/total)*100) : 0;
  return (
    <div className="sk-card" style={{
      padding:'8px 10px', display:'flex', flexDirection:'column', gap:4,
      background: highlight ? 'var(--accent-soft)' : 'var(--paper)',
      flex:1, minWidth:0,
    }}>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline'}}>
        <span style={{fontFamily:'var(--hand-title)', fontSize:18, fontWeight:700}}>Box {n}</span>
        <span style={{fontFamily:'var(--mono)', fontSize:10, color:'var(--muted)'}}>{count}</span>
      </div>
      <div className="sk-bar accent"><span style={{width:`${pct}%`}} /></div>
      <span style={{fontFamily:'var(--hand)', fontSize:10, color:'var(--muted)'}}>
        {n===1?'täglich':n===2?'alle 2 T':n===3?'alle 4 T':n===4?'wöchentl.':'monatl.'}
      </span>
    </div>
  );
}

// ── Placeholder image ──────────────────────────────────────────
function SkImg({ w = '100%', h = 80, label = 'Bild', style = {} }) {
  return (
    <div className="sk-img" style={{width:w, height:h, ...style}}>{label}</div>
  );
}

Object.assign(window, { Phone, TabBar, Segmented, PhoneHeader, LeitnerBox, SkImg });
