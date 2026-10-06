import { useState, useEffect } from "react";
import API from "../../api";
import ScanImage from "../shared/ScanImage";
import Disclaimer from "../shared/Disclaimer";
import AppIcon from "../shared/AppIcon";

const PROBLEMS = ['Acne/Pimples', 'Blackheads', 'Whiteheads', 'Scars', 'Redness',
  'Dark Spots', 'Cystic Acne', 'Oily Skin', 'Dryness',
  'Uneven Texture', 'Enlarged Pores', 'Hyperpigmentation'];

const SKIN_TYPES = [
  ['Oily', '✨', 'Shiny, large pores'],
  ['Dry', '💧', 'Tight, flaky skin'],
  ['Combination', '⚖️', 'Oily T-zone, dry cheeks'],
  ['Sensitive', '🌿', 'Easily irritated'],
  ['Normal', '✅', 'Balanced, few issues'],
];

const CONDITIONS = [
  ['hormonal', 'Hormonal Issues (PCOS, thyroid, irregular periods)'],
  ['dermaHistory', 'Previous Dermatology Treatments'],
  ['familyHistory', 'Family History of Acne'],
];

const PHOTO_TIPS = [
  ['✨', 'Clear face photo with no obstructions'],
  ['💡', 'Good natural lighting (face a window)'],
  ['🚫', 'No makeup or heavy skincare products'],
  ['📵', 'No filters, beauty mode, or editing'],
  ['📐', 'Front-facing, straight-on angle'],
  ['📷', 'High resolution (use main camera)'],
  ['🧼', 'Freshly cleansed, clean skin'],
  ['💇', 'Hair pulled back away from face'],
];

const buildSteps = (form, set, toggle) => [
  {
    title: 'Basic Personal Information',
    icon: '👤',
    why: 'Age and gender help improve analysis accuracy because acne causes differ by hormonal stages and age groups.',
    required: true,
    valid: form.name.trim() && form.age && form.gender,
    content: (
      <>
        <div className="g2">
          <div className="form-g">
            <label className="form-l">Full Name</label>
            <input className="form-i" placeholder="Your full name"
              value={form.name} onChange={e => set("name", e.target.value)} />
          </div>
          <div className="form-g">
            <label className="form-l">Age</label>
            <input className="form-i" type="number" placeholder="Your age"
              value={form.age} onChange={e => set("age", e.target.value)} />
          </div>
        </div>
        <div className="form-g">
          <label className="form-l">Gender</label>
          <div className="radio-grid">
            {['Male', 'Female', 'Other'].map(g => (
              <div key={g}
                className={`radio-item ${form.gender === g ? "sel" : ""}`}
                onClick={() => set("gender", g)}>{g}</div>
            ))}
          </div>
        </div>
        <div className="form-g">
          <label className="form-l">Contact Phone/Email</label>
          <input className="form-i" placeholder="92-3xx-xxxxxxx"
            value={form.contact} onChange={e => set("contact", e.target.value)} />
        </div>
      </>
    )
  },
  {
    title: 'Skin Type Assessment',
    icon: '🧴',
    why: 'Different skin types require completely different skincare products and routines.',
    required: true,
    valid: !!form.skinType,
    content: (
      <div className="radio-grid" style={{ gridTemplateColumns: 'repeat(auto-fill,minmax(130px,1fr))' }}>
        {SKIN_TYPES.map(([t, ic, desc]) => (
          <div key={t}
            className={`radio-item ${form.skinType === t ? "sel" : ""}`}
            onClick={() => set("skinType", t)}
            style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '0.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700 }}>
              <span><AppIcon emoji={ic} /></span>{t}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text3)' }}>{desc}</div>
          </div>
        ))}
      </div>
    )
  },
  {
    title: 'Current Skin Problems',
    icon: '⚠️',
    why: 'Knowing your skin concerns helps the AI understand broader skin conditions.',
    required: false,
    valid: form.problems.length > 0,
    content: (
      <>
        <div className="form-l" style={{ marginBottom: '0.75rem' }}>
          Select all that apply ({form.problems.length} selected)
        </div>
        <div className="check-grid">
          {PROBLEMS.map(p => (
            <div key={p}
              className={`check-item ${form.problems.includes(p) ? "sel" : ""}`}
              onClick={() => toggle("problems", p)}>
              <span>{form.problems.includes(p) ? "✓" : "○"}</span>{p}
            </div>
          ))}
        </div>
      </>
    )
  },
  {
    title: 'Acne Duration',
    icon: '⏱️',
    why: 'How long you have had acne affects treatment approach and severity classification.',
    required: false,
    valid: !!form.duration,
    content: (
      <div className="radio-grid">
        {['Less than 6 months', '6-12 months', '1-2 years', '2-5 years', '5+ years'].map(d => (
          <div key={d}
            className={`radio-item ${form.duration === d ? "sel" : ""}`}
            onClick={() => set("duration", d)}>{d}</div>
        ))}
      </div>
    )
  },
  {
    title: 'Lifestyle & Habits',
    icon: '🥗',
    why: 'Diet, sleep, stress, and exercise significantly impact skin health and acne severity.',
    required: false,
    valid: true,
    content: (
      <>
        <div className="form-g">
          <label className="form-l">Water Intake — {form.waterIntake} glasses/day</label>
          <div className="range-wrap">
            <input type="range" min="0" max="15" value={form.waterIntake}
              onChange={e => set("waterIntake", Number(e.target.value))} />
            <strong>{form.waterIntake}</strong>
          </div>
        </div>
        <div className="form-g">
          <label className="form-l">Average Sleep — {form.sleep} hours/night</label>
          <div className="range-wrap">
            <input type="range" min="3" max="12" value={form.sleep}
              onChange={e => set("sleep", Number(e.target.value))} />
            <strong>{form.sleep}</strong>
          </div>
        </div>
        <div className="form-g">
          <label className="form-l">Stress Level — {form.stress}/10</label>
          <div className="range-wrap">
            <input type="range" min="1" max="10" value={form.stress}
              onChange={e => set("stress", Number(e.target.value))} />
            <strong>{form.stress}</strong>
          </div>
        </div>
        <div className="form-g">
          <label className="form-l">Exercise Frequency</label>
          <select className="form-i" value={form.exercise}
            onChange={e => set("exercise", e.target.value)}>
            <option>Rarely/None</option>
            <option>1-2x/week</option>
            <option>3-4x/week</option>
            <option>Daily</option>
          </select>
        </div>
      </>
    )
  },
  {
    title: 'Medical History',
    icon: '🏥',
    why: 'Medical conditions, allergies, and medications can affect acne and treatment options.',
    required: false,
    valid: true,
    content: (
      <>
        <div className="form-g">
          <label className="form-l">Known Allergies</label>
          <input className="form-i" placeholder="E.g., Penicillin, latex, benzoyl peroxide..."
            value={form.allergies} onChange={e => set("allergies", e.target.value)} />
        </div>
        <div className="form-g">
          <label className="form-l">Current Medications</label>
          <input className="form-i" placeholder="E.g., Antibiotics, birth control, supplements..."
            value={form.medications} onChange={e => set("medications", e.target.value)} />
        </div>
        <div className="form-l" style={{ marginBottom: '0.65rem' }}>Select all that apply</div>
        {CONDITIONS.map(([k, label]) => (
          <div key={k}
            className={`check-item ${form.conditions.includes(k) ? "sel" : ""}`}
            style={{ marginBottom: '0.4rem' }}
            onClick={() => toggle("conditions", k)}>
            <span>{form.conditions.includes(k) ? "✓" : "○"}</span>{label}
          </div>
        ))}
      </>
    )
  },
  {
    title: 'Photo Capture Instructions',
    icon: '📸',
    why: 'Following these guidelines ensures the AI can accurately detect acne type and severity from your image.',
    required: false,
    valid: true,
    content: (
      <div className="image-tips">
        {PHOTO_TIPS.map(([ic, tip]) => (
          <div key={tip} className="img-tip">
            <span style={{ fontSize: '1.1rem' }}><AppIcon emoji={ic} /></span>
            <span>{tip}</span>
          </div>
        ))}
      </div>
    )
  }
];

export default function PatScan({ user, analyses, refresh, setAnalyses, notify, setPage }) {
  const [assessStep, setAssessStep] = useState(1);
  const [assessDone, setAssessDone] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [progress, setProgress] = useState(0);
  const [photoConsent, setPhotoConsent] = useState(false);
  const [showConsentWarning, setShowConsentWarning] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [elapsed, setElapsed] = useState(0);

  const [form, setForm] = useState({
    name:        user?.name || "",
    age:         user?.age || "",
    gender:      user?.gender || "",
    contact:     user?.phone || "",
    skinType:    user?.skinType || "",
    problems:    [],
    duration:    "",
    waterIntake: 8,
    sleep:       7,
    stress:      5,
    exercise:    "Rarely/None",
    allergies:   "",
    medications: "",
    conditions:  [],
  });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const toggle = (k, v) => setForm(f => ({
    ...f,
    [k]: f[k].includes(v) ? f[k].filter(x => x !== v) : [...f[k], v]
  }));

  // Backend se scan history lao
  useEffect(() => {
    API.get("/scans/my")
      .then(res => setAnalyses(res.data))
      .catch(err => console.log("History fetch failed:", err.message));
  }, []);

  // analysis ke dauran timer chalao
  useEffect(() => {
    if (!analyzing) { setElapsed(0); return; }
    const t = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(t);
  }, [analyzing]);

  const steps = buildSteps(form, set, toggle);
  const totalSteps = steps.length;
  const current = steps[assessStep - 1];

  const missingStep = steps.findIndex((s) => s.required && !s.valid);

  const completeAssessment = () => {
    if (missingStep !== -1) {
      setAssessStep(missingStep + 1);
      notify?.(`⚠️ Please complete step ${missingStep + 1}: ${steps[missingStep].title}`);
      return;
    }
    setAssessDone(true);
  };

  // sirf file select karo — abhi upload nahi
  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      notify("❌ Image too large. Maximum size is 5MB.");
      e.target.value = "";
      return;
    }

    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    e.target.value = "";
  };

  const clearPhoto = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setSelectedFile(null);
    setPreviewUrl("");
  };

  const reset = () => {
    clearPhoto();
    setResult(null);
    setAssessDone(false);
    setAssessStep(1);
    setProgress(0);
    setPhotoConsent(false);
    setShowConsentWarning(false);
  };

  // button dabane par asli upload
  const startAnalysis = async () => {
    if (!selectedFile) return;

    setAnalyzing(true);
    setProgress(0);

    const fd = new FormData();
    fd.append("image", selectedFile);
    fd.append("skinType", form.skinType);
    fd.append("questionnaire", JSON.stringify({
      name:        form.name,
      age:         Number(form.age) || 0,
      gender:      form.gender,
      contact:     form.contact,
      problems:    form.problems,
      duration:    form.duration,
      waterIntake: form.waterIntake,
      sleep:       form.sleep,
      stress:      form.stress,
      exercise:    form.exercise,
      allergies:   form.allergies,
      medications: form.medications,
      conditions:  form.conditions,
    }));

    try {
      const res = await API.post("/scans", fd, {
        onUploadProgress: (p) => {
          if (p.total) setProgress(Math.round((p.loaded * 100) / p.total));
        }
      });
      setResult(res.data);
      setAnalyses(prev => [res.data, ...prev]);
      notify("✅ AI Analysis complete!");
      refresh?.();
    } catch (err) {
      notify("❌ " + (err.response?.data?.message || "Analysis failed"));
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="assess-root">
      <div className="ph">
        <div className="pt">AI Skin Analysis</div>
        <div className="ps">Complete the assessment and upload your photo</div>
      </div>

      <Disclaimer variant="ai" />

      {!assessDone ? (
        /* ============ ASSESSMENT ============ */
        <div>
          <div className="assess-progress">
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.76rem', color: 'var(--text3)', marginBottom: '0.35rem' }}>
              <span>Step {assessStep} of {totalSteps}</span>
              <span>{Math.round((assessStep / totalSteps) * 100)}% Complete</span>
            </div>
            <div className="assess-prog-bar">
              <div className="assess-prog-fill" style={{ width: `${(assessStep / totalSteps) * 100}%` }} />
            </div>
          </div>

          <div className="assess-step">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.5rem' }}>
              <div style={{
                width: 40, height: 40, borderRadius: '10px',
                background: 'var(--pri-l)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.3rem', flexShrink: 0
              }}>
                <AppIcon emoji={current.icon} />
              </div>
              <div className="assess-step-title">{current.title}</div>
            </div>

            <div className="assess-step-why">
              <strong>Why we ask:</strong> {current.why}
            </div>

            {current.content}

            <div className="assess-nav">
              <button className="btn btn-ghost"
                onClick={() => setAssessStep(s => s - 1)}
                disabled={assessStep === 1}>
                ← Back
              </button>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {!current.required && assessStep < totalSteps && (
                  <button className="btn btn-ghost"
                    onClick={() => setAssessStep(s => s + 1)}>
                    Skip
                  </button>
                )}

                {assessStep < totalSteps ? (
                  <button className="btn btn-pri"
                    onClick={() => setAssessStep(s => s + 1)}
                    disabled={current.required && !current.valid}>
                    Next Step →
                  </button>
                ) : (
                  <button className="btn btn-pri" onClick={completeAssessment}>
                    Complete Assessment
                  </button>
                )}
              </div>
            </div>

            <div style={{
              fontSize: '0.76rem',
              marginTop: '0.6rem',
              textAlign: 'right',
              color: current.required && !current.valid ? 'var(--dan)' : 'var(--text3)',
            }}>
              {current.required
                ? (current.valid ? <><AppIcon name="check" /> Complete</> : '* This step is required')
                : 'Optional — you can skip this step'}
            </div>
          </div>
        </div>

      ) : !result ? (
        !analyzing ? (
          /* ============ UPLOAD ============ */
          <div className="card" style={{ marginBottom: 0 }}>
            <div className="card-h">
              <div className="card-t">Upload Skin Photo</div>
              <span className="badge b-confirmed">Assessment Complete</span>
            </div>
            <div className="card-b">
              <div className="alert al-ok">
                Pre-analysis assessment complete. Upload your photo to proceed.
              </div>

              {/* CONSENT */}
              <div
                className={showConsentWarning ? "shake" : ""}
                onClick={() => { setPhotoConsent(!photoConsent); setShowConsentWarning(false); }}
                style={{
                  display: "flex", gap: "0.75rem", alignItems: "flex-start",
                  padding: "1rem", marginBottom: "1rem", cursor: "pointer",
                  borderRadius: "var(--r)",
                  border: photoConsent ? "2px solid var(--ok)"
                    : showConsentWarning ? "2px solid var(--dan)"
                    : "2px solid var(--acc)",
                  background: photoConsent ? "var(--ok-l)"
                    : showConsentWarning ? "var(--dan-l)"
                    : "var(--acc-l)",
                }}
              >
                <div style={{
                  width: 24, height: 24, borderRadius: 6, flexShrink: 0, marginTop: 2,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "0.9rem", fontWeight: 700, color: "#fff",
                  border: photoConsent ? "none" : "2px solid var(--text3)",
                  background: photoConsent ? "var(--ok)" : "#fff",
                }}>
                  {photoConsent ? <AppIcon name="check" /> : ""}
                </div>

                <div>
                  <div style={{ fontWeight: 700, fontSize: "0.88rem", marginBottom: "0.3rem" }}>
                    {photoConsent ? <><AppIcon name="check" /> Consent given</> : <><AppIcon name="shield" /> Photo consent required</>}
                  </div>
                  <div style={{ fontSize: "0.8rem", lineHeight: 1.65, color: "var(--text2)" }}>
                    I consent to AcneCare AI storing my facial image for analysis and
                    sharing it with dermatologists I book. I can delete it at any time
                    from my profile.
                  </div>
                </div>
              </div>

              {showConsentWarning && (
                <div className="alert al-dan" style={{
                  fontSize: "0.9rem", fontWeight: 700,
                  padding: "1rem", border: "2px solid var(--dan)",
                }}>
                  <span style={{ fontSize: "1.2rem" }}><AppIcon name="alert" /></span>
                  Please tick the consent box above before uploading your photo.
                </div>
              )}

              {!selectedFile ? (
                /* ---- no photo yet ---- */
                <>
                  <div onClick={() => {
                    if (!photoConsent) {
                      setShowConsentWarning(false);
                      setTimeout(() => setShowConsentWarning(true), 10);
                    }
                  }}>
                    <label
                      className="upload-zone"
                      style={{
                        opacity: photoConsent ? 1 : 0.55,
                        pointerEvents: photoConsent ? "auto" : "none",
                      }}
                    >
                      <input
                        type="file"
                        className="upload-input"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handleFile}
                      />
                      <div style={{ fontSize: "2.5rem", marginBottom: "0.65rem" }}><AppIcon name="cameraAdd" /></div>
                      <div style={{ fontWeight: 700, marginBottom: "0.35rem", fontSize: "0.95rem" }}>
                        Drop image or click to upload
                      </div>
                      <div style={{ fontSize: "0.8rem", color: "var(--text3)" }}>
                        JPG, PNG, WEBP • Max 5MB • Clear face photo
                      </div>
                    </label>
                  </div>

                  <div className="image-tips">
                    {PHOTO_TIPS.slice(0, 4).map(([ic, tip]) => (
                      <div key={tip} className="img-tip"><span><AppIcon emoji={ic} /></span><span>{tip}</span></div>
                    ))}
                  </div>
                </>
              ) : (
                /* ---- photo selected: preview + analyse ---- */
                <div>
                  <div style={{
                    border: "2px solid var(--ok)",
                    borderRadius: "var(--r)",
                    padding: "0.85rem",
                    background: "var(--ok-l)",
                    marginBottom: "1rem",
                  }}>
                    
                    <div style={{ fontWeight: 700, fontSize: "0.88rem", marginBottom: "0.75rem" }}>
                      <AppIcon name="check" /> Photo ready
                    </div>

                    <img
                      src={previewUrl}
                      alt="Selected"
                      style={{
                        width: "100%", maxWidth: 180, borderRadius: 10,
                        display: "block", margin: "0 auto 0.85rem",
                        border: "1px solid var(--border)",
                      }}
                    />

                    <div style={{
                      fontSize: "0.78rem", color: "var(--text2)",
                      textAlign: "center", marginBottom: "0.85rem",
                    }}>
                      {selectedFile.name} · {(selectedFile.size / 1024).toFixed(0)} KB
                    </div>

                    <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center", flexWrap: "wrap" }}>
                      <label className="btn btn-ghost btn-sm" style={{ cursor: "pointer" }}>
                        <input type="file" style={{ display: "none" }}
                          accept="image/jpeg,image/png,image/webp"
                          onChange={handleFile} />
                        <AppIcon name="activity" /> Change Photo
                      </label>
                      <button className="btn btn-ghost btn-sm" onClick={clearPhoto}>
                        <AppIcon name="trash" /> Remove
                      </button>
                    </div>
                  </div>

                  <button
                    className="btn btn-pri btn-lg btn-full"
                    onClick={startAnalysis}
                  >
                    <AppIcon name="activity" /> Start AI Analysis
                  </button>
                </div>
              )}

              <button className="btn btn-ghost btn-full" style={{ marginTop: "0.75rem" }}
                onClick={() => setAssessDone(false)}>
                Edit Assessment
              </button>
            </div>
          </div>

        ) : (
          /* ============ PROCESSING ============ */
          <div className="card">
            <div className="card-h">
              <div className="card-t"><AppIcon name="activity" /> AI Analysis in Progress</div>
            </div>
            <div className="card-b" style={{ textAlign: 'center', padding: '2rem 1rem' }}>

              {previewUrl && (
                <img src={previewUrl} alt="Analysing"
                  style={{
                    width: 130, height: 130, objectFit: "cover",
                    borderRadius: "50%", margin: "0 auto 1.25rem",
                    display: "block", border: "3px solid var(--pri)",
                    opacity: 0.85,
                  }} />
              )}

              <div style={{ fontWeight: 700, marginBottom: '0.5rem', fontSize: '1rem' }}>
                {progress < 100 ? "Uploading your photo..." : "Analysing your skin..."}
              </div>

              <div style={{ fontSize: '0.84rem', color: 'var(--text3)', marginBottom: '1.25rem' }}>
                {progress < 100
                  ? "Sending your image securely"
                  : "Detecting acne type, severity and confidence"}
              </div>

              <div className="prog-bar">
                <div className="prog-fill" style={{ width: `${progress}%` }} />
              </div>

              <div style={{
                marginTop: '0.75rem', fontSize: '0.82rem',
                color: 'var(--text2)', display: 'flex',
                justifyContent: 'center', gap: '1.25rem',
              }}>
                <span><AppIcon name="upload" /> {progress}%</span>
                <span><AppIcon name="clock" /> {elapsed}s</span>
              </div>

              <div style={{ marginTop: '1.25rem', fontSize: '0.74rem', color: 'var(--text3)' }}>
                This usually takes 3–5 seconds
              </div>
            </div>
          </div>
        )

      ) : (
        /* ============ RESULT ============ */
        <>
          <div className="an-result" style={{ marginBottom: '1rem' }}>
            <div className="an-h">
              <div className="an-ic"><AppIcon name="activity" /></div>
              <div>
                <div className="an-t">{result.atype}</div>
                <div style={{ fontSize: '0.78rem', opacity: 0.65 }}>Detected Type</div>
              </div>
              <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                <div style={{ fontSize: '1.4rem', fontWeight: 700 }}>{result.sev}</div>
                <div style={{ fontSize: '0.72rem', opacity: 0.65 }}>Severity</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem', margin: '0.85rem 0' }}>
              {[['SEVERITY', result.sev],
                ['CONFIDENCE', `${result.conf}%`],
                ['SKIN TYPE', result.skinType || form.skinType || '—']].map(([k, v]) => (
                <div key={k} style={{
                  background: 'rgba(255,255,255,0.08)',
                  borderRadius: 8, padding: '0.6rem', textAlign: 'center'
                }}>
                  <div style={{ fontSize: '0.68rem', opacity: 0.65, marginBottom: '0.25rem' }}>{k}</div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{v}</div>
                </div>
              ))}
            </div>

            <div className="conf-lbl">
              <span>AI Confidence</span>
              <span>{result.conf}%</span>
            </div>
            <div className="conf-track">
              <div className="conf-fill" style={{ width: `${result.conf}%` }} />
            </div>

            {result.probs && Object.keys(result.probs).length > 0 && (
              <div className="probs-grid">
                {Object.entries(result.probs).map(([k, v]) => (
                  <div key={k} className="prob-item">
                    <div className="prob-n">{k}</div>
                    <div className="prob-v">{Math.round(v)}%</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {result.cystFlag && (
            <div className="alert al-warn" style={{ borderWidth: 2 }}>
              <div>
                <strong><AppIcon name="alert" /> Possible cystic acne detected</strong>
                <div style={{ marginTop: '0.4rem', lineHeight: 1.7 }}>
                  Some features in your scan may indicate cystic acne, which usually
                  needs prescription treatment. We recommend booking a dermatologist
                  consultation to confirm.
                </div>
                <button className="btn btn-pri btn-sm" style={{ marginTop: '0.75rem' }}
                  onClick={() => setPage("book")}>
                  <AppIcon name="doctor" /> Book a Dermatologist
                </button>
              </div>
            </div>
          )}

          {result.conf < 80 && (
            <div className="alert al-warn">
              <AppIcon name="alert" /> This analysis has lower confidence than usual. For an accurate
              assessment, we recommend consulting a dermatologist.
            </div>
          )}

          <div className="card">
            <div className="card-h">
              <div className="card-t">Analysed Image</div>
            </div>
            <div className="card-b">
              <ScanImage
                scanId={result._id}
                style={{ width: "100%", maxWidth: 220, borderRadius: 12, display: "block", margin: "0 auto" }}
              />
            </div>
          </div>

          <div className="card">
            <div className="card-h">
              <div className="card-t">About {result.atype}</div>
            </div>
            <div className="card-b">
              <div style={{ fontSize: '0.86rem', color: 'var(--text2)', lineHeight: 1.7 }}>
                {result.atype} are a common form of acne that affects people of all ages.
                Based on our analysis, your condition is classified as <strong>{result.sev}</strong> severity.
                With proper treatment and skincare routine, significant improvement can be seen within 6-8 weeks.
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-h">
              <div className="card-t">Next Steps</div>
            </div>
            <div className="card-b">
              <div className="alert al-ok">
                Analysis saved! You can now view your diet plan or book a dermatologist.
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <button className="btn btn-pri btn-sm" onClick={() => setPage("diet")}>View Diet Plan</button>
                <button className="btn btn-pri btn-sm" onClick={() => setPage("routine")}>View Routine</button>
                <button className="btn btn-pri btn-sm" onClick={() => setPage("book")}>Book Doctor</button>
                <button className="btn btn-ghost btn-sm" onClick={reset}>New Scan</button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
