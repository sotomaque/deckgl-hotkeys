import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { EventBus } from "./events";

type ViewState = {
  longitude: number;
  latitude: number;
  zoom: number;
  pitch?: number;
  bearing?: number;
  maxZoom?: number;
  minZoom?: number;
  maxPitch?: number;
  minPitch?: number;
};

type ViewStateStore = {
  viewState: ViewState;
  setViewState: (viewState: ViewState) => void;
};

export const useViewStateStore = create<ViewStateStore>()(
  devtools(
    immer((set) => ({
      viewState: {
        longitude: -122.41669,
        latitude: 37.7853,
        zoom: 13,
        pitch: 0,
        bearing: 0
      },
      setViewState: (newState: Partial<ViewState>) =>
        set((state: ViewStateStore) => ({
          viewState: { ...state.viewState, ...newState }
        }))
    })),
    {
      name: "view-state-store"
    }
  )
);

EventBus.reset.on(() => {
  console.log("Received `reset` event.");
  useViewStateStore.getState().setViewState({
    longitude: -122.41669,
    latitude: 37.7853,
    zoom: 13
  });
});

EventBus.waypoint2.on(() => {
  console.log("Received `waypoint2` event.");
  useViewStateStore.getState().setViewState({
    zoom: 13,
    latitude: 38.9,
    longitude: -77.03
  });
});

EventBus.zoomIn.on(() => {
  console.log("Received `zoomIn` event.");
  useViewStateStore.setState((state) => {
    state.viewState.zoom += 2;
  });
});

EventBus.zoomOut.on(() => {
  console.log("Received `zoomOut` event.");
  useViewStateStore.setState((state) => {
    state.viewState.zoom -= 2;
  });
});
