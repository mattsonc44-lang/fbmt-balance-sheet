import React, { useState, useEffect } from 'react';

const SUPABASE_URL = (window.SUPABASE_URL || '').replace(/\/+$/, '');
const SUPABASE_ANON_KEY = window.SUPABASE_ANON_KEY || '';
function supaHeaders() {
  return { 'Content-Type':'application/json','apikey':SUPABASE_ANON_KEY,'Authorization':'Bearer '+SUPABASE_ANON_KEY,'Prefer':'return=representation' };
}

const INSP_TH = '#1a4731';
const INSP_TH_S = {background:INSP_TH,color:'white',padding:'8px 10px',fontWeight:700,fontSize:12,textAlign:'center',borderRight:'1px solid rgba(255,255,255,.15)'};
const INSP_TD_S = {padding:'8px 10px',borderBottom:'1px solid #f0f0f0',verticalAlign:'middle'};
const INSP_LBL = {fontSize:10,fontWeight:700,color:'#6b7280',textTransform:'uppercase',letterSpacing:'.06em',display:'block',marginBottom:4};
const CONDITIONS = ['Excellent','Good','Fair','Poor'];
const WATER_CONDITIONS = ['Excess','Adequate','Limited'];

const devPct = (actual,budgeted) => { const a=parseFloat(actual)||0,b=parseFloat(budgeted)||0; if(!b)return null; return((a-b)/b)*100; };
const devStyle = pct => { if(pct===null)return{}; const abs=Math.abs(pct); if(abs>=20)return{background:'#fef2f2',borderLeft:'4px solid #dc2626'}; if(abs>=10)return{background:'#fffbeb',borderLeft:'4px solid #f59e0b'}; return{background:'#f0fdf4',borderLeft:'4px solid #22c55e'}; };
const devBadge = pct => { if(pct===null||Math.abs(pct)<0.5)return null; const abs=Math.abs(pct),pos=pct>0,color=abs>=20?'#dc2626':abs>=10?'#d97706':'#16a34a'; return <span style={{fontSize:10,fontWeight:700,color,background:color+'18',padding:'1px 6px',borderRadius:999,whiteSpace:'nowrap'}}>{pos?'+':''}{pct.toFixed(1)}%</span>; };

const CondPills = ({value,onChange,options=CONDITIONS}) => (
  <div style={{display:'flex',gap:4,flexWrap:'wrap'}}>
    {options.map(c=>(
      <button key={c} type="button" onClick={()=>onChange(c)}
        style={{padding:'4px 10px',borderRadius:12,border:value===c?'none':'1px solid #d1d5db',background:value===c?(c==='Excellent'||c==='Adequate'?'#22c55e':c==='Good'?'#3b82f6':c==='Fair'||c==='Limited'?'#f59e0b':'#ef4444'):'white',color:value===c?'white':'#6b7280',cursor:'pointer',fontSize:11,fontWeight:value===c?700:400}}>
        {c}
      </button>
    ))}
  </div>
);

const Section = ({title,children}) => (
  <div style={{background:'white',borderRadius:8,border:'1px solid #d1fae5',marginBottom:16,overflow:'hidden'}}>
    <div style={{background:INSP_TH,padding:'10px 16px',color:'white',fontWeight:700,fontSize:14}}>{title}</div>
    <div style={{padding:16}}>{children}</div>
  </div>
);

const uid = () => Math.random().toString(36).slice(2,10);

export default function CustomerInspectionForm() {
  const [step,setStep] = useState('pin');
  const [pinInput,setPinInput] = useState('');
  const [pinError,setPinError] = useState('');
  const [shareRecord,setShareRecord] = useState(null);
  const [crops,setCrops] = useState([]);
  const [livestock,setLivestock] = useState([]);
  const [inventory,setInventory] = useState([]);
  const [pastureCond,setPastureCond] = useState('');
  const [pastureCmt,setPastureCmt] = useState('');
  const [waterCond,setWaterCond] = useState('');
  const [waterCmt,setWaterCmt] = useState('');
  const [equipCond,setEquipCond] = useState('');
  const [equipCmt,setEquipCmt] = useState('');
  const [envCmt,setEnvCmt] = useState('');
  const [addlCmt,setAddlCmt] = useState('');
  const [submitting,setSubmitting] = useState(false);
  const [errorMsg,setErrorMsg] = useState('');

  const shareId = new URLSearchParams(window.location.search).get('id');
  useEffect(()=>{ if(!shareId)setErrorMsg('Invalid link.'); },[]);

  const submitPin = async () => {
    setPinError('');
    try {
      const resp = await fetch(SUPABASE_URL+'/rest/v1/inspection_shares?share_id=eq.'+shareId,{headers:supaHeaders()});
      const rows = await resp.json();
      if(!rows.length){setPinError('Link not found or expired.');return;}
      const rec = rows[0];
      if(rec.pin!==pinInput.trim()){setPinError('Incorrect PIN.');return;}
      if(rec.expires_at&&new Date(rec.expires_at)<new Date()){setPinError('Link expired.');return;}
      setShareRecord(rec);
      const d = rec.insp_data||{};
      setCrops((d.inspCrops||[]).map(r=>({...r,actualAcres:r.actualAcres||'',condition:r.condition||'',actualYield:r.actualYield||'',location:r.location||'',deviationReason:r.deviationReason||''})));
      setLivestock((d.inspLivestock||[]).map(r=>({...r,actualHead:r.actualHead||'',condition:r.condition||'',estWeight:r.estWeight||'',deviationReason:r.deviationReason||''})));
      setInventory((d.inspInventory||[{id:uid(),description:'',location:'',condition:'',quantity:'',unitType:'bu',valuePerUnit:''}]).map(r=>({...r})));
      setPastureCond(d.inspPastureCond||'');setPastureCmt(d.inspPastureCmt||'');
      setWaterCond(d.inspWaterCond||'');setWaterCmt(d.inspWaterCmt||'');
      setEquipCond(d.inspEquipCond||'');setEquipCmt(d.inspEquipCmt||'');
      setEnvCmt(d.inspEnvCmt||'');setAddlCmt(d.inspAddlCmt||'');
      setStep('form');
    } catch(e){setPinError('Error: '+e.message);}
  };

  const updCrop = (id,f,v) => setCrops(c=>c.map(r=>r.id===id?{...r,[f]:v}:r));
  const updLS = (id,f,v) => setLivestock(l=>l.map(r=>r.id===id?{...r,[f]:v}:r));
  const updInv = (id,f,v) => setInventory(l=>l.map(r=>r.id===id?{...r,[f]:v}:r));

  const canSubmit = () => {
    for(const r of crops){const p=devPct(r.actualAcres,r.budgetedAcres);if(r.actualAcres&&p!==null&&Math.abs(p)>=20&&!r.deviationReason.trim())return false;}
    for(const r of livestock){const p=devPct(r.actualHead,r.budgetedHead);if(r.actualHead&&p!==null&&Math.abs(p)>=20&&!r.deviationReason.trim())return false;}
    return true;
  };

  const submitForm = async () => {
    if(!canSubmit()){alert('Please provide a reason for all deviations over 20%.');return;}
    setSubmitting(true);
    try {
      const response = {crops,livestock,inventory,pastureCond,pastureCmt,waterCond,waterCmt,equipCond,equipCmt,envCmt,addlCmt,submittedAt:new Date().toISOString()};
      const resp = await fetch(SUPABASE_URL+'/rest/v1/inspection_shares?share_id=eq.'+shareId,{method:'PATCH',headers:supaHeaders(),body:JSON.stringify({response,responded_at:new Date().toISOString()})});
      if(!resp.ok)throw new Error(await resp.text());
      setStep('done');
    } catch(e){setErrorMsg(e.message);setStep('error');}
    setSubmitting(false);
  };

  if(step==='pin') return (
    <div style={{fontFamily:'Arial,sans-serif',maxWidth:420,margin:'60px auto',padding:'0 16px'}}>
      <div style={{background:'#6B0E1E',color:'white',borderRadius:'10px 10px 0 0',padding:'18px 22px'}}>
        <div style={{fontWeight:900,fontSize:13,letterSpacing:'.05em',marginBottom:2}}>FIRST BANK OF MONTANA</div>
        <div style={{fontWeight:700,fontSize:18}}>Crop Inspection Form</div>
      </div>
      <div style={{background:'white',border:'1px solid #e5e7eb',borderTop:'none',borderRadius:'0 0 10px 10px',padding:24}}>
        <div style={{fontWeight:700,fontSize:15,marginBottom:8}}>Enter Your PIN</div>
        <div style={{fontSize:13,color:'#6b7280',marginBottom:16}}>Your loan officer at First Bank of Montana sent you this link. Enter the 6-digit PIN they provided.</div>
        <input style={{width:'100%',border:'1.5px solid #d1d5db',borderRadius:6,padding:'10px 0',fontSize:24,fontFamily:'monospace',letterSpacing:'.3em',textAlign:'center',boxSizing:'border-box',outline:'none',marginBottom:12}} type="text" maxLength={6} value={pinInput} onChange={e=>setPinInput(e.target.value.replace(/\D/g,''))} onKeyDown={e=>e.key==='Enter'&&submitPin()} placeholder="000000" autoFocus/>
        {(pinError||errorMsg)&&<div style={{color:'#c44',fontSize:13,marginBottom:10}}>&#9888; {pinError||errorMsg}</div>}
        <button onClick={submitPin} style={{width:'100%',background:'#6B0E1E',color:'white',border:'none',borderRadius:7,padding:12,fontWeight:700,fontSize:15,cursor:'pointer'}}>Open Form</button>
      </div>
    </div>
  );

  if(step==='done') return (
    <div style={{fontFamily:'Arial,sans-serif',textAlign:'center',padding:'60px 20px'}}>
      <div style={{fontSize:52,marginBottom:12}}>&#10003;</div>
      <div style={{fontWeight:800,fontSize:22,color:INSP_TH,marginBottom:8}}>Form Submitted!</div>
      <p style={{color:'#6b7280',fontSize:14,maxWidth:360,margin:'0 auto'}}>Thank you. Your loan officer at First Bank of Montana will review your responses.</p>
    </div>
  );

  if(step==='error') return <div style={{fontFamily:'Arial,sans-serif',padding:32,color:'#c44'}}><strong>Error:</strong> {errorMsg}</div>;

  const hasMissingReasons = !canSubmit();
  const inp = (val,onChange,ph='',isNum=false) => (
    <input type="text" value={val} placeholder={ph} onChange={e=>onChange(isNum?e.target.value.replace(/[^0-9.]/g,''):e.target.value)}
      style={{border:'1px solid #d1d5db',borderRadius:4,padding:'5px 8px',fontSize:13,width:'100%',fontFamily:'inherit',outline:'none',boxSizing:'border-box'}}/>
  );
  const ta = (val,onChange,ph,rows=3) => (
    <textarea value={val} onChange={e=>onChange(e.target.value)} placeholder={ph} rows={rows} style={{border:'1px solid #d1d5db',borderRadius:4,padding:'6px 8px',fontSize:13,width:'100%',fontFamily:'inherit',outline:'none',resize:'vertical',boxSizing:'border-box'}}/>
  );
  const actInp = (val,onChange,ph) => (
    <input type="text" value={val} placeholder={ph} onChange={e=>onChange(e.target.value.replace(/[^0-9.]/g,''))}
      style={{border:'1.5px solid #6B0E1E',borderRadius:4,padding:'5px 8px',fontSize:13,width:'100%',fontFamily:'inherit',outline:'none',boxSizing:'border-box',background:'#fdf9f9',fontWeight:600,textAlign:'center'}}/>
  );

  return (
    <div style={{fontFamily:'Arial,sans-serif',maxWidth:1100,margin:'0 auto',padding:'20px 16px'}}>
      {/* Header */}
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:16,flexWrap:'wrap',gap:10}}>
        <div>
          <div style={{fontWeight:800,fontSize:18,color:INSP_TH}}>Crop Inspection Form</div>
          <div style={{fontSize:12,color:'#6b7280'}}>{shareRecord?.client_name} - Fill in your actual information below</div>
        </div>
        <button onClick={submitForm} disabled={submitting}
          style={{background:hasMissingReasons?'#9ca3af':'#6B0E1E',color:'white',border:'none',borderRadius:6,padding:'9px 22px',fontWeight:700,fontSize:13,cursor:hasMissingReasons?'not-allowed':'pointer'}}>
          {submitting?'Submitting...':hasMissingReasons?'Enter Missing Reasons':'Submit Form'}
        </button>
      </div>

      {/* Legend */}
      <div style={{display:'flex',gap:16,marginBottom:14,flexWrap:'wrap'}}>
        {[['#22c55e','On Budget (under 10%)'],['#f59e0b','Minor Deviation (10-20%)'],['#dc2626','Major Deviation (over 20%) - reason required']].map(([c,l])=>(
          <div key={l} style={{display:'flex',alignItems:'center',gap:5,fontSize:11,color:'#374151'}}>
            <div style={{width:10,height:10,borderRadius:2,background:c}}/>{l}
          </div>
        ))}
      </div>

      {/* ── CROPS ── */}
      {crops.length>0&&(
        <Section title="CROP CONDITION - Budget vs. Actual">
          <div style={{overflowX:'auto'}}>
            <table style={{width:'100%',borderCollapse:'collapse',fontSize:12.5}}>
              <thead><tr>
                <th style={{...INSP_TH_S,textAlign:'left',minWidth:100}}>Crop</th>
                <th style={{...INSP_TH_S,minWidth:80,background:'#374151'}}>Budget Ac</th>
                <th style={{...INSP_TH_S,minWidth:80}}>Actual Ac</th>
                <th style={{...INSP_TH_S,minWidth:70}}>Deviation</th>
                <th style={{...INSP_TH_S,textAlign:'left',minWidth:90}}>Location</th>
                <th style={{...INSP_TH_S,minWidth:190}}>Condition</th>
                <th style={{...INSP_TH_S,minWidth:100}}>Yield / Acre</th>
                <th style={{...INSP_TH_S,minWidth:80,background:'#374151'}}>Budget Price</th>
                <th style={{...INSP_TH_S,minWidth:85}}>Total Value</th>
              </tr></thead>
              <tbody>
                {crops.map((r,i)=>{
                  const pct=devPct(r.actualAcres,r.budgetedAcres);
                  const rowBg=i%2===0?'white':'#f9fafb';
                  const ds=r.actualAcres?devStyle(pct):{};
                  const totalVal=(parseFloat(r.actualAcres||r.budgetedAcres)||0)*(parseFloat(r.actualYield||r.budgetedYield)||0)*(parseFloat(r.budgetedPrice)||0);
                  const showReason=r.actualAcres&&pct!==null&&Math.abs(pct)>=20;
                  return (
                    <React.Fragment key={r.id||i}>
                      <tr style={{background:ds.background||rowBg,...(ds.borderLeft?{borderLeft:ds.borderLeft}:{})}}>
                        <td style={INSP_TD_S}><div style={{fontWeight:600,fontSize:13}}>{r.budgetedCrop||'---'}</div></td>
                        <td style={{...INSP_TD_S,textAlign:'center',background:'#f8f6f2'}}><div style={{fontSize:13,fontWeight:600,color:'#6b7280'}}>{r.budgetedAcres||'---'}</div><div style={{fontSize:10,color:'#9ca3af'}}>budgeted</div></td>
                        <td style={INSP_TD_S}>{actInp(r.actualAcres,v=>updCrop(r.id,'actualAcres',v),r.budgetedAcres||'0')}</td>
                        <td style={{...INSP_TD_S,textAlign:'center'}}>
                          {r.actualAcres&&r.budgetedAcres?(
                            <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:2}}>
                              {devBadge(pct)}
                              <div style={{fontSize:10,color:'#6b7280'}}>{(parseFloat(r.actualAcres||0)-parseFloat(r.budgetedAcres||0)>0?'+':'')}{(parseFloat(r.actualAcres||0)-parseFloat(r.budgetedAcres||0)).toFixed(0)} ac</div>
                            </div>
                          ):<span style={{color:'#d1d5db'}}>---</span>}
                        </td>
                        <td style={INSP_TD_S}>{inp(r.location,v=>updCrop(r.id,'location',v),'Field/Sec')}</td>
                        <td style={INSP_TD_S}><CondPills value={r.condition} onChange={v=>updCrop(r.id,'condition',v)}/></td>
                        <td style={INSP_TD_S}>
                          <div style={{display:'flex',gap:3}}>
                            {actInp(r.actualYield,v=>updCrop(r.id,'actualYield',v),r.budgetedYield||'0')}
                            <div style={{fontSize:11,color:'#6b7280',alignSelf:'center',whiteSpace:'nowrap'}}>{r.budgetedUnit||'bu'}</div>
                          </div>
                          {r.budgetedYield&&<div style={{fontSize:10,color:'#9ca3af'}}>budget: {r.budgetedYield}</div>}
                        </td>
                        <td style={{...INSP_TD_S,textAlign:'center',background:'#f8f6f2'}}><div style={{fontSize:13,fontWeight:600,color:'#6b7280'}}>${r.budgetedPrice||'---'}</div><div style={{fontSize:10,color:'#9ca3af'}}>locked</div></td>
                        <td style={{...INSP_TD_S,textAlign:'right',fontWeight:700,color:'#15803d',whiteSpace:'nowrap'}}>{totalVal>0?'$'+Math.round(totalVal).toLocaleString():'---'}</td>
                      </tr>
                      {showReason&&(
                        <tr style={{background:'#fef2f2'}}>
                          <td colSpan={9} style={{padding:'6px 10px 8px 32px',borderBottom:'1px solid #f0f0f0'}}>
                            <div style={{display:'flex',alignItems:'center',gap:8}}>
                              <span style={{fontSize:11,fontWeight:700,color:'#dc2626',whiteSpace:'nowrap'}}>Deviation reason (required):</span>
                              <input type="text" value={r.deviationReason} placeholder="Required - explain major deviation from budget..." onChange={e=>updCrop(r.id,'deviationReason',e.target.value)} style={{flex:1,border:'1px solid #fca5a5',borderRadius:4,padding:'5px 8px',fontSize:13,fontFamily:'inherit',outline:'none',background:'white'}}/>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
              <tfoot><tr style={{background:'#ecfdf5'}}>
                <td colSpan={8} style={{...INSP_TD_S,textAlign:'right',fontWeight:700,color:INSP_TH,fontSize:13}}>CROP TOTAL</td>
                <td style={{...INSP_TD_S,textAlign:'right',fontWeight:700,color:'#15803d',fontSize:14}}>${Math.round(crops.reduce((s,r)=>s+(parseFloat(r.actualAcres||r.budgetedAcres)||0)*(parseFloat(r.actualYield||r.budgetedYield)||0)*(parseFloat(r.budgetedPrice)||0),0)).toLocaleString()}</td>
              </tr></tfoot>
            </table>
          </div>
        </Section>
      )}

      {/* ── LIVESTOCK ── */}
      {livestock.length>0&&(
        <Section title="LIVESTOCK CONDITION - Budget vs. Actual">
          <div style={{overflowX:'auto'}}>
            <table style={{width:'100%',borderCollapse:'collapse',fontSize:12.5}}>
              <thead><tr>
                <th style={{...INSP_TH_S,textAlign:'left',minWidth:120}}>Type</th>
                <th style={{...INSP_TH_S,minWidth:80,background:'#374151'}}>Budget Head</th>
                <th style={{...INSP_TH_S,minWidth:80}}>Actual Head</th>
                <th style={{...INSP_TH_S,minWidth:70}}>Deviation</th>
                <th style={{...INSP_TH_S,minWidth:190}}>Condition</th>
                <th style={{...INSP_TH_S,minWidth:100}}>Est. Weight</th>
              </tr></thead>
              <tbody>
                {livestock.map((r,i)=>{
                  const pct=devPct(r.actualHead,r.budgetedHead);
                  const rowBg=i%2===0?'white':'#f9fafb';
                  const ds=r.actualHead?devStyle(pct):{};
                  const showReason=r.actualHead&&pct!==null&&Math.abs(pct)>=20;
                  return (
                    <React.Fragment key={r.id||i}>
                      <tr style={{background:ds.background||rowBg,...(ds.borderLeft?{borderLeft:ds.borderLeft}:{})}}>
                        <td style={INSP_TD_S}><div style={{fontWeight:600,fontSize:13}}>{r.budgetedType||'---'}</div></td>
                        <td style={{...INSP_TD_S,textAlign:'center',background:'#f8f6f2'}}><div style={{fontSize:13,fontWeight:600,color:'#6b7280'}}>{r.budgetedHead||'---'}</div><div style={{fontSize:10,color:'#9ca3af'}}>budgeted</div></td>
                        <td style={INSP_TD_S}>{actInp(r.actualHead,v=>updLS(r.id,'actualHead',v),r.budgetedHead||'0')}</td>
                        <td style={{...INSP_TD_S,textAlign:'center'}}>
                          {r.actualHead&&r.budgetedHead?(
                            <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:2}}>
                              {devBadge(pct)}
                              <div style={{fontSize:10,color:'#6b7280'}}>{(parseFloat(r.actualHead||0)-parseFloat(r.budgetedHead||0)>0?'+':'')}{(parseFloat(r.actualHead||0)-parseFloat(r.budgetedHead||0)).toFixed(0)} hd</div>
                            </div>
                          ):<span style={{color:'#d1d5db'}}>---</span>}
                        </td>
                        <td style={INSP_TD_S}><CondPills value={r.condition} onChange={v=>updLS(r.id,'condition',v)}/></td>
                        <td style={INSP_TD_S}>{actInp(r.estWeight,v=>updLS(r.id,'estWeight',v),'0 lbs')}</td>
                      </tr>
                      {showReason&&(
                        <tr style={{background:'#fef2f2'}}>
                          <td colSpan={6} style={{padding:'6px 10px 8px 32px'}}>
                            <div style={{display:'flex',alignItems:'center',gap:8}}>
                              <span style={{fontSize:11,fontWeight:700,color:'#dc2626',whiteSpace:'nowrap'}}>Deviation reason (required):</span>
                              <input type="text" value={r.deviationReason} placeholder="Required - explain major deviation from budget..." onChange={e=>updLS(r.id,'deviationReason',e.target.value)} style={{flex:1,border:'1px solid #fca5a5',borderRadius:4,padding:'5px 8px',fontSize:13,fontFamily:'inherit',outline:'none',background:'white'}}/>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Section>
      )}

      {/* ── INVENTORY ── */}
      <Section title="INVENTORY (Stored Crop / Feed)">
        <div style={{overflowX:'auto'}}>
          <table style={{width:'100%',borderCollapse:'collapse',fontSize:12.5}}>
            <thead><tr>
              <th style={{...INSP_TH_S,textAlign:'left',minWidth:130}}>Description</th>
              <th style={{...INSP_TH_S,textAlign:'left',minWidth:100}}>Location</th>
              <th style={{...INSP_TH_S,minWidth:190}}>Condition</th>
              <th style={{...INSP_TH_S,minWidth:80}}>Quantity</th>
              <th style={{...INSP_TH_S,minWidth:65}}>Unit</th>
              <th style={{...INSP_TH_S,minWidth:80}}>Value / Unit</th>
              <th style={{...INSP_TH_S,minWidth:85}}>Total Value</th>
              <th style={{...INSP_TH_S,width:28}}></th>
            </tr></thead>
            <tbody>
              {inventory.map((r,i)=>{
                const tot=(parseFloat(r.quantity)||0)*(parseFloat(r.valuePerUnit)||0);
                return (
                  <tr key={r.id||i} style={{background:i%2===0?'white':'#f0fdf4'}}>
                    <td style={INSP_TD_S}>{inp(r.description,v=>updInv(r.id,'description',v),'Corn, Soybeans, Hay...')}</td>
                    <td style={INSP_TD_S}>{inp(r.location,v=>updInv(r.id,'location',v),'Bin/Facility')}</td>
                    <td style={INSP_TD_S}><CondPills value={r.condition} onChange={v=>updInv(r.id,'condition',v)}/></td>
                    <td style={INSP_TD_S}>{inp(r.quantity,v=>updInv(r.id,'quantity',v),'0',true)}</td>
                    <td style={INSP_TD_S}>
                      <select value={r.unitType||'bu'} onChange={e=>updInv(r.id,'unitType',e.target.value)} style={{border:'1px solid #d1d5db',borderRadius:4,padding:'4px 5px',fontSize:12,width:'100%',background:'white',outline:'none'}}>
                        {['bu','ton','bale','cwt','lb','gal','head','ea'].map(u=><option key={u}>{u}</option>)}
                      </select>
                    </td>
                    <td style={INSP_TD_S}>{inp(r.valuePerUnit,v=>updInv(r.id,'valuePerUnit',v),'$0',true)}</td>
                    <td style={{...INSP_TD_S,textAlign:'right',fontWeight:700,color:'#15803d'}}>{tot>0?'$'+Math.round(tot).toLocaleString():'---'}</td>
                    <td style={INSP_TD_S}><button type="button" onClick={()=>setInventory(l=>l.filter(x=>x.id!==r.id))} style={{background:'#fee2e2',color:'#b91c1c',border:'none',borderRadius:4,padding:'2px 7px',cursor:'pointer',fontSize:14}}>x</button></td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot><tr style={{background:'#ecfdf5'}}>
              <td colSpan={6} style={{...INSP_TD_S,textAlign:'right',fontWeight:700,color:INSP_TH,fontSize:13}}>INVENTORY TOTAL</td>
              <td style={{...INSP_TD_S,textAlign:'right',fontWeight:700,color:'#15803d',fontSize:14}}>${Math.round(inventory.reduce((s,r)=>(parseFloat(r.quantity)||0)*(parseFloat(r.valuePerUnit)||0)+s,0)).toLocaleString()}</td>
              <td/>
            </tr></tfoot>
          </table>
        </div>
        <button type="button" onClick={()=>setInventory(l=>[...l,{id:uid(),description:'',location:'',condition:'',quantity:'',unitType:'bu',valuePerUnit:''}])} style={{marginTop:10,background:'none',border:'1.5px dashed #6b7280',borderRadius:6,padding:'6px 16px',cursor:'pointer',fontSize:12,color:'#6b7280',fontFamily:'inherit',fontWeight:600}}>+ Add Row</button>
      </Section>

      {/* ── PASTURE ── */}
      <Section title="PASTURE CONDITIONS">
        <div style={{display:'grid',gridTemplateColumns:'auto 1fr',gap:'0 24px',alignItems:'start'}}>
          <div style={{minWidth:260}}>
            <label style={INSP_LBL}>Overall Condition</label>
            <CondPills value={pastureCond} onChange={setPastureCond}/>
          </div>
          <div><label style={INSP_LBL}>Comments</label>{ta(pastureCmt,setPastureCmt,'Pasture conditions, forage quality...',2)}</div>
        </div>
      </Section>

      {/* ── WATER ── */}
      <Section title="WATER / IRRIGATION SOURCE">
        <div style={{display:'grid',gridTemplateColumns:'auto 1fr',gap:'0 24px',alignItems:'start'}}>
          <div style={{minWidth:260}}>
            <label style={INSP_LBL}>Overall Condition</label>
            <CondPills value={waterCond} onChange={setWaterCond} options={WATER_CONDITIONS}/>
          </div>
          <div><label style={INSP_LBL}>Comments</label>{ta(waterCmt,setWaterCmt,'Water source, irrigation notes...',2)}</div>
        </div>
      </Section>

      {/* ── EQUIPMENT ── */}
      <Section title="EQUIPMENT">
        <div style={{display:'grid',gridTemplateColumns:'auto 1fr',gap:'0 24px',alignItems:'start'}}>
          <div style={{minWidth:260}}>
            <label style={INSP_LBL}>Overall Condition</label>
            <CondPills value={equipCond} onChange={setEquipCond}/>
          </div>
          <div><label style={INSP_LBL}>Comments</label>{ta(equipCmt,setEquipCmt,'Equipment condition notes...',2)}</div>
        </div>
      </Section>

      {/* ── ENVIRONMENTAL ── */}
      <Section title="ENVIRONMENTAL OBSERVATIONS">
        <label style={INSP_LBL}>Comments</label>
        {ta(envCmt,setEnvCmt,'Soil erosion, drainage, weed pressure...',3)}
      </Section>

      {/* ── ADDITIONAL ── */}
      <Section title="ADDITIONAL OBSERVATIONS / OVERALL OPERATION">
        <label style={INSP_LBL}>Comments</label>
        {ta(addlCmt,setAddlCmt,'Overall operation comments...',4)}
      </Section>

      {hasMissingReasons&&(
        <div style={{background:'#fef2f2',border:'1px solid #fca5a5',borderRadius:8,padding:'10px 16px',marginBottom:12,fontSize:13,color:'#dc2626',fontWeight:600}}>
          Please fill in the deviation reason for all rows highlighted in red before submitting.
        </div>
      )}
      <button onClick={submitForm} disabled={submitting}
        style={{width:'100%',background:hasMissingReasons?'#9ca3af':'#6B0E1E',color:'white',border:'none',borderRadius:8,padding:14,fontWeight:700,fontSize:16,cursor:hasMissingReasons?'not-allowed':'pointer',marginBottom:8}}>
        {submitting?'Submitting...':hasMissingReasons?'Enter Missing Reasons First':'Submit Inspection Form'}
      </button>
      <div style={{fontSize:11,color:'#9ca3af',textAlign:'center'}}>Your information will be sent securely to First Bank of Montana</div>
    </div>
  );
}
