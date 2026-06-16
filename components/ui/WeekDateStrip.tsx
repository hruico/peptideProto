import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { startOfWeek, addDays, isSameDay, format } from 'date-fns';
import { Colors, Radii, Typography, FontWeight, Spacing } from '../../constants/theme';

interface Props {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
}

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function WeekDateStrip({ selectedDate, onSelectDate }: Props) {
  const today = new Date();
  // Start week on Monday (weekStartsOn: 1)
  const weekStart = startOfWeek(today, { weekStartsOn: 1 });
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {days.map((day, index) => {
        const isToday = isSameDay(day, today);
        const isSelected = isSameDay(day, selectedDate);

        return (
          <TouchableOpacity
            key={index}
            style={[
              styles.dayItem,
              isSelected && styles.dayItemSelected,
              isToday && !isSelected && styles.dayItemToday,
            ]}
            onPress={() => onSelectDate(day)}
            activeOpacity={0.7}
          >
            <Text style={[styles.dayLabel, isSelected && styles.dayLabelSelected]}>
              {DAY_LABELS[index]}
            </Text>
            <Text style={[styles.dateNumber, isSelected && styles.dateNumberSelected]}>
              {format(day, 'd')}
            </Text>
            {isToday && <View style={[styles.todayDot, isSelected && styles.todayDotSelected]} />}
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm,
    paddingVertical: Spacing.sm,
  },
  dayItem: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 44,
    height: 64,
    borderRadius: Radii.md,
    backgroundColor: Colors.surfaceElevated,
    gap: 4,
  },
  dayItemSelected: {
    backgroundColor: Colors.accentOrange,
  },
  dayItemToday: {
    borderWidth: 1,
    borderColor: Colors.accentOrange,
  },
  dayLabel: {
    fontSize: Typography.xs,
    fontWeight: FontWeight.medium,
    color: Colors.textTertiary,
    textTransform: 'uppercase',
  },
  dayLabelSelected: {
    color: Colors.textPrimary,
  },
  dateNumber: {
    fontSize: Typography.md,
    fontWeight: FontWeight.bold,
    color: Colors.textSecondary,
  },
  dateNumberSelected: {
    color: Colors.textPrimary,
  },
  todayDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.accentOrange,
  },
  todayDotSelected: {
    backgroundColor: Colors.textPrimary,
  },
});
