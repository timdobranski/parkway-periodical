import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.NEXT_SENDGRID_API_KEY);

const escapeHtml = (value) => {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

export const sendSupportEmail = async (supportRequest = {}) => {
  const {
    name,
    email,
    deviceUsed,
    browserUsed,
    issueDescription,
    userAgent,
    url,
    page,
  } = supportRequest;

  const toEmail = process.env.SENDGRID_SUPPORT_TO_EMAIL || process.env.SENDGRID_TO_EMAIL || 'timdobranski@gmail.com';
  const fromEmail =
    process.env.SENDGRID_SUPPORT_FROM_EMAIL ||
    process.env.SENDGRID_FROM_EMAIL ||
    'timdobranski@gmail.com';

  const safeName = (name && String(name).trim()) || 'Unknown';
  const safeEmail = (email && String(email).trim()) || 'Unknown';

  const subject = `Parkway Periodical Support Request: ${safeName} (${safeEmail})`;

  const rows = [
    ['Name', safeName],
    ['Email', safeEmail],
    ['Device used', deviceUsed || 'N/A'],
    ['Browser used', browserUsed || 'N/A'],
    ['Page', page || 'N/A'],
    ['URL', url || 'N/A'],
    ['User agent', userAgent || 'N/A'],
  ];

  const text = [
    'Parkway Periodical Support Request',
    '',
    ...rows.map(([label, val]) => `${label}: ${val ?? 'N/A'}`),
    '',
    'Issue description:',
    String(issueDescription ?? ''),
    '',
  ].join('\n');

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.5;">
      <h2 style="margin: 0 0 12px 0;">Parkway Periodical Support Request</h2>

      <table cellpadding="0" cellspacing="0" style="border-collapse: collapse; width: 100%; max-width: 720px;">
        <tbody>
          ${rows
            .map(
              ([label, val]) => `
                <tr>
                  <td style="padding: 8px 10px; border: 1px solid #ddd; width: 160px;"><strong>${escapeHtml(
                    label
                  )}</strong></td>
                  <td style="padding: 8px 10px; border: 1px solid #ddd;">${escapeHtml(val || 'N/A')}</td>
                </tr>
              `
            )
            .join('')}
        </tbody>
      </table>

      <h3 style="margin: 18px 0 8px 0;">Issue description</h3>
      <pre style="white-space: pre-wrap; font-family: inherit; margin: 0; padding: 12px; border: 1px solid #ddd; border-radius: 6px; background: #fafafa;">${escapeHtml(
        issueDescription || ''
      )}</pre>
    </div>
  `;

  const msg = {
    to: toEmail,
    from: { email: fromEmail, name: 'Parkway Periodical' },
    subject,
    text,
    html,
    replyTo: {
      email: safeEmail,
      name: safeName,
    },
  };

  try {
    await sgMail.send(msg);
    return true;
  } catch (err) {
    console.error('Error sending support email', err);
    throw new Error('Failed to send support email');
  }
};
