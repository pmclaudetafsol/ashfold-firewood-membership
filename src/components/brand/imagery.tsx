import * as React from 'react';
import { cn } from '@/lib/utils';

/**
 * Placeholder imagery for the demonstration.
 *
 * These are hand-built SVG scenes rather than photographs so the demo runs
 * entirely offline and every image sits exactly on the brand palette. In
 * production each `<Scene>` is replaced by a real photograph at the same
 * aspect ratio — the API is deliberately shaped like an `<img>` wrapper.
 *
 * Scenes are drawn on a 1200×800 canvas and rendered with
 * `preserveAspectRatio="xMidYMid slice"` so they crop like a photograph
 * instead of letterboxing.
 */

const FOREST = '#163A2B';
const FOREST_LIGHT = '#26543F';
const CREAM = '#F5F1E8';
const CHARCOAL = '#1F2521';
const ORANGE = '#C4512A';
const OAK = '#C9A66B';
const SAGE = '#A9B8A8';

type SceneProps = React.SVGProps<SVGSVGElement> & { className?: string };

function SceneRoot({ children, className, ...props }: SceneProps & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 1200 800"
      preserveAspectRatio="xMidYMid slice"
      role="presentation"
      aria-hidden="true"
      className={cn('size-full', className)}
      {...props}
    >
      {children}
    </svg>
  );
}

/** Fine film grain, kept very low so it reads as texture rather than noise. */
function Grain({ id, opacity = 0.055 }: { id: string; opacity?: number }) {
  return (
    <>
      <filter id={id} x="0" y="0" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="1200" height="800" filter={`url(#${id})`} opacity={opacity} />
    </>
  );
}

/* ─────────────────── Stacked kiln-dried logs (end grain) ─────────────────── */

/** A single split log seen end-on: rings, a radial split, warm highlight. */
function LogEnd({
  cx,
  cy,
  r,
  seed,
}: {
  cx: number;
  cy: number;
  r: number;
  seed: number;
}) {
  const tones = ['#E4D4B4', '#D9C6A2', '#CDB68E', '#E9DCC2', '#D2BE9A'];
  const barkTones = ['#6B5233', '#7A5E3C', '#5D472C'];
  const face = tones[seed % tones.length];
  const bark = barkTones[seed % barkTones.length];
  const rings = 3 + (seed % 3);
  const tilt = ((seed % 7) - 3) * 6;

  return (
    <g transform={`translate(${cx} ${cy}) rotate(${tilt})`}>
      <circle r={r} fill={bark} />
      <circle r={r * 0.88} fill={face} />
      {Array.from({ length: rings }).map((_, index) => (
        <circle
          key={index}
          r={r * 0.88 * ((index + 1) / (rings + 1))}
          fill="none"
          stroke={CHARCOAL}
          strokeOpacity={0.09}
          strokeWidth={r * 0.045}
        />
      ))}
      {/* Radial drying split — the visual signature of properly kilned wood. */}
      <path
        d={`M 0 0 L ${r * 0.84 * Math.cos((seed * 47 * Math.PI) / 180)} ${
          r * 0.84 * Math.sin((seed * 47 * Math.PI) / 180)
        }`}
        stroke={CHARCOAL}
        strokeOpacity={0.22}
        strokeWidth={r * 0.07}
        strokeLinecap="round"
      />
      <circle r={r * 0.08} fill={CHARCOAL} fillOpacity={0.16} />
      {/* Soft top-left light. */}
      <circle
        r={r * 0.88}
        fill="url(#logSheen)"
        style={{ mixBlendMode: 'overlay' }}
      />
    </g>
  );
}

export function LogStackScene({ className, ...props }: SceneProps) {
  // A staggered stack, tighter and smaller towards the top for depth.
  const rows = [
    { y: 690, r: 62, count: 11, offset: 0 },
    { y: 574, r: 58, count: 11, offset: 55 },
    { y: 462, r: 54, count: 12, offset: 0 },
    { y: 358, r: 50, count: 13, offset: 48 },
    { y: 262, r: 45, count: 14, offset: 0 },
    { y: 176, r: 40, count: 16, offset: 40 },
  ];

  return (
    <SceneRoot className={className} {...props}>
      <defs>
        <linearGradient id="logBg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2E3B33" />
          <stop offset="100%" stopColor={CHARCOAL} />
        </linearGradient>
        <radialGradient id="logSheen" cx="0.32" cy="0.28" r="0.75">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.5" />
          <stop offset="60%" stopColor="#FFFFFF" stopOpacity="0.05" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.18" />
        </radialGradient>
        <linearGradient id="logVignette" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={CHARCOAL} stopOpacity="0.55" />
          <stop offset="38%" stopColor={CHARCOAL} stopOpacity="0" />
          <stop offset="100%" stopColor={CHARCOAL} stopOpacity="0.35" />
        </linearGradient>
      </defs>

      <rect width="1200" height="800" fill="url(#logBg)" />

      {rows.map((row, rowIndex) =>
        Array.from({ length: row.count }).map((_, index) => {
          const spacing = 1200 / (row.count - 1.2);
          const cx = index * spacing - spacing * 0.1 + row.offset;
          return (
            <LogEnd
              key={`${rowIndex}-${index}`}
              cx={cx}
              cy={row.y}
              r={row.r}
              seed={rowIndex * 13 + index * 7 + 3}
            />
          );
        }),
      )}

      <rect width="1200" height="800" fill="url(#logVignette)" />
      <Grain id="grainLogs" />
    </SceneRoot>
  );
}

/* ────────────────────────── Modern fireplace ────────────────────────── */

export function FireplaceScene({ className, ...props }: SceneProps) {
  return (
    <SceneRoot className={className} {...props}>
      <defs>
        <linearGradient id="roomWall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#EFE9DC" />
          <stop offset="100%" stopColor="#DED6C4" />
        </linearGradient>
        <linearGradient id="hearthStone" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#3A4340" />
          <stop offset="100%" stopColor="#232A26" />
        </linearGradient>
        <radialGradient id="fireGlow" cx="0.5" cy="0.78" r="0.62">
          <stop offset="0%" stopColor="#FFC98A" stopOpacity="0.95" />
          <stop offset="35%" stopColor={ORANGE} stopOpacity="0.75" />
          <stop offset="100%" stopColor={ORANGE} stopOpacity="0" />
        </radialGradient>
        <radialGradient id="roomGlow" cx="0.5" cy="0.68" r="0.7">
          <stop offset="0%" stopColor="#F2B074" stopOpacity="0.32" />
          <stop offset="100%" stopColor="#F2B074" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="floorBoards" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#B99863" />
          <stop offset="100%" stopColor="#8E7247" />
        </linearGradient>
      </defs>

      {/* Room */}
      <rect width="1200" height="800" fill="url(#roomWall)" />
      <rect y="640" width="1200" height="160" fill="url(#floorBoards)" />
      {Array.from({ length: 9 }).map((_, index) => (
        <rect key={index} x={index * 140} y="640" width="3" height="160" fill={CHARCOAL} opacity="0.12" />
      ))}

      {/* Chimney breast */}
      <rect x="300" y="0" width="600" height="660" fill="#E7E0D0" />
      <rect x="300" y="0" width="600" height="660" fill={CHARCOAL} opacity="0.03" />
      <rect x="298" y="0" width="4" height="660" fill={CHARCOAL} opacity="0.07" />
      <rect x="898" y="0" width="4" height="660" fill={CHARCOAL} opacity="0.07" />

      {/* Mantel shelf */}
      <rect x="268" y="288" width="664" height="18" rx="4" fill={OAK} />
      <rect x="268" y="306" width="664" height="8" fill={CHARCOAL} opacity="0.16" />

      {/* Inset firebox */}
      <rect x="410" y="372" width="380" height="252" rx="6" fill="url(#hearthStone)" />
      <rect x="424" y="386" width="352" height="224" rx="3" fill="#161B18" />

      {/* Fire */}
      <ellipse cx="600" cy="596" rx="200" ry="150" fill="url(#fireGlow)" />
      <g>
        <path d="M545 600 L655 600 L648 566 L552 570 Z" fill="#5A4327" />
        <path d="M534 570 L646 556 L640 528 L544 540 Z" fill="#6B5233" />
        <path d="M560 540 L638 530 L634 508 L566 516 Z" fill="#4C3820" />
      </g>
      <path
        d="M600 420 C 636 470 660 500 656 540 C 652 582 626 604 600 604 C 574 604 548 582 544 540 C 540 500 564 470 600 420 Z"
        fill={ORANGE}
        opacity="0.92"
      />
      <path
        d="M600 470 C 622 506 634 526 630 552 C 626 578 614 592 600 592 C 586 592 574 578 570 552 C 566 526 578 506 600 470 Z"
        fill="#F0A055"
      />
      <path
        d="M600 516 C 610 538 614 550 612 564 C 610 578 606 586 600 586 C 594 586 590 578 588 564 C 586 550 590 538 600 516 Z"
        fill="#FFDBA8"
      />

      {/* Hearth slab */}
      <rect x="366" y="624" width="468" height="26" rx="3" fill="#2B322E" />
      <rect x="366" y="624" width="468" height="6" fill="#FFFFFF" opacity="0.07" />

      {/* Neatly stacked logs in the alcove beside the fire */}
      <g opacity="0.95">
        {[0, 1, 2].map((row) =>
          [0, 1, 2].map((col) => (
            <g key={`${row}-${col}`} transform={`translate(${196 + col * 46} ${556 - row * 46})`}>
              <circle r="21" fill="#6B5233" />
              <circle r="18" fill="#D9C6A2" />
              <circle r="11" fill="none" stroke={CHARCOAL} strokeOpacity="0.12" strokeWidth="2" />
              <circle r="5" fill="none" stroke={CHARCOAL} strokeOpacity="0.14" strokeWidth="2" />
            </g>
          )),
        )}
      </g>

      {/* Room ambience */}
      <rect width="1200" height="800" fill="url(#roomGlow)" />
      <Grain id="grainFire" opacity={0.045} />
    </SceneRoot>
  );
}

/* ─────────────────────── Responsible forestry ─────────────────────── */

function ConiferRow({
  y,
  scale,
  fill,
  opacity,
  count,
  offset,
}: {
  y: number;
  scale: number;
  fill: string;
  opacity: number;
  count: number;
  offset: number;
}) {
  const spacing = 1300 / count;
  return (
    <g opacity={opacity}>
      {Array.from({ length: count }).map((_, index) => {
        const x = index * spacing + offset - 60;
        const h = 150 * scale * (0.82 + ((index * 37) % 40) / 100);
        const w = 46 * scale;
        return (
          <path
            key={index}
            d={`M ${x} ${y} L ${x - w} ${y} L ${x} ${y - h} L ${x + w} ${y} Z`}
            fill={fill}
          />
        );
      })}
    </g>
  );
}

export function ForestryScene({ className, ...props }: SceneProps) {
  return (
    <SceneRoot className={className} {...props}>
      <defs>
        <linearGradient id="forestSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#DCE4DA" />
          <stop offset="55%" stopColor="#C6D2C4" />
          <stop offset="100%" stopColor="#AFC0AE" />
        </linearGradient>
        <linearGradient id="forestFloor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={FOREST} />
          <stop offset="100%" stopColor="#0E2A1E" />
        </linearGradient>
        <linearGradient id="mistBand" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={CREAM} stopOpacity="0" />
          <stop offset="50%" stopColor={CREAM} stopOpacity="0.5" />
          <stop offset="100%" stopColor={CREAM} stopOpacity="0" />
        </linearGradient>
      </defs>

      <rect width="1200" height="800" fill="url(#forestSky)" />

      {/* Low sun */}
      <circle cx="880" cy="220" r="86" fill="#F3E7CE" opacity="0.6" />
      <circle cx="880" cy="220" r="52" fill="#FBF3E2" opacity="0.75" />

      {/* Ridgelines, receding */}
      <path d="M0 470 L 200 386 L 420 452 L 640 372 L 880 448 L 1080 396 L 1200 442 L 1200 800 L 0 800 Z" fill={SAGE} opacity="0.55" />
      <ConiferRow y={470} scale={0.68} fill={SAGE} opacity={0.7} count={26} offset={0} />

      <path d="M0 546 L 240 486 L 470 542 L 700 470 L 940 540 L 1200 496 L 1200 800 L 0 800 Z" fill={FOREST_LIGHT} opacity="0.75" />
      <ConiferRow y={548} scale={0.92} fill={FOREST_LIGHT} opacity={0.9} count={20} offset={30} />

      <rect y="470" width="1200" height="120" fill="url(#mistBand)" />

      <path d="M0 640 L 300 598 L 620 646 L 900 590 L 1200 632 L 1200 800 L 0 800 Z" fill="url(#forestFloor)" />
      <ConiferRow y={646} scale={1.25} fill={FOREST} opacity={1} count={14} offset={-10} />

      {/* Foreground trunks — the managed, worked woodland in front */}
      {[110, 330, 640, 980].map((x, index) => (
        <g key={x}>
          <rect x={x} y={330 + index * 12} width={26 + index * 3} height={470} fill="#12291D" />
          <rect x={x} y={330 + index * 12} width={8} height={470} fill="#FFFFFF" opacity="0.06" />
        </g>
      ))}

      {/* A neat stack of cut lengths at the woodland edge */}
      <g transform="translate(760 672)">
        {[0, 1].map((row) =>
          [0, 1, 2, 3].map((col) => (
            <g key={`${row}-${col}`} transform={`translate(${col * 40 + (row % 2) * 20} ${-row * 40})`}>
              <circle r="19" fill="#5B4630" />
              <circle r="16" fill="#C9AE84" />
              <circle r="9" fill="none" stroke={CHARCOAL} strokeOpacity="0.14" strokeWidth="2" />
            </g>
          )),
        )}
      </g>

      <Grain id="grainForest" opacity={0.05} />
    </SceneRoot>
  );
}

/* ─────────────────────── Delivery to a UK home ─────────────────────── */

export function DeliveryScene({ className, ...props }: SceneProps) {
  return (
    <SceneRoot className={className} {...props}>
      <defs>
        <linearGradient id="deliverySky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E9E4D6" />
          <stop offset="100%" stopColor="#D6DCD2" />
        </linearGradient>
        <linearGradient id="brick" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#C6B49C" />
          <stop offset="100%" stopColor="#AD9A82" />
        </linearGradient>
      </defs>

      <rect width="1200" height="800" fill="url(#deliverySky)" />

      {/* Hedge line */}
      <rect y="500" width="1200" height="70" rx="28" fill={SAGE} opacity="0.65" />

      {/* House */}
      <g>
        <rect x="120" y="250" width="440" height="330" fill="url(#brick)" />
        <path d="M100 252 L 340 118 L 580 252 Z" fill={FOREST} />
        <path d="M100 252 L 340 118 L 580 252 Z" fill="#000" opacity="0.12" />
        {/* Windows */}
        {([
          [176, 300],
          [316, 300],
          [456, 300],
          [176, 434],
          [456, 434],
        ] as Array<[number, number]>).map(([x, y]) => (
          <g key={`${x}-${y}`}>
            <rect x={x} y={y} width="86" height="96" rx="3" fill="#F3EEE1" />
            <rect x={x + 6} y={y + 6} width="74" height="84" rx="2" fill="#3D4E52" opacity="0.82" />
            <rect x={x + 42} y={y + 6} width="3" height="84" fill="#F3EEE1" opacity="0.8" />
            <rect x={x + 6} y={y + 46} width="74" height="3" fill="#F3EEE1" opacity="0.8" />
          </g>
        ))}
        {/* Door */}
        <rect x="308" y="428" width="94" height="152" rx="4" fill={FOREST} />
        <circle cx="388" cy="506" r="5" fill={OAK} />
        {/* Chimney with a thin ribbon of smoke */}
        <rect x="440" y="140" width="52" height="88" fill="#9C8A73" />
        <path
          d="M466 138 C 466 108 494 104 492 76 C 490 52 464 50 468 24"
          stroke={CREAM}
          strokeWidth="10"
          strokeLinecap="round"
          fill="none"
          opacity="0.75"
        />
      </g>

      {/* Flatbed delivery lorry */}
      <g transform="translate(640 300)">
        {/* Load bed with crates */}
        <rect x="60" y="126" width="360" height="150" rx="8" fill={FOREST} />
        <rect x="60" y="126" width="360" height="12" fill="#FFFFFF" opacity="0.08" />
        {/* Crated logs */}
        <g transform="translate(96 40)">
          {[0, 1].map((crate) => (
            <g key={crate} transform={`translate(${crate * 150} 0)`}>
              <rect width="132" height="92" rx="4" fill={OAK} />
              <rect width="132" height="92" rx="4" fill={CHARCOAL} opacity="0.06" />
              {[0, 1, 2].map((slat) => (
                <rect key={slat} y={slat * 32 + 6} width="132" height="8" fill={CHARCOAL} opacity="0.16" />
              ))}
              {[0, 1, 2, 3].map((row) =>
                [0, 1, 2, 3, 4].map((col) => (
                  <circle
                    key={`${row}-${col}`}
                    cx={16 + col * 25}
                    cy={14 + row * 22}
                    r="9"
                    fill="#D9C6A2"
                    stroke="#6B5233"
                    strokeWidth="2.5"
                  />
                )),
              )}
            </g>
          ))}
        </g>
        {/* Cab */}
        <path d="M420 156 L 500 156 L 536 214 L 536 276 L 420 276 Z" fill={FOREST} />
        <path d="M436 170 L 494 170 L 518 214 L 436 214 Z" fill="#8FA9AE" opacity="0.9" />
        {/* Wheels */}
        {[132, 236, 486].map((x) => (
          <g key={x}>
            <circle cx={x} cy="284" r="34" fill={CHARCOAL} />
            <circle cx={x} cy="284" r="14" fill="#8B928C" />
          </g>
        ))}
      </g>

      {/* Driveway */}
      <rect y="590" width="1200" height="210" fill="#BFB6A4" />
      <rect y="590" width="1200" height="10" fill={CHARCOAL} opacity="0.08" />
      {Array.from({ length: 30 }).map((_, index) => (
        <circle
          key={index}
          cx={(index * 73) % 1200}
          cy={620 + ((index * 47) % 160)}
          r={3 + ((index * 13) % 4)}
          fill={CHARCOAL}
          opacity="0.07"
        />
      ))}

      <Grain id="grainDelivery" opacity={0.05} />
    </SceneRoot>
  );
}

/* ───────────────────────── Kiln at the yard ───────────────────────── */

export function KilnScene({ className, ...props }: SceneProps) {
  return (
    <SceneRoot className={className} {...props}>
      <defs>
        <linearGradient id="kilnBg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#243029" />
          <stop offset="100%" stopColor="#141A16" />
        </linearGradient>
        <linearGradient id="kilnMouth" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F3C489" stopOpacity="0.9" />
          <stop offset="100%" stopColor={ORANGE} stopOpacity="0.6" />
        </linearGradient>
      </defs>

      <rect width="1200" height="800" fill="url(#kilnBg)" />

      {/* Warm air currents */}
      {[0, 1, 2, 3, 4].map((index) => (
        <path
          key={index}
          d={`M ${120 + index * 230} 760 C ${180 + index * 230} 620, ${60 + index * 230} 520, ${140 + index * 230} 360`}
          stroke={ORANGE}
          strokeOpacity={0.12}
          strokeWidth="34"
          strokeLinecap="round"
          fill="none"
        />
      ))}

      {/* Kiln chamber */}
      <rect x="180" y="180" width="840" height="470" rx="14" fill="#2E3A32" />
      <rect x="204" y="204" width="792" height="422" rx="8" fill="#1A211C" />
      <rect x="204" y="204" width="792" height="422" rx="8" fill="url(#kilnMouth)" opacity="0.28" />

      {/* Stacked crates inside, back-lit */}
      {[0, 1, 2].map((row) =>
        [0, 1, 2, 3].map((col) => (
          <g key={`${row}-${col}`} transform={`translate(${242 + col * 192} ${244 + row * 130})`}>
            <rect width="160" height="112" rx="4" fill={OAK} opacity="0.9" />
            {[0, 1, 2].map((slat) => (
              <rect key={slat} y={slat * 38 + 8} width="160" height="9" fill={CHARCOAL} opacity="0.2" />
            ))}
            {[0, 1, 2].map((r) =>
              [0, 1, 2, 3, 4, 5].map((c) => (
                <circle
                  key={`${r}-${c}`}
                  cx={17 + c * 26}
                  cy={18 + r * 38}
                  r="10"
                  fill="#E0CDA8"
                  stroke="#6B5233"
                  strokeWidth="3"
                />
              )),
            )}
          </g>
        )),
      )}

      {/* Temperature readout panel */}
      <g transform="translate(880 660)">
        <rect width="248" height="88" rx="8" fill="#0F1512" stroke={FOREST_LIGHT} strokeWidth="2" />
        <text x="20" y="34" fill={SAGE} fontFamily="Inter, sans-serif" fontSize="16">
          CORE MOISTURE
        </text>
        <text x="20" y="70" fill="#7DD3A8" fontFamily="Manrope, sans-serif" fontSize="30" fontWeight="700">
          16.4%
        </text>
        <circle cx="216" cy="58" r="9" fill="#7DD3A8" />
      </g>

      <rect width="1200" height="800" fill={CHARCOAL} opacity="0.18" />
      <Grain id="grainKiln" opacity={0.06} />
    </SceneRoot>
  );
}

/* ───────────────────────── Warm interior detail ───────────────────────── */

export function WarmRoomScene({ className, ...props }: SceneProps) {
  return (
    <SceneRoot className={className} {...props}>
      <defs>
        <linearGradient id="warmWall" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#EAE2D2" />
          <stop offset="100%" stopColor="#D3CBB9" />
        </linearGradient>
        <radialGradient id="lampGlow" cx="0.78" cy="0.32" r="0.5">
          <stop offset="0%" stopColor="#FFD9A3" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#FFD9A3" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="1200" height="800" fill="url(#warmWall)" />
      <rect y="620" width="1200" height="180" fill="#A98A5C" />
      <rect y="620" width="1200" height="8" fill={CHARCOAL} opacity="0.14" />

      {/* Window with evening light */}
      <rect x="80" y="120" width="330" height="400" rx="6" fill="#F5F1E8" />
      <rect x="98" y="138" width="294" height="364" rx="3" fill="#7E93A0" />
      <rect x="98" y="138" width="294" height="180" fill="#A8BAC2" />
      <rect x="242" y="138" width="6" height="364" fill="#F5F1E8" />
      <rect x="98" y="316" width="294" height="6" fill="#F5F1E8" />
      <rect x="66" y="512" width="358" height="16" rx="4" fill={OAK} />

      {/* Armchair */}
      <g transform="translate(470 330)">
        <rect x="20" y="120" width="260" height="150" rx="26" fill={FOREST} />
        <rect x="0" y="60" width="70" height="200" rx="26" fill={FOREST_LIGHT} />
        <rect x="230" y="60" width="70" height="200" rx="26" fill={FOREST_LIGHT} />
        <rect x="56" y="0" width="188" height="150" rx="24" fill={FOREST_LIGHT} />
        <rect x="86" y="112" width="128" height="46" rx="14" fill={SAGE} opacity="0.55" />
        <rect x="46" y="268" width="26" height="42" rx="8" fill="#5A4630" />
        <rect x="228" y="268" width="26" height="42" rx="8" fill="#5A4630" />
      </g>

      {/* Log basket */}
      <g transform="translate(840 470)">
        <path d="M0 40 L 200 40 L 176 190 L 24 190 Z" fill="#B08C56" />
        <path d="M0 40 L 200 40 L 194 62 L 6 62 Z" fill="#96754A" />
        {[0, 1, 2].map((row) =>
          [0, 1, 2, 3].map((col) => (
            <g key={`${row}-${col}`} transform={`translate(${34 + col * 44} ${8 - row * 6 + (col % 2) * 6})`}>
              <circle r="22" fill="#6B5233" />
              <circle r="19" fill="#DCC9A6" />
              <circle r="10" fill="none" stroke={CHARCOAL} strokeOpacity="0.14" strokeWidth="2.5" />
            </g>
          )),
        )}
      </g>

      {/* Floor lamp glow */}
      <rect width="1200" height="800" fill="url(#lampGlow)" />
      <Grain id="grainWarm" opacity={0.05} />
    </SceneRoot>
  );
}

/* ─────────────────────────── Photo wrapper ─────────────────────────── */

export const scenes = {
  logs: LogStackScene,
  fireplace: FireplaceScene,
  forestry: ForestryScene,
  delivery: DeliveryScene,
  kiln: KilnScene,
  room: WarmRoomScene,
} as const;

export type SceneName = keyof typeof scenes;

interface PhotoProps {
  scene: SceneName;
  /** Describes the image for assistive technology. */
  alt: string;
  className?: string;
  /** Tailwind aspect-ratio utility, e.g. `aspect-[4/3]`. */
  ratio?: string;
  /** Optional caption rendered over the bottom of the image. */
  caption?: React.ReactNode;
  rounded?: boolean;
}

/**
 * A photograph-shaped container. Swapping in real imagery later means
 * replacing the `<Scene>` element with an `<img>` — nothing else changes.
 */
export function Photo({ scene, alt, className, ratio = 'aspect-[4/3]', caption, rounded = true }: PhotoProps) {
  const Scene = scenes[scene];
  return (
    <figure
      className={cn(
        'relative isolate overflow-hidden bg-muted shadow-card',
        rounded && 'rounded-xl',
        ratio,
        className,
      )}
    >
      <Scene />
      <span className="sr-only">{alt}</span>
      {caption ? (
        <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-foreground/85 to-transparent px-5 pb-4 pt-10 text-sm font-medium text-white">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
