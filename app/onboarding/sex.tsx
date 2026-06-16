import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ChevronLeft } from 'lucide-react-native';
import { useOnboardingStore } from '../../store/useOnboardingStore';
import { Colors, Radii, Typography, FontWeight, Spacing } from '../../constants/theme';
import type { Sex } from '../../types';

const OPTIONS: { label: string; value: Sex }[] = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
  { label: 'Prefer not to say', value: 'prefer-not-to-say' },
];

export default function SexScreen() {
  const { sex, setSex } = useOnboardingStore();
  const [selected, setSelected] = useState<Sex | null>(sex);

  function handleSelect(value: Sex) {
    setSelected(value);
    setSex(value);
    setTimeout(() => router.push('/onboarding/age'), 200);
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <TouchableOpacity style={styles.back} onPress={() => router.back()}>
        <ChevronLeft size={24} color="rgba(255,255,255,0.6)" />
      </TouchableOpacity>

      <View style={styles.content}>
        <Text style={styles.heading}>What's your sex?</Text>
        <Text style={styles.sub}>Protocols are tailored to your biology</Text>

        <View style={styles.options}>
          {OPTIONS.map((opt) => (
            <TouchableOpacity
              key={opt.value}
              style={[styles.pill, selected === opt.value && styles.pillSelected]}
              onPress={() => handleSelect(opt.value)}
              activeOpacity={0.8}
            >
              <Text style={[styles.pillText, selected === opt.value && styles.pillTextSelected]}>
                {opt.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.base,
  },
  back: {
    position: 'absolute',
    top: 52,
    left: Spacing.lg,
    zIndex: 10,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
    gap: Spacing.sm,
  },
  heading: {
    color: '#FFFFFF',
    fontSize: Typography.xxl,
    fontWeight: FontWeight.bold,
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  sub: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: Typography.sm,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  options: {
    width: '100%',
    gap: Spacing.sm,
  },
  pill: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: Radii.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    paddingVertical: 18,
    alignItems: 'center',
  },
  pillSelected: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderColor: 'rgba(255,255,255,0.4)',
  },
  pillText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: Typography.md,
    fontWeight: FontWeight.medium,
  },
  pillTextSelected: {
    color: '#FFFFFF',
    fontWeight: FontWeight.semibold,
  },
});
