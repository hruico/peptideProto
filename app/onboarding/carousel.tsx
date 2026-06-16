import { useRef, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, Dimensions,
  TouchableOpacity, NativeScrollEvent, NativeSyntheticEvent,
} from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ChevronLeft } from 'lucide-react-native';
import GradientButton from '../../components/ui/GradientButton';
import { Colors, Radii, Typography, FontWeight, Spacing } from '../../constants/theme';

const { width } = Dimensions.get('window');

const SLIDES = [
  {
    id: '1',
    emoji: '🧬',
    title: 'Research-backed protocols',
    body: 'Every protocol is built from peer-reviewed literature and validated by certified specialists.',
  },
  {
    id: '2',
    emoji: '🎯',
    title: 'Personalised to you',
    body: 'Goals, biology, and lifestyle all factor into your recommended stack.',
  },
  {
    id: '3',
    emoji: '🔬',
    title: 'Precision dosing calculator',
    body: 'Our reconstitution tool takes the guesswork out of preparation — to the microlitre.',
  },
  {
    id: 'disclaimer',
    emoji: '⚠️',
    title: 'Important disclaimer',
    body: 'The Peptide App is for informational purposes only. Nothing here constitutes medical advice. Always consult a qualified healthcare professional before starting any peptide protocol.',
    isDisclaimer: true,
  },
];

export default function CarouselScreen() {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  function onScroll(e: NativeSyntheticEvent<NativeScrollEvent>) {
    const index = Math.round(e.nativeEvent.contentOffset.x / width);
    setActiveIndex(index);
  }

  const isLastSlide = activeIndex === SLIDES.length - 1;

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <TouchableOpacity style={styles.back} onPress={() => router.back()}>
        <ChevronLeft size={24} color={Colors.textSecondary} />
      </TouchableOpacity>

      <FlatList
        ref={flatListRef}
        data={SLIDES}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        renderItem={({ item }) => (
          <View style={[styles.slide, item.isDisclaimer && styles.slideDisclaimer]}>
            <Text style={styles.emoji}>{item.emoji}</Text>
            <Text style={[styles.title, item.isDisclaimer && styles.titleDisclaimer]}>
              {item.title}
            </Text>
            <Text style={styles.body}>{item.body}</Text>

            {item.isDisclaimer && (
              <View style={styles.disclaimerFooter}>
                <GradientButton
                  label="I understand — let's go"
                  onPress={() => router.push('/onboarding/get-started')}
                />
              </View>
            )}
          </View>
        )}
      />

      {/* Page dots */}
      <View style={styles.dots}>
        {SLIDES.map((_, i) => (
          <View key={i} style={[styles.dot, i === activeIndex && styles.dotActive]} />
        ))}
      </View>

      {/* Next button — hidden on disclaimer slide (it has its own CTA) */}
      {!isLastSlide && (
        <View style={styles.footer}>
          <GradientButton
            label="Next"
            onPress={() => {
              flatListRef.current?.scrollToIndex({ index: activeIndex + 1, animated: true });
            }}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.base },
  back: { paddingTop: 56, paddingHorizontal: Spacing.md },
  slide: {
    width,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
    gap: Spacing.md,
  },
  slideDisclaimer: {
    justifyContent: 'center',
  },
  emoji: { fontSize: 64, marginBottom: Spacing.md },
  title: {
    color: Colors.textPrimary,
    fontSize: Typography.xxl,
    fontWeight: FontWeight.extrabold,
    textAlign: 'center',
    lineHeight: 36,
  },
  titleDisclaimer: { color: Colors.warning },
  body: {
    color: Colors.textSecondary,
    fontSize: Typography.base,
    textAlign: 'center',
    lineHeight: 26,
  },
  disclaimerFooter: { marginTop: Spacing.xl, width: '100%' },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.xs,
    paddingBottom: Spacing.lg,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.surfaceBorder,
  },
  dotActive: {
    backgroundColor: Colors.accentOrange,
    width: 20,
  },
  footer: { paddingHorizontal: Spacing.lg, paddingBottom: 40 },
});
