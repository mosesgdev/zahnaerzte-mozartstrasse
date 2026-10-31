"use client";

import { useSyncExternalStore } from "react";
import { siteData } from "@content/site-data";
import { cn } from "@/lib/utils";

const weekdayFormat = new Intl.DateTimeFormat("de-DE", {
  weekday: "long",
  timeZone: "Europe/Berlin",
});

const subscribe = () => () => {};
const getToday = () => weekdayFormat.format(new Date());
const getServerToday = () => null;

/**
 * Opening hours as a timetable. The current weekday (Berlin time) gets a
 * small green dot, rendered only on the client so the static page stays
 * cacheable. Deliberately no "open now" claim, since closures and
 * vacations are handled elsewhere.
 */
export function OpeningHours({
  tone = "light",
  className,
}: {
  tone?: "light" | "dark";
  className?: string;
}) {
  const today = useSyncExternalStore(subscribe, getToday, getServerToday);
  const dark = tone === "dark";

  return (
    <dl className={cn("text-sm", className)}>
      {siteData.openingHours.map((h) => {
        const isToday = h.day === today;
        return (
          <div
            key={h.day}
            className={cn(
              "flex items-center justify-between gap-4 py-2",
              dark ? "border-b border-white/10 last:border-0" : "",
            )}
          >
            <dt
              className={cn(
                "flex items-center gap-2",
                dark ? "text-white/90" : "text-foreground/80",
                isToday && "font-semibold",
              )}
            >
              {h.day}
              {isToday && (
                <span
                  className={cn(
                    "inline-flex items-center gap-1.5 text-xs font-normal",
                    dark ? "text-white/60" : "text-on-surface-variant",
                  )}
                >
                  <span
                    aria-hidden
                    className={cn(
                      "size-1.5 rounded-full",
                      dark ? "bg-secondary-fixed" : "bg-secondary",
                    )}
                  />
                  heute
                </span>
              )}
            </dt>
            <dd
              className={cn(
                "tabular-nums",
                dark ? "text-white/70" : "text-on-surface-variant",
                isToday && (dark ? "text-white" : "text-foreground"),
              )}
            >
              {h.hours}
            </dd>
          </div>
        );
      })}
    </dl>
  );
}
