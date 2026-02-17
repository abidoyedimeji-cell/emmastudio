// SendGrid email utility
// Requires SENDGRID_API_KEY environment variable

type EmailParams = {
  to: string
  subject: string
  html: string
  text?: string
}

export async function sendEmail({ to, subject, html, text }: EmailParams) {
  const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY

  if (!SENDGRID_API_KEY) {
    console.error("[v0] SENDGRID_API_KEY not found - emails will not be sent")
    return { success: false, error: "Email service not configured" }
  }

  try {
    const res = await fetch("https://api.sendgrid.com/v3/mail/send", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${SENDGRID_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        personalizations: [{ to: [{ email: to }] }],
        from: { email: process.env.FROM_EMAIL || "no-reply@emmastudios.com", name: "EMMA Studios" },
        subject,
        content: [
          { type: "text/plain", value: text || html.replace(/<[^>]*>/g, "") },
          { type: "text/html", value: html },
        ],
      }),
    })

    if (res.ok) {
      return { success: true }
    } else {
      const error = await res.text()
      console.error("[v0] SendGrid error:", error)
      return { success: false, error }
    }
  } catch (error: any) {
    console.error("[v0] Email send error:", error)
    return { success: false, error: error.message }
  }
}

// Email templates
export const emailTemplates = {
  bookingConfirmed: (bookingDetails: any) => ({
    subject: "Booking Confirmed - EMMA Studios",
    html: `
      <h1>Your Booking is Confirmed!</h1>
      <p>Hi ${bookingDetails.clientName},</p>
      <p>Your booking has been confirmed.</p>
      <p><strong>Details:</strong></p>
      <ul>
        <li>Date: ${bookingDetails.date}</li>
        <li>Time: ${bookingDetails.time}</li>
        <li>Package: ${bookingDetails.packageName}</li>
        <li>Total: $${bookingDetails.total}</li>
      </ul>
      <p>We look forward to seeing you!</p>
    `,
  }),
  newMessage: (messageDetails: any) => ({
    subject: "New Message - EMMA Studios",
    html: `
      <h1>You have a new message</h1>
      <p>Hi ${messageDetails.recipientName},</p>
      <p>${messageDetails.senderName} sent you a message:</p>
      <blockquote>${messageDetails.message}</blockquote>
      <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/messages">View Message</a></p>
    `,
  }),
}
