import Image, { type ImageProps } from "next/image";
import { media, type MediaKey } from "@/content/media";

type Props = Omit<ImageProps, "src" | "width" | "height" | "alt"> & {
  name: MediaKey;
  /** Empty string marks the image as decorative. */
  alt: string;
};

/** next/image with intrinsic sizes looked up from the generated media manifest. */
export function MediaImage({ name, alt, fill, ...rest }: Props) {
  const asset = media[name];
  return fill ? (
    <Image src={asset.src} alt={alt} fill {...rest} />
  ) : (
    <Image src={asset.src} width={asset.width} height={asset.height} alt={alt} {...rest} />
  );
}
