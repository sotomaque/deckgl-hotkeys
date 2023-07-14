import { create } from "zustand";
import { devtools } from "zustand/middleware";
import Hotkeys from "./hotkeysConfig.json";
import { immer } from "zustand/middleware/immer";

type HotkeysStore = {
  hotkeys: Partial<Record<Scope, ContextConfig>>;
  setHotkeys: (newKey: Record<string, ContextConfig>) => void;
};

type Hotkey = {
  key: string;
};

type ContextConfig = Record<string, Hotkey>;

type Scope = "global" | "baseball-card";

const HOTKEYS: Partial<Record<Scope, ContextConfig>> = Hotkeys;

export const useHotkeysStore = create<HotkeysStore>()(
  devtools(
    immer((set) => ({
      hotkeys: HOTKEYS,
      setHotkeys: (newKey: Record<string, ContextConfig>) =>
        set((state: HotkeysStore) => ({
          hotkeys: {
            ...state.hotkeys,
            global: {
              ...state.hotkeys.global,
              ...newKey.global
            }
          }
        }))
    })),
    {
      name: "hotkeys-store"
    }
  )
);
