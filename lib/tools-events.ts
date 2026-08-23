export const TOOLS_OPEN_FAVORITES_EVENT = "amelia:tools-open-favorites";
export const TOOLS_OPEN_COMPARE_EVENT = "amelia:tools-open-compare";

export const dispatchOpenFavorites = () => {
  window.dispatchEvent(new CustomEvent(TOOLS_OPEN_FAVORITES_EVENT));
};

export const dispatchOpenCompare = () => {
  window.dispatchEvent(new CustomEvent(TOOLS_OPEN_COMPARE_EVENT));
};
