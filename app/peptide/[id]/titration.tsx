import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ChevronLeft, TrendingUp } from 'lucide-react-native';
import ScreenBackground from '../../../components/ScreenBackground';
import { getPeptideById } from '../../../data/peptides';
import { Colors, Radii, Typography, FontWeight, Spacing } from '../../../constants/theme';

export default function TitrationScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const peptide = getPeptideById(id);

  function proceed(mode: 'titrate' | 'fixed') {
    router.push({ pathname: '/schedule/add-peptide' as any, params: { peptideId: id, titrationMode: mode } });
  }

  return (
    <ScreenBackground>
      <StatusBar style="light" />

      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <ChevronLeft size={22} color={Colors.textPrimary} />
      </TouchableOpacity>

      <View style={styles.content}>
        <View style={styles.iconWrap}>
          <TrendingUp size={32} color="#3B82F6" />
        </View>

        <Text style={styles.headline}>Titration{'\n'}Recommended</Text>
        <Text style={styles.body}>
          {peptide?.name ?? 'This peptide'} works best when you start at a lower dose and gradually increase. This helps your body adjust and reduces side effects.
        </Text>

        <View style={styles.cards}>
          <TouchableOpacity style={[styles.optionCard, styles.optionCardPrimary]} onPress={() => proceed('titrate')} activeOpacity={0.8}>
            <View style={styles.recommendedBadge}>
              <Text style={styles.recommendedText}>Recommended</Text>
            </View>
            <Text style={styles.optionTitle}>Start Low & Titrate Up</Text>
            <Text style={styles.optionSub}>Start at 0.5 mg and increase to 2.5 mg</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionCard} onPress={() => proceed('fixed')} activeOpacity={0.8}>
            <Text style={styles.optionTitle}>Single Fixed Dose</Text>
            <Text style={styles.optionSub}>Skip titration and use one consistent dose</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.footerNote}>
          Slow titration is key — increase dose every 4 weeks to minimize GI effects
        </Text>
      </View>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  backBtn: {
    position: 'absolute', top: 52, left: Spacing.lg, zIndex: 10,
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center',
  },
  content: { flex: 1, paddingHorizontal: Spacing.lg, paddingTop: 110, alignItems: 'center' },
  iconWrap: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: 'rgba(59,130,246,0.15)', alignItems: 'center', justifyContent: 'center',
    marginBottom: Spacing.xl,
  },
  headline: {
    fontSize: Typography.xxl, fontWeight: FontWeight.extrabold, color: Colors.textPrimary,
    textAlign: 'center', marginBottom: Spacing.md, lineHeight: 36,
  },
  body: {
    fontSize: Typography.sm, color: Colors.textSecondary, textAlign: 'center',
    lineHeight: 22, marginBottom: Spacing.xl,
  },
  cards: { width: '100%', gap: Spacing.md, marginBottom: Spacing.lg },
  optionCard: {
    borderRadius: Radii.xl, padding: Spacing.lg,
    backgroundColor: 'rgba(255,255,255,0.07)', borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.12)',
  },
  optionCardPrimary: { borderColor: Colors.primaryOrange, backgroundColor: Colors.primaryOrangeLight },
  recommendedBadge: {
    alignSelf: 'flex-start', backgroundColor: Colors.primaryOrange,
    borderRadius: Radii.full, paddingHorizontal: Spacing.sm, paddingVertical: 3, marginBottom: Spacing.sm,
  },
  recommendedText: { color: '#fff', fontSize: Typography.xs, fontWeight: FontWeight.bold },
  optionTitle: { fontSize: Typography.base, fontWeight: FontWeight.bold, color: Colors.textPrimary, marginBottom: 4 },
  optionSub: { fontSize: Typography.sm, color: Colors.textSecondary },
  footerNote: {
    fontSize: Typography.xs, color: Colors.textTertiary,
    textAlign: 'center', lineHeight: 18, paddingHorizontal: Spacing.lg,
  },
});
