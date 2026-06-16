"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  type HTMLAttributes,
  type MouseEventHandler,
  type ReactNode,
} from "react";
import {
  AnimatePresence,
  motion,
  MotionConfig,
  useReducedMotion,
  type Variants,
} from "motion/react";

import { cn } from "@/lib/utils";
import styles from "./floating-panel.module.css";

const TRANSITION = {
  type: "spring" as const,
  bounce: 0.1,
  duration: 0.4,
};

type PanelPlacement = "anchored" | "centered" | "bottom-center";

interface FloatingPanelContextType {
  isOpen: boolean;
  openFloatingPanel: (rect: DOMRect | null, title: string, placement?: PanelPlacement) => void;
  closeFloatingPanel: () => void;
  uniqueId: string;
  triggerRect: DOMRect | null;
  title: string;
  placement: PanelPlacement;
}

const FloatingPanelContext = createContext<FloatingPanelContextType | undefined>(
  undefined,
);

export function useFloatingPanel() {
  const context = useContext(FloatingPanelContext);
  if (!context) {
    throw new Error("useFloatingPanel must be used within FloatingPanelRoot");
  }
  return context;
}

function useFloatingPanelLogic() {
  const uniqueId = useId();
  const [isOpen, setIsOpen] = useState(false);
  const [triggerRect, setTriggerRect] = useState<DOMRect | null>(null);
  const [title, setTitle] = useState("");
  const [placement, setPlacement] = useState<PanelPlacement>("anchored");

  const openFloatingPanel = useCallback(
    (rect: DOMRect | null, panelTitle: string, panelPlacement: PanelPlacement = "anchored") => {
      setTriggerRect(rect);
      setTitle(panelTitle);
      setPlacement(panelPlacement);
      setIsOpen(true);
    },
    [],
  );

  const closeFloatingPanel = useCallback(() => {
    setIsOpen(false);
  }, []);

  return {
    isOpen,
    openFloatingPanel,
    closeFloatingPanel,
    uniqueId,
    triggerRect,
    title,
    placement,
  };
}

interface FloatingPanelRootProps {
  children: ReactNode;
  className?: string;
}

export function FloatingPanelRoot({ children, className }: FloatingPanelRootProps) {
  const floatingPanelLogic = useFloatingPanelLogic();

  return (
    <FloatingPanelContext.Provider value={floatingPanelLogic}>
      <MotionConfig transition={TRANSITION}>
        <div className={cn(styles.root, className)}>{children}</div>
      </MotionConfig>
    </FloatingPanelContext.Provider>
  );
}

interface FloatingPanelTriggerProps {
  children: ReactNode;
  className?: string;
  title: string;
}

export function FloatingPanelTrigger({
  children,
  className,
  title,
}: FloatingPanelTriggerProps) {
  const { openFloatingPanel, uniqueId } = useFloatingPanel();
  const triggerRef = useRef<HTMLButtonElement>(null);

  const handleClick = () => {
    if (triggerRef.current) {
      openFloatingPanel(triggerRef.current.getBoundingClientRect(), title);
    }
  };

  return (
    <motion.button
      ref={triggerRef}
      layoutId={`floating-panel-trigger-${uniqueId}`}
      className={cn(styles.trigger, className)}
      type="button"
      onClick={handleClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-haspopup="dialog"
    >
      <motion.div
        layoutId={`floating-panel-label-container-${uniqueId}`}
        className={styles.triggerLabelWrap}
      >
        <motion.span
          layoutId={`floating-panel-label-${uniqueId}`}
          className={styles.triggerLabel}
        >
          {children}
        </motion.span>
      </motion.div>
    </motion.button>
  );
}

interface FloatingPanelContentProps {
  children: ReactNode;
  className?: string;
  header?: ReactNode;
  titleId?: string;
}

export function FloatingPanelContent({
  children,
  className,
  header,
  titleId,
}: FloatingPanelContentProps) {
  const { isOpen, closeFloatingPanel, uniqueId, triggerRect, title, placement } =
    useFloatingPanel();
  const contentRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const [panelStyle, setPanelStyle] = useState<React.CSSProperties>({});
  const [panelWidth, setPanelWidth] = useState<number | undefined>(undefined);

  const resolvedTitleId = titleId ?? `floating-panel-title-${uniqueId}`;

  const updatePanelPosition = useCallback(() => {
    if (placement === "bottom-center" && triggerRect?.width) {
      setPanelWidth(
        Math.min(Math.max(triggerRect.width, 288), window.innerWidth - 32),
      );
    } else {
      setPanelWidth(undefined);
    }

    if (placement === "centered" || placement === "bottom-center" || !triggerRect) {
      setPanelStyle({});
      return;
    }

    const margin = 16;
    const panelWidth = Math.min(340, window.innerWidth - margin * 2);
    const panelHeight = contentRef.current?.offsetHeight ?? 480;

    let left = Math.min(
      Math.max(triggerRect.left, margin),
      window.innerWidth - panelWidth - margin,
    );

    let top = triggerRect.bottom + 8;

    if (top + panelHeight > window.innerHeight - margin) {
      const aboveTop = triggerRect.top - panelHeight - 8;
      if (aboveTop >= margin) {
        top = aboveTop;
      } else {
        top = Math.max(margin, window.innerHeight - panelHeight - margin);
      }
    }

    left = Math.min(
      Math.max(left, margin),
      window.innerWidth - panelWidth - margin,
    );

    setPanelStyle({
      left,
      top,
      transformOrigin: top < triggerRect.top ? "bottom left" : "top left",
    });
  }, [placement, triggerRect]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    updatePanelPosition();
    window.addEventListener("resize", updatePanelPosition);
    window.addEventListener("scroll", updatePanelPosition, true);

    return () => {
      window.removeEventListener("resize", updatePanelPosition);
      window.removeEventListener("scroll", updatePanelPosition, true);
    };
  }, [isOpen, updatePanelPosition]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const frame = window.requestAnimationFrame(updatePanelPosition);
    return () => window.cancelAnimationFrame(frame);
  }, [isOpen, children, updatePanelPosition]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Node)) {
        return;
      }
      if (contentRef.current?.contains(target)) {
        return;
      }
      closeFloatingPanel();
    };

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [closeFloatingPanel, isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeFloatingPanel();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [closeFloatingPanel, isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  const variants: Variants = reduceMotion
    ? {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
      }
    : placement === "bottom-center"
      ? {
          hidden: { opacity: 0, x: "-50%", y: 28, scale: 0.98 },
          visible: { opacity: 1, x: "-50%", y: 0, scale: 1 },
        }
      : placement === "centered"
        ? {
            hidden: { opacity: 0, scale: 0.94 },
            visible: { opacity: 1, scale: 1 },
          }
        : {
            hidden: { opacity: 0, scale: 0.92, y: 12 },
            visible: { opacity: 1, scale: 1, y: 0 },
          };

  const resolvedWidth = panelWidth;

  return (
    <AnimatePresence>
      {isOpen ? (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={styles.backdrop}
            aria-hidden
          />
          <motion.div
            ref={contentRef}
            layoutId={`floating-panel-${uniqueId}`}
            className={cn(
              styles.panel,
              placement === "centered" && styles.panelCentered,
              placement === "bottom-center" && styles.panelBottomCenter,
              className,
            )}
            style={{
              ...(placement === "centered" || placement === "bottom-center"
                ? undefined
                : panelStyle),
              ...(resolvedWidth ? { width: resolvedWidth } : undefined),
            }}
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={variants}
            role="dialog"
            aria-modal="true"
            aria-labelledby={resolvedTitleId}
          >
            {header ?? <FloatingPanelTitle titleId={resolvedTitleId}>{title}</FloatingPanelTitle>}
            {children}
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}

interface FloatingPanelTitleProps {
  children: ReactNode;
  titleId: string;
}

function FloatingPanelTitle({ children, titleId }: FloatingPanelTitleProps) {
  const { uniqueId } = useFloatingPanel();

  return (
    <motion.div
      layoutId={`floating-panel-label-container-${uniqueId}`}
      className={styles.panelTitleWrap}
    >
      <motion.div
        layoutId={`floating-panel-label-${uniqueId}`}
        className={styles.panelTitle}
        id={titleId}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

export function FloatingPanelHeader({
  children,
  className,
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <motion.div
      className={cn(styles.header, className)}
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.08 }}
    >
      {children}
    </motion.div>
  );
}

export function FloatingPanelBody({
  children,
  className,
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <motion.div
      className={cn(styles.body, className)}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.14 }}
    >
      {children}
    </motion.div>
  );
}

export function FloatingPanelFooter({
  children,
  className,
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <motion.div
      className={cn(styles.footer, className)}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      {children}
    </motion.div>
  );
}

export function FloatingPanelCloseButton({ className }: { className?: string }) {
  const { closeFloatingPanel } = useFloatingPanel();

  return (
    <motion.button
      type="button"
      className={cn(styles.closeButton, className)}
      onClick={closeFloatingPanel}
      aria-label="Close panel"
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.92 }}
    >
      <svg
        aria-hidden
        width={16}
        height={16}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.75}
        strokeLinecap="round"
      >
        <path d="M15 18l-6-6 6-6" />
      </svg>
    </motion.button>
  );
}

interface FloatingPanelButtonProps {
  children: ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  className?: string;
  href?: string;
}

export function FloatingPanelButton({
  children,
  onClick,
  className,
  href,
}: FloatingPanelButtonProps) {
  if (href) {
    return (
      <a
        href={href}
        className={cn(styles.actionButton, className)}
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    );
  }

  return (
    <motion.button
      type="button"
      className={cn(styles.actionButton, className)}
      onClick={onClick}
      whileTap={{ scale: 0.98 }}
    >
      {children}
    </motion.button>
  );
}

export function FloatingPanelDivider() {
  return <div className={styles.divider} aria-hidden />;
}

export const FloatingPanel = {
  Root: FloatingPanelRoot,
  Trigger: FloatingPanelTrigger,
  Content: FloatingPanelContent,
  Header: FloatingPanelHeader,
  Body: FloatingPanelBody,
  Footer: FloatingPanelFooter,
  CloseButton: FloatingPanelCloseButton,
  Button: FloatingPanelButton,
  Divider: FloatingPanelDivider,
};
