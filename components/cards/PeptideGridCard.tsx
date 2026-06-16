import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Radii, Typography, FontWeight, Spacing } from '../../constants/theme';
import type { Peptide } from '../../types';

// Vibrant colors matching the design screenshots
const CATEGORY_COLORS: Record<string, { bg: string; label: string }> = {
  'Fat Loss':                    { bg: '#F97316', label: 'FAT LOSS' },
  'Recovery & Healing':          { bg: '#22C55E', label: 'HEALING' },
  'Muscle & Performance':        { bg: '#EF4444', label: 'PERFORMANCE' },
  'Cognitive & Neuroprotection': { bg: '#8B5CF6', label: 'BRAIN' },
  'Sleep & Longevity':           { bg: '#3B82F6', label: 'LONGEVITY' },
  'Sexual Health':               { bg: '#EC4899', label: 'VITALITY' },
  'Skin & Aesthetics':           { bg: '#F59E0B', label: 'SKIN & REPAIR' },
  'GI & Gut Health':             { bg: '#10B981', label: 'GUT HEALTH' },
};

interface Props {
  peptide: Peptide;
  onPress: () => void;
}

export default function PeptideGridCard({ peptide, onPress }: Props) {
  const config = CATEGORY_COLORS[peptide.category] ?? { bg: '#7B4FFF', label: 'PEPTIDE' };
  const firstLetter = peptide.name.charAt(0).toUpperCase();

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: config.bg }]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      {/* Giant translucent watermark */}
      <Text style={styles.watermark}>{firstLetter}</Text>

      {/* Category label */}
      <Text style={styles.categoryLabel}>{config.label}</Text>

      {/* Name & description */}
      <Text style={styles.name}>{peptide.name}</Text>
      <Text style={styles.description} numberOfLines={2}>{peptide.description}</Text>
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
    justifyContent: 'flex-end',
  },
  watermark: {
    position: 'absolute',
    right: -8,
    top: -16,
    fontSize: 110,
    fontWeight: FontWeight.extrabold,
    color: 'rgba(255,255,255,0.15)',
    lineHeight: 120,
  },
  categoryLabel: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 9,
    fontWeight: FontWeight.bold,
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  name: {
    color: '#FFFFFF',
    fontSize: Typography.md,
    fontWeight: FontWeight.extrabold,
    lineHeight: 22,
  },
  description: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: Typography.xs,
    lineHeight: 15,
    marginTop: 2,
  },
});
