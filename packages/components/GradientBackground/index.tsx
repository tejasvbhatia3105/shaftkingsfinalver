import { cn } from '@/utils/cn';
import { useTheme } from 'next-themes';

const GradientBackground = () => {
  const { theme } = useTheme();

  const darkModeGradient =
    'radial-gradient(32.27% 32.27% at 44.35% 54.57%, #1b2032 10%, #13141A 100%)';

  const lightModeGradient = '';

  return (
    <>
      <div
        style={{
          background: theme === 'dark' ? darkModeGradient : lightModeGradient,
        }}
        className={cn(
          'absolute -top-[150px] left-0 z-0 size-[600px] opacity-70 rounded-full lg:-left-[300px] lg:-top-[380px] lg:size-[1000px]',
          { hidden: false }
        )}
      />
      <div
        style={{
          background: theme === 'dark' ? darkModeGradient : lightModeGradient,
        }}
        className={cn(
          'absolute -right-[50px] -top-[150px] z-0 size-[600px] rounded-full lg:-right-[300px] lg:-top-[380px] lg:size-[1000px]',
          { hidden: false }
        )}
      />
    </>
  );
};

export default GradientBackground;
