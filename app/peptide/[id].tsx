import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { X, Syringe, Plus } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';
import GradientButton from '../../components/ui/GradientButton';
import { getPeptideById } from '../../data/peptides';
import { useProtocolStore } from '../../store/useProtocolStore';
import { Colors, Radii, Typography, FontWeight, Spacing } from '../../constants/theme';

export default function PeptideDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const peptide = getPeptideById(id);
  const { logActivity } = useProtocolStore();

  if (!peptide) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Peptide not found.</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backLink}>Go back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  function handleAddToStack() {
    logActivity({
      id: Date.now().toString(),
      date: new Date().toISOString(),
      type: 'vial_saved',
      title: `Added ${peptide!.name} to stack`,
      relatedId: peptide!.id,
    });
    Alert.alert('Added! ✅', `${peptide!.name} has been added to your stack.`, [
      { text: 'OK', onPress: () => router.back() },
    ]);
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Close */}
      <TouchableOpacity style={styles.closeBtn} onPress={() => router.back()}>
        <X size={20} color={Colors.textSecondary} />
      </TouchableOpacity>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* Hero block */}
        <View style={styles.heroBlock}>
          <Text style={styles.watermark}>{peptide.name.charAt(0)}</Text>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{peptide.category}</Text>
          </View>
          <Text style={styles.name}>{peptide.name}</Text>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Overview</Text>
          <Text style={styles.body}>{peptide.description}</Text>
        </View>

        {/* Mechanism */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>How it works</Text>
          <Text style={styles.body}>{peptide.mechanism}</Text>
        </View>

        {/* Dosing */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Typical Dosing</Text>
          <View style={styles.doseCard}>
            <Text style={styles.doseValue}>
              {peptide.typicalDose} {peptide.doseUnit}
            </Text>
            <Text style={styles.doseLabel}>per dose</Text>
          </View>
        </View>

        {/* Related goals */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Related Goals</Text>
          <View style={styles.tagsRow}>
            {peptide.relatedGoals.map((goal) => (
              <View key={goal} style={styles.tag}>
                <Text style={styles.tagText}>{goal.replace(/-/g, ' ')}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* CTAs */}
      <View style={styles.footer}>
        <View style={styles.ctaRow}>
          <View style={styles.ctaPrimary}>
            <GradientButton
              label="Add to Reconstitute"
              icon={Syringe}
              onPress={() => router.push({
                pathname: '/reconstitute/new-peptide',
                params: { peptideId: peptide.id },
              })}
            />
          </View>
          <TouchableOpacity style={styles.ctaSecondary} onPress={handleAddToStack} activeOpacity={0.8}>
            <Plus size={20} color={Colors.accentViolet} />
          </TouchableOpacity>
        </View>
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
  heroBlock: {
    backgroundColor: Colors.surfaceElevated,
    padding: Spacing.xl,
    paddingTop: 64,
    overflow: 'hidden',
    alignItems: 'flex-start',
    gap: Spacing.sm,
  },
  watermark: {
    position: 'absolute',
    right: -16,
    top: 0,
    fontSize: 160,
    fontWeight: FontWeight.extrabold,
    color: 'rgba(255,255,255,0.04)',
    lineHeight: 180,
  },
  categoryBadge: {
    backgroundColor: 'rgba(255,107,43,0.15)',
    borderRadius: Radii.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
  },
  categoryText: {
    color: Colors.accentOrange,
    fontSize: Typography.xs,
    fontWeight: FontWeight.semibold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  name: {
    color: Colors.textPrimary,
    fontSize: Typography.xxxl,
    fontWeight: FontWeight.extrabold,
  },
  section: { paddingHorizontal: Spacing.lg, marginTop: Spacing.xl },
  sectionTitle: {
    color: Colors.textTertiary,
    fontSize: Typography.xs,
    fontWeight: FontWeight.semibold,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: Spacing.sm,
  },
  body: {
    color: Colors.textSecondary,
    fontSize: Typography.base,
    lineHeight: 26,
  },
  doseCard: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: Radii.lg,
    padding: Spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    alignSelf: 'flex-start',
    minWidth: 140,
  },
  doseValue: {
    color: Colors.accentOrange,
    fontSize: Typography.xl,
    fontWeight: FontWeight.extrabold,
  },
  doseLabel: {
    color: Colors.textTertiary,
    fontSize: Typography.xs,
  },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.xs },
  tag: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: Radii.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
  },
  tagText: { color: Colors.textSecondary, fontSize: Typography.xs },
  footer: { padding: Spacing.lg, paddingBottom: 40 },
  ctaRow: { flexDirection: 'row', gap: Spacing.md, alignItems: 'center' },
  ctaPrimary: { flex: 1 },
  ctaSecondary: {
    width: 48,
    height: 48,
    borderRadius: Radii.lg,
    backgroundColor: 'rgba(123,79,255,0.15)',
    borderWidth: 1,
    borderColor: Colors.accentViolet,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
