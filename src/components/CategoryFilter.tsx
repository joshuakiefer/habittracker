import React from 'react';
import { 
  ScrollView, 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  View 
} from 'react-native';
import { HabitCategory, CATEGORY_COLORS, CATEGORY_ICONS } from '../types/habit';

type CategoryFilterProps = {
  selectedCategory: HabitCategory | 'all';
  onSelectCategory: (category: HabitCategory | 'all') => void;
  counts: Record<HabitCategory | 'all', number>;
};

const CATEGORIES: (HabitCategory | 'all')[] = ['all', 'health', 'productivity', 'learning', 'fitness', 'mindfulness', 'other'];

export default function CategoryFilter({ 
  selectedCategory, 
  onSelectCategory,
  counts
}: CategoryFilterProps) {
  return (
    <View style={styles.container}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {CATEGORIES.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryButton,
              { 
                backgroundColor: category === 'all' 
                  ? '#007AFF' 
                  : CATEGORY_COLORS[category as HabitCategory]
              },
              selectedCategory === category && styles.selectedCategory,
              selectedCategory !== category && styles.unselectedCategory,
            ]}
            onPress={() => onSelectCategory(category)}
          >
            {category !== 'all' && (
              <Text style={styles.categoryIcon}>
                {CATEGORY_ICONS[category as HabitCategory]}
              </Text>
            )}
            <Text style={styles.categoryText}>
              {category === 'all' ? 'All' : 
                category.charAt(0).toUpperCase() + category.slice(1)}
            </Text>
            <View style={styles.countBadge}>
              <Text style={styles.countText}>{counts[category]}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
  },
  scrollContent: {
    paddingHorizontal: 10,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginHorizontal: 4,
  },
  selectedCategory: {
    transform: [{ scale: 1.05 }],
    opacity: 1,
  },
  unselectedCategory: {
    opacity: 0.7,
  },
  categoryIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  categoryText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  countBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 6,
  },
  countText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
}); 