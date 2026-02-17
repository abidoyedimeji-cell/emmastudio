import type { EmailTemplate } from "./types"

// Client Email Templates
export const clientEmailTemplates: EmailTemplate[] = [
  {
    id: "email-client-1",
    type: "booking_submitted",
    recipientType: "client",
    subject: "Booking Submitted - EMMA Studios",
    htmlContent: `
      <h2>Thank you for your booking, {{clientName}}!</h2>
      <p>We've received your booking request for <strong>{{serviceName}}</strong> with {{creatorName}}.</p>
      <h3>Booking Details:</h3>
      <ul>
        <li>Date: {{bookingDate}}</li>
        <li>Time: {{bookingTime}}</li>
        <li>Duration: {{duration}} hours</li>
        <li>Location: {{studioName}}</li>
      </ul>
      <h3>Payment Details:</h3>
      <ul>
        <li>Total Amount: ${{ totalAmount }}</li>
        <li>Deposit Paid: ${{ depositAmount }}</li>
        <li>Remaining Balance: ${{ remainingBalance }}</li>
      </ul>
      <p>Your creator will confirm your booking within 24 hours. We'll send you a confirmation email once approved.</p>
      <p>If you have any questions, reply to this email or contact us at support@emmastudios.com</p>
    `,
    textContent: "Thank you for your booking, {{clientName}}! We've received your booking request...",
    variables: [
      "clientName",
      "serviceName",
      "creatorName",
      "bookingDate",
      "bookingTime",
      "duration",
      "studioName",
      "totalAmount",
      "depositAmount",
      "remainingBalance",
    ],
    isActive: true,
  },
  {
    id: "email-client-2",
    type: "deposit_received",
    recipientType: "client",
    subject: "Deposit Received - EMMA Studios",
    htmlContent: `
      <h2>Deposit Confirmed, {{clientName}}!</h2>
      <p>We've received your 50% deposit of <strong>${{ depositAmount }}</strong> for your booking with {{creatorName}}.</p>
      <p>Your booking is now processing and awaiting creator confirmation.</p>
      <h3>Next Steps:</h3>
      <ol>
        <li>Wait for creator confirmation (within 24 hours)</li>
        <li>Attend optional pre-booking meeting if requested</li>
        <li>Pay remaining balance before your session</li>
      </ol>
      <p>Booking Reference: {{bookingId}}</p>
    `,
    textContent: "Deposit Confirmed! We've received your deposit...",
    variables: ["clientName", "depositAmount", "creatorName", "bookingId"],
    isActive: true,
  },
  {
    id: "email-client-3",
    type: "booking_confirmed",
    recipientType: "client",
    subject: "Booking Confirmed - {{serviceName}} - EMMA Studios",
    htmlContent: `
      <h2>Your Booking is Confirmed!</h2>
      <p>Great news, {{clientName}}! {{creatorName}} has confirmed your booking.</p>
      <h3>Confirmed Details:</h3>
      <ul>
        <li>Service: {{serviceName}}</li>
        <li>Date: {{bookingDate}}</li>
        <li>Time: {{bookingTime}}</li>
        <li>Duration: {{duration}} hours</li>
        <li>Location: {{studioAddress}}</li>
      </ul>
      <h3>Payment Summary:</h3>
      <ul>
        <li>Total: ${{ totalAmount }}</li>
        <li>Deposit Paid: ${{ depositAmount }}</li>
        <li>Balance Due: ${{ remainingBalance }}</li>
        <li>Due Date: {{paymentDueDate}}</li>
      </ul>
      <h3>What to Bring:</h3>
      <p>{{whatToBring}}</p>
      <h3>Cancellation Policy:</h3>
      <p>{{cancellationPolicy}}</p>
      <a href="{{calendarLink}}">Add to Calendar</a>
    `,
    textContent: "Your booking is confirmed!",
    variables: [
      "clientName",
      "creatorName",
      "serviceName",
      "bookingDate",
      "bookingTime",
      "duration",
      "studioAddress",
      "totalAmount",
      "depositAmount",
      "remainingBalance",
      "paymentDueDate",
      "whatToBring",
      "cancellationPolicy",
      "calendarLink",
    ],
    isActive: true,
  },
  {
    id: "email-client-4",
    type: "reminder_48h",
    recipientType: "client",
    subject: "Reminder: Your Session is in 2 Days - EMMA Studios",
    htmlContent: `
      <h2>Hi {{clientName}},</h2>
      <p>This is a friendly reminder that your <strong>{{serviceName}}</strong> session with {{creatorName}} is coming up!</p>
      <h3>Session Details:</h3>
      <ul>
        <li>Date: {{bookingDate}}</li>
        <li>Time: {{bookingTime}}</li>
        <li>Location: {{studioAddress}}</li>
      </ul>
      <h3>Reminders:</h3>
      <ul>
        <li>Final payment of ${{ remainingBalance }} is due before the session</li>
        <li>Please arrive 10 minutes early</li>
        <li>{{whatToBring}}</li>
      </ul>
      <p>Looking forward to seeing you soon!</p>
    `,
    textContent: "Reminder: Your session is in 2 days...",
    variables: [
      "clientName",
      "serviceName",
      "creatorName",
      "bookingDate",
      "bookingTime",
      "studioAddress",
      "remainingBalance",
      "whatToBring",
    ],
    isActive: true,
  },
  {
    id: "email-client-5",
    type: "final_payment_reminder",
    recipientType: "client",
    subject: "Final Payment Due - EMMA Studios",
    htmlContent: `
      <h2>Final Payment Reminder</h2>
      <p>Hi {{clientName}},</p>
      <p>Your session with {{creatorName}} is scheduled for {{bookingDate}} at {{bookingTime}}.</p>
      <p>Your final payment of <strong>${{ remainingBalance }}</strong> is now due.</p>
      <a href="{{paymentLink}}">Pay Now</a>
      <p>Payment must be completed before the session begins.</p>
    `,
    textContent: "Final payment of ${{remainingBalance}} is due...",
    variables: ["clientName", "creatorName", "bookingDate", "bookingTime", "remainingBalance", "paymentLink"],
    isActive: true,
  },
  {
    id: "email-client-6",
    type: "post_service_followup",
    recipientType: "client",
    subject: "How was your experience? - EMMA Studios",
    htmlContent: `
      <h2>Thank you, {{clientName}}!</h2>
      <p>We hope you had a great experience with {{creatorName}}!</p>
      <p>Your deliverables will be ready within {{deliveryTimeframe}}.</p>
      <h3>We'd love your feedback:</h3>
      <a href="{{reviewLink}}">Leave a Review</a>
      <h3>Book Again & Save:</h3>
      <p>As a returning client, you'll receive 10% off your next booking. Use code: <strong>RETURN10</strong></p>
      <h3>Refer a Friend:</h3>
      <p>Refer a friend and you'll both receive $25 credit when they complete their first booking.</p>
      <a href="{{referralLink}}">Share Your Referral Link</a>
    `,
    textContent: "Thank you for choosing EMMA Studios!",
    variables: ["clientName", "creatorName", "deliveryTimeframe", "reviewLink", "referralLink"],
    isActive: true,
  },
]

// Creator Email Templates
export const creatorEmailTemplates: EmailTemplate[] = [
  {
    id: "email-creator-1",
    type: "creator_pending_confirmation",
    recipientType: "creator",
    subject: "New Booking Request - Action Required - EMMA Studios",
    htmlContent: `
      <h2>New Booking Request</h2>
      <p>Hi {{creatorName}},</p>
      <p>You have a new booking request from {{clientName}}!</p>
      <h3>Booking Details:</h3>
      <ul>
        <li>Service: {{serviceName}}</li>
        <li>Date: {{bookingDate}}</li>
        <li>Time: {{bookingTime}}</li>
        <li>Duration: {{duration}} hours</li>
        <li>Studio: {{studioName}}</li>
        <li>Client Notes: {{clientNotes}}</li>
      </ul>
      <h3>Payment:</h3>
      <ul>
        <li>Total: ${{ totalAmount }}</li>
        <li>Your Earnings: ${{ creatorEarnings }}</li>
        <li>Deposit Received: ${{ depositAmount }}</li>
      </ul>
      <p><strong>Please confirm or decline within 24 hours.</strong></p>
      <a href="{{confirmLink}}">Confirm Booking</a>
      <a href="{{declineLink}}">Decline Booking</a>
    `,
    textContent: "New booking request from {{clientName}}...",
    variables: [
      "creatorName",
      "clientName",
      "serviceName",
      "bookingDate",
      "bookingTime",
      "duration",
      "studioName",
      "clientNotes",
      "totalAmount",
      "creatorEarnings",
      "depositAmount",
      "confirmLink",
      "declineLink",
    ],
    isActive: true,
  },
  {
    id: "email-creator-2",
    type: "creator_booking_confirmed",
    recipientType: "creator",
    subject: "Booking Confirmed - {{bookingDate}} - EMMA Studios",
    htmlContent: `
      <h2>Booking Confirmed</h2>
      <p>Hi {{creatorName}},</p>
      <p>Your booking with {{clientName}} is now confirmed!</p>
      <h3>Session Details:</h3>
      <ul>
        <li>Date: {{bookingDate}}</li>
        <li>Time: {{bookingTime}}</li>
        <li>Duration: {{duration}} hours</li>
        <li>Studio: {{studioName}} - {{studioAddress}}</li>
      </ul>
      <h3>Client Information:</h3>
      <ul>
        <li>Name: {{clientName}}</li>
        <li>Email: {{clientEmail}}</li>
        <li>Phone: {{clientPhone}}</li>
        <li>Special Requests: {{clientNotes}}</li>
      </ul>
      <h3>Earnings:</h3>
      <ul>
        <li>Total Booking Value: ${{ totalAmount }}</li>
        <li>Your Earnings: ${{ creatorEarnings }}</li>
        <li>Platform Fee: ${{ platformFee }}</li>
        <li>Payout Date: {{payoutDate}}</li>
      </ul>
      <a href="{{calendarLink}}">Add to Calendar</a>
    `,
    textContent: "Booking confirmed with {{clientName}}...",
    variables: [
      "creatorName",
      "clientName",
      "bookingDate",
      "bookingTime",
      "duration",
      "studioName",
      "studioAddress",
      "clientEmail",
      "clientPhone",
      "clientNotes",
      "totalAmount",
      "creatorEarnings",
      "platformFee",
      "payoutDate",
      "calendarLink",
    ],
    isActive: true,
  },
  {
    id: "email-creator-3",
    type: "creator_reminder",
    recipientType: "creator",
    subject: "Session Tomorrow - {{clientName}} - EMMA Studios",
    htmlContent: `
      <h2>Session Reminder</h2>
      <p>Hi {{creatorName}},</p>
      <p>Reminder: You have a session with {{clientName}} tomorrow!</p>
      <h3>Details:</h3>
      <ul>
        <li>Date: {{bookingDate}}</li>
        <li>Time: {{bookingTime}}</li>
        <li>Location: {{studioAddress}}</li>
        <li>Service: {{serviceName}}</li>
      </ul>
      <h3>Preparation Checklist:</h3>
      <ul>
        <li>Review client's special requests</li>
        <li>Ensure equipment is ready</li>
        <li>Arrive 15 minutes early</li>
        <li>Confirm studio access</li>
      </ul>
    `,
    textContent: "Session reminder for tomorrow...",
    variables: ["creatorName", "clientName", "bookingDate", "bookingTime", "studioAddress", "serviceName"],
    isActive: true,
  },
]

// Studio Email Templates
export const studioEmailTemplates: EmailTemplate[] = [
  {
    id: "email-studio-1",
    type: "studio_new_booking",
    recipientType: "studio",
    subject: "New Studio Booking - {{bookingDate}} - EMMA Studios",
    htmlContent: `
      <h2>New Studio Booking</h2>
      <p>A new booking has been scheduled at {{studioName}}.</p>
      <h3>Booking Details:</h3>
      <ul>
        <li>Date: {{bookingDate}}</li>
        <li>Time: {{bookingTime}}</li>
        <li>Duration: {{duration}} hours</li>
        <li>Creator: {{creatorName}}</li>
        <li>Client: {{clientName}}</li>
      </ul>
      <h3>Studio Requirements:</h3>
      <ul>
        <li>Setup: {{setupRequirements}}</li>
        <li>Equipment Needed: {{equipmentNeeded}}</li>
      </ul>
      <h3>Payment:</h3>
      <ul>
        <li>Studio Rental: ${{ studioFee }}</li>
        <li>Payment Status: {{paymentStatus}}</li>
      </ul>
    `,
    textContent: "New booking at {{studioName}}...",
    variables: [
      "studioName",
      "bookingDate",
      "bookingTime",
      "duration",
      "creatorName",
      "clientName",
      "setupRequirements",
      "equipmentNeeded",
      "studioFee",
      "paymentStatus",
    ],
    isActive: true,
  },
]

export function getEmailTemplate(type: string): EmailTemplate | undefined {
  return [...clientEmailTemplates, ...creatorEmailTemplates, ...studioEmailTemplates].find((t) => t.type === type)
}

export function fillEmailTemplate(
  template: EmailTemplate,
  variables: Record<string, string>,
): { subject: string; htmlContent: string; textContent: string } {
  let subject = template.subject
  let htmlContent = template.htmlContent
  let textContent = template.textContent

  Object.entries(variables).forEach(([key, value]) => {
    const regex = new RegExp(`{{${key}}}`, "g")
    subject = subject.replace(regex, value)
    htmlContent = htmlContent.replace(regex, value)
    textContent = textContent.replace(regex, value)
  })

  return { subject, htmlContent, textContent }
}
