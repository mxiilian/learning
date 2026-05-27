/* global React, Phone, TabBar, Segmented, PhoneHeader, LeitnerBox, SkImg */
// Vokabel-Übersicht — 3 variants (varies: stats layout + box layout)

// V1: Horizontal box strip + stat tiles
function UebersichtV1() {
  return (
    <Phone>
      <div className="phone-content">
        <PhoneHeader title="Vokabeln" ko="단어장" right={<div className="sk-chip filled">+ Neu</div>}/>

        <div style={{marginBottom:10}}>
          <Segmented items={['Meine','Katalog','Stats']} active="Meine"/>
        </div>

        {/* Boxes */}
        <div className="sk-label" style={{marginBottom:6}}>Leitner-Boxen</div>
        <div style={{display:'flex', gap:5, marginBottom:12}}>
          {[{n:1,c:12,h:true},{n:2,c:28},{n:3,c:41},{n:4,c:67},{n:5,c:39}].map(b=>(
            <LeitnerBox key={b.n} n={b.n} count={b.c} total={80} highlight={b.h}/>
          ))}
        </div>

        {/* Stat tiles */}
        <div className="sk-label" style={{marginBottom:6}}>Statistik</div>
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:6, marginBottom:8}}>
          <div className="sk-card flat" style={{padding:8}}>
            <div className="sk-sub">Gesamt</div>
            <div style={{fontFamily:'var(--hand-title)', fontSize:22, fontWeight:700}}>187</div>
          </div>
          <div className="sk-card flat" style={{padding:8}}>
            <div className="sk-sub">Genauigkeit</div>
            <div style={{fontFamily:'var(--hand-title)', fontSize:22, fontWeight:700}}>82%</div>
          </div>
          <div className="sk-card flat" style={{padding:8}}>
            <div className="sk-sub">Heute</div>
            <div style={{fontFamily:'var(--hand-title)', fontSize:22, fontWeight:700}}>24</div>
          </div>
          <div className="sk-card flat" style={{padding:8}}>
            <div className="sk-sub">Streak</div>
            <div style={{fontFamily:'var(--hand-title)', fontSize:22, fontWeight:700}}>12 🔥</div>
          </div>
        </div>

        <button className="sk-btn primary full" style={{marginTop:4}}>Heute üben · 24</button>

        <div style={{marginTop:'auto', paddingBottom:90}}/>
      </div>
      <TabBar active="vokabeln"/>
    </Phone>
  );
}

// V2: Stacked boxes (Leitner visual) + line chart for accuracy
function UebersichtV2() {
  const days = [62,70,68,75,80,78,82,85,88,82,90,87,92];
  const max = Math.max(...days);
  return (
    <Phone>
      <div className="phone-content">
        <PhoneHeader title="Meine Vokabeln" ko="내 단어" right={<span className="sk-chip">+ Neu</span>}/>

        {/* Box stacks as visual */}
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

        {/* Line chart */}
        <div className="sk-card" style={{padding:10, marginBottom:10}}>
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:6}}>
            <span className="sk-h2">Genauigkeit</span>
            <span className="sk-sub">letzte 13 Tage</span>
          </div>
          <svg viewBox="0 0 260 70" style={{width:'100%', height:70}}>
            <polyline
              fill="none" stroke="var(--ink)" strokeWidth="1.8"
              strokeLinecap="round" strokeLinejoin="round"
              points={days.map((d,i)=>`${(i/(days.length-1))*255+2},${68 - (d/max)*58}`).join(' ')}
            />
            {days.map((d,i)=>(
              <circle key={i} cx={(i/(days.length-1))*255+2} cy={68-(d/max)*58} r="2" fill="var(--paper)" stroke="var(--ink)" strokeWidth="1.2"/>
            ))}
          </svg>
          <div style={{display:'flex', justifyContent:'space-between', fontFamily:'var(--mono)', fontSize:9, color:'var(--muted)', marginTop:2}}>
            <span>60%</span><span>Ø 82%</span><span>100%</span>
          </div>
        </div>

        {/* Mini tiles */}
        <div style={{display:'flex', gap:6, marginBottom:4}}>
          <div className="sk-chip">24 fällig</div>
          <div className="sk-chip">🔥 12 Tage</div>
          <div className="sk-chip accent">Üben →</div>
        </div>

        <div style={{marginTop:'auto', paddingBottom:90}}/>
      </div>
      <TabBar active="vokabeln"/>
    </Phone>
  );
}

// V3: List-of-decks + donut + heatmap
function UebersichtV3() {
  // build a 5x7 heatmap
  const cells = Array.from({length:35}, (_,i)=>Math.floor(Math.random()*4));
  return (
    <Phone>
      <div className="phone-content">
        <PhoneHeader title="Vokabeln" ko="단어"/>

        {/* Donut-style overall */}
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

        {/* Decks list */}
        <div className="sk-label" style={{marginBottom:4}}>Meine Stapel</div>
        <div style={{display:'flex', flexDirection:'column', gap:5}}>
          {[
            {n:'Alltag',    c:64, p:78},
            {n:'Essen',     c:30, p:47},
            {n:'Reisen',    c:22, p:12},
          ].map(d=>(
            <div key={d.n} className="sk-card flat" style={{padding:8, display:'flex', alignItems:'center', gap:8}}>
              <div style={{fontFamily:'var(--hand-title)', fontSize:16, fontWeight:700, flex:1}}>{d.n}</div>
              <div className="sk-bar" style={{flex:1, maxWidth:80}}><span style={{width:`${d.p}%`}}/></div>
              <div style={{fontFamily:'var(--mono)', fontSize:10, color:'var(--muted)', width:36, textAlign:'right'}}>{d.c}</div>
            </div>
          ))}
        </div>

        <div style={{marginTop:'auto', paddingBottom:90}}/>
      </div>
      <TabBar active="vokabeln"/>
    </Phone>
  );
}

Object.assign(window, { UebersichtV1, UebersichtV2, UebersichtV3 });
