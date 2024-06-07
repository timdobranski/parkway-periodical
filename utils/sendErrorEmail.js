// utils/sendEmail.js
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendErrorEmail = async (error, context = {}) => {
  const { page, user, additionalInfo } = context;
  const msg = {
    to: 'timdobranski@gmail.com', // Change to your recipient
    from: 'timdobranski@gmail.com', // Change to your verified sender
    subject: 'Error Notification',
    text: `
      An error occurred: ${error.message}
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

  try {
    await sgMail.send(msg);
    console.log('Error email sent');
  } catch (err) {
    console.error('Error sending email', err);
  }
};
