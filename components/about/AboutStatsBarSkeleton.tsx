import { STATIC_STATS } from "@/constants";

/** Stats bar placeholder — static values for known stats, skeleton only for
 *  the active-listings cell that awaits the DB query (CLS). */
const AboutStatsBarSkeleton = () => {
  const staticStats = [
    { value: STATIC_STATS.propertiesSold, label: "Properties sold" },
    { value: STATIC_STATS.yearsExperience, label: "Years in Cebu" },
    { value: null, label: "Active listings" },
    { value: STATIC_STATS.clientRating, label: "Client rating" },
  ];

  return (
    <section
      className="border-b border-wire"
      aria-busy="true"
      aria-label="Loading stats"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-wire">
        {staticStats.map((stat) => (
          <div key={stat.label} className="px-8 py-7">
            {stat.value ? (
              <p className="text-4xl font-serif font-medium text-ink tracking-tight leading-none mb-1.5 min-h-11">
                {stat.value}
              </p>
            ) : (
              <div
                className="h-11 w-16 rounded bg-wire/50 mb-1.5"
                aria-hidden="true"
              />
            )}
            <p className="text-xs text-ash">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AboutStatsBarSkeleton;
