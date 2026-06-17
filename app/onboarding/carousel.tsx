import { useRef, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, Dimensions,
  TouchableOpacity, NativeScrollEvent, NativeSyntheticEvent,
} from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { Shield, TrendingUp, Camera, BookOpen } from 'lucide-react-native';
import { Colors, Typography, FontWeight, Spacing, Radii } from '../../constants/theme';

const { width } = Dimensions.get('window');

// Onboarding keeps a dark theme — it's a premium launch experience
const BG = '#0D1B2A';

const SLIDES = [
  {
    id: '1',
    title: 'Your Goals,\nOur Guide',
    body: 'Expert-curated protocols for every stage of your journey — from BPC-157 to Retatrutide.',
    tag: 'EXPERT PROTOCOLS',
    testimonial: '"Finally an app that makes peptides simple." — Mike R.',
    isDisclaimer: false,
    gradientColors: ['#1A2A4A', '#0D1B2A'] as const,
    icon: <BookOpen size={48} color="rgba(255,255,255,0.6)" />,
  },
  {
    id: '2',
    title: "Unlock your\npotential",
    body: "Real people, real results. Peptides are changing what's possible — get the protocol that fits your life.",
    tag: 'TRACK WHAT MATTERS',
    testimonial: '"Down 14 lbs in 8 weeks. Skin is glowing." — Sarah J.',
    isDisclaimer: false,
    gradientColors: ['#2A1A4A', '#1A0D3A'] as const,
    icon: <TrendingUp size={48} color="rgba(255,255,255,0.6)" />,
  },
  {
    id: '3',
    title: 'See your\ntransformation',
    body: 'Document your journey week by week. Track doses, outcomes, and progress photos — all in one place.',
    tag: 'DOCUMENT YOUR JOURNEY',
    testimonial: '"The calculator alone is worth it." — James T.',
    isDisclaimer: false,
    gradientColors: ['#1A3A2A', '#0D2A1A'] as const,
    icon: <Camera size={48} color="rgba(255,255,255,0.6)" />,
  },
  {
    id: '4',
    title: 'Not medical\nadvice',
    body: 'This app is for educational purposes only. Always consult a licensed healthcare provider before starting any protocol.',
    tag: '',
    testimonial: '',
    isDisclaimer: true,
    gradientColors: ['#1A2A4A', '#2A3A6A'] as const,
    icon: <Shield size={48} color="#60A5FA" />,
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
            {/* Upper visual area */}
            <LinearGradient colors={item.gradientColors} style={styles.imageArea}>
              <View style={styles.iconWrap}>{item.icon}</View>
              {item.tag ? (
                <View style={styles.tagPill}>
                  <Text style={styles.tagText}>{item.tag}</Text>
                </View>
              ) : null}
              {/* Stat bubbles for slide 2 */}
              {item.id === '2' && (
                <View style={styles.bubblesContainer}>
                  {[
                    { label: '-14 lbs in 8 weeks', color: '#F97316' },
                    { label: '+9 lbs muscle', color: '#3B82F6' },
                    { label: 'Skin: Glowing', color: '#EC4899' },
                    { label: 'Focus: Sharp', color: '#8B5CF6' },
                  ].map((b, i) => (
                    <View key={i} style={[styles.bubble, { backgroundColor: b.color + '33', borderColor: b.color + '66' }]}>
                      <Text style={[styles.bubbleText, { color: b.color }]}>{b.label}</Text>
                    </View>
                  ))}
                </View>
              )}
            </LinearGradient>

            {/* Text content */}
            <View style={styles.textBlock}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.body}>{item.body}</Text>

              {!!item.testimonial && (
                <View style={styles.testimonialRow}>
                  <View style={styles.testimonialAvatar} />
                  <Text style={styles.testimonialText}>{item.testimonial}</Text>
                </View>
              )}

              {item.isDisclaimer && (
                <TouchableOpacity
                  style={styles.understandBtn}
                  onPress={() => router.push('/onboarding/get-started')}
                  activeOpacity={0.85}
                >
                  <LinearGradient
                    colors={[Colors.accentViolet, '#5B2FDF']}
                    style={styles.understandGradient}
                    start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                  >
                    <Text style={styles.understandText}>I understand →</Text>
                  </LinearGradient>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
      />

      {/* Progress dots */}
      <View style={styles.dots}>
        {SLIDES.map((_, i) => (
          <View key={i} style={[styles.dot, i === activeIndex && styles.dotActive]} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG },
  slide: { width, flex: 1 },
  imageArea: {
    flex: 1,
    maxHeight: '52%',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.lg,
  },
  iconWrap: {
    width: 96, height: 96, borderRadius: 48,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center', justifyContent: 'center',
  },
  tagPill: {
    backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: Radii.full,
    paddingHorizontal: Spacing.md, paddingVertical: 6,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)',
  },
  tagText: { color: 'rgba(255,255,255,0.8)', fontSize: Typography.xs, fontWeight: FontWeight.semibold, letterSpacing: 1.5 },
  bubblesContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, paddingHorizontal: Spacing.xl, justifyContent: 'center' },
  bubble: { borderRadius: Radii.full, paddingHorizontal: Spacing.md, paddingVertical: 6, borderWidth: 1 },
  bubbleText: { fontSize: Typography.xs, fontWeight: FontWeight.semibold },
  textBlock: {
    flex: 1, paddingHorizontal: Spacing.xl, paddingTop: Spacing.xl, gap: Spacing.md,
  },
  title: {
    color: '#FFFFFF', fontSize: Typography.xxl, fontWeight: FontWeight.extrabold,
    lineHeight: 38, textAlign: 'center',
  },
  body: {
    color: 'rgba(255,255,255,0.55)', fontSize: Typography.sm,
    lineHeight: 22, textAlign: 'center',
  },
  testimonialRow: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.sm,
    backgroundColor: 'rgba(255,255,255,0.07)', borderRadius: Radii.lg,
    padding: Spacing.sm, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
  },
  testimonialAvatar: {
    width: 28, height: 28, borderRadius: 14, backgroundColor: Colors.accentOrange,
  },
  testimonialText: { color: 'rgba(255,255,255,0.6)', fontSize: Typography.xs, flex: 1, lineHeight: 16 },
  understandBtn: { borderRadius: 32, overflow: 'hidden', marginTop: Spacing.sm },
  understandGradient: { paddingVertical: 16, alignItems: 'center' },
  understandText: { color: '#FFFFFF', fontSize: Typography.base, fontWeight: FontWeight.semibold },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 6, paddingBottom: 36 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.2)' },
  dotActive: { backgroundColor: Colors.primaryOrange, width: 20 },
});
