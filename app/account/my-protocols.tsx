import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { X, Plus, FlaskConical } from 'lucide-react-native';
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
          <X size={18} color="rgba(255,255,255,0.6)" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {myProtocols.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No protocols yet.</Text>
            <Text style={styles.emptySubText}>
              Use the buttons above to create your first protocol.
            </Text>
          </View>
        ) : (
          myProtocols.map((protocol) => {
            const dayOn = differenceInDays(new Date(), new Date(protocol.startedAt)) + 1;
            const progress = Math.min(dayOn / protocol.durationDays, 1);

            return (
              <View key={protocol.id} style={styles.card}>
                <View style={styles.cardHeader}>
                  <View style={styles.iconCircle}>
                    <FlaskConical size={16} color={Colors.accentOrange} />
                  </View>
                  <View style={styles.cardTitles}>
                    <Text style={styles.cardName}>{protocol.name}</Text>
                    <Text style={styles.cardSub}>
                      Day {dayOn} of {protocol.durationDays}
                    </Text>
                  </View>
                  <TouchableOpacity onPress={() => removeProtocol(protocol.id)}>
                    <X size={14} color="rgba(255,255,255,0.3)" />
                  </TouchableOpacity>
                </View>

                <View style={styles.progressBg}>
                  <View style={[styles.progressFill, { width: `${Math.round(progress * 100)}%` }]} />
                </View>

                <View style={styles.chips}>
                  {protocol.peptideIds.slice(0, 4).map((pid) => (
                    <View key={pid} style={styles.chip}>
                      <Text style={styles.chipText}>{pid.toUpperCase().replace(/-\d+$/, '')}</Text>
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

      {/* Tooltip hint */}
      {myProtocols.length === 0 && (
        <View style={styles.tooltip}>
          <Text style={styles.tooltipText}>
            Tap here to add custom protocols or create new collections
          </Text>
        </View>
      )}
    </View>
  );
}

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
    color: '#FFFFFF',
    fontSize: Typography.xl,
    fontWeight: FontWeight.extrabold,
  },
  closeBtn: {
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: Colors.surfaceElevated,
    alignItems: 'center', justifyContent: 'center',
  },
  scroll: { paddingHorizontal: Spacing.lg, paddingBottom: 120 },
  emptyState: {
    alignItems: 'center',
    paddingTop: Spacing.xxl,
    gap: Spacing.sm,
  },
  emptyText: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: Typography.base,
    fontWeight: FontWeight.medium,
  },
  emptySubText: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: Typography.sm,
    textAlign: 'center',
    lineHeight: 20,
  },
  card: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: Radii.xl,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    gap: Spacing.sm,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  iconCircle: {
    width: 32, height: 32, borderRadius: 8,
    backgroundColor: 'rgba(255,107,43,0.12)',
    alignItems: 'center', justifyContent: 'center',
  },
  cardTitles: { flex: 1 },
  cardName: { color: '#FFF', fontSize: Typography.base, fontWeight: FontWeight.bold },
  cardSub: { color: 'rgba(255,255,255,0.4)', fontSize: Typography.xs, marginTop: 1 },
  progressBg: {
    height: 3,
    backgroundColor: Colors.surfaceBorder,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.accentOrange,
    borderRadius: 2,
  },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 4 },
  chip: {
    backgroundColor: Colors.surface,
    borderRadius: Radii.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
  },
  chipText: { color: 'rgba(255,255,255,0.4)', fontSize: 10 },
  fab: {
    position: 'absolute',
    bottom: 32, right: Spacing.lg,
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: Colors.accentOrange,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: Colors.accentOrange,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4, shadowRadius: 8, elevation: 8,
  },
  tooltip: {
    position: 'absolute',
    bottom: 92,
    right: Spacing.lg,
    backgroundColor: Colors.accentOrange,
    borderRadius: Radii.lg,
    padding: Spacing.md,
    maxWidth: 200,
  },
  tooltipText: {
    color: '#FFF',
    fontSize: Typography.xs,
    lineHeight: 16,
  },
});
