import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ChevronLeft, Check } from 'lucide-react-native';
import { useState } from 'react';
import ScreenBackground from '../../components/ScreenBackground';
import { getGoalDetailById } from '../../data/goals';
import { useOnboardingStore } from '../../store/useOnboardingStore';
import { Colors, Radii, Typography, FontWeight, Spacing } from '../../constants/theme';

export default function WhatsGoingOnScreen() {
  const { goalId } = useLocalSearchParams<{ goalId: string }>();
  const detail = getGoalDetailById(goalId);
  const [selected, setSelected] = useState<string | null>(null);
  const { setGoal } = useOnboardingStore();

  function handleContinue() {
    if (goalId) setGoal(goalId);
    router.push({ pathname: '/onboarding/how-to-proceed' as any, params: { goalId } });
  }

  return (
    <ScreenBackground>
      <StatusBar style="light" />

      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <ChevronLeft size={22} color={Colors.textPrimary} />
      </TouchableOpacity>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Goal tag */}
        <View style={styles.goalTag}>
          <Text style={styles.goalTagText}>{detail?.id?.replace('-', ' ').toUpperCase() ?? 'GOAL'}</Text>
        </View>

        <Text style={styles.headline}>What's going on?</Text>
        <Text style={styles.subtitle}>Pick the closest match to personalize your experience</Text>

        <View style={styles.options}>
          {(detail?.symptomOptions ?? []).map((opt) => {
            const isSelected = selected === opt;
            return (
              <TouchableOpacity
                key={opt}
                style={[styles.optionRow, isSelected && styles.optionRowSelected]}
                onPress={() => setSelected(isSelected ? null : opt)}
                activeOpacity={0.7}
              >
                <View style={[styles.optionCheck, isSelected && styles.optionCheckSelected]}>
                  {isSelected && <Check size={12} color="#fff" />}
                </View>
                <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>{opt}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={styles.footerNote}>Optional — helps us personalize your protocol</Text>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.continueBtn} onPress={handleContinue} activeOpacity={0.85}>
          <Text style={styles.continueBtnText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  backBtn: {
    position: 'absolute', top: 52, left: Spacing.lg, zIndex: 10,
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center',
  },
  scroll: { paddingHorizontal: Spacing.lg, paddingTop: 100, paddingBottom: 120 },
  goalTag: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.primaryOrangeLight, borderRadius: Radii.full,
    paddingHorizontal: Spacing.md, paddingVertical: 5, marginBottom: Spacing.lg,
  },
  goalTagText: { color: Colors.primaryOrange, fontSize: Typography.xs, fontWeight: FontWeight.bold, letterSpacing: 1 },
  headline: { fontSize: Typography.xxl, fontWeight: FontWeight.extrabold, color: Colors.textPrimary, marginBottom: Spacing.sm },
  subtitle: { fontSize: Typography.sm, color: Colors.textSecondary, lineHeight: 20, marginBottom: Spacing.xl },
  options: { gap: Spacing.sm },
  optionRow: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    backgroundColor: 'rgba(255,255,255,0.07)', borderRadius: Radii.lg,
    padding: Spacing.md, borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.12)',
  },
  optionRowSelected: {
    backgroundColor: Colors.primaryOrangeLight, borderColor: Colors.primaryOrange,
  },
  optionCheck: {
    width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center', justifyContent: 'center',
  },
  optionCheckSelected: { backgroundColor: Colors.primaryOrange, borderColor: Colors.primaryOrange },
  optionText: { flex: 1, fontSize: Typography.base, color: Colors.textPrimary },
  optionTextSelected: { color: Colors.primaryOrange, fontWeight: FontWeight.semibold },
  footerNote: { marginTop: Spacing.lg, fontSize: Typography.xs, color: Colors.textTertiary, textAlign: 'center' },
  footer: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    padding: Spacing.lg, paddingBottom: 36, backgroundColor: 'rgba(18,19,42,0.88)',
    borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.1)',
  },
  continueBtn: {
    backgroundColor: Colors.primaryOrange, borderRadius: 32, paddingVertical: 18, alignItems: 'center',
  },
  continueBtnText: { color: '#fff', fontSize: Typography.base, fontWeight: FontWeight.bold },
});
