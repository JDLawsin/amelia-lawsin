export type VirtualTourProvider = "youtube" | "vimeo" | "matterport";

export type ParsedVirtualTour = {
  provider: VirtualTourProvider;
  embedUrl: string;
  watchUrl: string;
};

const parseYoutube = (url: URL): ParsedVirtualTour | null => {
  let id: string | null = null;

  if (url.hostname === "youtu.be") {
    id = url.pathname.split("/").filter(Boolean)[0] ?? null;
  } else if (url.hostname.endsWith("youtube.com")) {
    if (url.pathname === "/watch") {
      id = url.searchParams.get("v");
    } else if (url.pathname.startsWith("/embed/")) {
      id = url.pathname.split("/")[2] ?? null;
    } else if (url.pathname.startsWith("/shorts/")) {
      id = url.pathname.split("/")[2] ?? null;
    }
  }

  if (!id) return null;

  return {
    provider: "youtube",
    embedUrl: `https://www.youtube.com/embed/${id}`,
    watchUrl: `https://www.youtube.com/watch?v=${id}`,
  };
};

const parseVimeo = (url: URL): ParsedVirtualTour | null => {
  if (!url.hostname.endsWith("vimeo.com")) return null;

  let id: string | null = null;

  if (url.hostname === "player.vimeo.com") {
    id = url.pathname.split("/").filter(Boolean)[1] ?? null;
  } else {
    id = url.pathname.split("/").filter(Boolean)[0] ?? null;
  }

  if (!id || !/^\d+$/.test(id)) return null;

  return {
    provider: "vimeo",
    embedUrl: `https://player.vimeo.com/video/${id}`,
    watchUrl: `https://vimeo.com/${id}`,
  };
};

const parseMatterport = (url: URL): ParsedVirtualTour | null => {
  if (!url.hostname.endsWith("matterport.com")) return null;

  let modelId = url.searchParams.get("m");

  if (!modelId) {
    const pathMatch = url.pathname.match(/\/models\/([^/]+)/);
    modelId = pathMatch?.[1] ?? null;
  }

  if (!modelId) return null;

  const watchUrl = `https://my.matterport.com/show/?m=${modelId}`;

  return {
    provider: "matterport",
    embedUrl: `${watchUrl}&play=1`,
    watchUrl,
  };
};

export const parseVirtualTourUrl = (rawUrl: string): ParsedVirtualTour | null => {
  try {
    const url = new URL(rawUrl.trim());
    if (url.protocol !== "https:") return null;

    return (
      parseYoutube(url) ?? parseVimeo(url) ?? parseMatterport(url)
    );
  } catch {
    return null;
  }
};

export const isSupportedVirtualTourUrl = (rawUrl: string): boolean =>
  parseVirtualTourUrl(rawUrl) !== null;
