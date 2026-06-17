import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Check, FlaskConical } from 'lucide-react-native';
import { getPeptideById } from '../../data/peptides';
import { Colors, Radii, Typography, FontWeight, Spacing } from '../../constants/theme';

export default function PeptideAddedScreen() {
  const { peptideId } = useLocalSearchParams<{ peptideId: string }>();
  const peptide = getPeptideById(peptideId);
  const name = peptide?.name ?? 'Peptide';

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.content}>
        {/* Big green checkmark */}
        <View style={styles.checkCircle}>
          <Check size={40} color="#fff" strokeWidth={3} />
        </View>

        <Text style={styles.headline}>{name} Added</Text>
        <Text style={styles.sub}>Your schedule has been updated</Text>

        <View style={styles.divider} />

        <Text style={styles.question}>Have you reconstituted it yet?</Text>
        <Text style={styles.questionSub}>Peptides need to be mixed with bacteriostatic water before use.</Text>

        <View style={styles.options}>
          <TouchableOpacity
            style={styles.optionRow}
            onPress={() => router.push('/schedule/notifications' as any)}
            activeOpacity={0.7}
          >
            <View style={styles.optionCheckIcon}>
              <Check size={16} color={Colors.accentGreen} />
            </View>
            <View style={styles.optionInfo}>
              <Text style={styles.optionTitle}>Yes, it's ready to use</Text>
              <Text style={styles.optionSub}>Already mixed and stored in the fridge</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.optionRow}
            onPress={() => router.push({ pathname: '/reconstitute/new-peptide' as any, params: { prefillId: peptideId } })}
            activeOpacity={0.7}
          >
            <View style={styles.optionFlaskIcon}>
              <FlaskConical size={16} color={Colors.primaryOrange} />
            </View>
            <View style={styles.optionInfo}>
              <Text style={styles.optionTitle}>Not yet, help me reconstitute</Text>
              <Text style={styles.optionSub}>I'll walk you through it step by step</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.base },
  content: { flex: 1, paddingHorizontal: Spacing.lg, paddingTop: 100, alignItems: 'center' },
  checkCircle: {
    width: 96, height: 96, borderRadius: 48,
    backgroundColor: Colors.accentGreen, alignItems: 'center', justifyContent: 'center',
    marginBottom: Spacing.xl,
    shadowColor: Colors.accentGreen, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 16,
  },
  headline: {
    fontSize: Typography.xxl, fontWeight: FontWeight.extrabold, color: Colors.textPrimary,
    textAlign: 'center', marginBottom: Spacing.sm,
  },
  sub: { fontSize: Typography.base, color: Colors.textSecondary, textAlign: 'center', marginBottom: Spacing.xl },
  divider: { width: '100%', height: 1, backgroundColor: Colors.surfaceBorder, marginBottom: Spacing.xl },
  question: { fontSize: Typography.lg, fontWeight: FontWeight.bold, color: Colors.textPrimary, textAlign: 'center', marginBottom: Spacing.sm },
  questionSub: { fontSize: Typography.sm, color: Colors.textSecondary, textAlign: 'center', marginBottom: Spacing.xl },
  options: { width: '100%', gap: Spacing.md },
  optionRow: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    backgroundColor: Colors.surface, borderRadius: Radii.xl, padding: Spacing.lg,
    borderWidth: 1, borderColor: Colors.surfaceBorder,
  },
  optionCheckIcon: {
    width: 36, height: 36, borderRadius: 18, backgroundColor: '#EDFBF3', alignItems: 'center', justifyContent: 'center',
  },
  optionFlaskIcon: {
    width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.primaryOrangeLight, alignItems: 'center', justifyContent: 'center',
  },
  optionInfo: { flex: 1 },
  optionTitle: { fontSize: Typography.base, fontWeight: FontWeight.bold, color: Colors.textPrimary, marginBottom: 2 },
  optionSub: { fontSize: Typography.xs, color: Colors.textSecondary },
});
