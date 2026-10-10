import "leaflet.markercluster";

import type * as L from "leaflet";

declare module "leaflet" {
  interface MarkerClusterGroupOptions extends L.LayerOptions {
    chunkedLoading?: boolean;
  }

  class MarkerClusterGroup extends L.Layer {
    addLayer(layer: L.Layer): this;
    removeLayer(layer: L.Layer): this;
  }

  namespace markerClusterGroup {
    function markerClusterGroup(
      options?: MarkerClusterGroupOptions,
    ): MarkerClusterGroup;
  }

  function markerClusterGroup(
    options?: MarkerClusterGroupOptions,
  ): MarkerClusterGroup;
}
