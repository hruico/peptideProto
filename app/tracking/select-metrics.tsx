import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { X, Check } from 'lucide-react-native';
import { useState, useMemo } from 'react';
import { Colors, Radii, Typography, FontWeight, Spacing } from '../../constants/theme';

const ALL_METRICS = [
  { id: 'pain-level', name: 'Pain level', category: 'Healing', frequency: 'DAILY', description: 'Direct measure of healing. Daily tracking catches trends weeks before your training or movement does.', relevantFor: ['kpv', 'bpc-157', 'tb-500'] },
  { id: 'energy', name: 'Energy', category: 'All', frequency: 'WEEKLY', description: "The fastest subjective read on 'is this working?'. Peptides often show up as steadier day-to-day energy before anything else.", relevantFor: ['nad+', 'mots-c', 'ipamorelin'] },
  { id: 'body-weight', name: 'Body weight', category: 'Body Composition', frequency: 'WEEKLY', description: 'Track weekly trends in body mass. Best measured in the morning before eating.', relevantFor: ['cjc-1295', 'ipamorelin', 'aod-9604'] },
  { id: 'skin-clarity', name: 'Skin clarity', category: 'Skin & Hair', frequency: 'WEEKLY', description: 'Collagen and healing peptides improve skin texture over 4–8 weeks.', relevantFor: ['ghk-cu', 'bpc-157', 'kpv'] },
  { id: 'sleep-quality', name: 'Sleep quality', category: 'Sleep', frequency: 'DAILY', description: 'Sleep depth, duration, and recovery quality.', relevantFor: ['ipamorelin', 'epithalon', 'dsip'] },
  { id: 'focus', name: 'Focus', category: 'Cognitive', frequency: 'DAILY', description: 'Subjective measure of mental clarity and concentration.', relevantFor: ['semax', 'selank'] },
  { id: 'inflammation', name: 'Inflammation', category: 'Healing', frequency: 'DAILY', description: 'Subjective inflammation levels: joint soreness, puffiness, or general discomfort.', relevantFor: ['bpc-157', 'kpv', 'tb-500'] },
  { id: 'muscle-soreness', name: 'Muscle soreness', category: 'Recovery', frequency: 'DAILY', description: 'Track post-workout recovery speed.', relevantFor: ['bpc-157', 'tb-500', 'igf-1-lr3'] },
];

const FILTER_TABS = ['Suggested', 'All', 'Body Composition', 'Sleep', 'Recovery'];

export default function SelectMetricsScreen() {
  const { peptideId } = useLocalSearchParams<{ peptideId: string }>();
  const [selected, setSelected] = useState<string[]>([]);
  const [activeFilter, setActiveFilter] = useState('Suggested');

  const filtered = useMemo(() => {
    if (activeFilter === 'Suggested') return ALL_METRICS.filter(m => m.relevantFor.includes(peptideId ?? ''));
    if (activeFilter === 'All') return ALL_METRICS;
    return ALL_METRICS.filter(m => m.category === activeFilter);
  }, [activeFilter, peptideId]);

  function toggleMetric(id: string) {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  }

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <View style={styles.navBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn}>
          <X size={20} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.navTitle}>What do you want to track?</Text>
        <View style={{ width: 36 }} />
      </View>

      <View style={styles.peptideTag}>
        <Text style={styles.peptideTagText}>{(peptideId ?? '').toUpperCase()}</Text>
      </View>

      <Text style={styles.sub}>Pick the metrics that say "this is working"</Text>

      {/* Filter chips */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow} contentContainerStyle={{ paddingHorizontal: Spacing.lg, gap: Spacing.sm }}>
        {FILTER_TABS.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.filterChip, activeFilter === tab && styles.filterChipActive]}
            onPress={() => setActiveFilter(tab)}
          >
            <Text style={[styles.filterChipText, activeFilter === tab && styles.filterChipTextActive]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {filtered.map((metric) => {
          const isSelected = selected.includes(metric.id);
          return (
            <TouchableOpacity
              key={metric.id}
              style={[styles.metricCard, isSelected && styles.metricCardSelected]}
              onPress={() => toggleMetric(metric.id)}
              activeOpacity={0.8}
            >
              <View style={styles.metricTop}>
                <View style={[styles.metricCheck, isSelected && styles.metricCheckSelected]}>
                  {isSelected && <Check size={12} color="#fff" />}
                </View>
                <View style={styles.metricInfo}>
                  <Text style={styles.metricName}>{metric.name}</Text>
                  <View style={styles.metricMeta}>
                    <Text style={styles.metricCategory}>{metric.category}</Text>
                    <Text style={styles.metricSeparator}>·</Text>
                    <Text style={styles.metricFreq}>FREQUENCY: {metric.frequency}</Text>
                  </View>
                </View>
              </View>
              <Text style={styles.metricDesc}>{metric.description}</Text>
            </TouchableOpacity>
          );
        })}
        <View style={{ height: 100 }} />
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.continueBtn, selected.length === 0 && styles.continueBtnDisabled]}
          onPress={() => router.push({ pathname: '/tracking/duration' as any, params: { peptideId, metrics: JSON.stringify(selected) } })}
          activeOpacity={0.85}
          disabled={selected.length === 0}
        >
          <Text style={styles.continueBtnText}>
            {selected.length === 0 ? 'Select at least one' : `Continue with ${selected.length} metric${selected.length > 1 ? 's' : ''}`}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.base },
  navBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg, paddingTop: 52, paddingBottom: Spacing.sm,
  },
  closeBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.surface, alignItems: 'center', justifyContent: 'center' },
  navTitle: { fontSize: Typography.base, fontWeight: FontWeight.bold, color: Colors.textPrimary, flex: 1, textAlign: 'center' },
  peptideTag: {
    alignSelf: 'center', backgroundColor: Colors.primaryOrangeLight, borderRadius: Radii.full,
    paddingHorizontal: Spacing.md, paddingVertical: 4, marginBottom: Spacing.sm,
  },
  peptideTagText: { color: Colors.primaryOrange, fontSize: Typography.xs, fontWeight: FontWeight.bold },
  sub: { textAlign: 'center', fontSize: Typography.sm, color: Colors.textSecondary, marginBottom: Spacing.md, paddingHorizontal: Spacing.lg },
  filterRow: { marginBottom: Spacing.md },
  filterChip: {
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm,
    borderRadius: Radii.full, backgroundColor: Colors.surface,
    borderWidth: 1, borderColor: Colors.surfaceBorder,
  },
  filterChipActive: { backgroundColor: Colors.primaryOrangeLight, borderColor: Colors.primaryOrange },
  filterChipText: { fontSize: Typography.xs, color: Colors.textSecondary, fontWeight: FontWeight.medium },
  filterChipTextActive: { color: Colors.primaryOrange, fontWeight: FontWeight.bold },
  scroll: { paddingHorizontal: Spacing.lg },
  metricCard: {
    backgroundColor: Colors.surface, borderRadius: Radii.lg, padding: Spacing.md,
    marginBottom: Spacing.sm, borderWidth: 1.5, borderColor: Colors.surfaceBorder,
  },
  metricCardSelected: { backgroundColor: Colors.primaryOrangeLight, borderColor: Colors.primaryOrange },
  metricTop: { flexDirection: 'row', gap: Spacing.sm, alignItems: 'flex-start', marginBottom: Spacing.sm },
  metricCheck: {
    width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: Colors.surfaceBorder,
    alignItems: 'center', justifyContent: 'center', marginTop: 2,
  },
  metricCheckSelected: { backgroundColor: Colors.primaryOrange, borderColor: Colors.primaryOrange },
  metricInfo: { flex: 1 },
  metricName: { fontSize: Typography.base, fontWeight: FontWeight.bold, color: Colors.textPrimary, marginBottom: 4 },
  metricMeta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metricCategory: { fontSize: Typography.xs, color: Colors.primaryOrange, fontWeight: FontWeight.semibold },
  metricSeparator: { fontSize: Typography.xs, color: Colors.textTertiary },
  metricFreq: { fontSize: Typography.xs, color: Colors.textTertiary, letterSpacing: 0.5 },
  metricDesc: { fontSize: Typography.xs, color: Colors.textSecondary, lineHeight: 18 },
  footer: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    padding: Spacing.lg, paddingBottom: 36, backgroundColor: Colors.base,
    borderTopWidth: 1, borderTopColor: Colors.surfaceBorder,
  },
  continueBtn: { backgroundColor: Colors.primaryOrange, borderRadius: 32, paddingVertical: 18, alignItems: 'center' },
  continueBtnDisabled: { backgroundColor: Colors.surfaceBorder },
  continueBtnText: { color: '#fff', fontSize: Typography.base, fontWeight: FontWeight.bold },
});
