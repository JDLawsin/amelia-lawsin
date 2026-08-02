import { ImageResponse } from "next/og";
import { SITE_CONFIG } from "@/constants";

export const OG_IMAGE_SIZE = { width: 1200, height: 630 };
export const OG_IMAGE_CONTENT_TYPE = "image/png";

type OgImageOptions = {
  title: string;
  subtitle?: string;
};

export function createOgImage({
  title,
  subtitle = SITE_CONFIG.tagline,
}: OgImageOptions) {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#1d1d1f",
          padding: "72px 80px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 24,
            maxWidth: 960,
          }}
        >
          <div
            style={{
              fontSize: 24,
              fontWeight: 500,
              color: "rgba(255,255,255,0.55)",
              letterSpacing: 4,
              textTransform: "uppercase",
            }}
          >
            {SITE_CONFIG.name}
          </div>
          <div
            style={{
              fontSize: 68,
              fontWeight: 600,
              color: "#ffffff",
              lineHeight: 1.08,
              letterSpacing: -1,
            }}
          >
            {title}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <div
            style={{
              fontSize: 28,
              fontWeight: 500,
              color: "rgba(255,255,255,0.72)",
              maxWidth: 820,
              lineHeight: 1.35,
            }}
          >
            {subtitle}
          </div>
          <div
            style={{
              width: 72,
              height: 4,
              backgroundColor: "rgba(255,255,255,0.35)",
            }}
          />
        </div>
      </div>
    ),
    OG_IMAGE_SIZE,
  );
}
