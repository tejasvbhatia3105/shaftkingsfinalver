import {
  Anton,
  Inter,
  Permanent_Marker,
  Poppins,
  Montserrat,
} from 'next/font/google';
import localFont from 'next/font/local';

export const PermanentMarker = Permanent_Marker({
  subsets: ['latin'],
  weight: '400',
});

export const InterFont = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

export const PoppinsFont = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

export const MontserratFont = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

export const anton = Anton({
  subsets: ['latin'],
  weight: '400',
});

export const Geoform = localFont({
  src: [
    {
      path: '../../public/fonts/Geoform/ExtraLight.otf',
      weight: '300',
    },
    {
      path: '../../public/fonts/Geoform/Light.otf',
      weight: '400',
    },
    {
      path: '../../public/fonts/Geoform/Medium.otf',
      weight: '500',
    },
    {
      path: '../../public/fonts/Geoform/Bold.otf',
      weight: '700',
    },
    {
      path: '../../public/fonts/Geoform/ExtraBold.otf',
      weight: '800',
    },
  ],
  display: 'swap',
  adjustFontFallback: false,
});
