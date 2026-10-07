import { MediaImage } from "./MediaImage";

/**
 * The horizontal "Culture CODE" running-head logo, rebuilt from its two
 * print layers (positions taken from the PDF so they overlap exactly).
 */
export function Logo({ className }: { className?: string }) {
  return (
    <span className={className} role="img" aria-label="Culture Code">
      <span className="relative block aspect-[140/38] h-full">
        <MediaImage
          name="brand/logo-culture"
          alt=""
          className="absolute top-0 left-0 h-[89%] w-[56.4%]"
          sizes="120px"
          preload
        />
        <MediaImage
          name="brand/logo-code"
          alt=""
          className="absolute right-0 bottom-0 h-[97%] w-[49.3%]"
          sizes="110px"
          preload
        />
      </span>
    </span>
  );
}
