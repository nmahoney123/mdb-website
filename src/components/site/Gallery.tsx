import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { Stagger, StaggerItem } from "./motion";

export type GalleryImage = { id?: number; url: string; caption?: string | null };

export default function Gallery({ images }: { images: GalleryImage[] }) {
  const [open, setOpen] = useState<number | null>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") setOpen((o) => (o === null ? null : (o + 1) % images.length));
      if (e.key === "ArrowLeft") setOpen((o) => (o === null ? null : (o - 1 + images.length) % images.length));
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, images.length]);

  if (images.length === 0) return null;

  return (
    <>
      <Stagger className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
        {images.map((img, i) => (
          <StaggerItem key={img.id ?? img.url}>
            <button
              onClick={() => setOpen(i)}
              className="group relative block aspect-[4/3] w-full overflow-hidden bg-charcoal"
              aria-label={img.caption ? `Enlarge: ${img.caption}` : "Enlarge photo"}
            >
              <img
                src={img.url}
                alt={img.caption ?? "Project photo"}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              {img.caption && (
                <p className="absolute inset-x-0 bottom-0 translate-y-2 p-4 text-left text-xs font-medium leading-snug text-white opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                  {img.caption}
                </p>
              )}
            </button>
          </StaggerItem>
        ))}
      </Stagger>

      <AnimatePresence>
        {open !== null && (
          <motion.div
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[120] flex items-center justify-center bg-ink/95 p-4 sm:p-10"
            onClick={() => setOpen(null)}
          >
            <button
              className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center border border-white/20 text-white hover:border-mahoney hover:bg-mahoney"
              onClick={() => setOpen(null)}
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
            <button
              className="absolute left-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center border border-white/20 text-white hover:border-mahoney hover:bg-mahoney sm:left-6"
              onClick={(e) => { e.stopPropagation(); setOpen((open - 1 + images.length) % images.length); }}
              aria-label="Previous photo"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              className="absolute right-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center border border-white/20 text-white hover:border-mahoney hover:bg-mahoney sm:right-6"
              onClick={(e) => { e.stopPropagation(); setOpen((open + 1) % images.length); }}
              aria-label="Next photo"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            <motion.figure
              key={open}
              initial={reduce ? false : { opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="max-h-full max-w-5xl"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={images[open].url}
                alt={images[open].caption ?? "Project photo"}
                decoding="async"
                className="max-h-[78vh] w-auto max-w-full object-contain"
              />
              {images[open].caption && (
                <figcaption className="mt-4 text-center text-sm text-white/70">
                  {images[open].caption}
                  <span className="ml-3 text-white/40">{open + 1} / {images.length}</span>
                </figcaption>
              )}
            </motion.figure>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
