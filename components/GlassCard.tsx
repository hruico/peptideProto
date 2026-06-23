/**
 * GlassCard — a glassmorphism card container.
 * Uses BlurView on iOS, semi-transparent fill on Android.
 */
import React from 'react';
import { View, StyleSheet, Platform, ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';
import { Radii } from '../constants/theme';

interface Props {
  children: React.ReactNode;
  style?: ViewStyle;
  intensity?: number;
  borderRadius?: number;
}

export default function GlassCard({
  children,
  style,
  intensity = 32,
  borderRadius = Radii.xl,
}: Props) {
  return (
    <View style={[styles.wrapper, { borderRadius }, style]}>
      {Platform.OS === 'ios' ? (
        <BlurView
          intensity={intensity}
          tint="light"
          style={[StyleSheet.absoluteFill, { borderRadius }]}
        />
      ) : (
        <View
          style={[
            StyleSheet.absoluteFill,
            { borderRadius, backgroundColor: 'rgba(255,255,255,0.08)' },
          ]}
        />
      )}
      {/* Top-edge shimmer */}
      <View style={[styles.shimmer, { borderRadius }]} />
      <View style={{ position: 'relative' }}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
  },
  shimmer: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
});
