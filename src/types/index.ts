export interface JobPosition {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  href: string;
  description?: string | null;
  responsibilities: string[];
  requirements: string[];
  bonus?: string[];
  benefits: string[];
  displayOrder?: number;
  isActive?: boolean;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface ApplicationItem {
  id: string;
  userId: string;
  jobId: string;
  jobTitle: string;
  name: string | null;
  firstName: string | null;
  lastName: string | null;
  email: string;
  phone: string | null;
  resumeUrl: string;
  workLinks: string[];
  workHybrid: string | null;
  visaSponsorship: string | null;
  privacyAcknowledged: boolean;
  accuracyConfirmed: boolean;
  status: string;
  reviewNote: string | null;
  reviewedAt: Date | string | null;
  createdAt: Date | string;
}
