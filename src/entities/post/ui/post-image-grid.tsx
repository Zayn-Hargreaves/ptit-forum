import { cn } from '@shared/lib/utils';
import Image from 'next/image';

// Helper to render image with common props
const GridImage = ({ src, alt, className }: { src: string; alt: string; className?: string }) => (
  <div className={cn('relative h-full w-full overflow-hidden', className)}>
    <Image
      src={src}
      alt={alt}
      fill
      className="object-cover transition-transform duration-500 hover:scale-105"
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    />
  </div>
);

interface PostImageGridProps {
  images: string[];
}

export function PostImageGrid({ images }: PostImageGridProps) {
  if (!images || images.length === 0) return null;

  const count = images.length;

  return (
    <div
      className={cn(
        'border-border/40 mt-3 grid gap-1 overflow-hidden rounded-xl border',
        count === 1 && 'aspect-video grid-cols-1',
        count === 2 && 'aspect-[2/1] grid-cols-2',
        count === 3 && 'aspect-[2/1] grid-cols-2', // Special layout for 3
        count >= 4 && 'aspect-[1/1] grid-cols-2',
      )}
    >
      {/* Case 1: Single Image */}
      {count === 1 && <GridImage src={images[0]} alt="Post image" />}

      {/* Case 2: Two Images Split 50/50 */}
      {count === 2 &&
        images.map((img, i) => <GridImage key={i} src={img} alt={`Post image ${i + 1}`} />)}

      {/* Case 3: 1 Big Left, 2 Small Right */}
      {count === 3 && (
        <>
          <div className="row-span-2 h-full">
            <GridImage src={images[0]} alt="Post image 1" className="h-full" />
          </div>
          <div className="flex h-full flex-col gap-1">
            <div className="relative flex-1">
              <GridImage src={images[1]} alt="Post image 2" />
            </div>
            <div className="relative flex-1">
              <GridImage src={images[2]} alt="Post image 3" />
            </div>
          </div>
        </>
      )}

      {/* Case 4+: 2x2 Grid with Overlay on last */}
      {count >= 4 && (
        <>
          <GridImage src={images[0]} alt="Post image 1" />
          <GridImage src={images[1]} alt="Post image 2" />
          <GridImage src={images[2]} alt="Post image 3" />

          <div className="relative">
            <GridImage src={images[3]} alt="Post image 4" />
            {count > 4 && (
              <div className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black/50 text-xl font-bold text-white backdrop-blur-sm transition-colors hover:bg-black/60">
                +{count - 4}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
