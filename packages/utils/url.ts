export const isValidUrl = (url?: string) => {
  if (!url) return false;
  try {
    return Boolean(new URL(url));
  } catch {
    return false;
  }
};
