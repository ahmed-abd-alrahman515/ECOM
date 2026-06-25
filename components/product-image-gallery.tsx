'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { Expand, ZoomIn } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { useIsMobile } from '@/components/ui/use-mobile';
import { cn } from '@/lib/utils';

interface ProductImageGalleryProps {
  name: string;
  mainImageUrl?: string;
  detailImageUrls?: string[];
}

function getUniqueImages(mainImageUrl?: string, detailImageUrls: string[] = []) {
  return Array.from(
    new Set([mainImageUrl, ...detailImageUrls].filter((image): image is string => Boolean(image))),
  );
}

export function ProductImageGallery({
  name,
  mainImageUrl,
  detailImageUrls = [],
}: ProductImageGalleryProps) {
  const isMobile = useIsMobile();
  const galleryImages = useMemo(
    () => getUniqueImages(mainImageUrl, detailImageUrls),
    [detailImageUrls, mainImageUrl],
  );
  const [selectedImage, setSelectedImage] = useState(galleryImages[0] ?? '');
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomOrigin, setZoomOrigin] = useState('50% 50%');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const zoomFrameRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    setSelectedImage((currentImage) => (
      currentImage && galleryImages.includes(currentImage)
        ? currentImage
        : (galleryImages[0] ?? '')
    ));
  }, [galleryImages]);

  const handleMouseMove = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (isMobile || !zoomFrameRef.current) {
      return;
    }

    const bounds = zoomFrameRef.current.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width) * 100;
    const y = ((event.clientY - bounds.top) / bounds.height) * 100;

    setZoomOrigin(`${Math.min(100, Math.max(0, x))}% ${Math.min(100, Math.max(0, y))}%`);
    setIsZoomed(true);
  };

  const handleMouseLeave = () => {
    setIsZoomed(false);
    setZoomOrigin('50% 50%');
  };

  if (galleryImages.length === 0) {
    return (
      <div className="space-y-4">
        <div className="relative aspect-square overflow-hidden rounded-[2.5rem] border border-border/60 bg-secondary/60 shadow-2xl" />
      </div>
    );
  }

  return (
    <>
      <div className="space-y-5">
        <button
          type="button"
          ref={zoomFrameRef}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => {
            if (!isMobile) {
              setIsZoomed(true);
            }
          }}
          onMouseLeave={handleMouseLeave}
          onClick={() => {
            if (isMobile) {
              setIsModalOpen(true);
            }
          }}
          className="group relative block aspect-square w-full overflow-hidden rounded-[2.5rem] border border-border/60 bg-card text-left shadow-2xl outline-none transition-transform duration-300 hover:-translate-y-1 focus-visible:ring-2 focus-visible:ring-primary/40"
          aria-label={isMobile ? `Open ${name} image preview` : `${name} image gallery preview`}
        >
          <Image
            src={selectedImage}
            alt={name}
            fill
            priority
            className={cn(
              'object-cover transition-transform duration-300 ease-out will-change-transform',
              isZoomed && !isMobile ? 'scale-[2]' : 'scale-100',
            )}
            style={{
              transformOrigin: zoomOrigin,
            }}
            sizes="(min-width: 1024px) 50vw, 100vw"
          />

          <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black/55 via-black/15 to-transparent px-5 py-4 text-white opacity-100 transition-opacity duration-300 md:opacity-0 md:group-hover:opacity-100">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] backdrop-blur">
              {isMobile ? <Expand size={14} /> : <ZoomIn size={14} />}
              {isMobile ? 'Tap to view' : 'Hover to zoom'}
            </span>
          </div>
        </button>

        <div className="grid grid-cols-4 gap-3 sm:grid-cols-5">
          {galleryImages.map((image, index) => {
            const isSelected = image === selectedImage;

            return (
              <button
                key={`${image}-${index}`}
                type="button"
                onClick={() => setSelectedImage(image)}
                className={cn(
                  'group/thumb relative aspect-square overflow-hidden rounded-2xl border bg-card shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40',
                  isSelected
                    ? 'border-primary ring-2 ring-primary/15'
                    : 'border-border/60 hover:border-primary/50',
                )}
                aria-label={`Select product image ${index + 1}`}
                aria-pressed={isSelected}
              >
                <Image
                  src={image}
                  alt={`${name} thumbnail ${index + 1}`}
                  fill
                  className={cn(
                    'object-cover transition-transform duration-300 group-hover/thumb:scale-105',
                    isSelected ? 'scale-95' : 'scale-100',
                  )}
                  sizes="120px"
                />
                <span
                  className={cn(
                    'absolute inset-0 rounded-2xl border-2 transition-colors duration-300',
                    isSelected ? 'border-primary' : 'border-transparent group-hover/thumb:border-primary/30',
                  )}
                />
              </button>
            );
          })}
        </div>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-[min(92vw,44rem)] overflow-hidden rounded-[2rem] border-border/60 bg-background p-3 sm:p-4">
          <DialogTitle className="sr-only">{name} image preview</DialogTitle>
          <div className="space-y-3">
            <div className="relative aspect-square overflow-hidden rounded-[1.5rem] bg-secondary/40">
              <Image
                src={selectedImage}
                alt={name}
                fill
                className="object-contain"
                sizes="90vw"
              />
            </div>

            <div className="grid grid-cols-4 gap-2">
              {galleryImages.map((image, index) => {
                const isSelected = image === selectedImage;

                return (
                  <button
                    key={`modal-${image}-${index}`}
                    type="button"
                    onClick={() => setSelectedImage(image)}
                    className={cn(
                      'relative aspect-square overflow-hidden rounded-xl border transition-all duration-300',
                      isSelected ? 'border-primary ring-2 ring-primary/20' : 'border-border/60',
                    )}
                    aria-label={`Select product image ${index + 1} in preview`}
                  >
                    <Image
                      src={image}
                      alt={`${name} preview ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  </button>
                );
              })}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
