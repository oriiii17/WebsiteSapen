type WaveDividerProps = {
  flip?: boolean;
  className?: string;
};

export function WaveDivider({ flip = false, className = "" }: WaveDividerProps) {
  return (
    <svg
      className={`wave-divider${className ? ` ${className}` : ""}`}
      viewBox="0 0 1440 80"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      <g transform={flip ? "translate(0 80) scale(1 -1)" : undefined}>
        <path d="M0 42 C122 56 214 25 354 18 C526 10 568 66 742 62 C914 58 982 20 1139 25 C1277 30 1364 58 1440 43 V80 H0 Z" fill="currentColor" />
      </g>
    </svg>
  );
}
