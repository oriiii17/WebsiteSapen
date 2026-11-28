"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

type WayangPhoto = { src: string; alt: string; width: number; height: number };
type GalleryLabels = { open: string; label: string; close: string; previous: string; next: string };

export function WayangGallery({ photos, labels }: { photos: WayangPhoto[]; labels: GalleryLabels }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const dialogRef = useRef<HTMLElement | null>(null);
  const touchStartX = useRef<number | null>(null);
  const isOpen = activeIndex !== null;

  const closeLightbox = useCallback(() => {
    setActiveIndex(null);
    window.requestAnimationFrame(() => triggerRef.current?.focus());
  }, []);

  const openLightbox = (index: number, trigger: HTMLButtonElement) => {
    triggerRef.current = trigger;
    setActiveIndex(index);
  };

  const showPrevious = useCallback(() => {
    setActiveIndex((current) => current === null ? current : (current - 1 + photos.length) % photos.length);
  }, [photos.length]);

  const showNext = useCallback(() => {
    setActiveIndex((current) => current === null ? current : (current + 1) % photos.length);
  }, [photos.length]);

  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeLightbox();
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        showPrevious();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        showNext();
      } else if (event.key === "Tab" && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll<HTMLElement>("button:not([disabled])");
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, closeLightbox, showNext, showPrevious]);

  const activePhoto = activeIndex === null ? null : photos[activeIndex];

  return (
    <>
      <div className="wayang-gallery__grid">
        {photos.map((photo, index) => (
          <button
            className="wayang-gallery__photo"
            key={photo.src}
            type="button"
            aria-label={`${photo.alt} · ${labels.open}`}
            onClick={(event) => openLightbox(index, event.currentTarget)}
          >
            <Image src={photo.src} alt={photo.alt} width={photo.width} height={photo.height} sizes="(max-width: 760px) 46vw, (max-width: 1100px) 45vw, 23vw" />
          </button>
        ))}
      </div>

      {activePhoto && (
        <div className="wayang-lightbox" onMouseDown={(event) => { if (event.target === event.currentTarget) closeLightbox(); }}>
          <section ref={dialogRef} className="wayang-lightbox__dialog" role="dialog" aria-modal="true" aria-label={labels.label}>
            <button ref={closeButtonRef} className="wayang-lightbox__close" type="button" aria-label={labels.close} onClick={closeLightbox}><X aria-hidden="true" size={23} /></button>
            {photos.length > 1 && <button className="wayang-lightbox__arrow wayang-lightbox__arrow--previous" type="button" aria-label={labels.previous} onClick={showPrevious}><ChevronLeft aria-hidden="true" size={27} /></button>}
            <div
              className="wayang-lightbox__viewer"
              onTouchStart={(event) => { touchStartX.current = event.touches[0]?.clientX ?? null; }}
              onTouchEnd={(event) => {
                const start = touchStartX.current;
                const end = event.changedTouches[0]?.clientX;
                touchStartX.current = null;
                if (start !== null && end !== undefined && Math.abs(end - start) > 48) end < start ? showNext() : showPrevious();
              }}
            >
              <Image className="wayang-lightbox__image" src={activePhoto.src} alt={activePhoto.alt} width={activePhoto.width} height={activePhoto.height} sizes="90vw" priority />
            </div>
            {photos.length > 1 && <button className="wayang-lightbox__arrow wayang-lightbox__arrow--next" type="button" aria-label={labels.next} onClick={showNext}><ChevronRight aria-hidden="true" size={27} /></button>}
          </section>
        </div>
      )}
    </>
  );
}
