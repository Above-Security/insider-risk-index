import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Extract parameters
    const title = searchParams.get("title") || "Insider Risk Index";
    const description = searchParams.get("description") || "Measure your organization's insider risk posture";
    const score = searchParams.get("score");
    const pillar = searchParams.get("pillar");

    const width = 1200;
    const height = 630;

    return new ImageResponse(
      (
        <div
          style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "Inter, sans-serif",
          }}
        >
          {/* Background Pattern */}
          <div
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              opacity: 0.1,
              background: `radial-gradient(circle at 25% 25%, white 2px, transparent 2px),
                          radial-gradient(circle at 75% 75%, white 2px, transparent 2px)`,
              backgroundSize: "60px 60px",
            }}
          />

          {/* Main Content */}
          <div
            style={{
              background: "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(10px)",
              borderRadius: "24px",
              padding: "48px",
              margin: "40px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              maxWidth: "800px",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
            }}
          >
            {/* Logo/Icon */}
            <div
              style={{
                width: "80px",
                height: "80px",
                background: "#7AB7FF",
                borderRadius: "16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "24px",
              }}
            >
              <div
                style={{
                  color: "white",
                  fontSize: "40px",
                  fontWeight: "bold",
                }}
              >
                🛡️
              </div>
            </div>

            {/* Title */}
            <h1
              style={{
                fontSize: score ? "48px" : "64px",
                fontWeight: "bold",
                color: "#1F2937",
                margin: "0 0 16px 0",
                lineHeight: 1.1,
              }}
            >
              {title}
            </h1>

            {/* Score Display */}
            {score && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "24px",
                  margin: "24px 0",
                }}
              >
                <div
                  style={{
                    fontSize: "72px",
                    fontWeight: "bold",
                    color: "#7AB7FF",
                  }}
                >
                  {score}
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                  }}
                >
                  <div
                    style={{
                      fontSize: "24px",
                      color: "#C8B3FF",
                    }}
                  >
                    out of 100
                  </div>
                  {pillar && (
                    <div
                      style={{
                        fontSize: "18px",
                        color: "#7AB7FF",
                        fontWeight: "600",
                      }}
                    >
                      {pillar}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Description */}
            <p
              style={{
                fontSize: score ? "24px" : "32px",
                color: "#C8B3FF",
                margin: "0",
                lineHeight: 1.3,
                maxWidth: "600px",
              }}
            >
              {description}
            </p>

            {/* Bottom Brand */}
            <div
              style={{
                marginTop: "32px",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                fontSize: "18px",
                color: "#9CA3AF",
              }}
            >
              <span>insiderriskindex.com</span>
            </div>
          </div>
        </div>
      ),
      {
        width,
        height,
        // Remove fonts array since we can't fetch external fonts in edge runtime
        // Use system fonts instead
      }
    );
  } catch (error) {
    console.error("Error generating OG image:", error);
    
    return new Response("Failed to generate image", {
      status: 500,
    });
  }
}