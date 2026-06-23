import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ChevronLeft, Users } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { PROTOCOLS } from '../../data/protocols';
import { Colors, Radii, Typography, FontWeight, Spacing } from '../../constants/theme';
import ScreenBackground from '../../components/ScreenBackground';

const STACK_COLORS: Record<string, readonly [string, string]> = {
  'injury-recovery-stack': ['#EF4444', '#B91C1C'],
  'gh-optimizer': ['#3B82F6', '#1D4ED8'],
  'cognitive-edge': ['#8B5CF6', '#6D28D9'],
  'longevity-protocol': ['#14B8A6', '#0F766E'],
  'body-recomp': ['#F97316', '#C2410C'],
  'elite-recovery': ['#22C55E', '#15803D'],
  'gut-reset': ['#6366F1', '#4338CA'],
};

export default function PopularStacksScreen() {
  return (
    <ScreenBackground>
      <StatusBar style="light" />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <ChevronLeft size={22} color={Colors.textPrimary} />
        </TouchableOpacity>
        <View>
          <Text style={styles.title}>Popular Stacks</Text>
          <Text style={styles.sub}>The internet's favourite peptide combos</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {PROTOCOLS.map((protocol) => {
          const colors = STACK_COLORS[protocol.id] ?? (['#1A1A2E', '#16213E'] as const);
          return (
            <TouchableOpacity
              key={protocol.id}
              style={styles.card}
              onPress={() => router.push({ pathname: '/protocol/[id]', params: { id: protocol.id } })}
              activeOpacity={0.85}
            >
              <LinearGradient colors={colors} style={styles.cardGradient}>
                <View style={styles.cardContent}>
                  <Text style={styles.cardName}>{protocol.name}</Text>
                  <Text style={styles.cardSub}>{protocol.subtitle}</Text>
                  <View style={styles.badgeRow}>
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>{protocol.peptideIds.length} Peptides</Text>
                    </View>
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>{protocol.durationLabel}</Text>
                    </View>
                    <View style={styles.badge}>
                      <Users size={10} color="rgba(255,255,255,0.8)" />
                      <Text style={styles.badgeText}>{protocol.participantCount.toLocaleString()}</Text>
                    </View>
                  </View>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          );
        })}
        <View style={{ height: 40 }} />
      </ScrollView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    paddingHorizontal: Spacing.lg, paddingTop: 52, paddingBottom: Spacing.lg,
    borderBottomWidth: 1, borderBottomColor: Colors.surfaceBorder,
  },
  backBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.surface, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: Typography.xl, fontWeight: FontWeight.extrabold, color: Colors.textPrimary },
  sub: { fontSize: Typography.sm, color: Colors.textSecondary, marginTop: 2 },
  scroll: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.lg },
  card: { borderRadius: Radii.xl, overflow: 'hidden', marginBottom: Spacing.md },
  cardGradient: { padding: Spacing.xl, minHeight: 160, justifyContent: 'flex-end' },
  cardContent: {},
  cardName: { fontSize: Typography.xl, fontWeight: FontWeight.extrabold, color: '#fff', marginBottom: 4 },
  cardSub: { fontSize: Typography.sm, color: 'rgba(255,255,255,0.7)', marginBottom: Spacing.md },
  badgeRow: { flexDirection: 'row', gap: Spacing.sm },
  badge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: Radii.full,
    paddingHorizontal: Spacing.sm, paddingVertical: 4,
  },
  badgeText: { color: 'rgba(255,255,255,0.9)', fontSize: Typography.xs, fontWeight: FontWeight.medium },
});
