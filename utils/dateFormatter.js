import { parseISO, format } from 'date-fns';

export default function formatDate(dateStr) {
  // Parse the input date string to a Date object
  const dateObj = parseISO(dateStr);

  // Convert the date to Pacific Time
  const pacificOffset = -7; // PDT (Pacific Daylight Time) is UTC-7, and PST is UTC-8
  const pacificDate = new Date(dateObj.getTime() + pacificOffset * 60 * 60 * 1000);

  // Get the current year
  const currentYear = new Date().getFullYear();

  // Extract the year, month, and day from the pacificDate object
  const year = pacificDate.getFullYear();
  const month = format(pacificDate, 'MMMM'); // Full month name
  const day = pacificDate.getDate(); // Get the day of the month in Pacific Time

  // Check if the year is the current year and format accordingly
  if (year === currentYear) {
    return `${month} ${day}`; // No zero-padding for single-digit dates
  } else {
    return `${month} ${day}, ${year}`;
  }
}