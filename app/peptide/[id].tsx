import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  FlatList,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ChevronLeft, Shield } from 'lucide-react-native';
import { useState } from 'react';
import { getPeptideById } from '../../data/peptides';
import { PROTOCOLS, getProtocolById } from '../../data/protocols';
import { Colors, Radii, Typography, FontWeight, Spacing } from '../../constants/theme';

const TABS = ['Learn', 'Schedule', 'Sources'];

const VIAL_SIZES = [
  { size: '1 mg', holds: '2 doses at 0.5 mg', price: '~$6' },
  { size: '2 mg', holds: '4 doses at 0.5 mg', price: '~$12' },
  { size: '5 mg', holds: '10 doses at 0.5 mg', price: '~$30' },
  { size: '10 mg', holds: '20 doses at 0.5 mg', price: '~$60' },
  { size: '15 mg', holds: '30 doses at 0.5 mg', price: '~$89' },
  { size: '20 mg', holds: '40 doses at 0.5 mg', price: '~$119' },
  { size: '50 mg', holds: '100 doses at 0.5 mg', price: '~$298' },
];

export default function PeptideDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const peptide = getPeptideById(id);
  const [activeTab, setActiveTab] = useState('Learn');

  if (!peptide) return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <ChevronLeft size={22} color={Colors.textPrimary} />
      </TouchableOpacity>
      <Text style={styles.notFound}>Peptide not found</Text>
    </View>
  );

  const p = peptide as any;
  const relatedProtocols = PROTOCOLS.filter(proto => proto.peptideIds.includes(id));
  const requiresTitration = p.requiresTitration ?? false;

  function handleStart() {
    if (requiresTitration) {
      router.push({ pathname: '/peptide/[id]/titration', params: { id } });
    } else {
      router.push({ pathname: '/schedule/add-peptide' as any, params: { peptideId: id } });
    }
  }

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <ChevronLeft size={22} color={Colors.textPrimary} />
        </TouchableOpacity>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryBadgeText}>{peptide.category}</Text>
        </View>
      </View>

      {/* Title block */}
      <View style={styles.titleBlock}>
        <View style={[styles.bigAvatar, { backgroundColor: getCategoryColor(peptide.category) }]}>
          <Text style={styles.bigAvatarLetter}>{peptide.name[0]}</Text>
        </View>
        <View style={styles.titleInfo}>
          <Text style={styles.peptideName}>{peptide.name}</Text>
          <Text style={styles.peptideSubtitle}>THE {peptide.category.toUpperCase().replace(' & ', ' & ')}</Text>
          {p.alsoKnownAs && <Text style={styles.alsoKnown}>Also known as {p.alsoKnownAs}</Text>}
        </View>
      </View>

      {/* Tab selector */}
      <View style={styles.tabBar}>
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab} style={styles.tabItem}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabLabel, activeTab === tab && styles.tabLabelActive]}>{tab}</Text>
            {activeTab === tab && <View style={styles.tabUnderline} />}
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {activeTab === 'Learn' && <LearnTab peptide={p} relatedProtocols={relatedProtocols} />}
        {activeTab === 'Schedule' && <ScheduleTab peptide={p} relatedProtocols={relatedProtocols} />}
        {activeTab === 'Sources' && <SourcesTab peptide={p} />}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Sticky CTA */}
      <View style={styles.stickyFooter}>
        <TouchableOpacity style={styles.startBtn} onPress={handleStart} activeOpacity={0.85}>
          <Text style={styles.startBtnText}>Start {peptide.name}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function LearnTab({ peptide, relatedProtocols }: { peptide: any; relatedProtocols: any[] }) {
  const tagline = peptide.tagline ?? `"${peptide.description}"`;
  const overview = peptide.overview ?? peptide.description;
  const whoIsThisFor: string[] = peptide.whoIsThisFor ?? ['People with chronic inflammation', 'Athletes seeking faster recovery', 'Those with gut health issues'];
  const weekByWeek: { week: string; outcome: string }[] = peptide.weekByWeek ?? [
    { week: 'Week 1', outcome: 'Noticeable reduction in inflammation' },
    { week: 'Week 1–3', outcome: 'Improved gut comfort and healing' },
    { week: 'Week 4+', outcome: 'Sustained repair and systemic effects' },
  ];

  return (
    <View>
      <Text style={learnStyles.tagline}>{tagline}</Text>

      <Text style={learnStyles.sectionLabel}>OVERVIEW</Text>
      <Text style={learnStyles.bodyText}>{overview}</Text>

      <Text style={learnStyles.sectionLabel}>WHO IS THIS FOR?</Text>
      {whoIsThisFor.map((item, i) => (
        <View key={i} style={learnStyles.bulletRow}>
          <View style={learnStyles.bullet} />
          <Text style={learnStyles.bulletText}>{item}</Text>
        </View>
      ))}

      <Text style={learnStyles.sectionLabel}>HOW IT WORKS</Text>
      <Text style={learnStyles.bodyText}>{peptide.mechanism}</Text>

      <Text style={learnStyles.sectionLabel}>WHAT TO EXPECT, WEEK BY WEEK</Text>
      {weekByWeek.map((item, i) => (
        <View key={i} style={learnStyles.weekRow}>
          <Text style={learnStyles.weekLabel}>{item.week}</Text>
          <Text style={learnStyles.weekOutcome}>{item.outcome}</Text>
        </View>
      ))}

      {/* Safety */}
      <Text style={learnStyles.sectionLabel}>SAFETY</Text>
      <View style={learnStyles.safetyCard}>
        <View style={learnStyles.safetyHeader}>
          <View style={learnStyles.gradeCircle}>
            <Text style={learnStyles.gradeText}>A</Text>
          </View>
          <View>
            <Text style={learnStyles.safetyLabel}>Excellent Safety Profile</Text>
            <Text style={learnStyles.safetyDesc}>Well-tolerated with minimal reported side effects.</Text>
          </View>
        </View>
        <View style={learnStyles.divider} />
        <Text style={learnStyles.sideEffectsLabel}>Potential side effects:</Text>
        {['Injection site reactions', 'Mild nausea (rare)', 'Headache (rare)'].map((se, i) => (
          <Text key={i} style={learnStyles.sideEffect}>• {se}</Text>
        ))}
      </View>

      {relatedProtocols.length > 0 && (
        <>
          <Text style={learnStyles.sectionLabel}>COMMON STACKS</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {relatedProtocols.map((proto) => (
              <TouchableOpacity
                key={proto.id}
                style={learnStyles.protoChip}
                onPress={() => router.push({ pathname: '/protocol/[id]', params: { id: proto.id } })}
              >
                <Text style={learnStyles.protoChipText}>{proto.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </>
      )}
    </View>
  );
}

function ScheduleTab({ peptide, relatedProtocols }: { peptide: any; relatedProtocols: any[] }) {
  const weeklyCost = peptide.typicalWeeklyCost ?? '~$22';
  const costPerMg = peptide.costPerMg ?? '~$5.96/mg';
  const howToDose = peptide.howToDose ?? peptide.typicalDose + ' ' + peptide.doseUnit + ' daily';
  const cycle = peptide.cycle ?? '4–8 weeks or as needed';
  const tip = peptide.tip;
  const vialSizes = peptide.vialSizes ?? VIAL_SIZES;

  return (
    <View>
      {/* Cost display */}
      <View style={schedStyles.costBlock}>
        <Text style={schedStyles.costAmount}>{weeklyCost}</Text>
        <Text style={schedStyles.costLabel}>/ wk</Text>
      </View>
      <Text style={schedStyles.costSub}>{costPerMg}</Text>

      <Text style={schedStyles.sectionLabel}>STANDARD VIAL SIZES</Text>
      <View style={schedStyles.table}>
        <View style={schedStyles.tableHeader}>
          <Text style={[schedStyles.tableCell, schedStyles.tableCellHeader, { flex: 1 }]}>Size</Text>
          <Text style={[schedStyles.tableCell, schedStyles.tableCellHeader, { flex: 2 }]}>Holds</Text>
          <Text style={[schedStyles.tableCell, schedStyles.tableCellHeader, { flex: 1 }]}>Est. Price</Text>
        </View>
        {vialSizes.map((v: any, i: number) => (
          <View key={i} style={[schedStyles.tableRow, i % 2 === 0 && schedStyles.tableRowAlt]}>
            <Text style={[schedStyles.tableCell, { flex: 1 }]}>{v.size}</Text>
            <Text style={[schedStyles.tableCell, { flex: 2 }]}>{v.holds}</Text>
            <Text style={[schedStyles.tableCell, { flex: 1, color: Colors.primaryOrange }]}>{v.price}</Text>
          </View>
        ))}
      </View>

      <Text style={schedStyles.sectionLabel}>HOW TO DOSE</Text>
      <View style={schedStyles.doseCard}>
        <View style={schedStyles.doseRow}>
          <Text style={schedStyles.doseLabel}>How to dose</Text>
          <Text style={schedStyles.doseValue}>{howToDose}</Text>
        </View>
        <View style={schedStyles.divider} />
        <View style={schedStyles.doseRow}>
          <Text style={schedStyles.doseLabel}>Cycle</Text>
          <Text style={schedStyles.doseValue}>{cycle}</Text>
        </View>
        {tip && (
          <>
            <View style={schedStyles.divider} />
            <View style={schedStyles.tipBox}>
              <Text style={schedStyles.tipText}>💡 {tip}</Text>
            </View>
          </>
        )}
      </View>

      {relatedProtocols.length > 0 && (
        <>
          <Text style={schedStyles.sectionLabel}>FEATURED PROTOCOLS ({relatedProtocols.length} available)</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {relatedProtocols.map((proto) => (
              <TouchableOpacity
                key={proto.id}
                style={schedStyles.protoCard}
                onPress={() => router.push({ pathname: '/protocol/[id]', params: { id: proto.id } })}
              >
                <Text style={schedStyles.protoName}>{proto.name}</Text>
                <Text style={schedStyles.protoDuration}>{proto.durationLabel}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </>
      )}
    </View>
  );
}

function SourcesTab({ peptide }: { peptide: any }) {
  const sources = peptide.sources ?? [
    'PubMed: Anti-inflammatory properties of tripeptides derived from alpha-MSH',
    'Journal of Peptide Science: KPV and intestinal inflammation',
    'Annals of Gastroenterology: Gut healing peptide mechanisms',
  ];
  return (
    <View>
      <Text style={sourceStyles.note}>Educational references for this peptide:</Text>
      {sources.map((s: string, i: number) => (
        <View key={i} style={sourceStyles.sourceRow}>
          <Text style={sourceStyles.sourceNum}>{i + 1}.</Text>
          <Text style={sourceStyles.sourceText}>{s}</Text>
        </View>
      ))}
    </View>
  );
}

function getCategoryColor(cat: string): string {
  const map: Record<string, string> = {
    'Recovery & Healing': '#EF4444', 'Fat Loss': '#F97316',
    'Muscle & Performance': '#3B82F6', 'Cognitive & Neuroprotection': '#8B5CF6',
    'Sleep & Longevity': '#6366F1', 'Skin & Aesthetics': '#EC4899', 'GI & Gut Health': '#22C55E',
  };
  return map[cat] ?? '#999';
}

const learnStyles = StyleSheet.create({
  tagline: {
    fontSize: Typography.base, color: Colors.textSecondary, fontStyle: 'italic',
    lineHeight: 22, marginBottom: Spacing.xl, textAlign: 'center',
    borderLeftWidth: 3, borderLeftColor: Colors.primaryOrange,
    paddingLeft: Spacing.md,
  },
  sectionLabel: {
    fontSize: Typography.xs, color: Colors.textTertiary, fontWeight: FontWeight.semibold,
    letterSpacing: 1.5, marginBottom: Spacing.sm, marginTop: Spacing.lg,
  },
  bodyText: { fontSize: Typography.sm, color: Colors.textPrimary, lineHeight: 22 },
  bulletRow: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.sm },
  bullet: {
    width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.primaryOrange, marginTop: 7,
  },
  bulletText: { flex: 1, fontSize: Typography.sm, color: Colors.textPrimary, lineHeight: 20 },
  weekRow: { paddingVertical: Spacing.sm, borderBottomWidth: 1, borderBottomColor: Colors.surfaceBorder },
  weekLabel: { fontSize: Typography.xs, fontWeight: FontWeight.bold, color: Colors.primaryOrange, marginBottom: 2 },
  weekOutcome: { fontSize: Typography.sm, color: Colors.textPrimary },
  safetyCard: {
    backgroundColor: Colors.surface, borderRadius: Radii.lg, padding: Spacing.md,
    borderWidth: 1, borderColor: Colors.surfaceBorder,
  },
  safetyHeader: { flexDirection: 'row', gap: Spacing.md, alignItems: 'center', marginBottom: Spacing.sm },
  gradeCircle: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: Colors.accentGreen,
    alignItems: 'center', justifyContent: 'center',
  },
  gradeText: { color: '#fff', fontSize: Typography.xl, fontWeight: FontWeight.extrabold },
  safetyLabel: { fontSize: Typography.base, fontWeight: FontWeight.bold, color: Colors.textPrimary },
  safetyDesc: { fontSize: Typography.xs, color: Colors.textSecondary },
  divider: { height: 1, backgroundColor: Colors.surfaceBorder, marginVertical: Spacing.sm },
  sideEffectsLabel: { fontSize: Typography.xs, fontWeight: FontWeight.semibold, color: Colors.textSecondary, marginBottom: 4 },
  sideEffect: { fontSize: Typography.xs, color: Colors.textSecondary, lineHeight: 20 },
  protoChip: {
    backgroundColor: Colors.primaryOrangeLight, borderRadius: Radii.full,
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, marginRight: Spacing.sm,
  },
  protoChipText: { color: Colors.primaryOrange, fontSize: Typography.xs, fontWeight: FontWeight.semibold },
});

const schedStyles = StyleSheet.create({
  costBlock: { flexDirection: 'row', alignItems: 'baseline', gap: 4, marginBottom: 4 },
  costAmount: { fontSize: 48, fontWeight: FontWeight.extrabold, color: Colors.textPrimary },
  costLabel: { fontSize: Typography.xl, color: Colors.textSecondary },
  costSub: { fontSize: Typography.sm, color: Colors.textTertiary, marginBottom: Spacing.xl },
  sectionLabel: {
    fontSize: Typography.xs, color: Colors.textTertiary, fontWeight: FontWeight.semibold,
    letterSpacing: 1.5, marginBottom: Spacing.sm, marginTop: Spacing.lg,
  },
  table: { borderRadius: Radii.lg, overflow: 'hidden', borderWidth: 1, borderColor: Colors.surfaceBorder },
  tableHeader: { flexDirection: 'row', backgroundColor: Colors.surface, paddingVertical: Spacing.sm, paddingHorizontal: Spacing.md },
  tableRow: { flexDirection: 'row', paddingVertical: Spacing.sm, paddingHorizontal: Spacing.md },
  tableRowAlt: { backgroundColor: Colors.backgroundSecondary },
  tableCell: { fontSize: Typography.xs, color: Colors.textPrimary },
  tableCellHeader: { fontWeight: FontWeight.bold, color: Colors.textSecondary },
  doseCard: {
    backgroundColor: Colors.surface, borderRadius: Radii.lg, padding: Spacing.md,
    borderWidth: 1, borderColor: Colors.surfaceBorder,
  },
  doseRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: Spacing.md },
  doseLabel: { fontSize: Typography.sm, color: Colors.textSecondary, flex: 1 },
  doseValue: { fontSize: Typography.sm, color: Colors.textPrimary, fontWeight: FontWeight.semibold, flex: 2, textAlign: 'right' },
  divider: { height: 1, backgroundColor: Colors.surfaceBorder, marginVertical: Spacing.sm },
  tipBox: { backgroundColor: Colors.primaryOrangeLight, borderRadius: Radii.md, padding: Spacing.sm },
  tipText: { fontSize: Typography.xs, color: Colors.primaryOrange, lineHeight: 18 },
  protoCard: {
    backgroundColor: Colors.surface, borderRadius: Radii.lg, padding: Spacing.md,
    marginRight: Spacing.sm, minWidth: 140, borderWidth: 1, borderColor: Colors.surfaceBorder,
  },
  protoName: { fontSize: Typography.sm, fontWeight: FontWeight.bold, color: Colors.textPrimary },
  protoDuration: { fontSize: Typography.xs, color: Colors.textSecondary, marginTop: 4 },
});

const sourceStyles = StyleSheet.create({
  note: { fontSize: Typography.sm, color: Colors.textSecondary, marginBottom: Spacing.lg },
  sourceRow: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.md },
  sourceNum: { fontSize: Typography.sm, color: Colors.primaryOrange, fontWeight: FontWeight.bold, minWidth: 20 },
  sourceText: { flex: 1, fontSize: Typography.sm, color: Colors.textPrimary, lineHeight: 20 },
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.base },
  notFound: { textAlign: 'center', marginTop: 100, color: Colors.textSecondary },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg, paddingTop: 52, paddingBottom: Spacing.md,
  },
  backBtn: {
    width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.surface,
    alignItems: 'center', justifyContent: 'center',
  },
  categoryBadge: {
    backgroundColor: Colors.primaryOrangeLight, borderRadius: Radii.full,
    paddingHorizontal: Spacing.md, paddingVertical: 5,
  },
  categoryBadgeText: { color: Colors.primaryOrange, fontSize: Typography.xs, fontWeight: FontWeight.bold },
  titleBlock: {
    flexDirection: 'row', gap: Spacing.md, paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg, alignItems: 'center',
  },
  bigAvatar: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center' },
  bigAvatarLetter: { color: '#fff', fontSize: Typography.xxl, fontWeight: FontWeight.extrabold },
  titleInfo: { flex: 1 },
  peptideName: { fontSize: Typography.xl, fontWeight: FontWeight.extrabold, color: Colors.textPrimary },
  peptideSubtitle: { fontSize: Typography.xs, color: Colors.textTertiary, fontWeight: FontWeight.semibold, letterSpacing: 0.8, marginTop: 2 },
  alsoKnown: { fontSize: Typography.xs, color: Colors.textSecondary, marginTop: 4 },
  tabBar: {
    flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: Colors.surfaceBorder,
    paddingHorizontal: Spacing.lg,
  },
  tabItem: { paddingVertical: Spacing.md, marginRight: Spacing.xl, position: 'relative' },
  tabLabel: { fontSize: Typography.base, color: Colors.textTertiary, fontWeight: FontWeight.medium },
  tabLabelActive: { color: Colors.textPrimary, fontWeight: FontWeight.bold },
  tabUnderline: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    height: 2, backgroundColor: Colors.primaryOrange, borderRadius: 1,
  },
  scroll: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.lg },
  stickyFooter: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    padding: Spacing.lg, paddingBottom: 36, backgroundColor: Colors.base,
    borderTopWidth: 1, borderTopColor: Colors.surfaceBorder,
  },
  startBtn: {
    backgroundColor: Colors.primaryOrange, borderRadius: 32, paddingVertical: 18, alignItems: 'center',
  },
  startBtnText: { color: '#fff', fontSize: Typography.base, fontWeight: FontWeight.bold },
});
