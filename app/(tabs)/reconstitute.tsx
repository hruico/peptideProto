import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Layers } from 'lucide-react-native';
import { useVialStore } from '../../store/useVialStore';
import { Colors, Radii, Typography, FontWeight, Spacing } from '../../constants/theme';
import type { Vial } from '../../types';

export default function ReconstituteScreen() {
  const { vials } = useVialStore();

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Vial illustration */}
        <View style={styles.heroSection}>
          <Image
            source={require('../../assets/images/splash-icon.png')}
            style={styles.vialImage}
            resizeMode="contain"
          />
        </View>

        {/* Headline */}
        <View style={styles.textSection}>
          <Text style={styles.title}>Reconstitute Your{'\n'}First Peptide</Text>
          <Text style={styles.subtitle}>
            Calculate the perfect mix ratio and get step-by-step guidance for safe reconstitution.
          </Text>
        </View>

        {/* Your Vials */}
        {vials.length > 0 && (
          <View style={styles.vialsSection}>
            <Text style={styles.sectionLabel}>YOUR VIALS</Text>
            {vials.map((vial) => (
              <VialRow key={vial.id} vial={vial} />
            ))}
          </View>
        )}

        {/* Action buttons */}
        <View style={styles.buttonsSection}>
          {/* Primary orange button */}
          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={() => router.push('/reconstitute/new-peptide')}
            activeOpacity={0.85}
          >
            <Text style={styles.primaryBtnText}>Reconstitute New Peptide</Text>
          </TouchableOpacity>

          {/* Secondary buttons */}
          <TouchableOpacity
            style={styles.secondaryBtn}
            onPress={() => router.push('/reconstitute/pre-mixed')}
            activeOpacity={0.85}
          >
            <Text style={styles.secondaryBtnText}>Add Pre-Mixed Solution</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryBtn}
            onPress={() => router.push('/reconstitute/add-blend')}
            activeOpacity={0.85}
          >
            <View style={styles.blendBtnInner}>
              <Layers size={16} color="rgba(255,255,255,0.7)" />
              <Text style={styles.secondaryBtnText}>Add Blend</Text>
            </View>
          </TouchableOpacity>
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
        <Text style={vialStyles.conc}>
          {vial.concentrationMcgPerMl.toFixed(0)} mcg/mL · {vial.totalVolumeMl} mL
        </Text>
      </View>
      <Text style={vialStyles.type}>{vial.type}</Text>
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
  name: { color: '#FFF', fontSize: Typography.base, fontWeight: FontWeight.semibold },
  conc: { color: Colors.accentOrange, fontSize: Typography.xs, marginTop: 2 },
  type: { color: 'rgba(255,255,255,0.4)', fontSize: Typography.xs, textTransform: 'capitalize' },
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.base },
  scroll: { paddingBottom: 48 },
  heroSection: {
    alignItems: 'center',
    paddingTop: 80,
    paddingBottom: Spacing.lg,
  },
  vialImage: {
    width: 120,
    height: 120,
    tintColor: Colors.accentOrange,
  },
  textSection: {
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  title: {
    color: '#FFFFFF',
    fontSize: Typography.xxl,
    fontWeight: FontWeight.extrabold,
    textAlign: 'center',
    lineHeight: 36,
  },
  subtitle: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: Typography.sm,
    textAlign: 'center',
    lineHeight: 22,
  },
  vialsSection: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  sectionLabel: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: Typography.xs,
    fontWeight: FontWeight.semibold,
    letterSpacing: 1.5,
    marginBottom: Spacing.sm,
  },
  buttonsSection: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
  },
  primaryBtn: {
    backgroundColor: Colors.accentOrange,
    borderRadius: 32,
    paddingVertical: 18,
    alignItems: 'center',
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: Typography.base,
    fontWeight: FontWeight.bold,
  },
  secondaryBtn: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: 32,
    paddingVertical: 18,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
  },
  secondaryBtnText: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: Typography.base,
    fontWeight: FontWeight.medium,
  },
  blendBtnInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
});
