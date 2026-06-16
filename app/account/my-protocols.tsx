import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { X, Plus, Clock, FlaskConical } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';
import { differenceInDays, format } from 'date-fns';
import { useProtocolStore } from '../../store/useProtocolStore';
import { Colors, Radii, Typography, FontWeight, Spacing } from '../../constants/theme';

export default function MyProtocolsScreen() {
  const { myProtocols, removeProtocol } = useProtocolStore();

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.header}>
        <Text style={styles.title}>My Protocols</Text>
        <TouchableOpacity style={styles.closeBtn} onPress={() => router.back()}>
          <X size={20} color={Colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {myProtocols.length === 0 ? (
          <EmptyState />
        ) : (
          myProtocols.map((protocol) => {
            const startedAt = new Date(protocol.startedAt);
            const dayOn = differenceInDays(new Date(), startedAt) + 1;
            const progress = Math.min(dayOn / protocol.durationDays, 1);
            const progressPct = Math.round(progress * 100);

            return (
              <View key={protocol.id} style={styles.card}>
                {/* Top row */}
                <View style={styles.cardHeader}>
                  <View style={styles.iconCircle}>
                    <FlaskConical size={18} color={Colors.accentOrange} />
                  </View>
                  <View style={styles.cardTitles}>
                    <Text style={styles.cardName}>{protocol.name}</Text>
                    <Text style={styles.cardSub}>{protocol.subtitle}</Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => removeProtocol(protocol.id)}
                    style={styles.removeBtn}
                    activeOpacity={0.7}
                  >
                    <X size={14} color={Colors.textTertiary} />
                  </TouchableOpacity>
                </View>

                {/* Progress bar */}
                <View style={styles.progressBg}>
                  <View style={[styles.progressFill, { width: `${progressPct}%` }]} />
                </View>

                {/* Meta */}
                <View style={styles.metaRow}>
                  <Clock size={12} color={Colors.textTertiary} />
                  <Text style={styles.metaText}>
                    Day {dayOn} of {protocol.durationDays} · {progressPct}% complete
                  </Text>
                  <Text style={styles.metaDate}>
                    Started {format(startedAt, 'MMM d, yyyy')}
                  </Text>
                </View>

                {/* Peptide chips */}
                <View style={styles.chips}>
                  {protocol.peptideIds.map((pid) => (
                    <View key={pid} style={styles.chip}>
                      <Text style={styles.chipText}>{pid.replace(/-/g, ' ')}</Text>
                    </View>
                  ))}
                </View>
              </View>
            );
          })
        )}
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/onboarding/get-started')}
        activeOpacity={0.85}
      >
        <Plus size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

function EmptyState() {
  return (
    <View style={emptyStyles.container}>
      <Text style={emptyStyles.emoji}>📋</Text>
      <Text style={emptyStyles.title}>No protocols yet</Text>
      <Text style={emptyStyles.body}>
        Start a protocol from the Explore tab or tap + below.
      </Text>
    </View>
  );
}

const emptyStyles = StyleSheet.create({
  container: { alignItems: 'center', paddingTop: 80, gap: Spacing.sm },
  emoji: { fontSize: 48 },
  title: {
    color: Colors.textPrimary,
    fontSize: Typography.lg,
    fontWeight: FontWeight.bold,
  },
  body: {
    color: Colors.textSecondary,
    fontSize: Typography.sm,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: Spacing.xl,
  },
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.base },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 56,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  title: {
    color: Colors.textPrimary,
    fontSize: Typography.xl,
    fontWeight: FontWeight.extrabold,
  },
  closeBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: Colors.surfaceElevated,
    alignItems: 'center', justifyContent: 'center',
  },
  scroll: { paddingHorizontal: Spacing.lg, paddingBottom: 100 },
  card: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: Radii.xl,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    gap: Spacing.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
  },
  iconCircle: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: 'rgba(255,107,43,0.1)',
    alignItems: 'center', justifyContent: 'center',
  },
  cardTitles: { flex: 1 },
  cardName: {
    color: Colors.textPrimary,
    fontSize: Typography.base,
    fontWeight: FontWeight.bold,
  },
  cardSub: { color: Colors.textTertiary, fontSize: Typography.xs, marginTop: 2 },
  removeBtn: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: Colors.surface,
    alignItems: 'center', justifyContent: 'center',
  },
  progressBg: {
    height: 4,
    backgroundColor: Colors.surfaceBorder,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.accentOrange,
    borderRadius: 2,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: { color: Colors.textTertiary, fontSize: Typography.xs, flex: 1 },
  metaDate: { color: Colors.textTertiary, fontSize: Typography.xs },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 4 },
  chip: {
    backgroundColor: Colors.surface,
    borderRadius: Radii.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
  },
  chipText: {
    color: Colors.textTertiary,
    fontSize: Typography.xs,
    textTransform: 'capitalize',
  },
  fab: {
    position: 'absolute',
    bottom: 32,
    right: Spacing.lg,
    width: 56, height: 56,
    borderRadius: 28,
    backgroundColor: Colors.accentOrange,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: Colors.accentOrange,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
});
