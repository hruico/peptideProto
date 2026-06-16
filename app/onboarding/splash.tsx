import { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Typography, FontWeight, Spacing } from '../../constants/theme';

const { width, height } = Dimensions.get('window');

// Generate stable star positions
const STARS = Array.from({ length: 80 }, (_, i) => ({
  id: i,
  top: (i * 137.508) % 100,
  left: (i * 97.3) % 100,
  size: (i % 3) + 1,
  opacity: 0.3 + (i % 5) * 0.1,
}));

export default function SplashScreen() {
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const buttonOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(titleOpacity, { toValue: 1, duration: 1200, useNativeDriver: true }),
      Animated.timing(buttonOpacity, { toValue: 1, duration: 600, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Deep space gradient background */}
      <LinearGradient
        colors={['#0D1B2A', '#1B2A4A', '#2A3A6A', '#1A2040']}
        style={StyleSheet.absoluteFillObject}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />

      {/* Stars */}
      {STARS.map((star) => (
        <View
          key={star.id}
          style={[
            styles.star,
            {
              top: `${star.top}%` as any,
              left: `${star.left}%` as any,
              width: star.size,
              height: star.size,
              opacity: star.opacity,
            },
          ]}
        />
      ))}

      {/* Mountain silhouette at bottom */}
      <View style={styles.mountainContainer}>
        <LinearGradient
          colors={['transparent', '#0D1B2A']}
          style={styles.mountainFade}
        />
        {/* Simplified mountain shapes */}
        <View style={styles.mountainLeft} />
        <View style={styles.mountainRight} />
        <View style={styles.mountainCenter} />
      </View>

      {/* Wordmark - centered */}
      <Animated.View style={[styles.titleContainer, { opacity: titleOpacity }]}>
        <Text style={styles.titleLine}>THE</Text>
        <Text style={styles.titleLine}>PEPTIDE</Text>
        <Text style={styles.titleLine}>APP</Text>
      </Animated.View>

      {/* CTA Button */}
      <Animated.View style={[styles.buttonWrapper, { opacity: buttonOpacity }]}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/onboarding/personalize')}
          activeOpacity={0.85}
        >
          <Text style={styles.buttonText}>FIND YOUR PROTOCOL</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D1B2A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  star: {
    position: 'absolute',
    backgroundColor: '#FFFFFF',
    borderRadius: 99,
  },
  mountainContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: height * 0.35,
  },
  mountainFade: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 80,
  },
  mountainLeft: {
    position: 'absolute',
    bottom: 0,
    left: -20,
    width: 0,
    height: 0,
    borderLeftWidth: 160,
    borderRightWidth: 160,
    borderBottomWidth: 220,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#1A2535',
  },
  mountainRight: {
    position: 'absolute',
    bottom: 0,
    right: -20,
    width: 0,
    height: 0,
    borderLeftWidth: 140,
    borderRightWidth: 140,
    borderBottomWidth: 190,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#1E2B3E',
  },
  mountainCenter: {
    position: 'absolute',
    bottom: 0,
    left: width / 2 - 140,
    width: 0,
    height: 0,
    borderLeftWidth: 140,
    borderRightWidth: 140,
    borderBottomWidth: 260,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#162030',
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 180,
  },
  titleLine: {
    color: '#FFFFFF',
    fontSize: 44,
    fontWeight: '300' as const,
    letterSpacing: 12,
    lineHeight: 56,
    textAlign: 'center',
  },
  buttonWrapper: {
    position: 'absolute',
    bottom: 60,
    left: Spacing.xl,
    right: Spacing.xl,
  },
  button: {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
    borderRadius: 32,
    paddingVertical: 16,
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: Typography.sm,
    fontWeight: FontWeight.semibold,
    letterSpacing: 2,
  },
});
