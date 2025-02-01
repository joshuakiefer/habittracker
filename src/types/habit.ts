export interface Habit {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  completedDates: string[]; // Array of ISO date strings
  streak: number;
} 