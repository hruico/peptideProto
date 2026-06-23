import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ImageBackground } from 'react-native';
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

// Cycle through the 4 random images
const CARD_IMAGES = [
  require('../../assets/images/random1.jpeg'),
  require('../../assets/images/random2.jpg'),
  require('../../assets/images/random3.jpg'),
  require('../../assets/images/random4.jpg'),
];

// Deterministic index per protocol so each always gets the same image
const PROTOCOL_IMAGE_INDEX: Record<string, number> = {
  'injury-recovery-stack': 0,
  'gh-optimizer': 1,
  'cognitive-edge': 2,
  'longevity-protocol': 3,
  'body-recomp': 0,
  'elite-recovery': 1,
  'gut-reset': 2,
};

export default function ProtocolHeroCard({ protocol, onPress, width, fullWidth }: Props) {
  const cardWidth = fullWidth ? SCREEN_W - 48 : (width ?? 260);
  const imgIndex = PROTOCOL_IMAGE_INDEX[protocol.id] ?? 0;

  const participantDisplay = protocol.participantCount >= 1000
    ? `${(protocol.participantCount / 1000).toFixed(1)}k`
    : protocol.participantCount.toString();

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.88}
      style={[styles.wrapper, { width: cardWidth }, fullWidth && styles.fullWidthWrapper]}
    >
      <ImageBackground
        source={CARD_IMAGES[imgIndex]}
        style={styles.card}
        imageStyle={styles.cardImage}
        resizeMode="cover"
      >
        {/* Dark gradient — lighter at top, heavier at bottom for text legibility */}
        <LinearGradient
          colors={['rgba(10,10,25,0.25)', 'rgba(10,10,25,0.75)']}
          locations={[0, 1]}
          style={StyleSheet.absoluteFill}
        />

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
      </ImageBackground>
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
  cardImage: {
    borderRadius: Radii.xl,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: Radii.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  categoryBadgeText: {
    color: 'rgba(255,255,255,0.95)',
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
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  subtitle: {
    color: 'rgba(255,255,255,0.75)',
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
    backgroundColor: 'rgba(0,0,0,0.35)',
    borderRadius: Radii.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
  },
  metaText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 10,
    fontWeight: FontWeight.medium,
  },
});
