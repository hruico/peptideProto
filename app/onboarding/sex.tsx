import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ChevronLeft } from 'lucide-react-native';
import OnboardingOptionPill from '../../components/ui/OnboardingOptionPill';
import GradientButton from '../../components/ui/GradientButton';
import { useOnboardingStore } from '../../store/useOnboardingStore';
import { Colors, Typography, FontWeight, Spacing } from '../../constants/theme';
import type { Sex } from '../../types';

const OPTIONS: { label: string; value: Sex; subtitle?: string }[] = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
  { label: 'Prefer not to say', value: 'prefer-not-to-say' },
];

export default function SexScreen() {
  const { sex, setSex } = useOnboardingStore();
  const [selected, setSelected] = useState<Sex | null>(sex);

  function handleContinue() {
    if (!selected) return;
    setSex(selected);
    router.push('/onboarding/age');
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Back */}
      <TouchableOpacity style={styles.back} onPress={() => router.back()}>
        <ChevronLeft size={24} color={Colors.textSecondary} />
      </TouchableOpacity>

      <View style={styles.content}>
        <Text style={styles.step}>1 of 3</Text>
        <Text style={styles.heading}>What's your biological sex?</Text>
        <Text style={styles.sub}>Helps us calibrate dosing recommendations.</Text>

        <View style={styles.options}>
          {OPTIONS.map((opt) => (
            <OnboardingOptionPill
              key={opt.value}
              label={opt.label}
              selected={selected === opt.value}
              onPress={() => setSelected(opt.value)}
            />
          ))}
        </View>
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
  options: { gap: 0 },
  footer: { padding: Spacing.lg, paddingBottom: 40 },
});
