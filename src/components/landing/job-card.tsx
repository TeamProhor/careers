import Link from "next/link";
import { Briefcase, ChevronRight } from "reicon-react";
import { Badge } from "@/components/ui/badge";
import { GridPattern } from "@/components/ui/grid-pattern";
import type { JobPosition } from "@/lib/jobs";

interface JobCardProps {
  position: JobPosition;
}

export function JobCard({ position }: JobCardProps) {
  return (
    <Link
      href={position.href}
      className="group relative flex flex-col justify-between h-full overflow-hidden no-underline"
    >
      <div className="pointer-events-none absolute inset-0 size-full opacity-50 transition-opacity duration-300 group-hover:opacity-80">
        <GridPattern
          className="absolute inset-0 size-full stroke-foreground/10 fill-foreground/[0.02]"
          height={32}
          width={32}
          x={16}
          cr={8}
        />
      </div>
      <div className="relative z-10 space-y-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex size-10 items-center justify-center rounded-lg border border-border bg-card/80 text-foreground backdrop-blur-xs transition-colors group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary">
            <Briefcase size={18} />
          </div>
          <Badge
            variant="outline"
            className="text-2xs font-normal bg-card/60 backdrop-blur-xs"
          >
            {position.department}
          </Badge>
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold tracking-tight text-foreground transition-colors group-hover:text-primary">
            {position.title}
          </h3>
          <p className="text-xs sm:text-sm leading-relaxed text-muted-foreground line-clamp-2">
            {position.responsibilities[0]}
          </p>
        </div>
      </div>
      <div className="relative z-10 mt-6 flex items-center gap-1 text-xs font-medium text-foreground group-hover:text-primary transition-colors">
        <span>বিস্তারিত দেখুন ও আবেদন করুন</span>
        <ChevronRight
          size={14}
          className="transition-transform duration-200 group-hover:translate-x-1"
        />
      </div>
    </Link>
  );
}
