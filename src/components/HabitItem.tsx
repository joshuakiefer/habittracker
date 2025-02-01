import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Platform } from 'react-native';
import { Habit, CATEGORY_COLORS, CATEGORY_ICONS } from '../types/habit';

type HabitItemProps = {
  habit: Habit;
  onToggle: () => void;
  onDelete: () => void;
};

export default function HabitItem({ habit, onToggle, onDelete }: HabitItemProps) {
  const today = new Date().toISOString().split('T')[0];
  const isCompletedToday = habit.completedDates.includes(today);

  const handleDelete = () => {
    if (Platform.OS === 'web') {
      // For web, use confirm instead of Alert
      if (window.confirm(`Are you sure you want to delete "${habit.name}"?`)) {
        onDelete();
      }
    } else {
      // For mobile, use Alert
      Alert.alert(
        'Delete Habit',
        `Are you sure you want to delete "${habit.name}"?`,
        [
          { 
            text: 'Cancel', 
            style: 'cancel'
          },
          { 
            text: 'Delete', 
            onPress: onDelete,
            style: 'destructive'
          }
        ],
        { cancelable: true }
      );
    }
  };

  return (
    <View style={[styles.container, { borderLeftColor: CATEGORY_COLORS[habit.category] }]}>
      <TouchableOpacity 
        onPress={onToggle} 
        style={styles.habitContent}
        activeOpacity={0.7}
      >
        <View style={styles.habitInfo}>
          <View style={styles.headerRow}>
            <Text style={styles.habitName}>{habit.name}</Text>
            <View style={[styles.categoryBadge, { backgroundColor: CATEGORY_COLORS[habit.category] }]}>
              <Text style={styles.categoryIcon}>{CATEGORY_ICONS[habit.category]}</Text>
              <Text style={styles.categoryText}>
                {habit.category.charAt(0).toUpperCase() + habit.category.slice(1)}
              </Text>
            </View>
          </View>
          {habit.description && (
            <Text style={styles.description}>{habit.description}</Text>
          )}
          <Text style={styles.streak}>Current streak: {habit.streak} days</Text>
        </View>
        <View style={[styles.checkbox, isCompletedToday && styles.checked]} />
      </TouchableOpacity>
      
      <TouchableOpacity 
        onPress={handleDelete}
        style={styles.deleteButton}
        activeOpacity={0.7}
      >
        <Text style={styles.deleteText}>×</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 8,
    marginVertical: 5,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderLeftWidth: 4,
  },
  habitContent: {
    flex: 1,
    flexDirection: 'row',
    padding: 15,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  habitInfo: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  habitName: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 8,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  categoryText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  streak: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#007AFF',
    marginLeft: 10,
  },
  checked: {
    backgroundColor: '#007AFF',
  },
  deleteButton: {
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteText: {
    color: '#FF3B30',
    fontSize: 24,
    fontWeight: 'bold',
  },
});
