import * as React from 'react';
import { cn } from '@/lib/utils';

/**
 * Wrapped in a horizontally scrollable region so wide operational tables never
 * force the page body to scroll sideways on tablet and mobile. The wrapper is
 * focusable and labelled, which is required for keyboard users to reach a
 * scrollable region (WCAG 2.1.1).
 */
const Table = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement> & { caption?: string }
>(({ className, caption, children, ...props }, ref) => (
  <div
    className="relative w-full overflow-x-auto rounded-lg border border-border bg-card"
    tabIndex={0}
    role="region"
    aria-label={caption}
  >
    <table ref={ref} className={cn('w-full caption-bottom text-sm', className)} {...props}>
      {caption ? <caption className="sr-only">{caption}</caption> : null}
      {children}
    </table>
  </div>
));
Table.displayName = 'Table';

const TableHeader = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <thead ref={ref} className={cn('border-b border-border bg-muted/60', className)} {...props} />
  ),
);
TableHeader.displayName = 'TableHeader';

const TableBody = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <tbody ref={ref} className={cn('[&_tr:last-child]:border-0', className)} {...props} />
  ),
);
TableBody.displayName = 'TableBody';

const TableFooter = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <tfoot ref={ref} className={cn('border-t border-border bg-muted/60 font-medium', className)} {...props} />
  ),
);
TableFooter.displayName = 'TableFooter';

const TableRow = React.forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(
  ({ className, ...props }, ref) => (
    <tr
      ref={ref}
      className={cn(
        'border-b border-border transition-colors hover:bg-muted/40 data-[state=selected]:bg-primary-muted',
        className,
      )}
      {...props}
    />
  ),
);
TableRow.displayName = 'TableRow';

const TableHead = React.forwardRef<HTMLTableCellElement, React.ThHTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => (
    <th
      ref={ref}
      scope="col"
      className={cn(
        'h-11 px-4 text-left align-middle text-xs font-semibold uppercase tracking-wide text-muted-foreground',
        className,
      )}
      {...props}
    />
  ),
);
TableHead.displayName = 'TableHead';

const TableCell = React.forwardRef<HTMLTableCellElement, React.TdHTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => (
    <td ref={ref} className={cn('px-4 py-3 align-middle', className)} {...props} />
  ),
);
TableCell.displayName = 'TableCell';

export { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell };
