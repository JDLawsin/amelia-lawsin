import RouteLoadingScreen from "@/components/ui/RouteLoadingScreen";

// Route-level loading state for the (public) group. Renders inside the public
// layout, so Navbar/Footer stay visible — this fills only the content slot
// during server data fetches.
export default function Loading() {
  return <RouteLoadingScreen />;
}
