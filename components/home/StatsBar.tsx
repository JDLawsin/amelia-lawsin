import { STATIC_STATS } from "@/constants";
import clsx from "clsx";

type Props = {
  activeListings: number;
};

const getStats = (activeListings: number) => [
  { value: STATIC_STATS.propertiesSold, label: "Properties sold" },
  { value: STATIC_STATS.yearsExperience, label: "Years experience" },
  { value: `${activeListings}+`, label: "Active listings" },
  { value: STATIC_STATS.clientRating, label: "Satisfied clients" },
];

const StatsBar = ({ activeListings }: Props) => {
  const stats = getStats(activeListings);

  return (
    <div className="border-y bg-white">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-center">
        {stats.map((stat, index) => (
          <div
            key={stat.label}
            className={clsx(
              "relative flex flex-col items-center justify-center px-10 py-5",
              index !== stats.length - 1 && [
                "after:absolute after:content-['']",
                "after:bottom-0 after:left-1/2 after:-translate-x-1/2",
                "after:h-px after:w-12 after:bg-cloud",
                "md:after:bottom-auto md:after:left-auto",
                "md:after:right-0 md:after:top-1/2",
                "md:after:h-12 md:after:w-px",
                "md:after:-translate-y-1/2 md:after:translate-x-0",
              ],
            )}
          >
            <span className="text-2xl font-serif font-semibold text-ink">
              {stat.value}
            </span>
            <span className="text-sm text-ash">{stat.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatsBar;
