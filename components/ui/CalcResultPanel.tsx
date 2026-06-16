import { View, Text, StyleSheet } from 'react-native';
import { Colors, Radii, Typography, FontWeight, Spacing } from '../../constants/theme';
import type { CalcResult } from '../../types';

interface Props {
  result: CalcResult | null;
}

export default function CalcResultPanel({ result }: Props) {
  const empty = !result || result.drawVolumeMl === 0;

  return (
    <View style={styles.panel}>
      <Text style={styles.panelTitle}>RESULT</Text>
      <View style={styles.row}>
        <ResultItem
          label="Draw Volume"
          value={empty ? '—' : `${result!.drawVolumeMl.toFixed(3)} mL`}
          highlight
        />
        <ResultItem
          label="Syringe Units"
          value={empty ? '—' : `${result!.syringeUnits.toFixed(1)} units`}
          highlight
        />
      </View>
      <View style={styles.row}>
        <ResultItem
          label="Concentration"
          value={
            empty || !result?.concentrationMcgPerMl
              ? '—'
              : `${result!.concentrationMcgPerMl.toFixed(1)} mcg/mL`
          }
        />
        <ResultItem
          label="Doses / Vial"
          value={
            empty || !result?.dosesPerVial
              ? '—'
              : `${result!.dosesPerVial.toFixed(1)}`
          }
        />
      </View>
      {empty && (
        <Text style={styles.hint}>Fill in the fields above to see your result.</Text>
      )}
    </View>
  );
}

function ResultItem({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <View style={itemStyles.container}>
      <Text style={itemStyles.label}>{label}</Text>
      <Text style={[itemStyles.value, highlight && itemStyles.valueHighlight]}>{value}</Text>
    </View>
  );
}

const itemStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surfaceElevated,
    borderRadius: Radii.lg,
    padding: Spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
  },
  label: {
    color: Colors.textTertiary,
    fontSize: Typography.xs,
    fontWeight: FontWeight.medium,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  value: {
    color: Colors.textSecondary,
    fontSize: Typography.md,
    fontWeight: FontWeight.bold,
  },
  valueHighlight: {
    color: Colors.accentOrange,
    fontSize: Typography.lg,
  },
});

const styles = StyleSheet.create({
  panel: {
    backgroundColor: Colors.surface,
    borderRadius: Radii.xl,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    gap: Spacing.sm,
  },
  panelTitle: {
    color: Colors.textTertiary,
    fontSize: Typography.xs,
    fontWeight: FontWeight.semibold,
    letterSpacing: 1.5,
    marginBottom: 2,
  },
  row: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  hint: {
    color: Colors.textTertiary,
    fontSize: Typography.xs,
    textAlign: 'center',
    paddingTop: 4,
  },
});
