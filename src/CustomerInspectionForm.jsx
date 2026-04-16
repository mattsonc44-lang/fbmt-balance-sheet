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

const INSP_SH = '#1a4731';
const INSP_TH = '#1a4731';
const INSP_TH_S = { background: INSP_TH, color: 'white', padding: '8px 10px', fontWeight: 700, fontSize: 12, textAlign: 'center', borderRight: '1px solid rgba(255,255,255,.15)' };
const INSP_TD_S = { padding: '8px 10px', borderBottom: '1px solid #f0f0f0', verticalAlign: 'middle' };

const devPct = (actual, budgeted) => {
  const a = parseFloat(actual) || 0, b = parseFloat(budgeted) || 0;
  if (!b) return null;
  return ((a - b) / b) * 100;
};

const devStyle = pct => {
  if (pct === null) return {};
  const abs = Math.abs(pct);
  if (abs >= 20) return { background: '#fef2f2', borderLeft: '4px solid #dc2626' };
  if (abs >= 10) return { background: '#fffbeb', borderLeft: '4px solid #f59e0b' };
  return { background: '#f0fdf4', borderLeft: '4px solid #22c55e' };
};

const devBadge = pct => {
  if (pct === null || Math.abs(pct) < 0.5) return null;
  const abs = Math.abs(pct); const pos = pct > 0;
  const color = abs >= 20 ? '#dc2626' : abs >= 10 ? '#d97706' : '#16a34a';
  return (
    <span style={{ fontSize: 10, fontWeight: 700, color, background: color + '18', padding: '1px 6px', borderRadius: 999, whiteSpace: 'nowrap' }}>
      {pos ? '+' : ''}{pct.toFixed(1)}%
    </span>
  );
};

const CONDITIONS = ['Excellent', 'Good', 'Fair', 'Poor'];

const CondPills = ({ value, onChange }) => (
  <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
    {CONDITIONS.map(c => (
      <button key={c} type="button" onClick={() => onChange(c)}
        style={{ padding: '4px 10px', borderRadius: 12, border: value === c ? 'none' : '1px solid #d1d5db', background: value === c ? (c === 'Excellent' ? '#22c55e' : c === 'Good' ? '#3b82f6' : c === 'Fair' ? '#f59e0b' : '#ef4444') : 'white', color: value === c ? 'white' : '#6b7280', cursor: 'pointer', fontSize: 11, fontWeight: value === c ? 700 : 400 }}>
        {c}
      </button>
    ))}
  </div>
);

export default function CustomerInspectionForm() {
  const [step, setStep] = useState('pin');
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');
  const [shareRecord, setShareRecord] = useState(null);
  const [crops, setCrops] = useState([]);
  const [livestock, setLivestock] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const shareId = new URLSearchParams(window.location.search).get('id');

  useEffect(() => { if (!shareId) setErrorMsg('Invalid link.'); }, []);

  const submitPin = async () => {
    setPinError('');
    try {
      const resp = await fetch(SUPABASE_URL + '/rest/v1/inspection_shares?share_id=eq.' + shareId, { headers: supaHeaders() });
      const rows = await resp.json();
      if (!rows.length) { setPinError('Link not found or expired.'); return; }
      const record = rows[0];
      if (record.pin !== pinInput.trim()) { setPinError('Incorrect PIN — please try again.'); return; }
      if (record.expires_at && new Date(record.expires_at) < new Date()) { setPinError('This link has expired. Please contact your loan officer.'); return; }
      setShareRecord(record);
      setCrops((record.insp_data?.inspCrops || []).map(r => ({ ...r, actualAcres: r.actualAcres || '', condition: r.condition || '', actualYield: r.actualYield || '', location: r.location || '', deviationReason: r.deviationReason || '' })));
      setLivestock((record.insp_data?.inspLivestock || []).map(r => ({ ...r, actualHead: r.actualHead || '', condition: r.condition || '', estWeight: r.estWeight || '', deviationReason: r.deviationReason || '' })));
      setStep('form');
    } catch (e) { setPinError('Error: ' + e.message); }
  };

  const updCrop = (id, field, val) => setCrops(c => c.map(r => r.id === id ? { ...r, [field]: val } : r));
  const updLS = (id, field, val) => setLivestock(l => l.map(r => r.id === id ? { ...r, [field]: val } : r));

  const canSubmit = () => {
    for (const r of crops) {
      const pct = devPct(r.actualAcres, r.budgetedAcres);
      if (r.actualAcres && pct !== null && Math.abs(pct) >= 20 && !r.deviationReason.trim()) return false;
    }
    for (const r of livestock) {
      const pct = devPct(r.actualHead, r.budgetedHead);
      if (r.actualHead && pct !== null && Math.abs(pct) >= 20 && !r.deviationReason.trim()) return false;
    }
    return true;
  };

  const submitForm = async () => {
    if (!canSubmit()) { alert('Please provide a reason for all deviations over 20%.'); return; }
    setSubmitting(true);
    try {
      const response = { crops, livestock, submittedAt: new Date().toISOString() };
      const resp = await fetch(SUPABASE_URL + '/rest/v1/inspection_shares?share_id=eq.' + shareId, {
        method: 'PATCH', headers: supaHeaders(),
        body: JSON.stringify({ response, responded_at: new Date().toISOString() }),
      });
      if (!resp.ok) throw new Error(await resp.text());
      setStep('done');
    } catch (e) { setErrorMsg(e.message); setStep('error'); }
    setSubmitting(false);
  };

  if (step === 'pin') return (
    <div style={{ fontFamily: 'Arial,sans-serif', maxWidth: 420, margin: '60px auto', padding: '0 16px' }}>
      <div style={{ background: '#6B0E1E', color: 'white', borderRadius: '10px 10px 0 0', padding: '18px 22px' }}>
        <div style={{ fontWeight: 900, fontSize: 13, letterSpacing: '.05em', marginBottom: 2 }}>FIRST BANK OF MONTANA</div>
        <div style={{ fontWeight: 700, fontSize: 18 }}>Crop Inspection Form</div>
      </div>
      <div style={{ background: 'white', border: '1px solid #e5e7eb', borderTop: 'none', borderRadius: '0 0 10px 10px', padding: 24 }}>
        <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 8 }}>Enter Your PIN</div>
        <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 16 }}>Your loan officer at First Bank of Montana sent you this link. Enter the 6-digit PIN they provided.</div>
        <input style={{ width: '100%', border: '1.5px solid #d1d5db', borderRadius: 6, padding: '10px 0', fontSize: 24, fontFamily: 'monospace', letterSpacing: '.3em', textAlign: 'center', boxSizing: 'border-box', outline: 'none', marginBottom: 12 }}
          type="text" maxLength={6} value={pinInput}
          onChange={e => setPinInput(e.target.value.replace(/\D/g, ''))}
          onKeyDown={e => e.key === 'Enter' && submitPin()}
          placeholder="000000" autoFocus />
        {(pinError || errorMsg) && <div style={{ color: '#c44', fontSize: 13, marginBottom: 10 }}>&#9888; {pinError || errorMsg}</div>}
        <button onClick={submitPin} style={{ width: '100%', background: '#6B0E1E', color: 'white', border: 'none', borderRadius: 7, padding: 12, fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>Open Form</button>
      </div>
    </div>
  );

  if (step === 'done') return (
    <div style={{ fontFamily: 'Arial,sans-serif', textAlign: 'center', padding: '60px 20px' }}>
      <div style={{ fontSize: 52, marginBottom: 12 }}>&#10003;</div>
      <div style={{ fontWeight: 800, fontSize: 22, color: INSP_SH, marginBottom: 8 }}>Form Submitted!</div>
      <p style={{ color: '#6b7280', fontSize: 14, maxWidth: 360, margin: '0 auto' }}>Thank you. Your loan officer at First Bank of Montana will review your responses.</p>
    </div>
  );

  if (step === 'error') return <div style={{ fontFamily: 'Arial,sans-serif', padding: 32, color: '#c44' }}><strong>Error:</strong> {errorMsg}</div>;

  const hasMissingReasons = !canSubmit();

  return (
    <div style={{ fontFamily: 'Arial,sans-serif', maxWidth: 1100, margin: '0 auto', padding: '20px 16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20, flexWrap: 'wrap', gap: 10 }}>
        <div>
          <div style={{ fontWeight: 800, fontSize: 18, color: INSP_SH }}>Crop Inspection Form</div>
          <div style={{ fontSize: 12, color: '#6b7280' }}>{shareRecord?.client_name} - Fill in your actual acres, yield, and condition below</div>
        </div>
        <button onClick={submitForm} disabled={submitting}
          style={{ background: hasMissingReasons ? '#9ca3af' : '#1a4731', color: 'white', border: 'none', borderRadius: 6, padding: '9px 22px', fontWeight: 700, fontSize: 13, cursor: hasMissingReasons ? 'not-allowed' : 'pointer' }}>
          {submitting ? 'Submitting...' : hasMissingReasons ? 'Enter Missing Reasons' : 'Submit Form'}
        </button>
      </div>

      <div style={{ display: 'flex', gap: 16, marginBottom: 14, flexWrap: 'wrap' }}>
        {[['#22c55e', 'On Budget (under 10%)'], ['#f59e0b', 'Minor Deviation (10-20%)'], ['#dc2626', 'Major Deviation (over 20%) - reason required']].map(([c, l]) => (
          <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: '#374151' }}>
            <div style={{ width: 10, height: 10, borderRadius: 2, background: c }} />{l}
          </div>
        ))}
      </div>

      {crops.length > 0 && (
        <div style={{ background: 'white', borderRadius: 8, border: '1px solid #d1fae5', marginBottom: 20, overflow: 'hidden' }}>
          <div style={{ background: INSP_TH, padding: '10px 16px', color: 'white', fontWeight: 700, fontSize: 14 }}>CROP CONDITION - Budget vs. Actual</div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12.5 }}>
              <thead>
                <tr>
                  <th style={{ ...INSP_TH_S, textAlign: 'left', minWidth: 100 }}>Crop</th>
                  <th style={{ ...INSP_TH_S, minWidth: 80, background: '#374151' }}>Budget Ac</th>
                  <th style={{ ...INSP_TH_S, minWidth: 80 }}>Actual Ac</th>
                  <th style={{ ...INSP_TH_S, minWidth: 70 }}>Deviation</th>
                  <th style={{ ...INSP_TH_S, textAlign: 'left', minWidth: 90 }}>Location</th>
                  <th style={{ ...INSP_TH_S, minWidth: 190 }}>Condition</th>
                  <th style={{ ...INSP_TH_S, minWidth: 100 }}>Yield / Acre</th>
                  <th style={{ ...INSP_TH_S, minWidth: 80, background: '#374151' }}>Budget Price</th>
                  <th style={{ ...INSP_TH_S, minWidth: 85 }}>Total Value</th>
                </tr>
              </thead>
              <tbody>
                {crops.map((r, i) => {
                  const pct = devPct(r.actualAcres, r.budgetedAcres);
                  const rowBg = i % 2 === 0 ? 'white' : '#f9fafb';
                  const ds = r.actualAcres ? devStyle(pct) : {};
                  const totalVal = (parseFloat(r.actualAcres || r.budgetedAcres) || 0) * (parseFloat(r.actualYield || r.budgetedYield) || 0) * (parseFloat(r.budgetedPrice) || 0);
                  const showReasonRow = r.actualAcres && pct !== null && Math.abs(pct) >= 20;
                  return (
                    <React.Fragment key={r.id || i}>
                      <tr style={{ background: ds.background || rowBg, ...(ds.borderLeft ? { borderLeft: ds.borderLeft } : {}) }}>
                        <td style={INSP_TD_S}><div style={{ fontWeight: 600, fontSize: 13 }}>{r.budgetedCrop || '---'}</div></td>
                        <td style={{ ...INSP_TD_S, textAlign: 'center', background: '#f8f6f2' }}>
                          <div style={{ fontSize: 13, fontWeight: 600, color: '#6b7280' }}>{r.budgetedAcres || '---'}</div>
                          <div style={{ fontSize: 10, color: '#9ca3af' }}>budgeted</div>
                        </td>
                        <td style={INSP_TD_S}>
                          <input type="text" value={r.actualAcres} placeholder={r.budgetedAcres || '0'}
                            onChange={e => updCrop(r.id, 'actualAcres', e.target.value.replace(/[^0-9.]/g, ''))}
                            style={{ border: '1.5px solid #6B0E1E', borderRadius: 4, padding: '5px 8px', fontSize: 13, width: '100%', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box', background: '#fdf9f9', fontWeight: 600, textAlign: 'center' }} />
                        </td>
                        <td style={{ ...INSP_TD_S, textAlign: 'center' }}>
                          {r.actualAcres && r.budgetedAcres ? (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                              {devBadge(pct)}
                              <div style={{ fontSize: 10, color: '#6b7280' }}>{(parseFloat(r.actualAcres || 0) - parseFloat(r.budgetedAcres || 0) > 0 ? '+' : '')}{(parseFloat(r.actualAcres || 0) - parseFloat(r.budgetedAcres || 0)).toFixed(0)} ac</div>
                            </div>
                          ) : <span style={{ color: '#d1d5db' }}>---</span>}
                        </td>
                        <td style={INSP_TD_S}><input type="text" value={r.location} placeholder="Field/Sec" onChange={e => updCrop(r.id, 'location', e.target.value)} style={{ border: '1px solid #d1d5db', borderRadius: 4, padding: '5px 8px', fontSize: 13, width: '100%', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }} /></td>
                        <td style={INSP_TD_S}><CondPills value={r.condition} onChange={v => updCrop(r.id, 'condition', v)} /></td>
                        <td style={INSP_TD_S}>
                          <div style={{ display: 'flex', gap: 3 }}>
                            <input type="text" value={r.actualYield} placeholder={r.budgetedYield || '0'}
                              onChange={e => updCrop(r.id, 'actualYield', e.target.value.replace(/[^0-9.]/g, ''))}
                              style={{ border: '1.5px solid #6B0E1E', borderRadius: 4, padding: '5px 8px', fontSize: 13, flex: 1, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box', background: '#fdf9f9', fontWeight: 600, textAlign: 'center' }} />
                            <div style={{ fontSize: 11, color: '#6b7280', alignSelf: 'center', whiteSpace: 'nowrap' }}>{r.budgetedUnit || 'bu'}</div>
                          </div>
                          {r.budgetedYield && <div style={{ fontSize: 10, color: '#9ca3af' }}>budget: {r.budgetedYield}</div>}
                        </td>
                        <td style={{ ...INSP_TD_S, textAlign: 'center', background: '#f8f6f2' }}>
                          <div style={{ fontSize: 13, fontWeight: 600, color: '#6b7280' }}>${r.budgetedPrice || '---'}</div>
                          <div style={{ fontSize: 10, color: '#9ca3af' }}>locked</div>
                        </td>
                        <td style={{ ...INSP_TD_S, textAlign: 'right', fontWeight: 700, color: '#15803d', whiteSpace: 'nowrap' }}>{totalVal > 0 ? '$' + Math.round(totalVal).toLocaleString() : '---'}</td>
                      </tr>
                      {showReasonRow && (
                        <tr style={{ background: '#fef2f2' }}>
                          <td colSpan={9} style={{ padding: '6px 10px 8px 32px', borderBottom: '1px solid #f0f0f0' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <span style={{ fontSize: 11, fontWeight: 700, color: '#dc2626', whiteSpace: 'nowrap' }}>Deviation reason (required):</span>
                              <input type="text" value={r.deviationReason} placeholder="Required - explain major deviation from budget..."
                                onChange={e => updCrop(r.id, 'deviationReason', e.target.value)}
                                style={{ flex: 1, border: '1px solid #fca5a5', borderRadius: 4, padding: '5px 8px', fontSize: 13, fontFamily: 'inherit', outline: 'none', background: 'white' }} />
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
              <tfoot>
                <tr style={{ background: '#ecfdf5' }}>
                  <td colSpan={8} style={{ ...INSP_TD_S, textAlign: 'right', fontWeight: 700, color: INSP_SH, fontSize: 13 }}>CROP TOTAL</td>
                  <td style={{ ...INSP_TD_S, textAlign: 'right', fontWeight: 700, color: '#15803d', fontSize: 14 }}>
                    ${Math.round(crops.reduce((s, r) => s + (parseFloat(r.actualAcres || r.budgetedAcres) || 0) * (parseFloat(r.actualYield || r.budgetedYield) || 0) * (parseFloat(r.budgetedPrice) || 0), 0)).toLocaleString()}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      {livestock.length > 0 && (
        <div style={{ background: 'white', borderRadius: 8, border: '1px solid #d1fae5', marginBottom: 20, overflow: 'hidden' }}>
          <div style={{ background: INSP_TH, padding: '10px 16px', color: 'white', fontWeight: 700, fontSize: 14 }}>LIVESTOCK</div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12.5 }}>
              <thead>
                <tr>
                  <th style={{ ...INSP_TH_S, textAlign: 'left', minWidth: 120 }}>Type</th>
                  <th style={{ ...INSP_TH_S, minWidth: 80, background: '#374151' }}>Budget Head</th>
                  <th style={{ ...INSP_TH_S, minWidth: 80 }}>Actual Head</th>
                  <th style={{ ...INSP_TH_S, minWidth: 70 }}>Deviation</th>
                  <th style={{ ...INSP_TH_S, minWidth: 190 }}>Condition</th>
                  <th style={{ ...INSP_TH_S, minWidth: 100 }}>Est. Weight</th>
                </tr>
              </thead>
              <tbody>
                {livestock.map((r, i) => {
                  const pct = devPct(r.actualHead, r.budgetedHead);
                  const rowBg = i % 2 === 0 ? 'white' : '#f9fafb';
                  const ds = r.actualHead ? devStyle(pct) : {};
                  const showReasonRow = r.actualHead && pct !== null && Math.abs(pct) >= 20;
                  return (
                    <React.Fragment key={r.id || i}>
                      <tr style={{ background: ds.background || rowBg, ...(ds.borderLeft ? { borderLeft: ds.borderLeft } : {}) }}>
                        <td style={INSP_TD_S}><div style={{ fontWeight: 600, fontSize: 13 }}>{r.budgetedType || '---'}</div></td>
                        <td style={{ ...INSP_TD_S, textAlign: 'center', background: '#f8f6f2' }}>
                          <div style={{ fontSize: 13, fontWeight: 600, color: '#6b7280' }}>{r.budgetedHead || '---'}</div>
                          <div style={{ fontSize: 10, color: '#9ca3af' }}>budgeted</div>
                        </td>
                        <td style={INSP_TD_S}>
                          <input type="text" value={r.actualHead} placeholder={r.budgetedHead || '0'}
                            onChange={e => updLS(r.id, 'actualHead', e.target.value.replace(/[^0-9.]/g, ''))}
                            style={{ border: '1.5px solid #6B0E1E', borderRadius: 4, padding: '5px 8px', fontSize: 13, width: '100%', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box', background: '#fdf9f9', fontWeight: 600, textAlign: 'center' }} />
                        </td>
                        <td style={{ ...INSP_TD_S, textAlign: 'center' }}>
                          {r.actualHead && r.budgetedHead ? (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                              {devBadge(pct)}
                              <div style={{ fontSize: 10, color: '#6b7280' }}>{(parseFloat(r.actualHead || 0) - parseFloat(r.budgetedHead || 0) > 0 ? '+' : '')}{(parseFloat(r.actualHead || 0) - parseFloat(r.budgetedHead || 0)).toFixed(0)} hd</div>
                            </div>
                          ) : <span style={{ color: '#d1d5db' }}>---</span>}
                        </td>
                        <td style={INSP_TD_S}><CondPills value={r.condition} onChange={v => updLS(r.id, 'condition', v)} /></td>
                        <td style={INSP_TD_S}>
                          <input type="text" value={r.estWeight} placeholder="0 lbs"
                            onChange={e => updLS(r.id, 'estWeight', e.target.value.replace(/[^0-9.]/g, ''))}
                            style={{ border: '1px solid #d1d5db', borderRadius: 4, padding: '5px 8px', fontSize: 13, width: '100%', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }} />
                        </td>
                      </tr>
                      {showReasonRow && (
                        <tr style={{ background: '#fef2f2' }}>
                          <td colSpan={6} style={{ padding: '6px 10px 8px 32px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <span style={{ fontSize: 11, fontWeight: 700, color: '#dc2626', whiteSpace: 'nowrap' }}>Deviation reason (required):</span>
                              <input type="text" value={r.deviationReason} placeholder="Required - explain major deviation from budget..."
                                onChange={e => updLS(r.id, 'deviationReason', e.target.value)}
                                style={{ flex: 1, border: '1px solid #fca5a5', borderRadius: 4, padding: '5px 8px', fontSize: 13, fontFamily: 'inherit', outline: 'none', background: 'white' }} />
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
        </div>
      )}

      {hasMissingReasons && (
        <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 8, padding: '10px 16px', marginBottom: 12, fontSize: 13, color: '#dc2626', fontWeight: 600 }}>
          Please fill in the deviation reason for all rows highlighted in red before submitting.
        </div>
      )}
      <button onClick={submitForm} disabled={submitting}
        style={{ width: '100%', background: hasMissingReasons ? '#9ca3af' : '#6B0E1E', color: 'white', border: 'none', borderRadius: 8, padding: 14, fontWeight: 700, fontSize: 16, cursor: hasMissingReasons ? 'not-allowed' : 'pointer', marginBottom: 8 }}>
        {submitting ? 'Submitting...' : hasMissingReasons ? 'Enter Missing Reasons First' : 'Submit Inspection Form'}
      </button>
      <div style={{ fontSize: 11, color: '#9ca3af', textAlign: 'center' }}>Your information will be sent securely to First Bank of Montana</div>
    </div>
  );
}
