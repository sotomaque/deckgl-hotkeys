import * as React from "react";
import { useHotkeysStore } from "../useHotkeysStore";
import { useHotkeys } from "react-hotkeys-hook";
import { EventBus } from "../events";

const RegisterHotkey = ({ fnName, hotkey, cb, scope, hotkeys }) => {
  useHotkeys(
    hotkey,
    () => {
      // console.log(`pressed ${hotkey} to ${fnName} in ${scope}`);
      cb();
    },
    { scopes: scope },
    [hotkeys]
  );

  return null;
};

export const RegisterHotkeys = () => {
  const hotkeys = useHotkeysStore((state) => state.hotkeys);

  return (
    <div className="hotkeys">
      {Object.entries(hotkeys).map(([scope, configs]) => {
        return Object.entries(configs).map(([fnName, config]) => {
          if (Array.isArray(config)) {
            return config.map(({ key: hotkey, payload }, idx) => {
              return (
                <RegisterHotkey
                  fnName={fnName}
                  key={`${scope}-${fnName}-${idx}`}
                  hotkey={hotkey}
                  cb={() => EventBus[fnName](payload)}
                  scope={scope}
                  hotkeys={hotkeys}
                />
              );
            });
          }

          const { key: hotkey, payload } = config;
          return (
            <RegisterHotkey
              fnName={fnName}
              key={`${scope}-${fnName}`}
              hotkey={hotkey}
              cb={() => EventBus[fnName](payload)}
              scope={scope}
              hotkeys={hotkeys}
            />
          );
        });
      })}
    </div>
  );
};
