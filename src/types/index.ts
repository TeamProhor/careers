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
}
