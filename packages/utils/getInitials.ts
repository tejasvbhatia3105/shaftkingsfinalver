export function getInitials(name: string) {
  if (!name) return '';

  const words = name.trim().split(' ');

  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }

  return words
    .map((word) => word[0]?.toUpperCase())
    .slice(0, 2)
    .join('');
}
