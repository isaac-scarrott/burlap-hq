import React, {
  ComponentPropsWithoutRef,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import clsx from "clsx";

import styles from "./sheet.module.css";
import { SheetPresenceItemContext } from "./SheetPresenceContext";

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
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const hasAutoScrolled = useRef(false);
  const [isVisible, setIsVisible] = useState(false);

  const { onExitTransitionEnd, isExiting } = useContext(
    SheetPresenceItemContext
  );

  /* ------------------------------------------------------------------
   * Lifecycle
   * ------------------------------------------------------------------*/

  // Trigger the enter animation on the next frame so that CSS transitions run
  useEffect(() => {
    const id = requestAnimationFrame(() => setIsVisible(true));
    return () => cancelAnimationFrame(id);
  }, []);

  // Auto‑scroll the container so the content starts fully on‑screen, allowing
  // users to swipe right to close.
  useEffect(() => {
    const node = scrollContainerRef.current;
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
    setIsVisible(false);

    if (!isExiting) {
      onClose();
    }
  }, [isExiting, onClose]);

  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      if (hasAutoScrolled.current && e.currentTarget.scrollLeft < 1) {
        executeClose();
      }
    },
    [executeClose]
  );

  const handleTransitionEnd = useCallback(
    (e: React.TransitionEvent<HTMLDivElement>) => {
      onTransitionEnd?.(e);
      if (e.propertyName !== "transform") return;

      if (!isVisible) {
        if (!isExiting) {
          onClose();
        }
        onExitTransitionEnd();
      }
    },
    [isVisible, isExiting, onClose, onExitTransitionEnd, onTransitionEnd]
  );

  useEffect(() => {
    if (isExiting && isVisible) setIsVisible(false);
  }, [isExiting, isVisible]);

  /* ------------------------------------------------------------------*/

  return (
    <div
      {...rest}
      className={clsx(styles.sheetOverlay, className)}
      style={{
        ...style,
        transform: isVisible ? "translateX(0)" : "translateX(100%)",
      }}
      onTransitionEnd={handleTransitionEnd}
    >
      <div
        ref={scrollContainerRef}
        className={styles.sheetScrollContainer}
        onScroll={handleScroll}
      >
        <div className={styles.sheetBackArea} />

        <div className={styles.sheetContentArea}>
          <button
            type='button'
            className={styles.backButton}
            aria-label='Go back'
            onClick={executeClose}
          >
            ←
          </button>

          {children}
        </div>
      </div>
    </div>
  );
}
