"use client";

import { useEffect, useMemo, useState } from "react";
import { Search } from "reicon-react";
import { HeroSection } from "@/components/landing/hero-section";
import { OpeningsList } from "@/components/landing/openings-list";
import { Footer } from "@/components/shared/footer";
import { Header } from "@/components/shared/header";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { FALLBACK_POSITIONS } from "@/lib/jobs";
import type { JobPosition } from "@/types";

export default function CareersPage() {
  const [positions, setPositions] = useState<JobPosition[]>(FALLBACK_POSITIONS);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetch("/api/jobs")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          setPositions(data.data);
        }
      })
      .catch(() => {});
  }, []);

  const filteredPositions = useMemo(() => {
    return positions.filter((pos) => {
      const q = searchQuery.toLowerCase();
      return (
        pos.title.toLowerCase().includes(q) ||
        pos.department.toLowerCase().includes(q) ||
        pos.location.toLowerCase().includes(q)
      );
    });
  }, [positions, searchQuery]);

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground font-sans selection:bg-muted selection:text-foreground">
      <Header actionHref="#positions" actionLabel="উন্মুক্ত পদসমূহ" />
      <main className="flex-1">
        <HeroSection openCount={positions.length} />
        <section
          id="positions"
          className="mx-auto max-w-5xl px-4 py-12 sm:px-6"
        >
          <div className="mb-8 flex flex-col justify-between gap-4 border-b border-border pb-6 sm:flex-row sm:items-center">
            <div className="space-y-1">
              <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                উন্মুক্ত পদসমূহ
              </h2>
              <p className="text-xs text-muted-foreground">
                মোট {filteredPositions.length}টি পদ পাওয়া গেছে
              </p>
            </div>
            <div className="w-full sm:w-80">
              <InputGroup className="bg-card shadow-2xs">
                <InputGroupAddon align="inline-start">
                  <Search size={14} className="text-muted-foreground" />
                </InputGroupAddon>
                <InputGroupInput
                  type="text"
                  placeholder="পদবি, দক্ষতা বা টিম খুঁজুন..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="text-xs"
                />
              </InputGroup>
            </div>
          </div>
          <div>
            <OpeningsList
              positions={filteredPositions}
              onResetFilters={() => setSearchQuery("")}
            />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
