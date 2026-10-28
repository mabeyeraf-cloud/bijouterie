"use client";

import { useEffect, useRef } from "react";

/** Vidéo de démonstration muette : lecture en boucle seulement quand elle est visible,
 *  jamais automatique si l'utilisateur a demandé moins d'animations. */
export default function DemoVideo({ src, poster, label }: { src: string; poster: string; label: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) video.play().catch(() => {});
      else video.pause();
    }, { threshold: 0.35 });
    io.observe(video);
    return () => io.disconnect();
  }, []);

  return (
    <figure className="demo-video">
      <video ref={ref} src={src} poster={poster} muted loop playsInline controls preload="metadata" aria-label={label} />
    </figure>
  );
}
