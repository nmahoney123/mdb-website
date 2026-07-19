import { OFFICES } from "@/data/content";

/**
 * Self-contained locations map — no external tiles, API keys, or network calls.
 * A stylized continental-US silhouette (single polygon) with each office plotted
 * from its approximate lat/lng via a simple equirectangular projection. Because the
 * outline and the pins share the same projection, the markers land in the right place
 * relative to the map even though the outline is intentionally simplified.
 */

const W = 960;
const H = 600;
const LNG_MIN = -125;
const LNG_MAX = -66;
const LAT_MIN = 24;
const LAT_MAX = 49;

function project(lng: number, lat: number): [number, number] {
  const x = ((lng - LNG_MIN) / (LNG_MAX - LNG_MIN)) * W;
  const y = ((LAT_MAX - lat) / (LAT_MAX - LAT_MIN)) * H;
  return [x, y];
}

// Continental US outline as [lng, lat] pairs, clockwise from the Pacific Northwest.
// Approximate — a recognizable silhouette, not a survey-grade boundary.
const US_OUTLINE: [number, number][] = [
  [-124.7, 48.4], [-123, 49], [-117, 49], [-110, 49], [-104, 49], [-97, 49], [-95.2, 49],
  [-95, 48.2], [-92, 47.3], [-90.5, 46.8], [-88.4, 47.3], [-88, 46.5], [-86.2, 44.5],
  [-85.5, 45.8], [-84.7, 45.9], [-83.4, 45.1], [-82.5, 43], [-83, 41.7], [-81, 42.3],
  [-79.2, 42.8], [-79, 43.3], [-76.9, 43.3], [-76.4, 44.2], [-73.3, 45.0], [-71.5, 45.1],
  [-69.2, 47.4], [-67.8, 47.1], [-67, 44.8], [-69.9, 43.8], [-70.8, 42.9], [-70.2, 41.7],
  [-72, 41.1], [-73.9, 40.6], [-74.2, 39.5], [-75.5, 38.4], [-76, 37.9], [-75.9, 36.9],
  [-76.3, 34.9], [-78.5, 33.9], [-79.2, 33], [-80.9, 32], [-81.4, 30.7], [-80.6, 28.5],
  [-80.1, 26.8], [-80.4, 25.2], [-81.1, 25.1], [-81.8, 26], [-82.8, 27.8], [-82.7, 28.9],
  [-84.0, 30.1], [-85.4, 29.7], [-87.5, 30.3], [-89.2, 30.3], [-90.4, 29.2], [-91.8, 29.6],
  [-93.8, 29.7], [-95.3, 28.9], [-97.2, 27.8], [-97.4, 26.0], [-99.2, 26.4], [-100.8, 29.3],
  [-102.4, 29.8], [-103.2, 29.0], [-104.5, 29.7], [-106.5, 31.8], [-108.2, 31.3], [-111, 31.3],
  [-114.8, 32.5], [-117.1, 32.5], [-118.3, 34.0], [-120.5, 34.5], [-121.9, 36.6], [-122.5, 37.8],
  [-124.0, 40.0], [-124.2, 42.0], [-124.1, 43.3], [-124.0, 46.0], [-124.7, 48.4],
];

const outlinePoints = US_OUTLINE.map(([lng, lat]) => project(lng, lat).join(",")).join(" ");

// Offices plotted, then sorted west→east so the connecting line reads across the country.
const plotted = OFFICES.map((o) => ({ ...o, xy: project(o.lng, o.lat) })).sort(
  (a, b) => a.xy[0] - b.xy[0],
);
const linkPath = plotted.map((o) => o.xy.join(",")).join(" ");

export default function LocationsMap() {
  return (
    <div className="relative w-full overflow-hidden rounded-sm bg-ink ring-1 ring-white/10">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-auto w-full"
        role="img"
        aria-label={`Mahoney Design & Build office locations: ${OFFICES.map(
          (o) => `${o.city}, ${o.state}`,
        ).join("; ")}`}
      >
        {/* faint dot grid */}
        <defs>
          <pattern id="mdb-dots" width="26" height="26" patternUnits="userSpaceOnUse">
            <circle cx="1.2" cy="1.2" r="1.2" fill="rgba(255,255,255,0.05)" />
          </pattern>
        </defs>
        <rect width={W} height={H} fill="url(#mdb-dots)" />

        {/* US silhouette */}
        <polygon
          points={outlinePoints}
          fill="rgba(255,255,255,0.05)"
          stroke="rgba(255,255,255,0.22)"
          strokeWidth={1.5}
          strokeLinejoin="round"
        />

        {/* connecting line across offices */}
        <polyline
          points={linkPath}
          fill="none"
          stroke="#C8102E"
          strokeWidth={1.5}
          strokeDasharray="5 6"
          strokeOpacity={0.6}
        />

        {/* office markers */}
        {plotted.map((o, i) => {
          const [x, y] = o.xy;
          const anchor = x < W * 0.25 ? "start" : x > W * 0.75 ? "end" : "middle";
          const labelDx = anchor === "start" ? 14 : anchor === "end" ? -14 : 0;
          return (
            <g key={o.slug}>
              {/* pulsing ring */}
              <circle cx={x} cy={y} r={7} fill="none" stroke="#C8102E" strokeWidth={1.5} opacity={0.5}>
                <animate attributeName="r" values="7;18;7" dur="3s" begin={`${i * 0.6}s`} repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.5;0;0.5" dur="3s" begin={`${i * 0.6}s`} repeatCount="indefinite" />
              </circle>
              {/* pin dot */}
              <circle cx={x} cy={y} r={o.hq ? 7 : 5.5} fill="#C8102E" stroke="#fff" strokeWidth={1.5} />
              {/* labels */}
              <text
                x={x + labelDx}
                y={y - 16}
                textAnchor={anchor}
                fill="#ffffff"
                style={{ paintOrder: "stroke", fontFamily: "Archivo, system-ui, sans-serif" }}
                stroke="#141414"
                strokeWidth={4}
                fontSize={22}
                fontWeight={800}
              >
                {o.city}, {o.state}
              </text>
              <text
                x={x + labelDx}
                y={y + 30}
                textAnchor={anchor}
                fill="rgba(255,255,255,0.6)"
                style={{ paintOrder: "stroke", fontFamily: "Archivo, system-ui, sans-serif", letterSpacing: "0.12em" }}
                stroke="#141414"
                strokeWidth={3}
                fontSize={12}
                fontWeight={600}
              >
                {o.hq ? "HEADQUARTERS" : o.region.toUpperCase()}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
