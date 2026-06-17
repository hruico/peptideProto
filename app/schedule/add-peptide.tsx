import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  Modal, TextInput,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { X, Plus, Clock } from 'lucide-react-native';
import { useState } from 'react';
import { getPeptideById } from '../../data/peptides';
import { useScheduleStore } from '../../store/useScheduleStore';
import { Colors, Radii, Typography, FontWeight, Spacing } from '../../constants/theme';

const DAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const PRESET_DOSES = ['0.1', '0.2', '0.3', '0.4', '0.5', '0.6', '1.0', '2.0'];
const DURATION_UNITS = ['days', 'weeks', 'months'];

function genId() { return Math.random().toString(36).slice(2) + Date.now().toString(36); }

export default function AddPeptideScreen() {
  const { peptideId, titrationMode } = useLocalSearchParams<{ peptideId: string; titrationMode?: string }>();
  const peptide = getPeptideById(peptideId);
  const { addScheduledPeptide } = useScheduleStore();

  const [dose, setDose] = useState('0.5');
  const [unit, setUnit] = useState<'mg' | 'mcg'>('mg');
  const [frequency, setFrequency] = useState<'once' | 'twice'>('once');
  const [times, setTimes] = useState<string[]>(['09:00']);
  const [days, setDays] = useState<number[]>([0, 1, 2, 3, 4, 5, 6]);
  const [durationValue, setDurationValue] = useState(4);
  const [durationUnit, setDurationUnit] = useState<'days' | 'weeks' | 'months'>('weeks');
  const [runIndefinitely, setRunIndefinitely] = useState(false);
  const [showDosePicker, setShowDosePicker] = useState(false);
  const [doseInput, setDoseInput] = useState('0.5');

  function toggleDay(d: number) {
    setDays(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d].sort());
  }

  function handleFrequency(f: 'once' | 'twice') {
    setFrequency(f);
    setTimes(f === 'once' ? ['09:00'] : ['09:00', '21:00']);
  }

  function handleSave() {
    const startDate = new Date().toISOString();
    const daysCount = durationUnit === 'days' ? durationValue
      : durationUnit === 'weeks' ? durationValue * 7
      : durationValue * 30;
    const endDate = runIndefinitely ? undefined : new Date(Date.now() + daysCount * 86400000).toISOString();

    addScheduledPeptide({
      id: genId(),
      peptideId: peptideId ?? '',
      label: peptide?.name,
      dose: parseFloat(dose) || 0.5,
      unit,
      frequency,
      times,
      days,
      durationValue,
      durationUnit,
      runIndefinitely,
      startDate,
      endDate,
      titrationMode: titrationMode as any,
    });
    router.push({ pathname: '/tracking/intro' as any, params: { peptideId } });
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.navBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn}>
          <X size={20} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.navTitle}>Add {peptide?.name ?? 'Peptide'}</Text>
        <View style={{ width: 36 }} />
      </View>

      {/* Info banner */}
      <View style={styles.infoBanner}>
        <Text style={styles.infoBannerText}>
          ℹ️ Autofilled from peptide guidance — You can change anything here.
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* Dose display */}
        <Text style={styles.sectionLabel}>DOSE PER ADMINISTRATION</Text>
        <TouchableOpacity style={styles.doseDisplay} onPress={() => { setDoseInput(dose); setShowDosePicker(true); }}>
          <Text style={styles.doseAmount}>{dose}</Text>
          <Text style={styles.doseUnit}>{unit}</Text>
        </TouchableOpacity>

        {/* Frequency */}
        <Text style={styles.sectionLabel}>FREQUENCY</Text>
        <View style={styles.freqRow}>
          {(['once', 'twice'] as const).map((f) => (
            <TouchableOpacity
              key={f}
              style={[styles.freqBtn, frequency === f && styles.freqBtnActive]}
              onPress={() => handleFrequency(f)}
            >
              <Text style={[styles.freqBtnText, frequency === f && styles.freqBtnTextActive]}>
                {f === 'once' ? 'Once a day' : 'Twice a day'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Time slots */}
        <Text style={styles.sectionLabel}>TIME</Text>
        {times.map((t, i) => (
          <View key={i} style={styles.timeRow}>
            <Clock size={16} color={Colors.textSecondary} />
            <Text style={styles.timeText}>{t} — {peptide?.name} {dose}{unit}</Text>
            {times.length > 1 && (
              <TouchableOpacity onPress={() => setTimes(times.filter((_, idx) => idx !== i))}>
                <X size={14} color={Colors.textTertiary} />
              </TouchableOpacity>
            )}
          </View>
        ))}
        <TouchableOpacity style={styles.addTimeBtn} onPress={() => setTimes([...times, '18:00'])}>
          <Plus size={14} color={Colors.primaryOrange} />
          <Text style={styles.addTimeBtnText}>Add Another Time</Text>
        </TouchableOpacity>

        {/* Days */}
        <Text style={styles.sectionLabel}>DAYS PER WEEK</Text>
        <View style={styles.daysRow}>
          {DAY_LABELS.map((label, i) => (
            <TouchableOpacity
              key={i}
              style={[styles.dayCircle, days.includes(i) && styles.dayCircleActive]}
              onPress={() => toggleDay(i)}
            >
              <Text style={[styles.dayLabel, days.includes(i) && styles.dayLabelActive]}>{label}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.daysNote}>7 days per week recommended</Text>

        {/* Duration */}
        <Text style={styles.sectionLabel}>DURATION</Text>
        <View style={styles.durationRow}>
          {DURATION_UNITS.map((u) => (
            <TouchableOpacity
              key={u}
              style={[styles.durationUnitBtn, durationUnit === u && styles.durationUnitBtnActive]}
              onPress={() => setDurationUnit(u as any)}
            >
              <Text style={[styles.durationUnitText, durationUnit === u && styles.durationUnitTextActive]}>
                {u.charAt(0).toUpperCase() + u.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.stepperRow}>
          <TouchableOpacity style={styles.stepperBtn} onPress={() => setDurationValue(Math.max(1, durationValue - 1))}>
            <Text style={styles.stepperBtnText}>−</Text>
          </TouchableOpacity>
          <Text style={styles.stepperValue}>{durationValue}</Text>
          <TouchableOpacity style={styles.stepperBtn} onPress={() => setDurationValue(durationValue + 1)}>
            <Text style={styles.stepperBtnText}>+</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.indefiniteRow}
          onPress={() => setRunIndefinitely(!runIndefinitely)}
        >
          <View style={[styles.toggle, runIndefinitely && styles.toggleOn]}>
            <View style={[styles.toggleThumb, runIndefinitely && styles.toggleThumbOn]} />
          </View>
          <Text style={styles.indefiniteLabel}>Keep this running indefinitely</Text>
        </TouchableOpacity>

        <View style={{ height: 100 }} />
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.saveBtn} onPress={handleSave} activeOpacity={0.85}>
          <Text style={styles.saveBtnText}>Save Schedule</Text>
        </TouchableOpacity>
      </View>

      {/* Dose Picker Modal */}
      <Modal visible={showDosePicker} transparent animationType="slide" onRequestClose={() => setShowDosePicker(false)}>
        <View style={doseStyles.overlay}>
          <View style={doseStyles.sheet}>
            <Text style={doseStyles.title}>{peptide?.name} — Enter the amount per dose</Text>
            <Text style={doseStyles.display}>{doseInput || '0'}</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={doseStyles.presets}>
              {PRESET_DOSES.map((p) => (
                <TouchableOpacity
                  key={p}
                  style={[doseStyles.preset, doseInput === p && doseStyles.presetActive]}
                  onPress={() => setDoseInput(p)}
                >
                  <Text style={[doseStyles.presetText, doseInput === p && doseStyles.presetTextActive]}>{p}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            {/* Keypad */}
            <View style={doseStyles.keypad}>
              {['1','2','3','4','5','6','7','8','9','.','0','⌫'].map((k) => (
                <TouchableOpacity
                  key={k} style={doseStyles.key}
                  onPress={() => {
                    if (k === '⌫') setDoseInput(prev => prev.slice(0, -1));
                    else if (k === '.' && doseInput.includes('.')) return;
                    else setDoseInput(prev => (prev === '0' && k !== '.') ? k : prev + k);
                  }}
                >
                  <Text style={doseStyles.keyText}>{k}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={doseStyles.unitRow}>
              {(['mg', 'mcg'] as const).map((u) => (
                <TouchableOpacity
                  key={u}
                  style={[doseStyles.unitBtn, unit === u && doseStyles.unitBtnActive]}
                  onPress={() => setUnit(u)}
                >
                  <Text style={[doseStyles.unitBtnText, unit === u && doseStyles.unitBtnTextActive]}>{u}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity style={doseStyles.doneBtn} onPress={() => { setDose(doseInput || '0.5'); setShowDosePicker(false); }}>
              <Text style={doseStyles.doneBtnText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const doseStyles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: Colors.base, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: Spacing.lg, paddingBottom: 40 },
  title: { fontSize: Typography.sm, color: Colors.textSecondary, textAlign: 'center', marginBottom: Spacing.md },
  display: { fontSize: 64, fontWeight: FontWeight.extrabold, color: Colors.textPrimary, textAlign: 'center', marginBottom: Spacing.md },
  presets: { flexDirection: 'row', marginBottom: Spacing.md },
  preset: {
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, borderRadius: Radii.full,
    backgroundColor: Colors.surface, marginRight: Spacing.sm, borderWidth: 1, borderColor: Colors.surfaceBorder,
  },
  presetActive: { backgroundColor: Colors.primaryOrangeLight, borderColor: Colors.primaryOrange },
  presetText: { fontSize: Typography.sm, color: Colors.textPrimary },
  presetTextActive: { color: Colors.primaryOrange, fontWeight: FontWeight.bold },
  keypad: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, marginBottom: Spacing.md },
  key: {
    width: '30%', paddingVertical: Spacing.md, borderRadius: Radii.lg,
    backgroundColor: Colors.surface, alignItems: 'center',
  },
  keyText: { fontSize: Typography.xl, color: Colors.textPrimary, fontWeight: FontWeight.medium },
  unitRow: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.md },
  unitBtn: {
    flex: 1, paddingVertical: Spacing.sm, borderRadius: Radii.full,
    backgroundColor: Colors.surface, alignItems: 'center', borderWidth: 1, borderColor: Colors.surfaceBorder,
  },
  unitBtnActive: { backgroundColor: Colors.primaryOrangeLight, borderColor: Colors.primaryOrange },
  unitBtnText: { fontSize: Typography.base, color: Colors.textPrimary },
  unitBtnTextActive: { color: Colors.primaryOrange, fontWeight: FontWeight.bold },
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
  closeBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.surface, alignItems: 'center', justifyContent: 'center' },
  navTitle: { fontSize: Typography.base, fontWeight: FontWeight.bold, color: Colors.textPrimary },
  infoBanner: {
    backgroundColor: Colors.primaryOrangeLight, padding: Spacing.md, marginHorizontal: Spacing.lg,
    marginTop: Spacing.md, borderRadius: Radii.lg,
  },
  infoBannerText: { fontSize: Typography.xs, color: Colors.primaryOrange, lineHeight: 18 },
  scroll: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.lg },
  sectionLabel: {
    fontSize: Typography.xs, color: Colors.textTertiary, fontWeight: FontWeight.semibold,
    letterSpacing: 1.5, marginBottom: Spacing.sm, marginTop: Spacing.lg,
  },
  doseDisplay: {
    flexDirection: 'row', alignItems: 'baseline', gap: Spacing.sm,
    backgroundColor: Colors.surface, borderRadius: Radii.xl, padding: Spacing.lg,
    borderWidth: 1, borderColor: Colors.surfaceBorder,
  },
  doseAmount: { fontSize: 48, fontWeight: FontWeight.extrabold, color: Colors.textPrimary },
  doseUnit: { fontSize: Typography.xl, color: Colors.textSecondary },
  freqRow: { flexDirection: 'row', gap: Spacing.sm },
  freqBtn: {
    flex: 1, paddingVertical: Spacing.md, borderRadius: Radii.xl,
    backgroundColor: Colors.surface, alignItems: 'center', borderWidth: 1.5, borderColor: Colors.surfaceBorder,
  },
  freqBtnActive: { backgroundColor: Colors.primaryOrangeLight, borderColor: Colors.primaryOrange },
  freqBtnText: { fontSize: Typography.sm, color: Colors.textSecondary, fontWeight: FontWeight.medium },
  freqBtnTextActive: { color: Colors.primaryOrange, fontWeight: FontWeight.bold },
  timeRow: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    backgroundColor: Colors.surface, borderRadius: Radii.lg, padding: Spacing.md,
    marginBottom: Spacing.sm, borderWidth: 1, borderColor: Colors.surfaceBorder,
  },
  timeText: { flex: 1, fontSize: Typography.base, color: Colors.textPrimary },
  addTimeBtn: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.sm,
    borderWidth: 1.5, borderColor: Colors.primaryOrange, borderStyle: 'dashed',
    borderRadius: Radii.lg, padding: Spacing.md,
  },
  addTimeBtnText: { color: Colors.primaryOrange, fontSize: Typography.sm, fontWeight: FontWeight.semibold },
  daysRow: { flexDirection: 'row', justifyContent: 'space-between' },
  dayCircle: {
    width: 40, height: 40, borderRadius: 20, borderWidth: 1.5, borderColor: Colors.surfaceBorder,
    alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.surface,
  },
  dayCircleActive: { backgroundColor: Colors.primaryOrange, borderColor: Colors.primaryOrange },
  dayLabel: { fontSize: Typography.sm, color: Colors.textSecondary, fontWeight: FontWeight.medium },
  dayLabelActive: { color: '#fff', fontWeight: FontWeight.bold },
  daysNote: { fontSize: Typography.xs, color: Colors.textTertiary, marginTop: Spacing.sm },
  durationRow: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.md },
  durationUnitBtn: {
    flex: 1, paddingVertical: Spacing.sm, borderRadius: Radii.full,
    backgroundColor: Colors.surface, alignItems: 'center', borderWidth: 1, borderColor: Colors.surfaceBorder,
  },
  durationUnitBtnActive: { backgroundColor: Colors.primaryOrangeLight, borderColor: Colors.primaryOrange },
  durationUnitText: { fontSize: Typography.sm, color: Colors.textSecondary },
  durationUnitTextActive: { color: Colors.primaryOrange, fontWeight: FontWeight.bold },
  stepperRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.lg, justifyContent: 'center', marginBottom: Spacing.md },
  stepperBtn: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: Colors.surface,
    alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Colors.surfaceBorder,
  },
  stepperBtnText: { fontSize: Typography.xl, color: Colors.textPrimary },
  stepperValue: { fontSize: Typography.xxl, fontWeight: FontWeight.extrabold, color: Colors.textPrimary, minWidth: 60, textAlign: 'center' },
  indefiniteRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, paddingVertical: Spacing.md },
  toggle: {
    width: 44, height: 26, borderRadius: 13, backgroundColor: Colors.surfaceBorder, justifyContent: 'center', paddingHorizontal: 3,
  },
  toggleOn: { backgroundColor: Colors.primaryOrange },
  toggleThumb: { width: 20, height: 20, borderRadius: 10, backgroundColor: '#fff' },
  toggleThumbOn: { alignSelf: 'flex-end' },
  indefiniteLabel: { fontSize: Typography.base, color: Colors.textPrimary },
  footer: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    padding: Spacing.lg, paddingBottom: 36, backgroundColor: Colors.base,
    borderTopWidth: 1, borderTopColor: Colors.surfaceBorder,
  },
  saveBtn: { backgroundColor: Colors.primaryOrange, borderRadius: 32, paddingVertical: 18, alignItems: 'center' },
  saveBtnText: { color: '#fff', fontSize: Typography.base, fontWeight: FontWeight.bold },
});
