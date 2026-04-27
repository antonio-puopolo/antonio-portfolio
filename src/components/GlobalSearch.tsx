import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { useProperties, primaryContact } from '@/lib/queries';
import { StageBadge } from './StageBadge';

export function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { data } = useProperties();

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return (data ?? []).slice(0, 8);
    return (data ?? [])
      .filter((p) => {
        const blob = `${p.address} ${p.suburb ?? ''} ${primaryContact(p)?.name ?? ''}`.toLowerCase();
        return blob.includes(q);
      })
      .slice(0, 12);
  }, [data, query]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null;
      const inField =
        target?.tagName === 'INPUT' ||
        target?.tagName === 'TEXTAREA' ||
        target?.isContentEditable;
      if (!open && !inField && (e.key === '/' || (e.key === 'k' && (e.metaKey || e.ctrlKey)))) {
        e.preventDefault();
        setOpen(true);
        return;
      }
      if (open && e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  useEffect(() => {
    if (open) {
      setQuery('');
      setActive(0);
      setTimeout(() => inputRef.current?.focus(), 10);
    }
  }, [open]);

  useEffect(() => setActive(0), [query]);

  function go(id: string) {
    navigate(`/property/${id}`);
    setOpen(false);
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && results[active]) {
      go(results[active].id);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-full border border-bone-deep px-3 py-1.5 text-xs text-ink-muted hover:bg-ink/5 w-full"
      >
        <Search className="h-3.5 w-3.5" />
        <span className="flex-1 text-left">Search</span>
        <kbd className="hidden md:inline rounded bg-bone-warm border border-bone-deep px-1.5 py-0.5 text-[10px] font-mono text-ink-muted">
          /
        </kbd>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center px-5 pt-20 md:pt-32">
          <button
            type="button"
            aria-label="Close search"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
          />
          <div className="relative w-full max-w-lg card overflow-hidden">
            <div className="flex items-center gap-3 px-4 py-3 border-b border-bone-deep">
              <Search className="h-4 w-4 text-ink-muted" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Search address, suburb, owner…"
                className="flex-1 bg-transparent outline-none text-[15px] placeholder:text-ink-muted/60"
              />
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full p-1 text-ink-muted hover:bg-ink/5"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <ul className="max-h-[60vh] overflow-y-auto py-2">
              {results.length === 0 && (
                <li className="px-4 py-6 text-sm text-ink-muted text-center">
                  No matches.
                </li>
              )}
              {results.map((p, i) => {
                const owner = primaryContact(p);
                return (
                  <li key={p.id}>
                    <button
                      type="button"
                      onMouseEnter={() => setActive(i)}
                      onClick={() => go(p.id)}
                      className={`w-full text-left px-4 py-2.5 flex items-center gap-3 ${
                        i === active ? 'bg-bone-warm' : 'hover:bg-bone-warm/60'
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-ink truncate">
                          {p.address}
                        </p>
                        <p className="text-xs text-ink-muted truncate">
                          {[p.suburb, owner?.name].filter(Boolean).join(' · ') || '—'}
                        </p>
                      </div>
                      <StageBadge stage={p.stage} />
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}
