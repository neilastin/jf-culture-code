import Image from "next/image";
import type { Story } from "@/content/types";
import { cn } from "@/lib/cn";

/** Story photos may be local files or images people upload (data URLs, which next/image serves as-is), so they fill a sized box. */
export function StoryImage({ image, className, sizes }: { image: NonNullable<Story["image"]>; className?: string; sizes: string }) {
  return (
    <div className={cn("relative overflow-hidden", className)}>
      <Image
        src={image.src}
        alt={image.alt}
        fill
        sizes={sizes}
        className="object-cover"
      />
    </div>
  );
}
