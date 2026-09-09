"use client";

import { useState } from "react";
import { ArrowRight, Menu } from "reicon-react";
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
        <Button
          size="sm"
          className="rounded-full px-4 text-xs font-medium"
          render={<a href={actionHref} onClick={handleActionClick} aria-label={actionLabel} />}
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
          render={<a href={actionHref} onClick={handleActionClick} aria-label={actionLabel} />}
        >
          {actionLabel}
        </Button>
        <Button
          variant="outline"
          className="rounded-full h-8 w-8 text-foreground"
          onClick={() => setIsMobileMenuOpen(true)}
          aria-label="ন্যাভিগেশন মেনু"
        >
          <Menu size={16} />
        </Button>
      </div>
      <ResponsiveDialog
        open={isMobileMenuOpen}
        onOpenChange={setIsMobileMenuOpen}
        title="মেনু"
        description="প্রহর ক্যারিয়ার নেভিগেশন"
      >
        <div className="flex flex-col gap-3 py-3">
          <Button
            size="sm"
            className="rounded-full text-xs h-10"
            render={
              <a
                href={actionHref}
                onClick={(e) => {
                  handleActionClick(e);
                  setIsMobileMenuOpen(false);
                }}
                aria-label={actionLabel}
              />
            }
          >
            {actionLabel}
          </Button>
        </div>
      </ResponsiveDialog>
    </div>
  );
}
