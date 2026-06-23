import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions,
} from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { X, FlaskConical, ChevronRight, Activity, Bell } from 'lucide-react-native';
import { differenceInDays, format } from 'date-fns';
import { LinearGradient } from 'expo-linear-gradient';
import { useScheduleStore } from '../../store/useScheduleStore';
import { useProtocolStore } from '../../store/useProtocolStore';
import { getProtocolById } from '../../data/protocols';
import { getPeptideById } from '../../data/peptides';
import { Colors, Radii, Typography, FontWeight, Spacing } from '../../constants/theme';
import ScreenBackground from '../../components/ScreenBackground';

const { width: W } = Dimensions.get('window');

export default function StatsScreen() {
  const { scheduledPeptides, removeScheduledPeptide } = useScheduleStore();
  const { myProtocols, activityLog, removeProtocol } = useProtocolStore();

  const hasActivity =
    scheduledPeptides.length > 0 ||
    myProtocols.length > 0 ||
    activityLog.length > 0;

  // Summary numbers
  const completedProtocols = myProtocols.filter((p) => {
    const dayOn = differenceInDays(new Date(), new Date(p.startedAt)) + 1;
    return dayOn >= p.durationDays;
  });
  const inProgressProtocols = myProtocols.filter((p) => {
    const dayOn = differenceInDays(new Date(), new Date(p.startedAt)) + 1;
    return dayOn < p.durationDays;
  });

  return (
    <ScreenBackground>
      <StatusBar style="light" />

      <View style={styles.header}>
        <Text style={styles.title}>Stats & Activity</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn}>
          <X size={18} color={Colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {!hasActivity ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>📊</Text>
            <Text style={styles.emptyTitle}>No activity yet</Text>
            <Text style={styles.emptySub}>
              Start a protocol or add a peptide to see your progress here.
            </Text>
            <TouchableOpacity
              style={styles.exploreBtn}
              onPress={() => { router.back(); router.push('/(tabs)/explore' as any); }}
              activeOpacity={0.85}
            >
              <Text style={styles.exploreBtnText}>Explore Protocols</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {/* ── SUMMARY TILES ── */}
            <View style={styles.summaryRow}>
              <SummaryTile
                value={`${inProgressProtocols.length}`}
                label="Active"
                color={Colors.primaryOrange}
              />
              <SummaryTile
                value={`${scheduledPeptides.length}`}
                label="Peptides"
                color={Colors.accentTeal}
              />
              <SummaryTile
                value={`${completedProtocols.length}`}
                label="Completed"
                color={Colors.accentGreen}
              />
            </View>

            {/* ── ACTIVE PROTOCOLS ── */}
            {inProgressProtocols.length > 0 && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionLabel}>ACTIVE PROTOCOLS</Text>
                  <TouchableOpacity onPress={() => router.push('/account/my-protocols')}>
                    <Text style={styles.seeAll}>See all</Text>
                  </TouchableOpacity>
                </View>
                {inProgressProtocols.map((protocol) => {
                  const dayOn = differenceInDays(new Date(), new Date(protocol.startedAt)) + 1;
                  const progress = Math.min(dayOn / protocol.durationDays, 1);
                  const pct = Math.round(progress * 100);
                  const catalogProto = getProtocolById(protocol.id);
                  return (
                    <TouchableOpacity
                      key={protocol.id}
                      style={styles.protocolCard}
                      onPress={() => router.push({ pathname: '/protocol/[id]', params: { id: protocol.id } })}
                      activeOpacity={0.8}
                    >
                      <LinearGradient
                        colors={['#1C2E4A', '#131E35']}
                        style={styles.protocolCardGradient}
                      >
                        <View style={styles.protocolCardTop}>
                          <View style={styles.iconCircle}>
                            <FlaskConical size={15} color={Colors.primaryOrange} />
                          </View>
                          <View style={styles.protocolInfo}>
                            <Text style={styles.protocolName}>{protocol.name}</Text>
                            <Text style={styles.protocolDay}>
                              Day {dayOn} of {protocol.durationDays} · started {format(new Date(protocol.startedAt), 'MMM d')}
                            </Text>
                          </View>
                          <Text style={styles.pctLabel}>{pct}%</Text>
                        </View>

                        {/* Progress bar */}
                        <View style={styles.progressBg}>
                          <View style={[styles.progressFill, { width: `${pct}%` as any }]} />
                        </View>

                        {/* Peptide chips */}
                        {catalogProto && (
                          <View style={styles.chips}>
                            {catalogProto.peptideIds.slice(0, 4).map((pid) => {
                              const p = getPeptideById(pid);
                              return (
                                <View key={pid} style={styles.chip}>
                                  <Text style={styles.chipText}>{p?.name ?? pid}</Text>
                                </View>
                              );
                            })}
                          </View>
                        )}

                        {/* Schedule summary */}
                        {catalogProto && (
                          <View style={styles.scheduleRows}>
                            {catalogProto.schedule.map((entry, i) => {
                              const p = getPeptideById(entry.peptideId);
                              return (
                                <View key={i} style={styles.scheduleEntry}>
                                  <View style={styles.scheduleDot} />
                                  <Text style={styles.scheduleText}>
                                    {p?.name ?? entry.peptideId} — {entry.dose} {entry.unit} {entry.frequency}
                                    {entry.timing ? ` (${entry.timing})` : ''}
                                  </Text>
                                </View>
                              );
                            })}
                          </View>
                        )}
                      </LinearGradient>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}

            {/* ── ACTIVE PEPTIDES ── */}
            {scheduledPeptides.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionLabel}>ACTIVE PEPTIDES</Text>
                {scheduledPeptides.map((sp) => {
                  const peptide = getPeptideById(sp.peptideId);
                  const endDate = sp.runIndefinitely ? null : sp.endDate;
                  const startDate = sp.startDate;
                  const totalDays = sp.runIndefinitely
                    ? null
                    : differenceInDays(new Date(endDate!), new Date(startDate));
                  const dayOn = differenceInDays(new Date(), new Date(startDate)) + 1;
                  const progress =
                    totalDays != null ? Math.min(dayOn / totalDays, 1) : null;

                  return (
                    <View key={sp.id} style={styles.peptideCard}>
                      <View style={styles.peptideCardLeft}>
                        <View style={[styles.peptideAvatarCircle, { backgroundColor: getCategoryColor(peptide?.category ?? '') }]}>
                          <Text style={styles.peptideAvatarLetter}>
                            {(peptide?.name ?? sp.peptideId)[0].toUpperCase()}
                          </Text>
                        </View>
                        <View style={styles.peptideInfo}>
                          <Text style={styles.peptideName}>{peptide?.name ?? sp.peptideId}</Text>
                          <Text style={styles.peptideDetail}>
                            {sp.dose} {sp.unit} · {sp.times.join(', ')}
                          </Text>
                          {endDate ? (
                            <Text style={styles.peptideDates}>
                              Until {format(new Date(endDate), 'MMM d, yyyy')}
                            </Text>
                          ) : (
                            <Text style={styles.peptideDates}>Running indefinitely</Text>
                          )}
                          {progress != null && (
                            <View style={[styles.progressBg, { marginTop: 6 }]}>
                              <View style={[styles.progressFillTeal, { width: `${Math.round(progress * 100)}%` as any }]} />
                            </View>
                          )}
                        </View>
                      </View>
                      <TouchableOpacity
                        onPress={() => router.push({ pathname: '/peptide/[id]', params: { id: sp.peptideId } })}
                      >
                        <ChevronRight size={16} color={Colors.textTertiary} />
                      </TouchableOpacity>
                    </View>
                  );
                })}
              </View>
            )}

            {/* ── COMPLETED PROTOCOLS ── */}
            {completedProtocols.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionLabel}>COMPLETED PROTOCOLS</Text>
                {completedProtocols.map((protocol) => (
                  <View key={protocol.id} style={styles.completedRow}>
                    <View style={[styles.completedDot, { backgroundColor: Colors.accentGreen }]} />
                    <View style={styles.completedInfo}>
                      <Text style={styles.completedName}>{protocol.name}</Text>
                      <Text style={styles.completedDate}>
                        Completed · {protocol.durationDays} days
                      </Text>
                    </View>
                    <Text style={styles.completedBadge}>✓</Text>
                  </View>
                ))}
              </View>
            )}

            {/* ── ACTIVITY LOG ── */}
            {activityLog.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionLabel}>RECENT ACTIVITY</Text>
                {activityLog.slice(0, 15).map((entry) => (
                  <View key={entry.id} style={styles.logRow}>
                    <Activity size={14} color={Colors.textTertiary} style={{ marginTop: 2 }} />
                    <View style={styles.logInfo}>
                      <Text style={styles.logTitle}>{entry.title}</Text>
                      {entry.subtitle && <Text style={styles.logSub}>{entry.subtitle}</Text>}
                    </View>
                    <Text style={styles.logDate}>
                      {format(new Date(entry.date), 'MMM d')}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </>
        )}
      </ScrollView>
    </ScreenBackground>
  );
}

function SummaryTile({ value, label, color }: { value: string; label: string; color: string }) {
  return (
    <View style={[summaryStyles.tile, { borderTopColor: color }]}>
      <Text style={[summaryStyles.value, { color }]}>{value}</Text>
      <Text style={summaryStyles.label}>{label}</Text>
    </View>
  );
}

function getCategoryColor(cat: string): string {
  const map: Record<string, string> = {
    'Recovery & Healing': '#EF4444',
    'Fat Loss': '#F97316',
    'Muscle & Performance': '#3B82F6',
    'Cognitive & Neuroprotection': '#8B5CF6',
    'Sleep & Longevity': '#6366F1',
    'Skin & Aesthetics': '#EC4899',
    'GI & Gut Health': '#22C55E',
  };
  return map[cat] ?? Colors.primaryOrange;
}

const summaryStyles = StyleSheet.create({
  tile: {
    flex: 1, backgroundColor: Colors.surface, borderRadius: Radii.lg,
    padding: Spacing.md, alignItems: 'center',
    borderTopWidth: 2, borderWidth: 1, borderColor: Colors.surfaceBorder,
  },
  value: { fontSize: Typography.xxl, fontWeight: FontWeight.extrabold },
  label: { fontSize: Typography.xs, color: Colors.textTertiary, fontWeight: FontWeight.medium, marginTop: 2 },
});

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg, paddingTop: 52, paddingBottom: Spacing.md,
    borderBottomWidth: 1, borderBottomColor: Colors.surfaceBorder,
  },
  title: { fontSize: Typography.xl, fontWeight: FontWeight.extrabold, color: Colors.textPrimary },
  closeBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.surface, alignItems: 'center', justifyContent: 'center' },
  scroll: { paddingHorizontal: Spacing.lg, paddingBottom: 60, paddingTop: Spacing.lg },

  // Empty
  emptyState: { alignItems: 'center', paddingTop: 80, paddingHorizontal: Spacing.xl },
  emptyEmoji: { fontSize: 60, marginBottom: Spacing.lg },
  emptyTitle: { fontSize: Typography.xl, fontWeight: FontWeight.bold, color: Colors.textPrimary, marginBottom: Spacing.sm },
  emptySub: { fontSize: Typography.sm, color: Colors.textSecondary, textAlign: 'center', lineHeight: 22, marginBottom: Spacing.xl },
  exploreBtn: { backgroundColor: Colors.primaryOrange, borderRadius: 32, paddingVertical: 15, paddingHorizontal: Spacing.xl },
  exploreBtnText: { color: '#fff', fontSize: Typography.base, fontWeight: FontWeight.bold },

  // Summary
  summaryRow: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.xl },

  // Section
  section: { marginBottom: Spacing.xl },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.md },
  sectionLabel: { fontSize: Typography.xs, color: Colors.textTertiary, fontWeight: FontWeight.semibold, letterSpacing: 1.5, marginBottom: Spacing.md },
  seeAll: { fontSize: Typography.xs, color: Colors.primaryOrange, fontWeight: FontWeight.semibold },

  // Protocol card
  protocolCard: { borderRadius: Radii.xl, overflow: 'hidden', marginBottom: Spacing.md },
  protocolCardGradient: { padding: Spacing.md, gap: Spacing.sm },
  protocolCardTop: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  iconCircle: { width: 32, height: 32, borderRadius: 16, backgroundColor: Colors.primaryOrangeLight, alignItems: 'center', justifyContent: 'center' },
  protocolInfo: { flex: 1 },
  protocolName: { color: Colors.textPrimary, fontSize: Typography.base, fontWeight: FontWeight.bold },
  protocolDay: { color: Colors.textSecondary, fontSize: Typography.xs, marginTop: 1 },
  pctLabel: { color: Colors.primaryOrange, fontSize: Typography.base, fontWeight: FontWeight.extrabold },

  // Progress
  progressBg: { height: 6, backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: Colors.primaryOrange, borderRadius: 3 },
  progressFillTeal: { height: '100%', backgroundColor: Colors.accentTeal, borderRadius: 3 },

  // Chips
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 5 },
  chip: { backgroundColor: Colors.primaryOrangeLight, borderRadius: Radii.full, paddingHorizontal: Spacing.sm, paddingVertical: 2 },
  chipText: { color: Colors.primaryOrange, fontSize: 10, fontWeight: FontWeight.semibold },

  // Schedule within protocol card
  scheduleRows: { gap: 4, marginTop: 2 },
  scheduleEntry: { flexDirection: 'row', alignItems: 'flex-start', gap: 6 },
  scheduleDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: Colors.textTertiary, marginTop: 6 },
  scheduleText: { flex: 1, color: Colors.textSecondary, fontSize: Typography.xs, lineHeight: 18 },

  // Peptide card
  peptideCard: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: Colors.surface, borderRadius: Radii.lg, padding: Spacing.md,
    marginBottom: Spacing.sm, borderWidth: 1, borderColor: Colors.surfaceBorder,
  },
  peptideCardLeft: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.md, flex: 1 },
  peptideAvatarCircle: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  peptideAvatarLetter: { color: '#fff', fontSize: Typography.base, fontWeight: FontWeight.bold },
  peptideInfo: { flex: 1 },
  peptideName: { color: Colors.textPrimary, fontSize: Typography.base, fontWeight: FontWeight.semibold },
  peptideDetail: { color: Colors.textSecondary, fontSize: Typography.xs, marginTop: 2 },
  peptideDates: { color: Colors.textTertiary, fontSize: Typography.xs, marginTop: 1 },

  // Completed
  completedRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, paddingVertical: Spacing.sm, borderBottomWidth: 1, borderBottomColor: Colors.surfaceBorder },
  completedDot: { width: 10, height: 10, borderRadius: 5 },
  completedInfo: { flex: 1 },
  completedName: { color: Colors.textPrimary, fontSize: Typography.base, fontWeight: FontWeight.semibold },
  completedDate: { color: Colors.textSecondary, fontSize: Typography.xs, marginTop: 2 },
  completedBadge: { color: Colors.accentGreen, fontSize: Typography.lg },

  // Log
  logRow: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.sm, paddingVertical: Spacing.sm, borderBottomWidth: 1, borderBottomColor: Colors.surfaceBorder },
  logInfo: { flex: 1 },
  logTitle: { fontSize: Typography.sm, color: Colors.textPrimary },
  logSub: { fontSize: Typography.xs, color: Colors.textSecondary, marginTop: 2 },
  logDate: { fontSize: Typography.xs, color: Colors.textTertiary, marginTop: 2 },
});
