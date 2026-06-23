import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import ScreenBackground from '../../components/ScreenBackground';
import { Colors, Radii, Typography, FontWeight, Spacing } from '../../constants/theme';

export default function HowToProceedScreen() {
  const { goalId } = useLocalSearchParams<{ goalId: string }>();

  return (
    <ScreenBackground bottomOpacity={0.90}>
      <StatusBar style="light" />

      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <ChevronLeft size={22} color={Colors.textPrimary} />
      </TouchableOpacity>

      <View style={styles.content}>
        <Text style={styles.emoji}>{getGoalEmoji(goalId)}</Text>
        <Text style={styles.headline}>How would you like{'\n'}to proceed?</Text>
        <Text style={styles.subtitle}>Choose the approach that works best for you</Text>

        <View style={styles.cards}>
          <TouchableOpacity
            style={styles.optionCard}
            onPress={() => router.push({ pathname: '/onboarding/we-found-one' as any, params: { goalId } })}
            activeOpacity={0.8}
          >
            <View style={styles.optionLeft}>
              <Text style={styles.optionTitle}>See Recommended Protocol</Text>
              <Text style={styles.optionSub}>A complete stack designed for your goal</Text>
            </View>
            <ChevronRight size={18} color={Colors.textTertiary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.optionCard}
            onPress={() => router.push({ pathname: '/onboarding/peptide-picker' as any, params: { goalId } })}
            activeOpacity={0.8}
          >
            <View style={styles.optionLeft}>
              <Text style={styles.optionTitle}>Pick a Specific Peptide</Text>
              <Text style={styles.optionSub}>Start with a single peptide of your choice</Text>
            </View>
            <ChevronRight size={18} color={Colors.textTertiary} />
          </TouchableOpacity>
        </View>

        <Text style={styles.footerNote}>Not sure? The recommended protocol is a great starting point.</Text>
      </View>
    </ScreenBackground>
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
  backBtn: {
    position: 'absolute', top: 52, left: Spacing.lg, zIndex: 10,
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)',
  },
  content: {
    flex: 1, paddingHorizontal: Spacing.lg, paddingTop: 110, alignItems: 'center',
  },
  emoji: { fontSize: 60, marginBottom: Spacing.lg },
  headline: {
    fontSize: Typography.xxl, fontWeight: FontWeight.extrabold,
    color: Colors.textPrimary, textAlign: 'center', marginBottom: Spacing.sm, lineHeight: 36,
  },
  subtitle: {
    fontSize: Typography.sm, color: Colors.textSecondary,
    textAlign: 'center', marginBottom: Spacing.xl,
  },
  cards: { width: '100%', gap: Spacing.md, marginBottom: Spacing.xl },
  optionCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.07)', borderRadius: Radii.xl,
    padding: Spacing.lg, borderWidth: 1, borderColor: 'rgba(255,255,255,0.14)',
  },
  optionLeft: { flex: 1 },
  optionTitle: { fontSize: Typography.base, fontWeight: FontWeight.bold, color: Colors.textPrimary, marginBottom: 4 },
  optionSub: { fontSize: Typography.sm, color: Colors.textSecondary },
  footerNote: { fontSize: Typography.xs, color: Colors.textTertiary, textAlign: 'center' },
});
