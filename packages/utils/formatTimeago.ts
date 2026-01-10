import { format } from 'date-fns';

export function FormatDateAgo(dateString: string): string {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);

    if (minutes < 1) return 'just now';
    if (minutes === 1) return '1 minute ago';
    if (minutes < 60) return `${minutes} minutes ago`;

    if (hours === 1) return '1 hour ago';
    if (hours < 24) return `${hours} hours ago`;

    if (days === 1) return '1 day ago';
    if (days < 7) return `${days} days ago`;

    if (weeks === 1) return '1 week ago';
    if (weeks > 1) return `${weeks} weeks ago`;

    return formatDate(date);
  } catch (error) {
    return 'Invalid date';
  }
}

function formatDate(date: Date): string {
  return format(date, 'MMM dd, yyyy - HH:mm');
}
