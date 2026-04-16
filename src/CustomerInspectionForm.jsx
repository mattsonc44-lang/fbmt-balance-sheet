import React, { useState, useEffect } from 'react';

const SUPABASE_URL = (window.SUPABASE_URL || '').replace(/\/+$/, '');
const SUPABASE_ANON_KEY = window.SUPABASE_ANON_KEY || '';

function supaHeaders() {
  return {
    'Content-Type': 'application/json',
    'apikey': SUPABASE_ANON_KEY,
    'Authorization': 'Bearer ' + SUPABASE_ANON_KEY,
    'Prefer': 'return=representation',
  };
}

const CONDITIONS = ['Excellent', 'Good', 'Fair', 'Poor'];

export default function CustomerInspectionForm() {
  const [step, setStep] = useState('pin'); // pin | form | submitting | done | error
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');
  const [shareRecord, setShareRecord] = useState(null);
  const [crops, setCrops] = useState([]);
  const [livestock, setLivestock] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');

  const shareId = new URLSearchParams(window.location.search).get('id');

  useEffect(() => {
    if (!shareId) setErrorMsg('Invalid link — no share ID found.');
  }, [shareId]);

  const submitPin = async () => {
    setPinError('');
    try {
      const resp = await fetch(
        SUPABASE_URL + '/rest/v1/inspection_shares?share_id=eq.' + shareId,
        { headers: supaHeaders() }
      );
      const rows = await resp.json();
      if (!rows.length) { setPinError('Link not found or expired.'); return; }
      const record = rows[0];
      if (record.pin !== pinInput.trim()) { setPinError('Incorrect PIN. Please try again.'); return; }
      // Check expiry
      if (record.expires_at && new Date(record.expires_at) < new Date()) {
        setPinError('This link has expired. Please contact your loan officer.'); return;
      }
      setShareRecord(record);
      // Init crop form from insp_data
      const inspCrops = record.insp_data?.inspCrops || [];
      setCrops(inspCrops.map(r => ({
        id: r.id,
        budgetedCrop: r.budgetedCrop || '',
        budgetedAcres: r.budgetedAcres || '',
        actualAcres: r.actualAcres || '',
        condition: r.condition || '',
        actualYield: r.actualYield || '',
        location: r.location || '',
        notes: '',
      })));
      const inspLS = record.insp_data?.inspLivestock || [];
      setLivestock(inspLS.map(r => ({
        id: r.id,
        budgetedType: r.budgetedType || '',
        budgetedHead: r.budgetedHead || '',
        actualHead: r.actualHead || '',
        condition: r.condition || '',
        estWeight: r.estWeight || '',
        notes: '',
      })));
      setStep('form');
    } catch(e) {
      setPinError('Error: ' + e.message);
    }
  };

  const submitForm = async () => {
    setStep('submitting');
    try {
      const response = { crops, livestock, submittedAt: new Date().toISOString() };
      const resp = await fetch(
        SUPABASE_URL + '/rest/v1/inspection_shares?share_id=eq.' + shareId,
        {
          method: 'PATCH',
          headers: supaHeaders(),
          body: JSON.stringify({ response, responded_at: new Date().toISOString() }),
        }
      );
      if (!resp.ok) throw new Error(await resp.text());
      // Send email notification to loan officer
      try {
        if (window.emailjs && shareRecord) {
          await window.emailjs.send(
            window.EMAILJS_SERVICE_ID || "service_fbmt",
            window.EMAILJS_NOTIFY_TEMPLATE || "template_notify",
            {
              to_email: window.LOAN_OFFICER_EMAIL || "chris@firstbankofmontana.com",
              client_name: shareRecord.client_name,
              submitted_at: new Date().toLocaleString(),
              message: "Your customer " + shareRecord.client_name + " has submitted their crop inspection form. Log in to review their responses.",
            }
          );
        }
      } catch(emailErr) { console.warn("Email notification failed:", emailErr); }
      setStep('done');
    } catch(e) {
      setErrorMsg(e.message);
      setStep('error');
    }
  };

  const updCrop = (idx, field, val) => setCrops(c => c.map((r,i) => i===idx ? {...r,[field]:val} : r));
  const updLS = (idx, field, val) => setLivestock(l => l.map((r,i) => i===idx ? {...r,[field]:val} : r));

  const styles = {
    page: { fontFamily: 'Arial,sans-serif', maxWidth: 680, margin: '0 auto', padding: '20px 16px', color: '#1a1a1a' },
    header: { background: '#6B0E1E', color: 'white', borderRadius: 10, padding: '18px 22px', marginBottom: 24 },
    logo: { fontWeight: 900, fontSize: 14, letterSpacing: '.05em', marginBottom: 2 },
    title: { fontWeight: 700, fontSize: 20 },
    card: { background: 'white', border: '1px solid #e5e7eb', borderRadius: 10, padding: 20, marginBottom: 16, boxShadow: '0 1px 4px rgba(0,0,0,.06)' },
    label: { fontSize: 12, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 4, display: 'block' },
    input: { width: '100%', border: '1.5px solid #d1d5db', borderRadius: 6, padding: '8px 12px', fontSize: 15, fontFamily: 'inherit', boxSizing: 'border-box', outline: 'none' },
    condBtn: (active) => ({ padding: '6px 14px', borderRadius: 20, border: active ? '2px solid #6B0E1E' : '1.5px solid #d1d5db', background: active ? '#6B0E1E' : 'white', color: active ? 'white' : '#374151', cursor: 'pointer', fontSize: 13, fontWeight: active ? 700 : 400 }),
    secHead: { background: '#374151', color: 'white', borderRadius: '8px 8px 0 0', padding: '10px 16px', fontWeight: 700, fontSize: 14, marginBottom: 0 },
    submitBtn: { width: '100%', background: '#6B0E1E', color: 'white', border: 'none', borderRadius: 8, padding: '14px 0', fontWeight: 700, fontSize: 16, cursor: 'pointer', marginTop: 8 },
  };

  if (errorMsg && step !== 'error') return (
    <div style={styles.page}>
      <div style={{...styles.header}}><div style={styles.logo}>FIRST BANK OF MONTANA</div></div>
      <div style={{color:'#c44',fontWeight:700,padding:20}}>{errorMsg}</div>
    </div>
  );

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div style={styles.logo}>FIRST BANK OF MONTANA</div>
        <div style={styles.title}>🌾 Crop Inspection Form</div>
        {shareRecord && <div style={{fontSize:13,marginTop:4,opacity:.85}}>{shareRecord.client_name}</div>}
      </div>

      {step === 'pin' && (
        <div style={styles.card}>
          <div style={{fontWeight:700,fontSize:16,marginBottom:8}}>Enter Your PIN</div>
          <div style={{fontSize:14,color:'#6b7280',marginBottom:16}}>
            Your loan officer shared this form with you. Enter the PIN they provided to get started.
          </div>
          <label style={styles.label}>6-Digit PIN</label>
          <input style={{...styles.input, letterSpacing:'.3em', fontSize:22, textAlign:'center', marginBottom:12}}
            type="text" maxLength={6} value={pinInput}
            onChange={e=>setPinInput(e.target.value.replace(/\D/g,''))}
            onKeyDown={e=>e.key==='Enter'&&submitPin()}
            placeholder="000000" />
          {pinError && <div style={{color:'#c44',fontSize:13,marginBottom:10}}>⚠️ {pinError}</div>}
          <button onClick={submitPin}
            style={{...styles.submitBtn, marginTop:0}}>
            Open Form →
          </button>
        </div>
      )}

      {step === 'form' && (
        <div>
          <div style={{fontSize:13,color:'#6b7280',marginBottom:16,padding:'10px 14px',background:'#f9fafb',borderRadius:8}}>
            Please fill in the actual acres, condition, and estimated yield for each crop below, then submit.
            Fields marked with budget values are shown for reference.
          </div>

          {crops.length > 0 && (
            <div style={{marginBottom:20}}>
              <div style={styles.secHead}>🌾 Crop Condition</div>
              {crops.map((r, i) => (
                <div key={r.id||i} style={{...styles.card, borderRadius: i===0?'0 0 8px 8px':'8px', marginBottom:8}}>
                  <div style={{fontWeight:700,fontSize:15,marginBottom:12,color:'#6B0E1E'}}>
                    {r.budgetedCrop || 'Crop ' + (i+1)}
                    {r.budgetedAcres && <span style={{fontWeight:400,fontSize:12,color:'#6b7280',marginLeft:8}}>Budget: {r.budgetedAcres} ac</span>}
                  </div>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:12}}>
                    <div>
                      <label style={styles.label}>Actual Acres</label>
                      <input style={styles.input} type="text" value={r.actualAcres}
                        placeholder={r.budgetedAcres||'0'}
                        onChange={e=>updCrop(i,'actualAcres',e.target.value.replace(/[^0-9.]/g,''))} />
                    </div>
                    <div>
                      <label style={styles.label}>Actual Yield (est.)</label>
                      <input style={styles.input} type="text" value={r.actualYield}
                        placeholder={r.budgetedYield||'0'}
                        onChange={e=>updCrop(i,'actualYield',e.target.value.replace(/[^0-9.]/g,''))} />
                    </div>
                  </div>
                  <div style={{marginBottom:12}}>
                    <label style={styles.label}>Condition</label>
                    <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
                      {CONDITIONS.map(c => (
                        <button key={c} type="button" onClick={()=>updCrop(i,'condition',c)}
                          style={styles.condBtn(r.condition===c)}>{c}</button>
                      ))}
                    </div>
                  </div>
                  <div style={{marginBottom:8}}>
                    <label style={styles.label}>Location / Field</label>
                    <input style={styles.input} type="text" value={r.location}
                      placeholder="Field name or section..." onChange={e=>updCrop(i,'location',e.target.value)} />
                  </div>
                  <div>
                    <label style={styles.label}>Notes (optional)</label>
                    <input style={styles.input} type="text" value={r.notes}
                      placeholder="Any additional notes..." onChange={e=>updCrop(i,'notes',e.target.value)} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {livestock.length > 0 && (
            <div style={{marginBottom:20}}>
              <div style={styles.secHead}>🐄 Livestock</div>
              {livestock.map((r, i) => (
                <div key={r.id||i} style={{...styles.card, borderRadius: i===0?'0 0 8px 8px':'8px', marginBottom:8}}>
                  <div style={{fontWeight:700,fontSize:15,marginBottom:12,color:'#6B0E1E'}}>
                    {r.budgetedType || 'Livestock ' + (i+1)}
                    {r.budgetedHead && <span style={{fontWeight:400,fontSize:12,color:'#6b7280',marginLeft:8}}>Budget: {r.budgetedHead} head</span>}
                  </div>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:12}}>
                    <div>
                      <label style={styles.label}>Actual Head Count</label>
                      <input style={styles.input} type="text" value={r.actualHead}
                        placeholder={r.budgetedHead||'0'}
                        onChange={e=>updLS(i,'actualHead',e.target.value.replace(/[^0-9.]/g,''))} />
                    </div>
                    <div>
                      <label style={styles.label}>Est. Weight (lbs)</label>
                      <input style={styles.input} type="text" value={r.estWeight}
                        placeholder="0" onChange={e=>updLS(i,'estWeight',e.target.value.replace(/[^0-9.]/g,''))} />
                    </div>
                  </div>
                  <div>
                    <label style={styles.label}>Condition</label>
                    <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
                      {CONDITIONS.map(c => (
                        <button key={c} type="button" onClick={()=>updLS(i,'condition',c)}
                          style={styles.condBtn(r.condition===c)}>{c}</button>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <button onClick={submitForm} style={styles.submitBtn}>
            ✅ Submit Inspection Form
          </button>
          <div style={{fontSize:11,color:'#9ca3af',textAlign:'center',marginTop:8}}>
            Your information will be sent securely to First Bank of Montana
          </div>
        </div>
      )}

      {step === 'submitting' && (
        <div style={{...styles.card, textAlign:'center', padding:40}}>
          <div style={{fontSize:32,marginBottom:12}}>⏳</div>
          <div style={{fontWeight:700,color:'#6b7280'}}>Submitting your form...</div>
        </div>
      )}

      {step === 'done' && (
        <div style={{...styles.card, textAlign:'center', padding:40, borderColor:'#22c55e'}}>
          <div style={{fontSize:48,marginBottom:12}}>✅</div>
          <div style={{fontWeight:700,fontSize:18,color:'#15803d',marginBottom:8}}>Form Submitted!</div>
          <div style={{color:'#6b7280',fontSize:14}}>
            Thank you. Your loan officer at First Bank of Montana will review your responses.
          </div>
        </div>
      )}

      {step === 'error' && (
        <div style={{...styles.card, borderColor:'#f87171'}}>
          <div style={{fontWeight:700,color:'#c44',marginBottom:8}}>Submission Error</div>
          <div style={{fontSize:14,color:'#6b7280'}}>{errorMsg}</div>
        </div>
      )}
    </div>
  );
}
