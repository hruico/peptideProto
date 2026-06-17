import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { X } from 'lucide-react-native';
import { useState } from 'react';
import { addWeeks, format } from 'date-fns';
import { Colors, Radii, Typography, FontWeight, Spacing } from '../../constants/theme';

const DURATION_OPTIONS = [4, 8, 12];

export default function TrackingDurationScreen() {
  const { peptideId, metrics } = useLocalSearchParams<{ peptideId: string; metrics: string }>();
  const [selectedWeeks, setSelectedWeeks] = useState(4);

  const endDate = addWeeks(new Date(), selectedWeeks);
  const daysFromNow = selectedWeeks * 7;

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.navBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn}>
          <X size={20} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.navTitle}>How long are you tracking?</Text>
        <View style={{ width: 36 }} />
      </View>

      <View style={styles.content}>
        <Text style={styles.sub}>The longer the window, the clearer results will be</Text>

        <View style={styles.optionRow}>
          {DURATION_OPTIONS.map((w) => (
            <TouchableOpacity
              key={w}
              style={[styles.optionPill, selectedWeeks === w && styles.optionPillActive]}
              onPress={() => setSelectedWeeks(w)}
            >
              <Text style={[styles.optionPillText, selectedWeeks === w && styles.optionPillTextActive]}>
                {w} weeks
              </Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={styles.optionPill}>
            <Text style={styles.optionPillText}>Custom</Text>
          </TouchableOpacity>
        </View>

        {/* Window visualization */}
        <View style={styles.windowCard}>
          <Text style={styles.windowLabel}>TRACKING WINDOW</Text>
          <Text style={styles.windowEnd}>Ends {format(endDate, 'MMM d')}</Text>
          <View style={styles.timelineBar}>
            <View style={styles.timelineStart}>
              <View style={styles.timelineDot} />
              <Text style={styles.timelineLabel}>Today</Text>
            </View>
            <View style={styles.timelineTrack}>
              <View style={[styles.timelineFill, { width: '100%' }]} />
            </View>
            <View style={styles.timelineEnd}>
              <View style={[styles.timelineDot, { backgroundColor: Colors.primaryOrange }]} />
              <Text style={styles.timelineLabel}>{format(endDate, 'MMM d')}</Text>
            </View>
          </View>
          <Text style={styles.windowDays}>{daysFromNow} days from today</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.continueBtn}
          onPress={() => router.push({ pathname: '/tracking/baseline' as any, params: { peptideId, metrics, durationWeeks: selectedWeeks.toString() } })}
          activeOpacity={0.85}
        >
          <Text style={styles.continueBtnText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.base },
  navBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg, paddingTop: 52, paddingBottom: Spacing.md,
  },
  closeBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.surface, alignItems: 'center', justifyContent: 'center' },
  navTitle: { fontSize: Typography.base, fontWeight: FontWeight.bold, color: Colors.textPrimary, flex: 1, textAlign: 'center' },
  content: { flex: 1, paddingHorizontal: Spacing.lg, paddingTop: Spacing.xl },
  sub: { fontSize: Typography.sm, color: Colors.textSecondary, textAlign: 'center', marginBottom: Spacing.xl },
  optionRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, justifyContent: 'center', marginBottom: Spacing.xl },
  optionPill: {
    paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md, borderRadius: Radii.full,
    backgroundColor: Colors.surface, borderWidth: 1.5, borderColor: Colors.surfaceBorder,
  },
  optionPillActive: { backgroundColor: Colors.primaryOrangeLight, borderColor: Colors.primaryOrange },
  optionPillText: { fontSize: Typography.sm, color: Colors.textSecondary, fontWeight: FontWeight.medium },
  optionPillTextActive: { color: Colors.primaryOrange, fontWeight: FontWeight.bold },
  windowCard: {
    backgroundColor: Colors.surface, borderRadius: Radii.xl, padding: Spacing.lg,
    borderWidth: 1, borderColor: Colors.surfaceBorder, alignItems: 'center',
  },
  windowLabel: { fontSize: Typography.xs, color: Colors.textTertiary, fontWeight: FontWeight.semibold, letterSpacing: 1.5, marginBottom: Spacing.sm },
  windowEnd: { fontSize: Typography.xl, fontWeight: FontWeight.extrabold, color: Colors.textPrimary, marginBottom: Spacing.lg },
  timelineBar: { flexDirection: 'row', alignItems: 'center', width: '100%', marginBottom: Spacing.sm },
  timelineStart: { alignItems: 'center', gap: 4 },
  timelineEnd: { alignItems: 'center', gap: 4 },
  timelineDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.textTertiary },
  timelineTrack: { flex: 1, height: 4, backgroundColor: Colors.surfaceBorder, marginHorizontal: Spacing.sm },
  timelineFill: { height: 4, backgroundColor: Colors.primaryOrange, borderRadius: 2 },
  timelineLabel: { fontSize: Typography.xs, color: Colors.textTertiary },
  windowDays: { fontSize: Typography.sm, color: Colors.textSecondary, marginTop: Spacing.sm },
  footer: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    padding: Spacing.lg, paddingBottom: 36, backgroundColor: Colors.base,
    borderTopWidth: 1, borderTopColor: Colors.surfaceBorder,
  },
  continueBtn: { backgroundColor: Colors.primaryOrange, borderRadius: 32, paddingVertical: 18, alignItems: 'center' },
  continueBtnText: { color: '#fff', fontSize: Typography.base, fontWeight: FontWeight.bold },
});
