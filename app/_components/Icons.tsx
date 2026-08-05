/* Thin-stroke line icons only (~1.5), sized small. The icon supports, never decorates. */

type Props = { size?: number; className?: string };

const base = (size: number) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none" as const,
  stroke: "currentColor" as const,
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
});

export const ArrowRight = ({ size = 16, className }: Props) => (
  <svg {...base(size)} className={className}>
    <path d="M4 12h15M13 6l6 6-6 6" />
  </svg>
);

export const Close = ({ size = 20, className }: Props) => (
  <svg {...base(size)} className={className}>
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);

export const Check = ({ size = 16, className }: Props) => (
  <svg {...base(size)} className={className}>
    <path d="M4 12.5l5 5 11-11" />
  </svg>
);

export const Document = ({ size = 18, className }: Props) => (
  <svg {...base(size)} className={className}>
    <path d="M14 3H7a1.5 1.5 0 0 0-1.5 1.5v15A1.5 1.5 0 0 0 7 21h10a1.5 1.5 0 0 0 1.5-1.5V7.5z" />
    <path d="M14 3v4.5h4.5" />
  </svg>
);

export const Download = ({ size = 16, className }: Props) => (
  <svg {...base(size)} className={className}>
    <path d="M12 4v11M7.5 11l4.5 4.5 4.5-4.5M4.5 19.5h15" />
  </svg>
);

export const Message = ({ size = 20, className }: Props) => (
  <svg {...base(size)} className={className}>
    <path d="M20 12.5a7.5 7.5 0 0 1-10.9 6.7L4 20.5l1.4-4.8A7.5 7.5 0 1 1 20 12.5z" />
  </svg>
);

export const Send = ({ size = 16, className }: Props) => (
  <svg {...base(size)} className={className}>
    <path d="M20 4L3 10.5l7 2.5 2.5 7z" />
  </svg>
);

export const Portal = ({ size = 16, className }: Props) => (
  <svg {...base(size)} className={className}>
    <path d="M4 20v-9.5L12 4l8 6.5V20" />
    <path d="M9.5 20v-6h5v6" />
  </svg>
);
