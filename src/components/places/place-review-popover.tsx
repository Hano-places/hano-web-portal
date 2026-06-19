"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import type { PlaceSeed } from "@/content/places";
import { getOpenStatus } from "@/lib/place-hours";
import { reviewsApi } from "@/lib/api/reviews";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import {
  CutoutCardImage,
  CutoutCardInsetLabel,
  CutoutCardMedia,
  CutoutCardOverlay,
  CutoutCardPin,
  CutoutCorner,
} from "@/components/ui/cutout-card";
import cutoutStyles from "@/components/ui/cutout-card.module.css";
import {
  FloatingPanelBody,
  FloatingPanelCloseButton,
  FloatingPanelContent,
  FloatingPanelFooter,
  FloatingPanelHeader,
  FloatingPanelRoot,
  useFloatingPanel,
} from "@/components/ui/floating-panel";
import panelStyles from "@/components/ui/floating-panel.module.css";
import { useRequireAuth } from "@/hooks/use-require-auth";
import styles from "./place-review-popover.module.css";

type PlaceReviewContextValue = {
  openPlaceReview: (place: PlaceSeed, rect: DOMRect | null) => void;
};

const PlaceReviewContext = createContext<PlaceReviewContextValue | null>(null);

export function usePlaceReview() {
  const context = useContext(PlaceReviewContext);
  if (!context) {
    throw new Error("usePlaceReview must be used within PlaceReviewProvider");
  }
  return context;
}

function PlaceReviewHero({ place }: { place: PlaceSeed }) {
  const { isOpen } = getOpenStatus(place.hours);

  return (
    <div className={styles.hero}>
      <CutoutCardMedia className={styles.heroMedia} style={{ height: "9.5rem" }}>
        <CutoutCardImage alt={place.name} sizes="340px" src={place.image} />
        <CutoutCardOverlay />

        <CutoutCardInsetLabel className={cutoutStyles.insetLabelRating}>
          <span className={cutoutStyles.insetEyebrow}>Rating</span>
          <span className={cutoutStyles.insetValue}>
            {place.rating.toFixed(1)}
            <Icon name="star" size={16} />
          </span>
          <CutoutCorner className={cutoutStyles.insetCornerRight} />
          <CutoutCorner className={cutoutStyles.insetCornerTop} />
        </CutoutCardInsetLabel>

        <CutoutCardPin className={isOpen ? cutoutStyles.pinOpen : cutoutStyles.pinClosed}>
          {isOpen ? "Open now" : "Closed"}
          <CutoutCorner
            className={isOpen ? cutoutStyles.pinCornerLeftOpen : cutoutStyles.pinCornerLeftClosed}
            size={28}
          />
          <CutoutCorner
            className={isOpen ? cutoutStyles.pinCornerBottomOpen : cutoutStyles.pinCornerBottomClosed}
            size={28}
          />
        </CutoutCardPin>
      </CutoutCardMedia>
    </div>
  );
}

function PlaceReviewPanel({ place }: { place: PlaceSeed }) {
  const titleId = useId();
  const { closeFloatingPanel } = useFloatingPanel();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await reviewsApi.createReview({
        placeId: place.id,
        rating,
        comment: comment.trim() || undefined,
      });
      setSubmitted(true);
      window.setTimeout(() => closeFloatingPanel(), 900);
    } catch {
      setError("Could not submit your review. Please try again.");
      setLoading(false);
    }
  };

  return (
    <FloatingPanelContent header={<PlaceReviewHero place={place} />} titleId={titleId}>
      <div className={panelStyles.panelLayout}>
        <div className={`${panelStyles.panelTitleBlock} ${styles.titleBlock}`}>
          <h2 className={styles.placeName} id={titleId}>
            Rate & Review
          </h2>
          <p className={styles.category}>
            {place.name} · {place.category}
          </p>
        </div>

        <form onSubmit={handleSubmit} className={`${panelStyles.panelLayout} min-h-0 flex-1`}>
          <FloatingPanelHeader className={panelStyles.panelHeaderFixed}>
            Your rating
          </FloatingPanelHeader>

          <div className={panelStyles.panelBodyScroll}>
            <FloatingPanelBody>
            <div className={styles.stars} role="radiogroup" aria-label="Star rating">
              {Array.from({ length: 5 }).map((_, index) => {
                const value = index + 1;
                const active = value <= rating;
                return (
                  <button
                    key={value}
                    type="button"
                    className={`${styles.starButton} ${active ? styles.starButtonActive : ""}`}
                    onClick={() => setRating(value)}
                    aria-label={`${value} star${value === 1 ? "" : "s"}`}
                    aria-pressed={active}
                  >
                    <Icon name="star" size={28} />
                  </button>
                );
              })}
            </div>

            <textarea
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              maxLength={275}
              placeholder="Share your experience (optional)"
              className={styles.textarea}
              disabled={loading || submitted}
            />
            <p className={styles.charCount}>{comment.length}/275</p>

            {error ? <p className={styles.error}>{error}</p> : null}
            {submitted ? (
              <p className={styles.success}>Thanks — your review was submitted.</p>
            ) : null}
            </FloatingPanelBody>
          </div>

          <FloatingPanelFooter className={panelStyles.panelFooterFixed}>
            <Button
              type="submit"
              className={styles.submitButton}
              disabled={loading || submitted}
            >
              {loading ? "Submitting..." : "Submit review"}
            </Button>
            <FloatingPanelCloseButton />
          </FloatingPanelFooter>
        </form>
      </div>
    </FloatingPanelContent>
  );
}

function PlaceReviewInner({ children }: { children: ReactNode }) {
  const [selectedPlace, setSelectedPlace] = useState<PlaceSeed | null>(null);
  const { openFloatingPanel, isOpen } = useFloatingPanel();

  const openPlaceReview = useCallback(
    (place: PlaceSeed, rect: DOMRect | null) => {
      setSelectedPlace(place);
      openFloatingPanel(rect, "Rate & Review", "centered");
    },
    [openFloatingPanel],
  );

  useEffect(() => {
    if (!isOpen) {
      const timer = window.setTimeout(() => setSelectedPlace(null), 320);
      return () => window.clearTimeout(timer);
    }
  }, [isOpen]);

  const value = useMemo(() => ({ openPlaceReview }), [openPlaceReview]);

  return (
    <PlaceReviewContext.Provider value={value}>
      {children}
      {selectedPlace ? <PlaceReviewPanel place={selectedPlace} /> : null}
    </PlaceReviewContext.Provider>
  );
}

export function PlaceReviewProvider({ children }: { children: ReactNode }) {
  return (
    <FloatingPanelRoot>
      <PlaceReviewInner>{children}</PlaceReviewInner>
    </FloatingPanelRoot>
  );
}

type RateReviewButtonProps = {
  place: PlaceSeed;
  size?: "sm" | "md" | "lg";
};

export function RateReviewButton({ place, size = "md" }: RateReviewButtonProps) {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const requireAuth = useRequireAuth();
  const { openPlaceReview } = usePlaceReview();

  const handleClick = () => {
    if (!requireAuth("review")) return;
    const rect = triggerRef.current?.getBoundingClientRect() ?? null;
    openPlaceReview(place, rect);
  };

  return (
    <Button ref={triggerRef} variant="outline" size={size} onClick={handleClick}>
      Rate & Review
    </Button>
  );
}
