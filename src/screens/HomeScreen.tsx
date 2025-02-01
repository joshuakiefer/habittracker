import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Button, SafeAreaView, Platform } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { Habit } from '../types/habit';
import { loadHabits } from '../utils/storage';
import HabitList from '../components/HabitList';
import { useFocusEffect } from '@react-navigation/native';

type HomeScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
};

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const [habits, setHabits] = useState<Habit[]>([]);

  const loadHabitData = async () => {
    try {
      const loadedHabits = await loadHabits();
      console.log('Loaded habits:', loadedHabits);
      setHabits(loadedHabits);
    } catch (error) {
      console.error('Error loading habits:', error);
    }
  };

  // Refresh habits when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      loadHabitData();
    }, [])
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <HabitList habits={habits} onHabitsChange={setHabits} />
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
    padding: 20,
    backgroundColor: '#fff',
  },
  buttonContainer: {
    padding: Platform.OS === 'ios' ? 20 : 0,
    backgroundColor: '#fff',
  }
});
