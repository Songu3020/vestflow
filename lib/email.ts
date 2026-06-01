const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const FROM_EMAIL = process.env.NOTIFICATION_FROM_EMAIL || "noreply@vestflow.xyz";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://vestflow.xyz";

interface EmailContent {
  subject: string;
  text: string;
  html: string;
}

async function sendEmail(to: string, content: EmailContent): Promise<void> {
  if (!SENDGRID_API_KEY) {
    console.warn("SENDGRID_API_KEY not configured. Email not sent to:", to);
    return;
  }

  const message = {
    personalizations: [{ to: [{ email: to }] }],
    from: { email: FROM_EMAIL },
    subject: content.subject,
    content: [
      { type: "text/plain", value: content.text },
      { type: "text/html", value: content.html },
    ],
  };

  const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${SENDGRID_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(message),
  });

  if (!response.ok) {
    throw new Error(`SendGrid error: ${response.status} ${response.statusText}`);
  }
}

export async function sendVerificationEmail(
  email: string,
  subscriptionId: number,
  verificationToken: string
): Promise<void> {
  const verificationUrl = `${BASE_URL}/api/notifications/verify?token=${verificationToken}`;

  const content: EmailContent = {
    subject: "Verify Your VestFlow Notification Subscription",
    text: `
Verify your email to receive vesting milestone notifications.

Click the link below to verify:
${verificationUrl}

This link will expire in 24 hours.

If you did not request this, you can safely ignore this email.
    `.trim(),
    html: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0; text-align: center; }
    .header h1 { margin: 0; font-size: 24px; }
    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
    .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; border-radius: 4px; text-decoration: none; font-weight: bold; margin: 20px 0; }
    .footer { color: #999; font-size: 12px; margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>VestFlow Notifications</h1>
    </div>
    <div class="content">
      <p>Hi there,</p>
      <p>Thank you for subscribing to VestFlow notifications. Click the button below to verify your email address and start receiving vesting milestone updates.</p>
      <center>
        <a href="${verificationUrl}" class="button">Verify Email</a>
      </center>
      <p>Or copy this link: <a href="${verificationUrl}">${verificationUrl}</a></p>
      <p>This verification link will expire in 24 hours.</p>
      <p>If you did not request this subscription, you can safely ignore this email.</p>
      <div class="footer">
        <p>VestFlow - Vesting made simple on Stellar</p>
      </div>
    </div>
  </div>
</body>
</html>
    `.trim(),
  };

  await sendEmail(email, content);
}

export async function sendCliffReachedNotification(
  email: string,
  scheduleId: number,
  beneficiaryAddress: string,
  cliffDate: Date
): Promise<void> {
  const scheduleUrl = `${BASE_URL}/schedule/${scheduleId}`;

  const content: EmailContent = {
    subject: `Cliff Reached - Schedule #${scheduleId}`,
    text: `
Your vesting schedule has reached its cliff!

Schedule ID: ${scheduleId}
Cliff Date: ${cliffDate.toLocaleDateString()}

Visit your schedule: ${scheduleUrl}

This is an automated notification from VestFlow.
    `.trim(),
    html: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0; text-align: center; }
    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
    .alert { background: #fef5e7; border-left: 4px solid #f39c12; padding: 15px; margin: 15px 0; border-radius: 4px; }
    .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; border-radius: 4px; text-decoration: none; font-weight: bold; margin: 20px 0; }
    .footer { color: #999; font-size: 12px; margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Cliff Reached!</h1>
    </div>
    <div class="content">
      <div class="alert">
        <strong>Your vesting schedule has reached its cliff!</strong>
      </div>
      <p>Schedule #${scheduleId}</p>
      <p>Cliff Date: <strong>${cliffDate.toLocaleDateString()}</strong></p>
      <center>
        <a href="${scheduleUrl}" class="button">View Schedule</a>
      </center>
      <div class="footer">
        <p>VestFlow - Vesting made simple on Stellar</p>
      </div>
    </div>
  </div>
</body>
</html>
    `.trim(),
  };

  await sendEmail(email, content);
}

export async function sendClaimableNotification(
  email: string,
  scheduleId: number,
  claimableAmount: string,
  claimableDate: Date
): Promise<void> {
  const scheduleUrl = `${BASE_URL}/schedule/${scheduleId}`;

  const content: EmailContent = {
    subject: `Tokens Now Claimable - Schedule #${scheduleId}`,
    text: `
Your tokens are now claimable!

Schedule ID: ${scheduleId}
Claimable Amount: ${claimableAmount} XLM
Available Since: ${claimableDate.toLocaleDateString()}

Visit your schedule to claim: ${scheduleUrl}

This is an automated notification from VestFlow.
    `.trim(),
    html: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0; text-align: center; }
    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
    .highlight { background: #d4edda; border-left: 4px solid #28a745; padding: 15px; margin: 15px 0; border-radius: 4px; }
    .amount { font-size: 24px; font-weight: bold; color: #28a745; }
    .button { display: inline-block; background: #28a745; color: white; padding: 12px 30px; border-radius: 4px; text-decoration: none; font-weight: bold; margin: 20px 0; }
    .footer { color: #999; font-size: 12px; margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Tokens Available to Claim</h1>
    </div>
    <div class="content">
      <div class="highlight">
        <p class="amount">${claimableAmount} XLM</p>
        <strong>is now available to claim!</strong>
      </div>
      <p>Schedule #${scheduleId}</p>
      <p>Available Since: <strong>${claimableDate.toLocaleDateString()}</strong></p>
      <center>
        <a href="${scheduleUrl}" class="button">Claim Tokens</a>
      </center>
      <div class="footer">
        <p>VestFlow - Vesting made simple on Stellar</p>
      </div>
    </div>
  </div>
</body>
</html>
    `.trim(),
  };

  await sendEmail(email, content);
}

export async function sendRevokedNotification(
  email: string,
  scheduleId: number,
  revokedDate: Date
): Promise<void> {
  const scheduleUrl = `${BASE_URL}/schedule/${scheduleId}`;

  const content: EmailContent = {
    subject: `Schedule Revoked - Schedule #${scheduleId}`,
    text: `
Your vesting schedule has been revoked.

Schedule ID: ${scheduleId}
Revoked Date: ${revokedDate.toLocaleDateString()}

Visit your schedule: ${scheduleUrl}

This is an automated notification from VestFlow.
    `.trim(),
    html: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0; text-align: center; }
    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
    .alert { background: #f8d7da; border-left: 4px solid #dc3545; padding: 15px; margin: 15px 0; border-radius: 4px; }
    .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; border-radius: 4px; text-decoration: none; font-weight: bold; margin: 20px 0; }
    .footer { color: #999; font-size: 12px; margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Schedule Revoked</h1>
    </div>
    <div class="content">
      <div class="alert">
        <strong>Your vesting schedule has been revoked.</strong>
      </div>
      <p>Schedule #${scheduleId}</p>
      <p>Revoked Date: <strong>${revokedDate.toLocaleDateString()}</strong></p>
      <center>
        <a href="${scheduleUrl}" class="button">View Schedule</a>
      </center>
      <div class="footer">
        <p>VestFlow - Vesting made simple on Stellar</p>
      </div>
    </div>
  </div>
</body>
</html>
    `.trim(),
  };

  await sendEmail(email, content);
}
