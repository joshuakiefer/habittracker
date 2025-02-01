import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { Habit } from '../types/habit';
import { loadHabits, saveHabits } from '../utils/storage';

type AddHabitScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'AddHabit'>;
};

export default function AddHabitScreen({ navigation }: AddHabitScreenProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleAddHabit = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter a habit name');
      return;
    }

    const newHabit: Habit = {
      id: Date.now().toString(),
      name: name.trim(),
      description: description.trim(),
      createdAt: new Date(),
      completedDates: [],
      streak: 0,
    };

    try {
      console.log('Adding new habit:', newHabit);
      const existingHabits = await loadHabits();
      console.log('Existing habits:', existingHabits);
      
      const updatedHabits = [...existingHabits, newHabit];
      await saveHabits(updatedHabits);
      console.log('Saved habits:', updatedHabits);
      
      // Force a reload of the home screen
      navigation.navigate('Home');
    } catch (error) {
      console.error('Error saving habit:', error);
      Alert.alert('Error', 'Failed to save habit');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Habit Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={[styles.input, styles.descriptionInput]}
        placeholder="Description (optional)"
        value={description}
        onChangeText={setDescription}
        multiline
      />
      <Button title="Add Habit" onPress={handleAddHabit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  descriptionInput: {
    height: 100,
    textAlignVertical: 'top',
  },
});
