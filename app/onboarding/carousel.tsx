import { useRef, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, Dimensions,
  TouchableOpacity, NativeScrollEvent, NativeSyntheticEvent,
} from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Typography, FontWeight, Spacing, Radii } from '../../constants/theme';

const { width } = Dimensions.get('window');

const SLIDES = [
  {
    id: '1',
    title: 'Your Goals,\nOur Guide',
    body: 'From Retatrutide to BPC-157 — expert-curated protocols for every stage of your journey.',
    tag: 'Expert Curated Protocols',
    testimonial: 'Finally an app that makes peptides simple\n— Mike R.',
    isDisclaimer: false,
  },
  {
    id: '2',
    title: "We'll walk you\nthrough it",
    body: "From your first reconstitution to your hundredth injection, we've got you covered with practical guidance, safety context, and schedule support.",
    tag: 'Simple reconstitutions',
    testimonial: 'Finally an app that makes peptides simple\n— Mike R.',
    isDisclaimer: false,
  },
  {
    id: '3',
    title: 'See your\ntransformation',
    body: 'Real people, real results. Document your journey and watch your progress unfold week by week.',
    tag: 'Track what matters to you',
    testimonial: 'The calculator alone is worth it\n— Sarah J.',
    isDisclaimer: false,
  },
  {
    id: '4',
    title: 'This app is not\nmedical advice',
    body: 'This app is for educational purposes only. Always consult a licensed healthcare provider before starting any protocol.',
    tag: '',
    testimonial: '',
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

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

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
          <View style={styles.slide}>
            {/* Image placeholder area */}
            <View style={styles.imageArea}>
              <LinearGradient
                colors={item.isDisclaimer
                  ? ['#1A2A4A', '#2A3A6A']
                  : ['#1A2A4A', '#0D1B2A']}
                style={styles.imagePlaceholder}
              >
                {item.isDisclaimer ? (
                  <View style={styles.shieldContainer}>
                    <View style={styles.shieldOuter}>
                      <View style={styles.shieldInner}>
                        <Text style={styles.shieldPlus}>+</Text>
                      </View>
                    </View>
                  </View>
                ) : (
                  <View style={styles.collageContainer}>
                    <View style={styles.collageCard}>
                      <Text style={styles.collageText}>{item.tag}</Text>
                    </View>
                  </View>
                )}
              </LinearGradient>
            </View>

            {/* Text content */}
            <View style={styles.textBlock}>
              <Text style={[styles.title, item.isDisclaimer && styles.titleLight]}>
                {item.title}
              </Text>
              <Text style={styles.body}>{item.body}</Text>

              {/* Testimonial */}
              {!!item.testimonial && (
                <View style={styles.testimonialRow}>
                  <View style={styles.testimonialAvatar} />
                  <Text style={styles.testimonialText}>{item.testimonial}</Text>
                </View>
              )}

              {/* Disclaimer CTA */}
              {item.isDisclaimer && (
                <TouchableOpacity
                  style={styles.understandBtn}
                  onPress={() => router.push('/onboarding/get-started')}
                  activeOpacity={0.85}
                >
                  <LinearGradient
                    colors={[Colors.accentViolet, '#5B2FDF']}
                    style={styles.understandGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    <Text style={styles.understandText}>I understand</Text>
                  </LinearGradient>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
      />

      {/* Dots */}
      <View style={styles.dots}>
        {SLIDES.map((_, i) => (
          <View key={i} style={[styles.dot, i === activeIndex && styles.dotActive]} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.base },
  slide: {
    width,
    flex: 1,
  },
  imageArea: {
    flex: 1,
    maxHeight: '50%',
  },
  imagePlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  collageContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  collageCard: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: Radii.lg,
    padding: Spacing.lg,
    alignItems: 'center',
  },
  collageText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: Typography.sm,
    fontWeight: FontWeight.medium,
  },
  // Shield for disclaimer
  shieldContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  shieldOuter: {
    width: 120,
    height: 140,
    borderRadius: 60,
    backgroundColor: 'rgba(96,165,250,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shieldInner: {
    width: 80,
    height: 90,
    borderRadius: 40,
    backgroundColor: 'rgba(96,165,250,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shieldPlus: {
    color: '#60A5FA',
    fontSize: 40,
    fontWeight: FontWeight.bold,
  },
  textBlock: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xl,
    gap: Spacing.md,
  },
  title: {
    color: '#FFFFFF',
    fontSize: Typography.xxl,
    fontWeight: FontWeight.bold,
    lineHeight: 36,
    textAlign: 'center',
  },
  titleLight: {
    fontSize: Typography.xl,
  },
  body: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: Typography.sm,
    lineHeight: 22,
    textAlign: 'center',
  },
  testimonialRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.surfaceElevated,
    borderRadius: Radii.lg,
    padding: Spacing.sm,
  },
  testimonialAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.accentOrange,
  },
  testimonialText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: Typography.xs,
    flex: 1,
    lineHeight: 16,
  },
  understandBtn: {
    borderRadius: 32,
    overflow: 'hidden',
    marginTop: Spacing.sm,
  },
  understandGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  understandText: {
    color: '#FFFFFF',
    fontSize: Typography.base,
    fontWeight: FontWeight.semibold,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    paddingBottom: 32,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  dotActive: {
    backgroundColor: '#FFFFFF',
    width: 20,
  },
});
