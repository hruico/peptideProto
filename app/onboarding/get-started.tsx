import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { X } from 'lucide-react-native';
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
    description: 'Tell us your outcome — we route the protocol.',
    route: '/onboarding/goal-picker',
  },
  {
    id: 'choose-peptide',
    number: '02',
    label: 'Choose a peptide',
    description: 'Browse the catalog by name or mechanism.',
    route: '/onboarding/peptide-picker',
  },
  {
    id: 'browse-protocols',
    number: '03',
    label: 'Browse protocols',
    description: 'Vetted stacks with dosing and timing.',
    route: '/explore/popular-stacks',
  },
  {
    id: 'add-stack',
    number: '04',
    label: 'Add current stack',
    description: 'Log what you take — get a tailored plan.',
    route: '/stack-builder',
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

      {/* Close button */}
      <TouchableOpacity style={styles.closeBtn} onPress={() => {
        continueAsGuest();
        completeOnboarding();
        router.replace('/(tabs)');
      }}>
        <X size={18} color="rgba(255,255,255,0.6)" />
      </TouchableOpacity>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <Text style={styles.heading}>How do you want{'\n'}to get started?</Text>
        <Text style={styles.sub}>Choose the path that matches what you want to do next.</Text>

        {/* 2x2 numbered grid */}
        <View style={styles.grid}>
          {OPTIONS.map((opt) => (
            <TouchableOpacity
              key={opt.id}
              style={styles.card}
              onPress={() => handleOption(opt.id, opt.route)}
              activeOpacity={0.8}
            >
              <Text style={styles.cardNumber}>{opt.number}</Text>
              <View style={styles.divider} />
              <Text style={styles.cardLabel}>{opt.label}</Text>
              <Text style={styles.cardDesc}>{opt.description}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* OR TALK IT THROUGH */}
        <Text style={styles.orLabel}>OR TALK IT THROUGH</Text>

        <VerifiedExpertsCard
          onPressAskExpert={() => Linking.openURL(DISCORD_URL)}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D1B2A' },
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
  scroll: {
    paddingHorizontal: Spacing.lg,
    paddingTop: 80,
    paddingBottom: 48,
  },
  heading: {
    color: '#FFFFFF',
    fontSize: Typography.xxl,
    fontWeight: FontWeight.extrabold,
    lineHeight: 36,
    marginBottom: Spacing.sm,
  },
  sub: {
    color: 'rgba(255,255,255,0.45)',
    fontSize: Typography.sm,
    lineHeight: 20,
    marginBottom: Spacing.xl,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  card: {
    width: '47%',
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderRadius: Radii.xl,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    minHeight: 140,
  },
  cardNumber: {
    color: Colors.accentOrange,
    fontSize: Typography.xl,
    fontWeight: FontWeight.extrabold,
    marginBottom: Spacing.sm,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginBottom: Spacing.sm,
  },
  cardLabel: {
    color: '#FFFFFF',
    fontSize: Typography.base,
    fontWeight: FontWeight.bold,
    marginBottom: 4,
  },
  cardDesc: {
    color: 'rgba(255,255,255,0.45)',
    fontSize: Typography.xs,
    lineHeight: 16,
  },
  orLabel: {
    color: 'rgba(255,255,255,0.35)',
    fontSize: Typography.xs,
    fontWeight: FontWeight.semibold,
    letterSpacing: 1.5,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
});
