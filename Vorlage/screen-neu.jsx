/* global React, Phone, TabBar, PhoneHeader, SkImg */
// Neue Vokabel anlegen — 3 variants (varies: form layout)
const { useState } = React;

// V1: Classic vertical form, all fields visible
function NeuV1() {
  return (
    <Phone>
      <div className="phone-content">
        <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10}}>
          <span className="sk-chip">✕</span>
          <span style={{fontFamily:'var(--hand-title)', fontSize:22, fontWeight:700}}>Neue Vokabel</span>
          <span className="sk-chip filled">Speichern</span>
        </div>

        {/* Image picker */}
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
          <div className="sk-label" style={{marginBottom:4}}>Hinweis (optional)</div>
          <textarea className="sk-input dashed" style={{width:'100%', minHeight:46, resize:'none'}} placeholder="z.B. rote Frucht, Buchstabe ㅅ..."/>
        </div>

        <div style={{marginTop:8}}>
          <div className="sk-label" style={{marginBottom:4}}>Stapel</div>
          <div style={{display:'flex', gap:5, flexWrap:'wrap'}}>
            <span className="sk-chip filled">Essen</span>
            <span className="sk-chip">Alltag</span>
            <span className="sk-chip">Reisen</span>
            <span className="sk-chip" style={{borderStyle:'dashed'}}>+ Neu</span>
          </div>
        </div>

        <div style={{marginTop:'auto', paddingBottom:90}}/>
      </div>
      <TabBar active="vokabeln"/>
    </Phone>
  );
}

// V2: Stepper — step 1 of 3 (image first)
function NeuV2() {
  return (
    <Phone>
      <div className="phone-content">
        <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:4}}>
          <span className="sk-chip">← Zurück</span>
          <span style={{fontFamily:'var(--mono)', fontSize:11, color:'var(--muted)'}}>SCHRITT 2 / 3</span>
          <span className="sk-chip" style={{opacity:0.4}}>Weiter</span>
        </div>
        <div style={{display:'flex', gap:4, marginBottom:14}}>
          <div style={{flex:1, height:4, background:'var(--ink)', borderRadius:2}}/>
          <div style={{flex:1, height:4, background:'var(--ink)', borderRadius:2}}/>
          <div style={{flex:1, height:4, background:'var(--paper-2)', border:'1px solid var(--ink)', borderRadius:2}}/>
        </div>

        <div style={{fontFamily:'var(--hand-title)', fontSize:30, fontWeight:700, lineHeight:1.1, marginBottom:4}}>
          Was bedeutet<br/>das Wort?
        </div>
        <div className="sk-sub" style={{marginBottom:12}}>Definition und optional ein Hinweis</div>

        {/* Preview card of what's been set */}
        <div className="sk-card flat" style={{padding:8, marginBottom:12, display:'flex', gap:8, alignItems:'center'}}>
          <SkImg w={50} h={50} label="img"/>
          <div>
            <div className="ko" style={{fontSize:18, fontWeight:700}}>사과</div>
            <div className="sk-sub">aus Schritt 1</div>
          </div>
        </div>

        <div className="sk-label" style={{marginBottom:4}}>Definition</div>
        <input className="sk-input" style={{width:'100%', marginBottom:10}} defaultValue="Apfel (Frucht)"/>

        <div className="sk-label" style={{marginBottom:4}}>Hinweis</div>
        <textarea className="sk-input dashed" style={{width:'100%', minHeight:70, resize:'none'}} placeholder="Eselsbrücke, Beispielsatz, ..."/>

        <button className="sk-btn primary full" style={{marginTop:12}}>Weiter →</button>

        <div style={{marginTop:'auto', paddingBottom:90}}/>
      </div>
      <TabBar active="vokabeln"/>
    </Phone>
  );
}

// V3: Card-style WYSIWYG — editing looks like the final card
function NeuV3() {
  return (
    <Phone>
      <div className="phone-content">
        <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10}}>
          <span className="sk-chip">Abbrechen</span>
          <span style={{fontFamily:'var(--hand-title)', fontSize:20, fontWeight:700}}>Karte</span>
          <span className="sk-chip filled">✓</span>
        </div>

        {/* WYSIWYG card */}
        <div className="sk-card" style={{padding:12, marginBottom:10, boxShadow:'2px 3px 0 var(--ink)'}}>
          <div className="sk-label" style={{marginBottom:4}}>Vorderseite</div>
          <SkImg h={120} label="Tippen für Bild"/>
          <div className="sk-input dashed" style={{marginTop:8, fontFamily:'var(--hand)', fontSize:12, color:'var(--muted)', textAlign:'center'}}>
            + Hinweis hinzufügen
          </div>
        </div>

        <div style={{textAlign:'center', fontFamily:'var(--hand-title)', fontSize:20, margin:'4px 0 6px'}}>↓ flip ↓</div>

        <div className="sk-card" style={{padding:12, marginBottom:10, background:'var(--paper-2)'}}>
          <div className="sk-label" style={{marginBottom:4}}>Rückseite</div>
          <input className="sk-input ko" style={{width:'100%', fontSize:22, fontWeight:700, textAlign:'center', marginBottom:6}} defaultValue="사과"/>
          <input className="sk-input" style={{width:'100%', textAlign:'center', marginBottom:6}} defaultValue="sa-gwa"/>
          <input className="sk-input" style={{width:'100%'}} defaultValue="Apfel"/>
        </div>

        {/* deck picker */}
        <div style={{display:'flex', alignItems:'center', gap:6, padding:'2px 4px'}}>
          <span className="sk-label">In Stapel:</span>
          <span className="sk-chip filled">Essen</span>
          <span className="sk-chip">ändern</span>
        </div>

        <div style={{marginTop:'auto', paddingBottom:90}}/>
      </div>
      <TabBar active="vokabeln"/>
    </Phone>
  );
}

Object.assign(window, { NeuV1, NeuV2, NeuV3 });
