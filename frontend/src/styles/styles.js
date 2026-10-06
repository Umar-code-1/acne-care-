export const styles = `
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,400&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
.ui-icon{display:inline-block;width:1em;height:1em;vertical-align:-0.14em;flex:0 0 auto}
:root{
  --bg:#f7f3ef;--bg2:#ffffff;--surface:#fff9f5;--border:#e8ddd6;
  --text:#1a1209;--text2:#6b5c4e;--text3:#9e8c7d;
  --pri:#d4622a;--pri-l:#f5e6de;--pri-d:#a84d20;
  --sec:#2a7d6b;--sec-l:#d6ede9;--sec-d:#1a5c4d;
  --acc:#e8a838;--acc-l:#fdf3db;
  --dan:#c0392b;--dan-l:#fdecea;
  --info:#2471a3;--info-l:#d6eaf8;
  --ok:#1e8449;--ok-l:#d5f0e0;
  --adm:#6c3483;--adm-l:#e8d5f5;
  --r:12px;--r2:8px;--r3:18px;
  --sh:0 2px 12px rgba(26,18,9,0.09);--sh2:0 8px 32px rgba(26,18,9,0.13);
  --font:'DM Sans',sans-serif;--font-d:'Sora',sans-serif;
}
html{scroll-behavior:smooth}
body{font-family:var(--font);background:var(--bg);color:var(--text);font-size:14px;line-height:1.5}
.app-layout{display:grid;grid-template-columns:240px 1fr;min-height:100vh}
.sidebar{background:var(--bg2);border-right:1px solid var(--border);display:flex;flex-direction:column;padding:1.25rem 0.85rem;position:sticky;top:0;height:100vh;overflow-y:auto}
.s-logo{display:flex;align-items:center;gap:0.6rem;padding:0.35rem 0.6rem;margin-bottom:1.5rem}
.s-logo-ic{width:36px;height:36px;background:linear-gradient(135deg,var(--pri),var(--pri-d));border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:1.1rem;flex-shrink:0}
.s-logo-t{font-family:var(--font-d);font-weight:700;font-size:0.95rem}
.s-sec{font-size:0.68rem;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:var(--text3);padding:0 0.6rem;margin:1rem 0 0.4rem}
.nav-i{display:flex;align-items:center;gap:0.65rem;padding:0.55rem 0.65rem;border-radius:var(--r2);cursor:pointer;color:var(--text2);font-size:0.86rem;font-weight:500;margin-bottom:2px;border:none;background:transparent;width:100%;text-align:left;transition:all 0.16s}
.nav-i:hover{background:var(--bg);color:var(--text)}
.nav-i.act{background:var(--pri-l);color:var(--pri);font-weight:700}
.nav-ic{font-size:1.05rem;width:20px;height:20px;display:grid;place-items:center;flex-shrink:0}
.nav-badge{margin-left:auto;background:var(--pri);color:#fff;font-size:0.65rem;font-weight:700;padding:0.1rem 0.45rem;border-radius:20px}
.sidebar-user{margin-top:auto;padding:0.8rem 0.65rem;background:var(--bg);border-radius:var(--r2);display:flex;align-items:center;gap:0.65rem}
.uav{width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.85rem;flex-shrink:0}
.av-a{background:var(--adm-l);color:var(--adm)}.av-d{background:var(--sec-l);color:var(--sec)}.av-p{background:var(--pri-l);color:var(--pri)}
.u-name{font-size:0.82rem;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;flex:1}
.u-role{font-size:0.7rem;color:var(--text3);text-transform:capitalize}
.logout-btn{background:none;border:none;cursor:pointer;color:var(--text3);font-size:1rem;padding:0.2rem;border-radius:4px;transition:color 0.15s}
.logout-btn:hover{color:var(--dan)}
.main-col{display:flex;flex-direction:column;overflow:hidden;min-height:100vh}
.topbar{display:flex;align-items:center;justify-content:space-between;padding:0.75rem 1.5rem;background:var(--bg2);border-bottom:1px solid var(--border);position:sticky;top:0;z-index:20}
.topbar-t{font-family:var(--font-d);font-weight:700;font-size:1rem}
.topbar-r{display:flex;align-items:center;gap:0.85rem}
.nb-btn{position:relative;background:none;border:none;cursor:pointer;font-size:1.15rem;color:var(--text2);padding:0.2rem;border-radius:6px}
.nb-dot{width:7px;height:7px;background:var(--pri);border-radius:50%;position:absolute;top:1px;right:1px}
.content{padding:1.5rem;overflow-y:auto;flex:1}
.btn{padding:0.55rem 1.1rem;border-radius:var(--r2);border:none;cursor:pointer;font-family:var(--font);font-weight:600;font-size:0.86rem;transition:all 0.18s;display:inline-flex;align-items:center;gap:0.4rem;justify-content:center}
.btn-pri{background:var(--pri);color:#fff}.btn-pri:hover{background:var(--pri-d);transform:translateY(-1px)}
.btn-sec{background:var(--sec);color:#fff}.btn-sec:hover{background:var(--sec-d)}
.btn-ghost{background:transparent;color:var(--text2);border:1.5px solid var(--border)}.btn-ghost:hover{background:var(--bg)}
.btn-dan{background:var(--dan);color:#fff}
.btn-acc{background:var(--acc);color:#fff}
.btn-sm{padding:0.35rem 0.75rem;font-size:0.78rem;border-radius:6px}
.btn-lg{padding:0.85rem 1.9rem;font-size:0.95rem;border-radius:var(--r2)}
.btn-full{width:100%}
.btn-google{background:var(--bg2);border:1.5px solid var(--border);color:var(--text)}
.btn-google:hover{background:var(--bg);border-color:var(--text3)}
.btn:disabled{opacity:0.45;cursor:not-allowed;transform:none!important}
.form-g{margin-bottom:1rem}
.form-l{display:block;font-size:0.8rem;font-weight:700;margin-bottom:0.35rem;color:var(--text)}
.form-i{width:100%;padding:0.62rem 0.85rem;border:1.5px solid var(--border);border-radius:var(--r2);font-family:var(--font);font-size:0.88rem;background:var(--bg);color:var(--text);outline:none;transition:border 0.18s}
.form-i:focus{border-color:var(--pri);background:#fff}
select.form-i{cursor:pointer;appearance:none}
textarea.form-i{resize:vertical;min-height:75px}
.form-hint{font-size:0.74rem;color:var(--text3);margin-top:0.3rem;line-height:1.5}
.card{background:var(--bg2);border-radius:var(--r);border:1px solid var(--border);box-shadow:var(--sh);overflow:hidden;margin-bottom:1rem}
.card-h{padding:0.9rem 1.25rem;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between}
.card-t{font-family:var(--font-d);font-size:0.92rem;font-weight:700}
.card-b{padding:1.25rem}
.stat-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(155px,1fr));gap:0.85rem;margin-bottom:1.5rem}
.stat-c{background:var(--bg2);border-radius:var(--r);padding:1rem 1.1rem;border:1px solid var(--border);display:flex;align-items:center;gap:0.85rem;box-shadow:var(--sh)}
.stat-ic{width:44px;height:44px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:1.2rem;flex-shrink:0}
.stat-ic .ui-icon{width:1.15em;height:1.15em}
.stat-v{font-family:var(--font-d);font-size:1.5rem;font-weight:700;line-height:1}
.stat-l{font-size:0.76rem;color:var(--text2);margin-top:0.15rem}
.ph{margin-bottom:1.5rem}.pt{font-family:var(--font-d);font-size:1.55rem;font-weight:700;margin-bottom:0.25rem}.ps{color:var(--text2);font-size:0.88rem}
.badge{display:inline-flex;align-items:center;padding:0.2rem 0.6rem;border-radius:20px;font-size:0.74rem;font-weight:700}
.b-mild{background:#d5f0e0;color:#1e8449}.b-moderate{background:#fdf3db;color:#b7770d}.b-severe{background:#fdecea;color:#c0392b}.b-clear{background:#d6eaf8;color:#2471a3}

.b-confirmed{background:#d5f0e0;color:#1e8449}.b-pending{background:#fdf3db;color:#b7770d}.b-completed{background:#d6eaf8;color:#2471a3}.b-cancelled{background:#fdecea;color:#c0392b}
.b-paid{background:#d5f0e0;color:#1e8449}
.b-unpaid{background:#fdecea;color:#c0392b}
.b-pending_verification{background:#fdf3db;color:#b7770d}
.b-rejected{background:#fdecea;color:#c0392b}
.b-online{background:#d5f0e0;color:#1e8449}.b-physical{background:var(--adm-l);color:var(--adm)}
.b-adm{background:var(--adm-l);color:var(--adm)}.b-doc{background:var(--sec-l);color:var(--sec)}.b-pat{background:var(--pri-l);color:var(--pri)}
.tab-bar{display:flex;border-bottom:2px solid var(--border);margin-bottom:1.25rem;overflow-x:auto}
.tab{padding:0.5rem 1rem;border:none;background:transparent;cursor:pointer;font-family:var(--font);font-size:0.84rem;font-weight:500;color:var(--text2);border-bottom:2px solid transparent;margin-bottom:-2px;transition:all 0.16s;white-space:nowrap}
.tab.act{color:var(--pri);font-weight:700;border-bottom-color:var(--pri)}
.alert{padding:0.75rem 1rem;border-radius:var(--r2);font-size:0.85rem;margin-bottom:1rem;display:flex;align-items:flex-start;gap:0.5rem;line-height:1.5}
.al-ok{background:var(--ok-l);color:var(--ok);border:1px solid #a9dfbf}
.al-info{background:var(--info-l);color:var(--info);border:1px solid #aed6f1}
.al-warn{background:var(--acc-l);color:#b7770d;border:1px solid #f0d898}
.al-dan{background:var(--dan-l);color:var(--dan);border:1px solid #f5c6c2}
.g2{display:grid;grid-template-columns:1fr 1fr;gap:1.25rem}
.g3{display:grid;grid-template-columns:repeat(3,1fr);gap:1rem}
/* ================= MOBILE ================= */
.burger{display:none;background:none;border:1.5px solid var(--border);border-radius:var(--r2);width:38px;height:38px;font-size:1.1rem;cursor:pointer;color:var(--text);flex-shrink:0;align-items:center;justify-content:center}
.scrim{display:none;position:fixed;inset:0;background:rgba(26,18,9,0.45);z-index:90;animation:fadeIn 0.2s ease}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes slideIn{from{transform:translateX(-100%)}to{transform:translateX(0)}}

@media(max-width:900px){
  .g2,.g3{grid-template-columns:1fr}
  .app-layout{grid-template-columns:1fr}
  .burger{display:flex}

  .sidebar{
    position:fixed;top:0;left:0;bottom:0;width:262px;z-index:100;
    box-shadow:var(--sh2);animation:slideIn 0.22s ease;
    transform:translateX(-100%);
  }
  .sidebar.open{transform:translateX(0)}
  .scrim.show{display:block}

  .content{padding:1rem}
  .topbar{padding:0.65rem 1rem;gap:0.75rem}
  .topbar-t{font-size:0.9rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .pt{font-size:1.25rem}
  .ph{margin-bottom:1rem}

  .stat-grid{grid-template-columns:repeat(2,1fr);gap:0.6rem}
  .stat-c{padding:0.8rem;gap:0.6rem}
  .stat-ic{width:36px;height:36px;font-size:1rem}
  .stat-v{font-size:1.2rem}
  .stat-l{font-size:0.7rem}

  .card-b{padding:1rem}
  .card-h{padding:0.75rem 1rem}
  .doc-grid{grid-template-columns:1fr}
  .store-grid{grid-template-columns:repeat(2,1fr)}
  .type-cards{grid-template-columns:1fr}
  .plat-grid{grid-template-columns:repeat(3,1fr)}
  .time-grid{grid-template-columns:repeat(3,1fr)}
  .image-tips{grid-template-columns:1fr}
  .diet-g{grid-template-columns:1fr}
  .probs-grid{grid-template-columns:repeat(2,1fr)}
  .check-grid{grid-template-columns:repeat(2,1fr)}
  .radio-grid{grid-template-columns:repeat(2,1fr)}

  .assess-step{padding:1.15rem}
  .profile-hero{flex-direction:column;text-align:center;padding:1.5rem;gap:0.85rem}
  .p-badges{justify-content:center}

  table{font-size:0.78rem}
  th,td{padding:0.5rem 0.6rem;white-space:nowrap}

  .toast{left:1rem;right:1rem;bottom:1rem;max-width:none}
  .btn{padding:0.55rem 0.9rem}
  .section-row{flex-direction:column;align-items:stretch}
  .section-row .btn{width:100%}
}

@media(max-width:480px){
  .stat-grid{grid-template-columns:1fr}
  .store-grid{grid-template-columns:1fr}
  .time-grid{grid-template-columns:repeat(2,1fr)}
  .check-grid,.radio-grid{grid-template-columns:1fr}
  .probs-grid{grid-template-columns:1fr}
  h1,.pt{font-size:1.15rem}
}.tbl-wrap{overflow-x:auto}
table{width:100%;border-collapse:collapse;font-size:0.84rem}
th{text-align:left;padding:0.65rem 0.85rem;background:var(--bg);font-size:0.72rem;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;color:var(--text2);border-bottom:1px solid var(--border)}
td{padding:0.75rem 0.85rem;border-bottom:1px solid var(--border);vertical-align:middle}
tr:last-child td{border-bottom:none}
tr:hover td{background:var(--bg)}
.auth-root{min-height:100vh;display:grid;grid-template-columns:1fr;background:var(--bg)}
.auth-form-side{min-height:100vh;display:flex;align-items:center;justify-content:center;padding:2rem;background:var(--bg)}
.auth-card{width:100%;max-width:420px;background:var(--bg2);border-radius:var(--r3);padding:2.25rem;box-shadow:var(--sh2);border:1px solid var(--border)}
.auth-logo{display:flex;align-items:center;gap:0.65rem;margin-bottom:1.75rem}
.auth-logo-ic{width:40px;height:40px;background:linear-gradient(135deg,var(--pri),var(--pri-d));border-radius:11px;display:flex;align-items:center;justify-content:center;font-size:1.2rem}
.auth-logo-t{font-family:var(--font-d);font-weight:700;font-size:1.1rem}
.auth-title{font-family:var(--font-d);font-size:1.7rem;font-weight:700;margin-bottom:0.3rem}
.auth-sub{color:var(--text2);font-size:0.88rem;margin-bottom:1.5rem}
.auth-back{background:none;border:none;color:var(--text2);font-family:var(--font);font-size:0.82rem;font-weight:600;cursor:pointer;margin-bottom:1.1rem;padding:0}
.auth-back:hover{color:var(--pri)}
.auth-divider{display:flex;align-items:center;gap:0.75rem;color:var(--text3);font-size:0.76rem;margin:1.1rem 0}
.auth-divider::before,.auth-divider::after{content:'';flex:1;height:1px;background:var(--border)}
.auth-switch{text-align:center;font-size:0.82rem;color:var(--text2);margin-top:1.1rem}
.auth-switch button{background:none;border:none;color:var(--pri);font-family:var(--font);font-size:0.82rem;font-weight:700;cursor:pointer}
.role-tabs{display:grid;grid-template-columns:repeat(3,1fr);gap:0.4rem;margin-bottom:1.5rem;background:var(--bg);border-radius:10px;padding:0.3rem}
.rt{padding:0.55rem;border-radius:7px;border:none;cursor:pointer;font-family:var(--font);font-size:0.78rem;font-weight:500;transition:all 0.18s;background:transparent;color:var(--text2);display:flex;flex-direction:column;align-items:center;gap:0.2rem}
.rt.act{background:var(--bg2);color:var(--text);box-shadow:var(--sh);font-weight:700}
.auth-err{background:var(--dan-l);border:1px solid #f5c6c2;border-radius:var(--r2);padding:0.65rem 0.85rem;color:var(--dan);font-size:0.82rem;margin-bottom:0.85rem}
.auth-demo{margin-top:1.25rem;padding:0.85rem;background:var(--acc-l);border-radius:var(--r2);border:1px solid #f0d898}
.ad-t{font-size:0.72rem;font-weight:700;color:var(--acc);margin-bottom:0.4rem;text-transform:uppercase;letter-spacing:0.05em}
.ad-c{font-size:0.78rem;color:var(--text2);line-height:1.9}
.assess-root{max-width:680px;margin:0 auto}
.assess-prog-bar{height:6px;background:var(--border);border-radius:3px;overflow:hidden;margin-top:0.5rem}
.assess-prog-fill{height:100%;background:linear-gradient(90deg,var(--pri),var(--acc));border-radius:3px;transition:width 0.4s ease}
.assess-step{background:var(--bg2);border-radius:var(--r);border:1px solid var(--border);padding:1.75rem;box-shadow:var(--sh)}
.assess-step-title{font-family:var(--font-d);font-size:1.2rem;font-weight:700;margin-bottom:0.35rem}
.assess-step-why{font-size:0.8rem;color:var(--text3);margin-bottom:1.5rem;padding:0.65rem 0.85rem;background:var(--acc-l);border-radius:var(--r2);border-left:3px solid var(--acc);line-height:1.6}
.check-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:0.5rem}
.check-item{display:flex;align-items:center;gap:0.5rem;padding:0.55rem 0.75rem;border:1.5px solid var(--border);border-radius:var(--r2);cursor:pointer;transition:all 0.15s;background:var(--bg);font-size:0.84rem;font-weight:500}
.check-item:hover{border-color:var(--pri);background:var(--pri-l)}
.check-item.sel{border-color:var(--pri);background:var(--pri-l);color:var(--pri-d)}
.radio-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:0.5rem}
.radio-item{display:flex;align-items:center;gap:0.5rem;padding:0.6rem 0.85rem;border:1.5px solid var(--border);border-radius:var(--r2);cursor:pointer;transition:all 0.15s;background:var(--bg);font-size:0.84rem;font-weight:500}
.radio-item:hover{border-color:var(--pri);background:var(--pri-l)}
.radio-item.sel{border-color:var(--pri);background:var(--pri-l);color:var(--pri-d);font-weight:700}
.range-wrap{display:flex;align-items:center;gap:0.85rem}
.range-wrap input[type=range]{flex:1;height:5px;accent-color:var(--pri)}
.assess-nav{display:flex;justify-content:space-between;align-items:center;margin-top:1.5rem}
.image-tips{display:grid;grid-template-columns:repeat(2,1fr);gap:0.6rem;margin-bottom:1.25rem}
.img-tip{display:flex;align-items:center;gap:0.6rem;padding:0.7rem 0.85rem;background:var(--ok-l);border:1px solid #a9dfbf;border-radius:var(--r2);font-size:0.82rem;font-weight:500;color:var(--ok)}
.upload-zone{display:block;width:100%;border:2px dashed var(--border);border-radius:var(--r);padding:2.5rem 1.5rem;text-align:center;cursor:pointer;transition:all 0.2s;background:var(--bg);position:relative;margin-bottom:1rem}
.upload-zone:hover{border-color:var(--pri);background:var(--pri-l)}
.upload-input{position:absolute;inset:0;opacity:0;cursor:pointer;width:100%;height:100%}
.prog-bar{height:8px;background:var(--border);border-radius:4px;overflow:hidden;margin-top:0.75rem}
.prog-fill{height:100%;background:linear-gradient(90deg,var(--pri),var(--acc));border-radius:4px;transition:width 0.3s}
.an-result{background:linear-gradient(135deg,#1a1209,#2c1a0e);color:#fff;border-radius:var(--r);padding:1.5rem;margin-bottom:1rem}
.an-h{display:flex;align-items:center;gap:1rem;margin-bottom:1rem}
.an-ic{width:60px;height:60px;border-radius:12px;background:rgba(255,255,255,0.1);display:flex;align-items:center;justify-content:center;font-size:1.6rem;border:2px solid rgba(255,255,255,0.2);flex-shrink:0}
.an-t{font-family:var(--font-d);font-size:1.3rem;font-weight:700}
.conf-lbl{font-size:0.76rem;opacity:0.65;display:flex;justify-content:space-between;margin-bottom:0.35rem}
.conf-track{height:7px;background:rgba(255,255,255,0.15);border-radius:4px;overflow:hidden}
.conf-fill{height:100%;background:linear-gradient(90deg,var(--pri),var(--acc));border-radius:4px}
.probs-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:0.4rem;margin-top:1rem}
.prob-item{background:rgba(255,255,255,0.07);border-radius:8px;padding:0.5rem}
.prob-n{font-size:0.7rem;opacity:0.65}
.prob-v{font-size:0.95rem;font-weight:700}
.diet-g{display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem}
.diet-eat{background:var(--ok-l);border:1px solid #a9dfbf;border-radius:var(--r);padding:1.1rem}
.diet-av{background:var(--dan-l);border:1px solid #f5c6c2;border-radius:var(--r);padding:1.1rem}
.diet-title{font-weight:700;font-size:0.9rem;margin-bottom:0.65rem;display:flex;align-items:center;gap:0.4rem}
.diet-eat .diet-title{color:var(--ok)}.diet-av .diet-title{color:var(--dan)}
.diet-list{list-style:none;display:grid;gap:0.25rem}
.diet-list li{font-size:0.82rem;color:var(--text);display:flex;align-items:center;gap:0.4rem}
.diet-list li::before{content:'';width:6px;height:6px;border-radius:50%;flex-shrink:0}
.diet-eat .diet-list li::before{background:var(--ok)}
.diet-av .diet-list li::before{background:var(--dan)}
.routine-step{display:flex;gap:0.85rem;padding:0.85rem;background:var(--bg);border-radius:var(--r2);border:1px solid var(--border);margin-bottom:0.6rem;align-items:flex-start}
.routine-num{width:28px;height:28px;border-radius:50%;background:var(--pri);color:#fff;display:flex;align-items:center;justify-content:center;font-size:0.78rem;font-weight:700;flex-shrink:0;margin-top:0.1rem}
.routine-info{flex:1}
.routine-name{font-weight:700;font-size:0.88rem;margin-bottom:0.2rem}
.routine-tip{font-size:0.78rem;color:var(--text2)}
.doc-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:1rem}
.doc-card{background:var(--bg2);border-radius:var(--r);border:2px solid var(--border);padding:1.25rem;transition:all 0.2s;cursor:pointer}
.doc-card:hover{border-color:var(--pri);box-shadow:var(--sh2);transform:translateY(-2px)}
.doc-card.sel{border-color:var(--pri);background:var(--pri-l)}
.doc-av{width:50px;height:50px;border-radius:50%;background:var(--sec-l);color:var(--sec);display:flex;align-items:center;justify-content:center;font-weight:700;font-size:1.15rem;flex-shrink:0}
.bk-steps{display:flex;align-items:center;margin-bottom:1.75rem;overflow-x:auto}
.bk-step{display:flex;align-items:center;gap:0.4rem;flex-shrink:0}
.bk-sn{width:28px;height:28px;border-radius:50%;border:2px solid var(--border);display:flex;align-items:center;justify-content:center;font-size:0.75rem;font-weight:700;color:var(--text2);background:var(--bg2);transition:all 0.25s}
.bk-sn.act{border-color:var(--pri);color:var(--pri);background:var(--pri-l)}
.bk-sn.done{border-color:var(--ok);color:#fff;background:var(--ok)}
.bk-sl{font-size:0.74rem;font-weight:600;color:var(--text2);white-space:nowrap}
.bk-sl.act{color:var(--pri)}
.bk-line{flex:1;height:2px;background:var(--border);min-width:20px;max-width:35px}
.bk-line.done{background:var(--ok)}
.type-cards{display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1.25rem}
.type-c{border:2px solid var(--border);border-radius:var(--r);padding:1.25rem;cursor:pointer;text-align:center;transition:all 0.18s;background:var(--bg)}
.type-c:hover{border-color:var(--pri)}.type-c.sel{border-color:var(--pri);background:var(--pri-l)}
.plat-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:0.65rem;margin-bottom:1rem}
.plat-c{border:2px solid var(--border);border-radius:var(--r2);padding:0.85rem 0.5rem;cursor:pointer;text-align:center;transition:all 0.18s;background:var(--bg)}
.plat-c:hover{border-color:var(--pri)}.plat-c.sel{border-color:var(--pri);background:var(--pri-l)}
.time-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:0.45rem}
.time-slot{padding:0.5rem;border:1.5px solid var(--border);border-radius:var(--r2);text-align:center;font-size:0.8rem;cursor:pointer;transition:all 0.15s;background:var(--bg)}
.time-slot:hover{border-color:var(--pri)}.time-slot.sel{border-color:var(--pri);background:var(--pri-l);color:var(--pri);font-weight:700}
.confirm-box{background:linear-gradient(135deg,var(--sec),var(--sec-d));color:#fff;border-radius:var(--r);padding:2rem;text-align:center}
.confirm-details{background:rgba(255,255,255,0.12);border-radius:var(--r2);padding:1rem;margin:1rem 0;text-align:left;display:grid;gap:0.5rem}
.confirm-row{display:flex;justify-content:space-between;font-size:0.86rem}
.rx-card{background:var(--bg2);border-radius:var(--r);border:1px solid var(--border);padding:1.25rem;margin-bottom:1rem}
.rx-h{display:flex;justify-content:space-between;align-items:flex-start;padding-bottom:0.85rem;border-bottom:1px solid var(--border);margin-bottom:0.85rem}
.rx-t{font-family:var(--font-d);font-weight:700;font-size:0.95rem}
.rx-d{font-size:0.76rem;color:var(--text3)}
.med-item{background:var(--bg);border-radius:var(--r2);padding:0.75rem;border:1px solid var(--border);margin-bottom:0.5rem}
.med-h{display:flex;justify-content:space-between;align-items:center;margin-bottom:0.3rem}
.med-n{font-weight:700;font-size:0.88rem}
.med-d{font-size:0.78rem;color:var(--text2)}
.mbt{font-size:0.7rem;font-weight:700;padding:0.15rem 0.5rem;border-radius:20px}
.mb-t{background:var(--info-l);color:var(--info)}.mb-o{background:var(--acc-l);color:var(--acc)}
.store-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:1rem}
.product-c{background:var(--bg2);border-radius:var(--r);border:1px solid var(--border);overflow:hidden;transition:all 0.2s;cursor:pointer}
.product-c:hover{box-shadow:var(--sh2);transform:translateY(-3px)}
.product-img{height:120px;display:flex;align-items:center;justify-content:center;font-size:3rem;background:linear-gradient(135deg,var(--bg),var(--border))}
.product-info{padding:1rem}
.product-tag{display:inline-flex;font-size:0.68rem;font-weight:700;padding:0.15rem 0.5rem;border-radius:20px;background:var(--pri-l);color:var(--pri);margin-bottom:0.5rem}
.product-name{font-weight:700;font-size:0.9rem;margin-bottom:0.2rem;line-height:1.3}
.product-brand{font-size:0.76rem;color:var(--text3);margin-bottom:0.4rem}
.product-price{font-family:var(--font-d);font-size:1.1rem;font-weight:700;color:var(--pri);margin-bottom:0.75rem}
.profile-hero{background:linear-gradient(135deg,var(--pri),var(--pri-d));border-radius:var(--r);padding:2rem;color:#fff;display:flex;align-items:center;gap:1.5rem;margin-bottom:1.25rem}
.p-av{width:70px;height:70px;border-radius:50%;background:rgba(255,255,255,0.2);display:flex;align-items:center;justify-content:center;font-size:1.75rem;font-weight:700;border:3px solid rgba(255,255,255,0.3);flex-shrink:0}
.p-name{font-family:var(--font-d);font-size:1.4rem;font-weight:700}
.p-email{opacity:0.8;font-size:0.88rem;margin-top:0.2rem}
.p-badges{display:flex;gap:0.6rem;margin-top:0.65rem;flex-wrap:wrap}
.p-badge{background:rgba(255,255,255,0.15);border:1px solid rgba(255,255,255,0.25);border-radius:20px;padding:0.25rem 0.75rem;font-size:0.78rem}
.toast{position:fixed;bottom:1.5rem;right:1.5rem;z-index:999;max-width:300px;background:var(--ok);color:#fff;border-radius:var(--r2);padding:0.85rem 1.1rem;font-size:0.86rem;font-weight:600;box-shadow:var(--sh2);animation:slideUp 0.3s ease;display:none}
.toast.show{display:flex;align-items:center;gap:0.6rem}
@keyframes slideUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
@keyframes shake{0%,100%{transform:translateX(0)}20%{transform:translateX(-8px)}40%{transform:translateX(8px)}60%{transform:translateX(-5px)}80%{transform:translateX(5px)}}
.shake{animation:shake 0.4s ease}
.empty{text-align:center;padding:2.5rem 1rem;color:var(--text2)}
.empty-ic{font-size:2.8rem;margin-bottom:0.75rem}
.empty-t{font-weight:700;font-size:0.95rem;margin-bottom:0.35rem}
.empty-s{font-size:0.84rem}
.divider{height:1px;background:var(--border);margin:1.25rem 0}
.section-row{display:flex;align-items:center;justify-content:space-between;margin-bottom:1rem;flex-wrap:wrap;gap:0.5rem}
.star{color:var(--acc)}
.skincare-step{display:flex;gap:0.75rem;padding:0.75rem;background:var(--ok-l);border-radius:var(--r2);border:1px solid #a9dfbf;margin-bottom:0.5rem;align-items:flex-start}
.sk-num{width:24px;height:24px;border-radius:50%;background:var(--ok);color:#fff;display:flex;align-items:center;justify-content:center;font-size:0.72rem;font-weight:700;flex-shrink:0;margin-top:0.1rem}
.sk-name{font-weight:700;font-size:0.85rem;color:var(--ok)}
.sk-tip{font-size:0.78rem;color:var(--text2);margin-top:0.15rem}

/* ================= PUBLIC LANDING ================= */
.lp-nav{position:sticky;top:0;z-index:50;background:rgba(247,243,239,0.88);backdrop-filter:blur(12px);border-bottom:1px solid var(--border)}
.lp-nav-in{max-width:1140px;margin:0 auto;padding:0 1.5rem;height:68px;display:flex;align-items:center;justify-content:space-between}
.lp-nav-r{display:flex;align-items:center;gap:0.75rem;flex-shrink:0}
.lp-logo{display:flex;align-items:center;gap:0.6rem;cursor:pointer;text-decoration:none;color:var(--text);white-space:nowrap;flex-shrink:0}
.lp-logo-ic{width:34px;height:34px;background:linear-gradient(135deg,var(--pri),var(--pri-d));border-radius:10px;display:flex;align-items:center;justify-content:center;font-family:var(--font-d);font-size:1rem;font-weight:700;color:#fff;flex-shrink:0}
.lp-logo-t{font-family:var(--font-d);font-weight:700;font-size:1.05rem;white-space:nowrap}
.lp-links{display:flex;gap:2rem}
.lp-links a{color:var(--text2);text-decoration:none;font-size:0.86rem;font-weight:500;transition:color 0.16s}
.lp-links a:hover{color:var(--pri)}
.lp-login-wrap{position:relative}
.lp-login{display:flex;align-items:center;gap:0.45rem;padding:0.6rem 0.75rem;border:0;border-radius:999px;background:transparent;color:var(--text);font-family:var(--font-d);font-size:0.84rem;font-weight:700;cursor:pointer;white-space:nowrap;transition:background .16s,color .16s}
.lp-login:hover,.lp-login[aria-expanded="true"]{background:var(--bg2);color:var(--pri-d)}
.lp-login-chevron{width:13px;height:13px;transition:transform .16s}
.lp-login[aria-expanded="true"] .lp-login-chevron{transform:rotate(180deg)}
.lp-login-menu{position:absolute;right:0;top:calc(100% + 0.45rem);z-index:60;min-width:190px;padding:0.35rem;background:var(--bg2);border:1px solid var(--border);border-radius:12px;box-shadow:var(--sh2)}
.lp-login-menu button{display:block;width:100%;padding:0.7rem 0.8rem;border:0;border-radius:8px;background:transparent;color:var(--text);font-family:var(--font);font-size:0.82rem;font-weight:500;text-align:left;cursor:pointer}
.lp-login-menu button:hover,.lp-login-menu button:focus-visible{background:var(--bg);color:var(--pri-d);outline:none}
.lp-nav-cta{display:inline-flex;align-items:center;gap:0.7rem;padding:0.68rem 1.05rem;border:0;border-radius:999px;background:var(--pri);color:#fff;font-family:var(--font);font-size:0.82rem;font-weight:700;cursor:pointer;white-space:nowrap;transition:background .16s,transform .16s}
.lp-nav-cta:hover{background:var(--pri-d);transform:translateY(-1px)}
.lp-action-icon{width:15px;height:15px;flex-shrink:0}
.lp-burger{display:none;background:none;border:1.5px solid var(--border);border-radius:var(--r2);width:38px;height:38px;font-size:1.05rem;cursor:pointer;color:var(--text)}
.lp-burger svg{width:19px;height:19px}
.lp-mobile{display:flex;flex-direction:column;background:var(--bg2);border-top:1px solid var(--border);padding:0.5rem 1.5rem 1rem}
.lp-mobile a{padding:0.7rem 0;color:var(--text2);text-decoration:none;font-size:0.9rem;font-weight:500;border-bottom:1px solid var(--border)}
.lp-mobile a:last-child{border-bottom:none}
.lp-mobile-cta{display:none}
.lp-wrap{max-width:1140px;margin:0 auto;padding:0 1.5rem}
.lp-sec{padding:4.5rem 0;scroll-margin-top:70px}
.lp-sec.alt{background:var(--bg2);border-top:1px solid var(--border);border-bottom:1px solid var(--border)}
.lp-hero{padding:3.25rem 0 2.6rem;text-align:center;background:radial-gradient(900px 420px at 50% -12%,var(--pri-l),transparent);scroll-margin-top:70px}
.lp-pill{display:inline-block;font-size:0.68rem;font-weight:700;color:var(--pri-d);background:var(--pri-l);border:1px solid #f0d5c8;padding:0.3rem 0.85rem;border-radius:20px;margin-bottom:0.9rem;letter-spacing:0.07em}
.lp-h1{font-family:var(--font-d);font-size:clamp(2rem,4.25vw,3.1rem);font-weight:700;line-height:1.12;letter-spacing:-0.035em;margin:0 auto 0.8rem;max-width:850px}
.lp-sub{color:var(--text2);font-size:0.94rem;max-width:670px;margin:0 auto 1.2rem;line-height:1.7}
.lp-hero-actions{display:flex;align-items:center;justify-content:center;gap:1.15rem;flex-wrap:wrap}
.lp-hero-actions .btn-lg{padding:0.7rem 1.35rem;font-size:0.88rem}
.lp-hero-actions .btn .lp-action-icon{color:#ffe6d8}
.lp-hero-more{color:var(--text2)!important;font-size:0.8rem;font-weight:600;text-decoration:none;border-bottom:1px solid var(--border);padding:0.35rem 0}
.lp-hero-more .lp-action-icon{color:var(--pri);margin-left:0.25rem}
.lp-hero-highlights{display:flex;align-items:center;justify-content:center;flex-wrap:wrap;margin:1.25rem auto 0}
.lp-hero-highlight{display:flex;align-items:center;gap:0.42rem;padding:0.1rem 1rem;color:var(--text2);font-size:0.74rem;font-weight:500}
.lp-hero-highlight+.lp-hero-highlight{border-left:1px solid var(--border)}
.lp-hero-highlight svg{color:var(--sec);width:16px;height:16px;flex-shrink:0}
.lp-head{text-align:center;max-width:600px;margin:0 auto 2.75rem}
.lp-eyebrow{font-size:0.7rem;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:var(--pri)}
.lp-h2{font-family:var(--font-d);font-size:clamp(1.5rem,3vw,2.1rem);font-weight:700;letter-spacing:-0.02em;margin:0.55rem 0 0.6rem}
.lp-head p{color:var(--text2);font-size:0.9rem;line-height:1.7}
.lp-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1.25rem}
.lp-card{background:var(--bg2);border:1px solid var(--border);border-radius:var(--r);padding:1.6rem;box-shadow:var(--sh);transition:all 0.2s}
.lp-card:hover{transform:translateY(-3px);box-shadow:var(--sh2)}
.lp-card-ic{width:46px;height:46px;border-radius:12px;background:var(--pri-l);color:var(--pri);display:flex;align-items:center;justify-content:center;margin-bottom:1rem}
.lp-card-ic svg{width:23px;height:23px}
.lp-card-t{font-family:var(--font-d);font-weight:700;font-size:1rem;margin-bottom:0.4rem}
.lp-card-p{color:var(--text2);font-size:0.86rem;line-height:1.7}
.lp-steps{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:2rem}
.lp-step{border-top:1px solid var(--border);padding-top:1.15rem}
.lp-step-number{color:var(--pri);font-family:var(--font-d);font-size:0.78rem;font-weight:700;letter-spacing:0.08em}
.lp-step h3{font-family:var(--font-d);font-size:1rem;margin:1rem 0 0.45rem;color:var(--text)}
.lp-step p{color:var(--text2);font-size:0.84rem;line-height:1.7;max-width:300px}
.lp-start-in{display:flex;align-items:center;justify-content:space-between;gap:2rem}
.lp-start-copy{max-width:650px}
.lp-start .lp-h2{margin-top:0.55rem}
.lp-start-copy>p{color:var(--text2);font-size:0.9rem;line-height:1.7;max-width:590px}
.lp-start-in>.btn{white-space:nowrap;flex-shrink:0}
.lp-foot{background:var(--bg2);border-top:1px solid var(--border);padding:2rem 0}
.lp-foot-in{max-width:1140px;margin:0 auto;padding:0 1.5rem;display:flex;align-items:center;justify-content:space-between;gap:1rem;flex-wrap:wrap}
.lp-foot-links{display:flex;gap:1.75rem;font-size:0.84rem}
.lp-foot-links a{color:var(--text2);text-decoration:none}
.lp-foot-links a:hover{color:var(--pri)}
.lp-copy{font-size:0.82rem;color:var(--text3)}
@media(max-width:900px){.lp-links{display:none}.lp-nav-cta{display:none}.lp-burger{display:block}.lp-mobile-cta{display:flex;align-items:center;justify-content:space-between;margin-top:0.85rem;padding:0.7rem 1rem;border:0;border-radius:999px;background:var(--pri);color:#fff;font-family:var(--font);font-size:0.84rem;font-weight:700;cursor:pointer}.lp-grid{grid-template-columns:1fr}.lp-hero{padding:2.8rem 0 2rem}.lp-h1{font-size:clamp(2rem,6.3vw,2.8rem)}.lp-sec{padding:3.25rem 0}.lp-start-in{align-items:flex-start;flex-direction:column;gap:1.25rem}}
@media(max-width:560px){.lp-nav{height:64px}.lp-nav-in{width:calc(100% - 24px);height:64px;padding:0;gap:0.45rem}.lp-logo{gap:0.42rem}.lp-logo-ic{width:31px;height:31px;border-radius:9px;font-size:0.88rem}.lp-logo-t{font-size:0.94rem;letter-spacing:-0.035em}.lp-nav-r{gap:0.38rem}.lp-login{padding:0.48rem 0.45rem;font-size:0.75rem;gap:0.25rem}.lp-login-menu{min-width:175px}.lp-burger{width:31px;height:32px;padding:0;display:grid;place-items:center;flex-shrink:0;font-size:0.95rem}.lp-burger svg{width:17px;height:17px}.lp-mobile{padding:0.4rem 1rem 1rem}.lp-hero{padding:2.2rem 0 1.7rem}.lp-h1{font-size:clamp(1.9rem,8.2vw,2.35rem);max-width:430px}.lp-sub{font-size:0.84rem;line-height:1.65;margin-bottom:1rem}.lp-hero-actions{gap:0.8rem}.lp-hero-actions .btn-lg{padding:0.65rem 1.05rem;font-size:0.82rem}.lp-hero-more{font-size:0.74rem}.lp-hero-highlights{margin-top:0.95rem}.lp-hero-highlight{padding:0.25rem 0.5rem;font-size:0.66rem}.lp-hero-highlight svg{width:15px;height:15px}.lp-steps{grid-template-columns:1fr;gap:1.25rem}.lp-step{padding-top:0.8rem}.lp-step h3{margin:0.6rem 0 0.25rem}.lp-start .lp-h2{font-size:1.55rem}}
`;
