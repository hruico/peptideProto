import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ChevronLeft, Check } from 'lucide-react-native';
import { getGoalDetailById } from '../../data/goals';
import { Colors, Radii, Typography, FontWeight, Spacing } from '../../constants/theme';

export default function GoalDetailScreen() {
  const { goalId } = useLocalSearchParams<{ goalId: string }>();
  const detail = getGoalDetailById(goalId);

  if (!detail) {
    router.back();
    return null;
  }

  return (
    <View style={[styles.container, { backgroundColor: detail.bgColor }]}>
      <StatusBar style="dark" />

      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <ChevronLeft size={22} color={Colors.textPrimary} />
      </TouchableOpacity>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Big emoji */}
        <View style={styles.emojiWrap}>
          <Text style={styles.emoji}>{getGoalEmoji(goalId)}</Text>
        </View>

        {/* Headline */}
        <Text style={styles.headline}>{detail.headline}</Text>

        {/* Benefits */}
        <View style={styles.benefitsCard}>
          {detail.benefits.map((b, i) => (
            <View key={i} style={styles.benefitRow}>
              <View style={styles.checkCircle}>
                <Check size={12} color="#fff" />
              </View>
              <Text style={styles.benefitText}>{b}</Text>
            </View>
          ))}
        </View>

        {/* Description */}
        <Text style={styles.description}>{detail.description}</Text>

        {/* Social proof */}
        <View style={styles.socialProof}>
          <View style={styles.avatarRow}>
            {['#E8622A', '#4ECDC4', '#8B5CF6'].map((c, i) => (
              <View key={i} style={[styles.proofAvatar, { backgroundColor: c, marginLeft: i > 0 ? -8 : 0 }]} />
            ))}
          </View>
          <Text style={styles.socialText}>
            {detail.socialProofCount.toLocaleString()} {detail.socialProofLabel}
          </Text>
        </View>
      </ScrollView>

      {/* CTA */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.continueBtn}
          onPress={() => router.push({ pathname: '/onboarding/whats-going-on' as any, params: { goalId } })}
          activeOpacity={0.85}
        >
          <Text style={styles.continueBtnText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function getGoalEmoji(id?: string) {
  const map: Record<string, string> = {
    'fat-loss': '🔥', 'skin-health': '💎', 'muscle-growth': '💪',
    'injury-recovery': '❤️‍🩹', 'cognition': '🧠', 'longevity': '⏳',
    'sleep': '🌙', 'gut-health': '🌿',
  };
  return id ? (map[id] ?? '✨') : '✨';
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  backBtn: {
    position: 'absolute', top: 52, left: Spacing.lg, zIndex: 10,
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.08)', alignItems: 'center', justifyContent: 'center',
  },
  scroll: { paddingHorizontal: Spacing.lg, paddingTop: 100, paddingBottom: 120 },
  emojiWrap: { alignItems: 'center', marginBottom: Spacing.lg },
  emoji: { fontSize: 80 },
  headline: {
    fontSize: Typography.xxl, fontWeight: FontWeight.extrabold,
    color: Colors.textPrimary, textAlign: 'center', marginBottom: Spacing.xl, lineHeight: 38,
  },
  benefitsCard: {
    backgroundColor: '#fff', borderRadius: Radii.xl, padding: Spacing.lg,
    gap: Spacing.md, marginBottom: Spacing.lg,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 8, elevation: 3,
  },
  benefitRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  checkCircle: {
    width: 22, height: 22, borderRadius: 11,
    backgroundColor: Colors.primaryOrange, alignItems: 'center', justifyContent: 'center',
  },
  benefitText: { flex: 1, fontSize: Typography.base, color: Colors.textPrimary, fontWeight: FontWeight.medium },
  description: {
    fontSize: Typography.sm, color: Colors.textSecondary, lineHeight: 22,
    textAlign: 'center', marginBottom: Spacing.xl,
  },
  socialProof: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, justifyContent: 'center' },
  avatarRow: { flexDirection: 'row' },
  proofAvatar: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: '#fff' },
  socialText: { fontSize: Typography.sm, color: Colors.textSecondary, fontWeight: FontWeight.medium },
  footer: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    padding: Spacing.lg, paddingBottom: 36, backgroundColor: 'transparent',
  },
  continueBtn: {
    backgroundColor: Colors.primaryOrange, borderRadius: 32,
    paddingVertical: 18, alignItems: 'center',
  },
  continueBtnText: { color: '#fff', fontSize: Typography.base, fontWeight: FontWeight.bold },
});
