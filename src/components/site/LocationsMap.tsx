import { useMemo } from "react";
import { geoAlbersUsa, geoPath } from "d3-geo";
import { feature, mesh } from "topojson-client";
import type { FeatureCollection, MultiLineString } from "geojson";
import statesTopo from "us-atlas/states-10m.json";
import { useOffices } from "@/hooks/useCms";

/**
 * Self-contained US locations map — no external tiles, API keys, or network calls.
 * Renders an accurate continental-US map (real state boundaries, TopoJSON from
 * us-atlas / U.S. Census) with the standard Albers USA projection, which also
 * insets Alaska & Hawaii. Office pins are placed with the SAME projection from
 * each office's lat/lng, so markers land exactly where they belong.
 */

const W = 975;
const H = 610;

// us-atlas ships an untyped TopoJSON blob; treat it loosely.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const topo = statesTopo as any;
const statesFc = feature(topo, topo.objects.states) as unknown as FeatureCollection;
const nationFc = feature(topo, topo.objects.nation) as unknown as FeatureCollection;
const bordersMesh = mesh(
  topo,
  topo.objects.states,
  (a: unknown, b: unknown) => a !== b,
) as unknown as MultiLineString;

// Fit the projection to the frame once (module scope — never changes).
const projection = geoAlbersUsa().fitExtent(
  [
    [24, 18],
    [W - 24, H - 18],
  ],
  statesFc,
);
const path = geoPath(projection);

const landPath = path(statesFc) ?? "";
const bordersPath = path(bordersMesh) ?? "";
const nationPath = path(nationFc) ?? "";

export default function LocationsMap() {
  const offices = useOffices();

  // Project each office, drop any that fall outside the projection, sort W→E
  // so the connecting line reads across the country.
  const plotted = useMemo(() => {
    return offices
      .map((o) => {
        const xy = projection([o.lng, o.lat]);
        return xy ? { ...o, x: xy[0], y: xy[1] } : null;
      })
      .filter((o): o is NonNullable<typeof o> => o !== null)
      .sort((a, b) => a.x - b.x);
  }, [offices]);

  const linkPath = plotted.map((o) => `${o.x},${o.y}`).join(" ");

  return (
    <div className="relative w-full overflow-hidden rounded-sm bg-ink ring-1 ring-white/10">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-auto w-full"
        role="img"
        aria-label={`Mahoney Design & Build office locations: ${offices
          .map((o) => `${o.city}, ${o.state}`)
          .join("; ")}`}
      >
        <defs>
          <pattern id="mdb-dots" width="26" height="26" patternUnits="userSpaceOnUse">
            <circle cx="1.2" cy="1.2" r="1.2" fill="rgba(255,255,255,0.05)" />
          </pattern>
          <linearGradient id="mdb-land" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(255,255,255,0.10)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.04)" />
          </linearGradient>
        </defs>

        {/* faint dot grid backdrop */}
        <rect width={W} height={H} fill="url(#mdb-dots)" />

        {/* filled land */}
        <path d={landPath} fill="url(#mdb-land)" />
        {/* interior state boundaries */}
        <path
          d={bordersPath}
          fill="none"
          stroke="rgba(255,255,255,0.14)"
          strokeWidth={0.6}
          strokeLinejoin="round"
        />
        {/* crisp national outline */}
        <path
          d={nationPath}
          fill="none"
          stroke="rgba(255,255,255,0.32)"
          strokeWidth={1.25}
          strokeLinejoin="round"
        />

        {/* connecting line across offices */}
        <polyline
          points={linkPath}
          fill="none"
          stroke="#7C0302"
          strokeWidth={1.75}
          strokeDasharray="5 6"
          strokeOpacity={0.7}
        />

        {/* office markers */}
        {plotted.map((o, i) => {
          const anchor = o.x < W * 0.22 ? "start" : o.x > W * 0.78 ? "end" : "middle";
          const labelDx = anchor === "start" ? 14 : anchor === "end" ? -14 : 0;
          return (
            <g key={o.slug}>
              {/* pulsing ring */}
              <circle cx={o.x} cy={o.y} r={7} fill="none" stroke="#7C0302" strokeWidth={1.5} opacity={0.5}>
                <animate attributeName="r" values="7;18;7" dur="3s" begin={`${i * 0.6}s`} repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.5;0;0.5" dur="3s" begin={`${i * 0.6}s`} repeatCount="indefinite" />
              </circle>
              {/* pin dot */}
              <circle cx={o.x} cy={o.y} r={o.hq ? 7 : 5.5} fill="#7C0302" stroke="#fff" strokeWidth={1.5} />
              {/* labels */}
              <text
                x={o.x + labelDx}
                y={o.y - 16}
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
                x={o.x + labelDx}
                y={o.y + 30}
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
