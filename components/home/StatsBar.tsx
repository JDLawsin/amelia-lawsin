import { STATIC_STATS } from "@/constants";

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
    <section className="border-b border-wire">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-wire">
        {stats.map((stat) => (
          <div key={stat.label} className="px-8 py-7">
            <p className="text-4xl font-serif font-medium text-ink tracking-tight leading-none mb-1.5">
              {stat.value}
            </p>
            <p className="text-xs text-ash">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default StatsBar;
