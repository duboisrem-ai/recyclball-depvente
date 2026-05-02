import { useState, useEffect } from "react";

// ─── Supabase config ──────────────────────────────────────────────────────────
const SUPABASE_URL = "https://lzmocntquhfvlagrsojn.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx6bW9jbnRxdWhmdmxhZ3Jzb2puIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc2NzEyODUsImV4cCI6MjA5MzI0NzI4NX0.fNgze2MMO7uC6qNYdovqaoAK5jAWNldOmcLYYF8bW5E";

const sb = async (path, options = {}) => {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    headers: {
      "apikey": SUPABASE_KEY,
      "Authorization": `Bearer ${SUPABASE_KEY}`,
      "Content-Type": "application/json",
      "Prefer": options.prefer || "return=representation",
      ...options.headers,
    },
    ...options,
  });
  if (!res.ok) throw new Error(await res.text());
  const text = await res.text();
  return text ? JSON.parse(text) : null;
};

// ─── Constants ────────────────────────────────────────────────────────────────
const PRODUCTS = [
  { ref: "REC0001", name: "Porte-clés", price: 5 },
  { ref: "REC0002", name: "Porte CB", price: 14 },
  { ref: "REC0003", name: "Petit Porte-monnaie", price: 10 },
  { ref: "REC0004", name: "Grand Porte-monnaie", price: 15 },
  { ref: "REC0005", name: "Bracelet XS", price: 10 },
  { ref: "REC0006", name: "Bracelet S", price: 10 },
  { ref: "REC0007", name: "Bracelet M", price: 10 },
  { ref: "REC0008", name: "Bracelet L", price: 10 },
  { ref: "REC0009", name: "Bracelet XL", price: 10 },
  { ref: "REC0010", name: "Laisse animaux", price: 24 },
  { ref: "REC0011", name: "Collier animaux", price: 18 },
  { ref: "REC0012", name: "Montre Femme", price: 60 },
  { ref: "REC0013", name: "Montre Homme", price: 60 },
  { ref: "REC0014", name: "Meuble présentoir", price: null },
];

const CLUB_SHARE = 0.25;
const RECYCLBALL_SHARE = 0.75;
const TVA = 0.20;
const MONTH = "Avril 2026";
const DEADLINE = "07 Mai 2026";
const ADMIN_PASSWORD = "Recyclball2026!";

const fmt = (n) => n.toLocaleString("fr-FR", { style: "currency", currency: "EUR" });

// ─── Styles ───────────────────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --green: #2D6A4F; --green-light: #52B788; --green-pale: #D8F3DC; --green-mid: #74C69D;
    --amber: #F4A261; --amber-pale: #FFF3E0; --red: #E63946; --red-pale: #FDECEA;
    --bg: #F7F9F5; --card: #FFFFFF; --text: #1B2D24; --muted: #7A9188; --border: #DDE8E2;
    --shadow: 0 2px 16px rgba(45,106,79,0.08);
  }
  body { font-family: 'DM Sans', sans-serif; background: var(--bg); color: var(--text); min-height: 100vh; }

  .header { background: var(--green); padding: 0 32px; display: flex; align-items: center; justify-content: space-between; height: 64px; position: sticky; top: 0; z-index: 100; box-shadow: 0 2px 12px rgba(0,0,0,0.15); }
  .header-logo { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 20px; color: white; letter-spacing: -0.5px; }
  .header-logo span { color: var(--green-mid); }
  .header-right { display: flex; align-items: center; gap: 10px; }
  .header-badge { background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.2); color: white; font-size: 12px; font-weight: 500; padding: 4px 12px; border-radius: 20px; }
  .admin-link { background: transparent; border: none; color: rgba(255,255,255,0.2); font-size: 13px; cursor: pointer; padding: 4px 6px; border-radius: 4px; transition: color .2s; line-height: 1; }
  .admin-link:hover { color: rgba(255,255,255,0.55); }
  .admin-chip { background: rgba(255,255,255,0.18); border: 1px solid rgba(255,255,255,0.3); color: white; font-size: 11px; font-weight: 600; padding: 3px 10px; border-radius: 20px; }
  .admin-logout { background: rgba(255,255,255,0.12); border: 1px solid rgba(255,255,255,0.25); color: white; font-size: 12px; padding: 6px 12px; border-radius: 8px; cursor: pointer; font-family: 'DM Sans', sans-serif; font-weight: 500; transition: all .2s; }
  .admin-logout:hover { background: rgba(255,255,255,0.22); }

  .container { max-width: 900px; margin: 0 auto; padding: 40px 24px; }
  .container-wide { max-width: 1100px; margin: 0 auto; padding: 40px 24px; }
  .page-title { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 28px; color: var(--green); margin-bottom: 4px; }
  .page-sub { color: var(--muted); font-size: 14px; margin-bottom: 32px; }

  .card { background: var(--card); border: 1px solid var(--border); border-radius: 16px; padding: 28px; box-shadow: var(--shadow); margin-bottom: 20px; }
  .card-title { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 16px; color: var(--green); margin-bottom: 16px; display: flex; align-items: center; gap: 8px; }

  .deadline-banner { background: linear-gradient(135deg, var(--amber) 0%, #E76F51 100%); border-radius: 12px; padding: 16px 24px; display: flex; align-items: center; gap: 16px; margin-bottom: 28px; color: white; }
  .deadline-icon { font-size: 28px; }
  .deadline-title { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 15px; }
  .deadline-sub { font-size: 13px; opacity: .85; }

  label { display: block; font-size: 13px; font-weight: 500; color: var(--muted); margin-bottom: 6px; text-transform: uppercase; letter-spacing: .5px; }
  input[type="text"], input[type="number"], input[type="password"] { width: 100%; padding: 11px 14px; border: 1.5px solid var(--border); border-radius: 10px; font-family: 'DM Sans', sans-serif; font-size: 15px; color: var(--text); background: white; outline: none; transition: border-color .2s; }
  input:focus { border-color: var(--green-light); }
  .input-error { border-color: var(--red) !important; }
  .error-msg { color: var(--red); font-size: 13px; margin-top: 6px; }

  .products-table { width: 100%; border-collapse: collapse; }
  .products-table th { text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: .7px; color: var(--muted); font-weight: 600; padding: 0 12px 10px; }
  .products-table th:last-child, .products-table td:last-child { text-align: right; }
  .products-table th:nth-child(3), .products-table td:nth-child(3) { text-align: center; }
  .prod-row { border-top: 1px solid var(--border); transition: background .15s; }
  .prod-row:hover { background: #F0FAF4; }
  .prod-row td { padding: 10px 12px; font-size: 14px; }
  .prod-ref { color: var(--muted); font-size: 12px; font-family: monospace; }
  .prod-name { font-weight: 500; }
  .prod-price { color: var(--green); font-weight: 600; }
  .prod-na { color: var(--muted); font-size: 12px; }
  .qty-input { width: 72px; text-align: center; padding: 7px 8px; border: 1.5px solid var(--border); border-radius: 8px; font-size: 15px; font-weight: 600; color: var(--text); background: white; outline: none; transition: border-color .2s; }
  .qty-input:focus { border-color: var(--green-light); }
  .qty-input:disabled { background: #F5F5F5; color: var(--muted); }
  .row-total { font-weight: 600; color: var(--text); }
  .row-total.active { color: var(--green); }

  .totals-block { background: linear-gradient(135deg, #F0FAF4, #E8F5E9); border: 1.5px solid var(--green-pale); border-radius: 14px; padding: 24px 28px; }
  .totals-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; margin-bottom: 20px; }
  .total-item { text-align: center; }
  .total-label { font-size: 11px; text-transform: uppercase; letter-spacing: .6px; color: var(--muted); margin-bottom: 4px; }
  .total-value { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 26px; color: var(--green); }
  .total-value.amber { color: var(--amber); }
  .total-value.dark { color: var(--text); }
  .divider-h { border: none; border-top: 1px solid var(--border); margin: 16px 0; }
  .invoice-line { display: flex; justify-content: space-between; align-items: center; font-size: 14px; padding: 5px 0; }
  .invoice-line.total-line { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 16px; color: var(--green); border-top: 2px solid var(--green-pale); padding-top: 12px; margin-top: 4px; }

  .btn { display: inline-flex; align-items: center; gap: 8px; padding: 13px 28px; border-radius: 12px; font-family: 'DM Sans', sans-serif; font-size: 15px; font-weight: 600; cursor: pointer; border: none; transition: all .2s; }
  .btn-primary { background: var(--green); color: white; box-shadow: 0 4px 14px rgba(45,106,79,0.3); }
  .btn-primary:hover:not(:disabled) { background: #245C42; transform: translateY(-1px); }
  .btn-primary:disabled { background: var(--muted); box-shadow: none; cursor: not-allowed; }
  .btn-outline { background: white; color: var(--green); border: 1.5px solid var(--green); }
  .btn-outline:hover { background: var(--green-pale); }
  .submit-row { display: flex; justify-content: flex-end; gap: 12px; margin-top: 28px; }

  .success-screen { text-align: center; padding: 60px 20px; }
  .success-icon { font-size: 64px; margin-bottom: 20px; }
  .success-title { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 28px; color: var(--green); margin-bottom: 8px; }
  .success-sub { color: var(--muted); font-size: 15px; max-width: 400px; margin: 0 auto 32px; }

  .login-wrap { min-height: calc(100vh - 64px); display: flex; align-items: center; justify-content: center; }
  .login-card { background: white; border: 1px solid var(--border); border-radius: 20px; padding: 48px 40px; width: 100%; max-width: 400px; box-shadow: 0 8px 40px rgba(45,106,79,0.12); text-align: center; }
  .lock-icon { font-size: 40px; margin-bottom: 16px; }
  .login-title { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 20px; color: var(--green); margin-bottom: 4px; }
  .login-sub { color: var(--muted); font-size: 13px; margin-bottom: 28px; }

  .stats-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 28px; }
  .stat-card { background: white; border: 1px solid var(--border); border-radius: 14px; padding: 20px 24px; box-shadow: var(--shadow); }
  .stat-num { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 36px; }
  .stat-num.green { color: var(--green); } .stat-num.amber { color: var(--amber); } .stat-num.red { color: var(--red); }
  .stat-label { font-size: 13px; color: var(--muted); margin-top: 2px; }
  .progress-bar-wrap { background: var(--border); border-radius: 99px; height: 8px; margin: 12px 0 0; overflow: hidden; }
  .progress-bar-fill { height: 100%; border-radius: 99px; background: linear-gradient(90deg, var(--green-light), var(--green)); transition: width .6s ease; }

  .clubs-table { width: 100%; border-collapse: collapse; }
  .clubs-table th { text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: .6px; color: var(--muted); font-weight: 600; padding: 0 16px 12px; border-bottom: 2px solid var(--border); }
  .clubs-table td { padding: 14px 16px; font-size: 14px; border-bottom: 1px solid var(--border); }
  .clubs-table tr:last-child td { border-bottom: none; }
  .clubs-table tr:hover td { background: #F7FBF8; }
  .badge { display: inline-flex; align-items: center; gap: 5px; padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: 600; }
  .badge-done { background: var(--green-pale); color: var(--green); }
  .badge-pending { background: var(--red-pale); color: var(--red); }
  .badge-dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; flex-shrink: 0; }
  .filter-row { display: flex; gap: 8px; }
  .filter-btn { padding: 7px 16px; border-radius: 8px; border: 1.5px solid var(--border); background: white; font-size: 13px; font-weight: 500; color: var(--muted); cursor: pointer; transition: all .2s; }
  .filter-btn.active { border-color: var(--green); background: var(--green-pale); color: var(--green); }
  .reminder-btn { background: var(--amber-pale); color: #B5451B; border: 1px solid #F4A261; border-radius: 8px; padding: 5px 12px; font-size: 12px; font-weight: 600; cursor: pointer; }
  .reminder-btn:hover { background: #FFE4CC; }

  .loading { text-align: center; padding: 60px; color: var(--muted); font-size: 15px; }
  .spinner { display: inline-block; width: 32px; height: 32px; border: 3px solid var(--border); border-top-color: var(--green); border-radius: 50%; animation: spin .8s linear infinite; margin-bottom: 12px; }
  @keyframes spin { to { transform: rotate(360deg); } }

  .notify { position: fixed; bottom: 24px; right: 24px; background: var(--green); color: white; padding: 14px 20px; border-radius: 12px; font-size: 14px; font-weight: 500; box-shadow: 0 4px 20px rgba(0,0,0,0.2); animation: slideUp .3s ease; z-index: 999; }
  .notify.error { background: var(--red); }
  @keyframes slideUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

  @media (max-width: 640px) {
    .stats-row, .totals-grid { grid-template-columns: 1fr; }
    .header { padding: 0 16px; }
  }
`;

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [pwInput, setPwInput] = useState("");
  const [pwError, setPwError] = useState(false);

  const [step, setStep] = useState("form");
  const [clubName, setClubName] = useState("");
  const [clubEmail, setClubEmail] = useState("");
  const [invoiceNum, setInvoiceNum] = useState("");
  const [qtys, setQtys] = useState(() => Object.fromEntries(PRODUCTS.map(p => [p.ref, 0])));
  const [submitting, setSubmitting] = useState(false);

  const [submissions, setSubmissions] = useState([]);
  const [loadingAdmin, setLoadingAdmin] = useState(false);
  const [filter, setFilter] = useState("all");
  const [notify, setNotify] = useState(null);

  const caClub = PRODUCTS.reduce((acc, p) => p.price ? acc + (qtys[p.ref] || 0) * p.price : acc, 0);
  const toRecyclball = caClub * RECYCLBALL_SHARE;
  const toRecyclballHT = toRecyclball / (1 + TVA);
  const tva = toRecyclball - toRecyclballHT;
  const clubKeeps = caClub * CLUB_SHARE;

  const showNotif = (msg, error = false) => {
    setNotify({ msg, error });
    setTimeout(() => setNotify(null), 3500);
  };

  // Load submissions from Supabase
  const loadSubmissions = async () => {
    setLoadingAdmin(true);
    try {
      const data = await sb("declarations?select=*&order=submitted_at.desc");
      setSubmissions(data || []);
    } catch (e) {
      showNotif("Erreur de chargement", true);
    } finally {
      setLoadingAdmin(false);
    }
  };

  useEffect(() => {
    if (isAdmin) loadSubmissions();
  }, [isAdmin]);

  const handleLogin = () => {
    if (pwInput === ADMIN_PASSWORD) {
      setIsAdmin(true); setShowLogin(false); setPwInput(""); setPwError(false);
    } else { setPwError(true); setPwInput(""); }
  };

  const handleSubmit = async () => {
    if (!clubName.trim() || !invoiceNum.trim() || caClub === 0) return;
    setSubmitting(true);
    try {
      // 1. Sauvegarde dans Supabase
      await sb("declarations", {
        method: "POST",
        prefer: "return=minimal",
        body: JSON.stringify({
          club_name: clubName.trim(),
          invoice_num: invoiceNum.trim(),
          total_ttc: caClub,
          to_recyclball: toRecyclball,
          quantities: qtys,
          submitted_at: new Date().toISOString(),
        }),
      });

      // 2. Envoi de la facture par email
      await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clubName: clubName.trim(),
          clubEmail: clubEmail.trim(),
          invoiceNum: invoiceNum.trim(),
          totalTTC: caClub,
          toRecyclball,
          clubKeeps,
          toRecyclballHT,
          tva,
          quantities: qtys,
          products: PRODUCTS,
          month: MONTH,
        }),
      });

      setStep("success");
    } catch (e) {
      showNotif("Erreur lors de l'envoi. Réessaie.", true);
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setStep("form"); setClubName(""); setClubEmail(""); setInvoiceNum("");
    setQtys(Object.fromEntries(PRODUCTS.map(p => [p.ref, 0])));
  };

  const totalCA = submissions.reduce((a, s) => a + s.total_ttc, 0);
  const totalRecyclball = submissions.reduce((a, s) => a + s.to_recyclball, 0);

  const filteredClubs = filter === "done"
    ? submissions
    : filter === "pending"
    ? [] // en prod, on aurait la liste complète des clubs
    : submissions;

  // ── Login page ──
  if (showLogin) return (
    <>
      <style>{css}</style>
      <header className="header">
        <div className="header-logo">Recycl<span>ball</span></div>
        <div className="header-right"><div className="header-badge">{MONTH}</div></div>
      </header>
      <div className="login-wrap">
        <div className="login-card">
          <div className="lock-icon">🔐</div>
          <div className="login-title">Accès administrateur</div>
          <div className="login-sub">Réservé à l'équipe Recyclball</div>
          <div style={{ textAlign: "left", marginBottom: 20 }}>
            <label>Mot de passe</label>
            <input type="password" className={pwError ? "input-error" : ""} value={pwInput}
              onChange={e => { setPwInput(e.target.value); setPwError(false); }}
              onKeyDown={e => e.key === "Enter" && handleLogin()}
              placeholder="••••••••••••" autoFocus />
            {pwError && <div className="error-msg">❌ Mot de passe incorrect</div>}
          </div>
          <button className="btn btn-primary" style={{ width: "100%", justifyContent: "center" }} onClick={handleLogin}>
            Accéder au tableau de bord
          </button>
          <button onClick={() => { setShowLogin(false); setPwError(false); setPwInput(""); }}
            style={{ marginTop: 16, background: "none", border: "none", color: "var(--muted)", fontSize: 13, cursor: "pointer" }}>
            ← Retour au formulaire
          </button>
        </div>
      </div>
    </>
  );

  // ── Admin dashboard ──
  if (isAdmin) return (
    <>
      <style>{css}</style>
      {notify && <div className={`notify ${notify.error ? "error" : ""}`}>{notify.msg}</div>}
      <header className="header">
        <div className="header-logo">Recycl<span>ball</span></div>
        <div className="header-right">
          <span className="admin-chip">🔐 Admin</span>
          <button className="admin-logout" onClick={() => { setIsAdmin(false); setSubmissions([]); }}>Déconnexion</button>
        </div>
      </header>
      <div className="container-wide">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
          <div>
            <p className="page-title">Tableau de bord</p>
            <p className="page-sub">Suivi des remontées — {MONTH} · Deadline : {DEADLINE}</p>
          </div>
          <button className="btn btn-outline" style={{ marginTop: 8 }} onClick={loadSubmissions}>🔄 Actualiser</button>
        </div>

        {loadingAdmin ? (
          <div className="loading"><div className="spinner"></div><br/>Chargement...</div>
        ) : (
          <>
            <div className="stats-row">
              <div className="stat-card">
                <div className="stat-num green">{submissions.length}</div>
                <div className="stat-label">Déclarations reçues</div>
                <div className="progress-bar-wrap">
                  <div className="progress-bar-fill" style={{ width: `${Math.min(submissions.length / 10 * 100, 100)}%` }} />
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-num amber" style={{ fontSize: submissions.length ? 26 : 36 }}>{fmt(totalCA)}</div>
                <div className="stat-label">CA total TTC déclaré</div>
              </div>
              <div className="stat-card">
                <div className="stat-num green" style={{ fontSize: submissions.length ? 26 : 36 }}>{fmt(totalRecyclball)}</div>
                <div className="stat-label">Total dû à Recyclball</div>
              </div>
            </div>

            <div className="card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <div className="card-title" style={{ marginBottom: 0 }}>📋 Déclarations reçues</div>
                <div className="filter-row">
                  {["all", "done"].map(f => (
                    <button key={f} className={`filter-btn ${filter === f ? "active" : ""}`} onClick={() => setFilter(f)}>
                      {f === "all" ? `Toutes (${submissions.length})` : "✅ Déclarés"}
                    </button>
                  ))}
                </div>
              </div>

              {submissions.length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px 0", color: "var(--muted)" }}>
                  Aucune déclaration reçue pour le moment.
                </div>
              ) : (
                <table className="clubs-table">
                  <thead><tr>
                    <th>Club</th><th>Statut</th><th>Date</th><th>CA TTC</th><th>Dû à Recyclball</th><th>N° Facture</th>
                  </tr></thead>
                  <tbody>
                    {filteredClubs.map((row, i) => (
                      <tr key={i}>
                        <td style={{ fontWeight: 600 }}>{row.club_name}</td>
                        <td><span className="badge badge-done"><span className="badge-dot" />Déclaré</span></td>
                        <td style={{ color: "var(--muted)" }}>
                          {new Date(row.submitted_at).toLocaleDateString("fr-FR")}
                        </td>
                        <td style={{ fontWeight: 600 }}>{fmt(row.total_ttc)}</td>
                        <td style={{ fontWeight: 600, color: "var(--green)" }}>{fmt(row.to_recyclball)}</td>
                        <td style={{ fontFamily: "monospace", color: "var(--muted)", fontSize: 13 }}>{row.invoice_num}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {submissions.length > 0 && (
                <>
                  <hr className="divider-h" />
                  <div style={{ display: "flex", justifyContent: "flex-end", gap: 24, fontSize: 14, color: "var(--muted)" }}>
                    <span>CA total : <strong style={{ color: "var(--text)" }}>{fmt(totalCA)}</strong></span>
                    <span>Total dû à Recyclball : <strong style={{ color: "var(--green)" }}>{fmt(totalRecyclball)}</strong></span>
                  </div>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );

  // ── Club form (vue clubs) ──
  return (
    <>
      <style>{css}</style>
      {notify && <div className={`notify ${notify.error ? "error" : ""}`}>{notify.msg}</div>}
      <header className="header">
        <div className="header-logo">Recycl<span>ball</span></div>
        <div className="header-right">
          <div className="header-badge">{MONTH}</div>
          <button className="admin-link" onClick={() => setShowLogin(true)} title="Administrateur">⚙</button>
        </div>
      </header>

      {step === "form" && (
        <div className="container">
          <div className="deadline-banner">
            <div className="deadline-icon">⏰</div>
            <div>
              <div className="deadline-title">Remontée des ventes — {MONTH}</div>
              <div className="deadline-sub">À renvoyer avant le {DEADLINE} · Merci pour votre rigueur !</div>
            </div>
          </div>

          <p className="page-title">Déclaration des ventes</p>
          <p className="page-sub">Renseignez vos quantités vendues pour générer automatiquement votre facture Recyclball.</p>

          <div className="card">
            <div className="card-title">🏟️ Informations du club</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
              <div>
                <label>Nom du club</label>
                <input type="text" value={clubName} onChange={e => setClubName(e.target.value)} placeholder="Ex : AS Marcq Rugby" />
              </div>
              <div>
                <label>N° de facture</label>
                <input type="text" value={invoiceNum} onChange={e => setInvoiceNum(e.target.value)} placeholder="Ex : 14-05" />
              </div>
            </div>
            <div>
              <label>Email du club <span style={{color:"var(--muted)",fontWeight:400,textTransform:"none",letterSpacing:0}}>(pour recevoir la facture)</span></label>
              <input type="text" value={clubEmail} onChange={e => setClubEmail(e.target.value)} placeholder="Ex : contact@monclub.fr" />
            </div>
          </div>

          <div className="card">
            <div className="card-title">📦 Ventes du mois</div>
            <table className="products-table">
              <thead><tr>
                <th>Réf.</th><th>Produit</th><th>Qté vendue</th><th>PV TTC unit.</th><th>Total TTC</th>
              </tr></thead>
              <tbody>
                {PRODUCTS.map(p => {
                  const qty = qtys[p.ref] || 0;
                  const rowTotal = p.price ? qty * p.price : null;
                  return (
                    <tr key={p.ref} className="prod-row">
                      <td><span className="prod-ref">{p.ref}</span></td>
                      <td><span className="prod-name">{p.name}</span></td>
                      <td style={{ textAlign: "center" }}>
                        <input className="qty-input" type="number" min="0" disabled={!p.price}
                          value={p.price ? qty : ""}
                          onChange={e => setQtys(prev => ({ ...prev, [p.ref]: Math.max(0, parseInt(e.target.value) || 0) }))} />
                      </td>
                      <td className="prod-price">{p.price ? fmt(p.price) : <span className="prod-na">—</span>}</td>
                      <td className={`row-total ${rowTotal ? "active" : ""}`}>
                        {rowTotal !== null ? fmt(rowTotal) : <span className="prod-na">—</span>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="totals-block">
            <div className="totals-grid">
              <div className="total-item">
                <div className="total-label">CA total TTC club</div>
                <div className="total-value dark">{fmt(caClub)}</div>
              </div>
              <div className="total-item">
                <div className="total-label">Vous conservez (25%)</div>
                <div className="total-value amber">{fmt(clubKeeps)}</div>
              </div>
              <div className="total-item">
                <div className="total-label">Dû à Recyclball (75%)</div>
                <div className="total-value">{fmt(toRecyclball)}</div>
              </div>
            </div>
            <hr className="divider-h" />
            <div style={{ maxWidth: 360 }}>
              <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 700, fontSize: 13, textTransform: "uppercase", letterSpacing: ".6px", color: "var(--green)", marginBottom: 10 }}>
                Détail facture Recyclball
              </div>
              <div className="invoice-line"><span>Montant HT</span><span>{fmt(toRecyclballHT)}</span></div>
              <div className="invoice-line"><span>TVA 20%</span><span>{fmt(tva)}</span></div>
              <div className="invoice-line total-line"><span>Total TTC à payer</span><span>{fmt(toRecyclball)}</span></div>
              <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 8 }}>
                Virement : IBAN FR76 1820 6003 6665 0481 7117 056 — BIC AGRIFRPP882
              </div>
            </div>
          </div>

          <div className="submit-row">
            <button className="btn btn-outline" onClick={() => setQtys(Object.fromEntries(PRODUCTS.map(p => [p.ref, 0])))}>
              Réinitialiser
            </button>
            <button className="btn btn-primary" onClick={handleSubmit}
              disabled={!clubName.trim() || !invoiceNum.trim() || caClub === 0 || submitting}>
              {submitting ? "Envoi en cours..." : "✅ Valider et envoyer"}
            </button>
          </div>
        </div>
      )}

      {step === "success" && (
        <div className="container">
          <div className="card">
            <div className="success-screen">
              <div className="success-icon">🎉</div>
              <div className="success-title">Déclaration envoyée !</div>
              <div className="success-sub">
                Merci <strong>{clubName}</strong> ! Votre remontée de ventes pour {MONTH} a bien été transmise à Recyclball.
              </div>
              <div className="totals-block" style={{ textAlign: "left", maxWidth: 380, margin: "0 auto 28px" }}>
                <div className="invoice-line"><span>CA total TTC réalisé</span><span><strong>{fmt(caClub)}</strong></span></div>
                <div className="invoice-line"><span>Vous conservez (25%)</span><span style={{ color: "var(--amber)", fontWeight: 600 }}>{fmt(clubKeeps)}</span></div>
                <div className="invoice-line total-line"><span>À payer à Recyclball</span><span>{fmt(toRecyclball)}</span></div>
                <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 8 }}>IBAN FR76 1820 6003 6665 0481 7117 056</div>
              </div>
              <button className="btn btn-outline" onClick={resetForm}>Nouvelle déclaration</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
