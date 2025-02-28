/**
 * Formats a timestamp into a readable date string with optional settings.
 *
 * @param {string|number|Date} timestamp - The date to format.
 * @param {Object} [options={}] - Optional settings to customize the format.
 * @param {boolean} [options.time=true] - Whether to display the time.
 * @param {boolean} [options.day=true] - Whether to display the day.
 * @param {boolean} [options.month=true] - Whether to display the month.
 * @param {boolean} [options.year=true] - Whether to display the year.
 * @param {boolean} [options.format24hr=false] - Whether to use 24-hour format for the time.
 * @returns {string} The formatted date string.
 */
export const formatDate = (timestamp, options = {}) => {
  const { time = true, day = true, month = true, year = true, format24hr = false } = options;

  if (typeof timestamp === 'number' && timestamp < 10000000000) {
    timestamp *= 1000;
  }

  const date = new Date(timestamp);
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);

  const yearVal = date.getFullYear();
  const monthVal = months[date.getMonth()];
  const dayVal = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes().toString().padStart(2, '0');

  const hourDisplay = format24hr ? hour.toString().padStart(2, '0') : hour % 12 || 12;
  const period = hour >= 12 ? 'PM' : 'AM';
  const timeVal = format24hr ? `${hourDisplay}:${minute}` : `${hourDisplay}:${minute} ${period}`;

  const isToday = date >= today && date < new Date(today.getTime() + 86400000);
  const isYesterday = date >= yesterday && date < today;

  let dateString = '';

  if (isToday) {
    dateString = `Today${time ? ` at ${timeVal}` : ''}`;
  } else if (isYesterday) {
    dateString = `Yesterday${time ? ` at ${timeVal}` : ''}`;
  } else {
    const yearDisplay = year ? ` ${yearVal}` : '';
    dateString = `${month ? monthVal : ''} ${day ? dayVal : ''}${yearDisplay}`;
    if (time) {
      dateString += ` at ${timeVal}`;
    }
  }

  return dateString.trim();
};

export const formatDuration = (totalMinutesFloat) => {
  // Convert total minutes to total seconds for easier calculation
  const totalSeconds = Math.round(totalMinutesFloat * 60);

  // Calculate hours, minutes, and seconds
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  // Format the output string
  let output = '';
  if (hours > 0) output += `${hours}h `;
  if (minutes > 0 || hours > 0) output += `${minutes}m `;
  output += `${seconds}s`;

  return output.trim();
};
