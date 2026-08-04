import * as React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatDateLong } from '@/utils/format';
import { cn } from '@/lib/utils';
import type { Delivery, DeliveryStatus } from '@/types';

/**
 * A single-month calendar grid that marks the days carrying a delivery.
 *
 * Built with plain date arithmetic rather than a picker library so the visual
 * behaviour (Monday-start weeks, status-coloured markers, keyboard-reachable
 * cells) is fully under our control for the demonstration.
 */

const statusDotClass: Record<DeliveryStatus, string> = {
  draft: 'bg-border-strong',
  scheduled: 'bg-information',
  confirmed: 'bg-primary',
  preparing: 'bg-oak',
  dispatched: 'bg-warning-solid',
  delivered: 'bg-success',
  delayed: 'bg-destructive',
};

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function monthMatrix(year: number, month: number): (Date | null)[][] {
  const first = new Date(Date.UTC(year, month, 1));
  const startOffset = (first.getUTCDay() + 6) % 7; // Monday = 0
  const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();

  const cells: (Date | null)[] = [];
  for (let i = 0; i < startOffset; i += 1) cells.push(null);
  for (let day = 1; day <= daysInMonth; day += 1) cells.push(new Date(Date.UTC(year, month, day)));
  while (cells.length % 7 !== 0) cells.push(null);

  const weeks: (Date | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return weeks;
}

function toIso(date: Date): string {
  return date.toISOString().slice(0, 10);
}

interface SeasonCalendarProps {
  deliveries: Delivery[];
  /** Link builder for a day carrying a delivery; falls back to a non-link cell. */
  hrefFor?: (delivery: Delivery) => string;
  /** Alternative to `hrefFor` — renders a button and calls back on click. */
  onSelect?: (delivery: Delivery) => void;
  className?: string;
}

export function SeasonCalendar({ deliveries, hrefFor, onSelect, className }: SeasonCalendarProps) {
  const byDate = React.useMemo(() => {
    const map = new Map<string, Delivery[]>();
    for (const delivery of deliveries) {
      const list = map.get(delivery.scheduledDate) ?? [];
      list.push(delivery);
      map.set(delivery.scheduledDate, list);
    }
    return map;
  }, [deliveries]);

  const initial = deliveries[0]?.scheduledDate ?? toIso(new Date());
  const [y, m] = initial.split('-').map(Number);
  const [cursor, setCursor] = React.useState({ year: y!, month: m! - 1 });

  const weeks = monthMatrix(cursor.year, cursor.month);
  const monthLabel = new Intl.DateTimeFormat('en-GB', { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(
    new Date(Date.UTC(cursor.year, cursor.month, 1)),
  );

  const shiftMonth = (delta: number) => {
    setCursor((current) => {
      const next = current.month + delta;
      if (next < 0) return { year: current.year - 1, month: 11 };
      if (next > 11) return { year: current.year + 1, month: 0 };
      return { year: current.year, month: next };
    });
  };

  return (
    <div className={cn('rounded-xl border border-border bg-card p-4 sm:p-6', className)}>
      <div className="flex items-center justify-between gap-3">
        <p className="font-heading text-base font-semibold text-foreground">{monthLabel}</p>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={() => shiftMonth(-1)} aria-label="Previous month">
            <ChevronLeft aria-hidden="true" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => shiftMonth(1)} aria-label="Next month">
            <ChevronRight aria-hidden="true" />
          </Button>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-7 gap-1 text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {WEEKDAYS.map((day) => (
          <span key={day}>{day}</span>
        ))}
      </div>

      <div className="mt-1 grid grid-cols-7 gap-1">
        {weeks.flatMap((week, weekIndex) =>
          week.map((date, dayIndex) => {
            const key = `${weekIndex}-${dayIndex}`;
            if (!date) return <div key={key} aria-hidden="true" />;
            const iso = toIso(date);
            const dayDeliveries = byDate.get(iso) ?? [];
            const primary = dayDeliveries[0];
            const cellContent = (
              <>
                <span className="tabular text-sm">{date.getUTCDate()}</span>
                {dayDeliveries.length ? (
                  <span className="mt-1 flex gap-0.5" aria-hidden="true">
                    {dayDeliveries.map((delivery) => (
                      <span key={delivery.id} className={cn('size-1.5 rounded-full', statusDotClass[delivery.status])} />
                    ))}
                  </span>
                ) : null}
              </>
            );

            if (primary) {
              const label = `${formatDateLong(iso)} — delivery ${primary.sequence} of 8, ${primary.status}`;
              const cellClass =
                'flex aspect-square flex-col items-center justify-center rounded-lg border border-primary/30 bg-primary-muted text-foreground transition-colors hover:border-primary hover:bg-primary/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2';

              if (hrefFor) {
                return (
                  <Link key={key} to={hrefFor(primary)} aria-label={label} className={cellClass}>
                    {cellContent}
                  </Link>
                );
              }
              if (onSelect) {
                return (
                  <button key={key} type="button" onClick={() => onSelect(primary)} aria-label={label} className={cellClass}>
                    {cellContent}
                  </button>
                );
              }
              return (
                <div
                  key={key}
                  aria-label={label}
                  className="flex aspect-square flex-col items-center justify-center rounded-lg border border-primary/30 bg-primary-muted text-foreground"
                >
                  {cellContent}
                </div>
              );
            }

            return (
              <div
                key={key}
                className="flex aspect-square flex-col items-center justify-center rounded-lg text-muted-foreground/70"
              >
                {cellContent}
              </div>
            );
          }),
        )}
      </div>

      <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 border-t border-border pt-4 text-xs text-muted-foreground">
        {(Object.keys(statusDotClass) as DeliveryStatus[]).map((status) => (
          <span key={status} className="flex items-center gap-1.5 capitalize">
            <span className={cn('size-2 rounded-full', statusDotClass[status])} aria-hidden="true" />
            {status}
          </span>
        ))}
      </div>
    </div>
  );
}
