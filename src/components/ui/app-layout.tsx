"use client";

import type * as React from "react";
import { cn } from "@/lib/utils";

export interface NavItem {
  title: string;
  url: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

interface AppLayoutProps {
  children: React.ReactNode;
  brandTitle?: string;
  brandLogo?: React.ReactNode;
  brandHref?: string;
  navItems: NavItem[];
  currentPath: string;
  user?: {
    name: string;
    email: string;
    roleBadge?: string;
  } | null;
  onLogout?: () => void;
  renderLink: (props: {
    href: string;
    className: string;
    children: React.ReactNode;
    onClick?: () => void;
  }) => React.ReactNode;
}

export function AppLayout({
  children,
  brandTitle,
  brandLogo,
  brandHref = "/admin",
  navItems,
  currentPath,
  user,
  onLogout,
  renderLink,
}: AppLayoutProps) {
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <aside className="hidden md:flex w-60 flex-col border-r border-border bg-card/50">
        <div className="flex h-14 items-center gap-2 border-b border-border px-4">
          {renderLink({
            href: brandHref,
            className: "flex items-center gap-2",
            children: brandLogo || (
              <span className="text-sm font-semibold">{brandTitle}</span>
            ),
          })}
        </div>

        <nav className="flex-1 space-y-1 p-3">
          {navItems.map((item) => {
            const isActive = currentPath === item.url;
            return renderLink({
              href: item.url,
              className: cn(
                "flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              ),
              children: (
                <>
                  <item.icon size={16} />
                  {item.title}
                </>
              ),
            });
          })}
        </nav>

        {user && (
          <div className="border-t border-border p-3">
            <div className="rounded-lg bg-muted/40 p-3">
              <p className="text-xs font-medium text-foreground truncate">
                {user.name}
              </p>
              <p className="text-2xs text-muted-foreground truncate">
                {user.email}
              </p>
              {user.roleBadge && (
                <span className="mt-1 inline-block rounded bg-primary/10 px-1.5 py-0.5 text-2xs font-medium text-primary">
                  {user.roleBadge}
                </span>
              )}
            </div>
            {onLogout && (
              <button
                onClick={onLogout}
                className="mt-2 w-full rounded-lg px-3 py-1.5 text-left text-xs text-muted-foreground hover:bg-muted hover:text-destructive transition-colors"
              >
                লগআউট
              </button>
            )}
          </div>
        )}
      </aside>

      <main className="flex-1 overflow-auto">
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
