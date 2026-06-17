import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ChevronLeft, X } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useOnboardingStore } from '../../store/useOnboardingStore';
import { Colors, Radii, Typography, FontWeight, Spacing } from '../../constants/theme';

const GOALS = [
  { id: 'fat-loss',      label: 'Weight Loss',          subtitle: 'Burn fat & boost metabolism',   emoji: '🔥', colors: ['#F97316', '#EA580C'] as const },
  { id: 'skin-health',   label: 'Skincare & Beauty',    subtitle: 'Rejuvenate & glow',              emoji: '💎', colors: ['#EC4899', '#BE185D'] as const },
  { id: 'performance',   label: 'Energy & Performance', subtitle: 'Boost stamina & drive',          emoji: '⚡', colors: ['#22C55E', '#15803D'] as const },
  { id: 'longevity',     label: 'Anti Aging',           subtitle: 'Turn back the clock',            emoji: '⏳', colors: ['#14B8A6', '#0F766E'] as const },
  { id: 'cognition',     label: 'Brain Enhancement',    subtitle: 'Focus & mental clarity',         emoji: '🧠', colors: ['#8B5CF6', '#6D28D9'] as const },
  { id: 'recovery',      label: 'Injury Recovery',      subtitle: 'Heal faster & stronger',         emoji: '❤️', colors: ['#EF4444', '#B91C1C'] as const },
  { id: 'muscle-growth', label: 'Muscle Growth',        subtitle: 'Build strength & vitality',      emoji: '💪', colors: ['#3B82F6', '#1D4ED8'] as const },
  { id: 'sleep',         label: 'Sleep & Recovery',     subtitle: 'Deep rest & regeneration',       emoji: '🌙', colors: ['#6366F1', '#4338CA'] as const },
];

export default function GoalPickerScreen() {
  const { setGoal } = useOnboardingStore();
  const [selected, setSelected] = useState<string | null>(null);

  function handleSelect(id: string) {
    setSelected(id);
    setGoal(id);
    setTimeout(() => {
      router.push({ pathname: '/onboarding/goal-detail' as any, params: { goalId: id } });
    }, 200);
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <ChevronLeft size={20} color="rgba(255,255,255,0.7)" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.closeBtn} onPress={() => router.back()}>
        <X size={18} color="rgba(255,255,255,0.7)" />
      </TouchableOpacity>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <Text style={styles.heading}>What's your goal?</Text>
        <Text style={styles.sub}>We'll recommend the perfect protocol for you</Text>

        <View style={styles.grid}>
          {GOALS.map((goal) => {
            const isSelected = selected === goal.id;
            return (
              <TouchableOpacity
                key={goal.id}
                style={[styles.card, isSelected && styles.cardSelected]}
                onPress={() => handleSelect(goal.id)}
                activeOpacity={0.85}
              >
                <LinearGradient
                  colors={goal.colors}
                  style={styles.cardGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Text style={styles.cardEmoji}>{goal.emoji}</Text>
                  <Text style={styles.cardLabel}>{goal.label}</Text>
                  <Text style={styles.cardSub}>{goal.subtitle}</Text>
                </LinearGradient>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D1B2A' },
  backBtn: {
    position: 'absolute',
    top: 52,
    left: Spacing.lg,
    zIndex: 10,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtn: {
    position: 'absolute',
    top: 52,
    right: Spacing.lg,
    zIndex: 10,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scroll: { paddingHorizontal: Spacing.lg, paddingTop: 100, paddingBottom: 48 },
  heading: {
    color: '#FFFFFF',
    fontSize: Typography.xxl,
    fontWeight: FontWeight.extrabold,
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  sub: {
    color: 'rgba(255,255,255,0.45)',
    fontSize: Typography.sm,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  card: {
    width: '47%',
    borderRadius: Radii.xl,
    overflow: 'hidden',
    opacity: 1,
  },
  cardSelected: {
    opacity: 0.9,
    transform: [{ scale: 0.97 }],
  },
  cardGradient: {
    padding: Spacing.lg,
    minHeight: 150,
    justifyContent: 'flex-end',
  },
  cardEmoji: {
    fontSize: 40,
    marginBottom: Spacing.sm,
  },
  cardLabel: {
    color: '#FFFFFF',
    fontSize: Typography.md,
    fontWeight: FontWeight.extrabold,
    lineHeight: 22,
  },
  cardSub: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: Typography.xs,
    marginTop: 2,
  },
});
