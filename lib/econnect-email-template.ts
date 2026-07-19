export type EConnectParty = "seller" | "buyer"

const PARTY_LABELS: Record<EConnectParty, string> = {
  seller: "Seller",
  buyer: "Buyer",
}

function escapeHtml(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}

function formatSubmittedAt(date: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "Asia/Kolkata",
  }).format(date)
}

function formatFieldValue(label: string, value: string) {
  const safe = escapeHtml(value)
  if (label === "Work email") {
    return `<a href="mailto:${safe}" style="color:#000000;text-decoration:underline;">${safe}</a>`
  }
  if (/^https?:\/\//i.test(value)) {
    return `<a href="${safe}" style="color:#000000;text-decoration:underline;word-break:break-all;">${safe}</a>`
  }
  return safe.replace(/\n/g, "<br />")
}

function buildFieldRows(fields: Record<string, string>) {
  return Object.entries(fields)
    .filter(([, v]) => v.trim().length > 0)
    .map(
      ([label, value]) => `
        <tr>
          <td style="padding:14px 0;border-bottom:1px solid #e5e5e5;vertical-align:top;width:38%;">
            <p style="margin:0;font-family:Helvetica,Arial,sans-serif;font-size:11px;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:#737373;">
              ${escapeHtml(label)}
            </p>
          </td>
          <td style="padding:14px 0 14px 20px;border-bottom:1px solid #e5e5e5;vertical-align:top;">
            <p style="margin:0;font-family:Helvetica,Arial,sans-serif;font-size:15px;line-height:1.65;color:#000000;">
              ${formatFieldValue(label, value)}
            </p>
          </td>
        </tr>`
    )
    .join("")
}

function emailShell({
  preheader,
  title,
  body,
}: {
  preheader: string
  title: string
  body: string
}) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(title)}</title>
</head>
<body style="margin:0;padding:0;background-color:#f5f5f5;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${escapeHtml(preheader)}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f5f5;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background-color:#ffffff;border:1px solid #e5e5e5;">
          <tr>
            <td style="padding:32px 40px 24px;border-bottom:1px solid #000000;">
              <p style="margin:0 0 8px;font-family:Helvetica,Arial,sans-serif;font-size:11px;letter-spacing:0.34em;text-transform:uppercase;color:#737373;">
                VVR Industries — eConnect
              </p>
              <h1 style="margin:0;font-family:Helvetica,Arial,sans-serif;font-size:22px;font-weight:500;line-height:1.3;letter-spacing:-0.02em;color:#000000;">
                ${escapeHtml(title)}
              </h1>
            </td>
          </tr>
          <tr>
            <td style="padding:32px 40px;">
              ${body}
            </td>
          </tr>
          <tr>
            <td style="padding:24px 40px 32px;border-top:1px solid #e5e5e5;background-color:#fafafa;">
              <p style="margin:0;font-family:Helvetica,Arial,sans-serif;font-size:12px;line-height:1.6;color:#737373;">
                This enquiry was submitted via the eConnect platform form on the VVR website.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

export function buildEConnectEnquiryEmail({
  party,
  fields,
  submittedAt,
}: {
  party: EConnectParty
  fields: Record<string, string>
  submittedAt: Date
}) {
  const partyLabel = PARTY_LABELS[party]
  const contactName = fields["Contact name"]?.trim() ?? "Unknown"
  const submitted = formatSubmittedAt(submittedAt)
  const subject = `[VVR eConnect] ${partyLabel} enquiry — ${contactName}`

  const html = emailShell({
    preheader: `New ${partyLabel.toLowerCase()} enquiry from ${contactName}`,
    title: "New eConnect platform enquiry",
    body: `
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
        <tr>
          <td>
            <span style="display:inline-block;padding:6px 12px;border:1px solid #000000;font-family:Helvetica,Arial,sans-serif;font-size:11px;font-weight:600;letter-spacing:0.14em;text-transform:uppercase;color:#000000;">
              ${escapeHtml(partyLabel)}
            </span>
          </td>
        </tr>
      </table>
      <p style="margin:0 0 24px;font-family:Helvetica,Arial,sans-serif;font-size:15px;line-height:1.7;color:#404040;">
        A new ${partyLabel.toLowerCase()} enquiry has been submitted through the eConnect platform form.
      </p>
      <p style="margin:0 0 28px;font-family:Helvetica,Arial,sans-serif;font-size:13px;color:#737373;">
        Submitted ${escapeHtml(submitted)}
      </p>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        ${buildFieldRows(fields)}
      </table>
      <p style="margin:28px 0 0;font-family:Helvetica,Arial,sans-serif;font-size:13px;line-height:1.6;color:#737373;">
        Reply directly to this email to contact the enquirer.
      </p>`,
  })

  const text = [
    "New eConnect platform enquiry",
    `Type: ${partyLabel}`,
    `Submitted: ${submitted}`,
    "",
    ...Object.entries(fields)
      .filter(([, v]) => v.trim())
      .map(([label, value]) => `${label}: ${value}`),
    "",
    "Reply to this email to contact the enquirer.",
  ].join("\n")

  return { subject, html, text }
}
