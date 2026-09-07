"use client";

import type * as React from "react";
import { cn } from "@/lib/utils";

interface MetaItem {
  label: string;
  value: string;
}

interface ActionItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  variant?: "default" | "outline" | "ghost";
  className?: string;
  href?: string;
  target?: string;
  onClick?: () => void;
}

interface ListCardProps {
  id: string;
  title: string;
  subtitle?: string;
  badges?: Array<{
    label: string;
    variant?: "default" | "secondary" | "destructive" | "outline";
  }>;
  metaItems?: MetaItem[];
  actions?: ActionItem[];
  footerNote?: React.ReactNode;
}

export function ListCard({
  id,
  title,
  subtitle,
  badges,
  metaItems,
  actions,
  footerNote,
}: ListCardProps) {
  return (
    <div
      className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 transition-colors hover:bg-muted/20"
      data-slot="list-card"
      data-id={id}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-medium text-foreground truncate">
            {title}
          </h3>
          {subtitle && (
            <p className="text-2xs text-muted-foreground mt-0.5">{subtitle}</p>
          )}
          {badges && badges.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {badges.map((badge) => (
                <span
                  key={badge.label}
                  className={cn(
                    "inline-flex items-center rounded-full px-2 py-0.5 text-2xs font-medium",
                    badge.variant === "default" &&
                      "bg-primary text-primary-foreground",
                    badge.variant === "secondary" &&
                      "bg-secondary text-secondary-foreground",
                    badge.variant === "destructive" &&
                      "bg-destructive text-destructive-foreground",
                    badge.variant === "outline" &&
                      "border border-border text-foreground",
                    !badge.variant && "bg-secondary text-secondary-foreground",
                  )}
                >
                  {badge.label}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {metaItems && metaItems.length > 0 && (
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-muted-foreground">
          {metaItems.map((item) => (
            <div key={item.label} className="flex gap-1.5">
              <span className="text-2xs text-muted-foreground/80">
                {item.label}
              </span>
              <span>{item.value}</span>
            </div>
          ))}
        </div>
      )}

      {footerNote && (
        <div className="text-xs text-muted-foreground border-t border-border/50 pt-2">
          {footerNote}
        </div>
      )}

      {actions && actions.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 border-t border-border/50 pt-2">
          {actions.map((action) => {
            const btn = (
              <button
                type="button"
                key={action.id}
                onClick={action.onClick}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
                  action.variant === "default" &&
                    "bg-primary text-primary-foreground hover:bg-primary/90",
                  action.variant === "outline" &&
                    "border border-border bg-background hover:bg-muted",
                  action.variant === "ghost" && "hover:bg-muted",
                  !action.variant &&
                    "border border-border bg-background hover:bg-muted",
                  action.className,
                )}
              >
                {action.icon}
                {action.label}
              </button>
            );

            if (action.href) {
              return (
                <a
                  key={action.id}
                  href={action.href}
                  target={action.target}
                  rel={
                    action.target === "_blank"
                      ? "noopener noreferrer"
                      : undefined
                  }
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
                    action.variant === "default" &&
                      "bg-primary text-primary-foreground hover:bg-primary/90",
                    action.variant === "outline" &&
                      "border border-border bg-background hover:bg-muted",
                    action.variant === "ghost" && "hover:bg-muted",
                    !action.variant &&
                      "border border-border bg-background hover:bg-muted",
                    action.className,
                  )}
                >
                  {action.icon}
                  {action.label}
                </a>
              );
            }

            return btn;
          })}
        </div>
      )}
    </div>
  );
}
