/* global React, Phone, TabBar, PhoneHeader, LeitnerBox, SkImg, Segmented */
// FINAL SCREENS — chosen + refined variants
const { useState } = React;

// ============================================================
// 01 Home — "Stats-first" with VERTICAL Leitner boxes
// ============================================================
function HomeFinal() {
  const boxes = [
    {n:1, c:12, interval:'täglich',   h:true},
    {n:2, c:28, interval:'alle 2 Tage'},
    {n:3, c:41, interval:'alle 4 Tage'},
    {n:4, c:67, interval:'wöchentlich'},
    {n:5, c:39, interval:'monatlich'},
  ];
  return (
    <Phone>
      <div className="phone-content">
        <PhoneHeader title="안녕, Max!" ko="오늘도 화이팅 ✊" right={<div className="sk-chip">🔥 12</div>}/>

        {/* Hero */}
        <div className="sk-card" style={{padding:14, marginBottom:12, background:'var(--accent-soft)'}}>
          <div className="sk-label">Heute fällig</div>
          <div style={{display:'flex', alignItems:'baseline', gap:8, margin:'4px 0 10px'}}>
            <span style={{fontFamily:'var(--hand-title)', fontSize:52, fontWeight:700, lineHeight:1}}>24</span>
            <span className="sk-sub">Karten · ca. 8 min</span>
          </div>
          <button className="sk-btn primary full">▶  Jetzt üben</button>
        </div>

        {/* Stats row */}
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:12}}>
          <div className="sk-card flat" style={{padding:10}}>
            <div className="sk-label">Streak</div>
            <div style={{fontFamily:'var(--hand-title)', fontSize:26, fontWeight:700}}>12 Tage</div>
          </div>
          <div className="sk-card flat" style={{padding:10}}>
            <div className="sk-label">Gelernt</div>
            <div style={{fontFamily:'var(--hand-title)', fontSize:26, fontWeight:700}}>187 <span style={{fontSize:14, color:'var(--muted)'}}>Wörter</span></div>
          </div>
        </div>

        {/* VERTICAL Leitner boxes */}
        <div className="sk-label" style={{marginBottom:6}}>Leitner-Boxen</div>
        <div style={{display:'flex', flexDirection:'column', gap:6}}>
          {boxes.map(b => (
            <div key={b.n} className="sk-card flat" style={{
              padding:'8px 10px', display:'flex', alignItems:'center', gap:10,
              background: b.h ? 'var(--accent-soft)' : 'var(--paper)',
            }}>
              <div style={{
                width:28, height:28, border:'1.5px solid var(--ink)', borderRadius:7,
                display:'flex', alignItems:'center', justifyContent:'center',
                fontFamily:'var(--hand-title)', fontWeight:700, fontSize:16,
                background: b.h ? 'var(--accent)' : 'var(--paper)',
                flexShrink:0,
              }}>{b.n}</div>
              <div style={{flex:1, minWidth:0}}>
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline'}}>
                  <span style={{fontFamily:'var(--hand)', fontWeight:700, fontSize:13}}>Box {b.n}</span>
                  <span style={{fontFamily:'var(--mono)', fontSize:10, color:'var(--muted)'}}>{b.c} Karten</span>
                </div>
                <div className="sk-bar accent" style={{marginTop:3}}>
                  <span style={{width:`${Math.min(100,(b.c/80)*100)}%`}}/>
                </div>
              </div>
              <span style={{fontFamily:'var(--hand)', fontSize:11, color:'var(--muted)', whiteSpace:'nowrap', flexShrink:0}}>
                {b.interval}
              </span>
            </div>
          ))}
        </div>

        <div style={{marginTop:'auto', paddingBottom:90}}/>
      </div>
      <TabBar active="home"/>
    </Phone>
  );
}

// ============================================================
// 02 Vokabeln — Donut + Heatmap + 5-Box-Stapel (no "Meine Stapel")
// ============================================================
function UebersichtFinal() {
  const cells = Array.from({length:35}, (_,i)=>Math.floor(Math.random()*4));
  return (
    <Phone>
      <div className="phone-content">
        <PhoneHeader title="Vokabeln" ko="단어" right={<span className="sk-chip filled">+ Neu</span>}/>

        {/* Donut summary */}
        <div className="sk-card" style={{padding:10, marginBottom:10, display:'flex', gap:10, alignItems:'center'}}>
          <svg width="72" height="72" viewBox="0 0 72 72">
            <circle cx="36" cy="36" r="28" fill="none" stroke="var(--paper-2)" strokeWidth="8"/>
            <circle cx="36" cy="36" r="28" fill="none" stroke="var(--ink)" strokeWidth="8"
              strokeDasharray="176" strokeDashoffset="32" transform="rotate(-90 36 36)" strokeLinecap="round"/>
            <text x="36" y="34" textAnchor="middle" fontFamily="var(--hand-title)" fontSize="16" fontWeight="700">82%</text>
            <text x="36" y="46" textAnchor="middle" fontFamily="var(--mono)" fontSize="7" fill="var(--muted)">GENAU</text>
          </svg>
          <div style={{flex:1}}>
            <div style={{fontFamily:'var(--hand-title)', fontSize:22, fontWeight:700}}>187 Karten</div>
            <div className="sk-sub" style={{marginBottom:4}}>in 5 Boxen · 24 heute fällig</div>
            <div style={{display:'flex', gap:3}}>
              {[12,28,41,67,39].map((c,i)=>(
                <div key={i} style={{
                  flex:c, height:6, background: i===0?'var(--accent)':'var(--ink)',
                  opacity: i===0?1: 0.15 + i*0.2, borderRadius:2,
                }} title={`Box ${i+1}: ${c}`}/>
              ))}
            </div>
          </div>
        </div>

        {/* 5-Box-System (from V2) */}
        <div className="sk-card" style={{padding:10, marginBottom:10}}>
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:8}}>
            <span className="sk-h2">5-Box-System</span>
            <span className="sk-sub">187 Karten</span>
          </div>
          <div style={{display:'flex', alignItems:'flex-end', gap:8, height:90, padding:'0 4px'}}>
            {[{n:1,c:12,h:20},{n:2,c:28,h:40},{n:3,c:41,h:55},{n:4,c:67,h:78},{n:5,c:39,h:48}].map(b=>(
              <div key={b.n} style={{flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:3}}>
                <span style={{fontFamily:'var(--mono)', fontSize:10, color:'var(--muted)'}}>{b.c}</span>
                <div style={{
                  width:'100%', height:b.h,
                  border:'1.5px solid var(--ink)',
                  borderRadius:'6px 6px 2px 2px',
                  background: b.n===1?'var(--accent)':'var(--paper-2)',
                  boxShadow:'1.5px 2px 0 var(--ink)',
                }}/>
                <span style={{fontFamily:'var(--hand)', fontWeight:700, fontSize:11}}>{b.n}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Heatmap */}
        <div className="sk-card" style={{padding:10, marginBottom:10}}>
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:6}}>
            <span className="sk-h2">Aktivität</span>
            <span className="sk-sub">5 Wochen</span>
          </div>
          <div style={{display:'grid', gridTemplateColumns:'repeat(7, 1fr)', gap:3}}>
            {cells.map((v,i)=>(
              <div key={i} style={{
                aspectRatio:'1', borderRadius:3,
                border:'1px solid var(--ink)',
                background: v===0?'var(--paper)':v===1?'var(--paper-2)':v===2?'var(--muted-2)':'var(--ink)',
              }}/>
            ))}
          </div>
          <div style={{display:'flex', justifyContent:'flex-end', gap:4, marginTop:4, fontFamily:'var(--mono)', fontSize:9, color:'var(--muted)', alignItems:'center'}}>
            weniger <span style={{width:8,height:8,border:'1px solid var(--ink)', background:'var(--paper)'}}/>
            <span style={{width:8,height:8,border:'1px solid var(--ink)', background:'var(--paper-2)'}}/>
            <span style={{width:8,height:8,border:'1px solid var(--ink)', background:'var(--muted-2)'}}/>
            <span style={{width:8,height:8,border:'1px solid var(--ink)', background:'var(--ink)'}}/> mehr
          </div>
        </div>

        <div style={{marginTop:'auto', paddingBottom:90}}/>
      </div>
      <TabBar active="vokabeln"/>
    </Phone>
  );
}

// ============================================================
// 03 Abfrage — Stapel-Variante, Vorderseite
// ============================================================
function AbfrageFrontFinal() {
  return (
    <Phone>
      <div className="phone-content">
        <div style={{display:'flex', alignItems:'center', gap:10, marginBottom:12}}>
          <span className="sk-chip">Box 2</span>
          <div style={{flex:1}}/>
          <span style={{fontFamily:'var(--mono)', fontSize:11, color:'var(--muted)'}}>8 / 24</span>
        </div>

        <div style={{position:'relative', flex:1, display:'flex', alignItems:'center', justifyContent:'center'}}>
          <div className="sk-card" style={{position:'absolute', inset:'40px 30px', opacity:0.4, transform:'scale(0.92) rotate(-1.5deg)', height:'auto'}}/>
          <div className="sk-card" style={{position:'absolute', inset:'20px 15px', opacity:0.7, transform:'scale(0.96) rotate(1deg)', height:'auto'}}/>

          <div className="sk-card" style={{
            position:'relative', width:'100%', padding:14,
            transform:'rotate(-3deg) translateX(-18px)',
            boxShadow:'3px 4px 0 var(--ink)',
          }}>
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

// ============================================================
// 03b Abfrage — Stapel-Variante, RÜCKSEITE mit Beispielsatz
// ============================================================
function AbfrageBackFinal() {
  return (
    <Phone>
      <div className="phone-content">
        <div style={{display:'flex', alignItems:'center', gap:10, marginBottom:12}}>
          <span className="sk-chip">Box 2</span>
          <div style={{flex:1}}/>
          <span style={{fontFamily:'var(--mono)', fontSize:11, color:'var(--muted)'}}>8 / 24</span>
        </div>

        <div style={{position:'relative', flex:1, display:'flex', alignItems:'center', justifyContent:'center'}}>
          <div className="sk-card" style={{position:'absolute', inset:'40px 30px', opacity:0.4, transform:'scale(0.92) rotate(-1.5deg)', height:'auto'}}/>
          <div className="sk-card" style={{position:'absolute', inset:'20px 15px', opacity:0.7, transform:'scale(0.96) rotate(1deg)', height:'auto'}}/>

          {/* Flipped card: Korean + translation + example */}
          <div className="sk-card" style={{
            position:'relative', width:'100%', padding:14,
            transform:'rotate(-3deg) translateX(-18px)',
            boxShadow:'3px 4px 0 var(--ink)',
            background:'var(--paper-2)',
          }}>
            <div className="sk-label">Lösung</div>

            {/* Korean word */}
            <div style={{textAlign:'center', marginTop:4}}>
              <div className="ko" style={{fontSize:42, fontWeight:700, lineHeight:1.1}}>책</div>
              <div className="sk-sub ko" style={{marginTop:2}}>chaek</div>
            </div>

            <hr className="sk-div"/>

            {/* Translation */}
            <div className="sk-label">Übersetzung</div>
            <div style={{fontFamily:'var(--hand)', fontWeight:700, fontSize:18, marginBottom:8}}>Buch</div>

            {/* Example sentence */}
            <div className="sk-label">Beispielsatz</div>
            <div className="ko" style={{fontSize:14, fontWeight:500, marginTop:2}}>
              나는 <u>책</u>을 읽어요.
            </div>
            <div className="sk-sub" style={{fontSize:12, marginTop:2, fontFamily:'var(--hand)', color:'var(--ink)'}}>
              „Ich lese ein <u>Buch</u>.“
            </div>

            <div style={{display:'flex', gap:6, marginTop:10, justifyContent:'center'}}>
              <button className="sk-chip">🔊 Audio</button>
              <button className="sk-chip">↻ Flip</button>
            </div>
          </div>
        </div>

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

// ============================================================
// 04 Neu — Langes Formular, +Beispielsatz, -Stapel, ✓ statt "Speichern"
// ============================================================
function NeuFinal() {
  return (
    <Phone>
      <div className="phone-content">
        <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10}}>
          <span className="sk-chip">✕</span>
          <span style={{fontFamily:'var(--hand-title)', fontSize:22, fontWeight:700}}>Neue Vokabel</span>
          <span className="sk-chip filled" style={{
            width:32, height:32, padding:0, display:'flex', alignItems:'center',
            justifyContent:'center', fontSize:16,
          }}>✓</span>
        </div>

        <div className="sk-label" style={{marginBottom:4}}>Bild</div>
        <SkImg h={110} label="+ Bild wählen"/>

        <div style={{marginTop:10}}>
          <div className="sk-label" style={{marginBottom:4}}>Wort (Koreanisch)</div>
          <input className="sk-input ko" style={{width:'100%', fontSize:20}} defaultValue="사과"/>
        </div>

        <div style={{marginTop:8}}>
          <div className="sk-label" style={{marginBottom:4}}>Definition</div>
          <input className="sk-input" style={{width:'100%'}} defaultValue="Apfel (Frucht)"/>
        </div>

        <div style={{marginTop:8}}>
          <div className="sk-label" style={{marginBottom:4}}>Beispielsatz</div>
          <textarea className="sk-input ko" style={{width:'100%', minHeight:50, resize:'none', fontSize:14}} defaultValue="나는 사과를 먹어요."/>
        </div>

        <div style={{marginTop:8}}>
          <div className="sk-label" style={{marginBottom:4}}>Hinweis (optional)</div>
          <textarea className="sk-input dashed" style={{width:'100%', minHeight:46, resize:'none'}} placeholder="z.B. rote Frucht, Buchstabe ㅅ..."/>
        </div>

        <div style={{marginTop:'auto', paddingBottom:90}}/>
      </div>
      <TabBar active="vokabeln"/>
    </Phone>
  );
}

// ============================================================
// 05 Katalog — List with progress (V2) AND Drill-in (V3) unchanged
// ============================================================
function KatalogListFinal() {
  const themes = [
    {t:'Essen & Trinken', ko:'음식', n:124, p:38, e:'🍜'},
    {t:'Reisen',          ko:'여행', n:87,  p:12, e:'✈️'},
    {t:'Familie',         ko:'가족', n:45,  p:67, e:'👨‍👩‍👧'},
    {t:'Arbeit',          ko:'일',   n:96,  p:0,  e:'💼'},
    {t:'Natur',           ko:'자연', n:63,  p:8,  e:'🌿'},
  ];
  return (
    <Phone>
      <div className="phone-content">
        <PhoneHeader title="Katalog" ko="테마별 단어"/>
        <div className="sk-input dashed" style={{display:'flex', alignItems:'center', gap:6, marginBottom:10}}>
          <span>🔍</span> <span style={{color:'var(--muted)'}}>Thema oder Wort suchen...</span>
        </div>
        <div style={{display:'flex', flexDirection:'column', gap:6}}>
          {themes.map(th=>(
            <div key={th.t} className="sk-card flat" style={{padding:10, display:'flex', alignItems:'center', gap:10}}>
              <div style={{
                width:44, height:44, border:'1.5px solid var(--ink)', borderRadius:10,
                display:'flex', alignItems:'center', justifyContent:'center', fontSize:22,
                background:'var(--paper-2)',
              }}>{th.e}</div>
              <div style={{flex:1, minWidth:0}}>
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline'}}>
                  <div style={{fontFamily:'var(--hand-title)', fontSize:18, fontWeight:700}}>{th.t}</div>
                  <div style={{fontFamily:'var(--mono)', fontSize:10, color:'var(--muted)'}}>{Math.round(th.p*th.n/100)}/{th.n}</div>
                </div>
                <div className="sk-bar accent" style={{marginTop:4}}><span style={{width:`${th.p}%`}}/></div>
                <div className="ko" style={{fontSize:10, color:'var(--muted)', marginTop:2}}>{th.ko}</div>
              </div>
              <span style={{fontFamily:'var(--hand-title)', fontSize:22}}>›</span>
            </div>
          ))}
        </div>
        <div style={{marginTop:'auto', paddingBottom:90}}/>
      </div>
      <TabBar active="vokabeln"/>
    </Phone>
  );
}

function KatalogDrillFinal() {
  const words = [
    {ko:'사과',  de:'Apfel',     add:true},
    {ko:'물',    de:'Wasser',    add:true},
    {ko:'밥',    de:'Reis',      add:false},
    {ko:'김치',  de:'Kimchi',    add:true},
    {ko:'국수',  de:'Nudeln',    add:false},
    {ko:'빵',    de:'Brot',      add:false},
    {ko:'고기',  de:'Fleisch',   add:false},
    {ko:'차',    de:'Tee',       add:true},
  ];
  return (
    <Phone>
      <div className="phone-content">
        <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10}}>
          <span className="sk-chip">← Katalog</span>
          <span className="sk-chip">🔍</span>
        </div>
        <div style={{display:'flex', alignItems:'center', gap:10, marginBottom:8}}>
          <div style={{fontSize:38}}>🍜</div>
          <div>
            <div style={{fontFamily:'var(--hand-title)', fontSize:28, fontWeight:700, lineHeight:1}}>Essen & Trinken</div>
            <div className="ko" style={{fontSize:13, color:'var(--muted)'}}>음식 · 124 Wörter</div>
          </div>
        </div>
        <div style={{display:'flex', gap:5, marginBottom:10, flexWrap:'wrap'}}>
          <span className="sk-chip filled">Alle</span>
          <span className="sk-chip">Anfänger</span>
          <span className="sk-chip">Mittel</span>
          <span className="sk-chip">Fortg.</span>
        </div>
        <div style={{display:'flex', flexDirection:'column', gap:4, overflow:'hidden', flex:1}}>
          {words.map((w,i)=>(
            <div key={i} className="sk-card flat" style={{
              padding:'7px 10px', display:'flex', alignItems:'center', gap:8,
              background: w.add?'var(--accent-soft)':'var(--paper)',
            }}>
              <div style={{
                width:20, height:20, border:'1.5px solid var(--ink)', borderRadius:5,
                display:'flex', alignItems:'center', justifyContent:'center',
                background: w.add?'var(--ink)':'transparent', color:'var(--paper)',
                fontSize:11, fontWeight:700,
              }}>{w.add?'✓':''}</div>
              <span className="ko" style={{fontSize:16, fontWeight:700, minWidth:50}}>{w.ko}</span>
              <span style={{fontFamily:'var(--hand)', fontSize:13, flex:1}}>{w.de}</span>
              <span className="sk-label">Box 0</span>
            </div>
          ))}
        </div>
        <div style={{position:'absolute', left:10, right:10, bottom:78,
          border:'1.5px solid var(--ink)', borderRadius:14, background:'var(--ink)',
          color:'var(--paper)', padding:'10px 14px',
          display:'flex', justifyContent:'space-between', alignItems:'center',
          boxShadow:'1px 2px 0 var(--ink)',
        }}>
          <span style={{fontFamily:'var(--hand)', fontWeight:700, fontSize:14}}>4 ausgewählt</span>
          <span style={{fontFamily:'var(--hand-title)', fontSize:18, fontWeight:700}}>Hinzufügen →</span>
        </div>
      </div>
      <TabBar active="vokabeln"/>
    </Phone>
  );
}

// ============================================================
// 02b Box-Inhalt — Drill-in in eine Leitner-Box mit Remove-Option
// ============================================================
function BoxContentFinal() {
  const words = [
    {ko:'사과',  de:'Apfel',      due:'heute'},
    {ko:'물',    de:'Wasser',     due:'heute'},
    {ko:'밥',    de:'Reis',       due:'morgen'},
    {ko:'책',    de:'Buch',       due:'heute'},
    {ko:'집',    de:'Haus',       due:'in 2 T'},
    {ko:'학교',  de:'Schule',     due:'heute'},
    {ko:'사랑',  de:'Liebe',      due:'morgen'},
    {ko:'친구',  de:'Freund',     due:'in 2 T'},
  ];
  return (
    <Phone>
      <div className="phone-content">
        <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10}}>
          <span className="sk-chip">← Vokabeln</span>
          <span className="sk-chip">🔍</span>
        </div>

        {/* Header */}
        <div style={{display:'flex', alignItems:'center', gap:10, marginBottom:8}}>
          <div style={{
            width:48, height:48, border:'1.5px solid var(--ink)', borderRadius:10,
            display:'flex', alignItems:'center', justifyContent:'center',
            fontFamily:'var(--hand-title)', fontWeight:700, fontSize:26,
            background:'var(--accent)',
            boxShadow:'1.5px 2px 0 var(--ink)',
          }}>2</div>
          <div style={{flex:1}}>
            <div style={{fontFamily:'var(--hand-title)', fontSize:26, fontWeight:700, lineHeight:1}}>Box 2</div>
            <div className="sk-sub">28 Wörter · alle 2 Tage wiederholen</div>
          </div>
          <span className="sk-chip">⋯</span>
        </div>

        {/* Filter chips */}
        <div style={{display:'flex', gap:5, marginBottom:10, flexWrap:'wrap'}}>
          <span className="sk-chip filled">Alle</span>
          <span className="sk-chip">Heute fällig</span>
          <span className="sk-chip">Neu</span>
        </div>

        {/* Word list — swipe-to-delete hint on first item */}
        <div style={{display:'flex', flexDirection:'column', gap:4, overflow:'hidden', flex:1}}>
          {words.map((w,i)=>(
            <div key={i} style={{position:'relative'}}>
              {/* delete action revealed behind row */}
              {i === 0 && (
                <div style={{
                  position:'absolute', inset:0, borderRadius:14,
                  background:'var(--bad)', color:'var(--paper)',
                  display:'flex', alignItems:'center', justifyContent:'flex-end',
                  padding:'0 14px',
                  fontFamily:'var(--hand)', fontWeight:700, fontSize:13,
                }}>🗑 Entfernen</div>
              )}
              <div className="sk-card flat" style={{
                padding:'7px 10px', display:'flex', alignItems:'center', gap:8,
                position:'relative',
                transform: i === 0 ? 'translateX(-72px)' : 'none',
                transition:'transform 200ms',
              }}>
                <span className="ko" style={{fontSize:16, fontWeight:700, minWidth:54}}>{w.ko}</span>
                <span style={{fontFamily:'var(--hand)', fontSize:13, flex:1}}>{w.de}</span>
                <span style={{fontFamily:'var(--mono)', fontSize:9, color:'var(--muted)', textTransform:'uppercase', letterSpacing:'0.04em', minWidth:44, textAlign:'right'}}>
                  {w.due}
                </span>
                <button className="sk-chip" style={{
                  padding:'2px 8px', fontSize:12, marginLeft:4,
                  borderColor:'var(--bad)', color:'var(--bad)',
                }}>✕</button>
              </div>
            </div>
          ))}
        </div>

        {/* Hint under list */}
        <div style={{fontFamily:'var(--hand)', fontSize:11, color:'var(--muted)', textAlign:'center', margin:'8px 0 0'}}>
          Nach links wischen oder ✕ tippen zum Entfernen
        </div>

        {/* bottom action bar */}
        <div style={{position:'absolute', left:10, right:10, bottom:78,
          border:'1.5px solid var(--ink)', borderRadius:14, background:'var(--accent)',
          color:'var(--ink)', padding:'10px 14px',
          display:'flex', justifyContent:'space-between', alignItems:'center',
          boxShadow:'1px 2px 0 var(--ink)',
        }}>
          <span style={{fontFamily:'var(--hand)', fontWeight:700, fontSize:14}}>12 heute fällig</span>
          <span style={{fontFamily:'var(--hand-title)', fontSize:18, fontWeight:700}}>▶ Üben</span>
        </div>

      </div>
      <TabBar active="vokabeln"/>
    </Phone>
  );
}

Object.assign(window, {
  HomeFinal, UebersichtFinal,
  AbfrageFrontFinal, AbfrageBackFinal,
  NeuFinal, KatalogListFinal, KatalogDrillFinal,
  BoxContentFinal,
});
