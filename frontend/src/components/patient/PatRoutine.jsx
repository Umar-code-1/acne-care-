import React from "react";
import Disclaimer from "../shared/Disclaimer";
import AppIcon from "../shared/AppIcon";

export default function PatRoutine({ rx = [], latestAn, setPage }) {
  // sirf doctor ki di hui routines
  const withRoutine = rx.filter(
    (p) => Array.isArray(p.skincare) && p.skincare.length > 0
  );
  const latest = withRoutine[0];

  return (
    <div>
      <div className="ph">
        <div className="pt">My Skincare Routine</div>
        <div className="ps">
          Prescribed by your dermatologist after reviewing your AI analysis
        </div>
      </div>

      {!latest ? (
        <div className="card">
          <div className="card-b" style={{ textAlign: "center", padding: "2.5rem 1.5rem" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}><AppIcon name="bottle" /></div>

            <div style={{
              fontFamily: "var(--font-d)",
              fontSize: "1.25rem",
              fontWeight: 700,
              marginBottom: "0.5rem",
            }}>
              No routine yet
            </div>

            <div style={{
              color: "var(--text2)",
              fontSize: "0.9rem",
              maxWidth: 440,
              margin: "0 auto 1.5rem",
              lineHeight: 1.75,
            }}>
              AcneCare AI analyses your skin and provides diet guidance, but
              skincare routines are prescribed only by a licensed dermatologist.
              Book a consultation — your doctor will review your AI report and
              create a routine suited to your skin.
            </div>

            {latestAn && (
              <div className="alert al-info" style={{ maxWidth: 440, margin: "0 auto 1.25rem" }}>
                Your latest analysis (<strong>{latestAn.atype}</strong> ·{" "}
                <strong>{latestAn.sev}</strong>) will be shared with the doctor
                automatically.
              </div>
            )}

            <button className="btn btn-pri" onClick={() => setPage?.("book")}>
              <AppIcon name="doctor" /> Book a Dermatologist
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="alert al-ok">
            <AppIcon name="check" /> Prescribed by <strong>{latest.dname}</strong>
            {latest.dqual && ` (${latest.dqual})`} on {latest.date}
          </div>

          {/* MORNING */}
          {latest.skincare.filter((s) => /morning/i.test(s.step)).length > 0 && (
            <div className="card">
              <div className="card-h">
                <div className="card-t"><AppIcon name="sun" /> Morning Routine</div>
              </div>
              <div className="card-b">
                {latest.skincare
                  .filter((s) => /morning/i.test(s.step))
                  .map((s, i) => (
                    <div key={i} className="skincare-step">
                      <div className="sk-num">{i + 1}</div>
                      <div>
                        <div className="sk-name">{s.product}</div>
                        {s.tip && <div className="sk-tip">{s.tip}</div>}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* NIGHT */}
          {latest.skincare.filter((s) => /night/i.test(s.step)).length > 0 && (
            <div className="card">
              <div className="card-h">
                <div className="card-t"><AppIcon name="moon" /> Night Routine</div>
              </div>
              <div className="card-b">
                {latest.skincare
                  .filter((s) => /night/i.test(s.step))
                  .map((s, i) => (
                    <div key={i} className="routine-step">
                      <div className="routine-num">{i + 1}</div>
                      <div className="routine-info">
                        <div className="routine-name">{s.product}</div>
                        {s.tip && <div className="routine-tip">{s.tip}</div>}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* anything without morning/night in the step label */}
          {latest.skincare.filter((s) => !/morning|night/i.test(s.step)).length > 0 && (
            <div className="card">
              <div className="card-h">
                <div className="card-t"><AppIcon name="bottle" /> Additional Steps</div>
              </div>
              <div className="card-b">
                {latest.skincare
                  .filter((s) => !/morning|night/i.test(s.step))
                  .map((s, i) => (
                    <div key={i} className="routine-step">
                      <div className="routine-num">{i + 1}</div>
                      <div className="routine-info">
                        <div className="routine-name">{s.product}</div>
                        <div className="routine-tip">{s.step}</div>
                        {s.tip && <div className="routine-tip">{s.tip}</div>}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {latest.inst && (
            <div className="card">
              <div className="card-h">
                <div className="card-t"><AppIcon name="clipboard" /> Doctor's Instructions</div>
              </div>
              <div className="card-b">
                <div style={{ fontSize: "0.88rem", lineHeight: 1.75, color: "var(--text2)" }}>
                  {latest.inst}
                </div>
              </div>
            </div>
          )}

          {latest.fu && (
            <div className="alert al-warn">
              <AppIcon name="calendar" /> Follow-up appointment recommended on <strong>{latest.fu}</strong>
            </div>
          )}

          {withRoutine.length > 1 && (
            <div className="ps" style={{ textAlign: "center", marginTop: "1rem" }}>
              Showing your most recent routine. See <strong>Skincare Plans</strong> for
              all {withRoutine.length} prescriptions.
            </div>
          )}

          <Disclaimer variant="rx" />
        </>
      )}
    </div>
  );
}
