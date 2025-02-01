import React, { useEffect, useState } from 'react';
import { 
  View, 
  StyleSheet, 
  Button, 
  SafeAreaView, 
  Platform, 
  ActivityIndicator,
  Text 
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { Habit, HabitCategory } from '../types/habit';
import { loadHabits } from '../utils/storage';
import HabitList from '../components/HabitList';
import CategoryFilter from '../components/CategoryFilter';
import { useFocusEffect } from '@react-navigation/native';

type HomeScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
};

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<HabitCategory | 'all'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadHabitData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const loadedHabits = await loadHabits();
      setHabits(loadedHabits);
    } catch (err) {
      setError('Failed to load habits');
      console.error('Error loading habits:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadHabitData();
    }, [])
  );

  const filteredHabits = selectedCategory === 'all'
    ? habits
    : habits.filter(habit => habit.category === selectedCategory);

  const getCategoryCounts = () => {
    const counts: Record<HabitCategory | 'all', number> = {
      all: habits.length,
      health: 0,
      productivity: 0,
      learning: 0,
      fitness: 0,
      mindfulness: 0,
      other: 0
    };

    habits.forEach(habit => {
      counts[habit.category]++;
    });

    return counts;
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading habits...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <Button title="Retry" onPress={loadHabitData} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {habits.length > 0 && (
          <CategoryFilter
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            counts={getCategoryCounts()}
          />
        )}
        
        {habits.length === 0 ? (
          <View style={styles.centerContainer}>
            <Text style={styles.emptyText}>No habits yet!</Text>
            <Text style={styles.subText}>Tap the button below to add your first habit</Text>
          </View>
        ) : filteredHabits.length === 0 ? (
          <View style={styles.centerContainer}>
            <Text style={styles.emptyText}>No habits in this category</Text>
            <Text style={styles.subText}>Try selecting a different category or add a new habit</Text>
          </View>
        ) : (
          <HabitList habits={filteredHabits} onHabitsChange={setHabits} />
        )}
        
        <View style={styles.buttonContainer}>
          <Button 
            title="Add New Habit" 
            onPress={() => navigation.navigate('AddHabit')} 
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  buttonContainer: {
    padding: Platform.OS === 'ios' ? 20 : 0,
    backgroundColor: '#fff',
    marginHorizontal: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  }
});
