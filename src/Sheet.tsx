import React, { useEffect, useRef, useState } from "react";

type Props = {
  children: React.ReactNode;
  onClose: () => void;
};

export default function Sheet({ children, onClose }: Props) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const initialScrollDone = useRef(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => {
      setIsVisible(true);
    });
  }, []);

  useEffect(() => {
    const container = scrollContainerRef.current;

    if (!container) return;

    requestAnimationFrame(() => {
      container.scrollLeft = container.offsetWidth;
      initialScrollDone.current = true;
    });
  }, []);

  function handleRequestClose() {
    initialScrollDone.current = false;
    setIsVisible(false);
  }

  function handleScroll(event: React.UIEvent<HTMLDivElement>) {
    if (initialScrollDone.current && event.currentTarget.scrollLeft < 1) {
      handleRequestClose();
    }
  }

  function handleTransitionEnd(event: React.TransitionEvent<HTMLDivElement>) {
    if (event.propertyName === "transform" && !isVisible) {
      onClose();
    }
  }

  return (
    <div
      className='sheet-overlay'
      style={{ transform: isVisible ? "translateX(0)" : "translateX(100%)" }}
      onTransitionEnd={handleTransitionEnd}
    >
      <div
        ref={scrollContainerRef}
        className='sheet-scroll-container'
        onScroll={handleScroll}
      >
        <div className='sheet-back-area'></div>

        <div className='sheet-content-area'>
          <button className='back-button' onClick={handleRequestClose}>
            ←
          </button>
          {children}
        </div>
      </div>
    </div>
  );
}
