import { useState, useMemo } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Alert, KeyboardAvoidingView, Platform,
} from 'react-native';
import { router } from 'expo-router';
import { X } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';
import FormField from '../../components/ui/FormField';
import CalcResultPanel from '../../components/ui/CalcResultPanel';
import GradientButton from '../../components/ui/GradientButton';
import { useVialStore } from '../../store/useVialStore';
import { useProtocolStore } from '../../store/useProtocolStore';
import { getPeptideById, PEPTIDES } from '../../data/peptides';
import { calculateFromPreMixed } from '../../lib/reconstitutionMath';
import { Colors, Radii, Typography, FontWeight, Spacing } from '../../constants/theme';
import type { DoseUnit, ConcentrationUnit, CalcResult } from '../../types';

const CONC_UNITS: { label: string; value: ConcentrationUnit }[] = [
  { label: 'mcg/mL', value: 'mcg/mL' },
  { label: 'mg/mL', value: 'mg/mL' },
  { label: 'IU/mL', value: 'IU/mL' },
];

const DOSE_UNITS: { label: string; value: DoseUnit }[] = [
  { label: 'mcg', value: 'mcg' },
  { label: 'mg', value: 'mg' },
  { label: 'IU', value: 'IU' },
];

export default function PreMixedScreen() {
  const { addVial } = useVialStore();
  const { logActivity } = useProtocolStore();

  const [selectedPeptideId, setSelectedPeptideId] = useState('');
  const [concentration, setConcentration] = useState('');
  const [concUnit, setConcUnit] = useState<ConcentrationUnit>('mcg/mL');
  const [totalVolumeMl, setTotalVolumeMl] = useState('');
  const [doseAmount, setDoseAmount] = useState('');
  const [doseUnit, setDoseUnit] = useState<DoseUnit>('mcg');
  const [showPeptidePicker, setShowPeptidePicker] = useState(false);

  const selectedPeptide = getPeptideById(selectedPeptideId);

  // Live calculation — updates on every keystroke
  const result: CalcResult | null = useMemo(() => {
    const conc = parseFloat(concentration);
    const vol = parseFloat(totalVolumeMl);
    if (!conc || !vol) return null;
    const dose = parseFloat(doseAmount);
    return calculateFromPreMixed({
      concentration: conc,
      concentrationUnit: concUnit,
      totalVolumeMl: vol,
      doseAmount: dose || undefined,
      doseUnit: dose ? doseUnit : undefined,
    });
  }, [concentration, concUnit, totalVolumeMl, doseAmount, doseUnit]);

  function handleSave() {
    if (!result || !parseFloat(concentration) || !parseFloat(totalVolumeMl)) {
      Alert.alert('Missing info', 'Please fill in concentration and total volume.');
      return;
    }
    const peptideName = selectedPeptide?.name ?? 'Unknown Peptide';
    const vial = {
      id: Date.now().toString(),
      peptideId: selectedPeptideId || undefined,
      peptideName,
      type: 'single' as const,
      concentrationMcgPerMl: result.concentrationMcgPerMl,
      totalVolumeMl: parseFloat(totalVolumeMl),
      reconstitutedDate: new Date().toISOString(),
    };
    addVial(vial);
    logActivity({
      id: Date.now().toString(),
      date: new Date().toISOString(),
      type: 'vial_saved',
      title: `Added pre-mixed ${peptideName}`,
      subtitle: `${result.concentrationMcgPerMl.toFixed(0)} mcg/mL`,
      relatedId: vial.id,
    });
    router.back();
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar style="light" />

      <View style={styles.header}>
        <Text style={styles.title}>Pre-Mixed / Known Concentration</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn}>
          <X size={20} color={Colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        {/* Peptide selector */}
        <TouchableOpacity
          style={[styles.selectorBtn, selectedPeptide && styles.selectorBtnFilled]}
          onPress={() => setShowPeptidePicker(true)}
          activeOpacity={0.8}
        >
          <Text style={selectedPeptide ? styles.selectorTextFilled : styles.selectorText}>
            {selectedPeptide ? selectedPeptide.name : 'Select peptide (optional) ▾'}
          </Text>
        </TouchableOpacity>

        {/* Concentration */}
        <FormField
          label="Concentration"
          value={concentration}
          onChangeText={setConcentration}
          placeholder="e.g. 600"
          units={CONC_UNITS}
          selectedUnit={concUnit}
          onUnitChange={(u) => setConcUnit(u as ConcentrationUnit)}
          hint="The concentration of the solution in the vial"
        />

        {/* Total volume */}
        <FormField
          label="Total volume in vial (mL)"
          value={totalVolumeMl}
          onChangeText={setTotalVolumeMl}
          placeholder="e.g. 20"
        />

        {/* Desired dose — optional */}
        <FormField
          label="Desired dose (optional)"
          value={doseAmount}
          onChangeText={setDoseAmount}
          placeholder="e.g. 500"
          units={DOSE_UNITS}
          selectedUnit={doseUnit}
          onUnitChange={(u) => setDoseUnit(u as DoseUnit)}
          hint="Leave blank to see only concentration info"
        />

        {/* Live result panel */}
        <CalcResultPanel result={result} />
      </ScrollView>

      <View style={styles.footer}>
        <GradientButton
          label="Save Vial"
          variant="primary-violet"
          onPress={handleSave}
          disabled={!result}
        />
      </View>

      {/* Peptide picker */}
      {showPeptidePicker && (
        <View style={styles.pickerSheet}>
          <View style={styles.pickerHeader}>
            <Text style={styles.pickerTitle}>Select Peptide</Text>
            <TouchableOpacity onPress={() => setShowPeptidePicker(false)}>
              <X size={20} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>
          <ScrollView>
            <TouchableOpacity
              style={styles.pickerRow}
              onPress={() => { setSelectedPeptideId(''); setShowPeptidePicker(false); }}
            >
              <Text style={styles.pickerRowName}>None / Unknown</Text>
            </TouchableOpacity>
            {PEPTIDES.map((p) => (
              <TouchableOpacity
                key={p.id}
                style={styles.pickerRow}
                onPress={() => { setSelectedPeptideId(p.id); setShowPeptidePicker(false); }}
              >
                <Text style={styles.pickerRowName}>{p.name}</Text>
                <Text style={styles.pickerRowCat}>{p.category}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.base },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 56,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  title: {
    color: Colors.textPrimary,
    fontSize: Typography.md,
    fontWeight: FontWeight.extrabold,
    flex: 1,
    marginRight: Spacing.md,
  },
  closeBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: Colors.surfaceElevated,
    alignItems: 'center', justifyContent: 'center',
  },
  scroll: { paddingHorizontal: Spacing.lg, paddingBottom: 32 },
  selectorBtn: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: Radii.lg,
    borderWidth: 1.5,
    borderColor: Colors.surfaceBorder,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  selectorBtnFilled: { borderColor: Colors.accentViolet },
  selectorText: { color: Colors.textTertiary, fontSize: Typography.base },
  selectorTextFilled: {
    color: Colors.textPrimary,
    fontSize: Typography.base,
    fontWeight: FontWeight.semibold,
  },
  footer: { padding: Spacing.lg, paddingBottom: 40 },
  pickerSheet: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: Colors.surfaceElevated,
    borderTopLeftRadius: Radii.xl,
    borderTopRightRadius: Radii.xl,
    maxHeight: '70%',
    padding: Spacing.lg,
  },
  pickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  pickerTitle: {
    color: Colors.textPrimary,
    fontSize: Typography.md,
    fontWeight: FontWeight.bold,
  },
  pickerRow: {
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.surfaceBorder,
  },
  pickerRowName: {
    color: Colors.textPrimary,
    fontSize: Typography.base,
    fontWeight: FontWeight.semibold,
  },
  pickerRowCat: {
    color: Colors.textTertiary,
    fontSize: Typography.xs,
    marginTop: 2,
  },
});
