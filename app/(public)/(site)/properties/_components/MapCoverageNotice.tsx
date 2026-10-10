import { Info } from "lucide-react";
import {
  getMapCoverageDescription,
  type MapCoverageContext,
} from "@/lib/map-coverage";

type MapCoverageNoticeProps = {
  mapCount: number;
  totalCount: number;
  context: MapCoverageContext;
};

const MapCoverageNotice = ({
  mapCount,
  totalCount,
  context,
}: MapCoverageNoticeProps) => (
  <div
    className="flex items-start gap-2 bg-white/95 border border-wire rounded-lg shadow-apple px-3 py-2 text-xs leading-snug text-ash backdrop-blur-sm"
    role="note"
  >
    <Info className="w-3.5 h-3.5 shrink-0 mt-0.5 text-fog" aria-hidden="true" />
    <p>{getMapCoverageDescription(mapCount, totalCount, context)}</p>
  </div>
);

export default MapCoverageNotice;
