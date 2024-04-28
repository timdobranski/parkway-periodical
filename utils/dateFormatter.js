export default function formatDate(dateStr) {
  // Create a date object from the input string
  const dateObj = new Date(dateStr);

  // Get the current year
  const currentYear = new Date().getFullYear();

  // Extract the year, month, and day from the date object
  const year = dateObj.getFullYear();
  const month = dateObj.toLocaleString('default', { month: 'long' }); // 'short' gives the abbreviated month
  const day = dateObj.getDate();

  // Check if the year is the current year and format accordingly
  if (year === currentYear) {
      return `${month} ${day.toString().padStart(2, '0')}`; // Pad the day to ensure two digits
  } else {
      return `${month}-${day.toString().padStart(2, '0')}, ${year}`;
  }
}
