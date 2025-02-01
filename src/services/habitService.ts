import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy 
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Habit } from '../types/habit';

const COLLECTION_NAME = 'habits';

export default {
  // Get all habits
  async getAllHabits(): Promise<Habit[]> {
    try {
      const habitsQuery = query(
        collection(db, COLLECTION_NAME),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(habitsQuery);
      return querySnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
        createdAt: doc.data().createdAt.toDate(),
      })) as Habit[];
    } catch (error) {
      console.error('Error getting habits:', error);
      throw error;
    }
  },

  // Add a new habit
  async addHabit(habit: Omit<Habit, 'id'>): Promise<Habit> {
    try {
      const docRef = await addDoc(collection(db, COLLECTION_NAME), {
        ...habit,
        createdAt: new Date(),
      });
      
      return {
        ...habit,
        id: docRef.id,
      };
    } catch (error) {
      console.error('Error adding habit:', error);
      throw error;
    }
  },

  // Update a habit
  async updateHabit(habitId: string, updates: Partial<Habit>): Promise<void> {
    try {
      const habitRef = doc(db, COLLECTION_NAME, habitId);
      await updateDoc(habitRef, updates);
    } catch (error) {
      console.error('Error updating habit:', error);
      throw error;
    }
  },

  // Delete a habit
  async deleteHabit(habitId: string): Promise<void> {
    try {
      const habitRef = doc(db, COLLECTION_NAME, habitId);
      await deleteDoc(habitRef);
    } catch (error) {
      console.error('Error deleting habit:', error);
      throw error;
    }
  },

  // Update habit completion
  async toggleHabitCompletion(
    habitId: string, 
    completedDates: string[], 
    streak: number
  ): Promise<void> {
    try {
      const habitRef = doc(db, COLLECTION_NAME, habitId);
      await updateDoc(habitRef, {
        completedDates,
        streak,
      });
    } catch (error) {
      console.error('Error toggling habit completion:', error);
      throw error;
    }
  },
}; 