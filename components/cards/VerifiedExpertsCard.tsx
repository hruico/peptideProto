import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ShieldCheck, MessageCircle } from 'lucide-react-native';
import { Colors, Radii, Typography, FontWeight, Spacing } from '../../constants/theme';

interface Props {
  onPressAskExpert: () => void;
}

const ROLES = ['Endocrinologist', 'Sports Doctor', 'Longevity Coach'];

export default function VerifiedExpertsCard({ onPressAskExpert }: Props) {
  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <ShieldCheck size={18} color={Colors.success} />
        <Text style={styles.verifiedBadge}>Verified Experts</Text>
      </View>

      <Text style={styles.title}>Get answers from real specialists</Text>
      <Text style={styles.subtitle}>
        Board-certified doctors and coaches ready to review your stack.
      </Text>

      {/* Role chips */}
      <View style={styles.chipsRow}>
        {ROLES.map((role) => (
          <View key={role} style={styles.chip}>
            <Text style={styles.chipText}>{role}</Text>
          </View>
        ))}
      </View>

      {/* CTA */}
      <TouchableOpacity style={styles.button} onPress={onPressAskExpert} activeOpacity={0.8}>
        <MessageCircle size={16} color={Colors.textPrimary} />
        <Text style={styles.buttonText}>Ask an expert</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: Radii.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    gap: Spacing.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  verifiedBadge: {
    color: Colors.success,
    fontSize: Typography.sm,
    fontWeight: FontWeight.semibold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  title: {
    color: Colors.textPrimary,
    fontSize: Typography.md,
    fontWeight: FontWeight.bold,
  },
  subtitle: {
    color: Colors.textSecondary,
    fontSize: Typography.sm,
    lineHeight: 20,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
    marginTop: 2,
  },
  chip: {
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderRadius: Radii.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
  },
  chipText: {
    color: Colors.textSecondary,
    fontSize: Typography.xs,
    fontWeight: FontWeight.medium,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.accentViolet,
    borderRadius: Radii.lg,
    paddingVertical: Spacing.sm + 2,
    gap: Spacing.xs,
    marginTop: Spacing.xs,
  },
  buttonText: {
    color: Colors.textPrimary,
    fontSize: Typography.base,
    fontWeight: FontWeight.semibold,
  },
});
