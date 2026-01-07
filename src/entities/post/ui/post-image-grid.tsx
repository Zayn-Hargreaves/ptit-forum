import Image from 'next/image';
import { cn } from '@shared/lib/utils';

// Helper to render image with common props
const GridImage = ({ src, alt, className }: { src: string; alt: string; className?: string }) => (
  <div className={cn("relative w-full h-full overflow-hidden", className)}>
    <Image
      src={src}
      alt={alt}
      fill
      className="object-cover hover:scale-105 transition-transform duration-500"
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
    <div className={cn(
      "grid gap-1 mt-3 rounded-xl overflow-hidden border border-border/40",
      count === 1 && "grid-cols-1 aspect-video",
      count === 2 && "grid-cols-2 aspect-[2/1]",
      count === 3 && "grid-cols-2 aspect-[2/1]", // Special layout for 3
      count >= 4 && "grid-cols-2 aspect-[1/1]"
    )}>
      {/* Case 1: Single Image */}
      {count === 1 && (
        <GridImage src={images[0]} alt="Post image" />
      )}

      {/* Case 2: Two Images Split 50/50 */}
      {count === 2 && images.map((img, i) => (
        <GridImage key={i} src={img} alt={`Post image ${i + 1}`} />
      ))}

      {/* Case 3: 1 Big Left, 2 Small Right */}
      {count === 3 && (
        <>
          <div className="row-span-2 h-full">
             <GridImage src={images[0]} alt="Post image 1" className="h-full" />
          </div>
          <div className="flex flex-col gap-1 h-full">
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
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-bold text-xl backdrop-blur-sm hover:bg-black/60 transition-colors cursor-pointer">
                   +{count - 4}
                </div>
             )}
          </div>
        </>
      )}
    </div>
  );
}
