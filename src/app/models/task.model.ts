import { Label } from '../services/label.service';

export interface Comment {
  _id: string;
  content: string;
  user: string;
  username: string;
  createdAt: Date;
}

export interface Task {
  _id?: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  status: 'todo' | 'in-progress' | 'completed';
  dueDate?: Date;
  categoryId?: string;
  labels?: Label[];
  comments?: Comment[];
  user?: string;
  createdAt?: Date;
  updatedAt?: Date;
} 