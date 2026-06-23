import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { X } from 'lucide-react-native';
import { useState } from 'react';
import { addWeeks, format } from 'date-fns';
import { useTrackingStore } from '../../store/useTrackingStore';
import { Colors, Radii, Typography, FontWeight, Spacing } from '../../constants/theme';
import ScreenBackground from '../../components/ScreenBackground';

function genId() { return Math.random().toString(36).slice(2) + Date.now().toString(36); }

const METRIC_META: Record<string, { unit: string; placeholder: string }> = {
  'pain-level': { unit: '1–10', placeholder: '5' },
  'energy': { unit: '1–10', placeholder: '6' },
  'body-weight': { unit: 'kg', placeholder: '70' },
  'skin-clarity': { unit: '1–10', placeholder: '5' },
  'sleep-quality': { unit: '1–10', placeholder: '6' },
  'focus': { unit: '1–10', placeholder: '7' },
  'inflammation': { unit: '1–10', placeholder: '4' },
  'muscle-soreness': { unit: '1–10', placeholder: '3' },
};

export default function BaselineScreen() {
  const { peptideId, metrics, durationWeeks } = useLocalSearchParams<{ peptideId: string; metrics: string; durationWeeks: string }>();
  const metricIds: string[] = JSON.parse(metrics ?? '[]');
  const weeks = parseInt(durationWeeks ?? '4');
  const [values, setValues] = useState<Record<string, string>>({});
  const { addSession } = useTrackingStore();

  function handleSave() {
    const endDate = addWeeks(new Date(), weeks);
    addSession({
      id: genId(),
      peptideId: peptideId ?? '',
      metrics: metricIds.map(id => ({
        id,
        name: id.replace(/-/g, ' '),
        category: 'All',
        frequency: 'DAILY',
        baselineValue: parseFloat(values[id] ?? '0'),
      })),
      durationWeeks: weeks,
      startDate: new Date().toISOString(),
      endDate: endDate.toISOString(),
    });
    router.push({ pathname: '/schedule/peptide-added' as any, params: { peptideId } });
  }

  return (
    <ScreenBackground>
      <StatusBar style="light" />
      <View style={styles.navBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn}>
          <X size={20} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.navTitle}>Set your starting line</Text>
        <View style={{ width: 36 }} />
      </View>

      <Text style={styles.stepIndicator}>BASELINE · DAY 0</Text>
      <Text style={styles.sub}>These numbers are your reference point. Log them honestly — they're just for you.</Text>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {metricIds.map((id) => {
          const meta = METRIC_META[id] ?? { unit: '', placeholder: '5' };
          return (
            <View key={id} style={styles.metricRow}>
              <View style={styles.metricLabel}>
                <Text style={styles.metricName}>{id.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</Text>
                <Text style={styles.metricUnit}>{meta.unit}</Text>
              </View>
              <TextInput
                style={styles.input}
                value={values[id] ?? ''}
                onChangeText={(v) => setValues(prev => ({ ...prev, [id]: v }))}
                placeholder={meta.placeholder}
                placeholderTextColor={Colors.textTertiary}
                keyboardType="decimal-pad"
              />
            </View>
          );
        })}
        <View style={{ height: 100 }} />
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.saveBtn} onPress={handleSave} activeOpacity={0.85}>
          <Text style={styles.saveBtnText}>Save Baseline & Continue</Text>
        </TouchableOpacity>
      </View>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.base },
  navBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg, paddingTop: 52, paddingBottom: Spacing.md,
  },
  closeBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.surface, alignItems: 'center', justifyContent: 'center' },
  navTitle: { fontSize: Typography.base, fontWeight: FontWeight.bold, color: Colors.textPrimary, flex: 1, textAlign: 'center' },
  stepIndicator: { textAlign: 'center', fontSize: Typography.xs, color: Colors.primaryOrange, fontWeight: FontWeight.bold, letterSpacing: 1.5, marginBottom: Spacing.sm },
  sub: { textAlign: 'center', fontSize: Typography.sm, color: Colors.textSecondary, paddingHorizontal: Spacing.lg, marginBottom: Spacing.lg, lineHeight: 20 },
  scroll: { paddingHorizontal: Spacing.lg },
  metricRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingVertical: Spacing.md, borderBottomWidth: 1, borderBottomColor: Colors.surfaceBorder,
  },
  metricLabel: { flex: 1 },
  metricName: { fontSize: Typography.base, fontWeight: FontWeight.semibold, color: Colors.textPrimary },
  metricUnit: { fontSize: Typography.xs, color: Colors.textTertiary },
  input: {
    width: 80, backgroundColor: Colors.surface, borderRadius: Radii.md, padding: Spacing.sm,
    fontSize: Typography.lg, fontWeight: FontWeight.bold, color: Colors.textPrimary,
    textAlign: 'center', borderWidth: 1, borderColor: Colors.surfaceBorder,
  },
  footer: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    padding: Spacing.lg, paddingBottom: 36, backgroundColor: Colors.base,
    borderTopWidth: 1, borderTopColor: Colors.surfaceBorder,
  },
  saveBtn: { backgroundColor: Colors.primaryOrange, borderRadius: 32, paddingVertical: 18, alignItems: 'center' },
  saveBtnText: { color: '#fff', fontSize: Typography.base, fontWeight: FontWeight.bold },
});
