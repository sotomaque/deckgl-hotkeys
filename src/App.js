import React from "react";
import DeckGL from "@deck.gl/react";
import { StaticMap } from "react-map-gl";
import { HotkeysProvider, useRecordHotkeys } from "react-hotkeys-hook";
import { BaseballCard } from "./components/BaseballCard";
import { RegisterHotkeys } from "./components/RegisterHotkeys";
import { useViewStateStore } from "./useViewStateStore";
import { useHotkeysStore } from "./useHotkeysStore";
import { EventBus } from "./events";

// Set your mapbox access token here
const MAPBOX_ACCESS_TOKEN = `pk.eyJ1IjoiZnJhbmNpcy1oeXBlcmdpYW50IiwiYSI6ImNsamV0Yjk0YjEyNmEzbHFlMHhwZHlsdzUifQ.EgUi_YMC3L8xGIYHh4c0Bg`;

// bndr can only offer presets
// cannot record user input
// e.g. pre define a hotkey like Ctrl + click
// and only let the user defines the function from a dropdown list?

// We could maybe bridge react hotkeys and bndr
// but that still doesn't solve the click problem
// unless we hard bind it for users

// Viewport settings
// const INITIAL_VIEW_STATE = {
//   longitude: -122.41669,
//   latitude: 37.7853,
//   zoom: 13,
//   pitch: 0,
//   bearing: 0
// };

// currently missing "features" using only react hotkeys
// 1. doesn't handle clicks
// 2. doesn't handle long presses

const layers = [];

export const App = () => {
  // it might be difficult setting view state as a useState
  // triggers rerender everytime a hot key is pressed
  // is that what we want? do we have a better way to handle it
  // const hotkeys = useViewStateStore((state) => state.hotkeys);
  const viewState = useViewStateStore((state) => state.viewState);
  const setHotkeys = useHotkeysStore((state) => state.setHotkeys);
  const setViewState = useViewStateStore((state) => state.setViewState);
  const [keys, { start, stop, isRecording }] = useRecordHotkeys();

  // for demo purpose, this will only update the zoom in func in global scope
  const handleRecordKeys = ({ scope, fnName }) => {
    const formattedKeys = [...keys].join("+");
    setHotkeys({ [scope]: { [fnName]: { key: formattedKeys } } });

    stop();

    alert(`${scope} ${fnName} is now bind to ${formattedKeys}`);
  };

  // HOW DO WE UTILIZE THE HOTKEYS LIBRARY
  // we have a set of functions
  // maybe by default we have a bunch of preset keybinds
  // key: function name (e.g. zoomIn)
  // value: keybind (e.g. alt+z)
  // meta = cmd (mac) / OS (windows)

  // custom controller to handle inputs?
  // we'll need to specify the kind of actions to take
  // hard to know how to scale this until I have
  // full picture of our current available layers
  // maybe a good time to start documenting our current layers?

  // we will need to compile a list of
  // existing shortcuts that might conflict
  // with new keybinds

  // chatted with Tony @ design
  // confirmed keybinds will be global for now
  // no need to do it by component
  // but we will need to plan for feature expansion
  // i.e. component level hotkeys

  // Current Issues:
  // useHotkeys does not record clicks

  // controller doesn't work with viewState? only with initialViewState
  // only works with initialViewState!! but why???
  // tl;dr must use in junction with onViewStateChange to reflect changes

  // ChatGPT:
  // The controller prop in DeckGL is designed to work with the initial view state provided through the initialViewState prop. It sets up the interaction and event handling based on the initial view state. However, it doesn't automatically update the view state when it changes.
  // If you want to update the view state dynamically and have the interaction work correctly, you can use the ViewState prop in the DeckGL component and manually control the view state using the setViewState function.

  return (
    <div>
      <DeckGL
        viewState={viewState}
        onViewStateChange={({ viewState }) => setViewState(viewState)}
        controller={true}
        layers={layers}
      >
        <StaticMap mapboxApiAccessToken={MAPBOX_ACCESS_TOKEN} />
      </DeckGL>
      <HotkeysProvider initiallyActiveScopes={["global"]}>
        <RegisterHotkeys />
        <div style={{ position: "absolute" }}>
          <div
            style={{
              border: "1px solid black",
              width: "200px",
              height: "150px",
              background: "white",
              padding: "0.5rem",
              margin: "0.5rem"
            }}
          >
            <p>Is recording: {isRecording ? "yes" : "no"}</p>
            <p>Recorded keys: {Array.from(keys).join(" + ")}</p>
            <br />
            <button onClick={start} disabled={isRecording}>
              Record
            </button>
            <button
              onClick={() =>
                handleRecordKeys({ scope: "global", fnName: "zoomIn" })
              }
              disabled={!isRecording}
            >
              Stop
            </button>
          </div>
          <form>
            <input />
          </form>
          <button onClick={() => EventBus.toggleBaseballCard(1)}>
            toggle card
          </button>
        </div>
        <BaseballCard index={1} />
        <BaseballCard index={2} />
      </HotkeysProvider>
    </div>
  );
};

// viewState: Object
// width: 990
// height: 686
// latitude: 37.781884325105366
// longitude: -122.42884934784115
// zoom: 13
// bearing: 0
// pitch: 0
// altitude: 1.5
// maxZoom: 20
// minZoom: 0
// maxPitch: 60
// minPitch: 0
// normalize: undefined
// transitionDuration: 300
// transitionEasing: ƒ transitionEasing() {}
// transitionInterruption: 1
// transitionInterpolator: LinearInterpolator

// Questions for team:
// How are waypoints/POI managed? Could we get the viewState object?
