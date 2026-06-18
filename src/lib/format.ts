/** Pomocnicze: formatowanie daty (PL) i szacowanie czasu czytania. */

const fmt = new Intl.DateTimeFormat('pl-PL', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
});

export function formatDate(date: Date): string {
  return fmt.format(date);
}

export function isoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/** ~200 słów/min; zwraca liczbę minut (min. 1). */
export function readingTime(body: string | undefined, override?: number): number {
  if (override && override > 0) return override;
  const words = (body ?? '').trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}
