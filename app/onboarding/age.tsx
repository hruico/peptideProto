import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ChevronLeft } from 'lucide-react-native';
import OnboardingOptionPill from '../../components/ui/OnboardingOptionPill';
import GradientButton from '../../components/ui/GradientButton';
import { useOnboardingStore } from '../../store/useOnboardingStore';
import { Colors, Typography, FontWeight, Spacing } from '../../constants/theme';
import type { AgeRange } from '../../types';

const AGE_RANGES: { label: string; value: AgeRange; subtitle: string }[] = [
  { label: '18–25', value: '18-25', subtitle: 'Young adult' },
  { label: '26–35', value: '26-35', subtitle: 'Peak performance' },
  { label: '36–45', value: '36-45', subtitle: 'Optimisation phase' },
  { label: '46–55', value: '46-55', subtitle: 'Longevity focus' },
  { label: '55+',   value: '55+',   subtitle: 'Age-defying' },
];

export default function AgeScreen() {
  const { ageRange, setAgeRange } = useOnboardingStore();
  const [selected, setSelected] = useState<AgeRange | null>(ageRange);

  function handleContinue() {
    if (!selected) return;
    setAgeRange(selected);
    router.push('/onboarding/carousel');
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <TouchableOpacity style={styles.back} onPress={() => router.back()}>
        <ChevronLeft size={24} color={Colors.textSecondary} />
      </TouchableOpacity>

      <View style={styles.content}>
        <Text style={styles.step}>2 of 3</Text>
        <Text style={styles.heading}>How old are you?</Text>
        <Text style={styles.sub}>Age influences optimal peptide cycling and dosing.</Text>

        {AGE_RANGES.map((opt) => (
          <OnboardingOptionPill
            key={opt.value}
            label={opt.label}
            subtitle={opt.subtitle}
            selected={selected === opt.value}
            onPress={() => setSelected(opt.value)}
          />
        ))}
      </View>

      <View style={styles.footer}>
        <GradientButton
          label="Continue"
          onPress={handleContinue}
          disabled={!selected}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.base },
  back: { paddingTop: 56, paddingHorizontal: Spacing.md },
  content: { flex: 1, paddingHorizontal: Spacing.lg, paddingTop: Spacing.xl },
  step: {
    color: Colors.accentOrange,
    fontSize: Typography.sm,
    fontWeight: FontWeight.semibold,
    letterSpacing: 1,
    marginBottom: Spacing.sm,
  },
  heading: {
    color: Colors.textPrimary,
    fontSize: Typography.xl,
    fontWeight: FontWeight.extrabold,
    marginBottom: Spacing.sm,
  },
  sub: {
    color: Colors.textSecondary,
    fontSize: Typography.sm,
    marginBottom: Spacing.xl,
  },
  footer: { padding: Spacing.lg, paddingBottom: 40 },
});
