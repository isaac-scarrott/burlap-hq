import { ReactNode, ReactElement, Children, isValidElement } from "react";

export function onlyElements(children: ReactNode): ReactElement[] {
  const filtered: ReactElement[] = [];

  Children.forEach(children, (child) => {
    if (isValidElement(child)) filtered.push(child);
  });

  return filtered;
}

export function getChildKey(child: ReactElement): string {
  return child.key ?? "";
}
