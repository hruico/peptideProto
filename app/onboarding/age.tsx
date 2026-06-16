import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ChevronLeft } from 'lucide-react-native';
import { useOnboardingStore } from '../../store/useOnboardingStore';
import { Colors, Radii, Typography, FontWeight, Spacing } from '../../constants/theme';
import type { AgeRange } from '../../types';

const AGE_OPTIONS: { label: string; value: AgeRange }[] = [
  { label: '18–29', value: '18-25' },
  { label: '30–39', value: '26-35' },
  { label: '40–49', value: '36-45' },
  { label: '50–59', value: '46-55' },
  { label: '60+', value: '55+' },
  { label: 'Prefer not to say', value: '55+' },
];

export default function AgeScreen() {
  const { setAgeRange } = useOnboardingStore();
  const [selected, setSelected] = useState<string | null>(null);

  function handleSelect(value: AgeRange, label: string) {
    setSelected(label);
    setAgeRange(value);
    setTimeout(() => router.push('/onboarding/carousel'), 200);
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <TouchableOpacity style={styles.back} onPress={() => router.back()}>
        <ChevronLeft size={24} color="rgba(255,255,255,0.6)" />
      </TouchableOpacity>

      <View style={styles.content}>
        <Text style={styles.heading}>How old are you?</Text>
        <Text style={styles.sub}>Dosing varies by age group</Text>

        <View style={styles.grid}>
          {AGE_OPTIONS.map((opt) => (
            <TouchableOpacity
              key={opt.label}
              style={[styles.pill, selected === opt.label && styles.pillSelected]}
              onPress={() => handleSelect(opt.value, opt.label)}
              activeOpacity={0.8}
            >
              <Text style={[styles.pillText, selected === opt.label && styles.pillTextSelected]}>
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
  grid: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  pill: {
    width: '47%',
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
    fontSize: Typography.base,
    fontWeight: FontWeight.medium,
  },
  pillTextSelected: {
    color: '#FFFFFF',
    fontWeight: FontWeight.semibold,
  },
});
