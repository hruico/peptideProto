/**
 * /protocol/started — shown after a user taps "Start Protocol".
 * Displays confirmation + shows all currently active protocols/peptides.
 * Navigate here as: router.push({ pathname: '/protocol/started', params: { id: protocol.id } })
 */
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { CheckCircle, FlaskConical, X, ChevronRight } from 'lucide-react-native';
import { differenceInDays } from 'date-fns';
import { LinearGradient } from 'expo-linear-gradient';
import ScreenBackground from '../../components/ScreenBackground';
import { useProtocolStore } from '../../store/useProtocolStore';
import { useScheduleStore } from '../../store/useScheduleStore';
import { getProtocolById } from '../../data/protocols';
import { getPeptideById } from '../../data/peptides';
import { Colors, Radii, Typography, FontWeight, Spacing } from '../../constants/theme';

const { width: W } = Dimensions.get('window');

export default function ProtocolStartedScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { myProtocols, removeProtocol } = useProtocolStore();
  const { scheduledPeptides } = useScheduleStore();

  const justStarted = getProtocolById(id);
  // All active protocols except the one just started (shown separately at top)
  const otherProtocols = myProtocols.filter((p) => p.id !== id);
  const justStartedActive = myProtocols.find((p) => p.id === id);

  return (
    <ScreenBackground bottomOpacity={0.97}>
      <StatusBar style="light" />

      {/* Close */}
      <TouchableOpacity style={styles.closeBtn} onPress={() => router.replace('/(tabs)')}>
        <X size={18} color="rgba(255,255,255,0.6)" />
      </TouchableOpacity>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* ── CONFIRMATION HEADER ── */}
        <View style={styles.confirmSection}>
          <View style={styles.checkCircle}>
            <CheckCircle size={44} color={Colors.accentGreen} />
          </View>
          <Text style={styles.confirmTitle}>Protocol Started!</Text>
          <Text style={styles.confirmSub}>
            {justStarted?.name ?? 'Your protocol'} is now active.
            {'\n'}Daily reminders have been scheduled.
          </Text>
        </View>

        {/* ── JUST STARTED CARD ── */}
        {justStarted && justStartedActive && (
          <View style={styles.featuredCard}>
            <LinearGradient
              colors={['#1E3A5F', '#0F2A4A']}
              style={styles.featuredGradient}
            >
              <View style={styles.featuredTop}>
                <View style={styles.activeChip}>
                  <View style={styles.activeDot} />
                  <Text style={styles.activeChipText}>ACTIVE</Text>
                </View>
                <Text style={styles.featuredDuration}>{justStarted.durationLabel}</Text>
              </View>
              <Text style={styles.featuredName}>{justStarted.name}</Text>
              <Text style={styles.featuredSub}>{justStarted.subtitle}</Text>

              {/* Progress bar — day 1 */}
              <View style={styles.progressRow}>
                <Text style={styles.progressLabel}>Day 1 of {justStarted.durationDays}</Text>
                <Text style={styles.progressPct}>0%</Text>
              </View>
              <View style={styles.progressBg}>
                <View style={[styles.progressFill, { width: '1%' }]} />
              </View>

              {/* Peptide chips */}
              <View style={styles.chips}>
                {justStarted.peptideIds.map((pid) => {
                  const p = getPeptideById(pid);
                  return (
                    <View key={pid} style={styles.chip}>
                      <Text style={styles.chipText}>{p?.name ?? pid}</Text>
                    </View>
                  );
                })}
              </View>
            </LinearGradient>
          </View>
        )}

        {/* ── OTHER ACTIVE PROTOCOLS ── */}
        {otherProtocols.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>OTHER ACTIVE PROTOCOLS</Text>
            {otherProtocols.map((protocol) => {
              const dayOn = differenceInDays(new Date(), new Date(protocol.startedAt)) + 1;
              const progress = Math.min(dayOn / protocol.durationDays, 1);
              const catalogProto = getProtocolById(protocol.id);
              return (
                <TouchableOpacity
                  key={protocol.id}
                  style={styles.protocolCard}
                  onPress={() => router.push({ pathname: '/protocol/[id]', params: { id: protocol.id } })}
                  activeOpacity={0.8}
                >
                  <View style={styles.protocolCardHeader}>
                    <View style={styles.iconCircle}>
                      <FlaskConical size={15} color={Colors.primaryOrange} />
                    </View>
                    <View style={styles.protocolCardInfo}>
                      <Text style={styles.protocolCardName}>{protocol.name}</Text>
                      <Text style={styles.protocolCardSub}>Day {dayOn} of {protocol.durationDays}</Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => removeProtocol(protocol.id)}
                      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                      <X size={13} color={Colors.textTertiary} />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.progressBg}>
                    <View style={[styles.progressFill, { width: `${Math.round(progress * 100)}%` as any }]} />
                  </View>
                  <View style={styles.progressFooter}>
                    <Text style={styles.progressLabel}>{Math.round(progress * 100)}% complete</Text>
                    <ChevronRight size={12} color={Colors.textTertiary} />
                  </View>
                  {catalogProto && (
                    <View style={styles.chips}>
                      {catalogProto.peptideIds.slice(0, 3).map((pid) => {
                        const p = getPeptideById(pid);
                        return (
                          <View key={pid} style={styles.chip}>
                            <Text style={styles.chipText}>{p?.name ?? pid}</Text>
                          </View>
                        );
                      })}
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {/* ── ACTIVE PEPTIDES ── */}
        {scheduledPeptides.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>ACTIVE PEPTIDES</Text>
            {scheduledPeptides.map((sp) => {
              const peptide = getPeptideById(sp.peptideId);
              const endDate = sp.runIndefinitely ? null : sp.endDate;
              return (
                <TouchableOpacity
                  key={sp.id}
                  style={styles.peptideCard}
                  onPress={() => router.push({ pathname: '/peptide/[id]', params: { id: sp.peptideId } })}
                  activeOpacity={0.8}
                >
                  <View style={[styles.peptideDot, { backgroundColor: Colors.accentTeal }]} />
                  <View style={styles.peptideInfo}>
                    <Text style={styles.peptideName}>{peptide?.name ?? sp.peptideId}</Text>
                    <Text style={styles.peptideDetail}>
                      {sp.dose} {sp.unit} · {sp.times.join(', ')}
                    </Text>
                    <Text style={styles.peptideDates}>
                      Until {endDate ? new Date(endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'indefinitely'}
                    </Text>
                  </View>
                  <ChevronRight size={14} color={Colors.textTertiary} />
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {/* ── EMPTY OTHERS STATE ── */}
        {otherProtocols.length === 0 && scheduledPeptides.length === 0 && (
          <View style={styles.emptyOthers}>
            <Text style={styles.emptyOthersText}>
              This is your only active protocol. Add more from Explore.
            </Text>
          </View>
        )}

        {/* ── CTA ── */}
        <View style={styles.ctaRow}>
          <TouchableOpacity
            style={styles.ctaBtn}
            onPress={() => router.replace('/(tabs)')}
            activeOpacity={0.85}
          >
            <Text style={styles.ctaBtnText}>Go to Dashboard</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.ctaBtnSecondary}
            onPress={() => router.push('/account/stats')}
            activeOpacity={0.85}
          >
            <Text style={styles.ctaBtnSecondaryText}>View Stats</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 60 }} />
      </ScrollView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  closeBtn: {
    position: 'absolute', top: 52, right: Spacing.lg, zIndex: 10,
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center', justifyContent: 'center',
  },
  scroll: { paddingHorizontal: Spacing.lg, paddingTop: 56, paddingBottom: 40 },

  // Confirmation
  confirmSection: { alignItems: 'center', paddingTop: 32, paddingBottom: Spacing.xl },
  checkCircle: {
    width: 88, height: 88, borderRadius: 44,
    backgroundColor: 'rgba(46,204,113,0.12)',
    alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.lg,
  },
  confirmTitle: { color: '#fff', fontSize: Typography.xxl, fontWeight: FontWeight.extrabold, marginBottom: Spacing.sm },
  confirmSub: { color: Colors.textSecondary, fontSize: Typography.sm, textAlign: 'center', lineHeight: 22 },

  // Featured card (just started)
  featuredCard: { borderRadius: Radii.xl, overflow: 'hidden', marginBottom: Spacing.xl },
  featuredGradient: { padding: Spacing.lg, gap: Spacing.sm },
  featuredTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  activeChip: { flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: 'rgba(46,204,113,0.15)', borderRadius: Radii.full,
    paddingHorizontal: Spacing.sm, paddingVertical: 3 },
  activeDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.accentGreen },
  activeChipText: { color: Colors.accentGreen, fontSize: 10, fontWeight: FontWeight.bold, letterSpacing: 0.8 },
  featuredDuration: { color: Colors.textTertiary, fontSize: Typography.xs },
  featuredName: { color: '#fff', fontSize: Typography.xl, fontWeight: FontWeight.extrabold },
  featuredSub: { color: Colors.textSecondary, fontSize: Typography.sm },
  progressRow: { flexDirection: 'row', justifyContent: 'space-between' },
  progressLabel: { color: Colors.textTertiary, fontSize: Typography.xs },
  progressPct: { color: Colors.textTertiary, fontSize: Typography.xs },
  progressBg: { height: 6, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: Colors.primaryOrange, borderRadius: 3 },
  progressFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 2 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 4 },
  chip: { backgroundColor: 'rgba(232,98,42,0.15)', borderRadius: Radii.full, paddingHorizontal: Spacing.sm, paddingVertical: 3 },
  chipText: { color: Colors.primaryOrange, fontSize: Typography.xs, fontWeight: FontWeight.semibold },

  // Section
  section: { marginBottom: Spacing.xl },
  sectionLabel: { color: Colors.textTertiary, fontSize: Typography.xs, fontWeight: FontWeight.semibold, letterSpacing: 1.5, marginBottom: Spacing.md },

  // Protocol cards
  protocolCard: {
    backgroundColor: 'rgba(255,255,255,0.07)', borderRadius: Radii.xl, padding: Spacing.md,
    marginBottom: Spacing.sm, borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)', gap: Spacing.sm,
  },
  protocolCardHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  iconCircle: { width: 32, height: 32, borderRadius: 16, backgroundColor: Colors.primaryOrangeLight, alignItems: 'center', justifyContent: 'center' },
  protocolCardInfo: { flex: 1 },
  protocolCardName: { color: Colors.textPrimary, fontSize: Typography.base, fontWeight: FontWeight.bold },
  protocolCardSub: { color: Colors.textSecondary, fontSize: Typography.xs, marginTop: 1 },

  // Peptide cards
  peptideCard: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    backgroundColor: 'rgba(255,255,255,0.07)', borderRadius: Radii.lg, padding: Spacing.md,
    marginBottom: Spacing.sm, borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)',
  },
  peptideDot: { width: 10, height: 10, borderRadius: 5 },
  peptideInfo: { flex: 1 },
  peptideName: { color: Colors.textPrimary, fontSize: Typography.base, fontWeight: FontWeight.semibold },
  peptideDetail: { color: Colors.textSecondary, fontSize: Typography.xs, marginTop: 2 },
  peptideDates: { color: Colors.textTertiary, fontSize: Typography.xs, marginTop: 1 },

  // Empty
  emptyOthers: { paddingVertical: Spacing.lg, alignItems: 'center' },
  emptyOthersText: { color: Colors.textTertiary, fontSize: Typography.sm, textAlign: 'center', lineHeight: 20 },

  // CTA
  ctaRow: { gap: Spacing.sm, marginTop: Spacing.lg },
  ctaBtn: { backgroundColor: Colors.primaryOrange, borderRadius: 32, paddingVertical: 17, alignItems: 'center' },
  ctaBtnText: { color: '#fff', fontSize: Typography.base, fontWeight: FontWeight.bold },
  ctaBtnSecondary: { backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 32, paddingVertical: 17, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)' },
  ctaBtnSecondaryText: { color: Colors.textPrimary, fontSize: Typography.base, fontWeight: FontWeight.medium },
});
