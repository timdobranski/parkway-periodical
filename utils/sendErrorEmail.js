import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.NEXT_SENDGRID_API_KEY);

export const sendErrorEmail = async (error, context = {}) => {
  const { page, user, additionalInfo, replyToEmail, replyToName } = context;
  const toEmail = process.env.SENDGRID_TO_EMAIL || 'timdobranski@gmail.com';
  const fromEmail = process.env.SENDGRID_FROM_EMAIL || 'timdobranski@gmail.com';
  const msg = {
    to: toEmail,
    from: { email: fromEmail, name: 'Parkway Periodical' },
    subject: 'Parkway Periodical Support Request / Error Notification',
    text: `
      An error occurred in Parkway Periodical: ${error.message}
      Page: ${page || 'N/A'}
      User: ${user || 'N/A'}
      Additional Info: ${additionalInfo || 'N/A'}
    `,
    html: `
      <strong>An error occurred:</strong>
      <p>${error.message}</p>
      <p><strong>Page:</strong> ${page || 'N/A'}</p>
      <p><strong>User:</strong> ${user || 'N/A'}</p>
      <p><strong>Additional Info:</strong> ${additionalInfo || 'N/A'}</p>
    `,
  };

  if (replyToEmail) {
    msg.replyTo = {
      email: replyToEmail,
      name: replyToName || replyToEmail,
    };
  }

  try {
    const response = await sgMail.send(msg);
    console.log('sgMail.send() response: ', response);

    // console.log('Error email sent');
    return true; // Return true on success
  } catch (err) {
    console.error('Error sending email', err);
    throw new Error('Failed to send email'); // Throw an error to handle it in the API route
  }
};
