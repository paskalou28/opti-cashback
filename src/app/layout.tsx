import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';

export const metadata: Metadata = {
  title: 'Opti-Cashback — Maximise tes gains',
  description: 'Comparateur de cashback et offres de parrainage du quotidien.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className="bg-slate-50 text-slate-800 antialiased">
        <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
          <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link href="/" className="font-extrabold text-xl text-blue-600">
              Opti-Cashback
            </Link>
            <nav className="flex items-center gap-6 font-medium text-sm">
              <Link href="/" className="hover:text-blue-600 transition text-slate-700">
                Comparateur
              </Link>
              <Link href="/parrainages" className="hover:text-blue-600 transition text-slate-700">
                Tous les Parrainages
              </Link>
            </nav>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}