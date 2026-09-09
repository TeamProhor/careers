import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const CONTENT_DIR = path.join(process.cwd(), "src", "content", "jobs");

export interface JobMetadata {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  description?: string;
  displayOrder?: number;
  isActive?: boolean;
  href: string;
}

export function getJobSlugs(): string[] {
  const slugs: string[] = [];
  for (const f of fs.readdirSync(CONTENT_DIR)) {
    if (f.endsWith(".mdx")) slugs.push(f.replace(/\.mdx$/, ""));
  }
  return slugs;
}

function getJobMetadata(slug: string): JobMetadata {
  const raw = fs.readFileSync(path.join(CONTENT_DIR, `${slug}.mdx`), "utf-8");
  const { data } = matter(raw);
  return { ...data, href: `/careers/${data.id}` } as JobMetadata;
}

export function getJobs(): JobMetadata[] {
  const jobs: JobMetadata[] = [];
  for (const slug of getJobSlugs()) {
    const job = getJobMetadata(slug);
    if (job.isActive !== false) jobs.push(job);
  }
  return jobs.sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));
}

export function getJobBySlug(slug: string): JobMetadata | undefined {
  try {
    return getJobMetadata(slug);
  } catch {
    return undefined;
  }
}
