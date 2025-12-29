import type { MapboxHelper } from "@/mapboxHelper";
import { create } from "zustand";

interface MapboxHelperStoreState {
  map: MapboxHelper | null;
  setMapboxHelper: (map: MapboxHelper | null) => void;
}

export const useMapboxHelperStore = create<MapboxHelperStoreState>((set) => ({
  map: null,
  setMapboxHelper: (map: MapboxHelper | null) => set({ map }),
}))