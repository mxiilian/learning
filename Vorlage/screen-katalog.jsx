/* global React, Phone, TabBar, PhoneHeader, SkImg, Segmented */
// Katalog (nach Themen) — 3 variants

// V1: Grid of themed tiles with big emoji + count
function KatalogV1() {
  const themes = [
    {t:'Essen & Trinken', ko:'음식', n:124, e:'🍜', active:true},
    {t:'Reisen',          ko:'여행', n:87,  e:'✈️'},
    {t:'Familie',         ko:'가족', n:45,  e:'👨‍👩‍👧'},
    {t:'Arbeit',          ko:'일',   n:96,  e:'💼'},
    {t:'Natur',           ko:'자연', n:63,  e:'🌿'},
    {t:'Körper',          ko:'몸',   n:52,  e:'🖐️'},
  ];
  return (
    <Phone>
      <div className="phone-content">
        <PhoneHeader title="Katalog" ko="카탈로그" right={<span className="sk-chip">🔍</span>}/>
        <div style={{marginBottom:10}}>
          <Segmented items={['Meine','Katalog','Stats']} active="Katalog"/>
        </div>
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:8}}>
          {themes.map(th=>(
            <div key={th.t} className="sk-card" style={{
              padding:10, display:'flex', flexDirection:'column', gap:6,
              background:th.active?'var(--accent-soft)':'var(--paper)',
              minHeight:110,
            }}>
              <div style={{fontSize:28, lineHeight:1}}>{th.e}</div>
              <div style={{
                fontFamily:'var(--hand-title)', fontSize:18, fontWeight:700,
                lineHeight:1.1, flex:1, overflow:'hidden',
                textOverflow:'ellipsis', whiteSpace:'nowrap',
              }}>{th.t}</div>
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline', gap:4, marginTop:'auto'}}>
                <span className="ko" style={{fontSize:11, color:'var(--muted)'}}>{th.ko}</span>
                <span style={{fontFamily:'var(--mono)', fontSize:10, color:'var(--muted)', whiteSpace:'nowrap'}}>{th.n} W.</span>
              </div>
            </div>
          ))}
        </div>
        <div style={{marginTop:'auto', paddingBottom:90}}/>
      </div>
      <TabBar active="vokabeln"/>
    </Phone>
  );
}

// V2: Vertical list with progress bars
function KatalogV2() {
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

// V3: Drill-in — a theme opened, showing its word list with add-checkboxes
function KatalogV3() {
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

        {/* Header */}
        <div style={{display:'flex', alignItems:'center', gap:10, marginBottom:8}}>
          <div style={{fontSize:38}}>🍜</div>
          <div>
            <div style={{fontFamily:'var(--hand-title)', fontSize:28, fontWeight:700, lineHeight:1}}>Essen & Trinken</div>
            <div className="ko" style={{fontSize:13, color:'var(--muted)'}}>음식 · 124 Wörter</div>
          </div>
        </div>

        {/* Filter chips */}
        <div style={{display:'flex', gap:5, marginBottom:10, flexWrap:'wrap'}}>
          <span className="sk-chip filled">Alle</span>
          <span className="sk-chip">Anfänger</span>
          <span className="sk-chip">Mittel</span>
          <span className="sk-chip">Fortg.</span>
        </div>

        {/* Word list */}
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

        {/* bottom add bar */}
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

Object.assign(window, { KatalogV1, KatalogV2, KatalogV3 });
