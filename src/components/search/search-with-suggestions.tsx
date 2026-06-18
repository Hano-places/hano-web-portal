"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { SearchInput } from "@/components/ui/search-input";
import { getSearchSuggestions, type SearchSuggestion } from "@/lib/search-suggestions";
import { cn } from "@/lib/utils";
import styles from "./search-with-suggestions.module.css";

type SearchWithSuggestionsProps = {
  placeholder?: string;
  wrapperClassName?: string;
  fieldSize?: "sm" | "md";
  variant?: "dropdown" | "inline";
  autoFocus?: boolean;
  onNavigate?: () => void;
};

function SuggestionGroups({
  suggestions,
  onSelect,
}: {
  suggestions: SearchSuggestion[];
  onSelect?: () => void;
}) {
  const places = suggestions.filter((item) => item.type === "place");
  const dishes = suggestions.filter((item) => item.type === "dish");

  const renderGroup = (label: string, items: SearchSuggestion[]) => {
    if (!items.length) return null;

    return (
      <div>
        <p className={styles.sectionLabel}>{label}</p>
        {items.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className={styles.suggestion}
            onClick={onSelect}
          >
            <Image
              src={item.image}
              alt=""
              width={40}
              height={40}
              className={styles.thumb}
            />
            <div className={styles.meta}>
              <p className={styles.title}>{item.title}</p>
              <p className={styles.subtitle}>{item.subtitle}</p>
            </div>
            <span className={styles.badge}>{item.type}</span>
          </Link>
        ))}
      </div>
    );
  };

  return (
    <>
      {renderGroup("Places", places)}
      {renderGroup("Dishes", dishes)}
    </>
  );
}

export function SearchWithSuggestions({
  placeholder = "Search places, dishes...",
  wrapperClassName,
  fieldSize = "sm",
  variant = "dropdown",
  autoFocus = false,
  onNavigate,
}: SearchWithSuggestionsProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const suggestions = useMemo(() => getSearchSuggestions(query), [query]);
  const showSuggestions = open && query.trim().length >= 2;

  useEffect(() => {
    if (variant !== "dropdown") return;

    const handlePointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [variant]);

  const handleSelect = () => {
    setOpen(false);
    setQuery("");
    onNavigate?.();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <div ref={rootRef} className={cn(styles.root, wrapperClassName)}>
      <SearchInput
        autoFocus={autoFocus}
        fieldSize={fieldSize}
        placeholder={placeholder}
        value={query}
        onChange={(event) => {
          setQuery(event.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={handleKeyDown}
        wrapperClassName="w-full"
      />

      {showSuggestions ? (
        variant === "dropdown" ? (
          <div className={styles.dropdown} role="listbox" aria-label="Search suggestions">
            <div className={styles.list}>
              {suggestions.length > 0 ? (
                <SuggestionGroups suggestions={suggestions} onSelect={handleSelect} />
              ) : (
                <p className={styles.empty}>No matches for &ldquo;{query.trim()}&rdquo;</p>
              )}
            </div>
          </div>
        ) : (
          <div className={cn(styles.list, styles.listInline)} role="listbox" aria-label="Search suggestions">
            {suggestions.length > 0 ? (
              <SuggestionGroups suggestions={suggestions} onSelect={handleSelect} />
            ) : (
              <p className={styles.empty}>No matches for &ldquo;{query.trim()}&rdquo;</p>
            )}
          </div>
        )
      ) : null}
    </div>
  );
}
