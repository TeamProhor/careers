import { ArrowRight } from "reicon-react";
import { Button } from "@/components/ui/button";

interface HeroSectionProps {
  openCount: number;
}

export function HeroSection({ openCount }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden border-b border-border py-12 sm:py-20 md:py-28">
      <div className="pointer-events-none absolute -top-40 right-1/2 h-96 w-96 translate-x-1/2 rounded-full bg-gradient-to-tr from-primary/10 via-accent/20 to-transparent blur-3xl opacity-70" />
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col items-start gap-3 sm:gap-4">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl text-foreground max-w-3xl leading-[1.12] sm:leading-[1.08]">
            ভবিষ্যতের প্রযুক্তি গড়তে <br className="hidden sm:inline" />
            <span className="text-muted-foreground">আমাদের সাথে যুক্ত হোন।</span>
          </h1>
          <p className="max-w-xl text-sm text-muted-foreground sm:text-base md:text-lg leading-relaxed">
            আমরা আধুনিক ওয়েবের জন্য পরবর্তী প্রজন্মের ডেভেলপার টুলস এবং ক্লাউড অবকাঠামো তৈরি
            করছি। আপনার উপযুক্ত ভূমিকা বেছে নিন এবং ভবিষ্যৎ বিনির্মাণে অংশীদার হোন।
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-3 w-full sm:w-auto">
            <Button
              size="lg"
              className="rounded-full px-6 text-sm font-medium shadow-xs w-full sm:w-auto justify-center"
              render={<a href="#positions" aria-label="উন্মুক্ত পদ দেখুন" />}
            >
              {openCount}টি উন্মুক্ত পদ দেখুন
              <ArrowRight size={16} className="ml-1" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
