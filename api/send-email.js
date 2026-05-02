const RESEND_API_KEY = "re_57W2RxS5_Cmw1th8hDo8yRHfSnEj23oTX";
const FROM = "Recyclball <contact@recyclball.fr>";
const ADMIN_EMAIL = "contact@recyclball.fr";

const fmt = (n) => n.toLocaleString("fr-FR", { style: "currency", currency: "EUR" });

function generateInvoiceHTML(data) {
  const { clubName, clubEmail, invoiceNum, totalTTC, toRecyclball, clubKeeps, toRecyclballHT, tva, quantities, products, month } = data;

  const rows = products
    .filter(p => p.price && quantities[p.ref] > 0)
    .map(p => `
      <tr>
        <td style="padding:10px 12px;border-bottom:1px solid #DDE8E2;font-size:14px;">${p.ref}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #DDE8E2;font-size:14px;font-weight:500;">${p.name}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #DDE8E2;font-size:14px;text-align:center;">${quantities[p.ref]}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #DDE8E2;font-size:14px;text-align:right;">${fmt(p.price)}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #DDE8E2;font-size:14px;font-weight:600;color:#2D6A4F;text-align:right;">${fmt(quantities[p.ref] * p.price)}</td>
      </tr>
    `).join("");

  return `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>Facture Recyclball — ${month}</title></head>
<body style="margin:0;padding:0;background:#F7F9F5;font-family:'Helvetica Neue',Arial,sans-serif;">
<div style="max-width:680px;margin:40px auto;background:white;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
  <div style="background:#2D6A4F;padding:32px 40px;">
    <div style="font-size:24px;font-weight:800;color:white;">Recyclball</div>
    <div style="color:rgba(255,255,255,0.7);font-size:13px;margin-top:4px;">20 allée des Pivoines, 59700 Marcq-en-Barœul</div>
    <div style="color:rgba(255,255,255,0.7);font-size:13px;">SIRET : 10222347600015</div>
    <div style="color:rgba(255,255,255,0.85);font-size:13px;margin-top:8px;">Facture N° ${invoiceNum} — ${new Date().toLocaleDateString("fr-FR")}</div>
  </div>
  <div style="padding:28px 40px;border-bottom:1px solid #DDE8E2;background:#F7F9F5;">
    <div style="font-size:18px;font-weight:700;color:#1B2D24;">${clubName}</div>
    ${clubEmail ? `<div style="font-size:14px;color:#7A9188;">${clubEmail}</div>` : ""}
    <div style="font-size:13px;color:#7A9188;margin-top:8px;">Période : <strong style="color:#1B2D24;">${month}</strong></div>
  </div>
  <div style="padding:28px 40px;">
    <table style="width:100%;border-collapse:collapse;">
      <thead><tr style="background:#F7F9F5;">
        <th style="padding:10px 12px;text-align:left;font-size:11px;color:#7A9188;">Réf.</th>
        <th style="padding:10px 12px;text-align:left;font-size:11px;color:#7A9188;">Produit</th>
        <th style="padding:10px 12px;text-align:center;font-size:11px;color:#7A9188;">Qté</th>
        <th style="padding:10px 12px;text-align:right;font-size:11px;color:#7A9188;">PV TTC</th>
        <th style="padding:10px 12px;text-align:right;font-size:11px;color:#7A9188;">Total TTC</th>
      </tr></thead>
      <tbody>${rows}</tbody>
    </table>
  </div>
  <div style="margin:0 40px 28px;background:#F0FAF4;border:1.5px solid #D8F3DC;border-radius:14px;padding:24px;">
    <div style="display:flex;justify-content:space-between;margin-bottom:10px;">
      <span style="font-size:14px;color:#7A9188;">CA total TTC réalisé</span>
      <span style="font-size:14px;font-weight:600;">${fmt(totalTTC)}</span>
    </div>
    <div style="display:flex;justify-content:space-between;margin-bottom:10px;">
      <span style="font-size:14px;color:#7A9188;">Part conservée par le club (25%)</span>
      <span style="font-size:14px;font-weight:600;color:#F4A261;">${fmt(clubKeeps)}</span>
    </div>
    <div style="border-top:1px solid #D8F3DC;margin:12px 0;"></div>
    <div style="display:flex;justify-content:space-between;margin-bottom:6px;">
      <span style="font-size:14px;color:#7A9188;">Montant HT</span>
      <span style="font-size:14px;">${fmt(toRecyclballHT)}</span>
    </div>
    <div style="display:flex;justify-content:space-between;margin-bottom:12px;">
      <span style="font-size:14px;color:#7A9188;">TVA 20%</span>
      <span style="font-size:14px;">${fmt(tva)}</span>
    </div>
    <div style="display:flex;justify-content:space-between;background:white;padding:14px 16px;border-radius:10px;">
      <span style="font-size:16px;font-weight:700;color:#2D6A4F;">Total TTC à payer</span>
      <span style="font-size:16px;font-weight:800;color:#2D6A4F;">${fmt(toRecyclball)}</span>
    </div>
  </div>
  <div style="margin:0 40px 40px;padding:20px;background:#F7F9F5;border-radius:12px;border:1px solid #DDE8E2;">
    <div style="font-size:13px;font-weight:600;color:#2D6A4F;margin-bottom:8px;">Coordonnées bancaires</div>
    <div style="font-size:13px;color:#7A9188;">Titulaire : <strong style="color:#1B2D24;">S.A.R.L. RECYCLBALL</strong></div>
    <div style="font-size:13px;color:#7A9188;">IBAN : <strong style="color:#1B2D24;">FR76 1670 6050 6654 0169 6828 821</strong></div>
    <div style="font-size:13px;color:#7A9188;">BIC : <strong style="color:#1B2D24;">AGRIFRPP867</strong> — Crédit Agricole Nord de France</div>
    <div style="font-size:12px;color:#F4A261;margin-top:8px;font-weight:600;">Échéance de paiement : 5 jours</div>
  </div>
  <div style="background:#2D6A4F;padding:20px 40px;text-align:center;">
    <div style="color:rgba(255,255,255,0.7);font-size:12px;">Merci pour votre confiance 🏉 — www.recyclball.fr</div>
  </div>
</div>
</body>
</html>`;
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const { clubName, clubEmail, invoiceNum, totalTTC, toRecyclball, clubKeeps, toRecyclballHT, tva, quantities, products, month } = req.body;
  const html = generateInvoiceHTML({ clubName, clubEmail, invoiceNum, totalTTC, toRecyclball, clubKeeps, toRecyclballHT, tva, quantities, products, month });
  const subject = `Facture dépôt-vente ${month} — ${clubName}`;
  try {
    if (clubEmail) {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { "Authorization": `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({ from: FROM, to: [clubEmail], subject, html }),
      });
    }
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Authorization": `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: FROM, to: [ADMIN_EMAIL], subject: `[Admin] ${subject}`, html }),
    });
    res.status(200).json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
