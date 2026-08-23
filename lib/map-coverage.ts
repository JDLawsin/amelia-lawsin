export type MapCoverageContext = "map-desktop" | "map-mobile" | "list-mobile";

const getHiddenListingsLead = (hiddenCount: number): string => {
  const listingWord = hiddenCount === 1 ? "listing" : "listings";
  const verb = hiddenCount === 1 ? "doesn't" : "don't";
  return `Not every listing appears on the map—${hiddenCount} ${listingWord} ${verb} have a map location yet.`;
};

const getListAction = (
  context: MapCoverageContext,
  totalCount: number,
): string => {
  switch (context) {
    case "map-desktop":
      return `Use the list beside the map to see all ${totalCount} matches.`;
    case "map-mobile":
      return `Swipe up the list below to see all ${totalCount} matches.`;
    case "list-mobile":
      return `All ${totalCount} matches are in this list, including those without a map pin.`;
  }
};

const getFallbackAction = (context: MapCoverageContext): string => {
  switch (context) {
    case "map-desktop":
      return "Use the list beside the map to see every matching property.";
    case "map-mobile":
      return "";
    case "list-mobile":
      return "This list includes every match—only listings with a map location appear on the map.";
  }
};

export const getMapCoverageDescription = (
  mapCount: number,
  totalCount: number,
  context: MapCoverageContext = "map-desktop",
): string => {
  const hiddenCount = Math.max(0, totalCount - mapCount);
  if (hiddenCount > 0) {
    return `${getHiddenListingsLead(hiddenCount)} ${getListAction(context, totalCount)}`;
  }

  if (context === "list-mobile") {
    return "This list includes every match—only listings with a map location appear on the map.";
  }

  return `Only listings with a map location appear here. ${getFallbackAction(context)}`;
};
