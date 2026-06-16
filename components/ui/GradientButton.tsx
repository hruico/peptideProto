import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Radii, Typography, FontWeight, Spacing } from '../../constants/theme';
import type { LucideIcon } from 'lucide-react-native';

type Variant = 'primary-orange' | 'primary-violet' | 'secondary';

interface Props {
  label: string;
  onPress: () => void;
  variant?: Variant;
  icon?: LucideIcon;
  disabled?: boolean;
  loading?: boolean;
}

const gradientMap: Record<Variant, readonly [string, string]> = {
  'primary-orange': Colors.gradientOrange,
  'primary-violet': Colors.gradientViolet,
  secondary: [Colors.surfaceElevated, Colors.surfaceElevated],
};

export default function GradientButton({
  label,
  onPress,
  variant = 'primary-orange',
  icon: Icon,
  disabled = false,
  loading = false,
}: Props) {
  const colors = gradientMap[variant];

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      style={[styles.wrapper, disabled && styles.disabled]}
    >
      <LinearGradient
        colors={colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradient}
      >
        {loading ? (
          <ActivityIndicator color="#fff" size="small" />
        ) : (
          <>
            {Icon && <Icon size={18} color="#fff" style={styles.icon} />}
            <Text style={[styles.label, variant === 'secondary' && styles.labelSecondary]}>
              {label}
            </Text>
          </>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: Radii.lg,
    overflow: 'hidden',
  },
  disabled: {
    opacity: 0.45,
  },
  gradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    gap: Spacing.sm,
  },
  icon: {
    marginRight: 2,
  },
  label: {
    color: Colors.textPrimary,
    fontSize: Typography.base,
    fontWeight: FontWeight.semibold,
    letterSpacing: 0.3,
  },
  labelSecondary: {
    color: Colors.textSecondary,
  },
});
