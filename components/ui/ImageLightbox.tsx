"use client";

import Image from "next/image";
import { X } from "lucide-react";
import { Dialog } from "radix-ui";

type Props = {
  src: string;
  alt?: string;
  title?: string;
  children: React.ReactNode;
};

const ImageLightbox = ({ src, alt = "", title, children }: Props) => {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/95" />
        <Dialog.Content className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4 outline-none">
          <Dialog.Title className="sr-only">Image preview</Dialog.Title>

          <Dialog.Close asChild>
            <button
              type="button"
              className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
              aria-label="Close image preview"
            >
              <X className="w-5 h-5" />
            </button>
          </Dialog.Close>

          <div className="relative w-full max-w-5xl h-[80vh]">
            <Image
              src={src}
              alt={alt || title || "Blog image"}
              fill
              className="object-contain"
              sizes="100vw"
            />
          </div>

          {(title || alt) && (
            <p className="mt-4 text-sm text-white/70 text-center max-w-2xl">
              {title || alt}
            </p>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default ImageLightbox;
