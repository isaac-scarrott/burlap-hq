import React, {
  ComponentPropsWithoutRef,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import clsx from "clsx";

import styles from "./sheet.module.css";
import { SheetPresenceItemContext } from "./SheetPresenceContext";
import { RemoveScroll } from "react-remove-scroll";

/**
 * Sliding overlay that behaves like a card-stack "sheet".
 *
 * It automatically plays an enter animation on mount, supports swipe‑to‑dismiss, and
 * co‑operates with a surrounding stack controller provided by `SheetPresenceItemContext`.
 */
export type SheetProps = ComponentPropsWithoutRef<"div"> & {
  onClose: () => void;
};

export function Sheet({
  children,
  onClose,
  className,
  style,
  onTransitionEnd,
  ...rest
}: SheetProps) {
  const horizontalScrollContainerRef = useRef<HTMLDivElement>(null);
  const hasAutoScrolled = useRef(false);
  const [shouldBeTransitionedIn, setShouldBeTransitionedIn] = useState(false);

  const { onExitTransitionEnd, isUnMounted } = useContext(
    SheetPresenceItemContext
  );

  /* ------------------------------------------------------------------
   * Lifecycle
   * ------------------------------------------------------------------*/

  // Trigger the enter animation on the next frame so that CSS transitions run
  useEffect(() => {
    const id = requestAnimationFrame(() => setShouldBeTransitionedIn(true));

    return () => cancelAnimationFrame(id);
  }, []);

  // Auto‑scroll the container so the content starts fully on‑screen, allowing
  // users to swipe right to close.
  useEffect(() => {
    const node = horizontalScrollContainerRef.current;

    if (!node) return;

    const id = requestAnimationFrame(() => {
      node.scrollLeft = node.offsetWidth;
      hasAutoScrolled.current = true;
    });

    return () => cancelAnimationFrame(id);
  }, []);

  /* ------------------------------------------------------------------
   * Handlers
   * ------------------------------------------------------------------*/

  const executeClose = useCallback(() => {
    hasAutoScrolled.current = false;
    setShouldBeTransitionedIn(false);

    if (!isUnMounted) {
      onClose();
    }
  }, [isUnMounted, onClose]);

  function handleScroll(e: React.UIEvent<HTMLDivElement>) {
    if (!hasAutoScrolled.current) return;
    if (e.currentTarget.scrollLeft >= 1) return;

    executeClose();
  }

  function handleTransitionEnd(e: React.TransitionEvent<HTMLDivElement>) {
    onTransitionEnd?.(e);

    if (e.propertyName !== "transform") return;

    if (!shouldBeTransitionedIn) {
      if (!isUnMounted) {
        onClose();
      }
      onExitTransitionEnd();
    }
  }

  useEffect(() => {
    if (!isUnMounted) return;
    if (!shouldBeTransitionedIn) return;

    setShouldBeTransitionedIn(false);
  }, [isUnMounted, shouldBeTransitionedIn]);

  /* ------------------------------------------------------------------*/

  return createPortal(
    <RemoveScroll
      {...rest}
      removeScrollBar={false}
      as='div'
      className={styles.sheetOverlay}
      data-is-visible={shouldBeTransitionedIn}
      {...({
        onTransitionEnd: handleTransitionEnd,
      } as React.HTMLAttributes<HTMLDivElement>)}
    >
      <div
        ref={horizontalScrollContainerRef}
        className={styles.sheetScrollContainer}
        onScroll={handleScroll}
      >
        <div className={styles.sheetBackArea} />

        <div className={styles.sheetContentArea} style={style}>
          <button
            type='button'
            className={clsx(styles.backButton, className)}
            aria-label='Go back'
            onClick={executeClose}
          >
            ←
          </button>
          {children}
        </div>
      </div>
    </RemoveScroll>,
    document.body
  );
}
