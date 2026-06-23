import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  ImageBackground,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ChevronLeft, X, Users, Clock, Zap, DollarSign, ChevronRight, ChevronDown } from 'lucide-react-native';
import { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import ScreenBackground from '../../components/ScreenBackground';
import { getProtocolById } from '../../data/protocols';
import { getPeptideById } from '../../data/peptides';
import { useProtocolStore } from '../../store/useProtocolStore';
import { Colors, Radii, Typography, FontWeight, Spacing } from '../../constants/theme';

// Deterministic hero image per protocol
const CARD_IMAGES = [
  require('../../assets/images/random1.jpeg'),
  require('../../assets/images/random2.jpg'),
  require('../../assets/images/random3.jpg'),
  require('../../assets/images/random4.jpg'),
];
const PROTOCOL_IMAGE_INDEX: Record<string, number> = {
  'injury-recovery-stack': 0,
  'gh-optimizer': 1,
  'cognitive-edge': 2,
  'longevity-protocol': 3,
  'body-recomp': 0,
  'elite-recovery': 1,
  'gut-reset': 2,
};

export default function ProtocolDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const protocol = getProtocolById(id);
  const { startProtocol } = useProtocolStore();
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const imgIndex = PROTOCOL_IMAGE_INDEX[id ?? ''] ?? (id ? id.charCodeAt(0) % 4 : 0);

  if (!protocol) return (
    <ScreenBackground>
      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <ChevronLeft size={22} color={Colors.textPrimary} />
      </TouchableOpacity>
      <Text style={styles.notFound}>Protocol not found</Text>
    </ScreenBackground>
  );

  const difficulty = (protocol as any).difficulty ?? 'Intermediate';
  const frequencyLabel = (protocol as any).frequencyLabel ?? 'Daily';
  const estimatedWeeklyCost = (protocol as any).estimatedWeeklyCost ?? '~$80/wk';
  const whoIsThisFor: string[] = (protocol as any).whoIsThisFor ?? [
    'Adults aged 25–65 looking for results', 'People who have tried other approaches',
    'Committed to a 8+ week protocol',
  ];
  const importantToKnow: string[] = (protocol as any).importantToKnow ?? [
    'Medical supervision recommended', 'Sourcing and sterility matter',
    'Do not use if pregnant or nursing',
  ];
  const faq: { question: string; answer: string }[] = (protocol as any).faq ?? [
    { question: 'How should I store these peptides?', answer: 'Store unreconstituted peptides in the freezer. Once reconstituted, refrigerate and use within 28 days.' },
    { question: 'Can I stack this with other peptides?', answer: 'Always consult with a healthcare provider before combining peptides.' },
  ];

  return (
    <ScreenBackground bottomOpacity={0.97}>
      <StatusBar style="light" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Hero — random image with gradient overlay */}
        <ImageBackground
          source={CARD_IMAGES[imgIndex]}
          style={styles.hero}
          imageStyle={styles.heroImage}
          resizeMode="cover"
        >
          <LinearGradient
            colors={['rgba(10,10,25,0.35)', 'rgba(10,10,25,0.80)']}
            style={StyleSheet.absoluteFill}
          />
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <ChevronLeft size={22} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.closeBtn} onPress={() => router.back()}>
            <X size={18} color="#fff" />
          </TouchableOpacity>

          <View style={styles.heroContent}>
            <Text style={styles.heroTitle}>{protocol.name}</Text>
            <Text style={styles.heroSub}>{protocol.subtitle}</Text>
            <View style={styles.heroBadgeRow}>
              <View style={styles.heroBadge}>
                <Text style={styles.heroBadgeText}>{protocol.peptideIds.length} Peptides</Text>
              </View>
              <View style={styles.heroBadge}>
                <Text style={styles.heroBadgeText}>{protocol.durationLabel}</Text>
              </View>
              <View style={styles.heroBadge}>
                <Users size={10} color="rgba(255,255,255,0.8)" />
                <Text style={styles.heroBadgeText}>{protocol.participantCount.toLocaleString()} started</Text>
              </View>
            </View>
          </View>
        </ImageBackground>

        {/* At a Glance */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>AT A GLANCE</Text>
          <View style={styles.statsGrid}>
            <StatTile icon={<Zap size={16} color={Colors.primaryOrange} />} label="Difficulty" value={difficulty} />
            <StatTile icon={<Clock size={16} color={Colors.primaryOrange} />} label="Duration" value={protocol.durationLabel} />
            <StatTile icon={<Clock size={16} color={Colors.primaryOrange} />} label="Frequency" value={frequencyLabel} />
            <StatTile icon={<DollarSign size={16} color={Colors.primaryOrange} />} label="Est. Cost" value={estimatedWeeklyCost} />
          </View>
        </View>

        {/* Who is this for */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>WHO IS THIS FOR?</Text>
          {whoIsThisFor.map((item, i) => (
            <View key={i} style={styles.bulletRow}>
              <View style={styles.bullet} />
              <Text style={styles.bulletText}>{item}</Text>
            </View>
          ))}
        </View>

        {/* Why this stack */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>WHY THIS STACK?</Text>
          {protocol.peptideIds.map((pid) => {
            const peptide = getPeptideById(pid);
            if (!peptide) return null;
            return (
              <TouchableOpacity
                key={pid}
                style={styles.peptideRow}
                onPress={() => router.push({ pathname: '/peptide/[id]', params: { id: pid } })}
                activeOpacity={0.7}
              >
                <View style={[styles.peptideAvatar, { backgroundColor: getCategoryColor(peptide.category) }]}>
                  <Text style={styles.peptideAvatarLetter}>{peptide.name[0]}</Text>
                </View>
                <View style={styles.peptideInfo}>
                  <Text style={styles.peptideName}>{peptide.name}</Text>
                  <Text style={styles.peptideRole}>{peptide.category.toUpperCase()}</Text>
                  <Text style={styles.peptideDesc} numberOfLines={1}>{peptide.description}</Text>
                </View>
                <ChevronRight size={16} color={Colors.textTertiary} />
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Schedule */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>DOSING SCHEDULE</Text>
          {protocol.schedule.map((entry, i) => {
            const peptide = getPeptideById(entry.peptideId);
            return (
              <View key={i} style={styles.scheduleRow}>
                <View style={[styles.scheduleAvatar, { backgroundColor: peptide ? getCategoryColor(peptide.category) : '#999' }]}>
                  <Text style={styles.peptideAvatarLetter}>{peptide?.name[0] ?? '?'}</Text>
                </View>
                <View style={styles.scheduleInfo}>
                  <Text style={styles.scheduleName}>{peptide?.name ?? entry.peptideId}</Text>
                  <Text style={styles.scheduleDose}>{entry.dose} {entry.unit} · {entry.frequency}</Text>
                  {entry.timing && <Text style={styles.scheduleTiming}>{entry.timing}</Text>}
                </View>
              </View>
            );
          })}
        </View>

        {/* Important to know */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>IMPORTANT TO KNOW</Text>
          <View style={styles.cautionCard}>
            {importantToKnow.map((item, i) => (
              <View key={i} style={styles.cautionRow}>
                <Text style={styles.cautionBullet}>⚠</Text>
                <Text style={styles.cautionText}>{item}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* FAQ */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>COMMON QUESTIONS</Text>
          {faq.map((item, i) => (
            <TouchableOpacity
              key={i}
              style={styles.faqRow}
              onPress={() => setExpandedFaq(expandedFaq === i ? null : i)}
              activeOpacity={0.7}
            >
              <Text style={styles.faqQuestion}>{item.question}</Text>
              <ChevronDown
                size={16} color={Colors.textTertiary}
                style={{ transform: [{ rotate: expandedFaq === i ? '180deg' : '0deg' }] }}
              />
              {expandedFaq === i && (
                <Text style={styles.faqAnswer}>{item.answer}</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Sticky CTA */}
      <View style={styles.stickyFooter}>
        <TouchableOpacity
          style={styles.startBtn}
          onPress={async () => {
            await startProtocol(protocol);
            router.replace({ pathname: '/protocol/started', params: { id: protocol.id } });
          }}
          activeOpacity={0.85}
        >
          <Text style={styles.startBtnText}>Start Protocol</Text>
        </TouchableOpacity>
      </View>
    </ScreenBackground>
  );
}

function StatTile({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <View style={statStyles.tile}>
      {icon}
      <Text style={statStyles.label}>{label}</Text>
      <Text style={statStyles.value}>{value}</Text>
    </View>
  );
}

function getCategoryColor(cat: string): string {
  const map: Record<string, string> = {
    'Recovery & Healing': '#EF4444',
    'Fat Loss': '#F97316',
    'Muscle & Performance': '#3B82F6',
    'Cognitive & Neuroprotection': '#8B5CF6',
    'Sleep & Longevity': '#6366F1',
    'Skin & Aesthetics': '#EC4899',
    'GI & Gut Health': '#22C55E',
  };
  return map[cat] ?? '#999';
}

const statStyles = StyleSheet.create({
  tile: {
    flex: 1, minWidth: '45%',
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderRadius: Radii.lg, padding: Spacing.md, gap: 4,
    alignItems: 'flex-start',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
  },
  label: { fontSize: Typography.xs, color: Colors.textTertiary, fontWeight: FontWeight.medium },
  value: { fontSize: Typography.base, color: Colors.textPrimary, fontWeight: FontWeight.bold },
});

const styles = StyleSheet.create({
  notFound: { textAlign: 'center', marginTop: 100, color: Colors.textSecondary },
  scroll: { paddingBottom: 40 },
  hero: {
    paddingTop: 56,
    paddingBottom: Spacing.xl,
    paddingHorizontal: Spacing.lg,
    minHeight: 240,
    justifyContent: 'flex-end',
  },
  heroImage: { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 },
  backBtn: {
    position: 'absolute', top: 52, left: Spacing.lg, zIndex: 10,
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center',
  },
  closeBtn: {
    position: 'absolute', top: 52, right: Spacing.lg, zIndex: 10,
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center',
  },
  heroContent: { paddingTop: 44 },
  heroTitle: { color: '#fff', fontSize: Typography.xxl, fontWeight: FontWeight.extrabold, marginBottom: 6 },
  heroSub: { color: 'rgba(255,255,255,0.65)', fontSize: Typography.sm, marginBottom: Spacing.lg },
  heroBadgeRow: { flexDirection: 'row', gap: Spacing.sm, flexWrap: 'wrap' },
  heroBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: Radii.full,
    paddingHorizontal: Spacing.sm, paddingVertical: 4,
  },
  heroBadgeText: { color: 'rgba(255,255,255,0.85)', fontSize: Typography.xs, fontWeight: FontWeight.medium },
  section: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.xl },
  sectionLabel: {
    fontSize: Typography.xs, color: Colors.textTertiary, fontWeight: FontWeight.semibold,
    letterSpacing: 1.5, marginBottom: Spacing.md,
  },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  bulletRow: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.sm, alignItems: 'flex-start' },
  bullet: {
    width: 6, height: 6, borderRadius: 3,
    backgroundColor: Colors.primaryOrange, marginTop: 7,
  },
  bulletText: { flex: 1, fontSize: Typography.sm, color: Colors.textPrimary, lineHeight: 20 },
  peptideRow: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    backgroundColor: 'rgba(255,255,255,0.07)', borderRadius: Radii.lg, padding: Spacing.md,
    marginBottom: Spacing.sm, borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)',
  },
  peptideAvatar: {
    width: 40, height: 40, borderRadius: 20,
    alignItems: 'center', justifyContent: 'center',
  },
  peptideAvatarLetter: { color: '#fff', fontSize: Typography.md, fontWeight: FontWeight.bold },
  peptideInfo: { flex: 1 },
  peptideName: { fontSize: Typography.base, fontWeight: FontWeight.bold, color: Colors.textPrimary },
  peptideRole: { fontSize: Typography.xs, color: Colors.primaryOrange, fontWeight: FontWeight.semibold, letterSpacing: 0.8 },
  peptideDesc: { fontSize: Typography.xs, color: Colors.textSecondary, marginTop: 2 },
  scheduleRow: {
    flexDirection: 'row', gap: Spacing.md, alignItems: 'center',
    paddingVertical: Spacing.sm, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  scheduleAvatar: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  scheduleInfo: { flex: 1 },
  scheduleName: { fontSize: Typography.base, fontWeight: FontWeight.semibold, color: Colors.textPrimary },
  scheduleDose: { fontSize: Typography.xs, color: Colors.textSecondary, marginTop: 2 },
  scheduleTiming: { fontSize: Typography.xs, color: Colors.textTertiary },
  cautionCard: {
    backgroundColor: 'rgba(243,156,18,0.10)',
    borderRadius: Radii.lg, padding: Spacing.md,
    borderWidth: 1, borderColor: 'rgba(243,156,18,0.3)', gap: Spacing.sm,
  },
  cautionRow: { flexDirection: 'row', gap: Spacing.sm, alignItems: 'flex-start' },
  cautionBullet: { fontSize: Typography.sm, color: '#F39C12' },
  cautionText: { flex: 1, fontSize: Typography.sm, color: Colors.textPrimary, lineHeight: 20 },
  faqRow: {
    paddingVertical: Spacing.md, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.08)',
    flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-start', gap: 8,
  },
  faqQuestion: { flex: 1, fontSize: Typography.base, color: Colors.textPrimary, fontWeight: FontWeight.medium },
  faqAnswer: { width: '100%', fontSize: Typography.sm, color: Colors.textSecondary, marginTop: 8, lineHeight: 20 },
  stickyFooter: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    padding: Spacing.lg, paddingBottom: 36,
    backgroundColor: 'rgba(18,19,42,0.88)',
    borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.1)',
  },
  startBtn: {
    backgroundColor: Colors.primaryOrange, borderRadius: 32, paddingVertical: 18, alignItems: 'center',
  },
  startBtnText: { color: '#fff', fontSize: Typography.base, fontWeight: FontWeight.bold },
});
