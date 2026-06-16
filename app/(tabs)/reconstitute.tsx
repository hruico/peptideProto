import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { FlaskConical, Plus, ChevronRight, Blend } from 'lucide-react-native';
import GradientButton from '../../components/ui/GradientButton';
import { useVialStore } from '../../store/useVialStore';
import { Colors, Radii, Typography, FontWeight, Spacing } from '../../constants/theme';
import type { Vial } from '../../types';

export default function ReconstituteScreen() {
  const { vials } = useVialStore();

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Reconstitute</Text>
          <Text style={styles.subtitle}>
            Calculate draw volumes and manage your vials with precision.
          </Text>
        </View>

        {/* Vial illustration */}
        <View style={styles.illustration}>
          <FlaskConical size={72} color={Colors.accentOrange} strokeWidth={1.2} />
        </View>

        {/* Your Vials — only show when vials exist */}
        {vials.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Your Vials</Text>
            {vials.map((vial) => (
              <VialRow key={vial.id} vial={vial} />
            ))}
          </View>
        )}

        {/* Action buttons */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Get started</Text>
          <View style={styles.buttonsCol}>
            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => router.push('/reconstitute/new-peptide')}
              activeOpacity={0.85}
            >
              <View style={[styles.actionIcon, { backgroundColor: 'rgba(255,107,43,0.12)' }]}>
                <FlaskConical size={22} color={Colors.accentOrange} />
              </View>
              <View style={styles.actionText}>
                <Text style={styles.actionTitle}>Reconstitute a peptide</Text>
                <Text style={styles.actionDesc}>
                  Add BAC water to lyophilised powder
                </Text>
              </View>
              <ChevronRight size={18} color={Colors.textTertiary} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => router.push('/reconstitute/pre-mixed')}
              activeOpacity={0.85}
            >
              <View style={[styles.actionIcon, { backgroundColor: 'rgba(123,79,255,0.12)' }]}>
                <Plus size={22} color={Colors.accentViolet} />
              </View>
              <View style={styles.actionText}>
                <Text style={styles.actionTitle}>Pre-mixed / known concentration</Text>
                <Text style={styles.actionDesc}>
                  Calculate from an existing solution
                </Text>
              </View>
              <ChevronRight size={18} color={Colors.textTertiary} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => router.push('/reconstitute/add-blend')}
              activeOpacity={0.85}
            >
              <View style={[styles.actionIcon, { backgroundColor: 'rgba(46,204,113,0.12)' }]}>
                <Blend size={22} color={Colors.success} />
              </View>
              <View style={styles.actionText}>
                <Text style={styles.actionTitle}>Add a blend</Text>
                <Text style={styles.actionDesc}>
                  Popular combos or create your own
                </Text>
              </View>
              <ChevronRight size={18} color={Colors.textTertiary} />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

function VialRow({ vial }: { vial: Vial }) {
  return (
    <View style={vialStyles.row}>
      <View style={vialStyles.left}>
        <Text style={vialStyles.name}>{vial.peptideName}</Text>
        {vial.label ? <Text style={vialStyles.label}>{vial.label}</Text> : null}
        <Text style={vialStyles.conc}>
          {vial.concentrationMcgPerMl.toFixed(0)} mcg/mL · {vial.totalVolumeMl} mL
        </Text>
      </View>
      <View style={vialStyles.badge}>
        <Text style={vialStyles.badgeText}>{vial.type}</Text>
      </View>
    </View>
  );
}

const vialStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceElevated,
    borderRadius: Radii.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
  },
  left: { flex: 1 },
  name: {
    color: Colors.textPrimary,
    fontSize: Typography.base,
    fontWeight: FontWeight.semibold,
  },
  label: {
    color: Colors.textTertiary,
    fontSize: Typography.xs,
    marginTop: 2,
  },
  conc: {
    color: Colors.accentOrange,
    fontSize: Typography.xs,
    marginTop: 2,
    fontWeight: FontWeight.medium,
  },
  badge: {
    backgroundColor: 'rgba(255,107,43,0.12)',
    borderRadius: Radii.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
  },
  badgeText: {
    color: Colors.accentOrange,
    fontSize: Typography.xs,
    fontWeight: FontWeight.semibold,
    textTransform: 'capitalize',
  },
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.base },
  scroll: { paddingBottom: 40 },
  header: {
    paddingTop: 56,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  title: {
    color: Colors.textPrimary,
    fontSize: Typography.xxl,
    fontWeight: FontWeight.extrabold,
  },
  subtitle: {
    color: Colors.textSecondary,
    fontSize: Typography.sm,
    marginTop: 4,
    lineHeight: 20,
  },
  illustration: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  section: {
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.md,
  },
  sectionTitle: {
    color: Colors.textTertiary,
    fontSize: Typography.xs,
    fontWeight: FontWeight.semibold,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: Spacing.md,
  },
  buttonsCol: { gap: Spacing.sm },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceElevated,
    borderRadius: Radii.xl,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    gap: Spacing.md,
  },
  actionIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionText: { flex: 1 },
  actionTitle: {
    color: Colors.textPrimary,
    fontSize: Typography.base,
    fontWeight: FontWeight.semibold,
  },
  actionDesc: {
    color: Colors.textTertiary,
    fontSize: Typography.xs,
    marginTop: 2,
  },
});
