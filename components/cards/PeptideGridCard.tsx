import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import type { Peptide } from '../../types';
import { Radii, Typography, FontWeight, Spacing } from '../../constants/theme';

interface Props {
  peptide: Peptide;
  onPress: () => void;
}

const CATEGORY_COLORS: Record<string, string> = {
  'Recovery & Healing': '#EF4444',
  'Fat Loss': '#F97316',
  'Muscle & Performance': '#3B82F6',
  'Cognitive & Neuroprotection': '#8B5CF6',
  'Sleep & Longevity': '#6366F1',
  'Sexual Health': '#EC4899',
  'Skin & Aesthetics': '#EC4899',
  'GI & Gut Health': '#22C55E',
};

const CATEGORY_BG: Record<string, string> = {
  'Recovery & Healing': '#7F1D1D',
  'Fat Loss': '#7C2D12',
  'Muscle & Performance': '#1E3A8A',
  'Cognitive & Neuroprotection': '#4C1D95',
  'Sleep & Longevity': '#312E81',
  'Sexual Health': '#831843',
  'Skin & Aesthetics': '#831843',
  'GI & Gut Health': '#14532D',
};

export default function PeptideGridCard({ peptide, onPress }: Props) {
  const accentColor = CATEGORY_COLORS[peptide.category] ?? '#6366F1';
  const bgColor = CATEGORY_BG[peptide.category] ?? '#1E1E3A';

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={[styles.card, { backgroundColor: bgColor }]}
    >
      {/* Watermark letter */}
      <Text style={[styles.watermark, { color: accentColor }]}>
        {peptide.name[0]}
      </Text>

      {/* Content */}
      <View style={styles.content}>
        <View style={[styles.categoryPill, { backgroundColor: accentColor + '33' }]}>
          <Text style={[styles.categoryText, { color: accentColor }]}>
            {peptide.category.replace(' & ', ' ')}
          </Text>
        </View>
        <Text style={styles.name}>{peptide.name}</Text>
        <Text style={styles.description} numberOfLines={2}>
          {peptide.description}
        </Text>
        <View style={styles.doseTag}>
          <Text style={styles.doseText}>{peptide.typicalDose} {peptide.doseUnit}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radii.xl,
    padding: Spacing.md,
    minHeight: 180,
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'flex-end',
  },
  watermark: {
    position: 'absolute',
    top: -12,
    right: 8,
    fontSize: 110,
    fontWeight: FontWeight.extrabold,
    opacity: 0.18,
    lineHeight: 110,
  },
  content: {
    gap: 6,
  },
  categoryPill: {
    alignSelf: 'flex-start',
    borderRadius: Radii.full,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  categoryText: {
    fontSize: 9,
    fontWeight: FontWeight.bold,
    letterSpacing: 0.5,
  },
  name: {
    color: '#FFFFFF',
    fontSize: Typography.base,
    fontWeight: FontWeight.extrabold,
  },
  description: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: Typography.xs,
    lineHeight: 16,
  },
  doseTag: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: Radii.full,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  doseText: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 10,
    fontWeight: FontWeight.medium,
  },
});
