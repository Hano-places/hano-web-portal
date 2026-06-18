"use client";

import { useRouter } from "next/navigation";
import { type KeyboardEvent, type MouseEvent } from "react";
import { motion } from "motion/react";
import type { PlaceSeed } from "@/content/places";
import { getOpenStatus } from "@/lib/place-hours";
import { Icon } from "@/components/ui/icon";
import { TruncateTooltip } from "@/components/ui/truncate-tooltip";
import {
  CutoutCard,
  CutoutCardAction,
  CutoutCardContent,
  CutoutCardFooter,
  CutoutCardImage,
  CutoutCardInsetLabel,
  CutoutCardMedia,
  CutoutCardOverlay,
  CutoutCardPin,
  CutoutCorner,
  useCutoutContentStaggerVariants,
} from "@/components/ui/cutout-card";
import styles from "@/components/ui/cutout-card.module.css";
import { WishlistPlaceButton } from "@/components/wishlist/wishlist-save-button";

type PlaceCutoutCardProps = {
  place: PlaceSeed;
  href?: string;
  showOrderHint?: boolean;
};

export function PlaceCutoutCard({
  place,
  href = `/places/${place.id}`,
  showOrderHint = true,
}: PlaceCutoutCardProps) {
  const router = useRouter();
  const stagger = useCutoutContentStaggerVariants();
  const { isOpen, todayHours } = getOpenStatus(place.hours);
  const menuHref = `/places/${place.id}/menu`;

  const navigateToPlace = () => {
    router.push(href);
  };

  const handleCardClick = () => {
    navigateToPlace();
  };

  const handleCardKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      navigateToPlace();
    }
  };

  const handleOrderClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    router.push(menuHref);
  };

  return (
    <div className={styles.cardLink}>
      <CutoutCard
        onClick={handleCardClick}
        onKeyDown={handleCardKeyDown}
        role="link"
        tabIndex={0}
        aria-label={`View ${place.name}`}
      >
        <CutoutCardMedia>
          <CutoutCardImage
            alt={place.name}
            sizes="(max-width: 639px) 100vw, (max-width: 1024px) 50vw, 33vw"
            src={place.image}
          />
          <CutoutCardOverlay />

          <CutoutCardInsetLabel className={styles.insetLabelRating}>
            <span className={styles.insetEyebrow}>Rating</span>
            <span className={styles.insetValue}>
              {place.rating.toFixed(1)}
              <Icon name="star" size={16} />
            </span>
            <CutoutCorner className={styles.insetCornerRight} />
            <CutoutCorner className={styles.insetCornerTop} />
          </CutoutCardInsetLabel>

          <CutoutCardPin className={isOpen ? styles.pinOpen : styles.pinClosed}>
            {isOpen ? "Open now" : "Closed"}
            <CutoutCorner
              className={isOpen ? styles.pinCornerLeftOpen : styles.pinCornerLeftClosed}
              size={28}
            />
            <CutoutCorner
              className={isOpen ? styles.pinCornerBottomOpen : styles.pinCornerBottomClosed}
              size={28}
            />
          </CutoutCardPin>
        </CutoutCardMedia>

        <CutoutCardContent className={showOrderHint ? styles.contentWithAction : undefined}>
          <motion.div
            animate="show"
            initial="hidden"
            style={{ display: "contents" }}
            variants={stagger.container}
          >
            <motion.div className={styles.metaRow} variants={stagger.item}>
              <div className={styles.metaRowMain}>
                <TruncateTooltip className={styles.metaRowText}>
                  {place.category}
                </TruncateTooltip>
                <span aria-hidden="true">·</span>
                <span className={styles.price}>{place.priceRange}</span>
              </div>
              <WishlistPlaceButton
                placeId={place.id}
                placeName={place.name}
                placeImage={place.image}
                category={place.category}
                rating={place.rating}
                size="sm"
              />
            </motion.div>

            <motion.h2 className={styles.title} variants={stagger.item}>
              <TruncateTooltip>{place.name}</TruncateTooltip>
            </motion.h2>

            <motion.p className={styles.description} variants={stagger.item}>
              <TruncateTooltip>{place.description}</TruncateTooltip>
            </motion.p>

            <motion.div variants={stagger.item}>
              <CutoutCardFooter className={styles.footerBorder}>
                <div className={styles.footerMeta}>
                  <Icon name="location" size={14} />
                  <TruncateTooltip className={styles.footerMetaText}>
                    {place.location}
                  </TruncateTooltip>
                </div>
                <span className={styles.footerHours} title={`Today · ${todayHours}`}>
                  {todayHours}
                </span>
              </CutoutCardFooter>
            </motion.div>
          </motion.div>
        </CutoutCardContent>

        {showOrderHint ? (
          <CutoutCardAction className={styles.actionPos}>
            <button type="button" className={styles.actionButton} onClick={handleOrderClick}>
              Order
            </button>
          </CutoutCardAction>
        ) : null}
      </CutoutCard>
    </div>
  );
}
