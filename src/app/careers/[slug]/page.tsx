"use client";

import { notFound, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader } from "reicon-react";
import { JobApplyForm } from "@/components/details/job-apply-form";
import { JobBreadcrumb } from "@/components/details/job-breadcrumb";
import { JobDescription } from "@/components/details/job-description";
import { Footer } from "@/components/shared/footer";
import { Header } from "@/components/shared/header";
import { FALLBACK_POSITIONS } from "@/lib/jobs";
import type { JobPosition } from "@/types";

export default function CareerDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const [position, setPosition] = useState<JobPosition | null>(
    () => FALLBACK_POSITIONS.find((p) => p.id === slug) || null,
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/jobs")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          const found = data.data.find((p: JobPosition) => p.id === slug);
          if (found) setPosition(found);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [slug]);

  if (!position && !loading) return notFound();
  if (!position)
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader size={24} className="animate-spin text-muted-foreground" />
      </div>
    );

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground font-sans selection:bg-muted selection:text-foreground">
      <Header
        backHref="/"
        backLabel="সকল উন্মুক্ত পদসমূহ"
        actionHref="#apply"
        actionLabel="আবেদন করুন"
      />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 md:py-14">
        <JobBreadcrumb
          department={position.department}
          title={position.title}
        />
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          <JobDescription position={position} />
          <JobApplyForm jobTitle={position.title} jobId={position.id} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
