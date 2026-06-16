import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Users } from 'lucide-react-native';
import { Colors, Radii, Typography, FontWeight, Spacing } from '../../constants/theme';
import type { Protocol } from '../../types';

interface Props {
  protocol: Protocol;
  onPress: () => void;
  width?: number;
}

export default function ProtocolHeroCard({ protocol, onPress, width = 280 }: Props) {
  return (
    <TouchableOpacity
      style={[styles.card, { width }]}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <ImageBackground
        source={
          protocol.heroImage
            ? { uri: protocol.heroImage }
            : require('../../assets/images/splash-icon.png')
        }
        style={styles.image}
        imageStyle={styles.imageStyle}
      >
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.88)']}
          style={styles.gradient}
        >
          {/* Participant badge */}
          <View style={styles.badge}>
            <Users size={12} color={Colors.textPrimary} />
            <Text style={styles.badgeText}>{protocol.participantCount.toLocaleString()} on this</Text>
          </View>

          <View style={styles.textBlock}>
            <Text style={styles.title} numberOfLines={2}>{protocol.name}</Text>
            <Text style={styles.subtitle}>{protocol.durationLabel}</Text>
          </View>
        </LinearGradient>
      </ImageBackground>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    height: 180,
    borderRadius: Radii.xl,
    overflow: 'hidden',
    marginRight: Spacing.md,
  },
  image: {
    flex: 1,
    backgroundColor: Colors.surfaceElevated,
  },
  imageStyle: {
    borderRadius: Radii.xl,
  },
  gradient: {
    flex: 1,
    padding: Spacing.md,
    justifyContent: 'space-between',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,107,43,0.85)',
    alignSelf: 'flex-start',
    borderRadius: Radii.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
  },
  badgeText: {
    color: Colors.textPrimary,
    fontSize: Typography.xs,
    fontWeight: FontWeight.semibold,
  },
  textBlock: {
    gap: 4,
  },
  title: {
    color: Colors.textPrimary,
    fontSize: Typography.md,
    fontWeight: FontWeight.bold,
  },
  subtitle: {
    color: Colors.textSecondary,
    fontSize: Typography.sm,
  },
});
