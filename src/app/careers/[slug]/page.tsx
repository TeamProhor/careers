import { notFound } from "next/navigation";
import { JobApplyForm } from "@/components/details/job-apply-form";
import { JobBreadcrumb } from "@/components/details/job-breadcrumb";
import { Footer } from "@/components/shared/footer";
import { Header } from "@/components/shared/header";
import GraphicsDesigner from "@/content/jobs/graphics-designer.mdx";
import QaEngineer from "@/content/jobs/qa-engineer.mdx";
import WebappDeveloper from "@/content/jobs/webapp-developer.mdx";
import { getJobBySlug, getJobSlugs } from "@/lib/data/jobs";

const mdxComponents: Record<string, React.ComponentType> = {
  "webapp-developer": WebappDeveloper,
  "graphics-designer": GraphicsDesigner,
  "qa-engineer": QaEngineer,
};

export function generateStaticParams() {
  return getJobSlugs().map((slug) => ({ slug }));
}

export default async function CareerDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const position = getJobBySlug(slug);
  if (!position) return notFound();

  const Content = mdxComponents[slug];
  if (!Content) return notFound();

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
          <div className="flex flex-col gap-10 lg:col-span-7">
            <div className="flex flex-col gap-4 border-b border-border pb-8">
              <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl md:text-5xl leading-tight">
                {position.title}
              </h1>
              {position.description && (
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {position.description}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-8">
              <Content />
            </div>
          </div>
          <JobApplyForm jobTitle={position.title} jobId={position.id} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
