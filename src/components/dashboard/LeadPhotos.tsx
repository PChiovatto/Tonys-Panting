import { useEffect, useState } from "react";
import { Download, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface PhotoRow {
  id: string;
  file_path: string;
  file_name: string | null;
  file_type: string | null;
  file_size: number | null;
}

interface SignedPhoto extends PhotoRow {
  url: string;
}

interface Props {
  leadId: string;
}

const BUCKET = "project-photos";
const SIGNED_URL_TTL = 60 * 60; // 1 hour

const LeadPhotos = ({ leadId }: Props) => {
  const [photos, setPhotos] = useState<SignedPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      const { data: rows, error } = await supabase
        .from("project_photos")
        .select("id,file_path,file_name,file_type,file_size")
        .eq("lead_id", leadId)
        .order("uploaded_at", { ascending: true });

      if (error || !rows || rows.length === 0) {
        if (!cancelled) {
          setPhotos([]);
          setLoading(false);
        }
        return;
      }

      const paths = rows.map((r) => r.file_path);
      const { data: signed } = await supabase.storage
        .from(BUCKET)
        .createSignedUrls(paths, SIGNED_URL_TTL);

      const byPath = new Map<string, string>();
      (signed || []).forEach((s) => {
        if (s.path && s.signedUrl) byPath.set(s.path, s.signedUrl);
      });

      if (cancelled) return;
      setPhotos(
        rows
          .map((r) => ({ ...(r as PhotoRow), url: byPath.get(r.file_path) || "" }))
          .filter((p) => p.url),
      );
      setLoading(false);
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [leadId]);

  const download = async (photo: SignedPhoto) => {
    try {
      const res = await fetch(photo.url);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = photo.file_name || `photo-${photo.id}.jpg`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {
      window.open(photo.url, "_blank");
    }
  };

  if (loading) {
    return (
      <div
        style={{
          fontFamily: "'Montserrat', sans-serif",
          fontSize: 12,
          color: "#9CA3AF",
          padding: "8px 0",
        }}
      >
        Loading photos...
      </div>
    );
  }

  if (photos.length === 0) return null;

  const active = lightboxIdx !== null ? photos[lightboxIdx] : null;

  return (
    <div style={{ padding: "12px 16px 0" }}>
      <label
        style={{
          display: "block",
          fontFamily: "'Montserrat', sans-serif",
          fontWeight: 500,
          fontSize: 12,
          color: "#9CA3AF",
          marginBottom: 6,
        }}
      >
        Project Photos ({photos.length})
      </label>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(70px, 1fr))",
          gap: 6,
        }}
      >
        {photos.map((p, idx) => (
          <button
            key={p.id}
            onClick={() => setLightboxIdx(idx)}
            style={{
              padding: 0,
              border: "1px solid #E8E2D8",
              borderRadius: 6,
              overflow: "hidden",
              cursor: "pointer",
              aspectRatio: "1 / 1",
              background: "#F5F1EB",
            }}
          >
            <img
              src={p.url}
              alt={p.file_name || "Project photo"}
              loading="lazy"
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
          </button>
        ))}
      </div>

      {active && (
        <div
          onClick={() => setLightboxIdx(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.85)",
            zIndex: 300,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
          }}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              setLightboxIdx(null);
            }}
            style={{
              position: "absolute",
              top: 16,
              right: 16,
              background: "rgba(255,255,255,0.15)",
              border: "none",
              color: "#FFF",
              borderRadius: 999,
              width: 40,
              height: 40,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
            aria-label="Close"
          >
            <X size={20} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              download(active);
            }}
            style={{
              position: "absolute",
              top: 16,
              left: 16,
              background: "rgba(255,255,255,0.15)",
              border: "none",
              color: "#FFF",
              borderRadius: 8,
              padding: "8px 12px",
              display: "flex",
              alignItems: "center",
              gap: 6,
              cursor: "pointer",
              fontFamily: "'Montserrat', sans-serif",
              fontSize: 13,
            }}
          >
            <Download size={16} />
            Download
          </button>
          <img
            src={active.url}
            alt={active.file_name || "Project photo"}
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: "100%",
              maxHeight: "90vh",
              objectFit: "contain",
              borderRadius: 8,
            }}
          />
          {photos.length > 1 && (
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                position: "absolute",
                bottom: 20,
                left: 0,
                right: 0,
                display: "flex",
                justifyContent: "center",
                gap: 12,
              }}
            >
              <button
                onClick={() =>
                  setLightboxIdx((i) =>
                    i === null ? 0 : (i - 1 + photos.length) % photos.length,
                  )
                }
                style={{
                  background: "rgba(255,255,255,0.15)",
                  border: "none",
                  color: "#FFF",
                  borderRadius: 8,
                  padding: "8px 14px",
                  cursor: "pointer",
                  fontFamily: "'Montserrat', sans-serif",
                }}
              >
                Prev
              </button>
              <div
                style={{
                  color: "#FFF",
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: 13,
                  alignSelf: "center",
                }}
              >
                {(lightboxIdx ?? 0) + 1} / {photos.length}
              </div>
              <button
                onClick={() =>
                  setLightboxIdx((i) => (i === null ? 0 : (i + 1) % photos.length))
                }
                style={{
                  background: "rgba(255,255,255,0.15)",
                  border: "none",
                  color: "#FFF",
                  borderRadius: 8,
                  padding: "8px 14px",
                  cursor: "pointer",
                  fontFamily: "'Montserrat', sans-serif",
                }}
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LeadPhotos;
