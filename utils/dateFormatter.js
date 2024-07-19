import { parseISO, format } from 'date-fns';

export default function formatDate(dateStr) {
  // Parse the input date string to a Date object
  const dateObj = parseISO(dateStr);

  // Get the current year
  const currentYear = new Date().getFullYear();

  // Extract the year, month, and day from the date object
  const year = dateObj.getFullYear();
  const month = format(dateObj, 'MMMM'); // Full month name
  const day = dateObj.getUTCDate(); // Get the day of the month in UTC

  // Check if the year is the current year and format accordingly
  if (year === currentYear) {
    return `${month} ${day}`; // No zero-padding for single-digit dates
  } else {
    return `${month} ${day}, ${year}`;
  }
}
