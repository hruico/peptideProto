import { useState, useMemo } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Alert, KeyboardAvoidingView, Platform,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { X } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';
import FormField from '../../components/ui/FormField';
import CalcResultPanel from '../../components/ui/CalcResultPanel';
import GradientButton from '../../components/ui/GradientButton';
import { useVialStore } from '../../store/useVialStore';
import { useProtocolStore } from '../../store/useProtocolStore';
import { getPeptideById, PEPTIDES } from '../../data/peptides';
import { calculateFromReconstitution } from '../../lib/reconstitutionMath';
import { Colors, Radii, Typography, FontWeight, Spacing } from '../../constants/theme';
import type { DoseUnit, CalcResult } from '../../types';

const DOSE_UNITS: { label: string; value: DoseUnit }[] = [
  { label: 'mcg', value: 'mcg' },
  { label: 'mg', value: 'mg' },
  { label: 'IU', value: 'IU' },
];

export default function NewPeptideScreen() {
  const { peptideId: preselectedId } = useLocalSearchParams<{ peptideId?: string }>();
  const { addVial } = useVialStore();
  const { logActivity } = useProtocolStore();

  const [selectedPeptideId, setSelectedPeptideId] = useState(preselectedId ?? '');
  const [label, setLabel] = useState('');
  const [vialAmountMg, setVialAmountMg] = useState('');
  const [bacWaterMl, setBacWaterMl] = useState('');
  const [desiredDose, setDesiredDose] = useState('');
  const [doseUnit, setDoseUnit] = useState<DoseUnit>('mcg');
  const [showPeptidePicker, setShowPeptidePicker] = useState(!preselectedId);

  const selectedPeptide = getPeptideById(selectedPeptideId);

  const result: CalcResult | null = useMemo(() => {
    const mg = parseFloat(vialAmountMg);
    const bac = parseFloat(bacWaterMl);
    const dose = parseFloat(desiredDose);
    if (!mg || !bac || !dose) return null;
    return calculateFromReconstitution({ vialAmountMg: mg, bacWaterMl: bac, desiredDose: dose, desiredDoseUnit: doseUnit });
  }, [vialAmountMg, bacWaterMl, desiredDose, doseUnit]);

  function handleSave() {
    if (!selectedPeptide || !result) {
      Alert.alert('Missing info', 'Please select a peptide and fill in all fields.');
      return;
    }
    const vial = {
      id: Date.now().toString(),
      peptideId: selectedPeptide.id,
      peptideName: selectedPeptide.name,
      label: label || undefined,
      type: 'single' as const,
      concentrationMcgPerMl: result.concentrationMcgPerMl,
      totalVolumeMl: parseFloat(bacWaterMl),
      reconstitutedDate: new Date().toISOString(),
      bacWaterMl: parseFloat(bacWaterMl),
      originalAmountMg: parseFloat(vialAmountMg),
    };
    addVial(vial);
    logActivity({
      id: Date.now().toString(),
      date: new Date().toISOString(),
      type: 'vial_saved',
      title: `Reconstituted ${selectedPeptide.name}`,
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

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Reconstitute Peptide</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn}>
          <X size={20} color={Colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        {/* Step 1: Peptide selector */}
        <Text style={styles.stepLabel}>STEP 1 — SELECT PEPTIDE</Text>

        <TouchableOpacity
          style={[styles.selectorBtn, selectedPeptide && styles.selectorBtnFilled]}
          onPress={() => setShowPeptidePicker(true)}
          activeOpacity={0.8}
        >
          <Text style={selectedPeptide ? styles.selectorTextFilled : styles.selectorText}>
            {selectedPeptide ? selectedPeptide.name : 'Tap to select a peptide ▾'}
          </Text>
        </TouchableOpacity>

        {/* Optional label */}
        <FormField
          label="Label (optional)"
          value={label}
          onChangeText={setLabel}
          placeholder="e.g. Vial #1, Batch A"
          keyboardType="default"
        />

        {/* Step 2: Calculator inputs */}
        {selectedPeptide && (
          <>
            <Text style={styles.stepLabel}>STEP 2 — CALCULATOR</Text>

            <FormField
              label="Vial amount (mg)"
              value={vialAmountMg}
              onChangeText={setVialAmountMg}
              placeholder="e.g. 5"
              hint={`Typical: ${selectedPeptide.typicalDose} ${selectedPeptide.doseUnit}`}
            />
            <FormField
              label="BAC water added (mL)"
              value={bacWaterMl}
              onChangeText={setBacWaterMl}
              placeholder="e.g. 2"
            />
            <FormField
              label="Desired dose"
              value={desiredDose}
              onChangeText={setDesiredDose}
              placeholder="e.g. 500"
              units={DOSE_UNITS}
              selectedUnit={doseUnit}
              onUnitChange={(u) => setDoseUnit(u as DoseUnit)}
            />

            {/* Live result */}
            <CalcResultPanel result={result} />
          </>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <GradientButton
          label="Save Vial"
          onPress={handleSave}
          disabled={!result || !selectedPeptide}
        />
      </View>

      {/* Inline peptide picker sheet */}
      {showPeptidePicker && (
        <View style={styles.pickerSheet}>
          <View style={styles.pickerHeader}>
            <Text style={styles.pickerTitle}>Select Peptide</Text>
            <TouchableOpacity onPress={() => setShowPeptidePicker(false)}>
              <X size={20} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>
          <ScrollView>
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
    fontSize: Typography.lg,
    fontWeight: FontWeight.extrabold,
  },
  closeBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: Colors.surfaceElevated,
    alignItems: 'center', justifyContent: 'center',
  },
  scroll: { paddingHorizontal: Spacing.lg, paddingBottom: 32 },
  stepLabel: {
    color: Colors.accentOrange,
    fontSize: Typography.xs,
    fontWeight: FontWeight.semibold,
    letterSpacing: 1.5,
    marginBottom: Spacing.md,
    marginTop: Spacing.md,
  },
  selectorBtn: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: Radii.lg,
    borderWidth: 1.5,
    borderColor: Colors.surfaceBorder,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  selectorBtnFilled: { borderColor: Colors.accentOrange },
  selectorText: { color: Colors.textTertiary, fontSize: Typography.base },
  selectorTextFilled: {
    color: Colors.textPrimary,
    fontSize: Typography.base,
    fontWeight: FontWeight.semibold,
  },
  footer: { padding: Spacing.lg, paddingBottom: 40 },
  // Picker sheet
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
