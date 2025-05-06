import { createContext } from "react";

export const SheetPresenceItemContext = createContext<{
  onExitTransitionEnd: () => void;
  isUnMounted: boolean;
}>({
  onExitTransitionEnd: () => {},
  isUnMounted: false,
});
