import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Dimensions, ImageBackground, Platform,
} from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { BlurView } from 'expo-blur';
import { Activity, BookOpen, User, Users } from 'lucide-react-native';
import { useState, useMemo } from 'react';
import { addDays, startOfDay, isSameDay, format } from 'date-fns';
import { LinearGradient } from 'expo-linear-gradient';
import * as Linking from 'expo-linking';
import { PROTOCOLS } from '../../data/protocols';
import { Colors, Radii, Typography, FontWeight, Spacing } from '../../constants/theme';

const { width: W } = Dimensions.get('window');
const DISCORD_URL = 'https://discord.gg/peptideapp';

// Lifestyle background images per protocol (Unsplash URLs via require fallback)
const PROTOCOL_IMAGES: Record<string, any> = {
  'injury-recovery-stack': require('../../assets/images/splash-icon.png'),
  'gh-optimizer': require('../../assets/images/splash-icon.png'),
  'cognitive-edge': require('../../assets/images/splash-icon.png'),
  'longevity-protocol': require('../../assets/images/splash-icon.png'),
  'body-recomp': require('../../assets/images/splash-icon.png'),
  'elite-recovery': require('../../assets/images/splash-icon.png'),
  'gut-reset': require('../../assets/images/splash-icon.png'),
};

const PROTOCOL_GRADIENTS: Record<string, readonly [string, string, string]> = {
  'injury-recovery-stack': ['rgba(180,30,30,0.3)', 'transparent', 'rgba(0,0,0,0.85)'],
  'gh-optimizer': ['rgba(20,60,160,0.3)', 'transparent', 'rgba(0,0,0,0.85)'],
  'cognitive-edge': ['rgba(100,40,200,0.3)', 'transparent', 'rgba(0,0,0,0.85)'],
  'longevity-protocol': ['rgba(10,100,90,0.3)', 'transparent', 'rgba(0,0,0,0.85)'],
  'body-recomp': ['rgba(180,60,10,0.3)', 'transparent', 'rgba(0,0,0,0.85)'],
  'elite-recovery': ['rgba(20,120,50,0.3)', 'transparent', 'rgba(0,0,0,0.85)'],
  'gut-reset': ['rgba(60,50,200,0.3)', 'transparent', 'rgba(0,0,0,0.85)'],
};

// Day labels Mon-Sun
const DAY_LABELS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

function getDayLabel(date: Date) {
  const d = date.getDay(); // 0=Sun
  return DAY_LABELS[d === 0 ? 6 : d - 1];
}

export default function HomeScreen() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const weekDates = useMemo(() => {
    const today = startOfDay(new Date());
    return Array.from({ length: 7 }, (_, i) => addDays(today, i - 3));
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Scrollable content — flows BEHIND the header */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        scrollEventThrottle={16}
      >
        {/* Top spacer for header + calendar */}
        <View style={{ height: 160 }} />

        {/* Protocol cards feed */}
        {PROTOCOLS.map((protocol) => {
          const gradient = PROTOCOL_GRADIENTS[protocol.id] ?? ['rgba(0,0,0,0.3)', 'transparent', 'rgba(0,0,0,0.85)'];
          const participantDisplay = protocol.participantCount >= 1000
            ? `${(protocol.participantCount / 1000).toFixed(1)}k`
            : `${protocol.participantCount}`;

          return (
            <TouchableOpacity
              key={protocol.id}
              style={styles.card}
              onPress={() => router.push({ pathname: '/protocol/[id]', params: { id: protocol.id } })}
              activeOpacity={0.92}
            >
              <ImageBackground
                source={PROTOCOL_IMAGES[protocol.id] ?? require('../../assets/images/splash-icon.png')}
                style={styles.cardImage}
                imageStyle={styles.cardImageStyle}
                resizeMode="cover"
              >
                {/* Tri-stop gradient: tinted top, clear middle, dark bottom */}
                <LinearGradient
                  colors={gradient}
                  locations={[0, 0.35, 1]}
                  style={StyleSheet.absoluteFill}
                />

                {/* Participant badge top-right */}
                <View style={styles.participantBadge}>
                  <Users size={11} color="rgba(255,255,255,0.85)" />
                  <Text style={styles.participantText}>{participantDisplay} on this</Text>
                </View>

                {/* Bottom content */}
                <View style={styles.cardBottom}>
                  <Text style={styles.cardTitle}>{protocol.name}</Text>
                  <Text style={styles.cardMeta}>
                    {protocol.durationLabel} · {protocol.peptideIds.slice(0, 3).map(id => id.toUpperCase().replace(/-/g, '-')).join(' · ')}
                  </Text>
                </View>
              </ImageBackground>
            </TouchableOpacity>
          );
        })}

        {/* Discord card */}
        <TouchableOpacity
          style={styles.discordCard}
          onPress={() => Linking.openURL(DISCORD_URL)}
          activeOpacity={0.88}
        >
          <LinearGradient colors={['#3A3A6A', '#2A2A5A']} style={styles.discordGradient}>
            <View style={styles.discordLeft}>
              <View style={styles.discordIcon}>
                <View style={styles.discordInner} />
              </View>
              <View>
                <Text style={styles.discordTitle}>Join our community</Text>
                <Text style={styles.discordSub}>Ask experts on Discord — free</Text>
              </View>
            </View>
            <View style={styles.discordArrow}>
              <Text style={styles.discordArrowText}>→</Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* ── GLASSMORPHISM HEADER (absolute, floats over scroll) ── */}
      <View style={styles.glassHeader} pointerEvents="box-none">
        {Platform.OS === 'ios' ? (
          <BlurView intensity={60} tint="dark" style={StyleSheet.absoluteFill} />
        ) : (
          <View style={[StyleSheet.absoluteFill, styles.androidGlassBg]} />
        )}
        {/* Header row */}
        <View style={styles.headerRow}>
          <TouchableOpacity
            onPress={() => router.push('/account/account')}
            style={styles.avatarBtn}
          >
            <User size={15} color="rgba(255,255,255,0.7)" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Welcome</Text>

          <View style={styles.headerIcons}>
            <TouchableOpacity style={styles.headerIconBtn}>
              <Activity size={19} color="rgba(255,255,255,0.65)" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerIconBtn}>
              <BookOpen size={19} color="rgba(255,255,255,0.65)" />
            </TouchableOpacity>
          </View>
        </View>

        {/* ── GLASSMORPHISM CALENDAR STRIP ── */}
        <View style={styles.calendarRow}>
          {weekDates.map((date, i) => {
            const isSelected = isSameDay(date, selectedDate);
            const isToday = isSameDay(date, new Date());
            return (
              <TouchableOpacity
                key={i}
                style={styles.dayCol}
                onPress={() => setSelectedDate(date)}
                activeOpacity={0.75}
              >
                <Text style={[styles.dayAbbr, isSelected && styles.dayAbbrSelected]}>
                  {getDayLabel(date)}
                </Text>
                <View style={[
                  styles.dateCircle,
                  isSelected && styles.dateCircleSelected,
                  isToday && !isSelected && styles.dateCircleToday,
                ]}>
                  <Text style={[styles.dateNum, isSelected && styles.dateNumSelected]}>
                    {date.getDate()}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.base },

  scrollContent: {
    paddingHorizontal: Spacing.lg,
  },

  // ── Protocol cards ──────────────────────────────────────────
  card: {
    borderRadius: Radii.xl,
    overflow: 'hidden',
    marginBottom: Spacing.md,
    height: 260,
  },
  cardImage: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: Colors.surfaceElevated, // fallback while image loads
  },
  cardImageStyle: {
    borderRadius: Radii.xl,
    opacity: 0.85,
  },
  participantBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-end',
    margin: Spacing.md,
    backgroundColor: 'rgba(0,0,0,0.45)',
    borderRadius: Radii.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  participantText: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: Typography.xs,
    fontWeight: FontWeight.medium,
  },
  cardBottom: {
    padding: Spacing.lg,
    paddingTop: Spacing.xl,
  },
  cardTitle: {
    color: '#FFFFFF',
    fontSize: Typography.xl,
    fontWeight: FontWeight.extrabold,
    marginBottom: 5,
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  cardMeta: {
    color: 'rgba(255,255,255,0.65)',
    fontSize: Typography.sm,
    fontWeight: FontWeight.medium,
  },

  // ── Discord card ──────────────────────────────────────────
  discordCard: {
    borderRadius: Radii.xl,
    overflow: 'hidden',
    marginBottom: Spacing.md,
  },
  discordGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.lg,
  },
  discordLeft: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  discordIcon: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(88,101,242,0.4)',
    alignItems: 'center', justifyContent: 'center',
  },
  discordInner: { width: 22, height: 16, backgroundColor: '#5865F2', borderRadius: 4 },
  discordTitle: { color: '#fff', fontSize: Typography.base, fontWeight: FontWeight.bold },
  discordSub: { color: 'rgba(255,255,255,0.55)', fontSize: Typography.xs, marginTop: 2 },
  discordArrow: { opacity: 0.5 },
  discordArrowText: { color: '#fff', fontSize: Typography.lg },

  // ── Glass header ──────────────────────────────────────────
  glassHeader: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    paddingTop: 50,
    paddingBottom: 12,
    // Glass border at the bottom
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)',
    overflow: 'hidden',
  },
  androidGlassBg: {
    backgroundColor: 'rgba(18,19,42,0.82)',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    marginBottom: 14,
  },
  avatarBtn: {
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center', justifyContent: 'center',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: Typography.md,
    fontWeight: FontWeight.semibold,
    letterSpacing: 0.2,
  },
  headerIcons: { flexDirection: 'row', gap: 6 },
  headerIconBtn: {
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center', justifyContent: 'center',
  },

  // ── Calendar strip ──────────────────────────────────────
  calendarRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: Spacing.md,
  },
  dayCol: {
    alignItems: 'center',
    gap: 5,
  },
  dayAbbr: {
    fontSize: 9,
    color: 'rgba(255,255,255,0.4)',
    fontWeight: FontWeight.semibold,
    letterSpacing: 0.5,
  },
  dayAbbrSelected: {
    color: Colors.primaryOrange,
  },
  dateCircle: {
    width: 30, height: 30, borderRadius: 15,
    alignItems: 'center', justifyContent: 'center',
  },
  dateCircleSelected: {
    backgroundColor: Colors.primaryOrange,
  },
  dateCircleToday: {
    borderWidth: 1.5,
    borderColor: Colors.primaryOrange,
  },
  dateNum: {
    fontSize: Typography.sm,
    color: 'rgba(255,255,255,0.75)',
    fontWeight: FontWeight.semibold,
  },
  dateNumSelected: {
    color: '#fff',
    fontWeight: FontWeight.extrabold,
  },
});
