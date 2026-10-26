export const getGreeting = (name = '') => {
  const hour = new Date().getHours();
  let timeOfDay = 'Good morning';

  if (hour >= 12 && hour < 17) {
    timeOfDay = 'Good afternoon';
  } else if (hour >= 17 || hour < 4) {
    timeOfDay = 'Good evening';
  }

  return name ? `${timeOfDay}, ${name.split(' ')[0]}` : timeOfDay;
};

export const formatDate = (dateString, format = 'medium') => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';

  if (format === 'short') {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  if (format === 'medium') {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  if (format === 'full') {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }

  return date.toLocaleDateString();
};

export const getMonthName = (date) => {
  return new Date(date).toLocaleString('en-US', { month: 'short' });
};

export default { getGreeting, formatDate, getMonthName };
