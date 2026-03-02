import { Bebas_Neue, Barlow, Staatliches, Fugaz_One } from 'next/font/google';

export const bebas = Bebas_Neue({ 
  weight: '400', subsets: ['latin'], 
  variable: '--family-bebas' 
});

export const barlow = Barlow({ 
  weight: ['400', '700', '900'], subsets: ['latin'], 
  variable: '--family-barlow' 
});

export const staatliches = Staatliches({ 
  weight: '400', subsets: ['latin'], 
  variable: '--family-staatliches' 
});

export const fugaz = Fugaz_One({ 
  weight: '400', subsets: ['latin'], 
  variable: '--family-fugaz' 
});