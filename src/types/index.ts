export type EmploymentType = "ফুল টাইম" | "পার্ট টাইম" | "চুক্তিভিত্তিক" | "ইন্টার্নশিপ";

export interface JobPosition {
  id: string;
  title: string;
  department: string;
  location: string;
  type: EmploymentType | string;
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

export interface ApplicationSubmission {
  id?: string;
  jobId: string;
  jobTitle: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string;
  resumeUrl: string;
  workLinks: string[];
  workHybrid?: "yes" | "no" | string | null;
  visaSponsorship?: "yes" | "no" | string | null;
  privacyAcknowledged: boolean;
  accuracyConfirmed: boolean;
  status?:
    | "pending"
    | "reviewing"
    | "shortlisted"
    | "accepted"
    | "rejected"
    | string;
  reviewNote?: string | null;
  reviewedAt?: Date | string | null;
  createdAt?: Date | string;
}

export interface ApplicationItem extends ApplicationSubmission {
  id: string;
  userId?: string | null;
}

export interface StorageUploadResult {
  url: string;
  key: string;
  bucket: string;
  size: number;
  mimeType: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
