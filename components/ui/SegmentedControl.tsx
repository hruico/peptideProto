import { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Colors, Radii, Typography, FontWeight } from '../../constants/theme';

interface Props {
  options: string[];
  selected: string;
  onChange: (option: string) => void;
}

export default function SegmentedControl({ options, selected, onChange }: Props) {
  const selectedIndex = options.indexOf(selected);
  const animatedValue = useRef(new Animated.Value(selectedIndex)).current;
  const containerWidth = useRef(0);

  useEffect(() => {
    Animated.spring(animatedValue, {
      toValue: selectedIndex,
      useNativeDriver: false,
      tension: 60,
      friction: 10,
    }).start();
  }, [selectedIndex]);

  const segmentWidth = containerWidth.current
    ? containerWidth.current / options.length
    : 0;

  const translateX = animatedValue.interpolate({
    inputRange: options.map((_, i) => i),
    outputRange: options.map((_, i) => i * segmentWidth),
  });

  return (
    <View
      style={styles.container}
      onLayout={(e) => {
        containerWidth.current = e.nativeEvent.layout.width;
      }}
    >
      {/* Sliding pill */}
      {segmentWidth > 0 && (
        <Animated.View
          style={[
            styles.slider,
            { width: segmentWidth, transform: [{ translateX }] },
          ]}
        />
      )}

      {options.map((option) => (
        <TouchableOpacity
          key={option}
          style={styles.segment}
          onPress={() => onChange(option)}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.label,
              selected === option && styles.labelActive,
            ]}
          >
            {option}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.surfaceElevated,
    borderRadius: Radii.full,
    padding: 3,
    position: 'relative',
  },
  slider: {
    position: 'absolute',
    top: 3,
    bottom: 3,
    backgroundColor: Colors.primaryOrange,
    borderRadius: Radii.full,
  },
  segment: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    zIndex: 1,
  },
  label: {
    fontSize: Typography.sm,
    fontWeight: FontWeight.medium,
    color: Colors.textTertiary,
  },
  labelActive: {
    color: Colors.textPrimary,
    fontWeight: FontWeight.semibold,
  },
});
