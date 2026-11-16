import { useState, useEffect, useRef } from "react";
import API from "../../api";
import AppIcon from "./AppIcon";

export default function ScanImage({ scanId, alt = "Skin scan", className, style }) {
  const [src, setSrc] = useState("");
  const [status, setStatus] = useState("loading");
  const [shouldLoad, setShouldLoad] = useState(false);
  const imageRef = useRef(null);

  useEffect(() => {
    const node = imageRef.current;
    if (!node) return undefined;
    if (!("IntersectionObserver" in window)) {
      setShouldLoad(true);
      return undefined;
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setShouldLoad(true);
        observer.disconnect();
      }
    }, { rootMargin: "120px" });
    observer.observe(node);
    return () => observer.disconnect();
  }, [scanId]);

  useEffect(() => {
    if (!scanId || !shouldLoad) return undefined;
    let url;
    let cancelled = false;

    API.get(`/scans/${scanId}/image`, { responseType: "blob" })
      .then((res) => {
        if (cancelled) return;
        url = URL.createObjectURL(res.data);
        setSrc(url);
        setStatus("ok");
      })
      .catch((err) => {
        if (cancelled) return;
        setStatus(err.response?.status === 410 ? "deleted" : "error");
      });

    return () => {
      cancelled = true;
      if (url) URL.revokeObjectURL(url);
    };
  }, [scanId, shouldLoad]);

  const box = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.25rem",
    background: "var(--bg)",
    border: "1px dashed var(--border)",
    borderRadius: 8,
    color: "var(--text3)",
    fontSize: "0.72rem",
    textAlign: "center",
    padding: "0.5rem",
    ...style,
  };

  if (status === "loading") {
    return <div ref={imageRef} className={className} style={box}><AppIcon name="clock" /></div>;
  }

  if (status === "deleted") {
    return (
      <div ref={imageRef} className={className} style={box}>
        <span style={{ fontSize: "1.2rem" }}><AppIcon name="trash" /></span>
        <span>Image deleted<br />by patient</span>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className={className} style={box}>
        <span style={{ fontSize: "1.2rem" }}><AppIcon name="alert" /></span>
        <span>Unavailable</span>
      </div>
    );
  }

  return <img src={src} alt={alt} className={className} style={style} />;
}
