import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ShieldCheck } from 'lucide-react-native';
import { Colors, Radii, Typography, FontWeight, Spacing } from '../../constants/theme';

interface Props {
  onPressAskExpert: () => void;
}

const ROLE_CHIPS = ['PhD', 'MD', 'Practitioners', 'Researchers'];

export default function VerifiedExpertsCard({ onPressAskExpert }: Props) {
  return (
    <View style={styles.card}>
      {/* Header row */}
      <View style={styles.headerRow}>
        <View style={styles.shieldIcon}>
          <ShieldCheck size={20} color="#4ADE80" />
        </View>
        <View style={styles.headerText}>
          <Text style={styles.verifiedLabel}>VERIFIED EXPERTS</Text>
          <Text style={styles.subLabel}>Hand-picked panel</Text>
        </View>
        <View style={styles.freeBadge}>
          <Text style={styles.freeText}>FREE</Text>
        </View>
        {/* Discord logo placeholder (circle) */}
        <View style={styles.discordCircle}>
          <View style={styles.discordInner} />
        </View>
      </View>

      {/* Body */}
      <Text style={styles.title}>Get answers from real experts.</Text>
      <Text style={styles.body}>
        Join our Discord and get all your peptide questions answered by our expert panel of Clinicians, Researchers, and Industry Leaders.
      </Text>

      {/* Role chips */}
      <View style={styles.chipsRow}>
        {ROLE_CHIPS.map((chip) => (
          <View key={chip} style={styles.chip}>
            <Text style={styles.chipText}>{chip}</Text>
          </View>
        ))}
      </View>

      {/* CTA */}
      <TouchableOpacity style={styles.button} onPress={onPressAskExpert} activeOpacity={0.85}>
        <Text style={styles.buttonText}>Ask an expert</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: Radii.xl,
    padding: Spacing.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  shieldIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: 'rgba(74,222,128,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: { flex: 1 },
  verifiedLabel: {
    color: '#4ADE80',
    fontSize: Typography.xs,
    fontWeight: FontWeight.bold,
    letterSpacing: 0.5,
  },
  subLabel: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: Typography.xs,
  },
  freeBadge: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: Radii.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
  },
  freeText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: Typography.xs,
    fontWeight: FontWeight.semibold,
  },
  discordCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(88,101,242,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  discordInner: {
    width: 20,
    height: 14,
    backgroundColor: '#5865F2',
    borderRadius: 4,
  },
  title: {
    color: '#FFFFFF',
    fontSize: Typography.xl,
    fontWeight: FontWeight.extrabold,
    lineHeight: 30,
    marginBottom: Spacing.sm,
  },
  body: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: Typography.sm,
    lineHeight: 20,
    marginBottom: Spacing.md,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
    marginBottom: Spacing.md,
  },
  chip: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: Radii.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
  },
  chipText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: Typography.xs,
    fontWeight: FontWeight.medium,
  },
  button: {
    backgroundColor: Colors.accentViolet,
    borderRadius: 32,
    paddingVertical: 14,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: Typography.base,
    fontWeight: FontWeight.semibold,
  },
});
