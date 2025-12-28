import type { MapboxHelper } from "@/mapboxHelper";

export interface MapboxViewerProps {
  className?: string;
  style?: React.CSSProperties;
  mapOptions?: Omit<mapboxgl.MapOptions, 'container'>;
  onMapLoad?: (map: MapboxHelper) => void;
}