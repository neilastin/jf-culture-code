import type { ReactNode } from "react";
import type { BenefitIcon } from "@/content/site";

type IconProps = { className?: string };

export function TickIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="12" fill="var(--color-lime-field)" />
      <path d="M7 12.5l3.2 3.2L17 9" fill="none" stroke="var(--color-ink)" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function CrossIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="12" fill="var(--color-cross)" />
      <path d="M8.5 8.5l7 7m0-7l-7 7" fill="none" stroke="var(--color-ink)" strokeWidth="2.6" strokeLinecap="round" />
    </svg>
  );
}

export function ArrowIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path d="M5 12h13m-5-6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function CloseIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}

export function SearchIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <circle cx="10.5" cy="10.5" r="6.5" fill="none" stroke="currentColor" strokeWidth="2.2" />
      <path d="M15.5 15.5L20 20" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}

export function PlusIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
    </svg>
  );
}

const benefitPaths: Record<BenefitIcon, ReactNode> = {
  flex: (
    <>
      <rect x="6" y="14" width="22" height="15" rx="2" />
      <path d="M2 31h30M30 9l6 6-6 6M36 15H22" />
    </>
  ),
  sun: (
    <>
      <circle cx="20" cy="20" r="7" />
      <path d="M20 4v5M20 31v5M4 20h5M31 20h5M8.7 8.7l3.5 3.5M27.8 27.8l3.5 3.5M8.7 31.3l3.5-3.5M27.8 12.2l3.5-3.5" />
    </>
  ),
  friday: (
    <>
      <rect x="5" y="8" width="30" height="27" rx="3" />
      <path d="M5 16h30M12 4v8M28 4v8" />
      <path d="M15 22h10l-6 9" />
    </>
  ),
  support: (
    <>
      <circle cx="14" cy="13" r="5" />
      <circle cx="27" cy="15" r="4" />
      <path d="M4 33c0-6 4.5-10 10-10s10 4 10 10M22 24c1.5-1 3-1.5 5-1.5 4.5 0 8 3.5 8 9" />
    </>
  ),
  policy: (
    <>
      <path d="M10 4h15l7 7v25H10z" />
      <path d="M25 4v7h7M15 20h12M15 26h12M15 14h5" />
    </>
  ),
  health: (
    <>
      <path d="M20 35S5 26 5 15.5A7.5 7.5 0 0 1 20 11a7.5 7.5 0 0 1 15 4.5C35 26 20 35 20 35z" />
      <path d="M20 16v10M15 21h10" />
    </>
  ),
};

export function BenefitGlyph({ icon, className }: { icon: BenefitIcon; className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {benefitPaths[icon]}
    </svg>
  );
}

export function ChevronIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
