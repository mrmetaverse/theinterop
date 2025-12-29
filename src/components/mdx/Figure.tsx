import Image from 'next/image';

interface FigureProps {
  src: string;
  alt: string;
  caption?: string;
  width?: number;
  height?: number;
  priority?: boolean;
}

export default function Figure({
  src,
  alt,
  caption,
  width = 800,
  height = 450,
  priority = false,
}: FigureProps) {
  // Handle both local and external images
  const isExternal = src.startsWith('http://') || src.startsWith('https://');

  return (
    <figure className="my-8">
      <div className="relative overflow-hidden rounded-xl shadow-neu">
        {isExternal ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            alt={alt}
            className="w-full h-auto"
            loading={priority ? 'eager' : 'lazy'}
          />
        ) : (
          <Image
            src={src}
            alt={alt}
            width={width}
            height={height}
            className="w-full h-auto"
            priority={priority}
          />
        )}
      </div>
      {caption && (
        <figcaption className="mt-3 text-center text-sm text-foreground-muted italic">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

