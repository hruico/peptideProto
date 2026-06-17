import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { X, ChevronLeft } from 'lucide-react-native';
import { useState } from 'react';
import { PEPTIDES } from '../../data/peptides';
import { useVialStore } from '../../store/useVialStore';
import { Colors, Radii, Typography, FontWeight, Spacing } from '../../constants/theme';

type Step = 'select' | 'dose' | 'vial' | 'water';

const DOSE_PRESETS = ['0.2', '0.3', '0.4', '0.5', '0.6', '1.0'];
const VIAL_PRESETS = ['5', '10', '15', '20', '30'];

function genId() { return Math.random().toString(36).slice(2) + Date.now().toString(36); }

function getCategoryColor(cat: string): string {
  const map: Record<string, string> = {
    'Recovery & Healing': '#EF4444', 'Fat Loss': '#F97316', 'Muscle & Performance': '#3B82F6',
    'Cognitive & Neuroprotection': '#8B5CF6', 'Sleep & Longevity': '#6366F1',
    'Skin & Aesthetics': '#EC4899', 'GI & Gut Health': '#22C55E',
  };
  return map[cat] ?? '#999';
}

export default function NewPeptideScreen() {
  const { prefillId } = useLocalSearchParams<{ prefillId?: string }>();
  const { addVial } = useVialStore();

  const [step, setStep] = useState<Step>(prefillId ? 'dose' : 'select');
  const [selectedId, setSelectedId] = useState(prefillId ?? '');
  const [doseInput, setDoseInput] = useState('0.5');
  const [doseUnit, setDoseUnit] = useState<'mg' | 'mcg'>('mg');
  const [vialInput, setVialInput] = useState('10');
  const [showKeypad, setShowKeypad] = useState<'dose' | 'vial' | null>(null);
  const [keypadValue, setKeypadValue] = useState('');

  const selectedPeptide = PEPTIDES.find(p => p.id === selectedId);
  const bacWater = (parseFloat(vialInput) * 0.5).toFixed(1);
  const vialMg = parseFloat(vialInput) || 10;
  const doseMg = doseUnit === 'mg' ? parseFloat(doseInput) : parseFloat(doseInput) / 1000;
  const doseMcg = doseMg * 1000;
  const concMcgPerMl = (vialMg * 1000) / parseFloat(bacWater);
  const drawMl = doseMcg / concMcgPerMl;
  const syringeUnits = (drawMl * 100).toFixed(1);

  const stepIndex = { select: 0, dose: 1, vial: 2, water: 3 }[step];
  const steps = ['Peptide', 'Dose', 'Vial', 'Water'];

  function handleSave() {
    addVial({
      id: genId(),
      peptideId: selectedId,
      peptideName: selectedPeptide?.name ?? selectedId,
      type: 'single',
      concentrationMcgPerMl: concMcgPerMl,
      totalVolumeMl: parseFloat(bacWater),
      reconstitutedDate: new Date().toISOString(),
      bacWaterMl: parseFloat(bacWater),
      originalAmountMg: vialMg,
    });
    router.back();
  }

  function KeypadInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
    return (
      <View style={kpStyles.keypad}>
        {['1','2','3','4','5','6','7','8','9','.','0','⌫'].map((k) => (
          <TouchableOpacity
            key={k} style={kpStyles.key}
            onPress={() => {
              if (k === '⌫') onChange(value.slice(0, -1) || '0');
              else if (k === '.' && value.includes('.')) return;
              else onChange(value === '0' && k !== '.' ? k : value + k);
            }}
          >
            <Text style={kpStyles.keyText}>{k}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* Nav */}
      <View style={styles.navBar}>
        <TouchableOpacity onPress={() => step === 'select' ? router.back() : setStep(steps[stepIndex - 1].toLowerCase() as Step)} style={styles.navBtn}>
          {step === 'select' ? <X size={20} color={Colors.textPrimary} /> : <ChevronLeft size={20} color={Colors.textPrimary} />}
        </TouchableOpacity>
        <Text style={styles.navTitle}>Reconstitute</Text>
        <View style={{ width: 36 }} />
      </View>

      {/* Step pills */}
      {step !== 'select' && (
        <View style={styles.stepRow}>
          {['dose', 'vial', 'water'].map((s, i) => (
            <View key={s} style={[styles.stepPill, step === s && styles.stepPillActive]}>
              <Text style={[styles.stepPillText, step === s && styles.stepPillTextActive]}>{s}</Text>
            </View>
          ))}
        </View>
      )}

      {/* STEP: SELECT PEPTIDE */}
      {step === 'select' && (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
          <Text style={styles.stepHeadline}>Select a peptide</Text>
          {PEPTIDES.map((p) => (
            <TouchableOpacity
              key={p.id}
              style={[styles.peptideRow, selectedId === p.id && styles.peptideRowSelected]}
              onPress={() => setSelectedId(p.id)}
              activeOpacity={0.7}
            >
              <View style={[styles.peptideAvatar, { backgroundColor: getCategoryColor(p.category) }]}>
                <Text style={styles.peptideAvatarLetter}>{p.name[0]}</Text>
              </View>
              <View style={styles.peptideInfo}>
                <Text style={styles.peptideName}>{p.name}</Text>
                <Text style={styles.peptideCategory}>{p.category}</Text>
              </View>
              {selectedId === p.id && <View style={styles.selectedDot} />}
            </TouchableOpacity>
          ))}
          <View style={{ height: 100 }} />
        </ScrollView>
      )}

      {/* STEP: DOSE */}
      {step === 'dose' && (
        <View style={styles.stepContent}>
          <Text style={styles.stepHeadline}>Single Dose Amount</Text>
          <TouchableOpacity style={styles.bigDisplay} onPress={() => { setKeypadValue(doseInput); setShowKeypad('dose'); }}>
            <Text style={styles.bigNum}>{doseInput}</Text>
          </TouchableOpacity>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.presetsRow}>
            {DOSE_PRESETS.map((p) => (
              <TouchableOpacity
                key={p}
                style={[styles.preset, doseInput === p && styles.presetActive]}
                onPress={() => setDoseInput(p)}
              >
                <Text style={[styles.presetText, doseInput === p && styles.presetTextActive]}>{p} {doseUnit}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <View style={styles.unitRow}>
            {(['mg', 'mcg'] as const).map((u) => (
              <TouchableOpacity key={u} style={[styles.unitBtn, doseUnit === u && styles.unitBtnActive]} onPress={() => setDoseUnit(u)}>
                <Text style={[styles.unitBtnText, doseUnit === u && styles.unitBtnTextActive]}>{u}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* STEP: VIAL SIZE */}
      {step === 'vial' && (
        <View style={styles.stepContent}>
          <Text style={styles.stepHeadline}>Vial Size</Text>
          <TouchableOpacity style={styles.bigDisplay} onPress={() => { setKeypadValue(vialInput); setShowKeypad('vial'); }}>
            <Text style={styles.bigNum}>{vialInput}</Text>
            <Text style={styles.bigUnit}>mg</Text>
          </TouchableOpacity>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.presetsRow}>
            {VIAL_PRESETS.map((p) => (
              <TouchableOpacity
                key={p}
                style={[styles.preset, vialInput === p && styles.presetActive]}
                onPress={() => setVialInput(p)}
              >
                <Text style={[styles.presetText, vialInput === p && styles.presetTextActive]}>{p} mg</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <View style={styles.bacNote}>
            <Text style={styles.bacNoteLabel}>Recommended BAC water</Text>
            <Text style={styles.bacNoteValue}>{bacWater} mL</Text>
          </View>
        </View>
      )}

      {/* STEP: WATER */}
      {step === 'water' && (
        <View style={styles.stepContent}>
          <View style={styles.summaryPills}>
            <View style={styles.summaryPill}><Text style={styles.summaryPillText}>{doseInput} {doseUnit}</Text></View>
            <View style={styles.summaryPill}><Text style={styles.summaryPillText}>{vialInput} mg vial</Text></View>
            <View style={styles.summaryPill}><Text style={styles.summaryPillText}>{bacWater} mL water</Text></View>
          </View>
          <View style={styles.dropletIcon}><Text style={{ fontSize: 64 }}>💧</Text></View>
          <Text style={styles.bigResultNum}>{bacWater} mL</Text>
          <Text style={styles.bacEquiv}>{bacWater} mL = {(parseFloat(bacWater) * 100).toFixed(0)} units on an insulin syringe</Text>
          <View style={styles.resultCard}>
            <Text style={styles.resultLabel}>When you take your {doseInput} {doseUnit} {selectedPeptide?.name ?? ''} dose, draw to</Text>
            <Text style={styles.resultUnits}>{syringeUnits} units</Text>
            <Text style={styles.resultSub}>on your syringe</Text>
          </View>
        </View>
      )}

      {/* Bottom CTA */}
      <View style={styles.footer}>
        {step === 'select' && (
          <TouchableOpacity
            style={[styles.ctaBtn, !selectedId && styles.ctaBtnDisabled]}
            disabled={!selectedId}
            onPress={() => setStep('dose')}
            activeOpacity={0.85}
          >
            <Text style={styles.ctaBtnText}>NEXT: ENTER DOSE →</Text>
          </TouchableOpacity>
        )}
        {step === 'dose' && (
          <TouchableOpacity style={styles.ctaBtn} onPress={() => setStep('vial')} activeOpacity={0.85}>
            <Text style={styles.ctaBtnText}>Confirm Dose</Text>
          </TouchableOpacity>
        )}
        {step === 'vial' && (
          <TouchableOpacity style={styles.ctaBtn} onPress={() => setStep('water')} activeOpacity={0.85}>
            <Text style={styles.ctaBtnText}>Confirm Vial Size</Text>
          </TouchableOpacity>
        )}
        {step === 'water' && (
          <TouchableOpacity style={styles.ctaBtn} onPress={handleSave} activeOpacity={0.85}>
            <Text style={styles.ctaBtnText}>Save & Done</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Keypad Modal */}
      <Modal visible={showKeypad !== null} transparent animationType="slide" onRequestClose={() => setShowKeypad(null)}>
        <View style={kpStyles.overlay}>
          <View style={kpStyles.sheet}>
            <Text style={kpStyles.sheetTitle}>{showKeypad === 'dose' ? 'Dose Amount' : 'Vial Size'}</Text>
            <Text style={kpStyles.display}>{keypadValue || '0'}</Text>
            <KeypadInput
              value={keypadValue}
              onChange={setKeypadValue}
            />
            <TouchableOpacity
              style={kpStyles.doneBtn}
              onPress={() => {
                if (showKeypad === 'dose') setDoseInput(keypadValue || '0.5');
                else setVialInput(keypadValue || '10');
                setShowKeypad(null);
              }}
            >
              <Text style={kpStyles.doneBtnText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const kpStyles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: Colors.base, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: Spacing.lg, paddingBottom: 40 },
  sheetTitle: { fontSize: Typography.base, fontWeight: FontWeight.bold, color: Colors.textPrimary, textAlign: 'center', marginBottom: Spacing.md },
  display: { fontSize: 56, fontWeight: FontWeight.extrabold, color: Colors.textPrimary, textAlign: 'center', marginBottom: Spacing.md },
  keypad: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, marginBottom: Spacing.md },
  key: { width: '30%', paddingVertical: Spacing.md, borderRadius: Radii.lg, backgroundColor: Colors.surface, alignItems: 'center' },
  keyText: { fontSize: Typography.xl, color: Colors.textPrimary, fontWeight: FontWeight.medium },
  doneBtn: { backgroundColor: Colors.primaryOrange, borderRadius: 32, paddingVertical: 16, alignItems: 'center' },
  doneBtnText: { color: '#fff', fontSize: Typography.base, fontWeight: FontWeight.bold },
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.base },
  navBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg, paddingTop: 52, paddingBottom: Spacing.md,
    borderBottomWidth: 1, borderBottomColor: Colors.surfaceBorder,
  },
  navBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.surface, alignItems: 'center', justifyContent: 'center' },
  navTitle: { fontSize: Typography.base, fontWeight: FontWeight.bold, color: Colors.textPrimary },
  stepRow: { flexDirection: 'row', gap: Spacing.sm, paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md },
  stepPill: { paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs, borderRadius: Radii.full, backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.surfaceBorder },
  stepPillActive: { backgroundColor: Colors.primaryOrangeLight, borderColor: Colors.primaryOrange },
  stepPillText: { fontSize: Typography.xs, color: Colors.textTertiary, fontWeight: FontWeight.medium, textTransform: 'capitalize' },
  stepPillTextActive: { color: Colors.primaryOrange, fontWeight: FontWeight.bold },
  scroll: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.md },
  stepContent: { flex: 1, paddingHorizontal: Spacing.lg, paddingTop: Spacing.xl, alignItems: 'center' },
  stepHeadline: { fontSize: Typography.xl, fontWeight: FontWeight.extrabold, color: Colors.textPrimary, marginBottom: Spacing.xl, alignSelf: 'flex-start' },
  peptideRow: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    backgroundColor: Colors.surface, borderRadius: Radii.lg, padding: Spacing.md,
    marginBottom: Spacing.sm, borderWidth: 1.5, borderColor: Colors.surfaceBorder,
  },
  peptideRowSelected: { borderColor: Colors.primaryOrange, backgroundColor: Colors.primaryOrangeLight },
  peptideAvatar: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  peptideAvatarLetter: { color: '#fff', fontSize: Typography.md, fontWeight: FontWeight.bold },
  peptideInfo: { flex: 1 },
  peptideName: { fontSize: Typography.base, fontWeight: FontWeight.bold, color: Colors.textPrimary },
  peptideCategory: { fontSize: Typography.xs, color: Colors.textSecondary, marginTop: 2 },
  selectedDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.primaryOrange },
  bigDisplay: {
    backgroundColor: Colors.surface, borderRadius: Radii.xl, padding: Spacing.xl,
    flexDirection: 'row', alignItems: 'baseline', gap: Spacing.sm,
    borderWidth: 1, borderColor: Colors.surfaceBorder, marginBottom: Spacing.lg,
    width: '100%', justifyContent: 'center',
  },
  bigNum: { fontSize: 64, fontWeight: FontWeight.extrabold, color: Colors.textPrimary },
  bigUnit: { fontSize: Typography.xl, color: Colors.textSecondary },
  presetsRow: { width: '100%', marginBottom: Spacing.lg },
  preset: {
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm,
    borderRadius: Radii.full, backgroundColor: Colors.surface,
    borderWidth: 1, borderColor: Colors.surfaceBorder, marginRight: Spacing.sm,
  },
  presetActive: { backgroundColor: Colors.primaryOrangeLight, borderColor: Colors.primaryOrange },
  presetText: { fontSize: Typography.sm, color: Colors.textSecondary },
  presetTextActive: { color: Colors.primaryOrange, fontWeight: FontWeight.bold },
  unitRow: { flexDirection: 'row', gap: Spacing.sm, width: '100%' },
  unitBtn: {
    flex: 1, paddingVertical: Spacing.md, borderRadius: Radii.full,
    backgroundColor: Colors.surface, alignItems: 'center', borderWidth: 1, borderColor: Colors.surfaceBorder,
  },
  unitBtnActive: { backgroundColor: Colors.primaryOrangeLight, borderColor: Colors.primaryOrange },
  unitBtnText: { fontSize: Typography.base, color: Colors.textSecondary },
  unitBtnTextActive: { color: Colors.primaryOrange, fontWeight: FontWeight.bold },
  bacNote: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    width: '100%', backgroundColor: Colors.primaryOrangeLight, borderRadius: Radii.lg,
    padding: Spacing.md, marginTop: Spacing.md,
  },
  bacNoteLabel: { fontSize: Typography.sm, color: Colors.primaryOrange },
  bacNoteValue: { fontSize: Typography.lg, fontWeight: FontWeight.extrabold, color: Colors.primaryOrange },
  summaryPills: { flexDirection: 'row', gap: Spacing.sm, flexWrap: 'wrap', justifyContent: 'center', marginBottom: Spacing.xl },
  summaryPill: { backgroundColor: Colors.surface, borderRadius: Radii.full, paddingHorizontal: Spacing.md, paddingVertical: 6, borderWidth: 1, borderColor: Colors.surfaceBorder },
  summaryPillText: { fontSize: Typography.xs, color: Colors.textPrimary, fontWeight: FontWeight.medium },
  dropletIcon: { marginBottom: Spacing.sm },
  bigResultNum: { fontSize: 56, fontWeight: FontWeight.extrabold, color: Colors.primaryOrange, marginBottom: Spacing.sm },
  bacEquiv: { fontSize: Typography.sm, color: Colors.textSecondary, textAlign: 'center', marginBottom: Spacing.xl },
  resultCard: {
    width: '100%', backgroundColor: Colors.primaryOrangeLight, borderRadius: Radii.xl,
    padding: Spacing.lg, alignItems: 'center', borderWidth: 1, borderColor: Colors.primaryOrange,
  },
  resultLabel: { fontSize: Typography.sm, color: Colors.textSecondary, textAlign: 'center', marginBottom: Spacing.sm },
  resultUnits: { fontSize: 48, fontWeight: FontWeight.extrabold, color: Colors.primaryOrange },
  resultSub: { fontSize: Typography.base, color: Colors.textSecondary },
  footer: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    padding: Spacing.lg, paddingBottom: 36, backgroundColor: Colors.base,
    borderTopWidth: 1, borderTopColor: Colors.surfaceBorder,
  },
  ctaBtn: { backgroundColor: Colors.primaryOrange, borderRadius: 32, paddingVertical: 18, alignItems: 'center' },
  ctaBtnDisabled: { backgroundColor: Colors.surfaceBorder },
  ctaBtnText: { color: '#fff', fontSize: Typography.base, fontWeight: FontWeight.bold },
});
