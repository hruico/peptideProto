import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Alert,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { X, Clock, Users, ChevronRight, FlaskConical } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import GradientButton from '../../components/ui/GradientButton';
import { getProtocolById } from '../../data/protocols';
import { getPeptideById } from '../../data/peptides';
import { useProtocolStore } from '../../store/useProtocolStore';
import { Colors, Radii, Typography, FontWeight, Spacing } from '../../constants/theme';

// Distinct hero gradient per protocol
const HERO_GRADIENTS: Record<string, readonly [string, string]> = {
  'injury-recovery-stack': ['#1A3A2A', '#0D2A1A'],
  'gh-optimizer':          ['#2A1A3A', '#1A0D2A'],
  'cognitive-edge':        ['#1A2A3A', '#0D1A2A'],
  'longevity-protocol':    ['#1A2A3A', '#0D1A2A'],
  'body-recomp':           ['#3A2A1A', '#2A1A0D'],
  'elite-recovery':        ['#3A1A1A', '#2A0D0D'],
  'gut-reset':             ['#1A3A2A', '#0D2A1A'],
};

export default function ProtocolDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const protocol = getProtocolById(id);
  const { startProtocol, logActivity, myProtocols } = useProtocolStore();

  if (!protocol) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Protocol not found.</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backLink}>Go back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const isAlreadyStarted = myProtocols.some((p) => p.id === protocol.id);
  const heroColors = HERO_GRADIENTS[protocol.id] ?? ['#1A2A3A', '#0D1A2A'];

  function handleStart() {
    if (isAlreadyStarted) {
      Alert.alert('Already active', `${protocol!.name} is already in your protocols.`);
      return;
    }
    startProtocol(protocol!);
    logActivity({
      id: Date.now().toString(),
      date: new Date().toISOString(),
      type: 'protocol_started',
      title: `Started: ${protocol!.name}`,
      subtitle: protocol!.durationLabel,
      relatedId: protocol!.id,
    });
    Alert.alert('Protocol Started! 🚀', `${protocol!.name} has been added to My Protocols.`, [
      { text: 'View My Protocols', onPress: () => { router.back(); router.push('/account/my-protocols'); } },
      { text: 'OK', onPress: () => router.back() },
    ]);
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Close */}
      <TouchableOpacity style={styles.closeBtn} onPress={() => router.back()}>
        <X size={20} color="rgba(255,255,255,0.7)" />
      </TouchableOpacity>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* Hero gradient */}
        <LinearGradient colors={heroColors as any} style={styles.hero}>
          <Text style={styles.heroEmoji}>💉</Text>
          <View style={styles.heroMeta}>
            <View style={styles.heroBadge}>
              <Users size={11} color="rgba(255,255,255,0.7)" />
              <Text style={styles.heroBadgeText}>{protocol.participantCount.toLocaleString()} on this</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Meta */}
        <View style={styles.metaRow}>
          <View style={styles.badge}>
            <Clock size={11} color="rgba(255,255,255,0.4)" />
            <Text style={styles.badgeText}>{protocol.durationLabel}</Text>
          </View>
          <View style={[styles.badge, styles.badgePurple]}>
            <Text style={styles.badgePurpleText}>
              {protocol.category === 'curated-combo' ? 'Curated Combo' : 'Expert Protocol'}
            </Text>
          </View>
        </View>

        <Text style={styles.name}>{protocol.name}</Text>
        <Text style={styles.subtitle}>{protocol.subtitle}</Text>

        {/* Tags */}
        <View style={styles.tagsRow}>
          {protocol.tags.map((tag) => (
            <View key={tag} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>

        {/* Schedule — each row taps to peptide detail */}
        <Text style={styles.sectionTitle}>Protocol Schedule</Text>
        {protocol.schedule.map((entry, i) => {
          const peptide = getPeptideById(entry.peptideId);
          return (
            <TouchableOpacity
              key={i}
              style={styles.scheduleRow}
              onPress={() => peptide && router.push(`/peptide/${peptide.id}`)}
              activeOpacity={0.8}
            >
              <View style={styles.scheduleIcon}>
                <FlaskConical size={14} color={Colors.accentOrange} />
              </View>
              <View style={styles.scheduleLeft}>
                <Text style={styles.scheduleName}>
                  {peptide?.name ?? entry.peptideId}
                </Text>
                <Text style={styles.scheduleDose}>
                  {entry.dose} {entry.unit} · {entry.frequency}
                  {entry.timing ? ` · ${entry.timing}` : ''}
                </Text>
              </View>
              <ChevronRight size={14} color="rgba(255,255,255,0.25)" />
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <View style={styles.footer}>
        <GradientButton
          label={isAlreadyStarted ? '✓ Already in My Protocols' : 'Start Protocol'}
          onPress={handleStart}
          variant={isAlreadyStarted ? 'secondary' : 'primary-orange'}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.base },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.base },
  errorText: { color: 'rgba(255,255,255,0.5)', fontSize: Typography.base },
  backLink: { color: Colors.accentOrange, marginTop: Spacing.md },
  closeBtn: {
    position: 'absolute', top: 52, right: Spacing.lg, zIndex: 10,
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center', justifyContent: 'center',
  },
  scroll: { paddingBottom: 32 },
  hero: {
    height: 240,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  heroEmoji: { fontSize: 64 },
  heroMeta: {
    position: 'absolute',
    top: Spacing.lg + 52,
    right: Spacing.lg,
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: Radii.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
  },
  heroBadgeText: { color: 'rgba(255,255,255,0.8)', fontSize: Typography.xs },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.lg,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.surfaceElevated,
    borderRadius: Radii.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
  },
  badgeText: { color: 'rgba(255,255,255,0.4)', fontSize: Typography.xs },
  badgePurple: { backgroundColor: 'rgba(123,79,255,0.15)', borderColor: 'rgba(123,79,255,0.3)' },
  badgePurpleText: { color: Colors.accentViolet, fontSize: Typography.xs, fontWeight: FontWeight.semibold },
  name: {
    color: '#FFF', fontSize: Typography.xxl, fontWeight: FontWeight.extrabold,
    paddingHorizontal: Spacing.lg, marginTop: Spacing.md,
  },
  subtitle: {
    color: 'rgba(255,255,255,0.5)', fontSize: Typography.sm,
    paddingHorizontal: Spacing.lg, marginTop: 4, marginBottom: Spacing.md,
  },
  tagsRow: {
    flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.xs,
    paddingHorizontal: Spacing.lg, marginBottom: Spacing.xl,
  },
  tag: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: Radii.full,
    paddingHorizontal: Spacing.sm, paddingVertical: 3,
    borderWidth: 1, borderColor: Colors.surfaceBorder,
  },
  tagText: { color: 'rgba(255,255,255,0.35)', fontSize: Typography.xs },
  sectionTitle: {
    color: '#FFF', fontSize: Typography.md, fontWeight: FontWeight.bold,
    paddingHorizontal: Spacing.lg, marginBottom: Spacing.md,
  },
  scheduleRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.surfaceElevated,
    marginHorizontal: Spacing.lg, borderRadius: Radii.lg,
    padding: Spacing.md, marginBottom: Spacing.sm,
    borderWidth: 1, borderColor: Colors.surfaceBorder,
    gap: Spacing.sm,
  },
  scheduleIcon: {
    width: 30, height: 30, borderRadius: 8,
    backgroundColor: 'rgba(255,107,43,0.1)',
    alignItems: 'center', justifyContent: 'center',
  },
  scheduleLeft: { flex: 1 },
  scheduleName: { color: '#FFF', fontSize: Typography.base, fontWeight: FontWeight.semibold },
  scheduleDose: { color: 'rgba(255,255,255,0.4)', fontSize: Typography.xs, marginTop: 2 },
  footer: { padding: Spacing.lg, paddingBottom: 40 },
});
