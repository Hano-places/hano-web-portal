"use client";

import Image from "next/image";
import type { PlaceMeta } from "@/store/cart";
import { Button } from "@/components/ui/button";
import styles from "./place-conflict-dialog.module.css";

type PlaceConflictDialogProps = {
  open: boolean;
  currentPlace: PlaceMeta;
  nextPlace: PlaceMeta;
  onSaveDraft: () => void;
  onReplace: () => void;
  onCancel: () => void;
};

export function PlaceConflictDialog({
  open,
  currentPlace,
  nextPlace,
  onSaveDraft,
  onReplace,
  onCancel,
}: PlaceConflictDialogProps) {
  if (!open) return null;

  return (
    <div className={styles.backdrop} role="presentation" onClick={onCancel}>
      <div
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="place-conflict-title"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 id="place-conflict-title" className={styles.title}>
          Start a new order?
        </h2>
        <p className={styles.body}>
          Your current draft at <strong>{currentPlace.placeName}</strong> is not placed yet.
          Adding from <strong>{nextPlace.placeName}</strong> can either save the current draft or
          replace it.
        </p>

        <div className={styles.places}>
          <div className={styles.placeCard}>
            {currentPlace.placeImage ? (
              <Image
                src={currentPlace.placeImage}
                alt=""
                width={40}
                height={40}
                className={styles.placeImage}
              />
            ) : null}
            <div>
              <p className={styles.placeLabel}>Current draft</p>
              <p className={styles.placeName}>{currentPlace.placeName}</p>
            </div>
          </div>
          <div className={styles.placeCard}>
            {nextPlace.placeImage ? (
              <Image
                src={nextPlace.placeImage}
                alt=""
                width={40}
                height={40}
                className={styles.placeImage}
              />
            ) : null}
            <div>
              <p className={styles.placeLabel}>New place</p>
              <p className={styles.placeName}>{nextPlace.placeName}</p>
            </div>
          </div>
        </div>

        <div className={styles.actions}>
          <Button variant="secondary" className={styles.actionButton} onClick={onSaveDraft}>
            Save draft &amp; start new
          </Button>
          <Button variant="outline" className={styles.actionButton} onClick={onReplace}>
            Replace current draft
          </Button>
          <Button variant="ghost" className={styles.actionButton} onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
