export default function timeFormatter(timeStr) {
  // Split the input time string by colon to extract hours and minutes
  const [hours, minutes] = timeStr.split(':');

  // Convert hours from string to number to handle the 12-hour conversion
  const hoursNumber = parseInt(hours, 10);

  // Determine AM or PM period
  const period = hoursNumber >= 12 ? 'pm' : 'am';

  // Convert 24-hour time to 12-hour time
  const hours12 = hoursNumber % 12 || 12; // Converts '00' to '12'

  // Return the formatted string with padded minutes and AM/PM
  return `${hours12}:${minutes.padStart(2, '0')}${period}`;
}