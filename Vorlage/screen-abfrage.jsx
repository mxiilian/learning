/* global React, Phone, TabBar, SkImg */
// Vokabel-Abfrage — 3 variants (varies: flip + swipe interaction)
const { useState } = React;

// ── V1: Classic flip card + swipe left/right buttons ──────────
function AbfrageV1() {
  const [flipped, setFlipped] = useState(false);
  const [hint, setHint] = useState(false);
  return (
    <Phone>
      <div className="phone-content">
        {/* top bar */}
        <div style={{display:'flex', alignItems:'center', gap:10, marginBottom:10}}>
          <div style={{fontFamily:'var(--mono)', fontSize:11}}>✕</div>
          <div className="sk-bar" style={{flex:1}}><span style={{width:'35%'}}/></div>
          <div style={{fontFamily:'var(--mono)', fontSize:11, color:'var(--muted)'}}>8 / 24</div>
        </div>

        {/* Card */}
        <div onClick={()=>setFlipped(f=>!f)} style={{perspective:1000, flex:1, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer'}}>
          <div style={{
            width:'100%', height:360, position:'relative',
            transformStyle:'preserve-3d',
            transition:'transform 500ms',
            transform: flipped?'rotateY(180deg)':'none',
          }}>
            {/* Front */}
            <div className="sk-card" style={{
              position:'absolute', inset:0, backfaceVisibility:'hidden',
              display:'flex', flexDirection:'column', padding:14, gap:10,
            }}>
              <div className="sk-label">Bild</div>
              <SkImg h="100%" label="🍎  Apfel"/>
              {hint && (
                <div className="sk-card flat" style={{padding:8, background:'var(--accent-soft)'}}>
                  <div className="sk-label">Hinweis</div>
                  <div className="sk-sub" style={{color:'var(--ink)'}}>Frucht, rot oder grün, Buchstabe ㅅ am Anfang</div>
                </div>
              )}
              <button
                onClick={(e)=>{e.stopPropagation(); setHint(h=>!h);}}
                className="sk-btn" style={{alignSelf:'center'}}>
                💡 {hint?'Hinweis aus':'Hinweis zeigen'}
              </button>
            </div>
            {/* Back */}
            <div className="sk-card" style={{
              position:'absolute', inset:0, backfaceVisibility:'hidden',
              transform:'rotateY(180deg)',
              display:'flex', flexDirection:'column', padding:14, gap:8,
            }}>
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline'}}>
                <span className="ko" style={{fontSize:40, fontWeight:700}}>사과</span>
                <button className="sk-chip" onClick={e=>e.stopPropagation()}>🔊</button>
              </div>
              <div className="sk-sub ko">sa·gwa</div>
              <hr className="sk-div"/>
              <div className="sk-label">Definition</div>
              <div style={{fontFamily:'var(--hand)', fontSize:15}}>Apfel (Frucht)</div>
              <div className="sk-label" style={{marginTop:4}}>Hinweis</div>
              <div className="sk-sub" style={{color:'var(--ink)'}}>Klassische rote Frucht</div>
              <SkImg h={70} label="🍎"/>
            </div>
          </div>
        </div>

        {/* Swipe actions */}
        <div style={{display:'flex', gap:10, marginTop:10, marginBottom:80}}>
          <button className="sk-btn full" style={{background:'var(--bad)', color:'var(--paper)', flex:1}}>← Falsch</button>
          <button className="sk-btn full" style={{background:'var(--good)', color:'var(--paper)', flex:1}}>Richtig →</button>
        </div>
      </div>
      <TabBar active="vokabeln"/>
    </Phone>
  );
}

// ── V2: Tinder-style stack, swipe gesture implied with arrows/peek ──
function AbfrageV2() {
  return (
    <Phone>
      <div className="phone-content">
        {/* top bar */}
        <div style={{display:'flex', alignItems:'center', gap:10, marginBottom:12}}>
          <span className="sk-chip">Box 2</span>
          <div style={{flex:1}}/>
          <span style={{fontFamily:'var(--mono)', fontSize:11, color:'var(--muted)'}}>8 / 24</span>
        </div>

        {/* Stack */}
        <div style={{position:'relative', flex:1, display:'flex', alignItems:'center', justifyContent:'center'}}>
          {/* back card 2 */}
          <div className="sk-card" style={{position:'absolute', inset:'40px 30px', opacity:0.4, transform:'scale(0.92) rotate(-1.5deg)', height:'auto'}}/>
          {/* back card 1 */}
          <div className="sk-card" style={{position:'absolute', inset:'20px 15px', opacity:0.7, transform:'scale(0.96) rotate(1deg)', height:'auto'}}/>

          {/* top card — tilted slightly, showing swipe hint */}
          <div className="sk-card" style={{
            position:'relative', width:'100%', padding:14,
            transform:'rotate(-3deg) translateX(-18px)',
            boxShadow:'3px 4px 0 var(--ink)',
          }}>
            {/* LEFT badge appearing due to tilt */}
            <div style={{
              position:'absolute', top:14, right:14,
              border:'2px solid var(--bad)', color:'var(--bad)',
              fontFamily:'var(--hand-title)', fontWeight:700, fontSize:18,
              padding:'2px 8px', borderRadius:6, transform:'rotate(12deg)',
            }}>Nochmal</div>

            <div className="sk-label">Was ist das?</div>
            <SkImg h={200} label="📚  Buch" style={{marginTop:6}}/>
            <div style={{display:'flex', gap:6, marginTop:10}}>
              <button className="sk-chip">💡 Hinweis</button>
              <button className="sk-chip">🔊 Audio</button>
            </div>
            <div style={{marginTop:10, fontFamily:'var(--hand)', fontSize:12, color:'var(--muted)', textAlign:'center'}}>
              Tippen zum Umdrehen
            </div>
          </div>
        </div>

        {/* swipe hint */}
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', margin:'12px 4px 4px'}}>
          <div style={{display:'flex', flexDirection:'column', alignItems:'flex-start', gap:2}}>
            <div style={{fontFamily:'var(--hand-title)', fontSize:22, fontWeight:700, color:'var(--bad)'}}>← Falsch</div>
            <div className="sk-sub">zurück in Box 1</div>
          </div>
          <div className="sk-chip" style={{fontSize:18}}>↶</div>
          <div style={{display:'flex', flexDirection:'column', alignItems:'flex-end', gap:2}}>
            <div style={{fontFamily:'var(--hand-title)', fontSize:22, fontWeight:700, color:'var(--good)'}}>Richtig →</div>
            <div className="sk-sub">weiter zu Box 3</div>
          </div>
        </div>

        <div style={{marginTop:8, paddingBottom:80}}/>
      </div>
      <TabBar active="vokabeln"/>
    </Phone>
  );
}

// ── V3: Split view — image top, answer bottom, 4 difficulty buttons (Anki-style) ──
function AbfrageV3() {
  return (
    <Phone>
      <div className="phone-content no-pad">
        {/* top section with image */}
        <div style={{position:'relative', padding:'4px 18px 10px'}}>
          <div style={{display:'flex', alignItems:'center', gap:10, marginBottom:8}}>
            <span className="sk-chip">✕</span>
            <div className="sk-bar" style={{flex:1}}><span style={{width:'35%'}}/></div>
            <span style={{fontFamily:'var(--mono)', fontSize:11, color:'var(--muted)'}}>8/24</span>
          </div>
          <SkImg h={150} label="🐕  Hund"/>
          <div style={{display:'flex', gap:5, marginTop:8, justifyContent:'center'}}>
            <button className="sk-chip">💡 Hinweis</button>
            <button className="sk-chip">🔊 Audio</button>
          </div>
        </div>

        {/* answer panel — slides up when flipped */}
        <div className="sk-card" style={{
          margin:'0 10px', padding:12, flex:1,
          borderRadius:'16px 16px 0 0',
          background:'var(--paper-2)',
          borderBottom:'none',
        }}>
          <div style={{display:'flex', alignItems:'baseline', justifyContent:'space-between'}}>
            <span className="ko" style={{fontSize:36, fontWeight:700}}>개</span>
            <span className="sk-sub ko">gae</span>
          </div>
          <hr className="sk-div"/>
          <div className="sk-label">Definition</div>
          <div style={{fontFamily:'var(--hand)', fontSize:14, marginBottom:6}}>Hund (Haustier)</div>
          <div className="sk-label">Hinweis</div>
          <div className="sk-sub" style={{color:'var(--ink)'}}>Häufiges Haustier, bellt</div>

          <div className="sk-label" style={{marginTop:10}}>Wie gut wusstest du es?</div>
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr 1fr', gap:5, marginTop:4}}>
            {[
              {t:'Nochmal', s:'<1min', c:'var(--bad)'},
              {t:'Schwer',  s:'6min',  c:'var(--accent)'},
              {t:'Gut',     s:'1T',    c:'var(--good)'},
              {t:'Easy',    s:'4T',    c:'var(--ink)'},
            ].map(b=>(
              <div key={b.t} className="sk-card flat" style={{
                padding:'6px 2px', textAlign:'center',
                background:b.c, color:'var(--paper)', borderColor:'var(--ink)',
              }}>
                <div style={{fontFamily:'var(--hand)', fontWeight:700, fontSize:12}}>{b.t}</div>
                <div style={{fontFamily:'var(--mono)', fontSize:9, opacity:0.8}}>{b.s}</div>
              </div>
            ))}
          </div>
          <div style={{fontFamily:'var(--hand)', fontSize:11, color:'var(--muted)', textAlign:'center', marginTop:6}}>
            ← wischen für falsch  ·  wischen für richtig →
          </div>
        </div>

        <div style={{height:76}}/>
      </div>
      <TabBar active="vokabeln"/>
    </Phone>
  );
}

Object.assign(window, { AbfrageV1, AbfrageV2, AbfrageV3 });
