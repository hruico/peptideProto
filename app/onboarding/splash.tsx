import { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Image, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import GradientButton from '../../components/ui/GradientButton';
import { Colors, Typography, FontWeight, Spacing } from '../../constants/theme';

const { width } = Dimensions.get('window');

export default function SplashScreen() {
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const titleTranslate = useRef(new Animated.Value(20)).current;
  const subtitleOpacity = useRef(new Animated.Value(0)).current;
  const buttonOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(titleOpacity, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.timing(titleTranslate, { toValue: 0, duration: 800, useNativeDriver: true }),
      ]),
      Animated.timing(subtitleOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(buttonOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Starfield bg placeholder */}
      <View style={styles.starfield}>
        {Array.from({ length: 40 }).map((_, i) => (
          <View
            key={i}
            style={[
              styles.star,
              {
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                width: Math.random() * 2 + 1,
                height: Math.random() * 2 + 1,
                opacity: Math.random() * 0.6 + 0.2,
              },
            ]}
          />
        ))}
      </View>

      {/* Vial illustration placeholder */}
      <View style={styles.vialContainer}>
        <Image
          source={require('../../assets/images/splash-icon.png')}
          style={styles.vialImage}
          resizeMode="contain"
        />
      </View>

      {/* Animated wordmark */}
      <Animated.View
        style={[
          styles.titleContainer,
          { opacity: titleOpacity, transform: [{ translateY: titleTranslate }] },
        ]}
      >
        <Text style={styles.titleSmall}>THE</Text>
        <Text style={styles.titleLarge}>PEPTIDE</Text>
        <Text style={styles.titleSmall}>APP</Text>
      </Animated.View>

      <Animated.Text style={[styles.tagline, { opacity: subtitleOpacity }]}>
        Science-backed. Personalised. Yours.
      </Animated.Text>

      <Animated.View style={[styles.buttonWrapper, { opacity: buttonOpacity }]}>
        <GradientButton
          label="FIND YOUR PROTOCOL"
          variant="primary-orange"
          onPress={() => router.push('/onboarding/personalize')}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.base,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
  },
  starfield: {
    ...StyleSheet.absoluteFillObject,
  },
  star: {
    position: 'absolute',
    backgroundColor: '#FFFFFF',
    borderRadius: 99,
  },
  vialContainer: {
    marginBottom: Spacing.xl,
  },
  vialImage: {
    width: 100,
    height: 100,
    tintColor: Colors.accentOrange,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  titleSmall: {
    color: Colors.textSecondary,
    fontSize: Typography.md,
    fontWeight: FontWeight.semibold,
    letterSpacing: 6,
  },
  titleLarge: {
    color: Colors.textPrimary,
    fontSize: Typography.xxxl,
    fontWeight: FontWeight.extrabold,
    letterSpacing: 4,
  },
  tagline: {
    color: Colors.textTertiary,
    fontSize: Typography.sm,
    letterSpacing: 1,
    marginBottom: Spacing.xxl,
  },
  buttonWrapper: {
    width: '100%',
  },
});
