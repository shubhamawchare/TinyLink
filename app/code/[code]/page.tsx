'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import type { Link } from '@/app/types/link';

type Status = 'loading' | 'success' | 'error';

export default function CodeStatsPage() {
  const params = useParams<{ code: string }>();
  const router = useRouter();
  const code = params?.code as string;

  const [link, setLink] = useState<Link | null>(null);
  const [status, setStatus] = useState<Status>('loading');
  const [error, setError] = useState<string | null>(null);

  const baseUrl =
    typeof window !== 'undefined'
      ? window.location.origin
      : process.env.NEXT_PUBLIC_BASE_URL ?? '';

  useEffect(() => {
    async function fetchLink() {
      try {
        setStatus('loading');
        setError(null);
        const res = await fetch(`/api/links/${code}`);
        if (res.status === 404) {
          setStatus('error');
          setError('Link not found');
          return;
        }
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          setStatus('error');
          setError(body.error || 'Failed to load link');
          return;
        }
        const data = await res.json();
        setLink(data);
        setStatus('success');
      } catch (err: any) {
        setStatus('error');
        setError(err.message || 'Failed to load link');
      }
    }

    if (code) {
      fetchLink();
    }
  }, [code]);

  function formatDate(value: string | null) {
    if (!value) return '—';
    const date = new Date(value);
    return date.toLocaleString();
  }

  return (
    <div className="space-y-5">
      <button
        type="button"
        onClick={() => router.push('/')}
        className="text-xs text-slate-400 hover:text-slate-200"
      >
        ← Back to Dashboard
      </button>

      {status === 'loading' && (
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-sm text-slate-400">
          Loading stats…
        </div>
      )}

      {status === 'error' && (
        <div className="rounded-xl border border-red-800 bg-red-950/60 p-4 text-sm text-red-200">
          {error}
        </div>
      )}

      {status === 'success' && link && (
        <div className="space-y-4">
          <section className="rounded-xl border border-slate-800 bg-slate-900/70 p-4 sm:p-5 space-y-3">
            <h2 className="text-xl font-semibold">
              Stats for <span className="font-mono text-sm">{link.code}</span>
            </h2>
            <div className="space-y-2 text-sm">
              <div>
                <div className="text-slate-400">Short URL</div>
                <a
                  href={`/${link.code}`}
                  className="font-mono text-xs text-blue-400 hover:underline"
                >
                  {baseUrl}/{link.code}
                </a>
              </div>
              <div>
                <div className="text-slate-400">Target URL</div>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  className="block truncate text-xs text-slate-200 hover:text-blue-400"
                  title={link.url}
                >
                  {link.url}
                </a>
              </div>
            </div>
          </section>

          <section className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4 space-y-1">
              <div className="text-xs uppercase tracking-wide text-slate-400">
                Total clicks
              </div>
              <div className="text-2xl font-semibold">
                {link.click_count}
              </div>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4 space-y-1">
              <div className="text-xs uppercase tracking-wide text-slate-400">
                Created at
              </div>
              <div className="text-sm">
                {formatDate(link.created_at)}
              </div>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4 space-y-1">
              <div className="text-xs uppercase tracking-wide text-slate-400">
                Last clicked
              </div>
              <div className="text-sm">
                {formatDate(link.last_clicked_at)}
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
