import type { Metadata, Viewport } from 'next';
import { Funnel_Display, Funnel_Sans } from 'next/font/google';
import './globals.css';

const display = Funnel_Display({ subsets: ['latin'], variable: '--font-display', display: 'swap' });
const text = Funnel_Sans({ subsets: ['latin'], variable: '--font-text', display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL('https://landing-real-estate-danielyatacoblas-projects.vercel.app'),
  title: 'Cerca — Departamentos en Lima a minutos de tu trabajo',
  description: 'Busca departamentos en Lima por tiempo de viaje al trabajo en hora punta. Mapa interactivo, cuota hipotecaria y visitas. Demo de portafolio de Daniel Yataco.',
  openGraph: { title: 'Cerca — Elige tu depa por los minutos al trabajo', description: 'Mapa de Lima filtrado por tiempo de viaje.', images: ['/img/hero.jpg'] },
};

export const viewport: Viewport = { themeColor: '#e6e9eb', width: 'device-width', initialScale: 1, viewportFit: 'cover' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${display.variable} ${text.variable}`}>
      <body>{children}</body>
    </html>
  );
}
