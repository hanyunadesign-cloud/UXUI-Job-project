"use client";

import { useEffect, useRef, useState } from "react";

export function CompanyLogo({
  src,
  alt,
  initial,
  size = 48,
}: {
  src: string | null;
  alt: string;
  initial: string;
  size?: number;
}) {
  const [errored, setErrored] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    // SSR로 내려간 <img>가 하이드레이션(onError 리스너 부착) 전에 이미 로드 실패했을 수 있다.
    // 그 경우 브라우저가 이미 error 이벤트를 흘려보낸 뒤라 onError가 다시 불리지 않으므로,
    // 마운트 시점에 naturalWidth로 이미 깨진 상태인지 직접 확인해 폴백으로 전환한다.
    const img = imgRef.current;
    if (img && img.complete && img.naturalWidth === 0) {
      setErrored(true);
    }
  }, [src]);

  if (!src || errored) {
    return (
      <div
        className="flex shrink-0 items-center justify-center rounded-full bg-neutral-100 font-semibold text-neutral-500"
        style={{ width: size, height: size, fontSize: size * 0.35 }}
      >
        {initial}
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      ref={imgRef}
      src={src}
      alt={alt}
      onError={() => setErrored(true)}
      className="shrink-0 rounded-full bg-neutral-100 object-cover"
      style={{ width: size, height: size }}
    />
  );
}
