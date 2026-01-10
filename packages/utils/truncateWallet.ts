export function truncateWallet(
  text: string | null | undefined,
  outputLength: number = 11,
  separator?: string
) {
  if (!text) return text;

  if (text.length <= outputLength) return text;

  separator = separator || '...';

  const sepLen = separator.length;

  const frontChars = Math.floor((outputLength - sepLen) / 2);
  const backChars = Math.ceil((outputLength - sepLen) / 2);

  return `${text.substring(0, frontChars)}${separator}${text.substring(
    text.length - backChars
  )}`;
}

export const truncateText = (value: string, numberCharacters: number) => {
  if (!value) return '';

  if (value.length > numberCharacters) {
    return `${value.substring(0, numberCharacters)}...`;
  }

  return value.substring(0, numberCharacters);
};
