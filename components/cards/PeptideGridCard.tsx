import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Radii, Typography, FontWeight, Spacing } from '../../constants/theme';
import type { Peptide } from '../../types';

// Map category to a background accent color
const CATEGORY_COLORS: Record<string, string> = {
  'Recovery & Healing': '#1A2A3A',
  'Fat Loss': '#2A1A1A',
  'Muscle & Performance': '#1A2A1A',
  'Cognitive & Neuroprotection': '#231A2A',
  'Sleep & Longevity': '#1A1A2A',
  'Sexual Health': '#2A1A2A',
  'Skin & Aesthetics': '#2A2A1A',
  'GI & Gut Health': '#1A2A2A',
};

interface Props {
  peptide: Peptide;
  onPress: () => void;
}

export default function PeptideGridCard({ peptide, onPress }: Props) {
  const bgColor = CATEGORY_COLORS[peptide.category] ?? Colors.surfaceElevated;
  const firstLetter = peptide.name.charAt(0).toUpperCase();

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: bgColor }]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      {/* Giant translucent watermark letter */}
      <Text style={styles.watermark}>{firstLetter}</Text>

      {/* Category label */}
      <View style={styles.categoryBadge}>
        <Text style={styles.categoryText} numberOfLines={1}>{peptide.category}</Text>
      </View>

      {/* Name & description */}
      <View style={styles.textBlock}>
        <Text style={styles.name}>{peptide.name}</Text>
        <Text style={styles.description} numberOfLines={2}>{peptide.description}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: Radii.xl,
    padding: Spacing.md,
    minHeight: 160,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    justifyContent: 'space-between',
  },
  watermark: {
    position: 'absolute',
    right: -8,
    top: -12,
    fontSize: 100,
    fontWeight: FontWeight.extrabold,
    color: 'rgba(255,255,255,0.05)',
    lineHeight: 110,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: Radii.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
  },
  categoryText: {
    color: Colors.textTertiary,
    fontSize: Typography.xs,
    fontWeight: FontWeight.medium,
  },
  textBlock: {
    gap: 4,
    marginTop: Spacing.sm,
  },
  name: {
    color: Colors.textPrimary,
    fontSize: Typography.base,
    fontWeight: FontWeight.bold,
  },
  description: {
    color: Colors.textSecondary,
    fontSize: Typography.xs,
    lineHeight: 16,
  },
});
