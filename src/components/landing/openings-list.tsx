import type * as React from "react";
import { Briefcase } from "reicon-react";
import { Button } from "@/components/ui/button";
import { DecorIcon } from "@/components/ui/decor-icon";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import type { JobMetadata } from "@/lib/data/jobs";
import { JobCard } from "./job-card";

function DashedLine({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={`absolute border-collapse border border-dashed border-border ${className}`}
      {...props}
    />
  );
}

interface OpeningsListProps {
  positions: JobMetadata[];
  onResetFilters: () => void;
}

export function OpeningsList({ positions, onResetFilters }: OpeningsListProps) {
  if (positions.length === 0) {
    return (
      <Empty className="border border-border bg-card/40 rounded-xl py-16">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Briefcase size={20} className="text-muted-foreground" />
          </EmptyMedia>
          <EmptyTitle>কোনো উপযুক্ত পদ পাওয়া যায়নি</EmptyTitle>
          <EmptyDescription>
            আপনার অনুসন্ধান অনুযায়ী কোনো পদ খুঁজে পাওয়া যায়নি। অনুগ্রহ করে পুনরায় চেষ্টা করুন।
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button variant="outline" size="sm" onClick={onResetFilters}>
            অনুসন্ধান রিসেট করুন
          </Button>
        </EmptyContent>
      </Empty>
    );
  }

  return (
    <div className="relative">
      <DecorIcon
        className="size-6 stroke-2 stroke-border"
        position="top-left"
      />
      <DecorIcon
        className="size-6 stroke-2 stroke-border"
        position="top-right"
      />
      <DecorIcon
        className="size-6 stroke-2 stroke-border"
        position="bottom-left"
      />
      <DecorIcon
        className="size-6 stroke-2 stroke-border"
        position="bottom-right"
      />
      <DashedLine className="-top-[1.5px] right-3 left-3" />
      <DashedLine className="top-3 -right-[1.5px] bottom-3" />
      <DashedLine className="top-3 bottom-3 -left-[1.5px]" />
      <DashedLine className="right-3 -bottom-[1.5px] left-3" />
      <div className="grid grid-cols-1 md:grid-cols-2">
        {positions.map((position, index) => {
          const isEven = index % 2 === 0;
          const isLastItem = index === positions.length - 1;
          return (
            <div
              key={position.id}
              className="group relative p-6 sm:p-8 flex flex-col justify-between"
            >
              <JobCard position={position} />
              {!isLastItem && (
                <DashedLine className="right-5 bottom-0 left-5 md:hidden" />
              )}
              {isEven && !isLastItem && (
                <DashedLine className="hidden md:block top-5 bottom-5 right-0" />
              )}
              {index <
                positions.length - (positions.length % 2 === 0 ? 2 : 1) && (
                <DashedLine className="hidden md:block bottom-0 left-5 right-5" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
