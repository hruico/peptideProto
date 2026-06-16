import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ChevronLeft, Check } from 'lucide-react-native';
import GradientButton from '../../components/ui/GradientButton';
import { useOnboardingStore } from '../../store/useOnboardingStore';
import { useUserStore } from '../../store/useUserStore';
import { getPeptideById } from '../../data/peptides';
import { Colors, Radii, Typography, FontWeight, Spacing } from '../../constants/theme';

const REASONS = [
  'Injury recovery',
  'Body composition',
  'Cognitive enhancement',
  'Anti-aging & longevity',
  'Sleep quality',
  'Athletic performance',
  'Gut health',
  'General wellness',
  'Research & education',
];

export default function InterestReasonScreen() {
  const { peptideId } = useLocalSearchParams<{ peptideId?: string }>();
  const { setInterestReasons, completeOnboarding } = useOnboardingStore();
  const { continueAsGuest } = useUserStore();
  const [selected, setSelected] = useState<string[]>([]);

  const peptide = peptideId ? getPeptideById(peptideId) : null;

  function toggleReason(reason: string) {
    setSelected((prev) =>
      prev.includes(reason) ? prev.filter((r) => r !== reason) : [...prev, reason]
    );
  }

  function handleFinish() {
    setInterestReasons(selected);
    continueAsGuest();
    completeOnboarding();
    router.replace('/(tabs)');
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <TouchableOpacity style={styles.back} onPress={() => router.back()}>
        <ChevronLeft size={24} color={Colors.textSecondary} />
      </TouchableOpacity>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <Text style={styles.heading}>
          {peptide
            ? `Why are you interested in ${peptide.name}?`
            : 'What are your goals?'}
        </Text>
        <Text style={styles.sub}>Select all that apply.</Text>

        {REASONS.map((reason) => {
          const isSelected = selected.includes(reason);
          return (
            <TouchableOpacity
              key={reason}
              style={[styles.row, isSelected && styles.rowSelected]}
              onPress={() => toggleReason(reason)}
              activeOpacity={0.8}
            >
              <Text style={[styles.rowLabel, isSelected && styles.rowLabelSelected]}>
                {reason}
              </Text>
              <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
                {isSelected && <Check size={13} color="#fff" strokeWidth={3} />}
              </View>
            </TouchableOpacity>
          );
        })}

        <TouchableOpacity onPress={handleFinish} style={styles.skipRow}>
          <Text style={styles.skipText}>Skip this step</Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.footer}>
        <GradientButton
          label="Let's go →"
          onPress={handleFinish}
          disabled={selected.length === 0}
        />
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
    lineHeight: 30,
  },
  sub: {
    color: Colors.textSecondary,
    fontSize: Typography.sm,
    marginBottom: Spacing.xl,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surfaceElevated,
    borderRadius: Radii.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1.5,
    borderColor: Colors.surfaceBorder,
  },
  rowSelected: {
    borderColor: Colors.accentOrange,
    backgroundColor: 'rgba(255,107,43,0.08)',
  },
  rowLabel: {
    color: Colors.textSecondary,
    fontSize: Typography.base,
    fontWeight: FontWeight.medium,
  },
  rowLabelSelected: { color: Colors.textPrimary },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: Colors.surfaceBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    backgroundColor: Colors.accentOrange,
    borderColor: Colors.accentOrange,
  },
  skipRow: { alignItems: 'center', paddingVertical: Spacing.lg },
  skipText: { color: Colors.textTertiary, fontSize: Typography.sm },
  footer: { padding: Spacing.lg, paddingBottom: 40 },
});
