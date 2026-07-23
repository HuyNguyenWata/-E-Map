import { useEffect, useRef } from "react";
import Hls from "hls.js";

interface Props {
  src: string;
  className?: string;
  style?: React.CSSProperties;
  autoPlay?: boolean;
  controls?: boolean;
  muted?: boolean;
}

function isHlsSource(src: string) {
  return src.endsWith(".m3u8");
}

function HlsVideo({ src, className, style, autoPlay = true, controls, muted = true }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src) return;

    // Trình duyệt không đáng tin cậy tự phát khi nguồn video được gắn bằng
    // JS (thay vì có sẵn trong markup ban đầu) — gọi play() tường minh thay
    // vì chỉ dựa vào thuộc tính autoplay. play() có thể bị từ chối nếu
    // trình duyệt chặn autoplay (kể cả khi muted), nên bỏ qua lỗi đó —
    // người dùng vẫn bấm nút play thủ công được nhờ có `controls`.
    const tryPlay = () => {
      if (autoPlay) video.play().catch(() => {});
    };

    if (!isHlsSource(src)) {
      video.src = src;
      video.addEventListener("loadedmetadata", tryPlay, { once: true });
      return () => video.removeEventListener("loadedmetadata", tryPlay);
    }

    // Safari phát HLS trực tiếp qua thẻ <video>, các trình duyệt khác cần hls.js
    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = src;
      video.addEventListener("loadedmetadata", tryPlay, { once: true });
      return () => video.removeEventListener("loadedmetadata", tryPlay);
    }

    if (Hls.isSupported()) {
      const hls = new Hls({ lowLatencyMode: true });
      hls.loadSource(src);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, tryPlay);
      hls.on(Hls.Events.ERROR, (_event, data) => {
        console.error("HLS error:", data.type, data.details, "fatal:", data.fatal);
      });

      return () => hls.destroy();
    }
  }, [src, autoPlay]);

  return (
    <video
      ref={videoRef}
      className={className}
      style={style}
      autoPlay={autoPlay}
      controls={controls}
      muted={muted}
      playsInline
    />
  );
}

export default HlsVideo;
