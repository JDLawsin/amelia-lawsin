import { GitCompare, Heart, Printer } from "lucide-react";

/** Static toolbar before client hydration. */
const PropertyListingToolbarShell = () => (
  <div
    className="flex divide-x divide-wire rounded-xl border border-wire bg-cloud/30"
    aria-busy="true"
    aria-label="Loading listing actions"
  >
    {[
      { icon: Heart, label: "Save" },
      { icon: GitCompare, label: "Compare" },
      { icon: Printer, label: "Print" },
    ].map(({ icon: Icon, label }) => (
      <div
        key={label}
        className="flex flex-1 flex-col items-center justify-center gap-1 py-3 min-h-11 text-ash"
        aria-hidden="true"
      >
        <Icon className="h-4 w-4" />
        <span className="text-[10px] font-medium">{label}</span>
      </div>
    ))}
  </div>
);

export default PropertyListingToolbarShell;
