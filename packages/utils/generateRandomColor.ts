export const generateColorFromId = (id: string): string => {
  const numId = parseInt(id, 10);

  // eslint-disable-next-line no-restricted-globals
  if (isNaN(numId) || numId < 0) return 'rgb(0, 0, 0)';

  const r = (numId * 167) % 256;
  const g = (numId * 89) % 256;
  const b = (numId * 53) % 256;

  const minValue = 100;
  const adjustColor = (value: number) => (value < minValue ? minValue : value);

  return `rgb(${adjustColor(r)}, ${adjustColor(g)}, ${adjustColor(b)})`;
};
