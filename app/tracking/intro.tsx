import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Check } from 'lucide-react-native';
import { getPeptideById } from '../../data/peptides';
import { useScheduleStore } from '../../store/useScheduleStore';
import { Colors, Radii, Typography, FontWeight, Spacing } from '../../constants/theme';

export default function TrackingIntroScreen() {
  const { peptideId } = useLocalSearchParams<{ peptideId: string }>();
  const peptide = getPeptideById(peptideId);
  const { scheduledPeptides } = useScheduleStore();
  const sp = scheduledPeptides.find(s => s.peptideId === peptideId);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.content}>
        {/* Summary card */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryLeft}>
            <View style={[styles.dot, { backgroundColor: Colors.accentGreen }]} />
            <View>
              <Text style={styles.summaryName}>{peptide?.name ?? peptideId}</Text>
              <Text style={styles.summaryMeta}>
                {sp?.dose ?? '0.5'} {sp?.unit ?? 'mg'} · {sp?.times?.join(' & ') ?? '9:00 AM'} · {sp?.days?.length ?? 7}x/wk
              </Text>
            </View>
          </View>
          <View style={styles.addedBadge}>
            <Check size={10} color="#fff" />
            <Text style={styles.addedBadgeText}>Added</Text>
          </View>
        </View>

        <Text style={styles.headline}>Want to track{'\n'}outcomes?</Text>
        <Text style={styles.sub}>
          Watch the change unfold — what {peptide?.name ?? 'this peptide'} is actually doing, week by week.
        </Text>

        <TouchableOpacity
          style={styles.yesBtn}
          onPress={() => router.push({ pathname: '/tracking/select-metrics' as any, params: { peptideId } })}
          activeOpacity={0.85}
        >
          <Text style={styles.yesBtnText}>Yes, set up tracking</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push({ pathname: '/schedule/peptide-added' as any, params: { peptideId } })}
          style={styles.skipBtn}
        >
          <Text style={styles.skipText}>Skip for now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.base },
  content: { flex: 1, paddingHorizontal: Spacing.lg, paddingTop: 100, alignItems: 'center' },
  summaryCard: {
    width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: '#EDFBF3', borderRadius: Radii.xl, padding: Spacing.md,
    borderWidth: 1, borderColor: '#B0F0CC', marginBottom: Spacing.xl,
  },
  summaryLeft: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, flex: 1 },
  dot: { width: 10, height: 10, borderRadius: 5 },
  summaryName: { fontSize: Typography.base, fontWeight: FontWeight.bold, color: Colors.textPrimary },
  summaryMeta: { fontSize: Typography.xs, color: Colors.textSecondary },
  addedBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: Colors.accentGreen, borderRadius: Radii.full, paddingHorizontal: Spacing.sm, paddingVertical: 4,
  },
  addedBadgeText: { color: '#fff', fontSize: Typography.xs, fontWeight: FontWeight.bold },
  headline: {
    fontSize: Typography.xxl, fontWeight: FontWeight.extrabold, color: Colors.textPrimary,
    textAlign: 'center', marginBottom: Spacing.md, lineHeight: 36,
  },
  sub: { fontSize: Typography.sm, color: Colors.textSecondary, textAlign: 'center', lineHeight: 22, marginBottom: Spacing.xl },
  yesBtn: {
    width: '100%', backgroundColor: Colors.primaryOrange, borderRadius: 32, paddingVertical: 18,
    alignItems: 'center', marginBottom: Spacing.md,
  },
  yesBtnText: { color: '#fff', fontSize: Typography.base, fontWeight: FontWeight.bold },
  skipBtn: { paddingVertical: Spacing.md },
  skipText: { color: Colors.textTertiary, fontSize: Typography.base },
});
