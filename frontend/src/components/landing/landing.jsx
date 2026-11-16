import { useEffect, useRef, useState } from "react";
import IconArrowDown from "@devigner-ui/icons/ArrowDown";
import IconArrowRight from "@devigner-ui/icons/ArrowRight";
import IconCheckCircle from "@devigner-ui/icons/CheckCircle";
import IconClose from "@devigner-ui/icons/Close";
import IconFaceScanSquare from "@devigner-ui/icons/FaceScanSquare";
import IconHamburgerMenu from "@devigner-ui/icons/HamburgerMenu";
import IconLeaf from "@devigner-ui/icons/Leaf";
import IconStethoscope from "@devigner-ui/icons/Stethoscope";
import { OFFERINGS } from "../../data/mockData";

const OFFERING_ICONS = [IconFaceScanSquare, IconLeaf, IconStethoscope];

const HOME_PATH = "/home";
const FEATURES_PATH = "/home/features";
const HOW_IT_WORKS_PATH = "/home/howitworks";

const NAV = [
  { label: "Home", href: HOME_PATH, sectionId: "home" },
  { label: "Features", href: FEATURES_PATH, sectionId: "offer" },
  { label: "How It Works", href: HOW_IT_WORKS_PATH, sectionId: "how-it-works" },
  { label: "Appointments", href: "/home/appointments", sectionId: "get-started" },
];

const PATH_ALIASES = new Map([
  ["/features", FEATURES_PATH],
  ["/home/how-it-works", HOW_IT_WORKS_PATH],
  ["/home/how%20it%20works", HOW_IT_WORKS_PATH],
  ["/home/how%20it%20work", HOW_IT_WORKS_PATH],
  ["/home/appointment", "/home/appointments"],
]);

function sectionForAddress(pathname, hash) {
  const path = pathname.toLowerCase().replace(/\/+$/, "");
  if (hash && (!path || path === HOME_PATH)) {
    const previousLink = NAV.find(({ sectionId }) => `#${sectionId}` === hash.toLowerCase());
    if (previousLink) return previousLink;
  }

  return NAV.find(({ href }) => href === (PATH_ALIASES.get(path) || path));
}

export default function Landing({ onLogin, onSignUp }) {
  const [menu, setMenu] = useState(false);
  const [loginMenu, setLoginMenu] = useState(false);
  const [legalPage, setLegalPage] = useState(null);
  const loginToggle = useRef(null);
  const mobileToggle = useRef(null);
  const close = () => {
    setMenu(false);
    setLoginMenu(false);
  };
  const signUp = () => { close(); onSignUp(); };
  const openAuthFromMenu = (toggle, openAuth) => {
    toggle.current?.focus({ preventScroll: true });
    close();
    openAuth();
  };

  const followSection = (event) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const section = NAV.find(({ href }) => href === event.currentTarget.pathname);
    if (!section) return;

    event.preventDefault();
    close();
    if (window.location.pathname !== section.href || window.location.hash) {
      window.history.pushState(null, "", section.href + window.location.search);
    }
    document.getElementById(section.sectionId)?.scrollIntoView();
  };

  useEffect(() => {
    const syncSection = () => {
      const { pathname, hash, search } = window.location;
      const section = sectionForAddress(pathname, hash);
      if (!section) return;
      if (pathname !== section.href || hash) {
        window.history.replaceState(window.history.state, "", section.href + search);
      }
      document.getElementById(section.sectionId)?.scrollIntoView({ behavior: "instant" });
    };

    syncSection();
    window.addEventListener("popstate", syncSection);
    window.addEventListener("hashchange", syncSection);
    return () => {
      window.removeEventListener("popstate", syncSection);
      window.removeEventListener("hashchange", syncSection);
    };
  }, []);

  useEffect(() => {
    if (!legalPage) return undefined;
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setLegalPage(null);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [legalPage]);

  return (
    <div className="lp-root">
      <header className="lp-nav">
        <div className="lp-nav-in">
          <a href={HOME_PATH} className="lp-logo" onClick={followSection}>
            <div className="lp-logo-ic" aria-hidden="true">A</div>
            <span className="lp-logo-t">AcneCare AI</span>
          </a>

          <nav className="lp-links">
            {NAV.map((l) => <a key={l.label} href={l.href} onClick={followSection}>{l.label}</a>)}
          </nav>

          <div className="lp-nav-r">
            <div className="lp-login-wrap" onBlur={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget)) setLoginMenu(false);
            }}>
              <button ref={loginToggle} className="lp-login" onClick={() => setLoginMenu(!loginMenu)} aria-haspopup="menu" aria-expanded={loginMenu}>
                Log in <IconArrowDown className="lp-login-chevron" aria-hidden="true" />
              </button>
              {loginMenu && (
                <div className="lp-login-menu" role="menu">
                  <button role="menuitem" onClick={() => openAuthFromMenu(loginToggle, onLogin)}>Sign in</button>
                  <button role="menuitem" onClick={() => openAuthFromMenu(loginToggle, onSignUp)}>Create account</button>
                </div>
              )}
            </div>
            <button className="lp-nav-cta" onClick={signUp}>Get started <IconArrowRight className="lp-action-icon" aria-hidden="true" /></button>
            <button ref={mobileToggle} className="lp-burger" onClick={() => setMenu(!menu)} aria-label={menu ? "Close menu" : "Open menu"} aria-expanded={menu}>
              {menu ? <IconClose aria-hidden="true" /> : <IconHamburgerMenu aria-hidden="true" />}
            </button>
          </div>
        </div>

        {menu && (
          <div className="lp-mobile">
            {NAV.map((l) => <a key={l.label} href={l.href} onClick={followSection}>{l.label}</a>)}
            <button className="lp-mobile-cta" onClick={() => openAuthFromMenu(mobileToggle, onSignUp)}>Get started <IconArrowRight className="lp-action-icon" aria-hidden="true" /></button>
          </div>
        )}
      </header>

      <section className="lp-hero" id="home">
        <div className="lp-wrap">
          <span className="lp-pill">AI-POWERED ACNE CARE</span>
          <h1 className="lp-h1">Understand your skin. Find your next step.</h1>
          <div className="lp-hero-actions">
            <button className="btn btn-pri btn-lg" onClick={onLogin}>Get Started <IconArrowRight className="lp-action-icon" aria-hidden="true" /></button>
            <a className="lp-hero-more" href={FEATURES_PATH} onClick={followSection}>Explore what you get <IconArrowDown className="lp-action-icon" aria-hidden="true" /></a>
          </div>
          <div className="lp-hero-highlights" aria-label="AcneCare AI features">
            <span className="lp-hero-highlight"><IconCheckCircle aria-hidden="true" /> AI skin scan</span>
            <span className="lp-hero-highlight"><IconCheckCircle aria-hidden="true" /> Care guidance</span>
            <span className="lp-hero-highlight"><IconCheckCircle aria-hidden="true" /> Dermatologist access</span>
          </div>
        </div>
      </section>

      <section className="lp-sec alt" id="offer">
        <div className="lp-wrap">
          <div className="lp-head">
            <span className="lp-eyebrow">What We Offer</span>
            <h2 className="lp-h2">Everything your skin needs, in one app</h2>
            <p>From the first scan to the final prescription, the whole journey stays connected.</p>
          </div>
          <div className="lp-grid">
            {OFFERINGS.map((o, index) => {
              const OfferingIcon = OFFERING_ICONS[index];
              return (
              <div className="lp-card" key={o.title}>
                <div className="lp-card-ic"><OfferingIcon aria-hidden="true" /></div>
                <div className="lp-card-t">{o.title}</div>
                <p className="lp-card-p">{o.text}</p>
              </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="lp-sec lp-journey" id="how-it-works">
        <div className="lp-wrap">
          <div className="lp-head">
            <span className="lp-eyebrow">How It Works</span>
            <h2 className="lp-h2">A clearer next step, in three simple moves</h2>
            <p>Start with a scan, then choose the support that feels right for you.</p>
          </div>
          <div className="lp-steps">
            <article className="lp-step">
              <span className="lp-step-number">01</span>
              <h3>Upload a skin photo</h3>
              <p>Start with a clear photo of the area you want to understand.</p>
            </article>
            <article className="lp-step">
              <span className="lp-step-number">02</span>
              <h3>Review your scan</h3>
              <p>See an AI overview of acne type and estimated severity.</p>
            </article>
            <article className="lp-step">
              <span className="lp-step-number">03</span>
              <h3>Choose your next step</h3>
              <p>Explore care guidance or book an appointment with a dermatologist.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="lp-sec alt lp-start" id="get-started">
        <div className="lp-wrap lp-start-in">
          <div className="lp-start-copy">
            <span className="lp-eyebrow">Expert support when you need it</span>
            <h2 className="lp-h2">Ready to talk with a dermatologist?</h2>
            <p>Sign in or create an account to explore available dermatologists and book an appointment.</p>
          </div>
          <button className="btn btn-pri btn-lg" onClick={onLogin}>Explore appointments →</button>
        </div>
      </section>

      <footer className="lp-foot">
        <div className="lp-foot-in">
          <div className="lp-foot-top">
            <a className="lp-foot-brand" href={HOME_PATH} onClick={followSection} aria-label="AcneCare AI home">
              <span className="lp-logo-ic" aria-hidden="true">A</span>
              <span>AcneCare AI</span>
            </a>
            <nav className="lp-foot-main" aria-label="Footer navigation">
              {NAV.map((item) => <a key={item.label} href={item.href} onClick={followSection}>{item.label}</a>)}
            </nav>
          </div>
          <div className="lp-foot-meta">
            <span className="lp-copy">© 2026</span>
            <nav className="lp-foot-links" aria-label="Legal information">
              <a href="#terms" onClick={(event) => { event.preventDefault(); setLegalPage("terms"); }}>Terms and Conditions</a>
              <a href="#privacy" onClick={(event) => { event.preventDefault(); setLegalPage("privacy"); }}>Privacy Policy</a>
            </nav>
          </div>
        </div>
      </footer>

      {legalPage && (
        <div className="lp-legal-backdrop" onClick={(event) => {
          if (event.target === event.currentTarget) setLegalPage(null);
        }}>
          <section className="lp-legal-panel" role="dialog" aria-modal="true" aria-labelledby="lp-legal-title">
            <button className="lp-legal-close" onClick={() => setLegalPage(null)} aria-label="Close">
              <IconClose aria-hidden="true" />
            </button>
            {legalPage === "terms" ? (
              <>
                <span className="lp-eyebrow">AcneCare AI</span>
                <h2 className="lp-h2" id="lp-legal-title">Terms and Conditions</h2>
                <p className="lp-legal-updated">Last updated: October 13, 2026</p>
                <h3>Using AcneCare AI</h3>
                <p>AcneCare AI provides informational skin analysis and care guidance. Its AI results are estimates and are not a medical diagnosis, treatment plan, or substitute for advice from a qualified healthcare professional.</p>
                <h3>Health and appointments</h3>
                <p>Use the service to support conversations with a dermatologist, not to handle urgent or worsening health concerns. Contact a qualified healthcare professional for medical advice and urgent care when needed.</p>
                <h3>Your account and uploads</h3>
                <p>Keep your account details accurate and protect your sign-in credentials. Only upload images and information you are allowed to share. You can use the scan controls in your account to delete a scan or its image.</p>
                <h3>Photo consent</h3>
                <p>By ticking the photo consent box, you agree that AcneCare AI stores your facial image for analysis and may share it with dermatologists you book. You can delete the image from your profile at any time.</p>
                <h3>Service availability</h3>
                <p>Features and AI results may be unavailable, delayed, or changed as the project is maintained. Use of the service does not guarantee a particular result or outcome.</p>
              </>
            ) : (
              <>
                <span className="lp-eyebrow">AcneCare AI</span>
                <h2 className="lp-h2" id="lp-legal-title">Privacy Policy</h2>
                <p className="lp-legal-updated">Last updated: October 13, 2026</p>
                <h3>Information in the app</h3>
                <p>The app handles account details, profile information, appointments, prescriptions, and payment records. If you submit a skin scan, it also processes the uploaded photo, AI result, and any questionnaire answers you provide.</p>
                <h3>How scan information is used</h3>
                <p>Scan photos are sent to the AI service to produce an estimate. The app stores scan results and questionnaire answers with your scan record, and stores the uploaded image on the application server so authorized users can view it.</p>
                <h3>Access and deletion</h3>
                <p>Access to scan records and photos is limited by account role in the app. Patients can delete a scan image while keeping its result, or delete a scan record. Deleting an image removes it from the application server; this page does not describe backup retention.</p>
                <h3>Questions</h3>
                <p>For questions about information in your account, contact the team that operates AcneCare AI.</p>
              </>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
