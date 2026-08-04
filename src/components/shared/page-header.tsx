import * as React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Crumb {
  label: string;
  to?: string;
}

interface PageHeaderProps {
  title: string;
  description?: React.ReactNode;
  /** Right-aligned actions; wraps beneath the title on small screens. */
  actions?: React.ReactNode;
  breadcrumbs?: Crumb[];
  className?: string;
}

/** Consistent title block for every dashboard page. */
export function PageHeader({ title, description, actions, breadcrumbs, className }: PageHeaderProps) {
  return (
    <div className={cn('space-y-3', className)}>
      {breadcrumbs?.length ? (
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
            {breadcrumbs.map((crumb, index) => (
              <li key={crumb.label} className="flex items-center gap-1">
                {index > 0 ? <ChevronRight className="size-3.5 shrink-0" aria-hidden="true" /> : null}
                {crumb.to ? (
                  <Link to={crumb.to} className="rounded-sm hover:text-primary hover:underline">
                    {crumb.label}
                  </Link>
                ) : (
                  <span aria-current="page" className="font-medium text-foreground">
                    {crumb.label}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </nav>
      ) : null}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 space-y-1.5">
          <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">{title}</h1>
          {description ? (
            <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">{description}</p>
          ) : null}
        </div>
        {actions ? <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div> : null}
      </div>
    </div>
  );
}

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: React.ReactNode;
  align?: 'left' | 'centre';
  className?: string;
  /** Renders the title as h3 inside pages that already have an h2 section. */
  as?: 'h2' | 'h3';
}

/** Marketing section heading with the small forest-green eyebrow label. */
export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'centre',
  className,
  as: Tag = 'h2',
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        'max-w-2xl space-y-3',
        align === 'centre' ? 'mx-auto text-center' : 'text-left',
        className,
      )}
    >
      {eyebrow ? (
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent-hover">{eyebrow}</p>
      ) : null}
      <Tag className="text-balance font-heading text-heading-lg font-bold text-foreground">{title}</Tag>
      {description ? (
        <p className="text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">{description}</p>
      ) : null}
    </div>
  );
}
