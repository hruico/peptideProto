import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Users } from 'lucide-react-native';
import { Colors, Radii, Typography, FontWeight, Spacing } from '../../constants/theme';
import type { Protocol } from '../../types';

interface Props {
  protocol: Protocol;
  onPress: () => void;
  width?: number;
  fullWidth?: boolean;
}

export default function ProtocolHeroCard({ protocol, onPress, width = 260, fullWidth = false }: Props) {
  // Build subtitle: "6 weeks · TB-500 · BPC"
  const meta = [protocol.durationLabel, ...protocol.peptideIds.slice(0, 3).map(id => id.toUpperCase().replace(/-\d+$/, ''))].join(' · ');

  return (
    <TouchableOpacity
      style={[styles.card, fullWidth ? styles.cardFull : { width }]}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <ImageBackground
        source={require('../../assets/images/splash-icon.png')}
        style={styles.image}
        imageStyle={[styles.imageStyle, { tintColor: getProtocolColor(protocol.id) }]}
      >
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.75)']}
          style={styles.gradient}
        >
          {/* Participant badge — top right */}
          <View style={styles.badgeRow}>
            <View style={styles.badge}>
              <Users size={11} color="rgba(255,255,255,0.8)" />
              <Text style={styles.badgeText}>{protocol.participantCount} on this</Text>
            </View>
          </View>

          {/* Bottom text */}
          <View style={styles.bottomText}>
            <Text style={styles.name}>{protocol.name}</Text>
            <Text style={styles.meta}>{meta}</Text>
          </View>
        </LinearGradient>
      </ImageBackground>
    </TouchableOpacity>
  );
}

// Give each protocol a distinct tint color for the placeholder image
function getProtocolColor(id: string): string {
  const colors: Record<string, string> = {
    'injury-recovery-stack': '#FF6B2B',
    'gh-optimizer': '#7B4FFF',
    'cognitive-edge': '#4ADE80',
    'longevity-protocol': '#60A5FA',
    'body-recomp': '#F59E0B',
    'elite-recovery': '#EF4444',
    'gut-reset': '#10B981',
  };
  return colors[id] ?? '#FF6B2B';
}

const styles = StyleSheet.create({
  card: {
    height: 200,
    borderRadius: Radii.xl,
    overflow: 'hidden',
    marginRight: Spacing.md,
  },
  cardFull: {
    width: '100%',
    marginRight: 0,
    marginBottom: Spacing.md,
  },
  image: {
    flex: 1,
    backgroundColor: Colors.surfaceElevated,
  },
  imageStyle: {
    borderRadius: Radii.xl,
    opacity: 0.4,
  },
  gradient: {
    flex: 1,
    padding: Spacing.md,
    justifyContent: 'space-between',
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0,0,0,0.45)',
    borderRadius: Radii.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
  },
  badgeText: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: Typography.xs,
    fontWeight: FontWeight.medium,
  },
  bottomText: {
    gap: 4,
  },
  name: {
    color: '#FFFFFF',
    fontSize: Typography.lg,
    fontWeight: FontWeight.extrabold,
  },
  meta: {
    color: 'rgba(255,255,255,0.65)',
    fontSize: Typography.xs,
  },
});
