import React, { useState } from 'react';
import { 
  View, 
  TextInput, 
  Button, 
  StyleSheet, 
  Alert,
  ActivityIndicator,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { Habit, HabitCategory, CATEGORY_COLORS, CATEGORY_ICONS } from '../types/habit';
import { loadHabits, saveHabits } from '../utils/storage';

type AddHabitScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'AddHabit'>;
};

const CATEGORIES: HabitCategory[] = ['health', 'productivity', 'learning', 'fitness', 'mindfulness', 'other'];

export default function AddHabitScreen({ navigation }: AddHabitScreenProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<HabitCategory>('other');
  const [isSaving, setIsSaving] = useState(false);

  const handleAddHabit = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter a habit name');
      return;
    }

    setIsSaving(true);
    console.log('Starting to save habit...');

    try {
      const newHabit: Habit = {
        id: Date.now().toString(),
        name: name.trim(),
        description: description.trim(),
        category,
        createdAt: new Date(),
        completedDates: [],
        streak: 0,
      };

      console.log('New habit object:', newHabit);
      const existingHabits = await loadHabits();
      console.log('Loaded existing habits:', existingHabits.length);
      
      await saveHabits([...existingHabits, newHabit]);
      console.log('Habit saved successfully');
      
      navigation.navigate('Home');
    } catch (error) {
      console.error('Error in handleAddHabit:', error);
      Alert.alert(
        'Error',
        'Failed to save habit. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.label}>Habit Name *</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter habit name"
          value={name}
          onChangeText={setName}
          editable={!isSaving}
        />
        
        <Text style={styles.label}>Description (Optional)</Text>
        <TextInput
          style={[styles.input, styles.descriptionInput]}
          placeholder="Enter description"
          value={description}
          onChangeText={setDescription}
          multiline
          editable={!isSaving}
        />

        <Text style={styles.label}>Category</Text>
        <View style={styles.categoryContainer}>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[
                styles.categoryButton,
                { backgroundColor: CATEGORY_COLORS[cat] },
                category === cat && styles.selectedCategory
              ]}
              onPress={() => setCategory(cat)}
            >
              <Text style={styles.categoryIcon}>{CATEGORY_ICONS[cat]}</Text>
              <Text style={styles.categoryText}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        
        {isSaving ? (
          <View style={styles.savingContainer}>
            <ActivityIndicator size="small" color="#007AFF" />
            <Text style={styles.savingText}>Saving habit...</Text>
          </View>
        ) : (
          <Button 
            title="Add Habit" 
            onPress={handleAddHabit}
          />
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  descriptionInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
    marginHorizontal: -5,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    margin: 5,
    borderRadius: 20,
    opacity: 0.8,
  },
  selectedCategory: {
    opacity: 1,
    transform: [{ scale: 1.05 }],
  },
  categoryIcon: {
    fontSize: 16,
    marginRight: 4,
  },
  categoryText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  savingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  savingText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#666',
  },
});
