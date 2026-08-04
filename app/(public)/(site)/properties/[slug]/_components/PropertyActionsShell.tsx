import { GitCompare, Heart } from "lucide-react";

type Props = {
  size?: "sm" | "md";
};

/** Static save/compare buttons before client hydration. */
const PropertyActionsShell = ({ size = "md" }: Props) => {
  const iconSize = size === "md" ? "w-5 h-5" : "w-4 h-4";
  const buttonSize = size === "md" ? "w-9 h-9" : "w-8 h-8";

  return (
    <div
      className="flex items-center gap-2 rounded-xl border border-wire bg-cloud/50 p-1.5"
      aria-busy="true"
      aria-label="Loading save and compare actions"
    >
      <div
        className={`${buttonSize} flex items-center justify-center rounded-full bg-white/90 border border-wire`}
        aria-hidden="true"
      >
        <Heart className={`${iconSize} text-ash`} />
      </div>
      <div
        className={`${buttonSize} flex items-center justify-center rounded-full bg-white/90 border border-wire`}
        aria-hidden="true"
      >
        <GitCompare className={`${iconSize} text-ash`} />
      </div>
    </div>
  );
};

export default PropertyActionsShell;
