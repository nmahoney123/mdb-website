import ImageSlot from "./ImageSlot";
import { cn } from "@/lib/utils";

/**
 * Renders a real CMS image when a URL exists, otherwise the labeled
 * placeholder slot describing the shot that belongs there.
 */
export default function CmsImage({
  url,
  shot,
  alt,
  className,
  dark = true,
  label,
  loading = "lazy",
}: {
  url: string | null | undefined;
  shot: string;
  alt?: string;
  className?: string;
  dark?: boolean;
  label?: string;
  loading?: "lazy" | "eager";
}) {
  if (url) {
    return (
      <img
        src={url}
        alt={alt ?? shot}
        loading={loading}
        className={cn("h-full w-full object-cover", className)}
      />
    );
  }
  return <ImageSlot shot={shot} dark={dark} label={label} className={className} />;
}
