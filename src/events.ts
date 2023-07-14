import { createEventBus, slot } from "ts-event-bus";

export const Events = {
  reset: slot<void>(),
  waypoint2: slot<void>(),
  zoomOut: slot<void>(),
  zoomIn: slot<void>(),
  toggleBaseballCard: slot<number>()
};

export const EventBus = createEventBus({
  events: Events
});
