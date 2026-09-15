import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { toast } from "sonner";
import { useDialogFocus } from "@/hooks/useDialogFocus";
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
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const dialogRef = useRef<HTMLDivElement>(null);
  useDialogFocus(lightboxIdx !== null && photos.length > 0, dialogRef, () => setLightboxIdx(null));

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError(false);
      try {
      const { data: rows, error } = await supabase
        .from("project_photos")
        .select("id,file_path,file_name,file_type,file_size")
        .eq("lead_id", leadId)
        .order("uploaded_at", { ascending: true });

      if (error) throw error;
      if (!rows || rows.length === 0) {
        if (!cancelled) {
          setPhotos([]);
          setLoading(false);
        }
        return;
      }

      const paths = rows.map((r) => r.file_path);
      const { data: signed, error: signingError } = await supabase.storage
        .from(BUCKET)
        .createSignedUrls(paths, SIGNED_URL_TTL);
      if (signingError || signed?.some((item) => item.error) || !signed) {
        throw signingError ?? new Error("Unable to access photos");
      }

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
      } catch {
        if (!cancelled) { setError(true); setLoading(false); }
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, [leadId, attempt]);

  const download = async (photo: SignedPhoto) => {
    try {
      const res = await fetch(photo.url);
      if (!res.ok) throw new Error("Download failed");
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
      toast.error("Photo could not be downloaded. Refresh the photos and try again.");
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

  if (error) return <div role="alert" className="p-4 text-sm">Unable to load project photos. <button className="underline" onClick={() => setAttempt((value) => value + 1)}>Retry</button></div>;
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

      {active && createPortal(
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label="Project photos"
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
        </div>, document.body
      )}
    </div>
  );
};

export default LeadPhotos;
