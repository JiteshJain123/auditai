import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendAuditConfirmationEmail({
  to,
  auditId,
  monthlySavings,
  isHighSavings,
}: {
  to: string;
  auditId: string;
  monthlySavings: number;
  isHighSavings: boolean;
}) {
  const shareUrl = `${process.env.NEXT_PUBLIC_APP_URL}/audit/${auditId}`;

  await resend.emails.send({
    from: "AuditAI <hello@auditai.app>",
    to,
    subject: `Your AI Spend Audit — $${monthlySavings}/mo in potential savings`,
    html: buildEmailHtml({ shareUrl, monthlySavings, isHighSavings }),
  });
}

function buildEmailHtml({
  shareUrl,
  monthlySavings,
  isHighSavings,
}: {
  shareUrl: string;
  monthlySavings: number;
  isHighSavings: boolean;
}) {
  return `
    <h2>Your AI Spend Audit is ready</h2>
    <p>We found <strong>$${monthlySavings}/month</strong> in potential savings for your team.</p>
    <p><a href="${shareUrl}">View your full audit report</a></p>
    ${
      isHighSavings
        ? `<p><strong>Your savings are significant.</strong> The Credex team will reach out to show you how to capture more of that savings through discounted AI credits.</p>`
        : ""
    }
    <p style="color:#666;font-size:12px;">AuditAI — Free AI spend audits for startups</p>
  `;
}
