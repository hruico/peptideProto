import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Target, FlaskConical, BookOpen, Layers, ChevronLeft } from 'lucide-react-native';
import * as Linking from 'expo-linking';
import VerifiedExpertsCard from '../../components/cards/VerifiedExpertsCard';
import { useOnboardingStore } from '../../store/useOnboardingStore';
import { useUserStore } from '../../store/useUserStore';
import { Colors, Radii, Typography, FontWeight, Spacing } from '../../constants/theme';

const DISCORD_URL = 'https://discord.gg/peptideapp';

const OPTIONS = [
  {
    id: 'match-goal',
    number: '01',
    label: 'Match my goal',
    description: 'We\'ll find peptides based on what you want to achieve.',
    icon: Target,
    route: '/onboarding/goal-picker',
  },
  {
    id: 'choose-peptide',
    number: '02',
    label: 'Choose a peptide',
    description: 'I already know what I want to research.',
    icon: FlaskConical,
    route: '/onboarding/peptide-picker',
  },
  {
    id: 'browse-protocols',
    number: '03',
    label: 'Browse protocols',
    description: 'Show me curated stacks I can start.',
    icon: BookOpen,
    route: null, // goes straight to tabs
  },
  {
    id: 'add-stack',
    number: '04',
    label: 'Add my current stack',
    description: 'I\'m already running a protocol — help me track it.',
    icon: Layers,
    route: null, // goes straight to tabs
  },
];

export default function GetStartedScreen() {
  const { setSelectedPath, completeOnboarding } = useOnboardingStore();
  const { continueAsGuest } = useUserStore();

  function handleOption(id: string, route: string | null) {
    setSelectedPath(id as any);
    if (route) {
      router.push(route as any);
    } else {
      continueAsGuest();
      completeOnboarding();
      router.replace('/(tabs)');
    }
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <TouchableOpacity style={styles.back} onPress={() => router.back()}>
        <ChevronLeft size={24} color={Colors.textSecondary} />
      </TouchableOpacity>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <Text style={styles.step}>3 of 3</Text>
        <Text style={styles.heading}>How do you want{'\n'}to get started?</Text>

        <View style={styles.grid}>
          {OPTIONS.map((opt) => {
            const Icon = opt.icon;
            return (
              <TouchableOpacity
                key={opt.id}
                style={styles.optionCard}
                onPress={() => handleOption(opt.id, opt.route)}
                activeOpacity={0.8}
              >
                <View style={styles.optionHeader}>
                  <Text style={styles.optionNumber}>{opt.number}</Text>
                  <View style={styles.iconCircle}>
                    <Icon size={18} color={Colors.accentOrange} />
                  </View>
                </View>
                <Text style={styles.optionLabel}>{opt.label}</Text>
                <Text style={styles.optionDesc}>{opt.description}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.expertsCard}>
          <VerifiedExpertsCard
            onPressAskExpert={() => Linking.openURL(DISCORD_URL)}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.base },
  back: { paddingTop: 56, paddingHorizontal: Spacing.md },
  scroll: { paddingHorizontal: Spacing.lg, paddingBottom: 48 },
  step: {
    color: Colors.accentOrange,
    fontSize: Typography.sm,
    fontWeight: FontWeight.semibold,
    letterSpacing: 1,
    marginBottom: Spacing.sm,
    marginTop: Spacing.lg,
  },
  heading: {
    color: Colors.textPrimary,
    fontSize: Typography.xl,
    fontWeight: FontWeight.extrabold,
    marginBottom: Spacing.xl,
    lineHeight: 32,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  optionCard: {
    width: '47%',
    backgroundColor: Colors.surfaceElevated,
    borderRadius: Radii.xl,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    gap: Spacing.xs,
  },
  optionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.xs,
  },
  optionNumber: {
    color: Colors.textTertiary,
    fontSize: Typography.xl,
    fontWeight: FontWeight.extrabold,
  },
  iconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255,107,43,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionLabel: {
    color: Colors.textPrimary,
    fontSize: Typography.base,
    fontWeight: FontWeight.bold,
  },
  optionDesc: {
    color: Colors.textSecondary,
    fontSize: Typography.xs,
    lineHeight: 16,
  },
  expertsCard: { marginTop: Spacing.md },
});
