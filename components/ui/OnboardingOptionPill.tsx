import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { Check } from 'lucide-react-native';
import { Colors, Radii, Typography, FontWeight, Spacing } from '../../constants/theme';

interface Props {
  label: string;
  selected: boolean;
  onPress: () => void;
  subtitle?: string;
}

export default function OnboardingOptionPill({ label, selected, onPress, subtitle }: Props) {
  return (
    <TouchableOpacity
      style={[styles.pill, selected && styles.pillSelected]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.textContainer}>
        <Text style={[styles.label, selected && styles.labelSelected]}>{label}</Text>
        {subtitle ? (
          <Text style={[styles.subtitle, selected && styles.subtitleSelected]}>{subtitle}</Text>
        ) : null}
      </View>
      {selected && (
        <View style={styles.checkCircle}>
          <Check size={14} color={Colors.textPrimary} strokeWidth={3} />
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surfaceElevated,
    borderRadius: Radii.lg,
    borderWidth: 1.5,
    borderColor: Colors.surfaceBorder,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.sm,
  },
  pillSelected: {
    borderColor: Colors.accentOrange,
    backgroundColor: 'rgba(255,107,43,0.12)',
  },
  textContainer: {
    flex: 1,
  },
  label: {
    fontSize: Typography.base,
    fontWeight: FontWeight.medium,
    color: Colors.textSecondary,
  },
  labelSelected: {
    color: Colors.textPrimary,
    fontWeight: FontWeight.semibold,
  },
  subtitle: {
    fontSize: Typography.sm,
    color: Colors.textTertiary,
    marginTop: 2,
  },
  subtitleSelected: {
    color: Colors.textSecondary,
  },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.accentOrange,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: Spacing.sm,
  },
});
