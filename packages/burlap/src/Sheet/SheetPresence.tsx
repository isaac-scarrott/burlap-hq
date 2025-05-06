import { ReactNode, useState, useMemo } from "react";
import { SheetPresenceItemContext } from "./SheetPresenceContext";
import { onlyElements, getChildKey } from "./SheetPresenceUtils";

type SheetPresenceProps = {
  children: ReactNode;
};

export function SheetPresence({ children }: SheetPresenceProps) {
  const presentChildren = useMemo(() => onlyElements(children), [children]);

  const [cachedChildren, setCachedChildren] = useState(presentChildren);
  const [renderedChildren, setRenderedChildren] = useState(presentChildren);

  const presentKeys = presentChildren.map(getChildKey);

  if (presentChildren !== cachedChildren) {
    // Start with present children
    const nextChildren = [...presentChildren];

    // Add all exiting children that are still in renderedChildren
    renderedChildren.forEach((child) => {
      const key = getChildKey(child);
      if (!presentKeys.includes(key)) {
        // Add exiting children to the end, or maintain their position
        // with a more sophisticated approach if needed
        nextChildren.push(child);
      }
    });

    setRenderedChildren(onlyElements(nextChildren));
    setCachedChildren(presentChildren);

    return null;
  }

  function onExitTransitionEnd(key: string) {
    setRenderedChildren((prev) =>
      prev.filter((child) => getChildKey(child) !== key)
    );
  }

  return Array.from(renderedChildren).map((child) => {
    const key = getChildKey(child);
    const isUnMounted = !presentKeys.includes(key);

    return (
      <SheetPresenceItemContext.Provider
        key={key}
        value={{
          onExitTransitionEnd: () => onExitTransitionEnd(key),
          isUnMounted,
        }}
      >
        {child}
      </SheetPresenceItemContext.Provider>
    );
  });
}
