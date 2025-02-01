export type HabitCategory = 'health' | 'productivity' | 'learning' | 'fitness' | 'mindfulness' | 'other';

export interface Habit {
  id: string;
  name: string;
  description?: string;
  category: HabitCategory;
  createdAt: Date;
  completedDates: string[]; // Array of ISO date strings
  streak: number;
}

export const CATEGORY_COLORS: Record<HabitCategory, string> = {
  health: '#4CAF50',      // Green
  productivity: '#2196F3', // Blue
  learning: '#9C27B0',    // Purple
  fitness: '#F44336',     // Red
  mindfulness: '#FF9800',  // Orange
  other: '#757575'        // Gray
};

export const CATEGORY_ICONS: Record<HabitCategory, string> = {
  health: '🏥',
  productivity: '⚡',
  learning: '📚',
  fitness: '💪',
  mindfulness: '��',
  other: '📌'
}; 