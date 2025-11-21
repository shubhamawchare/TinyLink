import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'TinyLink',
  description: 'Simple URL shortener with stats',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-950 text-slate-50">
        <div className="flex flex-col min-h-screen">
          <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur">
            <div className="max-w-5xl mx-auto py-4 px-4 flex items-center justify-between">
              <h1 className="text-xl font-semibold tracking-tight">
                TinyLink
              </h1>
              <nav className="flex gap-4 text-sm">
                <a href="/" className="hover:underline">
                  Dashboard
                </a>
                <a href="/healthz" className="hover:underline">
                  Health
                </a>
              </nav>
            </div>
          </header>
          <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-6">
            {children}
          </main>
          <footer className="border-t border-slate-800 bg-slate-900/80 text-xs text-slate-400">
            <div className="max-w-5xl mx-auto px-4 py-3 flex justify-between">
              <span>TinyLink &copy; {new Date().getFullYear()}</span>
              <span>Built with Next.js &amp; Postgres</span>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
