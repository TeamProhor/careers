import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "reicon-react";
import { Button } from "@/components/ui/button";
import { HeaderNav } from "./header-nav";

interface HeaderProps {
  actionHref?: string;
  actionLabel?: string;
  backHref?: string;
  backLabel?: string;
}

export function Header({
  actionHref = "#positions",
  actionLabel = "উন্মুক্ত পদসমূহ",
  backHref,
  backLabel,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-6">
          {backHref ? (
            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5 text-xs text-muted-foreground hover:text-foreground"
              render={<Link href={backHref} />}
            >
              <ArrowLeft size={14} />
              <span>{backLabel}</span>
            </Button>
          ) : (
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-semibold tracking-tight text-foreground transition-opacity hover:opacity-80"
              aria-label="Prohor Careers"
            >
              <Image
                src="/prohor.png"
                alt="Prohor"
                width={96}
                height={32}
                priority
                className="h-6 w-auto object-contain dark:filter-none filter invert"
              />
              <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                /
              </span>
              <span className="font-medium text-sm">ক্যারিয়ার</span>
            </Link>
          )}
        </div>
        <HeaderNav actionHref={actionHref} actionLabel={actionLabel} />
      </div>
    </header>
  );
}
