import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Dimensions, ImageBackground, Platform, Animated,
} from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { BlurView } from 'expo-blur';
import { Activity, User, Users, ChevronRight, FlaskConical, Plus, Compass } from 'lucide-react-native';
import { useState, useMemo, useRef, useEffect } from 'react';
import { addDays, startOfDay, isSameDay, differenceInDays, format } from 'date-fns';
import { LinearGradient } from 'expo-linear-gradient';
import * as Linking from 'expo-linking';
import { PROTOCOLS } from '../../data/protocols';
import { getProtocolById } from '../../data/protocols';
import { getPeptideById } from '../../data/peptides';
import { useProtocolStore } from '../../store/useProtocolStore';
import { useScheduleStore } from '../../store/useScheduleStore';
import { useUserStore } from '../../store/useUserStore';
import { Colors, Radii, Typography, FontWeight, Spacing } from '../../constants/theme';

const { width: W, height: H } = Dimensions.get('window');
const DISCORD_URL = 'https://discord.gg/peptideapp';
const DAY_LABELS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

function getDayLabel(date: Date) {
  const d = date.getDay();
  return DAY_LABELS[d === 0 ? 6 : d - 1];
}

function getCategoryColor(cat: string): string {
  const map: Record<string, string> = {
    'Recovery & Healing': '#EF4444', 'Fat Loss': '#F97316',
    'Muscle & Performance': '#3B82F6', 'Cognitive & Neuroprotection': '#8B5CF6',
    'Sleep & Longevity': '#6366F1', 'Skin & Aesthetics': '#EC4899', 'GI & Gut Health': '#22C55E',
  };
  return map[cat] ?? Colors.primaryOrange;
}

// Cycle through the 4 random background images for protocol cards
const CARD_IMAGES = [
  require('../../assets/images/random1.jpeg'),
  require('../../assets/images/random2.jpg'),
  require('../../assets/images/random3.jpg'),
  require('../../assets/images/random4.jpg'),
];
function getCardImage(index: number) {
  return CARD_IMAGES[index % CARD_IMAGES.length];
}

export default function HomeScreen() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [justActivatedId, setJustActivatedId] = useState<string | null>(null);
  const toastAnim = useRef(new Animated.Value(0)).current;
  const { myProtocols } = useProtocolStore();
  const { scheduledPeptides } = useScheduleStore();
  const { user } = useUserStore();

  const weekDates = useMemo(() => {
    const today = startOfDay(new Date());
    return Array.from({ length: 7 }, (_, i) => addDays(today, i - 3));
  }, []);

  const activeProtocols = myProtocols.filter((p) => {
    const dayOn = differenceInDays(new Date(), new Date(p.startedAt)) + 1;
    return dayOn <= p.durationDays;
  });

  const hasActiveData = activeProtocols.length > 0 || scheduledPeptides.length > 0;
  const greeting = user?.displayName
    ? `Hey, ${user.displayName.split(' ')[0]}`
    : 'Welcome';

  // Show toast when a protocol was just activated (passed via navigation params or store change)
  useEffect(() => {
    if (myProtocols.length > 0) {
      const newest = myProtocols[0];
      const secondsOld = (Date.now() - new Date(newest.startedAt).getTime()) / 1000;
      if (secondsOld < 5) {
        setJustActivatedId(newest.id);
        Animated.sequence([
          Animated.timing(toastAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
          Animated.delay(2500),
          Animated.timing(toastAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
        ]).start(() => setJustActivatedId(null));
      }
    }
  }, [myProtocols.length]);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Full-screen background image */}
      <ImageBackground
        source={require('../../assets/images/mainpagebackground.jpg')}
        style={styles.heroBg}
        imageStyle={styles.heroBgImage}
        resizeMode="cover"
      >
        <LinearGradient
          colors={['rgba(18,19,42,0.0)', 'rgba(18,19,42,0.15)', 'rgba(18,19,42,0.75)', 'rgba(18,19,42,0.98)']}
          locations={[0, 0.28, 0.58, 0.78]}
          style={StyleSheet.absoluteFill}
        />
      </ImageBackground>

      {/* ── TOAST NOTIFICATION ── */}
      {justActivatedId && (
        <Animated.View style={[styles.toast, { opacity: toastAnim, transform: [{ translateY: toastAnim.interpolate({ inputRange: [0, 1], outputRange: [-20, 0] }) }] }]}>
          <View style={styles.toastDot} />
          <Text style={styles.toastText}>
            {getProtocolById(justActivatedId)?.name ?? 'Protocol'} activated!
          </Text>
        </Animated.View>
      )}

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        scrollEventThrottle={16}
      >
        <View style={{ height: 170 }} />

        {/* ── MODE A: TRACKER (user has active protocols/peptides) ── */}
        {hasActiveData ? (
          <>
            {/* Active protocols — full detail cards */}
            {activeProtocols.length > 0 && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Active Protocols</Text>
                  <TouchableOpacity onPress={() => router.push('/account/my-protocols' as any)} style={styles.seeAllBtn}>
                    <Text style={styles.seeAllText}>Manage</Text>
                    <ChevronRight size={12} color={Colors.primaryOrange} />
                  </TouchableOpacity>
                </View>
                {activeProtocols.map((protocol, index) => {
                  const dayOn = differenceInDays(new Date(), new Date(protocol.startedAt)) + 1;
                  const pct = Math.round(Math.min(dayOn / protocol.durationDays, 1) * 100);
                  const daysLeft = Math.max(0, protocol.durationDays - dayOn);
                  const catalog = getProtocolById(protocol.id);
                  return (
                    <TouchableOpacity
                      key={protocol.id}
                      style={styles.activeProtocolCard}
                      onPress={() => router.push({ pathname: '/protocol/active-detail', params: { id: protocol.id } })}
                      activeOpacity={0.88}
                    >
                      {/* Background image */}
                      <ImageBackground
                        source={getCardImage(index)}
                        style={StyleSheet.absoluteFill}
                        imageStyle={styles.cardBgImage}
                        resizeMode="cover"
                      />
                      {/* Dark gradient overlay */}
                      <LinearGradient
                        colors={['rgba(10,10,25,0.35)', 'rgba(10,10,25,0.88)']}
                        style={[StyleSheet.absoluteFill, { borderRadius: Radii.xl }]}
                      />
                      <View style={styles.activeProtocolInner}>
                        {/* Header */}
                        <View style={styles.activeProtocolHeader}>
                          <View style={styles.activeChip}>
                            <View style={styles.activeDot} />
                            <Text style={styles.activeChipText}>ACTIVE</Text>
                          </View>
                          <Text style={styles.daysLeftText}>{daysLeft > 0 ? `${daysLeft}d left` : 'Last day!'}</Text>
                        </View>
                        <Text style={styles.activeProtocolName}>{protocol.name}</Text>
                        <Text style={styles.activeProtocolSub}>Day {dayOn} of {protocol.durationDays} · {pct}% complete</Text>
                        {/* Progress bar */}
                        <View style={styles.progressBg}>
                          <View style={[styles.progressFill, { width: `${pct}%` as any }]} />
                        </View>
                        {/* Dosing schedule rows */}
                        {catalog && (
                          <View style={styles.scheduleRows}>
                            {catalog.schedule.slice(0, 3).map((entry, i) => {
                              const p = getPeptideById(entry.peptideId);
                              return (
                                <View key={i} style={styles.scheduleEntry}>
                                  <View style={[styles.scheduleEntryDot, { backgroundColor: getCategoryColor(p?.category ?? '') }]} />
                                  <Text style={styles.scheduleEntryText}>
                                    {p?.name ?? entry.peptideId} — {entry.dose}{entry.unit}
                                    {entry.timing ? ` · ${entry.timing}` : ''}
                                  </Text>
                                </View>
                              );
                            })}
                          </View>
                        )}
                        {/* Peptide chips */}
                        {catalog && (
                          <View style={styles.chipRow}>
                            {catalog.peptideIds.slice(0, 4).map((pid) => {
                              const p = getPeptideById(pid);
                              return (
                                <View key={pid} style={styles.chip}>
                                  <Text style={styles.chipText}>{p?.name ?? pid}</Text>
                                </View>
                              );
                            })}
                          </View>
                        )}
                        <View style={styles.viewStatsRow}>
                          <Text style={styles.viewStatsText}>Tap to view progress & stats</Text>
                          <ChevronRight size={12} color={Colors.primaryOrange} />
                        </View>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}

            {/* Active peptides */}
            {scheduledPeptides.length > 0 && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Active Peptides</Text>
                  <TouchableOpacity onPress={() => router.push('/account/stats' as any)} style={styles.seeAllBtn}>
                    <Text style={styles.seeAllText}>See all</Text>
                    <ChevronRight size={12} color={Colors.primaryOrange} />
                  </TouchableOpacity>
                </View>
                {scheduledPeptides.slice(0, 4).map((sp) => {
                  const peptide = getPeptideById(sp.peptideId);
                  const endDate = sp.runIndefinitely ? null : sp.endDate;
                  const totalDays = endDate ? differenceInDays(new Date(endDate), new Date(sp.startDate)) : null;
                  const dayOn = differenceInDays(new Date(), new Date(sp.startDate)) + 1;
                  const pct = totalDays ? Math.round(Math.min(dayOn / totalDays, 1) * 100) : null;
                  return (
                    <TouchableOpacity
                      key={sp.id}
                      style={styles.peptideCard}
                      onPress={() => router.push({ pathname: '/peptide/[id]', params: { id: sp.peptideId } })}
                      activeOpacity={0.85}
                    >
                      {Platform.OS === 'ios' ? (
                        <BlurView intensity={25} tint="light" style={[StyleSheet.absoluteFill, { borderRadius: Radii.lg }]} />
                      ) : (
                        <View style={[StyleSheet.absoluteFill, { borderRadius: Radii.lg, backgroundColor: 'rgba(255,255,255,0.07)' }]} />
                      )}
                      <View style={styles.peptideCardInner}>
                        <View style={[styles.peptideAvatar, { backgroundColor: getCategoryColor(peptide?.category ?? '') }]}>
                          <Text style={styles.peptideAvatarLetter}>{(peptide?.name ?? sp.peptideId)[0]}</Text>
                        </View>
                        <View style={styles.peptideInfo}>
                          <Text style={styles.peptideName}>{peptide?.name ?? sp.peptideId}</Text>
                          <Text style={styles.peptideMeta}>{sp.dose} {sp.unit} · {sp.times.join(', ')}</Text>
                          {endDate && <Text style={styles.peptideUntil}>Until {format(new Date(endDate), 'MMM d')}</Text>}
                          {pct != null && (
                            <View style={[styles.progressBg, { marginTop: 5, height: 3 }]}>
                              <View style={[styles.progressFillTeal, { width: `${pct}%` as any }]} />
                            </View>
                          )}
                        </View>
                        <ChevronRight size={14} color={Colors.textTertiary} />
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}

            {/* Add more CTA */}
            <TouchableOpacity
              style={styles.addMoreBtn}
              onPress={() => router.push('/(tabs)/explore' as any)}
              activeOpacity={0.85}
            >
              {Platform.OS === 'ios' ? (
                <BlurView intensity={25} tint="light" style={[StyleSheet.absoluteFill, { borderRadius: Radii.xl }]} />
              ) : (
                <View style={[StyleSheet.absoluteFill, { borderRadius: Radii.xl, backgroundColor: 'rgba(255,255,255,0.07)' }]} />
              )}
              <Compass size={18} color={Colors.primaryOrange} />
              <Text style={styles.addMoreText}>Explore more protocols</Text>
              <ChevronRight size={14} color={Colors.primaryOrange} />
            </TouchableOpacity>
          </>
        ) : (
          /* ── MODE B: EXPLORE (new user, nothing active) ── */
          <>
            <Text style={styles.feedLabel}>EXPLORE PROTOCOLS</Text>
            {PROTOCOLS.map((protocol, index) => {
              const participantDisplay = protocol.participantCount >= 1000
                ? `${(protocol.participantCount / 1000).toFixed(1)}k`
                : `${protocol.participantCount}`;
              return (
                <TouchableOpacity
                  key={protocol.id}
                  style={styles.exploreCard}
                  onPress={() => router.push({ pathname: '/protocol/[id]', params: { id: protocol.id } })}
                  activeOpacity={0.92}
                >
                  <ImageBackground
                    source={getCardImage(index)}
                    style={StyleSheet.absoluteFill}
                    imageStyle={styles.cardBgImage}
                    resizeMode="cover"
                  />
                  {/* Dark gradient so text is always readable */}
                  <LinearGradient
                    colors={['rgba(10,10,25,0.45)', 'rgba(10,10,25,0.82)']}
                    style={[StyleSheet.absoluteFill, { borderRadius: Radii.xl }]}
                  />
                  <View style={styles.exploreCardInner}>
                    <View style={styles.exploreCardLeft}>
                      <Text style={styles.exploreCardTitle}>{protocol.name}</Text>
                      <Text style={styles.exploreCardSub}>{protocol.subtitle}</Text>
                      <View style={styles.cardBadgeRow}>
                        <View style={styles.cardBadge}>
                          <Text style={styles.cardBadgeText}>{protocol.durationLabel}</Text>
                        </View>
                        <View style={styles.cardBadge}>
                          <Users size={10} color="rgba(255,255,255,0.65)" />
                          <Text style={styles.cardBadgeText}>{participantDisplay}</Text>
                        </View>
                      </View>
                    </View>
                    <View style={styles.exploreCardRight}>
                      {protocol.peptideIds.slice(0, 3).map((pid) => {
                        const p = getPeptideById(pid);
                        return (
                          <View key={pid} style={styles.peptidePill}>
                            <Text style={styles.peptidePillText}>{p?.name ?? pid}</Text>
                          </View>
                        );
                      })}
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}

            <TouchableOpacity
              style={styles.discordCard}
              onPress={() => Linking.openURL(DISCORD_URL)}
              activeOpacity={0.88}
            >
              {Platform.OS === 'ios' ? (
                <BlurView intensity={35} tint="light" style={[StyleSheet.absoluteFill, { borderRadius: Radii.xl }]} />
              ) : (
                <View style={[StyleSheet.absoluteFill, { borderRadius: Radii.xl, backgroundColor: 'rgba(255,255,255,0.07)' }]} />
              )}
              <View style={styles.discordInner}>
                <View style={styles.discordIconBg}><View style={styles.discordShape} /></View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.discordTitle}>Join the Community</Text>
                  <Text style={styles.discordSub}>Ask experts on Discord — free</Text>
                </View>
                <Text style={styles.discordArrow}>→</Text>
              </View>
            </TouchableOpacity>
          </>
        )}

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* ── GLASS HEADER ── */}
      <View style={styles.glassHeader} pointerEvents="box-none">
        {Platform.OS === 'ios' ? (
          <BlurView intensity={28} tint="light" style={StyleSheet.absoluteFill} />
        ) : (
          <View style={[StyleSheet.absoluteFill, styles.androidGlassBg]} />
        )}
        <View style={styles.headerBorderLine} />
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.push('/account/account')} style={styles.avatarBtn}>
            <User size={14} color="rgba(255,255,255,0.75)" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{greeting}</Text>
          <TouchableOpacity style={styles.headerIconBtn} onPress={() => router.push('/account/stats')}>
            <Activity size={18} color="rgba(255,255,255,0.65)" />
          </TouchableOpacity>
        </View>
        {/* Calendar strip */}
        <View style={styles.calendarRow}>
          {weekDates.map((date, i) => {
            const isSelected = isSameDay(date, selectedDate);
            const isToday = isSameDay(date, new Date());
            return (
              <TouchableOpacity key={i} style={styles.dayCol} onPress={() => setSelectedDate(date)} activeOpacity={0.75}>
                <Text style={[styles.dayAbbr, isSelected && styles.dayAbbrSelected]}>{getDayLabel(date)}</Text>
                <View style={[styles.dateCircle, isSelected && styles.dateCircleSelected, isToday && !isSelected && styles.dateCircleToday]}>
                  <Text style={[styles.dateNum, isSelected && styles.dateNumSelected]}>{date.getDate()}</Text>
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
  heroBg: { position: 'absolute', top: 0, left: 0, right: 0, height: H },
  heroBgImage: { width: '100%', height: '100%' },
  scrollContent: { paddingHorizontal: Spacing.lg },

  // Toast
  toast: {
    position: 'absolute', top: 110, alignSelf: 'center', zIndex: 100,
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: 'rgba(46,204,113,0.9)', borderRadius: Radii.full,
    paddingHorizontal: Spacing.lg, paddingVertical: 10,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8,
  },
  toastDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#fff' },
  toastText: { color: '#fff', fontSize: Typography.sm, fontWeight: FontWeight.bold },

  // Sections
  section: { marginBottom: Spacing.xl },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.md },
  sectionTitle: { color: '#fff', fontSize: Typography.md, fontWeight: FontWeight.extrabold },
  seeAllBtn: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  seeAllText: { color: Colors.primaryOrange, fontSize: Typography.xs, fontWeight: FontWeight.semibold },

  // Active protocol cards (tracker mode)
  activeProtocolCard: {
    borderRadius: Radii.xl, overflow: 'hidden', marginBottom: Spacing.md,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)', minHeight: 180,
  },
  cardBgImage: { borderRadius: Radii.xl, opacity: 0.65 },
  activeProtocolInner: { padding: Spacing.md, gap: 8 },
  activeProtocolHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  activeChip: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(46,204,113,0.15)', borderRadius: Radii.full, paddingHorizontal: 7, paddingVertical: 3 },
  activeDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: Colors.accentGreen },
  activeChipText: { color: Colors.accentGreen, fontSize: 9, fontWeight: FontWeight.bold, letterSpacing: 0.8 },
  daysLeftText: { color: Colors.textTertiary, fontSize: Typography.xs },
  activeProtocolName: { color: '#fff', fontSize: Typography.md, fontWeight: FontWeight.extrabold },
  activeProtocolSub: { color: 'rgba(255,255,255,0.5)', fontSize: Typography.xs },
  progressBg: { height: 6, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: Colors.primaryOrange, borderRadius: 3 },
  progressFillTeal: { height: '100%', backgroundColor: Colors.accentTeal, borderRadius: 3 },
  scheduleRows: { gap: 4 },
  scheduleEntry: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  scheduleEntryDot: { width: 6, height: 6, borderRadius: 3 },
  scheduleEntryText: { color: 'rgba(255,255,255,0.55)', fontSize: Typography.xs, flex: 1 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 5 },
  chip: { backgroundColor: Colors.primaryOrangeLight, borderRadius: Radii.full, paddingHorizontal: 8, paddingVertical: 3 },
  chipText: { color: Colors.primaryOrange, fontSize: 10, fontWeight: FontWeight.semibold },
  viewStatsRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  viewStatsText: { color: Colors.primaryOrange, fontSize: Typography.xs, fontWeight: FontWeight.medium },

  // Active peptide cards
  peptideCard: { borderRadius: Radii.lg, overflow: 'hidden', marginBottom: Spacing.sm, borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)' },
  peptideCardInner: { flexDirection: 'row', alignItems: 'center', padding: Spacing.md, gap: Spacing.md },
  peptideAvatar: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  peptideAvatarLetter: { color: '#fff', fontSize: Typography.base, fontWeight: FontWeight.bold },
  peptideInfo: { flex: 1 },
  peptideName: { color: '#fff', fontSize: Typography.base, fontWeight: FontWeight.semibold },
  peptideMeta: { color: 'rgba(255,255,255,0.5)', fontSize: Typography.xs, marginTop: 2 },
  peptideUntil: { color: 'rgba(255,255,255,0.35)', fontSize: 10, marginTop: 1 },

  // Add more button
  addMoreBtn: { borderRadius: Radii.xl, overflow: 'hidden', marginBottom: Spacing.xl, borderWidth: 1, borderColor: 'rgba(232,98,42,0.25)', flexDirection: 'row', alignItems: 'center', padding: Spacing.md, gap: Spacing.sm },
  addMoreText: { flex: 1, color: Colors.primaryOrange, fontSize: Typography.base, fontWeight: FontWeight.semibold },

  // Explore mode cards
  feedLabel: { color: Colors.textTertiary, fontSize: Typography.xs, fontWeight: FontWeight.semibold, letterSpacing: 1.5, marginBottom: Spacing.md },
  exploreCard: { borderRadius: Radii.xl, overflow: 'hidden', marginBottom: Spacing.md, borderWidth: 1, borderColor: 'rgba(255,255,255,0.18)', minHeight: 120 },
  exploreCardInner: { flexDirection: 'row', padding: Spacing.md, gap: Spacing.md },
  exploreCardLeft: { flex: 1, gap: 5 },
  exploreCardTitle: { color: '#fff', fontSize: Typography.base, fontWeight: FontWeight.extrabold, lineHeight: 20 },
  exploreCardSub: { color: 'rgba(255,255,255,0.6)', fontSize: Typography.xs, lineHeight: 16 },
  cardBadgeRow: { flexDirection: 'row', gap: 5, flexWrap: 'wrap' },
  cardBadge: { flexDirection: 'row', alignItems: 'center', gap: 3, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: Radii.full, paddingHorizontal: 7, paddingVertical: 3 },
  cardBadgeText: { color: 'rgba(255,255,255,0.85)', fontSize: 10, fontWeight: FontWeight.medium },
  exploreCardRight: { gap: 5, alignItems: 'flex-end', justifyContent: 'center' },
  peptidePill: { backgroundColor: Colors.primaryOrangeLight, borderRadius: Radii.full, paddingHorizontal: 8, paddingVertical: 3 },
  peptidePillText: { color: Colors.primaryOrange, fontSize: 10, fontWeight: FontWeight.semibold },

  // Discord
  discordCard: { borderRadius: Radii.xl, overflow: 'hidden', marginBottom: Spacing.md, borderWidth: 1, borderColor: 'rgba(88,101,242,0.3)' },
  discordInner: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, padding: Spacing.md },
  discordIconBg: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(88,101,242,0.25)', alignItems: 'center', justifyContent: 'center' },
  discordShape: { width: 22, height: 16, backgroundColor: '#5865F2', borderRadius: 4 },
  discordTitle: { color: '#fff', fontSize: Typography.base, fontWeight: FontWeight.bold },
  discordSub: { color: 'rgba(255,255,255,0.5)', fontSize: Typography.xs, marginTop: 2 },
  discordArrow: { color: 'rgba(255,255,255,0.4)', fontSize: Typography.lg },

  // Glass header
  glassHeader: { position: 'absolute', top: 0, left: 0, right: 0, paddingTop: 50, paddingBottom: 12, overflow: 'hidden' },
  headerBorderLine: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 1, backgroundColor: 'rgba(255,255,255,0.12)' },
  androidGlassBg: { backgroundColor: 'rgba(255,255,255,0.08)' },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.lg, marginBottom: 14 },
  avatarBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.1)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { color: '#fff', fontSize: Typography.md, fontWeight: FontWeight.semibold, letterSpacing: 0.2 },
  headerIconBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.08)', alignItems: 'center', justifyContent: 'center' },
  calendarRow: { flexDirection: 'row', justifyContent: 'space-around', paddingHorizontal: Spacing.md },
  dayCol: { alignItems: 'center', gap: 5 },
  dayAbbr: { fontSize: 9, color: 'rgba(255,255,255,0.35)', fontWeight: FontWeight.semibold, letterSpacing: 0.5 },
  dayAbbrSelected: { color: Colors.primaryOrange },
  dateCircle: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  dateCircleSelected: { backgroundColor: Colors.primaryOrange },
  dateCircleToday: { borderWidth: 1.5, borderColor: Colors.primaryOrange },
  dateNum: { fontSize: Typography.sm, color: 'rgba(255,255,255,0.7)', fontWeight: FontWeight.semibold },
  dateNumSelected: { color: '#fff', fontWeight: FontWeight.extrabold },
});
