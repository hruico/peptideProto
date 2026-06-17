import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Bell, Bookmark, Plus, Check, User, Activity, BookOpen } from 'lucide-react-native';
import { useState, useMemo } from 'react';
import { format, addDays, startOfDay, isSameDay } from 'date-fns';
import { useScheduleStore } from '../../store/useScheduleStore';
import { Colors, Radii, Typography, FontWeight, Spacing } from '../../constants/theme';

const DAYS_OF_WEEK = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export default function MyPeptidesScreen() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { scheduledPeptides, markDoseTaken, takenDoses } = useScheduleStore();

  const weekDates = useMemo(() => {
    const today = startOfDay(new Date());
    return Array.from({ length: 7 }, (_, i) => addDays(today, i - 3));
  }, []);

  const todayDoses = useMemo(() => {
    return scheduledPeptides.flatMap((sp) => {
      const dayOfWeek = selectedDate.getDay();
      if (!sp.days.includes(dayOfWeek)) return [];
      return sp.times.map((time) => ({
        ...sp, time,
        doseKey: `${sp.id}-${format(selectedDate, 'yyyy-MM-dd')}-${time}`,
      }));
    });
  }, [scheduledPeptides, selectedDate]);

  const upcomingDoses = useMemo(() => {
    const today = startOfDay(new Date());
    const result: { date: Date; doses: typeof todayDoses }[] = [];
    for (let i = 1; i <= 7; i++) {
      const date = addDays(today, i);
      const doses = scheduledPeptides.flatMap((sp) => {
        if (!sp.days.includes(date.getDay())) return [];
        return sp.times.map((time) => ({
          ...sp, time,
          doseKey: `${sp.id}-${format(date, 'yyyy-MM-dd')}-${time}`,
        }));
      });
      if (doses.length > 0) result.push({ date, doses });
    }
    return result;
  }, [scheduledPeptides]);

  const totalDays = scheduledPeptides.length > 0
    ? Math.max(...scheduledPeptides.map(sp =>
        sp.durationUnit === 'weeks' ? (sp.durationValue || 4) * 7 : sp.durationValue || 28))
    : 0;

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/account/account')} style={styles.avatarBtn}>
          <User size={16} color="rgba(255,255,255,0.6)" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Welcome</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.iconBtn}><Activity size={20} color="rgba(255,255,255,0.6)" /></TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn}><BookOpen size={20} color="rgba(255,255,255,0.6)" /></TouchableOpacity>
        </View>
      </View>

      {/* Calendar Strip */}
      <View style={styles.calendarStrip}>
        {weekDates.map((date, i) => {
          const isSelected = isSameDay(date, selectedDate);
          const isToday = isSameDay(date, new Date());
          const hasDose = scheduledPeptides.some(sp => sp.days.includes(date.getDay()));
          return (
            <TouchableOpacity key={i} style={styles.dayCol} onPress={() => setSelectedDate(date)}>
              <Text style={[styles.dayLabel, isSelected && styles.dayLabelSelected]}>
                {['MON','TUE','WED','THU','FRI','SAT','SUN'][date.getDay() === 0 ? 6 : date.getDay() - 1]}
              </Text>
              <View style={[styles.dateCircle, isSelected && styles.dateCircleSelected, isToday && !isSelected && styles.dateCircleToday]}>
                <Text style={[styles.dateNum, isSelected && styles.dateNumSelected]}>{date.getDate()}</Text>
              </View>
              {hasDose && <View style={[styles.dot, isSelected && styles.dotSelected]} />}
            </TouchableOpacity>
          );
        })}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Today section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Today's doses</Text>
            {totalDays > 0 && <Text style={styles.dayCounter}>Day 1 of {totalDays} ›</Text>}
          </View>
          <Text style={styles.sectionSub}>{scheduledPeptides.length} My Peptide{scheduledPeptides.length !== 1 ? 's' : ''}</Text>

          {todayDoses.length === 0 ? (
            <Text style={styles.emptyText}>No doses scheduled today</Text>
          ) : (
            todayDoses.map((dose) => {
              const taken = takenDoses.includes(dose.doseKey);
              return (
                <TouchableOpacity key={dose.doseKey} style={styles.doseRow} onPress={() => markDoseTaken(dose.doseKey)} activeOpacity={0.7}>
                  <View style={[styles.doseCircle, taken && styles.doseCircleTaken]}>
                    {taken && <Check size={11} color="#fff" strokeWidth={3} />}
                  </View>
                  <View style={styles.doseInfo}>
                    <Text style={styles.doseName}>{dose.label || dose.peptideId.toUpperCase()}</Text>
                    <Text style={styles.doseMeta}>{dose.dose} {dose.unit}</Text>
                  </View>
                  <Text style={styles.doseTime}>{dose.time}</Text>
                </TouchableOpacity>
              );
            })
          )}

          <TouchableOpacity style={styles.addBtn} onPress={() => router.push('/onboarding/goal-picker')}>
            <Plus size={15} color={Colors.primaryOrange} />
            <Text style={styles.addBtnText}>Add a peptide</Text>
          </TouchableOpacity>
        </View>

        {/* Upcoming */}
        {upcomingDoses.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Upcoming doses ({upcomingDoses.reduce((a, d) => a + d.doses.length, 0)})
            </Text>
            {upcomingDoses.map(({ date, doses }) => (
              <View key={date.toISOString()} style={styles.upcomingGroup}>
                <Text style={styles.upcomingDate}>{format(date, 'EEEE, MMM d')}</Text>
                {doses.map((dose) => (
                  <View key={dose.doseKey} style={styles.upcomingRow}>
                    <Text style={styles.upcomingName}>{dose.label || dose.peptideId.toUpperCase()}</Text>
                    <Text style={styles.upcomingTime}>{dose.time}</Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.base },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg, paddingTop: 56, paddingBottom: Spacing.md,
  },
  avatarBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: Colors.surfaceElevated, alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: Colors.surfaceBorder,
  },
  headerTitle: { color: Colors.textPrimary, fontSize: Typography.md, fontWeight: FontWeight.semibold },
  headerRight: { flexDirection: 'row', gap: Spacing.sm },
  iconBtn: { padding: 6 },
  calendarStrip: {
    flexDirection: 'row', justifyContent: 'space-around',
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.md,
    borderBottomWidth: 1, borderBottomColor: Colors.surfaceBorder,
  },
  dayCol: { alignItems: 'center', gap: 4 },
  dayLabel: { fontSize: 9, color: Colors.textTertiary, fontWeight: FontWeight.semibold, letterSpacing: 0.5 },
  dayLabelSelected: { color: Colors.primaryOrange },
  dateCircle: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  dateCircleSelected: { backgroundColor: Colors.primaryOrange },
  dateCircleToday: { borderWidth: 1.5, borderColor: Colors.primaryOrange },
  dateNum: { fontSize: Typography.sm, color: Colors.textPrimary, fontWeight: FontWeight.semibold },
  dateNumSelected: { color: '#fff' },
  dot: { width: 4, height: 4, borderRadius: 2, backgroundColor: Colors.textTertiary },
  dotSelected: { backgroundColor: '#fff' },
  scroll: { paddingBottom: 100 },
  section: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.lg },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 },
  sectionTitle: { fontSize: Typography.md, fontWeight: FontWeight.bold, color: Colors.textPrimary },
  sectionSub: { fontSize: Typography.sm, color: Colors.textTertiary, marginBottom: Spacing.md },
  dayCounter: { fontSize: Typography.sm, color: Colors.primaryOrange, fontWeight: FontWeight.semibold },
  emptyText: { color: Colors.textTertiary, fontSize: Typography.sm, marginVertical: Spacing.md },
  doseRow: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    paddingVertical: Spacing.sm, borderBottomWidth: 1, borderBottomColor: Colors.surfaceBorder,
  },
  doseCircle: {
    width: 24, height: 24, borderRadius: 12,
    borderWidth: 2, borderColor: Colors.surfaceBorder,
    alignItems: 'center', justifyContent: 'center',
  },
  doseCircleTaken: { backgroundColor: Colors.primaryOrange, borderColor: Colors.primaryOrange },
  doseInfo: { flex: 1 },
  doseName: { fontSize: Typography.base, fontWeight: FontWeight.semibold, color: Colors.textPrimary },
  doseMeta: { fontSize: Typography.xs, color: Colors.textTertiary },
  doseTime: { fontSize: Typography.sm, color: Colors.textSecondary },
  addBtn: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, paddingVertical: Spacing.md, marginTop: Spacing.sm },
  addBtnText: { color: Colors.primaryOrange, fontSize: Typography.base, fontWeight: FontWeight.semibold },
  upcomingGroup: { marginBottom: Spacing.lg },
  upcomingDate: { fontSize: Typography.base, fontWeight: FontWeight.bold, color: Colors.textPrimary, marginBottom: 4 },
  upcomingRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingVertical: Spacing.xs, borderBottomWidth: 1, borderBottomColor: Colors.surfaceBorder,
  },
  upcomingName: { fontSize: Typography.sm, color: Colors.textPrimary },
  upcomingTime: { fontSize: Typography.sm, color: Colors.textSecondary },
});
