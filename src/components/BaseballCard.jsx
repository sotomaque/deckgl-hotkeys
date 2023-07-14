import { useHotkeysContext } from "react-hotkeys-hook";
import * as React from "react";
import { EventBus } from "../events";

// Handles clicking outside of element
function useOutsideAlerter(ref, cb) {
  React.useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        cb();
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, cb]);
}

export const BaseballCard = ({ index }) => {
  const [isMinimized, setIsMinimized] = React.useState(false);
  const [isFocused, setIsFocused] = React.useState(false);
  const {
    // hotkeys,
    // enabledScopes,
    enableScope,
    disableScope
  } = useHotkeysContext();
  const ref = React.useRef(null);
  // console.log({ enabledScopes, hotkeys });
  useOutsideAlerter(ref, () => setIsFocused(false));

  React.useEffect(() => {
    if (isFocused) {
      disableScope("global");
      enableScope("baseball-card");
    } else {
      disableScope("baseball-card");
      enableScope("global");
    }
  }, [isFocused, enableScope, disableScope]);

  React.useEffect(() => {
    const unsubscribe = EventBus.toggleBaseballCard.on((idx) => {
      if (idx !== index) return;

      setIsMinimized((min) => !min);
    });

    return unsubscribe;
  }, []);

  return (
    <div
      ref={ref}
      onFocus={() => {
        setIsFocused(true);
      }}
      onBlur={() => {
        setIsFocused(false);
      }}
      style={
        isMinimized
          ? {
              border: `1px solid ${isFocused ? "red" : "black"}`,
              position: "absolute",
              bottom: 10,
              left: (index - 1) * 150 + 10 * index,
              background: "white",
              zIndex: 100,
              width: "150px",
              height: "20px",
              opacity: 0.5
            }
          : {
              border: `1px solid ${isFocused ? "red" : "black"}`,
              position: "absolute",
              zIndex: 100,
              height: "150px",
              width: "300px",
              background: "white",
              top: (index - 1) * 150 + 10 * index,
              right: 10,
              ":hover": "pointer"
            }
      }
      onClick={() => setIsFocused(true)}
    >
      Some content {index}
    </div>
  );
};
