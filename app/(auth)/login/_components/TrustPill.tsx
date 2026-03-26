import { TrustItem } from "./BrandPanel";

const TrustPill = ({ icon: Icon, title, desc }: TrustItem) => (
  <li className="flex items-center gap-3 px-4 py-3.5 rounded-[12px] bg-white/4 border border-white/[0.07] list-none">
    <span
      aria-hidden="true"
      className="w-8 h-8 rounded-[8px] bg-white/[0.07] flex items-center justify-center shrink-0"
    >
      <Icon size={15} strokeWidth={1.25} className="text-white/60" />
    </span>
    <span>
      <span className="block text-[12px] font-medium text-white/80 leading-tight">
        {title}
      </span>
      <span className="block text-[11px] font-light text-white/30 mt-0.5">
        {desc}
      </span>
    </span>
  </li>
);

export default TrustPill;
