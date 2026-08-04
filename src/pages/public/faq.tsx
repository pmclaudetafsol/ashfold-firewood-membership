import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Search, MessageCircleQuestion } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/misc';
import { EmptyState } from '@/components/ui/states';
import { faqs, faqCategories } from '@/data/marketing';
import { cn } from '@/lib/utils';

/** Turns "Rescheduling and cancellation" into "rescheduling-and-cancellation". */
function slugify(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export default function FaqPage() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return faqs.filter((faq) => {
      const matchesCategory = category === null || faq.category === category;
      const matchesQuery =
        needle === '' ||
        faq.question.toLowerCase().includes(needle) ||
        faq.answer.toLowerCase().includes(needle);
      return matchesCategory && matchesQuery;
    });
  }, [query, category]);

  const grouped = useMemo(() => {
    return faqCategories
      .map((name) => ({ name, items: filtered.filter((faq) => faq.category === name) }))
      .filter((group) => group.items.length > 0);
  }, [filtered]);

  return (
    <>
      <section className="border-b border-border bg-oak-muted/60">
        <div className="container py-14 sm:py-20">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="primary">Help centre</Badge>
            <h1 className="mt-4 text-balance font-heading text-display font-bold text-foreground">
              Frequently asked questions
            </h1>
            <p className="mt-5 text-pretty text-lg leading-relaxed text-muted-foreground">
              Billing, deliveries, coverage, quantities, rescheduling, cancellation and referral rewards — all
              answered here.
            </p>

            <div className="mx-auto mt-8 max-w-md">
              <Label htmlFor="faq-search" className="sr-only">
                Search the questions
              </Label>
              <div className="relative">
                <Search
                  className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden="true"
                />
                <Input
                  id="faq-search"
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search for a question…"
                  className="h-12 pl-10"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="grid gap-10 lg:grid-cols-[16rem_1fr]">
            {/* Category filter */}
            <nav aria-label="Question categories" className="lg:sticky lg:top-28 lg:self-start">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground">
                Categories
              </p>
              <ul className="flex flex-wrap gap-2 lg:flex-col">
                <li>
                  <button
                    type="button"
                    onClick={() => setCategory(null)}
                    aria-pressed={category === null}
                    className={cn(
                      'w-full rounded-md px-3 py-2 text-left text-sm font-medium transition-colors',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                      category === null
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:bg-muted hover:text-primary',
                    )}
                  >
                    All questions
                  </button>
                </li>
                {faqCategories.map((name) => (
                  <li key={name}>
                    <button
                      type="button"
                      onClick={() => setCategory(name)}
                      aria-pressed={category === name}
                      className={cn(
                        'w-full rounded-md px-3 py-2 text-left text-sm font-medium transition-colors',
                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                        category === name
                          ? 'bg-primary text-primary-foreground'
                          : 'text-muted-foreground hover:bg-muted hover:text-primary',
                      )}
                    >
                      {name}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="min-w-0">
              {grouped.length === 0 ? (
                <EmptyState
                  icon={MessageCircleQuestion}
                  title="No questions match that search"
                  description="Try a different word, or contact us and we will answer it directly."
                  action={
                    <Button asChild variant="outline" size="sm">
                      <Link to="/contact">Contact us</Link>
                    </Button>
                  }
                />
              ) : (
                <div className="space-y-10">
                  {grouped.map((group) => (
                    <section key={group.name} id={slugify(group.name)} className="scroll-mt-28">
                      <h2 className="font-heading text-xl font-bold text-foreground">{group.name}</h2>
                      <Accordion type="single" collapsible className="mt-3 w-full">
                        {group.items.map((faq) => (
                          <AccordionItem key={faq.id} value={faq.id}>
                            <AccordionTrigger>{faq.question}</AccordionTrigger>
                            <AccordionContent>{faq.answer}</AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </section>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="section bg-card">
        <div className="container">
          <div className="mx-auto max-w-2xl rounded-2xl border border-border bg-background p-8 text-center shadow-card sm:p-10">
            <h2 className="text-balance font-heading text-heading font-bold text-foreground">
              Still not sure about something?
            </h2>
            <p className="mt-3 text-muted-foreground">
              Our team answers within one working day, and can change your schedule on the call.
            </p>
            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
              <Button asChild variant="primary">
                <Link to="/contact">Contact us</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/join">
                  Join membership
                  <ArrowRight aria-hidden="true" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
