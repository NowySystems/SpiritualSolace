type ChurchWorkEmailResult = {
  sent: boolean;
  reason?: string;
};

type ChurchWorkEmailInput = {
  to: string;
  subject: string;
  text: string;
};

export function churchWorkEmailConfigured() {
  return Boolean(
    process.env.RESEND_API_KEY
    && process.env.CHURCHWORK_FROM_EMAIL
  );
}

export async function sendChurchWorkEmail(input: ChurchWorkEmailInput): Promise<ChurchWorkEmailResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CHURCHWORK_FROM_EMAIL;

  if (!apiKey || !from) {
    return { sent: false, reason: "email-not-configured" };
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from,
        to: [input.to],
        subject: input.subject,
        text: input.text
      })
    });

    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      console.error("[churchwork-email] delivery failed", {
        status: response.status,
        detail: detail.slice(0, 400)
      });
      return { sent: false, reason: "provider-rejected" };
    }

    return { sent: true };
  } catch (error) {
    console.error("[churchwork-email] provider unavailable", error);
    return { sent: false, reason: "provider-unavailable" };
  }
}

export async function sendChurchWorkAdminAlert(subject: string, text: string) {
  const to = process.env.CHURCHWORK_ADMIN_ALERT_EMAIL;
  if (!to) return { sent: false, reason: "admin-alert-email-not-configured" };
  return sendChurchWorkEmail({ to, subject, text });
}
