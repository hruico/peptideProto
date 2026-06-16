import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ChevronLeft } from 'lucide-react-native';
import GradientButton from '../../components/ui/GradientButton';
import { useOnboardingStore } from '../../store/useOnboardingStore';
import { GOALS } from '../../data/goals';
import { Colors, Radii, Typography, FontWeight, Spacing } from '../../constants/theme';

export default function GoalPickerScreen() {
  const { setGoal } = useOnboardingStore();
  const [selected, setSelected] = useState<string | null>(null);

  function handleContinue() {
    if (!selected) return;
    setGoal(selected);
    router.push({ pathname: '/onboarding/peptide-picker', params: { goalId: selected } });
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <TouchableOpacity style={styles.back} onPress={() => router.back()}>
        <ChevronLeft size={24} color={Colors.textSecondary} />
      </TouchableOpacity>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <Text style={styles.heading}>What's your primary goal?</Text>
        <Text style={styles.sub}>We'll prioritise peptides that match this goal.</Text>

        <View style={styles.grid}>
          {GOALS.map((goal) => {
            const isSelected = selected === goal.id;
            return (
              <TouchableOpacity
                key={goal.id}
                style={[styles.card, isSelected && styles.cardSelected]}
                onPress={() => setSelected(goal.id)}
                activeOpacity={0.8}
              >
                <Text style={styles.emoji}>{goal.icon}</Text>
                <Text style={[styles.label, isSelected && styles.labelSelected]}>
                  {goal.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <GradientButton label="Continue" onPress={handleContinue} disabled={!selected} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.base },
  back: { paddingTop: 56, paddingHorizontal: Spacing.md },
  scroll: { paddingHorizontal: Spacing.lg, paddingBottom: 16 },
  heading: {
    color: Colors.textPrimary,
    fontSize: Typography.xl,
    fontWeight: FontWeight.extrabold,
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  sub: {
    color: Colors.textSecondary,
    fontSize: Typography.sm,
    marginBottom: Spacing.xl,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  card: {
    width: '47%',
    backgroundColor: Colors.surfaceElevated,
    borderRadius: Radii.xl,
    padding: Spacing.md,
    borderWidth: 1.5,
    borderColor: Colors.surfaceBorder,
    alignItems: 'center',
    gap: Spacing.sm,
    minHeight: 96,
    justifyContent: 'center',
  },
  cardSelected: {
    borderColor: Colors.accentOrange,
    backgroundColor: 'rgba(255,107,43,0.1)',
  },
  emoji: { fontSize: 32 },
  label: {
    color: Colors.textSecondary,
    fontSize: Typography.sm,
    fontWeight: FontWeight.semibold,
    textAlign: 'center',
  },
  labelSelected: { color: Colors.textPrimary },
  footer: { padding: Spacing.lg, paddingBottom: 40 },
});
