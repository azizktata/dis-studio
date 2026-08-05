/**
 * Line drawings standing in for the projects delivered as PDF drawing sets.
 *
 * The client supplied no renders for those projects, so rather than a blank
 * placeholder each tile shows a small plan figure in the spirit of the actual
 * deliverable. They are illustrative — never presented as the drawings
 * themselves.
 */

type Props = { variant: string; className?: string };

const shell = {
  fill: "none" as const,
  stroke: "currentColor" as const,
  strokeWidth: 1.25,
  vectorEffect: "non-scaling-stroke" as const,
};

const hair = { ...shell, strokeWidth: 0.6, opacity: 0.75 };

export default function PlanFigure({ variant, className }: Props) {
  if (variant === "maison-de-culture") {
    // Auditorium: radial seating around a stage.
    return (
      <svg viewBox="0 0 200 150" className={className} aria-hidden="true">
        <rect x="12" y="12" width="176" height="126" {...shell} />
        <path d="M12 44h176" {...hair} />
        <path d="M74 138V44" {...hair} />
        <path d="M126 138V44" {...hair} />
        <rect x="82" y="52" width="36" height="18" {...shell} />
        {[0, 1, 2, 3].map((i) => (
          <path
            key={i}
            d={`M${58 - i * 8} ${88 + i * 11}q42 ${18 + i * 3} 84 0`}
            {...hair}
          />
        ))}
        <circle cx="100" cy="61" r="3" {...shell} />
        <path d="M12 24h30M158 24h30" {...hair} />
      </svg>
    );
  }

  if (variant === "duplex-studios") {
    // Duplex: two stacked units with a shared stair core.
    return (
      <svg viewBox="0 0 200 150" className={className} aria-hidden="true">
        <rect x="12" y="12" width="176" height="126" {...shell} />
        <path d="M100 12v126" {...shell} />
        <path d="M12 78h88" {...shell} />
        <rect x="112" y="26" width="30" height="42" {...hair} />
        <rect x="150" y="26" width="26" height="42" {...hair} />
        <rect x="112" y="84" width="64" height="40" {...hair} />
        {[0, 1, 2, 3, 4].map((i) => (
          <path key={i} d={`M26 ${94 + i * 8}h34`} {...hair} />
        ))}
        <rect x="26" y="90" width="34" height="40" {...shell} />
        <path d="M26 26h48v38H26z" {...hair} />
        <path d="M74 45a10 10 0 0 1-10 10" {...hair} />
      </svg>
    );
  }

  if (variant === "pharmacie-showroom") {
    // Retail: perimeter shelving, counter, display island.
    return (
      <svg viewBox="0 0 200 150" className={className} aria-hidden="true">
        <rect x="12" y="12" width="176" height="126" {...shell} />
        <path d="M12 30h176" {...hair} />
        <rect x="20" y="38" width="14" height="70" {...hair} />
        <rect x="166" y="38" width="14" height="70" {...hair} />
        <rect x="70" y="60" width="60" height="24" {...shell} />
        <path d="M44 122h112" {...shell} />
        <path d="M78 122v-14M122 122v-14" {...hair} />
        <circle cx="100" cy="72" r="5" {...hair} />
        <path d="M12 138h56M132 138h56" {...hair} />
      </svg>
    );
  }

  // Villa: L-plan with terrace and pool edge.
  return (
    <svg viewBox="0 0 200 150" className={className} aria-hidden="true">
      <path d="M12 12h108v54h68v72H12z" {...shell} />
      <path d="M120 66h68" {...hair} />
      <path d="M64 12v54" {...hair} />
      <path d="M12 92h108" {...hair} />
      <rect x="24" y="24" width="30" height="32" {...hair} />
      <rect x="76" y="24" width="34" height="32" {...hair} />
      <rect x="132" y="80" width="44" height="34" {...hair} />
      <path d="M24 104h40v22H24z" {...hair} />
      <path d="M120 40a12 12 0 0 1-12 12" {...hair} />
      <circle cx="100" cy="110" r="9" {...hair} />
    </svg>
  );
}
