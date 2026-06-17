import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { X, Plus, FlaskConical } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';
import { differenceInDays } from 'date-fns';
import { useProtocolStore } from '../../store/useProtocolStore';
import { getPeptideById } from '../../data/peptides';
import { Colors, Radii, Typography, FontWeight, Spacing } from '../../constants/theme';

export default function MyProtocolsScreen() {
  const { myProtocols, removeProtocol } = useProtocolStore();

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <View style={styles.header}>
        <Text style={styles.title}>My Protocols</Text>
        <TouchableOpacity style={styles.closeBtn} onPress={() => router.back()}>
          <X size={18} color={Colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {myProtocols.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>📋</Text>
            <Text style={styles.emptyTitle}>No protocols yet</Text>
            <Text style={styles.emptySub}>
              Start a protocol from the Explore tab or your peptide detail page.
            </Text>
          </View>
        ) : (
          myProtocols.map((protocol) => {
            const dayOn = differenceInDays(new Date(), new Date(protocol.startedAt)) + 1;
            const progress = Math.min(dayOn / protocol.durationDays, 1);
            return (
              <TouchableOpacity
                key={protocol.id}
                style={styles.card}
                onPress={() => router.push({ pathname: '/protocol/[id]', params: { id: protocol.id } })}
                activeOpacity={0.8}
              >
                <View style={styles.cardHeader}>
                  <View style={styles.iconCircle}>
                    <FlaskConical size={16} color={Colors.primaryOrange} />
                  </View>
                  <View style={styles.cardTitles}>
                    <Text style={styles.cardName}>{protocol.name}</Text>
                    <Text style={styles.cardSub}>Day {dayOn} of {protocol.durationDays}</Text>
                  </View>
                  <TouchableOpacity onPress={() => removeProtocol(protocol.id)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                    <X size={14} color={Colors.textTertiary} />
                  </TouchableOpacity>
                </View>

                {/* Progress bar */}
                <View style={styles.progressBg}>
                  <View style={[styles.progressFill, { width: `${Math.round(progress * 100)}%` as any }]} />
                </View>
                <Text style={styles.progressLabel}>{Math.round(progress * 100)}% complete</Text>

                {/* Peptide chips with names */}
                <View style={styles.chips}>
                  {protocol.peptideIds.slice(0, 4).map((pid) => {
                    const p = getPeptideById(pid);
                    return (
                      <View key={pid} style={styles.chip}>
                        <Text style={styles.chipText}>{p?.name ?? pid.toUpperCase()}</Text>
                      </View>
                    );
                  })}
                </View>
              </TouchableOpacity>
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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.base },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingTop: 56, paddingHorizontal: Spacing.lg, paddingBottom: Spacing.md,
    borderBottomWidth: 1, borderBottomColor: Colors.surfaceBorder,
  },
  title: { color: Colors.textPrimary, fontSize: Typography.xl, fontWeight: FontWeight.extrabold },
  closeBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: Colors.surface, alignItems: 'center', justifyContent: 'center',
  },
  scroll: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.lg, paddingBottom: 120 },
  emptyState: { alignItems: 'center', paddingTop: 60, gap: Spacing.sm },
  emptyEmoji: { fontSize: 56, marginBottom: Spacing.sm },
  emptyTitle: { color: Colors.textPrimary, fontSize: Typography.lg, fontWeight: FontWeight.bold },
  emptySub: { color: Colors.textSecondary, fontSize: Typography.sm, textAlign: 'center', lineHeight: 22, paddingHorizontal: Spacing.lg },
  card: {
    backgroundColor: Colors.surface, borderRadius: Radii.xl, padding: Spacing.md,
    marginBottom: Spacing.md, borderWidth: 1, borderColor: Colors.surfaceBorder, gap: Spacing.sm,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  iconCircle: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: Colors.primaryOrangeLight, alignItems: 'center', justifyContent: 'center',
  },
  cardTitles: { flex: 1 },
  cardName: { color: Colors.textPrimary, fontSize: Typography.base, fontWeight: FontWeight.bold },
  cardSub: { color: Colors.textSecondary, fontSize: Typography.xs, marginTop: 2 },
  progressBg: { height: 6, backgroundColor: Colors.surfaceBorder, borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: Colors.primaryOrange, borderRadius: 3 },
  progressLabel: { fontSize: Typography.xs, color: Colors.textTertiary },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  chip: {
    backgroundColor: Colors.primaryOrangeLight, borderRadius: Radii.full,
    paddingHorizontal: Spacing.sm, paddingVertical: 3,
  },
  chipText: { color: Colors.primaryOrange, fontSize: Typography.xs, fontWeight: FontWeight.semibold },
  fab: {
    position: 'absolute', bottom: 32, right: Spacing.lg,
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: Colors.primaryOrange, alignItems: 'center', justifyContent: 'center',
    shadowColor: Colors.primaryOrange, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4, shadowRadius: 8, elevation: 8,
  },
});
