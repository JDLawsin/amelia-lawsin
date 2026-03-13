type Props = {
  variant?: "light" | "dark";
};

const Logo = ({ variant = "light" }: Props) => {
  const textColor = variant === "dark" ? "#ffffff" : "#1A3A2A";

  return (
    <svg
      width="180"
      height="48"
      viewBox="0 0 180 48"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="42" height="42" x="3" y="3" rx="6" fill="#1A3A2A" />
      <polygon
        points="24,10 39,22 39,38 9,38 9,22"
        fill="#1A3A2A"
        stroke="#C9A84C"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <polygon
        points="24,10 39,22 9,22"
        fill="#C9A84C"
        strokeLinejoin="round"
      />
      <rect x="19" y="28" width="10" height="10" rx="1" fill="#C9A84C" />
      <line x1="24" y1="28" x2="24" y2="38" stroke="#1A3A2A" strokeWidth="1" />
      <line x1="19" y1="33" x2="29" y2="33" stroke="#1A3A2A" strokeWidth="1" />

      <text
        x="52"
        y="22"
        fontFamily="Georgia, serif"
        fontSize="15"
        fontWeight="600"
        fill={textColor}
      >
        {"Amelia"}
      </text>
      <text
        x="52"
        y="38"
        fontFamily="Georgia, serif"
        fontSize="15"
        fontWeight="600"
        fill={textColor}
      >
        {"Lawsin"}
      </text>
      <line
        x1="52"
        y1="25"
        x2="172"
        y2="25"
        stroke="#C9A84C"
        strokeWidth="0.8"
      />
    </svg>
  );
};

export default Logo;
