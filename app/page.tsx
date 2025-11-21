'use client';

import { useEffect, useMemo, useState } from 'react';
import type { Link } from '@/app/types/link';

type Status = 'idle' | 'loading' | 'success' | 'error';

export default function DashboardPage() {
  const [links, setLinks] = useState<Link[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [url, setUrl] = useState('');
  const [code, setCode] = useState('');
  const [formStatus, setFormStatus] = useState<Status>('idle');
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  // Search filter
  const [search, setSearch] = useState('');

  const baseUrl =
    typeof window !== 'undefined'
      ? window.location.origin
      : process.env.NEXT_PUBLIC_BASE_URL ?? '';

  async function fetchLinks() {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/links');
      if (!res.ok) {
        throw new Error('Failed to fetch links');
      }
      const data = await res.json();
      setLinks(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to load links');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchLinks();
  }, []);

  const filteredLinks = useMemo(() => {
    if (!search.trim()) return links;
    const s = search.toLowerCase();
    return links.filter(
      (link) =>
        link.code.toLowerCase().includes(s) ||
        link.url.toLowerCase().includes(s)
    );
  }, [links, search]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setFormStatus('loading');
    setFormError(null);
    setFormSuccess(null);

    if (!url.trim()) {
      setFormStatus('error');
      setFormError('URL is required');
      return;
    }

    try {
      const res = await fetch('/api/links', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: url.trim(),
          code: code.trim() || undefined,
        }),
      });

      if (res.status === 409) {
        const body = await res.json();
        setFormStatus('error');
        setFormError(body.error || 'Code already exists');
        return;
      }

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setFormStatus('error');
        setFormError(body.error || 'Failed to create link');
        return;
      }

      const newLink: Link = await res.json();
      setLinks((prev) => [newLink, ...prev]);
      setUrl('');
      setCode('');
      setFormStatus('success');
      setFormSuccess('Short link created!');
    } catch (err: any) {
      setFormStatus('error');
      setFormError(err.message || 'Failed to create link');
    }
  }

  async function handleDelete(code: string) {
    if (!confirm(`Delete link "${code}"?`)) return;

    try {
      const res = await fetch(`/api/links/${code}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        alert(body.error || 'Failed to delete link');
        return;
      }

      setLinks((prev) => prev.filter((l) => l.code !== code));
    } catch (err: any) {
      alert(err.message || 'Failed to delete link');
    }
  }

  async function handleCopy(shortUrl: string) {
    try {
      await navigator.clipboard.writeText(shortUrl);
      alert('Copied to clipboard!');
    } catch {
      alert('Failed to copy');
    }
  }

  function formatDate(value: string | null) {
    if (!value) return '—';
    const date = new Date(value);
    return date.toLocaleString();
  }

  return (
    <div className="space-y-6">
      <section className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight">
          Dashboard
        </h2>
        <p className="text-sm text-slate-400">
          Create and manage your short links. Each redirect increments click
          count and updates the last clicked time.
        </p>
      </section>

      {/* Create form */}
      <section className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 sm:p-5 space-y-4">
        <h3 className="text-lg font-medium">Create short link</h3>
        <form
          onSubmit={handleCreate}
          className="space-y-3"
          noValidate
        >
          <div className="space-y-1">
            <label className="text-sm font-medium">
              Target URL <span className="text-red-400">*</span>
            </label>
            <input
              type="url"
              placeholder="https://example.com/docs"
              className="w-full rounded-lg border border-slate-700 bg-slate-950/70 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            <p className="text-xs text-slate-400">
              Must be a valid URL. We’ll prepend https:// if you omit it.
            </p>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">
              Custom code (optional)
            </label>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">
                {baseUrl}/
              </span>
              <input
                type="text"
                placeholder="mydocs"
                className="flex-1 rounded-lg border border-slate-700 bg-slate-950/70 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
            </div>
            <p className="text-xs text-slate-400">
              Codes must match <code>[A-Za-z0-9]&#123;6,8&#125;</code>. Leave
              empty to auto-generate.
            </p>
          </div>

          {formError && (
            <div className="text-sm text-red-400">{formError}</div>
          )}
          {formSuccess && (
            <div className="text-sm text-emerald-400">
              {formSuccess}
            </div>
          )}

          <button
            type="submit"
            disabled={formStatus === 'loading'}
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium hover:bg-blue-500 disabled:opacity-60 disabled:cursor-not-allowed transition"
          >
            {formStatus === 'loading' ? 'Creating…' : 'Create link'}
          </button>
        </form>
      </section>

      {/* Search + table */}
      <section className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <h3 className="text-lg font-medium">Links</h3>
          <input
            type="text"
            placeholder="Search by code or URL…"
            className="w-full sm:max-w-xs rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-sm text-slate-400">
            Loading links…
          </div>
        ) : error ? (
          <div className="rounded-xl border border-red-800 bg-red-950/60 p-4 text-sm text-red-200">
            Error: {error}
          </div>
        ) : filteredLinks.length === 0 ? (
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-sm text-slate-400">
            No links yet. Create one above to get started.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/60">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-900/80 text-slate-400">
                <tr>
                  <th className="px-3 py-2 text-left font-medium">
                    Short code
                  </th>
                  <th className="px-3 py-2 text-left font-medium">
                    Target URL
                  </th>
                  <th className="px-3 py-2 text-right font-medium">
                    Clicks
                  </th>
                  <th className="px-3 py-2 text-left font-medium">
                    Last clicked
                  </th>
                  <th className="px-3 py-2 text-right font-medium">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredLinks.map((link) => {
                  const shortUrl = `${baseUrl}/${link.code}`;
                  return (
                    <tr
                      key={link.id}
                      className="border-t border-slate-800 hover:bg-slate-800/40"
                    >
                      <td className="px-3 py-2 align-middle">
                        <div className="flex flex-col">
                          <a
                            href={`/code/${link.code}`}
                            className="font-mono text-xs text-blue-400 hover:underline"
                          >
                            {link.code}
                          </a>
                          <button
                            type="button"
                            onClick={() => handleCopy(shortUrl)}
                            className="mt-1 inline-flex w-max text-[11px] text-slate-400 hover:text-slate-200"
                          >
                            Copy
                          </button>
                        </div>
                      </td>
                      <td className="px-3 py-2 align-middle max-w-xs">
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noreferrer"
                          className="block truncate text-xs text-slate-200 hover:text-blue-400"
                          title={link.url}
                        >
                          {link.url}
                        </a>
                      </td>
                      <td className="px-3 py-2 text-right align-middle font-mono">
                        {link.click_count}
                      </td>
                      <td className="px-3 py-2 align-middle text-xs text-slate-300">
                        {formatDate(link.last_clicked_at)}
                      </td>
                      <td className="px-3 py-2 text-right align-middle">
                        <div className="flex justify-end gap-2">
                          <a
                            href={`/code/${link.code}`}
                            className="rounded-md border border-slate-700 px-2 py-1 text-[11px] hover:bg-slate-800"
                          >
                            Stats
                          </a>
                          <button
                            type="button"
                            onClick={() => handleDelete(link.code)}
                            className="rounded-md border border-red-700 px-2 py-1 text-[11px] text-red-300 hover:bg-red-900/40"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
