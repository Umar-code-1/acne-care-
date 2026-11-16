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
.patient-app-layout .main-col{height:100vh;height:100dvh;min-height:0}
.topbar{display:flex;align-items:center;justify-content:space-between;padding:0.75rem 1.5rem;background:var(--bg2);border-bottom:1px solid var(--border);position:sticky;top:0;z-index:20}
.topbar-t{font-family:var(--font-d);font-weight:700;font-size:1rem}
.topbar-r{display:flex;align-items:center;gap:0.85rem}
.topbar-left{display:flex;align-items:center;gap:0.85rem;min-width:0}
.portal-chip{position:absolute;left:50%;transform:translateX(-50%);display:inline-flex;align-items:center;gap:0.65rem;padding:0.65rem 1rem;border-radius:999px;background:var(--sec-l);color:var(--sec-d);font-family:var(--font-d);font-size:0.9rem;font-weight:700;white-space:nowrap}
.portal-chip>.ui-icon{font-size:1.2rem}
.portal-chip-dermatologist{background:var(--pri-l);color:var(--pri-d)}
.portal-chip-admin{background:var(--adm-l);color:var(--adm)}
.topbar-cart{position:relative;width:38px;height:38px;display:grid;place-items:center;border:0;border-radius:50%;background:transparent;color:var(--text2);font-size:1.15rem;cursor:pointer}
.topbar-cart:hover{background:var(--bg);color:var(--pri)}
.topbar-cart>span{position:absolute;top:0;right:-2px;min-width:17px;height:17px;display:grid;place-items:center;padding:0 0.2rem;border-radius:999px;background:var(--pri);color:#fff;font-size:0.65rem;font-weight:700}
.topbar-profile-wrap{position:relative}
.topbar-notifications-wrap{position:relative}
.topbar-notifications-button{position:relative;width:38px;height:38px;display:grid;place-items:center;border:0;border-radius:50%;background:transparent;color:var(--text2);cursor:pointer}
.topbar-notifications-button:hover,.topbar-notifications-button[aria-expanded="true"]{background:var(--pri-l);color:var(--pri-d)}
.topbar-notifications-button:focus-visible{outline:2px solid var(--pri);outline-offset:2px}
.topbar-notifications-button svg{width:20px;height:20px}
.topbar-notifications-button.is-notifying:not([aria-expanded="true"]) svg{animation:notification-bell-shake 1.6s ease-in-out infinite;transform-origin:50% 12%}
@keyframes notification-bell-shake{0%,72%,100%{transform:rotate(0)}75%,83%,91%{transform:rotate(-12deg)}79%,87%,95%{transform:rotate(12deg)}}
@media(prefers-reduced-motion:reduce){.topbar-notifications-button.is-notifying svg{animation:none}}
.topbar-notifications-badge{position:absolute;top:3px;right:3px;width:9px;height:9px;border:1.5px solid var(--bg2);border-radius:50%;background:var(--pri)}
.topbar-notifications-menu{position:absolute;top:calc(100% + 0.65rem);right:0;z-index:40;width:min(360px,calc(100vw - 2rem));overflow:hidden;border:1px solid var(--border);border-radius:var(--r2);background:var(--bg2);box-shadow:var(--sh2)}
.topbar-notifications-header{display:flex;align-items:center;justify-content:space-between;gap:0.75rem;padding:0.8rem 0.9rem;border-bottom:1px solid var(--border);font-family:var(--font-d);font-size:0.84rem}
.topbar-notifications-header-actions{display:flex;align-items:center;gap:0.65rem}
.topbar-notifications-header button{border:0;background:transparent;color:var(--pri-d);font:600 0.7rem var(--font);cursor:pointer}
.topbar-notifications-header button:hover{text-decoration:underline}
.topbar-notifications-list{max-height:min(420px,65vh);overflow-y:auto;overscroll-behavior-y:contain;scrollbar-gutter:stable;scrollbar-width:thin;scrollbar-color:var(--text3) var(--bg)}
.topbar-notifications-scroll-hint{display:flex;align-items:center;justify-content:center;gap:0.35rem;padding:0.4rem;border-top:1px solid var(--border);background:var(--bg2);color:var(--text2);font-size:0.7rem}
.topbar-notification-item{width:100%;display:grid;grid-template-columns:8px minmax(0,1fr);gap:0.65rem;padding:0.8rem 0.9rem;border:0;border-bottom:1px solid var(--border);background:var(--bg2);color:var(--text);text-align:left;cursor:pointer}
.topbar-notification-item:hover{background:var(--surface)}
.topbar-notification-item:last-child{border-bottom:0}
.topbar-notification-dot{width:7px;height:7px;margin-top:0.35rem;border-radius:50%;background:transparent}
.topbar-notification-item.is-unread{background:var(--surface)}
.topbar-notification-item.is-unread .topbar-notification-dot{background:var(--pri)}
.topbar-notification-copy{min-width:0;display:grid;gap:0.2rem}
.topbar-notification-copy strong{font-size:0.76rem}
.topbar-notification-copy>span{color:var(--text2);font-size:0.72rem;line-height:1.4}
.topbar-notification-copy time{color:var(--text3);font-size:0.65rem}
.topbar-notifications-empty{padding:1.35rem 1rem;color:var(--text2);font-size:0.8rem;text-align:center}
.topbar-notifications-view-all{width:100%;padding:0.6rem;border:0;border-top:1px solid var(--border);background:var(--bg2);color:var(--pri-d);font:600 0.74rem var(--font);cursor:pointer}
.topbar-notifications-view-all:hover{background:var(--surface)}
.topbar-profile{display:flex;align-items:center;gap:0.65rem;padding:0.2rem 0 0.2rem 0.9rem;border:0;border-left:1px solid var(--border);background:transparent;color:var(--text);font-family:var(--font);text-align:left;cursor:pointer}
.topbar-profile:focus-visible{outline:2px solid var(--pri);outline-offset:3px;border-radius:var(--r2)}
.topbar-avatar{width:42px;height:42px;display:grid;place-items:center;flex-shrink:0;border-radius:50%;font-family:var(--font-d);font-size:0.95rem;font-weight:700}
.topbar-user-copy{min-width:0;display:grid;gap:0.08rem}
.topbar-user-name{max-width:190px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:0.84rem;font-weight:700}
.topbar-user-role{color:var(--text3);font-size:0.74rem}
.topbar-chevron{color:var(--text2);font-size:0.95rem;transition:transform 0.15s}
.topbar-chevron.open{transform:rotate(180deg)}
.topbar-profile-menu{position:absolute;top:calc(100% + 0.55rem);right:0;z-index:30;min-width:180px;padding:0.35rem;border:1px solid var(--border);border-radius:var(--r2);background:var(--bg2);box-shadow:var(--sh2)}
.topbar-profile-menu button{width:100%;display:flex;align-items:center;gap:0.55rem;padding:0.65rem 0.7rem;border:0;border-radius:6px;background:transparent;color:var(--text);font:500 0.82rem var(--font);text-align:left;cursor:pointer}
.topbar-profile-menu button:hover{background:var(--bg)}
.topbar-profile-menu button:focus-visible{outline:2px solid var(--pri);outline-offset:-2px}
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
.doctor-availability-note{display:grid;justify-items:start;gap:.35rem;margin-top:.55rem;padding:.6rem .7rem;border:1px solid #b8ddc8;border-left:3px solid var(--ok);border-radius:8px;background:#eff8f2;color:#385b49;font-size:.76rem;line-height:1.45}
.doctor-availability-note>span>strong{color:#244b38}
.doctor-availability-days{padding:.18rem .45rem;border-radius:999px;background:#d9efdf;color:#1e6b3c;font-size:.74rem;font-weight:700}
.card{background:var(--bg2);border-radius:var(--r);border:1px solid var(--border);box-shadow:var(--sh);overflow:hidden;margin-bottom:1rem}
.card-h{padding:0.9rem 1.25rem;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between}
.card-t{font-family:var(--font-d);font-size:0.92rem;font-weight:700}
.card-b{padding:1.25rem}
.stat-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(155px,1fr));gap:0.85rem;margin-bottom:1.5rem}
.stat-c{background:var(--bg2);border-radius:var(--r);padding:1rem 1.1rem;border:1px solid var(--border);display:flex;align-items:center;gap:0.85rem;box-shadow:var(--sh)}
.stat-c>div:last-child{min-width:0;flex:1}
.stat-ic{width:44px;height:44px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:1.2rem;flex-shrink:0}
.stat-ic .ui-icon{width:1.15em;height:1.15em}
.stat-v{font-family:var(--font-d);font-size:1.5rem;font-weight:700;line-height:1}
.stat-l{font-size:0.76rem;color:var(--text2);margin-top:0.15rem;overflow-wrap:anywhere;line-height:1.3}
.next-actions-card{padding:1rem}
.next-actions-heading{display:flex;align-items:center;gap:0.65rem;margin-bottom:0.8rem}
.next-actions-heading-icon{width:36px;height:36px;display:grid;place-items:center;flex-shrink:0;border-radius:10px;background:var(--pri-l);color:var(--pri);font-size:1rem}
.next-actions-title{font-family:var(--font);font-size:0.98rem;line-height:1.3;font-weight:600}
.next-actions-heading p{margin-top:0.12rem;color:var(--text2);font-size:0.76rem}
.next-actions-primary{display:grid;gap:0.55rem}
.next-actions-secondary{display:grid;grid-template-columns:minmax(0,1fr);gap:0.55rem;margin-top:0.55rem}
.next-action{width:100%;min-width:0;display:grid;align-items:center;text-align:left;font-family:var(--font);cursor:pointer;transition:transform 0.16s,box-shadow 0.16s,border-color 0.16s}
.next-action:hover{transform:translateY(-1px);border-color:var(--pri);background:var(--surface)}
.next-action:focus-visible{outline:3px solid var(--pri);outline-offset:3px}
.next-action-primary{grid-template-columns:46px minmax(0,1fr) 34px;gap:0.7rem;min-height:68px;padding:0.6rem 0.8rem;border:1px solid var(--border);border-radius:var(--r2);background:var(--bg2);color:var(--text)}
.next-action-scan{position:relative;isolation:isolate;overflow:hidden;grid-template-columns:60px minmax(0,1fr) 44px;gap:0.8rem;min-height:88px;padding:0.8rem 1rem;border-color:transparent;background:linear-gradient(110deg,#e97934 0%,#df5b22 58%,#d84b16 100%);color:#fff}
.next-action-doctor{background:var(--bg2);border-color:var(--border);color:var(--text)}
.next-action-icon{width:48px;height:48px;display:grid;place-items:center;flex-shrink:0;border-radius:12px;font-size:1.35rem}
.next-action-primary .next-action-icon{width:46px;height:46px;background:var(--pri-l);color:var(--pri);font-size:1.15rem}
.next-action-scan .next-action-icon{width:60px;height:60px;border-radius:14px;background:#fff;color:#df5b22;font-size:1.45rem}
.next-action-scan .next-action-description{color:rgba(255,255,255,0.88);opacity:1}
.next-action-scan::before{content:"";position:absolute;z-index:0;right:-4%;bottom:-75%;width:34%;height:140%;border-radius:50%;background:rgba(255,255,255,0.1);pointer-events:none}
.next-action-scan::after{content:"";position:absolute;z-index:0;right:7%;bottom:-85%;width:27%;height:130%;border-radius:50%;background:rgba(255,255,255,0.06);pointer-events:none}
.next-action-scan>*{position:relative;z-index:1}
.next-action-scan .next-action-arrow{width:44px;height:44px;background:transparent;color:#fff;font-size:1.2rem}
.next-action-scan:hover{border-color:transparent;background:linear-gradient(110deg,#e97934 0%,#df5b22 58%,#d84b16 100%);box-shadow:0 7px 16px rgba(196,76,27,0.2)}
.next-action-doctor .next-action-icon{background:#cde8d4;color:#174f37}
.next-action-copy{min-width:0;display:grid;gap:0.1rem}
.next-action-title{font-family:var(--font);font-size:0.9rem;line-height:1.3;font-weight:600}
.next-action-description{font-size:0.75rem;line-height:1.4;opacity:0.82}
.next-action-arrow{width:32px;height:32px;display:grid;place-items:center;border-radius:50%;background:transparent;color:var(--pri);font-size:1rem}
.next-action-doctor .next-action-arrow{background:transparent;color:#174f37}
.next-action-secondary{grid-template-columns:36px minmax(0,1fr) 34px;gap:0.7rem;min-height:68px;padding:0.6rem 0.8rem;border:1px solid var(--border);border-radius:var(--r2);background:var(--surface);color:var(--text)}
.next-action-secondary .next-action-icon{width:36px;height:36px;font-size:0.95rem}
.next-action-routine{background:var(--bg2)}
.next-action-routine:hover{background:#f8e1d9}
.next-action-routine .next-action-icon{background:var(--pri-l);color:var(--pri)}
.next-action-products{background:var(--surface);border-color:var(--border)}
.next-action-products .next-action-icon{background:var(--acc-l);color:#8b5315}
.next-action-secondary .next-action-title{font-size:0.82rem}
.next-action-secondary .next-action-description{font-size:0.68rem;color:var(--text2)}
.next-action-secondary .next-action-arrow{width:32px;height:32px;background:transparent;color:var(--pri);font-size:1rem}
.next-actions-note{display:flex;align-items:flex-start;gap:0.55rem;margin-top:0.7rem;padding:0.65rem 0.2rem 0;border-top:1px solid var(--border);color:var(--text2);font-size:0.72rem;line-height:1.5}
.next-actions-note>.ui-icon{margin-top:0.1rem;color:var(--pri);font-size:0.9rem}
.appt-card-head{min-height:50px;padding:0.6rem 0.85rem;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;gap:0.65rem}
.appt-card-title{display:flex;align-items:center;gap:0.55rem;font-family:var(--font);font-size:0.86rem;font-weight:600}
.appt-card-title>.ui-icon{font-size:1rem;color:var(--text)}



.appt-card-list{padding:0.75rem;display:grid;gap:0.65rem}
.appt-row{width:100%;display:grid;grid-template-columns:52px minmax(0,1fr) 32px;align-items:center;gap:0.65rem;padding:0.6rem 0.85rem;border:1px solid var(--border);border-radius:var(--r);background:var(--bg2);color:var(--text);font-family:var(--font);text-align:left;cursor:pointer;transition:border-color 0.15s,background 0.15s,transform 0.15s}

.appt-row:hover{transform:translateY(-1px);border-color:var(--pri);background:var(--surface)}
.appt-row:focus-visible{outline:2px solid var(--pri);outline-offset:-2px}
.appt-date{min-height:58px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:0.03rem;border-radius:var(--r2);background:var(--ok-l);color:var(--ok);line-height:1.2}
.appt-date span{font-size:0.62rem;font-weight:500}
.appt-date strong{font-family:var(--font);font-size:1.05rem;font-weight:700}
.appt-row-pending .appt-date{background:var(--acc-l);color:#b7770d}
.appt-row-main{min-width:0;display:grid;gap:0.14rem}
.appt-row-top{min-width:0;display:flex;align-items:center;justify-content:space-between;gap:0.45rem}
.appt-doctor-name{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:0.8rem;font-weight:600}
.appt-specialty{color:var(--text3);font-size:0.68rem}
.appt-status{flex-shrink:0;padding:0.2rem 0.5rem;border-radius:999px;font-size:0.64rem;font-weight:600;text-transform:capitalize}
.appt-status-confirmed{background:var(--ok-l);color:var(--ok)}
.appt-status-pending{background:var(--acc-l);color:#a96a08}
.appt-details{display:flex;flex-wrap:wrap;align-items:center;gap:0.4rem 0.65rem;margin-top:0.12rem;color:var(--text2);font-size:0.66rem}
.appt-details>span{display:inline-flex;align-items:center;gap:0.28rem;min-width:0}
.appt-details .ui-icon{color:var(--text3);font-size:0.85rem}
.appt-row-arrow{width:32px;height:32px;display:grid;place-items:center;border-radius:50%;background:transparent;color:var(--pri);font-size:1rem}
.recent-plans-head{min-height:64px;padding:0.75rem 0.85rem;border-bottom:1px solid var(--border);display:grid;grid-template-columns:40px minmax(0,1fr) auto;align-items:center;gap:0.7rem}
.recent-plans-icon{width:38px;height:38px;display:grid;place-items:center;border-radius:10px;background:var(--pri-l);color:var(--pri);font-size:1.1rem}
.recent-plans-heading{min-width:0}
.recent-plans-heading h2{font-family:var(--font);font-size:0.92rem;line-height:1.3;font-weight:600}
.recent-plans-heading p{margin-top:0.12rem;color:var(--text2);font-size:0.72rem;line-height:1.4}
.recent-plans-view-all{display:inline-flex;align-items:center;gap:0.35rem;padding:0.4rem 0.65rem;border:0;border-radius:999px;background:transparent;color:var(--pri-d);font:600 0.72rem var(--font);white-space:nowrap;cursor:pointer}
.recent-plans-view-all:hover{background:transparent;text-decoration:underline}
.recent-plans-view-all:focus-visible{outline:2px solid var(--pri);outline-offset:2px}
.recent-plans-view-all .ui-icon{font-size:0.9rem}
@media(max-width:560px){
  .recent-plans-head{grid-template-columns:auto minmax(0,1fr) auto;gap:0 0.5rem}
  .recent-plans-icon{grid-area:1/1/3/2;width:34px;height:34px}
  .recent-plans-heading{display:contents}
  .recent-plans-heading h2{grid-area:1/2;min-width:0;font-size:clamp(0.875rem,3.8vw,1rem)}
  .recent-plans-heading p{grid-area:2/2/3/4;margin-top:0;font-size:clamp(0.72rem,3.25vw,0.8rem)}
  .recent-plans-head>.recent-plans-view-all{grid-area:1/3;justify-self:end;min-height:36px;padding-inline:0}
}
.recent-plans-list{padding:0.75rem;display:grid;gap:0.65rem}
.recent-plan-row{width:100%;min-width:0;display:grid;grid-template-columns:minmax(0,1fr) 32px;align-items:center;gap:0.7rem;padding:0.8rem;border:1px solid var(--border);border-radius:var(--r);background:var(--bg2);color:var(--text);font-family:var(--font);text-align:left;cursor:pointer;transition:border-color 0.15s,background 0.15s,transform 0.15s}
.recent-plan-row:hover{transform:translateY(-1px);border-color:var(--pri);background:var(--surface)}
.recent-plan-row:focus-visible{outline:2px solid var(--pri);outline-offset:2px}
.recent-plan-copy{min-width:0;display:grid;justify-items:start;gap:0.35rem}
.recent-plan-doctor{max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:0.86rem;font-weight:600}
.recent-plan-date{display:inline-flex;align-items:center;gap:0.4rem;color:var(--text2);font-size:0.74rem}
.recent-plan-date .ui-icon{color:var(--text3);font-size:0.95rem}
.recent-plan-summary{display:inline-flex;flex-wrap:wrap;align-items:center;gap:0.45rem 0.6rem;margin-top:0.1rem;padding:0;color:var(--text2);font-size:0.68rem;line-height:1.35}
.recent-plan-summary>span:not(.recent-plan-divider){display:inline-flex;align-items:center;gap:0.3rem}
.recent-plan-summary .ui-icon{color:var(--text3);font-size:0.8rem}
.recent-plan-summary strong{color:var(--text2);font-size:0.7rem;font-weight:600}
.recent-plan-divider{width:1px;height:14px;background:var(--border);align-self:center}
.recent-plan-arrow{width:32px;height:32px;display:grid;place-items:center;border-radius:50%;background:transparent;color:var(--pri);font-size:1rem}
.recent-plan-row-green .recent-plan-arrow{background:transparent;color:var(--ok)}
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
.tab-bar{display:flex;border-bottom:2px solid var(--border);margin-bottom:1.25rem;overflow:hidden}
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
  .topbar-left{gap:0.55rem}
  .portal-chip{padding:0.55rem 0.75rem;font-size:0.82rem}
  .topbar-profile{gap:0.45rem;padding-left:0.65rem}
  .topbar-avatar{width:36px;height:36px}
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

@media(max-width:560px){
  .topbar{display:grid;grid-template-columns:38px minmax(0,1fr) auto;column-gap:0.55rem;padding:0.55rem 0.75rem}
  .topbar-left{display:contents}
  .topbar-left .burger{position:static;grid-column:1}
  .portal-chip{position:static;grid-column:2;justify-self:center;transform:none;max-width:100%;box-sizing:border-box}
  .topbar-r{grid-column:3;justify-self:end;gap:0.5rem}
  .portal-chip{gap:0.3rem;padding:0.42rem 0.48rem;font-size:0.66rem}
  .portal-chip>.ui-icon{font-size:0.9rem;flex-shrink:0}
  .portal-chip>span{min-width:0;overflow:hidden;text-overflow:ellipsis}
  .topbar-profile{gap:0.25rem;padding:0.2rem 0.1rem 0.2rem 0.45rem;border-left:0}
  .topbar-avatar{width:34px;height:34px;font-size:0.82rem}
  .topbar-user-copy{display:none}
  .topbar-chevron{font-size:0.82rem}
}

@media(max-width:560px){
  .topbar-notifications-menu{position:fixed;top:3.45rem;right:0.5rem;left:auto;width:min(320px,calc(100vw - 1rem));max-height:calc(100dvh - 4rem)}
  .topbar-notifications-header{padding:0.65rem 0.75rem;font-size:0.78rem}
  .topbar-notifications-header-actions{gap:0.45rem}
  .topbar-notifications-header button{font-size:0.66rem}
  .topbar-notifications-list{max-height:min(420px,calc(100dvh - 9rem))}
  .topbar-notification-item{gap:0.5rem;padding:0.62rem 0.72rem}
  .topbar-notification-copy{gap:0.14rem}
  .topbar-notification-copy strong{font-size:0.72rem}
  .topbar-notification-copy>span{font-size:0.68rem}
  .topbar-notification-copy time{font-size:0.61rem}
  .topbar-notifications-view-all{padding:0.52rem;font-size:0.7rem}
}

@media(max-width:380px){
  .portal-chip{gap:0.28rem;padding:0.4rem 0.42rem;font-size:0.64rem}
  .portal-chip>.ui-icon{font-size:0.85rem}
}

@media(max-width:480px){
  .payment-summary-card>.card-h{align-items:flex-start;flex-direction:column;gap:0.55rem;padding:0.8rem 1rem}
  .payment-status-badge{max-width:100%;gap:0.5rem;white-space:normal;line-height:1.35}
  .stat-grid{grid-template-columns:repeat(2,minmax(0,1fr))}
  .next-actions-card{padding:1rem}
  .next-action-scan{grid-template-columns:48px minmax(0,1fr) 36px;gap:0.5rem;min-height:72px;padding:0.55rem 0.65rem}
  .next-action-scan .next-action-icon{width:48px;height:48px}
  .next-action-scan .next-action-arrow{width:36px;height:36px;font-size:1rem}
  .next-action-scan .next-action-title{font-size:0.86rem}
  .next-action-scan .next-action-description{font-size:0.68rem}
  .next-actions-secondary{grid-template-columns:1fr}
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
html:has(.auth-dialog[open]){overflow:hidden}
.auth-dialog{position:fixed;inset:0;margin:auto;width:min(26rem,calc(100% - 2rem));max-width:none;max-height:calc(100vh - 2rem);max-height:calc(100dvh - 2rem);padding:0;overflow:hidden;border:1px solid var(--border);border-radius:18px;background:var(--bg2);color:var(--text);box-shadow:0 20px 65px rgba(27,20,15,0.25)}
.auth-dialog::backdrop{background:rgba(30,24,20,0.48)}
.auth-dialog .auth-card{width:100%;max-width:none;max-height:inherit;overflow-y:auto;overscroll-behavior:contain;padding:1.25rem 1.5rem;background:transparent;border:0;border-radius:inherit;box-shadow:none}
.auth-close{position:absolute;top:0.45rem;right:0.45rem;z-index:1;width:2.5rem;height:2.5rem;display:grid;place-items:center;padding:0;border:0;border-radius:50%;background:var(--bg);color:var(--text);cursor:pointer}
.auth-close:hover{background:var(--pri-l);color:var(--pri-d)}
.auth-close:focus-visible{outline:2px solid var(--pri);outline-offset:2px}
.auth-card .tab-bar{margin-bottom:0.5rem}
.auth-card .tab{padding:0.4rem 0.8rem}
.auth-card .form-g{margin-bottom:0.45rem}
.auth-card .form-l{margin-bottom:0.2rem}
.auth-card .form-i{padding:0.45rem 0.65rem}
.auth-card .auth-pmdc-hint{grid-column:1/-1;margin:0 0 0.45rem}
.auth-password-wrap{position:relative}
.auth-password-wrap .form-i{padding-right:2.75rem}
.auth-password-toggle{position:absolute;top:50%;right:0.65rem;display:grid;place-items:center;width:2rem;height:2rem;transform:translateY(-50%);border:0;border-radius:6px;background:transparent;color:var(--text2);cursor:pointer}
.auth-password-toggle:hover{color:var(--pri)}
.auth-password-toggle:focus-visible{outline:2px solid var(--pri);outline-offset:1px}
.auth-password-toggle svg{width:18px;height:18px}
.auth-options-row{display:flex;align-items:center;justify-content:space-between;gap:0.5rem;margin:0 0 0.55rem;font-size:0.78rem}
.auth-remember{display:inline-flex;align-items:center;gap:0.45rem;color:var(--text2);cursor:pointer}
.auth-remember input{appearance:none;width:16px;height:16px;margin:0;border:1.5px solid #8b95a5;border-radius:5px;background:#fff;display:grid;place-content:center;cursor:pointer;transition:background 0.18s,border-color 0.18s}
.auth-remember input:checked{background:var(--pri);border-color:var(--pri)}
.auth-remember input:checked::after{content:"";width:7px;height:4px;border:2px solid #fff;border-top:0;border-right:0;transform:rotate(-45deg) translate(1px,-1px)}
.auth-remember input:focus-visible{outline:2px solid var(--pri);outline-offset:2px}
.auth-forgot{padding:0;border:0;background:transparent;color:var(--pri);font:inherit;font-weight:600;cursor:pointer}
.auth-forgot:hover{text-decoration:underline}
.auth-forgot:focus-visible{outline:2px solid var(--pri);outline-offset:2px;border-radius:2px}
.auth-notice{padding:0.65rem 0.85rem;margin-bottom:0.85rem;border:1px solid #aed6f1;border-radius:var(--r2);background:var(--info-l);color:var(--info);font-size:0.82rem;line-height:1.5}
.auth-title{padding-inline:1.65rem;margin:0 0 0.2rem;font-family:var(--font-d);font-size:1.45rem;font-weight:700;line-height:1.25;text-align:center}
.auth-sub{color:var(--text2);font-size:0.82rem;line-height:1.4;margin-bottom:0.55rem;text-align:center}
.auth-back{background:none;border:none;color:var(--text2);font-family:var(--font);font-size:0.82rem;font-weight:600;cursor:pointer;margin-bottom:1.1rem;padding:0}
.auth-back:hover{color:var(--pri)}
.auth-divider{display:flex;align-items:center;gap:0.65rem;color:var(--text3);font-size:0.72rem;margin:0.35rem 0}
.auth-divider::before,.auth-divider::after{content:'';flex:1;height:1px;background:var(--border)}
.auth-switch{text-align:center;font-size:0.82rem;color:var(--text2);margin-top:1.1rem}
.auth-switch button{background:none;border:none;color:var(--pri);font-family:var(--font);font-size:0.82rem;font-weight:700;cursor:pointer}
.role-tabs{display:grid;grid-template-columns:repeat(3,1fr);gap:0.25rem;margin-bottom:0.55rem;background:var(--bg);border-radius:10px;padding:0.2rem}
.rt{min-height:32px;padding:0.25rem;border-radius:7px;border:none;cursor:pointer;font-family:var(--font);font-size:0.78rem;font-weight:500;transition:all 0.18s;background:transparent;color:var(--text2);display:flex;flex-direction:row;align-items:center;justify-content:center;gap:0.3rem}
.rt.act{background:var(--bg2);color:var(--text);box-shadow:var(--sh);font-weight:700}
.auth-err{background:var(--dan-l);border:1px solid #f5c6c2;border-radius:var(--r2);padding:0.65rem 0.85rem;color:var(--dan);font-size:0.82rem;margin-bottom:0.85rem}
.auth-demo{margin-top:0.65rem;padding:0.45rem 0.6rem;background:var(--acc-l);border-radius:var(--r2);border:1px solid #f0d898}
.auth-demo summary{cursor:pointer}
.auth-demo:not([open]) .ad-t{margin-bottom:0}
.ad-t{font-size:0.72rem;font-weight:700;color:var(--acc);margin-bottom:0.15rem;text-transform:uppercase;letter-spacing:0.05em}
.ad-c{font-size:0.73rem;color:var(--text2);line-height:1.45;overflow-wrap:anywhere}
@media(max-width:480px){
  .auth-dialog{width:min(22rem,calc(100% - 2rem))}
  .auth-dialog .auth-card{padding:0.95rem 0.85rem}
  .auth-title{font-size:1.3rem}
  .auth-card .form-i{font-size:0.875rem}
  .auth-actions{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:0.45rem}
  .auth-actions .auth-divider{display:none}
  .auth-actions .btn{min-height:40px;padding:0.35rem 0.4rem;line-height:1.25}
}
@media(max-width:480px) and (max-height:680px){
  .auth-fields-doctor{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));align-items:end;column-gap:0.5rem}
}
.assess-root{max-width:680px;margin:0 auto}
.assess-root-result{max-width:1100px}
.assess-root-upload{max-width:900px}
.next-steps-panel{margin-top:1rem;padding:1.25rem;background:var(--bg2);border:1px solid var(--border);border-radius:var(--r3);box-shadow:var(--sh)}
.next-steps-heading{display:flex;align-items:center;gap:0.75rem;margin-bottom:1rem}
.next-steps-heading-icon{width:42px;height:42px;display:grid;place-items:center;flex-shrink:0;border-radius:12px;background:var(--pri-l);color:var(--pri);font-size:1.2rem}
.next-steps-heading h2{font-family:var(--font);font-size:1.05rem;line-height:1.3;font-weight:700;color:var(--text)}
.next-steps-heading p{margin-top:0.15rem;color:var(--text2);font-size:0.82rem}
.next-steps-saved-badge{display:flex;align-items:center;justify-content:center;gap:0.3rem;flex-shrink:0;margin-left:auto;padding:0.3rem 0.6rem;border:1px solid #cfe6d9;border-radius:999px;background:#edf7f1;color:#267653;font-size:0.7rem;font-weight:600;line-height:1.2;white-space:nowrap}
.next-steps-saved-badge .ui-icon{width:0.8rem;height:0.8rem}
.next-steps-success{position:relative;display:flex;align-items:center;gap:1rem;overflow:hidden;margin-bottom:1rem;padding:1rem 1.2rem;border:1px solid #dcefe6;border-radius:var(--r);background:linear-gradient(110deg,#f0f8f4,#f7fbf8);color:var(--text)}
.next-steps-success::after{content:"";position:absolute;right:1rem;bottom:-3.2rem;width:170px;height:100px;border-radius:50%;background:radial-gradient(ellipse at 50% 50%,rgba(42,125,107,0.09) 0 48%,transparent 50%);pointer-events:none}
.next-steps-check{width:46px;height:46px;display:grid;place-items:center;flex-shrink:0;border-radius:50%;background:var(--ok);color:#fff;font-size:1.5rem}
.next-steps-success strong{color:var(--sec-d);font-size:0.9rem}
.next-steps-success p{margin-top:0.2rem;color:var(--text2);font-size:0.8rem}
.next-steps-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:0.75rem}
.next-step-action{display:grid;grid-template-columns:52px minmax(0,1fr) 34px;align-items:center;gap:0.7rem;min-width:0;min-height:108px;padding:0.8rem;border:1px solid transparent;border-radius:var(--r);font-family:var(--font);text-align:left;cursor:pointer;transition:transform 0.16s,box-shadow 0.16s}
.next-step-action:hover{transform:translateY(-2px);border-color:#e9b4a8;background:#fff1ed;box-shadow:var(--sh2)}
.next-step-action:focus-visible{outline:3px solid var(--pri);outline-offset:3px}
.next-step-icon{width:52px;height:52px;display:grid;place-items:center;border-radius:14px;font-size:1.55rem}
.next-step-copy{display:grid;gap:0.25rem;min-width:0}
.next-step-copy strong{color:var(--text);font-size:0.84rem;line-height:1.3}
.next-step-copy>span{color:var(--text2);font-size:0.72rem;line-height:1.4}
.next-step-arrow{width:34px;height:34px;display:grid;place-items:center;border-radius:50%;font-size:1.15rem}
.next-step-diet,.next-step-routine,.next-step-doctor,.next-step-scan{background:transparent;border-color:var(--border)}
.next-step-action .next-step-icon{background:var(--pri-l);color:var(--pri)}
.next-step-action .next-step-arrow{background:var(--bg);color:var(--pri)}
@media(max-width:1000px){.next-steps-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media(max-width:560px){.next-steps-panel{padding:0.9rem}.next-steps-heading{gap:0.5rem}.next-steps-heading-icon{width:36px;height:36px;font-size:1rem}.next-steps-heading h2{font-size:0.95rem}.next-steps-heading p{font-size:0.74rem}.next-steps-saved-badge{gap:0.2rem;padding:0.25rem 0.4rem;font-size:clamp(0.58rem,2.5vw,0.68rem)}.next-steps-saved-badge .ui-icon{width:0.7rem;height:0.7rem}.next-steps-success{gap:0.65rem;padding:0.7rem}.next-steps-check{width:34px;height:34px;font-size:1.1rem}.next-steps-success strong{font-size:0.82rem}.next-steps-success p{font-size:0.72rem}.next-steps-grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:0.5rem}.next-step-action{grid-template-columns:30px minmax(0,1fr) 20px;gap:0.35rem;min-height:68px;padding:0.5rem}.next-step-icon{width:30px;height:30px;border-radius:9px;font-size:0.95rem}.next-step-copy strong{font-size:0.75rem}.next-step-copy>span{display:none}.next-step-arrow{display:grid;width:20px;height:20px;font-size:0.85rem}}
.assess-prog-bar{height:6px;background:var(--border);border-radius:3px;overflow:hidden;margin-top:0.5rem}
.assess-prog-fill{height:100%;background:linear-gradient(90deg,var(--pri),var(--acc));border-radius:3px;transition:width 0.4s ease}
.assess-step{background:var(--bg2);border-radius:var(--r);border:1px solid var(--border);padding:1.75rem;box-shadow:var(--sh)}
.assess-step-title{font-family:var(--font-d);font-size:1.2rem;font-weight:700;margin-bottom:0.35rem}
.assess-step-why{font-size:0.8rem;color:var(--text3);margin-bottom:1.5rem;padding:0.65rem 0.85rem;background:var(--acc-l);border-radius:var(--r2);border-left:3px solid var(--acc);line-height:1.6}
.check-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:0.5rem}
.check-item{display:flex;align-items:center;gap:0.5rem;padding:0.55rem 0.75rem;border:1.5px solid var(--border);border-radius:var(--r2);cursor:pointer;transition:all 0.15s;background:var(--bg);font-size:0.84rem;font-weight:500}
.check-item:hover{border-color:var(--pri);background:var(--pri-l)}
.check-item.sel{border-color:var(--pri);background:var(--pri-l);color:var(--pri-d)}
.auth-terms{align-items:center;margin-bottom:0.55rem;padding:0.4rem 0.55rem;gap:0.4rem;line-height:1.35}
.auth-terms input{appearance:none;width:1rem;height:1rem;flex-shrink:0;border:1.5px solid var(--text2);border-radius:50%;background:var(--bg2);cursor:pointer}
.auth-terms input:checked{border-color:var(--pri);background:var(--pri);box-shadow:inset 0 0 0 3px var(--bg2)}
.auth-terms input:focus-visible{outline:2px solid var(--pri);outline-offset:2px}
.auth-terms>span:last-child{font-size:0.72rem;font-weight:400}
.radio-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:0.5rem}
.radio-item{display:flex;align-items:center;gap:0.5rem;padding:0.6rem 0.85rem;border:1.5px solid var(--border);border-radius:var(--r2);cursor:pointer;transition:all 0.15s;background:var(--bg);font-size:0.84rem;font-weight:500}
.radio-item:hover{border-color:var(--pri);background:var(--pri-l)}
.radio-item.sel{border-color:var(--pri);background:var(--pri-l);color:var(--pri-d);font-weight:700}
.range-wrap{display:flex;align-items:center;gap:0.85rem}
.range-wrap input[type=range]{flex:1;height:5px;accent-color:var(--pri)}
.assess-nav{display:flex;justify-content:space-between;align-items:center;margin-top:1.5rem}
.assess-nav-actions{display:flex;flex-wrap:wrap;justify-content:flex-end;gap:0.5rem;min-width:0}
.assess-skip-all{white-space:nowrap}
.skip-all-mobile{display:none}
@media(max-width:560px){.assess-nav-actions{gap:0.35rem}.assess-skip-all{padding:0.5rem 0.6rem;font-size:0.75rem}.skip-all-full{display:none}.skip-all-mobile{display:inline}}
.image-tips{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:0.6rem;margin-bottom:1.25rem}
.img-tip{display:flex;align-items:center;gap:0.6rem;padding:0.7rem 0.85rem;background:var(--ok-l);border:1px solid #a9dfbf;border-radius:var(--r2);font-size:0.82rem;font-weight:500;color:var(--ok)}
.img-tip>span:first-child{flex-shrink:0}
.img-tip>span:last-child{min-width:0;overflow-wrap:anywhere}
@media(max-width:560px){.image-tips{grid-template-columns:minmax(0,1fr)}}
.photo-consent{display:flex;align-items:center;gap:0.4rem;width:fit-content;max-width:100%;margin:0.35rem 0 0.65rem;padding:0.3rem 0.4rem;border:1px solid var(--border);border-radius:6px;background:transparent;color:var(--text2);font-size:0.74rem;font-weight:500;cursor:pointer}
.photo-consent input{width:0.85rem;height:0.85rem;margin:0;accent-color:var(--pri);flex-shrink:0}
.photo-consent.is-checked{border-color:var(--ok);background:var(--ok-l)}
.photo-consent.has-warning{border-color:var(--dan);background:var(--dan-l)}
.best-results{margin:0 0 1.25rem}
.best-results-title{margin-bottom:0.55rem;font-size:0.95rem;font-weight:700;color:var(--text)}
.best-results-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:0.55rem}
.best-result-tip{display:flex;align-items:center;gap:0.65rem;min-width:0;padding:0.65rem 0.75rem;border-radius:var(--r2);background:#f7f2ed;color:var(--text2);font-size:0.82rem;line-height:1.35}
.best-result-tip .ui-icon{width:1.1rem;height:1.1rem;flex-shrink:0;color:var(--sec)}
@media(max-width:560px){.best-results-grid{grid-template-columns:1fr}.best-result-tip{padding:0.6rem 0.7rem}}
@media(max-width:560px){.upload-zone{padding:1.35rem 0.75rem}.upload-card .card-h{flex-wrap:wrap;gap:0.5rem}.upload-card .card-b{padding:0.85rem}}
.scan-photo-actions{display:flex;justify-content:center;align-items:center;flex-wrap:nowrap;gap:0.5rem}
.scan-photo-actions .btn{min-height:2.25rem;padding:0.35rem 0.7rem;font-size:0.74rem;font-weight:700;cursor:pointer}
.scan-photo-change{border:1px solid var(--pri);background:var(--pri);color:#fff}
.scan-photo-change:hover{border-color:var(--pri-d);background:var(--pri-d)}
.scan-photo-remove{border:1px solid var(--pri);background:var(--pri);color:#fff}
.scan-photo-remove:hover{border-color:var(--pri-d);background:var(--pri-d)}
.scan-photo-change:focus-visible,.scan-photo-remove:focus-visible{outline:2px solid var(--text);outline-offset:2px}
.scan-progress-ring{position:relative;width:160px;height:160px;margin:0 auto 1.25rem}
.scan-progress-ring svg{position:absolute;inset:0;width:100%;height:100%;transform:rotate(-90deg);overflow:visible}
.scan-progress-track,.scan-progress-fill{fill:none;stroke-width:7}
.scan-progress-track{stroke:var(--border)}
.scan-progress-fill{stroke:var(--pri);stroke-linecap:round;stroke-dasharray:465;transition:stroke-dashoffset 0.35s ease}
.scan-progress-photo{position:absolute;inset:12px;width:136px;height:136px;object-fit:cover;border-radius:50%;opacity:0.88}
.selected-skin-photo{display:block;width:clamp(190px,26vw,360px);max-width:100%;max-height:380px;height:auto;object-fit:contain;margin:0 auto 0.85rem;border:1px solid var(--border);border-radius:10px}
@media(max-width:560px){.selected-skin-photo{width:clamp(120px,44vw,190px);max-height:260px}}
.upload-zone{display:block;width:100%;border:2px dashed var(--border);border-radius:var(--r);padding:clamp(1.5rem,4vw,2.5rem) clamp(1rem,2vw,1.5rem);text-align:center;cursor:pointer;transition:all 0.2s;background:var(--bg);position:relative;margin-bottom:1rem}
.upload-zone-icon{font-size:clamp(1.8rem,3vw,2.5rem);margin-bottom:0.5rem}
.upload-zone-title{font-weight:700;margin-bottom:0.35rem;font-size:clamp(0.88rem,1.2vw,0.95rem)}
.upload-zone-meta{font-size:clamp(0.72rem,0.9vw,0.8rem);color:var(--text3)}
.upload-zone:hover{border-color:var(--pri);background:var(--pri-l)}
.upload-input{position:absolute;inset:0;opacity:0;cursor:pointer;width:100%;height:100%}
.prog-bar{height:8px;background:var(--border);border-radius:4px;overflow:hidden;margin-top:0.75rem}
.prog-fill{height:100%;background:linear-gradient(90deg,var(--pri),var(--acc));border-radius:4px;transition:width 0.3s}
.an-result{background:linear-gradient(135deg,var(--pri-d),var(--sec-d));color:#fff;border-radius:var(--r);padding:1.5rem;margin-bottom:1rem}
.an-h{display:flex;align-items:center;gap:1rem;margin-bottom:1rem}
.an-result-type{flex:1;min-width:0}
.an-result-type .an-t{font-size:clamp(0.85rem,calc(0.7rem + 1vw),1.3rem);line-height:1.25;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.an-result-caption{font-size:0.76rem;opacity:0.72}
.an-result-severity{flex-shrink:0;margin-left:auto;text-align:right}
.an-result-severity-value{font-size:clamp(0.95rem,calc(0.75rem + 0.5vw),1.4rem);font-weight:700;line-height:1.25}
.an-ic{width:60px;height:60px;border-radius:12px;background:rgba(255,255,255,0.1);display:flex;align-items:center;justify-content:center;font-size:1.6rem;border:2px solid rgba(255,255,255,0.2);flex-shrink:0}
.an-result-photo{width:60px;height:60px;object-fit:cover;border-radius:12px;border:2px solid rgba(255,255,255,0.2);flex-shrink:0}
.an-result-metrics{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:0.5rem;margin:0.85rem 0}
.an-result-metric{min-width:0;background:rgba(255,255,255,0.1);border-radius:8px;padding:0.6rem;text-align:center}
.an-result-metric-label{font-size:0.68rem;opacity:0.75;margin-bottom:0.25rem}
.an-result-metric-value{font-size:clamp(0.78rem,calc(0.75rem + 0.25vw),0.95rem);font-weight:700;overflow-wrap:anywhere}
@media(max-width:560px){.an-result{padding:1rem}.an-h{gap:0.65rem}.an-result-photo{width:48px;height:48px;border-radius:10px}.an-result-caption{font-size:0.68rem}.an-result-metrics{grid-template-columns:repeat(2,minmax(0,1fr));gap:0.45rem}.an-result-metric-skin{grid-column:1/-1}.an-result-metric{padding:0.55rem 0.45rem}}
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
.diet-section>summary{list-style:none;cursor:pointer}
.diet-section>summary::-webkit-details-marker{display:none}
.diet-section>summary:focus-visible{outline:2px solid var(--pri);outline-offset:-2px}
.diet-section>summary:hover{background:var(--bg)}
.diet-section-summary .card-t{display:flex;align-items:center;gap:0.4rem}
.diet-section-arrow{margin-left:auto;color:var(--text3);transition:transform 0.18s}
.diet-section[open] .diet-section-arrow{transform:rotate(180deg)}
.diet-section .diet-g{margin-bottom:0}
.diet-plan-actions .btn-ghost{border:1px solid var(--pri);background:var(--pri-l);color:var(--pri-d)}
.diet-plan-actions .btn-ghost:hover{border-color:var(--pri);background:var(--pri);color:#fff;transform:translateY(-1px)}
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
.doc-review-link-row{display:flex;align-items:center;gap:.45rem;margin-top:.1rem}
.doc-rating{color:var(--acc);font-size:.76rem}
.doc-review-link{padding:0;border:0;background:transparent;color:var(--pri);font:600 .72rem var(--font);text-decoration:underline;text-underline-offset:2px;cursor:pointer}
.doctor-reviews-backdrop{position:fixed;inset:0;z-index:1100;display:grid;place-items:center;padding:1rem;background:rgba(20,16,13,.58)}
.doctor-reviews-dialog{width:min(100%,520px);max-height:min(80vh,620px);overflow-y:auto;padding:1.25rem;border:1px solid var(--border);border-radius:16px;background:var(--bg2);color:var(--text);box-shadow:var(--sh2)}
.doctor-reviews-header{display:flex;align-items:flex-start;justify-content:space-between;gap:1rem;margin-bottom:1rem}
.doctor-reviews-header h2{font-family:var(--font-d);font-size:1.05rem;line-height:1.35}
.doctor-reviews-rating{display:flex;align-items:center;gap:.3rem;margin-top:.35rem;color:var(--acc);font-size:.78rem;font-weight:600}
.doctor-reviews-rating .ui-icon,.doctor-review-topline .ui-icon{width:14px;height:14px}
.doctor-reviews-close{width:30px;height:30px;flex:0 0 30px;border:1px solid var(--border);border-radius:50%;background:var(--bg);color:var(--text2);font-size:1.2rem;line-height:1;cursor:pointer}
.doctor-reviews-empty{padding:1rem;border:1px dashed var(--border);border-radius:10px;color:var(--text2);font-size:.84rem;text-align:center}
.doctor-review-list{display:grid;gap:.65rem}
.doctor-review{padding:.8rem;border:1px solid var(--border);border-radius:10px;background:var(--bg)}
.doctor-review-topline{display:flex;justify-content:space-between;gap:.75rem;font-size:.8rem}
.doctor-review-topline>span{display:inline-flex;align-items:center;gap:.25rem;color:var(--acc);font-size:.75rem;font-weight:600}
.doctor-review p{margin:.45rem 0;color:var(--text2);font-size:.82rem;line-height:1.5}
.doctor-review time{color:var(--text3);font-size:.7rem}
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
@media(max-width:560px){.bk-steps{width:100%;gap:0;margin-bottom:1.15rem;overflow:visible}.bk-steps>div{min-width:0}.bk-step{flex:1 1 0;min-width:0;flex-direction:column;gap:.28rem}.bk-sn{width:25px;height:25px;flex:0 0 25px;font-size:.68rem}.bk-sl{max-width:100%;font-size:.62rem;line-height:1.2;white-space:normal;text-align:center;overflow-wrap:anywhere}.bk-line{align-self:flex-start;flex:1 1 0;min-width:6px;max-width:18px;margin-top:11px}}
.type-cards{display:grid;width:min(100%,520px);grid-template-columns:repeat(2,minmax(0,1fr));gap:1rem;margin:0 0 1.25rem}
.type-c{border:2px solid var(--border);border-radius:var(--r);padding:.85rem .7rem;cursor:pointer;text-align:center;transition:all 0.18s;background:var(--bg)}
.type-c:hover{border-color:var(--pri)}.type-c.sel{border-color:var(--pri);background:var(--pri-l)}
.type-c-icon{margin-bottom:.3rem;font-size:1.7rem;line-height:1.1}.type-c-title{margin-bottom:.25rem;font-size:.9rem;font-weight:700}.type-c-price{font-size:.9rem;font-weight:700}.type-c-price-physical{color:var(--pri)}.type-c-price-online{color:var(--sec)}
.plat-grid{display:grid;width:min(100%,480px);grid-template-columns:repeat(3,minmax(0,1fr));gap:0.65rem;margin:0 0 1rem}
.plat-c{border:2px solid var(--border);border-radius:var(--r2);padding:.6rem .4rem;cursor:pointer;text-align:center;transition:all 0.18s;background:var(--bg)}
.plat-c:hover{border-color:var(--pri)}.plat-c.sel{border-color:var(--pri);background:var(--pri-l)}
.plat-c-icon{margin-bottom:.2rem;font-size:1.25rem;line-height:1.1}.plat-c-name{font-size:.75rem;font-weight:600}
@media(max-width:560px){.type-cards{width:100%;grid-template-columns:repeat(2,minmax(0,1fr));gap:.55rem}.type-c{padding:.55rem .3rem}.type-c-icon{margin-bottom:.2rem;font-size:1.3rem}.type-c-title{font-size:.72rem}.type-c-price{font-size:.8rem}.plat-grid{width:100%;gap:.4rem}.plat-c{padding:.45rem .25rem}.plat-c-icon{margin-bottom:.15rem;font-size:1.05rem}.plat-c-name{font-size:.65rem}}
.time-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:0.45rem}
.time-slot{padding:0.5rem;border:1.5px solid var(--border);border-radius:var(--r2);text-align:center;font-size:0.8rem;cursor:pointer;transition:all 0.15s;background:var(--bg)}
.time-slot:hover{border-color:var(--pri)}.time-slot.sel{border-color:var(--pri);background:var(--pri-l);color:var(--pri);font-weight:700}
.confirm-box{background:linear-gradient(135deg,var(--sec),var(--sec-d));color:#fff;border-radius:var(--r);padding:2rem;text-align:center}
.confirm-details{background:rgba(255,255,255,0.12);border-radius:var(--r2);padding:1rem;margin:1rem 0;text-align:left;display:grid;gap:0.5rem}
.confirm-row{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.35fr);gap:0.65rem;font-size:0.86rem}
.confirm-row dt,.confirm-row dd{overflow-wrap:anywhere}
.confirm-row dd{text-align:right}
.confirm-icon{font-size:3rem;margin-bottom:0.75rem}
.confirm-title{font-family:var(--font-d);font-size:1.3rem;margin-bottom:0.5rem}
.confirm-message{opacity:0.9;margin-bottom:0.85rem;overflow-wrap:anywhere}
.confirm-meeting-note{background:rgba(255,255,255,0.12);border-radius:var(--r2);padding:0.75rem;font-size:0.84rem;margin-top:0.5rem}
.confirm-box .confirm-again{background:rgba(255,255,255,0.2);color:#fff;border:1px solid rgba(255,255,255,0.3);margin-top:1rem}
@media(max-width:600px){
  .booking-confirmation .ph{margin-bottom:0.6rem}
  .booking-confirmation .confirm-box{padding:clamp(0.75rem,4vw,1.25rem)}
  .confirm-icon{font-size:2rem;line-height:1;margin-bottom:0.45rem}
  .confirm-title{font-size:clamp(1rem,4.8vw,1.25rem);line-height:1.25;margin-bottom:0.25rem}
  .confirm-message{font-size:0.8rem;margin-bottom:0.55rem}
  .booking-confirmation .confirm-details{padding:0.6rem 0.7rem;margin:0.55rem 0;gap:0.25rem}
  .booking-confirmation .confirm-row{font-size:0.78rem;line-height:1.35}
  .confirm-meeting-note{padding:0.45rem 0.6rem;font-size:0.75rem;line-height:1.35}
  .confirm-box .confirm-again{margin-top:0.6rem}
}
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
.profile-hero{position:relative;padding:1rem;gap:1rem;margin-bottom:1rem}
.p-av{width:58px;height:58px;border-radius:50%;background:rgba(255,255,255,0.2);display:flex;align-items:center;justify-content:center;font-size:1.45rem;font-weight:700;border:2px solid rgba(255,255,255,0.3);flex-shrink:0;overflow:hidden}
.profile-avatar-image,.topbar-avatar-image{width:100%;height:100%;display:block;object-fit:cover;border-radius:50%}
.p-name{font-family:var(--font-d);font-size:1.15rem;font-weight:700}
.p-email{opacity:0.8;font-size:0.88rem;margin-top:0.2rem}
.p-badges{display:flex;gap:0.6rem;margin-top:0.65rem;flex-wrap:wrap}
.p-badge{background:rgba(255,255,255,0.15);border:1px solid rgba(255,255,255,0.25);border-radius:20px;padding:0.25rem 0.75rem;font-size:0.78rem}
.p-badge-patient{background:#fff;color:var(--pri-d);border-color:#fff;font-weight:800}
.profile-identity-row{display:flex;align-items:center;justify-content:space-between;gap:0.75rem;min-width:0}
.profile-identity-copy{min-width:0}
.profile-avatar-wrap{position:relative;width:58px;height:58px;flex-shrink:0}
.profile-edit-icon{position:absolute;top:0.65rem;right:0.65rem;width:32px;height:32px;display:grid;place-items:center;border:1px solid rgba(255,255,255,0.55);border-radius:8px;background:rgba(255,255,255,0.12);color:#fff;cursor:pointer}
.profile-edit-icon .ui-icon{width:16px;height:16px}
.profile-edit-icon:hover,.profile-edit-icon:focus-visible{background:rgba(255,255,255,0.25);outline:2px solid #fff;outline-offset:2px}
.profile-hero>div:not(.p-av){flex:1;min-width:0;padding-right:2rem}
.profile-edit-fields{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:0.55rem;max-width:520px;text-align:left}
.profile-edit-fields>label{display:grid;gap:0.2rem;font-size:0.72rem;font-weight:600}
.profile-edit-fields input:not([type=file]){width:100%;min-width:0;padding:0.4rem 0.55rem;border:1px solid rgba(255,255,255,0.5);border-radius:6px;background:#fff;color:var(--text);font:inherit;font-size:0.8rem}
.profile-avatar-options,.profile-edit-actions{grid-column:1/-1;display:flex;align-items:center;flex-wrap:wrap;gap:0.4rem}
.profile-avatar-options{font-size:0.72rem}
.profile-avatar-options button{width:32px;height:32px;border:1px solid rgba(255,255,255,0.45);border-radius:50%;background:rgba(255,255,255,0.15);font-size:1rem;cursor:pointer}
.profile-avatar-options button.selected{outline:2px solid #fff;outline-offset:1px;background:rgba(255,255,255,0.3)}
.profile-edit-actions{margin-top:0.2rem}
.profile-edit-actions .btn-pri,.profile-edit-actions .btn-ghost{border:1px solid #fff;background:#fff;color:var(--pri-d)}
.profile-edit-actions .btn-ghost{color:var(--pri)}
.profile-edit-actions .btn-pri:hover,.profile-edit-actions .btn-pri:focus-visible,.profile-edit-actions .btn-ghost:hover,.profile-edit-actions .btn-ghost:focus-visible{background:#fff3ec;color:var(--pri-d);border-color:#fff;box-shadow:0 0 0 2px rgba(255,255,255,0.45)}
.profile-avatar-trigger{position:relative;padding:0;line-height:1.1;color:#fff;cursor:pointer}
.profile-avatar-edit-mark{position:absolute;right:-2px;bottom:-2px;z-index:1;width:22px;height:22px;padding:0;display:grid;place-items:center;border:1.5px solid var(--pri);border-radius:50%;background:#fff;color:var(--pri-d);box-shadow:0 1px 4px rgba(0,0,0,0.18);cursor:pointer}
.profile-avatar-edit-mark .ui-icon{width:11px;height:11px}
.profile-avatar-edit-mark:focus-visible{outline:2px solid #fff;outline-offset:2px}
.profile-avatar-trigger:focus-visible{outline:2px solid #fff;outline-offset:3px}
.avatar-picker-backdrop{position:fixed;inset:0;z-index:1000;display:grid;place-items:center;padding:1rem;background:rgba(20,16,13,0.62)}
.avatar-picker-dialog{width:min(100%,360px);padding:1.35rem;border:1px solid var(--border);border-radius:16px;background:var(--bg2);color:var(--text);box-shadow:var(--sh2);text-align:center}
.avatar-picker-dialog h2{font-family:var(--font-d);font-size:1.1rem}
.avatar-picker-dialog>p{margin:0.35rem 0 1rem;color:var(--text2);font-size:0.82rem}
.avatar-picker-options{display:flex;justify-content:center;gap:0.75rem;margin-bottom:1rem}
.avatar-picker-options button{width:54px;height:54px;border:1px solid var(--border);border-radius:50%;background:var(--bg);font-size:1.55rem;cursor:pointer}
.avatar-picker-options button.selected,.avatar-picker-options button:hover{border-color:var(--pri);background:var(--pri-l)}
.avatar-picker-actions{display:grid;grid-template-columns:1fr 1fr;gap:0.55rem}
.avatar-picker-actions .btn{width:100%}
.profile-collapse-button{width:32px;height:32px;display:grid;place-items:center;border:1px solid var(--border);border-radius:7px;background:transparent;color:var(--text2);cursor:pointer}
.profile-collapse-button:hover{background:var(--bg)}
.profile-collapse-button .ui-icon{width:16px;height:16px;transition:transform 0.18s}
.profile-collapse-button .ui-icon.open{transform:rotate(180deg)}
.scan-history-header-actions{display:flex;align-items:center;gap:0.6rem}
.scan-history-count{padding:0.18rem 0.5rem;font-size:0.68rem;white-space:nowrap}
.scan-history-view-all{display:block;width:100%;margin-top:0.25rem;padding:0.6rem;border:1px solid var(--border);border-radius:var(--r2);background:var(--surface);color:var(--pri-d);font:600 0.78rem var(--font);cursor:pointer}
.scan-history-view-all:hover{border-color:var(--pri);background:var(--pri-l)}
.logout-modal-backdrop{position:fixed;inset:0;z-index:1000;display:grid;place-items:center;padding:1rem;background:rgba(20,16,13,0.62)}
.logout-modal{width:min(100%,440px);padding:1.5rem;border:1px solid var(--border);border-radius:20px;background:var(--bg2);color:var(--text);box-shadow:var(--sh2)}
.logout-modal h2{margin-bottom:1.1rem;font-family:var(--font-d);font-size:1.3rem;text-align:center}
.logout-account{display:flex;align-items:center;gap:0.75rem;padding:0.7rem;border:1px solid var(--border);border-radius:14px}
.logout-account .topbar-avatar{width:40px;height:40px;padding:0;border:0}
.logout-account>span:last-child{display:grid;min-width:0}
.logout-account strong{font-size:0.9rem;overflow-wrap:anywhere}
.logout-account small{font-size:0.8rem;color:var(--text2);overflow-wrap:anywhere}
.logout-modal>p{margin:1rem 0;color:var(--text2);font-size:0.88rem;text-align:center}
.logout-confirm-button,.logout-cancel-button{display:block;width:min(100%,300px);min-height:40px;margin-right:auto;margin-left:auto;border-radius:999px;font:600 0.84rem var(--font);cursor:pointer}
.logout-confirm-button{border:0;background:var(--pri);color:#fff}
.logout-confirm-button:hover{background:var(--pri-d)}
.logout-cancel-button{margin-top:0.6rem;border:1px solid var(--border);background:transparent;color:var(--text)}
.logout-cancel-button:hover{background:var(--bg)}
@media(max-width:560px){.profile-hero{flex-direction:column;align-items:center;text-align:center;padding:0.85rem;gap:0.7rem}.profile-hero>div:not(.p-av){width:100%;padding-right:0;text-align:center}.profile-hero.is-editing{flex-direction:column;align-items:stretch;padding:0.7rem;gap:0.55rem}.profile-hero.is-editing>div:not(.p-av){width:100%;padding-right:0}.profile-hero.is-editing .p-av{align-self:center}.profile-avatar-wrap{width:48px;height:48px}.profile-identity-row{gap:0.4rem}.p-av{width:48px;height:48px;font-size:1.1rem}.p-name{font-size:0.94rem;overflow-wrap:anywhere}.p-email{font-size:0.68rem;overflow-wrap:anywhere}.profile-edit-icon{top:0.45rem;right:0.45rem;width:29px;height:29px}.p-badges{gap:0.35rem;margin-top:0.45rem;justify-content:center}.p-badge{padding:0.2rem 0.5rem;font-size:0.68rem}.profile-edit-fields{grid-template-columns:minmax(0,1fr);width:100%;max-width:none;gap:0.4rem}.profile-edit-fields>label{grid-column:1/-1;font-size:0.66rem;gap:0.12rem}.profile-edit-fields input:not([type=file]){min-height:32px;padding:0.3rem 0.45rem;font-size:0.76rem}.profile-avatar-options,.profile-edit-actions{grid-column:1/-1}.profile-avatar-options{gap:0.35rem}.profile-avatar-options>span{width:100%}.profile-edit-actions{display:grid;grid-template-columns:repeat(2,max-content);gap:0.4rem;margin-top:0}.profile-edit-actions .btn{width:auto;min-height:28px;padding:0.22rem 0.55rem;font-size:0.68rem}.scan-history-header-actions{gap:0.35rem}.scan-history-count{font-size:0.64rem;padding:0.16rem 0.42rem}.profile-collapse-button{width:30px;height:30px}}
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
.lp-links a{color:var(--text2);text-decoration:none;font-size:0.86rem;font-weight:700;transition:color 0.16s}
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
.lp-mobile a{padding:0.7rem 0;color:var(--text2);text-decoration:none;font-size:0.9rem;font-weight:700;border-bottom:1px solid var(--border)}
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
.lp-foot{background:var(--bg2);border-top:1px solid var(--border);padding:1.5rem 0}
.lp-foot-in{max-width:1140px;margin:0 auto;padding:0 1.5rem;display:flex;flex-direction:column;gap:1rem}
.lp-foot-top{display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:1.5rem}
.lp-foot-top>.lp-foot-brand{grid-column:1;justify-self:start}
.lp-foot-main{grid-column:2;justify-self:center}
.lp-foot-main,.lp-foot-meta{display:flex;align-items:center;flex-wrap:wrap;gap:0.75rem 1.5rem}
.lp-foot-main a{color:var(--text);font-size:0.84rem;font-weight:700;text-decoration:none;white-space:nowrap}
.lp-foot-main a:hover{color:var(--pri)}
.lp-foot-meta{justify-content:flex-start;gap:0.5rem 1rem;padding-top:0.85rem}
.lp-foot-brand{display:inline-flex;align-items:center;gap:0.55rem;font-family:var(--font);font-size:0.84rem;font-weight:400;color:var(--text2);text-decoration:none}
.lp-foot-brand .lp-logo-ic{width:28px;height:28px;border-radius:8px;font-size:0.9rem;flex-shrink:0}
.lp-foot-links{display:flex;flex-wrap:wrap;gap:0.75rem 1.25rem;font-size:0.84rem}
.lp-foot-links a{color:var(--text2);text-decoration:none}
.lp-foot-links a{font-weight:400}
.lp-foot-links a:hover{color:var(--pri)}
.lp-legal-backdrop{position:fixed;inset:0;z-index:1300;display:grid;place-items:center;padding:1.25rem;background:rgba(26,18,9,0.48)}
.lp-legal-panel{position:relative;width:min(100%,640px);max-height:min(82vh,760px);overflow-y:auto;padding:2rem;background:var(--bg2);border:1px solid var(--border);border-radius:var(--r3);box-shadow:var(--sh2)}
.lp-legal-panel .lp-h2{padding-right:2.5rem;margin-top:0.4rem}
.lp-legal-panel h3{margin:1.25rem 0 0.35rem;font-family:var(--font-d);font-size:0.95rem}
.lp-legal-panel p{color:var(--text2);font-size:0.88rem;line-height:1.7}
.lp-legal-updated{font-size:0.78rem!important;color:var(--text3)!important}
.lp-legal-close{position:absolute;top:1rem;right:1rem;width:2.25rem;height:2.25rem;display:grid;place-items:center;border:1px solid var(--border);border-radius:50%;background:var(--bg);color:var(--text);cursor:pointer}
.lp-legal-close:hover{color:var(--pri);border-color:var(--pri)}
.lp-copy{font-size:0.82rem;font-weight:400;color:var(--text3)}
@media(max-width:700px){.lp-foot-top{display:flex;flex-direction:column;align-items:center;gap:0.85rem}.lp-foot-main{justify-content:center;gap:0.65rem 1rem}}
@media(max-width:560px){.lp-foot{padding:1.25rem 0}.lp-foot-in{padding:0 1rem}.lp-foot-main,.lp-foot-meta{column-gap:1rem;row-gap:0.65rem}.lp-foot-links{gap:0.65rem 1rem}.lp-legal-panel{padding:1.5rem}}
@media(max-width:900px){.lp-links{display:none}.lp-nav-cta{display:none}.lp-burger{display:block}.lp-mobile-cta{display:flex;align-items:center;justify-content:space-between;margin-top:0.85rem;padding:0.7rem 1rem;border:0;border-radius:999px;background:var(--pri);color:#fff;font-family:var(--font);font-size:0.84rem;font-weight:700;cursor:pointer}.lp-grid{grid-template-columns:1fr}.lp-hero{padding:2.8rem 0 2rem}.lp-h1{font-size:clamp(2rem,6.3vw,2.8rem)}.lp-sec{padding:3.25rem 0}.lp-start-in{align-items:flex-start;flex-direction:column;gap:1.25rem}}
@media(max-width:560px){.lp-nav{height:64px}.lp-nav-in{width:calc(100% - 24px);height:64px;padding:0;gap:0.45rem}.lp-logo{gap:0.42rem}.lp-logo-ic{width:31px;height:31px;border-radius:9px;font-size:0.88rem}.lp-logo-t{font-size:0.94rem;letter-spacing:-0.035em}.lp-nav-r{gap:0.38rem}.lp-login{padding:0.48rem 0.45rem;font-size:0.75rem;gap:0.25rem}.lp-login-menu{min-width:175px}.lp-burger{width:31px;height:32px;padding:0;display:grid;place-items:center;flex-shrink:0;font-size:0.95rem}.lp-burger svg{width:17px;height:17px}.lp-mobile{padding:0.4rem 1rem 1rem}.lp-hero{padding:2.2rem 0 1.7rem}.lp-h1{font-size:clamp(1.9rem,8.2vw,2.35rem);max-width:430px}.lp-sub{font-size:0.84rem;line-height:1.65;margin-bottom:1rem}.lp-hero-actions{gap:0.8rem}.lp-hero-actions .btn-lg{padding:0.65rem 1.05rem;font-size:0.82rem}.lp-hero-more{font-size:0.74rem}.lp-hero-highlights{margin-top:0.95rem}.lp-hero-highlight{padding:0.25rem 0.5rem;font-size:0.66rem}.lp-hero-highlight svg{width:15px;height:15px}.lp-steps{grid-template-columns:1fr;gap:1.25rem}.lp-step{padding-top:0.8rem}.lp-step h3{margin:0.6rem 0 0.25rem}.lp-start .lp-h2{font-size:1.55rem}}
`;
