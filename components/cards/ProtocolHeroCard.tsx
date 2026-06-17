import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Users, Clock } from 'lucide-react-native';
import type { Protocol } from '../../types';
import { Radii, Typography, FontWeight, Spacing } from '../../constants/theme';

interface Props {
  protocol: Protocol;
  onPress: () => void;
  width?: number;
  fullWidth?: boolean;
}

const SCREEN_W = Dimensions.get('window').width;

// Per-protocol gradient colors
const PROTOCOL_GRADIENTS: Record<string, readonly [string, string]> = {
  'injury-recovery-stack': ['#B91C1C', '#7F1D1D'],
  'gh-optimizer': ['#1D4ED8', '#1E3A8A'],
  'cognitive-edge': ['#6D28D9', '#4C1D95'],
  'longevity-protocol': ['#0F766E', '#134E4A'],
  'body-recomp': ['#C2410C', '#7C2D12'],
  'elite-recovery': ['#15803D', '#14532D'],
  'gut-reset': ['#4338CA', '#312E81'],
};

const CATEGORY_GRADIENTS: Record<string, readonly [string, string]> = {
  'curated-combo': ['#1D4ED8', '#1E3A8A'],
  'expert-protocol': ['#6D28D9', '#4C1D95'],
  'community': ['#0F766E', '#134E4A'],
};

export default function ProtocolHeroCard({ protocol, onPress, width, fullWidth }: Props) {
  const cardWidth = fullWidth ? SCREEN_W - 48 : (width ?? 260);
  const gradient = PROTOCOL_GRADIENTS[protocol.id] ?? CATEGORY_GRADIENTS[protocol.category] ?? ['#1A1A2E', '#0D1225'];

  const participantDisplay = protocol.participantCount >= 1000
    ? `${(protocol.participantCount / 1000).toFixed(1)}k`
    : protocol.participantCount.toString();

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.88}
      style={[styles.wrapper, { width: cardWidth }, fullWidth && styles.fullWidthWrapper]}
    >
      <LinearGradient
        colors={gradient}
        style={styles.card}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Category label top-left */}
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryBadgeText}>
            {protocol.category === 'curated-combo' ? 'POPULAR STACK' : 'EXPERT PROTOCOL'}
          </Text>
        </View>

        {/* Bottom content */}
        <View style={styles.bottomContent}>
          <Text style={styles.name} numberOfLines={2}>{protocol.name}</Text>
          <Text style={styles.subtitle} numberOfLines={1}>{protocol.subtitle}</Text>

          <View style={styles.metaRow}>
            <View style={styles.metaBadge}>
              <Clock size={10} color="rgba(255,255,255,0.8)" />
              <Text style={styles.metaText}>{protocol.durationLabel}</Text>
            </View>
            <View style={styles.metaBadge}>
              <Users size={10} color="rgba(255,255,255,0.8)" />
              <Text style={styles.metaText}>{participantDisplay} started</Text>
            </View>
            <View style={styles.metaBadge}>
              <Text style={styles.metaText}>{protocol.peptideIds.length} peptides</Text>
            </View>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: Radii.xl,
    overflow: 'hidden',
    marginRight: Spacing.md,
  },
  fullWidthWrapper: {
    marginRight: 0,
    marginBottom: Spacing.md,
  },
  card: {
    height: 200,
    padding: Spacing.md,
    justifyContent: 'space-between',
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: Radii.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  categoryBadgeText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 9,
    fontWeight: FontWeight.bold,
    letterSpacing: 1,
  },
  bottomContent: {
    gap: 6,
  },
  name: {
    color: '#FFFFFF',
    fontSize: Typography.lg,
    fontWeight: FontWeight.extrabold,
    lineHeight: 26,
  },
  subtitle: {
    color: 'rgba(255,255,255,0.65)',
    fontSize: Typography.xs,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
  },
  metaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0,0,0,0.25)',
    borderRadius: Radii.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
  },
  metaText: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 10,
    fontWeight: FontWeight.medium,
  },
});
