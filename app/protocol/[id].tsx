import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Alert,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { X, Clock, Users, ChevronRight } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';
import GradientButton from '../../components/ui/GradientButton';
import { getProtocolById } from '../../data/protocols';
import { getPeptideById } from '../../data/peptides';
import { useProtocolStore } from '../../store/useProtocolStore';
import { Colors, Radii, Typography, FontWeight, Spacing } from '../../constants/theme';

export default function ProtocolDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const protocol = getProtocolById(id);
  const { startProtocol, logActivity } = useProtocolStore();

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

  function handleStart() {
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
      { text: 'OK', onPress: () => router.back() },
    ]);
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Close button */}
      <TouchableOpacity style={styles.closeBtn} onPress={() => router.back()}>
        <X size={20} color={Colors.textSecondary} />
      </TouchableOpacity>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* Hero placeholder */}
        <View style={styles.hero}>
          <Text style={styles.heroEmoji}>🔬</Text>
        </View>

        {/* Meta badges */}
        <View style={styles.metaRow}>
          <View style={styles.badge}>
            <Clock size={12} color={Colors.textTertiary} />
            <Text style={styles.badgeText}>{protocol.durationLabel}</Text>
          </View>
          <View style={styles.badge}>
            <Users size={12} color={Colors.textTertiary} />
            <Text style={styles.badgeText}>
              {protocol.participantCount.toLocaleString()} on this
            </Text>
          </View>
          <View style={[styles.badge, styles.badgeCategory]}>
            <Text style={styles.badgeCategoryText}>
              {protocol.category === 'curated-combo' ? 'Curated' : 'Expert'}
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

        {/* Schedule */}
        <Text style={styles.sectionTitle}>Protocol Schedule</Text>
        {protocol.schedule.map((entry, i) => {
          const peptide = getPeptideById(entry.peptideId);
          return (
            <View key={i} style={styles.scheduleRow}>
              <View style={styles.scheduleLeft}>
                <Text style={styles.scheduleName}>
                  {peptide?.name ?? entry.peptideId}
                </Text>
                <Text style={styles.scheduleDose}>
                  {entry.dose} {entry.unit} · {entry.frequency}
                  {entry.timing ? ` · ${entry.timing}` : ''}
                </Text>
              </View>
              <ChevronRight size={16} color={Colors.textTertiary} />
            </View>
          );
        })}
      </ScrollView>

      <View style={styles.footer}>
        <GradientButton label="Start Protocol" onPress={handleStart} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.base },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.base },
  errorText: { color: Colors.textSecondary, fontSize: Typography.base },
  backLink: { color: Colors.accentOrange, marginTop: Spacing.md },
  closeBtn: {
    position: 'absolute',
    top: 52,
    right: Spacing.lg,
    zIndex: 10,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scroll: { paddingBottom: 32 },
  hero: {
    height: 220,
    backgroundColor: Colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroEmoji: { fontSize: 72 },
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
  },
  badgeText: { color: Colors.textTertiary, fontSize: Typography.xs },
  badgeCategory: { backgroundColor: 'rgba(123,79,255,0.15)' },
  badgeCategoryText: {
    color: Colors.accentViolet,
    fontSize: Typography.xs,
    fontWeight: FontWeight.semibold,
  },
  name: {
    color: Colors.textPrimary,
    fontSize: Typography.xxl,
    fontWeight: FontWeight.extrabold,
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.md,
  },
  subtitle: {
    color: Colors.textSecondary,
    fontSize: Typography.sm,
    paddingHorizontal: Spacing.lg,
    marginTop: 4,
    marginBottom: Spacing.md,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  tag: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: Radii.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
  },
  tagText: { color: Colors.textTertiary, fontSize: Typography.xs },
  sectionTitle: {
    color: Colors.textPrimary,
    fontSize: Typography.md,
    fontWeight: FontWeight.bold,
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },
  scheduleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surfaceElevated,
    marginHorizontal: Spacing.lg,
    borderRadius: Radii.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
  },
  scheduleLeft: { flex: 1 },
  scheduleName: {
    color: Colors.textPrimary,
    fontSize: Typography.base,
    fontWeight: FontWeight.semibold,
  },
  scheduleDose: {
    color: Colors.textTertiary,
    fontSize: Typography.xs,
    marginTop: 2,
  },
  footer: { padding: Spacing.lg, paddingBottom: 40 },
});
