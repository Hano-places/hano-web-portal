"use client";

import Image from "next/image";
import Link from "next/link";
import type { PlaceSeed } from "@/content/places";
import { formatWeeklyHours, getOpenStatus } from "@/lib/place-hours";
import { Icon } from "@/components/ui/icon";
import styles from "./place-card.module.css";

type PlaceCardProps = {
  place: PlaceSeed;
  showOrderHint?: boolean;
};

export function PlaceCard({ place, showOrderHint = true }: PlaceCardProps) {
  const { isOpen, todayHours } = getOpenStatus(place.hours);

  return (
    <Link href={`/places/${place.id}`} className={styles.cardLink}>
      <article className={`${styles.card} ${styles.grid}`}>
        <div className={styles.imageWrap}>
          <Image
            src={place.image}
            alt={place.name}
            fill
            className={styles.image}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          <span
            className={`${styles.statusBadge} ${isOpen ? styles.statusOpen : styles.statusClosed}`}
          >
            {isOpen ? "Open now" : "Closed"}
          </span>
          {place.featured ? (
            <span className={styles.featuredBadge}>Featured</span>
          ) : null}
        </div>

        <div className={styles.body}>
          <div className={styles.titleRow}>
            <h3 className={styles.name} title={place.name}>
              {place.name}
            </h3>
            <span className={styles.rating}>
              {place.rating.toFixed(1)}
              <Icon name="star" size={14} />
            </span>
          </div>

          <div className={styles.meta} title={`${place.category} · ${place.location} · ${place.priceRange}`}>
            <span className={styles.metaText}>
              {place.category} · {place.location} · {place.priceRange}
            </span>
          </div>

          <p className={styles.description} title={place.description}>
            {place.description}
          </p>

          <div className={styles.hoursBlock}>
            <div className={styles.hoursToday}>
              <Icon name="clock" size={15} className={styles.hoursIcon} />
              <span className={styles.hoursTodayText}>
                Today · <strong>{todayHours}</strong>
              </span>
            </div>
          </div>

          {showOrderHint ? (
            <div className={styles.footer}>
              <span className={styles.viewLink}>View place</span>
              <span className={styles.orderBtn}>Order</span>
            </div>
          ) : null}
        </div>
      </article>
    </Link>
  );
}
