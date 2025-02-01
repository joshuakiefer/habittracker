import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Habit } from '../types/habit';
import HabitItem from './HabitItem';
import { saveHabits } from '../utils/storage';

type HabitListProps = {
  habits: Habit[];
  onHabitsChange: (habits: Habit[]) => void;
};

export default function HabitList({ habits, onHabitsChange }: HabitListProps) {
  const toggleHabit = async (habitId: string) => {
    const today = new Date().toISOString().split('T')[0];
    
    const updatedHabits = habits.map(habit => {
      if (habit.id === habitId) {
        const completedDates = habit.completedDates || [];
        const isCompleted = completedDates.includes(today);
        
        const newCompletedDates = isCompleted
          ? completedDates.filter(date => date !== today)
          : [...completedDates, today];

        return {
          ...habit,
          completedDates: newCompletedDates,
          streak: calculateStreak(newCompletedDates),
        };
      }
      return habit;
    });

    await saveHabits(updatedHabits);
    onHabitsChange(updatedHabits);
  };

  const deleteHabit = async (habitId: string) => {
    const updatedHabits = habits.filter(habit => habit.id !== habitId);
    await saveHabits(updatedHabits);
    onHabitsChange(updatedHabits);
  };

  const calculateStreak = (dates: string[]): number => {
    if (dates.length === 0) return 0;
    
    const sortedDates = [...dates].sort();
    const today = new Date().toISOString().split('T')[0];
    let streak = 0;
    let currentDate = new Date(today);

    while (true) {
      const dateString = currentDate.toISOString().split('T')[0];
      if (!dates.includes(dateString)) break;
      
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    }

    return streak;
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={habits}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <HabitItem
            habit={item}
            onToggle={() => toggleHabit(item.id)}
            onDelete={() => deleteHabit(item.id)}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
