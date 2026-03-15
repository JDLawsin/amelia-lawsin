type Props = {
  variant?: "light" | "dark";
};

const Logo = ({ variant = "light" }: Props) => {
  const isLight = variant === "light";

  const boxFill = isLight ? "#1d1d1f" : "#ffffff";
  const strokeColor = isLight ? "#ffffff" : "#1d1d1f";
  const doorFill = isLight ? "#ffffff" : "#1d1d1f";
  const doorLine = isLight ? "#1d1d1f" : "#ffffff";
  const textColor = isLight ? "#1d1d1f" : "#ffffff";
  const subColor = isLight ? "#6e6e73" : "rgba(255,255,255,0.45)";
  const divider = isLight ? "#e5e5e7" : "rgba(255,255,255,0.15)";

  return (
    <svg
      width="170"
      height="44"
      viewBox="0 0 170 44"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Amelia Lawsin"
    >
      {/* Box */}
      <rect x="2" y="2" width="38" height="38" rx="9" fill={boxFill} />

      {/* A-house path — Z closes the right leg back to peak */}
      <path
        d="M21 9 L9 35 L33 35 Z"
        fill="none"
        stroke={strokeColor}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Crossbar — the A's bar doubles as window ledge */}
      <line
        x1="14"
        y1="26"
        x2="28"
        y2="26"
        stroke={strokeColor}
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* Door */}
      <rect x="17" y="26" width="8" height="9" rx="1" fill={doorFill} />

      {/* Door center line */}
      <line x1="21" y1="26" x2="21" y2="35" stroke={doorLine} strokeWidth="1" />

      {/* Vertical divider between mark and wordmark */}
      <line x1="50" y1="8" x2="50" y2="38" stroke={divider} strokeWidth="0.8" />

      {/* Wordmark */}
      <text
        x="60"
        y="24"
        fontFamily="Georgia, serif"
        fontSize="13"
        fontWeight="600"
        fill={textColor}
        letterSpacing="-0.2"
      >
        Amelia
      </text>
      <text
        x="60"
        y="38"
        fontFamily="Georgia, serif"
        fontSize="11"
        fontWeight="400"
        fill={subColor}
        letterSpacing="1.5"
      >
        LAWSIN
      </text>
    </svg>
  );
};

export default Logo;
