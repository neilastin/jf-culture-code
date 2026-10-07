import type { ReactNode } from "react";

/** One part of the Code. Its id drives the nav progress and in-page links. */
export function Part({ id, children, className }: { id: string; children: ReactNode; className?: string }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className={className}>
      {children}
    </section>
  );
}
