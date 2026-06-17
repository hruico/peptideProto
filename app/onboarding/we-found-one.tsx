import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ChevronLeft, Check, Bell, Calculator } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { getGoalDetailById } from '../../data/goals';
import { getProtocolById } from '../../data/protocols';
import { useOnboardingStore } from '../../store/useOnboardingStore';
import { useUserStore } from '../../store/useUserStore';
import { Colors, Radii, Typography, FontWeight, Spacing } from '../../constants/theme';

export default function WeFoundOneScreen() {
  const { goalId } = useLocalSearchParams<{ goalId: string }>();
  const detail = getGoalDetailById(goalId);
  const protocol = detail?.recommendedProtocolId ? getProtocolById(detail.recommendedProtocolId) : null;
  const { completeOnboarding } = useOnboardingStore();
  const { continueAsGuest } = useUserStore();

  function handleLetsGo() {
    continueAsGuest();
    completeOnboarding();
    if (protocol) {
      router.replace({ pathname: '/protocol/[id]', params: { id: protocol.id } });
    } else {
      router.replace('/(tabs)');
    }
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <ChevronLeft size={22} color={Colors.textPrimary} />
      </TouchableOpacity>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Protocol hero card */}
        {protocol && (
          <LinearGradient
            colors={['#1A1A2E', '#16213E']}
            style={styles.heroCard}
          >
            <View style={styles.forYouBadge}>
              <Text style={styles.forYouText}>FOR YOU</Text>
            </View>
            <Text style={styles.protocolName}>{protocol.name}</Text>
            <Text style={styles.protocolMeta}>
              {protocol.peptideIds.length} Peptides · {protocol.durationLabel} · 👤 {protocol.participantCount.toLocaleString()} started
            </Text>
          </LinearGradient>
        )}

        <Text style={styles.headline}>We found one{'\n'}for you</Text>
        <Text style={styles.body}>
          Think of it as your game plan — which peptides to take, how much, and when. Experts put this one together to match your goals.
        </Text>

        <View style={styles.features}>
          <View style={styles.featureRow}>
            <View style={styles.featureIcon}><Bell size={16} color={Colors.primaryOrange} /></View>
            <Text style={styles.featureText}>We'll remind you so you don't miss a dose</Text>
          </View>
          <View style={styles.featureRow}>
            <View style={styles.featureIcon}><Calculator size={16} color={Colors.primaryOrange} /></View>
            <Text style={styles.featureText}>Calculator for mixing your peptides</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.ctaBtn} onPress={handleLetsGo} activeOpacity={0.85}>
          <Text style={styles.ctaBtnText}>Let's go →</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.base },
  backBtn: {
    position: 'absolute', top: 52, left: Spacing.lg, zIndex: 10,
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: Colors.surface, alignItems: 'center', justifyContent: 'center',
  },
  scroll: { paddingHorizontal: Spacing.lg, paddingTop: 100, paddingBottom: 120 },
  heroCard: {
    borderRadius: Radii.xl, padding: Spacing.xl, marginBottom: Spacing.xl, minHeight: 180,
    justifyContent: 'flex-end',
  },
  forYouBadge: {
    position: 'absolute', top: Spacing.md, left: Spacing.md,
    backgroundColor: Colors.primaryOrange, borderRadius: Radii.full,
    paddingHorizontal: Spacing.sm, paddingVertical: 3,
  },
  forYouText: { color: '#fff', fontSize: Typography.xs, fontWeight: FontWeight.bold, letterSpacing: 1 },
  protocolName: { color: '#fff', fontSize: Typography.xl, fontWeight: FontWeight.extrabold, marginBottom: 6 },
  protocolMeta: { color: 'rgba(255,255,255,0.6)', fontSize: Typography.xs },
  headline: {
    fontSize: Typography.xxl, fontWeight: FontWeight.extrabold,
    color: Colors.textPrimary, marginBottom: Spacing.md, lineHeight: 36,
  },
  body: { fontSize: Typography.sm, color: Colors.textSecondary, lineHeight: 22, marginBottom: Spacing.xl },
  features: { gap: Spacing.md },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  featureIcon: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: Colors.primaryOrangeLight, alignItems: 'center', justifyContent: 'center',
  },
  featureText: { flex: 1, fontSize: Typography.base, color: Colors.textPrimary, fontWeight: FontWeight.medium },
  footer: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    padding: Spacing.lg, paddingBottom: 36, backgroundColor: Colors.base,
    borderTopWidth: 1, borderTopColor: Colors.surfaceBorder,
  },
  ctaBtn: {
    backgroundColor: Colors.primaryOrange, borderRadius: 32, paddingVertical: 18, alignItems: 'center',
  },
  ctaBtnText: { color: '#fff', fontSize: Typography.base, fontWeight: FontWeight.bold },
});
