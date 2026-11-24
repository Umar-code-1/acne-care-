import { useState, useEffect } from "react";
import API from "../../api";
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

const UPLOAD_TIPS = [
  ['sun', 'Use natural lighting'],
  ['faceScan', 'Keep your face visible'],
  ['star', 'Avoid filters or editing'],
  ['drop', 'Avoid heavy makeup'],
];

const MIN_AGE = 1;
const isAgeTooLow = (age) => age !== "" && Number(age) < MIN_AGE;

const buildSteps = (form, set, toggle) => [
  {
    title: 'Basic Personal Information',
    icon: '👤',
    required: true,
    valid: form.name.trim() && Number.isInteger(Number(form.age)) && Number(form.age) >= MIN_AGE && Number(form.age) <= 120 && form.gender,
    content: (
      <>
        <div className="assess-personal-fields">
          <div className="form-g">
            <label className="form-l" htmlFor="assessment-name">Full Name <span aria-hidden="true">*</span></label>
            <input id="assessment-name" className="form-i" placeholder="Your full name"
              value={form.name} onChange={e => set("name", e.target.value)} required />
          </div>
          <div className="form-g">
            <label className="form-l" htmlFor="assessment-age">Age <span aria-hidden="true">*</span></label>
            <input id="assessment-age" className="form-i" type="number" placeholder="Years" step="1"
              value={form.age} onChange={e => set("age", e.target.value)} min={MIN_AGE} max="120" required
              aria-invalid={isAgeTooLow(form.age)} aria-describedby={isAgeTooLow(form.age) ? "assessment-age-error" : undefined} />
          </div>
          {isAgeTooLow(form.age) && (
            <p className="assess-age-error" id="assessment-age-error" role="alert">Age must be greater than 0.</p>
          )}
        </div>
        <div className="form-g">
          <label className="form-l">Gender <span aria-hidden="true">*</span></label>
          <div className="radio-grid" role="group" aria-label="Gender (required)" aria-required="true">
            {['Male', 'Female', 'Other'].map(g => (
              <button key={g} type="button"
                className={`radio-item ${form.gender === g ? "sel" : ""}`}
                style={{ fontFamily: 'inherit' }}
                aria-pressed={form.gender === g}
                onClick={() => set("gender", g)}>{g}</button>
            ))}
          </div>
        </div>
        <div className="form-g">
          <label className="form-l">Contact Phone/Email <span style={{ color: 'var(--text3)', fontWeight: 400 }}>(optional)</span></label>
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
    required: false,
    missingAnswer: 'Select at least one skin type, or tap Skip.',
    valid: !!form.skinType,
    content: (
      <div className="radio-grid assess-skin-options">
        {SKIN_TYPES.map(([t, ic, desc]) => (
          <button key={t} type="button" aria-pressed={form.skinType === t}
            className={`radio-item ${form.skinType === t ? "sel" : ""}`}
            onClick={() => set("skinType", t)}
            style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '0.25rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700 }}>
              <span><AppIcon emoji={ic} /></span>{t}
            </span>
            <span style={{ fontSize: '0.72rem', color: 'var(--text3)' }}>{desc}</span>
          </button>
        ))}
      </div>
    )
  },
  {
    title: 'Current Skin Problems',
    icon: '⚠️',
    why: 'Knowing your skin concerns helps the AI understand broader skin conditions.',
    required: false,
    missingAnswer: 'Pick at least one current skin problem, or tap Skip.',
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
    missingAnswer: 'Select an acne duration, or tap Skip.',
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
    missingAnswer: 'Set at least one slider above 0 or choose an exercise frequency. You can also tap Skip.',
    valid: form.waterIntake > 0 || form.sleep > 0 || form.stress > 0 || !!form.exercise,
    content: (
      <>
        <div className="form-g">
          <label className="form-l" htmlFor="assessment-water">Water Intake — {form.waterIntake ?? 0} glasses/day</label>
          <div className="range-wrap">
            <input id="assessment-water" type="range" min="0" max="15" value={form.waterIntake ?? 0}
              onChange={e => set("waterIntake", Number(e.target.value))} />
            <strong>{form.waterIntake ?? 0}</strong>
          </div>
        </div>
        <div className="form-g">
          <label className="form-l" htmlFor="assessment-sleep">Average Sleep — {form.sleep ?? 0} hours/night</label>
          <div className="range-wrap">
            <input id="assessment-sleep" type="range" min="0" max="12" value={form.sleep ?? 0}
              onChange={e => set("sleep", Number(e.target.value))} />
            <strong>{form.sleep ?? 0}</strong>
          </div>
        </div>
        <div className="form-g">
          <label className="form-l" htmlFor="assessment-stress">Stress Level — {form.stress ?? 0}/10</label>
          <div className="range-wrap">
            <input id="assessment-stress" type="range" min="0" max="10" value={form.stress ?? 0}
              onChange={e => set("stress", Number(e.target.value))} />
            <strong>{form.stress ?? 0}</strong>
          </div>
        </div>
        <div className="form-g">
          <label className="form-l">Exercise Frequency</label>
          <select className="form-i" value={form.exercise}
            onChange={e => set("exercise", e.target.value)}>
            <option value="">Select a frequency</option>
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
    missingAnswer: 'Add an allergy, medication, or medical history selection, or tap Skip.',
    valid: !!(form.allergies.trim() || form.medications.trim() || form.conditions.length),
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
  const [showStepError, setShowStepError] = useState(false);
  const [assessDone, setAssessDone] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [progress, setProgress] = useState(0);
  const [photoConsent, setPhotoConsent] = useState(false);
  const [showConsentWarning, setShowConsentWarning] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [slowAnalysis, setSlowAnalysis] = useState(false);

  const initialForm = () => ({
    name:        user?.name || "",
    age:         user?.age || "",
    gender:      user?.gender || "",
    contact:     user?.phone || "",
    skinType:    "",
    problems:    [],
    duration:    "",
    waterIntake: undefined,
    sleep:       undefined,
    stress:      undefined,
    exercise:    "",
    allergies:   "",
    medications: "",
    conditions:  [],
  });
  const [form, setForm] = useState(initialForm);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const toggle = (k, v) => setForm(f => ({
    ...f,
    [k]: f[k].includes(v) ? f[k].filter(x => x !== v) : [...f[k], v]
  }));

  // Backend se scan history lao; also start waking the AI model (free hosting sleeps when idle)
  useEffect(() => {
    API.get("/scans/wake").catch(() => {});
    API.get("/scans/my")
      .then(res => setAnalyses(res.data))
      .catch(err => console.log("History fetch failed:", err.message));
  }, []);

  // After upload completes, show analysis progress while the server processes the image.
  useEffect(() => {
    if (!analyzing || progress < 75 || progress >= 95) return;
    const timer = setInterval(() => setProgress((value) => Math.min(value + 1, 95)), 800);
    return () => clearInterval(timer);
  }, [analyzing, progress]);

  // If the analysis is taking long, the AI server is probably waking up — tell the user.
  useEffect(() => {
    if (!analyzing) { setSlowAnalysis(false); return; }
    const timer = setTimeout(() => setSlowAnalysis(true), 20000);
    return () => clearTimeout(timer);
  }, [analyzing]);

  const steps = buildSteps(form, set, toggle);
  const totalSteps = steps.length;
  const current = steps[assessStep - 1];

  const moveStep = (offset) => {
    setShowStepError(false);
    setAssessStep(step => step + offset);
  };

  const nextStep = () => {
    if (current.missingAnswer && !current.valid) {
      setShowStepError(true);
      return;
    }
    moveStep(1);
  };

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
    setForm(initialForm());
    setResult(null);
    setAssessDone(false);
    setAssessStep(1);
    setShowStepError(false);
    setProgress(0);
    setPhotoConsent(false);
    setShowConsentWarning(false);
  };

  // button dabane par asli upload
  const startAnalysis = async (file = selectedFile) => {
    if (!file) return;
    if (!photoConsent) {
      setShowConsentWarning(true);
      return;
    }

    setAnalyzing(true);
    setProgress(0);

    const fd = new FormData();
    fd.append("image", file);
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
          if (p.total) setProgress(Math.round((p.loaded * 75) / p.total));
        }
      });
      setProgress(100);
      await new Promise((resolve) => setTimeout(resolve, 350));
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

  // Result screen: pick a new photo and scan again with the same assessment answers.
  const scanAgain = (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || analyzing) return;
    if (file.size > 5 * 1024 * 1024) {
      notify("❌ Image too large. Maximum size is 5MB.");
      return;
    }
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setResult(null);
    startAnalysis(file);
  };

  const photoConsentControl = (
    <>
      <label className={`photo-consent ${photoConsent ? "is-checked" : ""} ${showConsentWarning ? "shake has-warning" : ""}`}>
        <input
          type="checkbox"
          checked={photoConsent}
          aria-describedby={showConsentWarning ? "photo-consent-warning" : undefined}
          onChange={e => { setPhotoConsent(e.target.checked); setShowConsentWarning(false); }}
        />
        <span>I consent to photo analysis</span>
      </label>
      {showConsentWarning && (
        <div id="photo-consent-warning" className="alert al-dan" style={{
          fontSize: "0.9rem", fontWeight: 700,
          padding: "1rem", border: "2px solid var(--dan)",
        }}>
          <span style={{ fontSize: "1.2rem" }}><AppIcon name="alert" /></span>
          Please tick the consent box before starting the analysis.
        </div>
      )}
    </>
  );

  return (
    <div className={`assess-root ${result ? "assess-root-result" : assessDone ? "assess-root-upload" : `assess-root-question ${assessStep === 1 ? "assess-root-personal" : assessStep === 2 ? "assess-root-skin" : ""}`}`}>
      <div className="ph">
        <div className="pt">AI Skin Analysis</div>
        <div className="ps">Complete the assessment and upload your photo</div>
      </div>

      {(!assessDone || analyzing || result) && <Disclaimer variant="ai" compact />}

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
              <div className="assess-step-icon" style={{
                width: assessStep <= 2 ? 32 : 40, height: assessStep <= 2 ? 32 : 40, borderRadius: '10px',
                background: 'var(--pri-l)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.3rem', flexShrink: 0
              }}>
                <AppIcon emoji={current.icon} />
              </div>
              <div className="assess-step-title">{current.title}</div>
            </div>

            {current.why && (
              <div className="assess-step-why">
                <strong>Why we ask:</strong> {current.why}
              </div>
            )}

            {current.content}

            {showStepError && !current.valid && (
              <p className="assess-step-error" role="alert">{current.missingAnswer}</p>
            )}

            <div className={`assess-nav${assessStep > 1 ? " assess-nav-compact" : ""}`}>
              <button className="btn btn-ghost"
                onClick={() => moveStep(-1)}
                disabled={assessStep === 1}>
                ← Back
              </button>

              <div className="assess-nav-actions">
                {assessStep > 1 && (
                  <button className="btn btn-ghost assess-skip-all" type="button"
                    onClick={() => setAssessDone(true)}>
                    <span className="skip-all-full">Skip all remaining questions</span>
                    <span className="skip-all-mobile">Skip all</span>
                  </button>
                )}
                {!current.required && assessStep < totalSteps && (
                  <button className="btn btn-ghost"
                    onClick={() => moveStep(1)}>
                    Skip
                  </button>
                )}

                {assessStep < totalSteps ? (
                  <button className="btn btn-pri"
                    onClick={nextStep}
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

            <div className={assessStep <= 2 ? "sr-only" : "assess-step-status"} style={{
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
          <>
          <div className="card upload-card" style={{ marginBottom: 0 }}>
            <div className="card-h">
              <div className="card-t">Upload Skin Photo</div>
              <span className="badge b-confirmed">Assessment Complete</span>
            </div>
            <div className="card-b">
              <div className="alert al-ok">
                Pre-analysis assessment complete. Upload your photo to proceed.
              </div>

              {!selectedFile ? (
                /* ---- no photo yet ---- */
                <>
                    <label className="upload-zone">
                      <input
                        type="file"
                        className="upload-input"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handleFile}
                      />
                      <div className="upload-zone-icon"><AppIcon name="cameraAdd" /></div>
                      <div className="upload-zone-title">
                        Drop image or click to upload
                      </div>
                      <div className="upload-zone-meta">
                        JPG, PNG, WEBP • Max 5MB • Clear face photo
                      </div>
                    </label>
                  {photoConsentControl}

                  <div className="best-results">
                    <div className="best-results-title">For best results</div>
                    <div className="best-results-grid">
                      {UPLOAD_TIPS.map(([icon, tip]) => (
                        <div key={tip} className="best-result-tip">
                          <AppIcon name={icon} />
                          <span>{tip}</span>
                        </div>
                      ))}
                    </div>
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

                    <img className="selected-skin-photo" src={previewUrl} alt="Selected skin photo" />

                    <div style={{
                      fontSize: "0.78rem", color: "var(--text2)",
                      textAlign: "center", marginBottom: "0.85rem",
                    }}>
                      {selectedFile.name} · {(selectedFile.size / 1024).toFixed(0)} KB
                    </div>

                    <div className="scan-photo-actions">
                      <label className="btn btn-sm scan-photo-change">
                        <input type="file" style={{ display: "none" }}
                          accept="image/jpeg,image/png,image/webp"
                          onChange={handleFile} />
                        <AppIcon name="gallery" /> Change Photo
                      </label>
                      <button type="button" className="btn btn-sm scan-photo-remove" onClick={clearPhoto}>
                        <AppIcon name="trash" /> Remove
                      </button>
                    </div>
                  </div>
                  {photoConsentControl}

                  <button
                    className="btn btn-pri btn-lg btn-full"
                    onClick={() => startAnalysis()}
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
          <Disclaimer variant="ai" compact />
          </>

        ) : (
          /* ============ PROCESSING ============ */
          <div className="card">
            <div className="card-h">
              <div className="card-t"><AppIcon name="activity" /> AI Analysis in Progress</div>
            </div>
            <div className="card-b" style={{ textAlign: 'center', padding: '2rem 1rem' }}>

              {previewUrl && (
                <div
                  className="scan-progress-ring"
                  role="progressbar"
                  aria-label="AI analysis progress"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={progress}
                >
                  <img className="scan-progress-photo" src={previewUrl} alt="Your skin photo being analysed" />
                  <svg viewBox="0 0 160 160" aria-hidden="true">
                    <circle className="scan-progress-track" cx="80" cy="80" r="74" />
                    <circle
                      className="scan-progress-fill"
                      cx="80" cy="80" r="74"
                      style={{ strokeDashoffset: 465 * (1 - progress / 100) }}
                    />
                  </svg>
                </div>
              )}

              <div style={{ fontWeight: 700, marginBottom: '0.5rem', fontSize: '1rem' }}>
                {progress < 75 ? "Uploading your photo..." : "Analysing your skin..."}
              </div>

              <div style={{ fontSize: '0.84rem', color: 'var(--text3)', marginBottom: '1.25rem' }}>
                {progress < 75
                  ? "Sending your image securely"
                  : "Detecting acne type, severity and confidence"}
              </div>

              {slowAnalysis && (
                <div className="alert al-info" role="status" style={{ textAlign: 'left', fontSize: '0.82rem' }}>
                  <AppIcon name="clock" /> The AI server is waking up after being idle. This can take
                  1–4 minutes the first time. Please keep this page open.
                </div>
              )}

              <div style={{
                marginTop: '0.75rem', fontSize: '0.82rem',
                color: 'var(--text2)', display: 'flex',
                justifyContent: 'center', gap: '1.25rem',
              }}>
                <span>{progress}% complete</span>
              </div>

            </div>
          </div>
        )

      ) : (
        /* ============ RESULT ============ */
        <>
          <div className="an-result" style={{ marginBottom: '1rem' }}>
            <div className="an-h">
              <img className="an-result-photo" src={previewUrl} alt="Analysed skin photo" />
              <div className="an-result-type">
                <div className="an-t">{result.atype}</div>
                <div className="an-result-caption">Detected Type</div>
              </div>
              <div className="an-result-severity">
                <div className="an-result-severity-value">{result.sev}</div>
                <div className="an-result-caption">Severity</div>
              </div>
            </div>

            <div className="an-result-metrics">
              {[['SEVERITY', result.sev],
                ['CONFIDENCE', `${result.conf}%`],
                ['SKIN TYPE', result.skinType || form.skinType || '—']].map(([k, v]) => (
                <div key={k} className={`an-result-metric ${k === 'SKIN TYPE' ? 'an-result-metric-skin' : ''}`}>
                  <div className="an-result-metric-label">{k}</div>
                  <div className="an-result-metric-value">{v}</div>
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

            <div className="an-rescan">
              <div className="an-rescan-copy">
                <strong>Want to check another photo?</strong>
                <span>Your assessment answers are kept, just upload a new photo.</span>
              </div>
              <label className="btn an-rescan-btn">
                <input type="file" className="upload-input"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={scanAgain} />
                <AppIcon name="cameraAdd" /> Scan Again
              </label>
            </div>
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

          <section className="next-steps-panel" aria-labelledby="next-steps-heading">
            <header className="next-steps-heading">
              <div className="next-steps-heading-icon"><AppIcon name="clipboard" /></div>
              <div>
                <h2 id="next-steps-heading">Next Steps</h2>
              </div>
              <div className="next-steps-saved-badge" role="status"><AppIcon name="check" /> Analysis saved</div>
            </header>

            <div className="next-steps-grid">
              <button className="next-step-action next-step-diet" onClick={() => setPage("diet")}>
                <span className="next-step-icon"><AppIcon name="document" /></span>
                <span className="next-step-copy"><strong>View Diet Plan</strong><span>See your personalized diet recommendations</span></span>
                <span className="next-step-arrow"><AppIcon name="arrowRight" /></span>
              </button>
              <button className="next-step-action next-step-routine" onClick={() => setPage("skincare")}>
                <span className="next-step-icon"><AppIcon name="leaf" /></span>
                <span className="next-step-copy"><strong>View Routine</strong><span>Check your skincare routine plan</span></span>
                <span className="next-step-arrow"><AppIcon name="arrowRight" /></span>
              </button>
              <button className="next-step-action next-step-doctor" onClick={() => setPage("book")}>
                <span className="next-step-icon"><AppIcon name="calendar" /></span>
                <span className="next-step-copy"><strong>Book Doctor</strong><span>Schedule a consultation with a dermatologist</span></span>
                <span className="next-step-arrow"><AppIcon name="arrowRight" /></span>
              </button>
              <button className="next-step-action next-step-scan" onClick={reset}>
                <span className="next-step-icon"><AppIcon name="camera" /></span>
                <span className="next-step-copy"><strong>New Scan</strong><span>Run another AI skin analysis</span></span>
                <span className="next-step-arrow"><AppIcon name="arrowRight" /></span>
              </button>
            </div>
          </section>

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
        </>
      )}
    </div>
  );
}
