import { createContext } from "react";

export const SheetPresenceItemContext = createContext<{
  onExitTransitionEnd: () => void;
  isExiting: boolean;
}>({
  onExitTransitionEnd: () => {},
  isExiting: false,
});
