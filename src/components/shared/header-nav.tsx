"use client";

import { ArrowRight, PanelLeft } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ResponsiveDialog } from "@/components/ui/responsive-dialog";

interface HeaderNavProps {
  actionHref?: string;
  actionLabel?: string;
}

export function HeaderNav({
  actionHref = "#positions",
  actionLabel = "উন্মুক্ত পদসমূহ",
}: HeaderNavProps) {
  const [user, setUser] = useState<{
    email: string;
    name?: string;
    isAdmin?: boolean;
  } | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated && data.user) setUser(data.user);
      })
      .catch(() => {});
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      window.location.href = "/";
    } catch {}
  };

  const handleActionClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (actionHref.startsWith("#")) {
      e.preventDefault();
      const targetEl = document.getElementById(actionHref.slice(1));
      if (targetEl) targetEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="flex items-center gap-2 sm:gap-3">
      <div className="hidden md:flex items-center gap-2 sm:gap-3">
        {user ? (
          <>
            {user.isAdmin && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full px-3 text-xs border-primary/30 text-primary hover:bg-primary/10"
                  render={<Link href="/admin" />}
                >
                  আবেদনসমূহ
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full px-3 text-xs border-border hover:bg-muted"
                  render={<Link href="/admin/jobs" />}
                >
                  পদ ব্যবস্থাপনা
                </Button>
              </>
            )}
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-muted-foreground hover:text-foreground"
              render={<Link href="/dashboard" />}
            >
              আবেদনের স্থিতি
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-muted-foreground hover:text-destructive"
              onClick={handleLogout}
            >
              লগআউট
            </Button>
          </>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-muted-foreground hover:text-foreground"
            render={<Link href="/login" />}
          >
            লগইন
          </Button>
        )}
        <Button
          size="sm"
          className="rounded-full px-4 text-xs font-medium"
          render={<a href={actionHref} onClick={handleActionClick} />}
        >
          {actionLabel}
          {actionHref.startsWith("#") && !actionHref.includes("apply") && (
            <ArrowRight size={14} className="ml-1" />
          )}
        </Button>
      </div>
      <div className="flex md:hidden items-center gap-1.5">
        <Button
          size="sm"
          className="rounded-full px-3 text-2xs font-medium h-8"
          render={<a href={actionHref} onClick={handleActionClick} />}
        >
          {actionLabel}
        </Button>
        <Button
          variant="outline"
          className="rounded-full h-8 w-8 text-foreground"
          onClick={() => setIsMobileMenuOpen(true)}
          aria-label="ন্যাভিগেশন মেনু"
        >
          <PanelLeft size={16} />
        </Button>
      </div>
      <ResponsiveDialog
        open={isMobileMenuOpen}
        onOpenChange={setIsMobileMenuOpen}
        title="মেনু"
        description="প্রহর ক্যারিয়ার নেভিগেশন"
      >
        <div className="flex flex-col gap-3 py-3">
          {user ? (
            <>
              <div className="rounded-xl border border-border bg-muted/40 p-3 text-xs space-y-1">
                <span className="text-muted-foreground block">
                  লগইন করা অ্যাকাউন্ট:
                </span>
                <p className="font-medium text-foreground truncate">
                  {user.email}
                </p>
                {user.isAdmin && (
                  <span className="inline-block px-2 py-0.5 mt-1 rounded text-2xs bg-primary/10 text-primary border border-primary/20">
                    অ্যাডমিনিস্ট্রেটর
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-1.5 pt-2">
                {user.isAdmin && (
                  <>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-xs rounded-xl h-10 px-4"
                      render={
                        <Link
                          href="/admin"
                          onClick={() => setIsMobileMenuOpen(false)}
                        />
                      }
                    >
                      আবেদনসমূহ পর্যালোচনা
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-xs rounded-xl h-10 px-4"
                      render={
                        <Link
                          href="/admin/jobs"
                          onClick={() => setIsMobileMenuOpen(false)}
                        />
                      }
                    >
                      ক্যারিয়ার পদ ব্যবস্থাপনা
                    </Button>
                  </>
                )}
                <Button
                  variant="ghost"
                  className="w-full justify-start text-xs rounded-xl h-10 px-4"
                  render={
                    <Link
                      href="/dashboard"
                      onClick={() => setIsMobileMenuOpen(false)}
                    />
                  }
                >
                  আমার আবেদনের স্থিতি
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-xs rounded-xl h-10 px-4 text-destructive hover:bg-destructive/10"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    handleLogout();
                  }}
                >
                  লগআউট করুন
                </Button>
              </div>
            </>
          ) : (
            <div className="flex flex-col gap-2 pt-2">
              <Button
                className="w-full rounded-full text-xs h-10"
                render={
                  <Link
                    href="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                  />
                }
              >
                লগইন করুন
              </Button>
            </div>
          )}
        </div>
      </ResponsiveDialog>
    </div>
  );
}
