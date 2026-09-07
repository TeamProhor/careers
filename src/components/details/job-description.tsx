import { Check } from "reicon-react";
import { Separator } from "@/components/ui/separator";
import type { JobPosition } from "@/lib/jobs";

interface JobDescriptionProps {
  position: JobPosition;
}

export function JobDescription({ position }: JobDescriptionProps) {
  return (
    <div className="flex flex-col gap-10 lg:col-span-7">
      <div className="flex flex-col gap-4 border-b border-border pb-8">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl md:text-5xl leading-tight">
          {position.title}
        </h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          বিশ্বমানের ইঞ্জিনিয়ার, ডিজাইনার এবং নির্মাতাদের সাথে যৌথভাবে কাজ করে আধুনিক টিমের
          জন্য হাই-পারফরম্যান্স টুলস তৈরি করুন।
        </p>
      </div>
      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold tracking-tight text-foreground">
          আপনার দায়িত্বসমূহ
        </h2>
        <ul className="flex flex-col gap-3 text-sm leading-relaxed text-muted-foreground">
          {position.responsibilities.map((item) => (
            <li key={item} className="flex items-start gap-3">
              <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>
      <Separator />
      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold tracking-tight text-foreground">
          প্রয়োজনীয় যোগ্যতা ও অভিজ্ঞতা
        </h2>
        <ul className="flex flex-col gap-3 text-sm leading-relaxed text-muted-foreground">
          {position.requirements.map((item) => (
            <li key={item} className="flex items-start gap-3">
              <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>
      <Separator />
      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold tracking-tight text-foreground">
          সুযোগ-সুবিধাসমূহ
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {position.benefits.map((item) => (
            <div
              key={item}
              className="flex items-start gap-2.5 rounded-lg border border-border bg-card/60 p-3 text-xs text-muted-foreground"
            >
              <Check size={14} className="mt-0.5 shrink-0 text-primary" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
