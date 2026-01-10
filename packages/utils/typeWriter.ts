/**
 * @param text
 * @param typingSpeed
 * @returns
 */
export const typewriter = (
  text: string,
  typingSpeed: number,
  callback: (typedText: string) => void
) => {
  let index = 0;

  const typeInterval = setInterval(() => {
    if (index < text.length) {
      callback(text.slice(0, index + 1));
      // eslint-disable-next-line no-plusplus
      index++;
    } else {
      clearInterval(typeInterval);
    }
  }, typingSpeed);

  return () => clearInterval(typeInterval);
};
