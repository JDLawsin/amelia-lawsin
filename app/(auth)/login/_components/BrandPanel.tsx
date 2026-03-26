import Logo from "@/components/ui/Logo";
import { ShieldCheck, Clock, LayoutGrid } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import TrustPill from "./TrustPill";

export type TrustItem = {
  icon: LucideIcon;
  title: string;
  desc: string;
};

const TRUST_ITEMS: TrustItem[] = [
  {
    icon: ShieldCheck,
    title: "Verified & trusted agent",
    desc: "Licensed professional you can rely on",
  },
  {
    icon: Clock,
    title: "Real-time listings",
    desc: "Browse properties updated daily",
  },
  {
    icon: LayoutGrid,
    title: "All property types",
    desc: "Residential, condo, commercial & more",
  },
];

export const BrandPanel = () => (
  <aside
    aria-label="About Amelia Lawsin Real Estate"
    className="relative hidden lg:flex flex-col justify-between bg-ink p-12 overflow-hidden space-y-4"
  >
    <div className="relative z-10 flex items-center gap-2.5">
      <Logo variant="dark" />
    </div>

    <div className="relative z-10 space-y-8">
      <ul className="space-y-2.5" aria-label="Why choose Amelia">
        {TRUST_ITEMS.map((item) => (
          <TrustPill key={item.title} {...item} />
        ))}
      </ul>

      <div>
        <p className="text-[10px] font-medium uppercase tracking-widest text-white/30 mb-2.5">
          Your home journey starts here
        </p>
        <h2 className="font-serif text-[30px] font-normal text-white leading-tight tracking-[-0.01em]">
          Find your next home{" "}
          <span className="italic text-white/50">with confidence.</span>
        </h2>
      </div>
    </div>

    <small className="relative z-10 text-[11px] text-white/18 tracking-[0.03em] not-italic">
      © {new Date().getFullYear()} Amelia Lawsin Real Estate Agent
    </small>
  </aside>
);
