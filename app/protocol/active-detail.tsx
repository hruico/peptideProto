/**
 * /protocol/active-detail — shown when user taps an active protocol on the home page.
 * Shows tracker-focused stats: progress, days, dosing schedule, and quick actions.
 * Navigate: router.push({ pathname: '/protocol/active-detail', params: { id } })
 */
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import {
  X, ChevronRight, FlaskConical, Clock, Calendar,
  TrendingUp, Bell, Trash2,
} from 'lucide-react-native';
import { differenceInDays, format, addDays } from 'date-fns';
import { LinearGradient } from 'expo-linear-gradient';
import { useProtocolStore } from '../../store/useProtocolStore';
import { getProtocolById } from '../../data/protocols';
import { getPeptideById } from '../../data/peptides';
import { Colors, Radii, Typography, FontWeight, Spacing } from '../../constants/theme';
import ScreenBackground from '../../components/ScreenBackground';

const { width: W } = Dimensions.get('window');

export default function ActiveProtocolDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { myProtocols, removeProtocol } = useProtocolStore();

  const activeEntry = myProtocols.find((p) => p.id === id);
  const catalog = getProtocolById(id);

  if (!activeEntry || !catalog) {
    return (
      <ScreenBackground>
        <TouchableOpacity style={styles.closeBtn} onPress={() => router.back()}>
          <X size={18} color="rgba(255,255,255,0.7)" />
        </TouchableOpacity>
        <View style={styles.notFoundCenter}>
          <Text style={styles.notFoundText}>Protocol not found or not active.</Text>
          <TouchableOpacity onPress={() => router.back()} style={styles.backLink}>
            <Text style={styles.backLinkText}>Go back</Text>
          </TouchableOpacity>
        </View>
      </ScreenBackground>
    );
  }

  const startDate = new Date(activeEntry.startedAt);
  const dayOn = differenceInDays(new Date(), startDate) + 1;
  const daysLeft = Math.max(0, catalog.durationDays - dayOn);
  const progress = Math.min(dayOn / catalog.durationDays, 1);
  const pct = Math.round(progress * 100);
  const endDate = addDays(startDate, catalog.durationDays);
  const isCompleted = dayOn >= catalog.durationDays;

  function handleStop() {
    removeProtocol(id);
    router.replace('/(tabs)');
  }

  return (
    <ScreenBackground>
      <StatusBar style="light" />

      {/* Close button */}
      <TouchableOpacity style={styles.closeBtn} onPress={() => router.back()}>
        <X size={18} color="rgba(255,255,255,0.7)" />
      </TouchableOpacity>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* ── HERO STATUS CARD ── */}
        <View style={styles.heroCard}>
          <LinearGradient
            colors={isCompleted ? ['#0F4C2A', '#082A18'] : ['#1C2E4A', '#0D1A2E']}
            style={styles.heroGradient}
          >
            {/* Status chip */}
            <View style={[styles.statusChip, isCompleted && styles.statusChipDone]}>
              <View style={[styles.statusDot, { backgroundColor: isCompleted ? Colors.accentGreen : Colors.primaryOrange }]} />
              <Text style={[styles.statusText, isCompleted && { color: Colors.accentGreen }]}>
                {isCompleted ? 'COMPLETED' : 'ACTIVE'}
              </Text>
            </View>

            <Text style={styles.heroName}>{catalog.name}</Text>
            <Text style={styles.heroSub}>{catalog.subtitle}</Text>

            {/* Big day counter */}
            <View style={styles.dayCountRow}>
              <View style={styles.dayCountBlock}>
                <Text style={styles.dayCountNum}>{dayOn}</Text>
                <Text style={styles.dayCountLabel}>Day on</Text>
              </View>
              <View style={styles.dayCountDivider} />
              <View style={styles.dayCountBlock}>
                <Text style={styles.dayCountNum}>{catalog.durationDays}</Text>
                <Text style={styles.dayCountLabel}>Total days</Text>
              </View>
              <View style={styles.dayCountDivider} />
              <View style={styles.dayCountBlock}>
                <Text style={[styles.dayCountNum, { color: isCompleted ? Colors.accentGreen : Colors.primaryOrange }]}>
                  {isCompleted ? '✓' : daysLeft}
                </Text>
                <Text style={styles.dayCountLabel}>{isCompleted ? 'Done' : 'Days left'}</Text>
              </View>
            </View>

            {/* Progress bar */}
            <View style={styles.progressBg}>
              <View style={[styles.progressFill, { width: `${pct}%` as any, backgroundColor: isCompleted ? Colors.accentGreen : Colors.primaryOrange }]} />
            </View>
            <View style={styles.progressFooter}>
              <Text style={styles.progressLabel}>{pct}% complete</Text>
              <Text style={styles.progressLabel}>Ends {format(endDate, 'MMM d, yyyy')}</Text>
            </View>
          </LinearGradient>
        </View>

        {/* ── DATE STATS ── */}
        <View style={styles.statsRow}>
          <View style={styles.statTile}>
            <Calendar size={16} color={Colors.primaryOrange} />
            <Text style={styles.statValue}>{format(startDate, 'MMM d')}</Text>
            <Text style={styles.statLabel}>Started</Text>
          </View>
          <View style={styles.statTile}>
            <Clock size={16} color={Colors.accentTeal} />
            <Text style={styles.statValue}>{catalog.durationLabel}</Text>
            <Text style={styles.statLabel}>Duration</Text>
          </View>
          <View style={styles.statTile}>
            <TrendingUp size={16} color={Colors.accentGreen} />
            <Text style={styles.statValue}>{pct}%</Text>
            <Text style={styles.statLabel}>Progress</Text>
          </View>
        </View>

        {/* ── DOSING SCHEDULE ── */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>TODAY'S DOSES</Text>
          {catalog.schedule.map((entry, i) => {
            const peptide = getPeptideById(entry.peptideId);
            return (
              <TouchableOpacity
                key={i}
                style={styles.doseRow}
                onPress={() => router.push({ pathname: '/peptide/[id]', params: { id: entry.peptideId } })}
                activeOpacity={0.8}
              >
                <View style={[styles.doseAvatar, { backgroundColor: getCategoryColor(peptide?.category ?? '') }]}>
                  <Text style={styles.doseAvatarLetter}>{(peptide?.name ?? entry.peptideId)[0]}</Text>
                </View>
                <View style={styles.doseInfo}>
                  <Text style={styles.doseName}>{peptide?.name ?? entry.peptideId}</Text>
                  <Text style={styles.doseMeta}>
                    {entry.dose} {entry.unit} · {entry.frequency}
                    {entry.timing ? ` · ${entry.timing}` : ''}
                  </Text>
                </View>
                <ChevronRight size={14} color={Colors.textTertiary} />
              </TouchableOpacity>
            );
          })}
        </View>

        {/* ── PEPTIDE CHIPS ── */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>PEPTIDES IN THIS PROTOCOL</Text>
          <View style={styles.chipRow}>
            {catalog.peptideIds.map((pid) => {
              const p = getPeptideById(pid);
              return (
                <TouchableOpacity
                  key={pid}
                  style={styles.chip}
                  onPress={() => router.push({ pathname: '/peptide/[id]', params: { id: pid } })}
                  activeOpacity={0.8}
                >
                  <Text style={styles.chipText}>{p?.name ?? pid}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* ── ACTIONS ── */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.actionRow}
            onPress={() => router.push({ pathname: '/protocol/[id]', params: { id } })}
            activeOpacity={0.8}
          >
            <FlaskConical size={18} color={Colors.primaryOrange} />
            <Text style={styles.actionText}>View full protocol details</Text>
            <ChevronRight size={16} color={Colors.textTertiary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionRow}
            onPress={() => router.push('/account/stats')}
            activeOpacity={0.8}
          >
            <TrendingUp size={18} color={Colors.accentTeal} />
            <Text style={styles.actionText}>View all stats & activity</Text>
            <ChevronRight size={16} color={Colors.textTertiary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionRow, styles.actionRowDanger]}
            onPress={handleStop}
            activeOpacity={0.8}
          >
            <Trash2 size={18} color={Colors.accentRed} />
            <Text style={[styles.actionText, { color: Colors.accentRed }]}>Stop this protocol</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 80 }} />
      </ScrollView>
    </ScreenBackground>
  );
}

function getCategoryColor(cat: string): string {
  const map: Record<string, string> = {
    'Recovery & Healing': '#EF4444', 'Fat Loss': '#F97316',
    'Muscle & Performance': '#3B82F6', 'Cognitive & Neuroprotection': '#8B5CF6',
    'Sleep & Longevity': '#6366F1', 'Skin & Aesthetics': '#EC4899', 'GI & Gut Health': '#22C55E',
  };
  return map[cat] ?? Colors.primaryOrange;
}

const styles = StyleSheet.create({
  closeBtn: {
    position: 'absolute', top: 52, right: Spacing.lg, zIndex: 10,
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center', justifyContent: 'center',
  },
  scroll: { paddingHorizontal: Spacing.lg, paddingTop: 92 },

  notFoundCenter: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  notFoundText: { color: Colors.textSecondary, fontSize: Typography.base, marginBottom: Spacing.md },
  backLink: { paddingVertical: Spacing.sm },
  backLinkText: { color: Colors.primaryOrange, fontSize: Typography.base },

  // Hero
  heroCard: { borderRadius: Radii.xl, overflow: 'hidden', marginBottom: Spacing.md },
  heroGradient: { padding: Spacing.lg, gap: Spacing.sm },
  statusChip: {
    flexDirection: 'row', alignItems: 'center', gap: 5, alignSelf: 'flex-start',
    backgroundColor: 'rgba(232,98,42,0.15)', borderRadius: Radii.full,
    paddingHorizontal: Spacing.sm, paddingVertical: 3, marginBottom: Spacing.sm,
  },
  statusChipDone: { backgroundColor: 'rgba(46,204,113,0.15)' },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  statusText: { color: Colors.primaryOrange, fontSize: 10, fontWeight: FontWeight.bold, letterSpacing: 1 },
  heroName: { color: '#fff', fontSize: Typography.xl, fontWeight: FontWeight.extrabold },
  heroSub: { color: 'rgba(255,255,255,0.55)', fontSize: Typography.sm, marginBottom: Spacing.md },

  // Day counter
  dayCountRow: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.md },
  dayCountBlock: { flex: 1, alignItems: 'center' },
  dayCountNum: { color: '#fff', fontSize: Typography.xxl, fontWeight: FontWeight.extrabold },
  dayCountLabel: { color: 'rgba(255,255,255,0.45)', fontSize: Typography.xs, marginTop: 2 },
  dayCountDivider: { width: 1, height: 36, backgroundColor: 'rgba(255,255,255,0.1)' },

  // Progress
  progressBg: { height: 8, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 4, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 4 },
  progressFooter: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 },
  progressLabel: { color: 'rgba(255,255,255,0.4)', fontSize: Typography.xs },

  // Stats row
  statsRow: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.md },
  statTile: {
    flex: 1, backgroundColor: 'rgba(255,255,255,0.07)', borderRadius: Radii.lg,
    padding: Spacing.md, alignItems: 'center', gap: 4,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
  },
  statValue: { color: '#fff', fontSize: Typography.md, fontWeight: FontWeight.extrabold },
  statLabel: { color: Colors.textTertiary, fontSize: Typography.xs },

  // Section
  section: { marginBottom: Spacing.xl },
  sectionLabel: { color: Colors.textTertiary, fontSize: Typography.xs, fontWeight: FontWeight.semibold, letterSpacing: 1.5, marginBottom: Spacing.md },

  // Dose rows
  doseRow: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: Radii.lg,
    padding: Spacing.md, marginBottom: Spacing.sm,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
  },
  doseAvatar: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  doseAvatarLetter: { color: '#fff', fontSize: Typography.base, fontWeight: FontWeight.bold },
  doseInfo: { flex: 1 },
  doseName: { color: Colors.textPrimary, fontSize: Typography.base, fontWeight: FontWeight.semibold },
  doseMeta: { color: Colors.textSecondary, fontSize: Typography.xs, marginTop: 2 },

  // Chips
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  chip: {
    backgroundColor: Colors.primaryOrangeLight, borderRadius: Radii.full,
    paddingHorizontal: Spacing.md, paddingVertical: 5,
  },
  chipText: { color: Colors.primaryOrange, fontSize: Typography.xs, fontWeight: FontWeight.semibold },

  // Actions
  actionRow: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: Radii.lg,
    padding: Spacing.md, marginBottom: Spacing.sm,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
  },
  actionRowDanger: { borderColor: 'rgba(231,76,60,0.2)', backgroundColor: 'rgba(231,76,60,0.06)' },
  actionText: { flex: 1, color: Colors.textPrimary, fontSize: Typography.base, fontWeight: FontWeight.medium },
});
