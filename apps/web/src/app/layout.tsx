import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Providers } from './providers';
import './globals.css';

export const metadata: Metadata = {
  title: 'Metaverso de Trabalho',
  description: 'Um mundo 3D onde pessoas e agentes de IA trabalham juntos.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="bg-gray-900 text-gray-50 antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
