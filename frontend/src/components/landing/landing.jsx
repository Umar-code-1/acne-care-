import { useState } from "react";
import {
  IconArrowDown,
  IconArrowRight,
  IconCheckCircle,
  IconClose,
  IconFaceScanSquare,
  IconHamburgerMenu,
  IconLeaf,
  IconStethoscope,
} from "@devigner-ui/icons";
import { OFFERINGS } from "../../data/mockData";

const OFFERING_ICONS = [IconFaceScanSquare, IconLeaf, IconStethoscope];

const NAV = [
  { label: "Home", href: "#home" },
  { label: "Features", href: "#offer" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Dermatologist", href: "#get-started" },
];

export default function Landing({ onLogin, onSignUp }) {
  const [menu, setMenu] = useState(false);
  const [loginMenu, setLoginMenu] = useState(false);
  const close = () => {
    setMenu(false);
    setLoginMenu(false);
  };
  const signIn = () => { close(); onLogin(); };
  const signUp = () => { close(); onSignUp(); };

  return (
    <div className="lp-root">
      <header className="lp-nav">
        <div className="lp-nav-in">
          <a href="#home" className="lp-logo" onClick={close}>
            <div className="lp-logo-ic" aria-hidden="true">A</div>
            <span className="lp-logo-t">AcneCare AI</span>
          </a>

          <nav className="lp-links">
            {NAV.map((l) => <a key={l.label} href={l.href}>{l.label}</a>)}
          </nav>

          <div className="lp-nav-r">
            <div className="lp-login-wrap" onBlur={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget)) setLoginMenu(false);
            }}>
              <button className="lp-login" onClick={() => setLoginMenu(!loginMenu)} aria-haspopup="menu" aria-expanded={loginMenu}>
                Log in <IconArrowDown className="lp-login-chevron" aria-hidden="true" />
              </button>
              {loginMenu && (
                <div className="lp-login-menu" role="menu">
                  <button role="menuitem" onClick={signIn}>Sign in</button>
                  <button role="menuitem" onClick={signUp}>Create account</button>
                </div>
              )}
            </div>
            <button className="lp-nav-cta" onClick={signUp}>Get started <IconArrowRight className="lp-action-icon" aria-hidden="true" /></button>
            <button className="lp-burger" onClick={() => setMenu(!menu)} aria-label={menu ? "Close menu" : "Open menu"} aria-expanded={menu}>
              {menu ? <IconClose aria-hidden="true" /> : <IconHamburgerMenu aria-hidden="true" />}
            </button>
          </div>
        </div>

        {menu && (
          <div className="lp-mobile">
            {NAV.map((l) => <a key={l.label} href={l.href} onClick={close}>{l.label}</a>)}
            <button className="lp-mobile-cta" onClick={signUp}>Get started <IconArrowRight className="lp-action-icon" aria-hidden="true" /></button>
          </div>
        )}
      </header>

      <section className="lp-hero" id="home">
        <div className="lp-wrap">
          <span className="lp-pill">AI-POWERED ACNE CARE</span>
          <h1 className="lp-h1">Understand your acne. Know what to do next.</h1>
          <p className="lp-sub">
            Get an AI-powered overview of acne type and severity, explore practical care
            guidance, and connect with a dermatologist—all in one place.
          </p>
          <div className="lp-hero-actions">
            <button className="btn btn-pri btn-lg" onClick={onLogin}>Get Started <IconArrowRight className="lp-action-icon" aria-hidden="true" /></button>
            <a className="lp-hero-more" href="#offer">Explore what you get <IconArrowDown className="lp-action-icon" aria-hidden="true" /></a>
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
          <div className="lp-logo">
            <div className="lp-logo-ic" aria-hidden="true">A</div>
            <span className="lp-logo-t">AcneCare AI</span>
          </div>
          <div className="lp-foot-links">
            <a href="#offer">What We Offer</a>
            <a href="#how-it-works">How It Works</a>
            <a href="#get-started">Appointments</a>
          </div>
          <span className="lp-copy">© 2026 AcneCare AI</span>
        </div>
      </footer>
    </div>
  );
}
