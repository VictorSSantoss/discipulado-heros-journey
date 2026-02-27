import { Bebas_Neue, Barlow, Staatliches, Fugaz_One } from 'next/font/google';

export const bebas = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-bebas',
});

export const barlow = Barlow({
  weight: ['400', '500', '600', '700', '800'], 
  subsets: ['latin'],
  variable: '--font-barlow',
});

export const staatliches = Staatliches({
  weight: '400', 
  subsets: ['latin'],
  variable: '--font-staatliches',
});

export const fugaz = Fugaz_One({
  weight: '400', 
  subsets: ['latin'],
  variable: '--font-fugaz',
});