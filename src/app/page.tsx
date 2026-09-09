import { CareersContent } from "@/components/landing/careers-content";
import { getJobs } from "@/lib/data/jobs";

export default async function CareersPage() {
  const positions = getJobs();
  return <CareersContent positions={positions} />;
}
