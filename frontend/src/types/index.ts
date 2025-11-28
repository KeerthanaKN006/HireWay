export interface Job {
  _id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  description: string;
  salary?: string;
  createdAt: string;
  requirements?: string[];
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role?: 'admin' | 'user';
  savedJobs: string[];
  appliedJobs: string[];
}