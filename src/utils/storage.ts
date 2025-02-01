import habitService from '../services/habitService';
import { Habit } from '../types/habit';

export const saveHabits = async (habits: Habit[]): Promise<void> => {
  try {
    // We'll only use this for adding new habits
    const latestHabit = habits[habits.length - 1];
    if (latestHabit) {
      const { id, ...habitWithoutId } = latestHabit;
      await habitService.addHabit(habitWithoutId);
    }
    console.log('Habit saved to Firebase successfully');
  } catch (error) {
    console.error('Error saving to Firebase:', error);
    throw error;
  }
};

export const loadHabits = async (): Promise<Habit[]> => {
  try {
    const habits = await habitService.getAllHabits();
    console.log('Habits loaded from Firebase successfully:', habits.length);
    return habits;
  } catch (error) {
    console.error('Error loading from Firebase:', error);
    return [];
  }
};

export const updateHabit = async (habit: Habit): Promise<void> => {
  try {
    await habitService.updateHabit(habit.id, habit);
    console.log('Habit updated in Firebase successfully');
  } catch (error) {
    console.error('Error updating in Firebase:', error);
    throw error;
  }
};

export const deleteHabit = async (habitId: string): Promise<void> => {
  try {
    await habitService.deleteHabit(habitId);
    console.log('Habit deleted from Firebase successfully');
  } catch (error) {
    console.error('Error deleting from Firebase:', error);
    throw error;
  }
};

export const toggleHabitCompletion = async (
  habitId: string,
  completedDates: string[],
  streak: number
): Promise<void> => {
  try {
    await habitService.toggleHabitCompletion(habitId, completedDates, streak);
    console.log('Habit completion toggled in Firebase successfully');
  } catch (error) {
    console.error('Error toggling completion in Firebase:', error);
    throw error;
  }
};
