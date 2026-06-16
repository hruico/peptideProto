import { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Colors, Typography, FontWeight, Spacing } from '../../constants/theme';

export default function PersonalizeScreen() {
  // Auto-advance after 1.5s, but also allow tap to skip
  useEffect(() => {
    const timer = setTimeout(() => router.push('/onboarding/sex'), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={1}
      onPress={() => router.push('/onboarding/sex')}
    >
      <StatusBar style="light" />
      <Text style={styles.eyebrow}>LET'S GET TO KNOW YOU</Text>
      <Text style={styles.heading}>We'll personalise{'\n'}your experience</Text>
      <Text style={styles.body}>
        A few quick questions so we can match you with the right peptides and protocols.
      </Text>
      <Text style={styles.hint}>Tap anywhere to continue</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.base,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
    gap: Spacing.md,
  },
  eyebrow: {
    color: Colors.accentOrange,
    fontSize: Typography.xs,
    fontWeight: FontWeight.semibold,
    letterSpacing: 2,
    textAlign: 'center',
  },
  heading: {
    color: Colors.textPrimary,
    fontSize: Typography.xxl,
    fontWeight: FontWeight.extrabold,
    textAlign: 'center',
    lineHeight: 38,
  },
  body: {
    color: Colors.textSecondary,
    fontSize: Typography.base,
    textAlign: 'center',
    lineHeight: 24,
    marginTop: Spacing.sm,
  },
  hint: {
    color: Colors.textTertiary,
    fontSize: Typography.sm,
    marginTop: Spacing.xxl,
  },
});
