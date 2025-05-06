import { createContext } from "react";

export const SheetContext = createContext<{
  isVisible: boolean;
  setIsVisible: (isVisible: boolean) => void;
}>({ isVisible: false, setIsVisible: () => {} });
