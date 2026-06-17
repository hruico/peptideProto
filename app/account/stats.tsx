import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { X } from 'lucide-react-native';
import { format } from 'date-fns';
import { useScheduleStore } from '../../store/useScheduleStore';
import { useProtocolStore } from '../../store/useProtocolStore';
import { getPeptideById } from '../../data/peptides';
import { Colors, Radii, Typography, FontWeight, Spacing } from '../../constants/theme';

export default function StatsScreen() {
  const { scheduledPeptides } = useScheduleStore();
  const { myProtocols, activityLog } = useProtocolStore();

  const hasActivity = scheduledPeptides.length > 0 || myProtocols.length > 0 || activityLog.length > 0;

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <View style={styles.header}>
        <Text style={styles.title}>Stats & Activity</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn}>
          <X size={20} color={Colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {!hasActivity ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>📊</Text>
            <Text style={styles.emptyTitle}>No activity yet</Text>
            <Text style={styles.emptySub}>Start a protocol or add a peptide to see your history here.</Text>
          </View>
        ) : (
          <>
            {/* Active peptides */}
            {scheduledPeptides.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionLabel}>ACTIVE</Text>
                {scheduledPeptides.map((sp) => {
                  const peptide = getPeptideById(sp.peptideId);
                  const endDate = sp.runIndefinitely ? null : sp.endDate;
                  return (
                    <TouchableOpacity
                      key={sp.id}
                      style={styles.activityRow}
                      onPress={() => router.push({ pathname: '/peptide/[id]', params: { id: sp.peptideId } })}
                      activeOpacity={0.7}
                    >
                      <View style={[styles.activityDot, { backgroundColor: Colors.accentGreen }]} />
                      <View style={styles.activityInfo}>
                        <Text style={styles.activityTitle}>{peptide?.name ?? sp.peptideId}</Text>
                        <Text style={styles.activityDate}>
                          {format(new Date(sp.startDate), 'MMM d')} – {endDate ? format(new Date(endDate), 'MMM d') : 'Indefinitely'}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}

            {/* Active protocols */}
            {myProtocols.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionLabel}>PROTOCOLS</Text>
                {myProtocols.map((proto) => (
                  <TouchableOpacity
                    key={proto.id}
                    style={styles.activityRow}
                    onPress={() => router.push({ pathname: '/protocol/[id]', params: { id: proto.id } })}
                    activeOpacity={0.7}
                  >
                    <View style={[styles.activityDot, { backgroundColor: Colors.primaryOrange }]} />
                    <View style={styles.activityInfo}>
                      <Text style={styles.activityTitle}>{proto.name}</Text>
                      <Text style={styles.activityDate}>
                        Started {format(new Date(proto.startedAt), 'MMM d, yyyy')}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* Activity log */}
            {activityLog.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionLabel}>HISTORY</Text>
                {activityLog.slice(0, 20).map((entry) => (
                  <View key={entry.id} style={styles.logRow}>
                    <View style={styles.logInfo}>
                      <Text style={styles.logTitle}>{entry.title}</Text>
                      {entry.subtitle && <Text style={styles.logSub}>{entry.subtitle}</Text>}
                    </View>
                    <Text style={styles.logDate}>{format(new Date(entry.date), 'MMM d')}</Text>
                  </View>
                ))}
              </View>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.base },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg, paddingTop: 52, paddingBottom: Spacing.md,
    borderBottomWidth: 1, borderBottomColor: Colors.surfaceBorder,
  },
  title: { fontSize: Typography.xl, fontWeight: FontWeight.extrabold, color: Colors.textPrimary },
  closeBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.surface, alignItems: 'center', justifyContent: 'center' },
  scroll: { paddingBottom: 48 },
  emptyState: { alignItems: 'center', paddingTop: 80, paddingHorizontal: Spacing.xl },
  emptyEmoji: { fontSize: 60, marginBottom: Spacing.lg },
  emptyTitle: { fontSize: Typography.xl, fontWeight: FontWeight.bold, color: Colors.textPrimary, marginBottom: Spacing.sm },
  emptySub: { fontSize: Typography.sm, color: Colors.textSecondary, textAlign: 'center', lineHeight: 22 },
  section: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.xl },
  sectionLabel: {
    fontSize: Typography.xs, color: Colors.textTertiary, fontWeight: FontWeight.semibold,
    letterSpacing: 1.5, marginBottom: Spacing.md,
  },
  activityRow: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    paddingVertical: Spacing.md, borderBottomWidth: 1, borderBottomColor: Colors.surfaceBorder,
  },
  activityDot: { width: 10, height: 10, borderRadius: 5 },
  activityInfo: { flex: 1 },
  activityTitle: { fontSize: Typography.base, fontWeight: FontWeight.semibold, color: Colors.textPrimary },
  activityDate: { fontSize: Typography.xs, color: Colors.textSecondary, marginTop: 2 },
  logRow: {
    flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between',
    paddingVertical: Spacing.sm, borderBottomWidth: 1, borderBottomColor: Colors.surfaceBorder,
  },
  logInfo: { flex: 1 },
  logTitle: { fontSize: Typography.sm, color: Colors.textPrimary },
  logSub: { fontSize: Typography.xs, color: Colors.textSecondary, marginTop: 2 },
  logDate: { fontSize: Typography.xs, color: Colors.textTertiary },
});
