import { MapController } from "@deck.gl/core";
// base Controller would not work for some reason

// render a list of the current keybinds and
// map it out in if/else switch/case ?
// how do we feed the hotkeys into the event?
export class CustomController extends MapController {
  constructor(props) {
    super(props);
    this.events = ["keydown"];
    this.keysPressed = new Set();
  }
  // how do we properly capture the keys
  // each event on keydown, etc.
  // is only returning 1 key

  // likely need to traverse srcEvent in event
  // to find the keys
  handleEvent(event) {
    if (event.type === "keydown") {
      // // do something
      // this.keysPressed.add()
      // console.log(this.eventManager);
      // console.log({ event });
    } else {
      super.handleEvent(event);
    }
  }
}
