export interface Project {
  _id?: string;
  name: string;
  description?: string;
  startDate?: Date;
  endDate?: Date;
  status: 'planned' | 'in-progress' | 'completed' | 'on-hold';
  members?: string[];
  createdAt?: Date;
  updatedAt?: Date;
} 