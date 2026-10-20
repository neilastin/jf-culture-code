import { MediaImage } from "./MediaImage";

/**
 * The horizontal "Culture CODE" running-head logo, built from the separate
 * "Culture" and "CODE" lettering so neither word carries a sliver of the other.
 */
export function Logo({ className }: { className?: string }) {
  return (
    <span className={className} role="img" aria-label="Culture Code">
      <span className="relative block aspect-[100/27] h-full">
        <MediaImage name="lettering/culture" alt="" className="absolute top-[11%] left-0 h-auto w-[57%]" sizes="130px" preload />
        <MediaImage name="lettering/code" alt="" className="absolute right-0 bottom-0 h-auto w-[45%]" sizes="110px" preload />
      </span>
    </span>
  );
}
