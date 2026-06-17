import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { X, Plus } from 'lucide-react-native';
import { useState } from 'react';
import { PEPTIDES } from '../../data/peptides';
import { useOnboardingStore } from '../../store/useOnboardingStore';
import { useUserStore } from '../../store/useUserStore';
import { Colors, Radii, Typography, FontWeight, Spacing } from '../../constants/theme';

const FILTER_CHIPS = ['Featured', 'Body recomposition', 'Skin & hair', 'Sleep', 'Recovery & repair'];

const CATEGORY_MAP: Record<string, string> = {
  'Featured': '',
  'Body recomposition': 'Fat Loss',
  'Skin & hair': 'Skin & Aesthetics',
  'Sleep': 'Sleep & Longevity',
  'Recovery & repair': 'Recovery & Healing',
};

function getCategoryColor(cat: string): string {
  const map: Record<string, string> = {
    'Recovery & Healing': '#EF4444', 'Fat Loss': '#F97316', 'Muscle & Performance': '#3B82F6',
    'Cognitive & Neuroprotection': '#8B5CF6', 'Sleep & Longevity': '#6366F1',
    'Skin & Aesthetics': '#EC4899', 'GI & Gut Health': '#22C55E',
  };
  return map[cat] ?? '#999';
}

export default function StackBuilderScreen() {
  const [activeFilter, setActiveFilter] = useState('Featured');
  const [stackIds, setStackIds] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'peptides' | 'blends' | 'custom'>('peptides');
  const { completeOnboarding } = useOnboardingStore();
  const { continueAsGuest } = useUserStore();

  const filteredPeptides = PEPTIDES.filter(p => {
    const cat = CATEGORY_MAP[activeFilter];
    return !cat || p.category === cat;
  });

  function togglePeptide(id: string) {
    setStackIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  }

  function handleDone() {
    continueAsGuest();
    completeOnboarding();
    router.replace('/(tabs)');
  }

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <View style={styles.navBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn}>
          <X size={20} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.navTitle}>Build your stack</Text>
        <View style={{ width: 36 }} />
      </View>

      <Text style={styles.navSub}>Tap to add. Doses come next.</Text>

      {/* Your stack area */}
      <View style={styles.stackArea}>
        {stackIds.length === 0 ? (
          <Text style={styles.stackEmpty}>Search or tap below to add to your stack</Text>
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {stackIds.map((id) => {
              const p = PEPTIDES.find(x => x.id === id);
              return (
                <TouchableOpacity key={id} style={styles.stackChip} onPress={() => togglePeptide(id)}>
                  <View style={[styles.stackChipDot, { backgroundColor: getCategoryColor(p?.category ?? '') }]} />
                  <Text style={styles.stackChipText}>{p?.name ?? id}</Text>
                  <X size={12} color={Colors.primaryOrange} />
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        )}
      </View>

      {/* Inner tab bar */}
      <View style={styles.innerTabBar}>
        {(['peptides', 'blends', 'custom'] as const).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.innerTab, activeTab === tab && styles.innerTabActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.innerTabText, activeTab === tab && styles.innerTabTextActive]}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Peptides tab */}
      {activeTab === 'peptides' && (
        <>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow} contentContainerStyle={{ paddingHorizontal: Spacing.lg, gap: Spacing.sm }}>
            {FILTER_CHIPS.map((chip) => (
              <TouchableOpacity
                key={chip}
                style={[styles.filterChip, activeFilter === chip && styles.filterChipActive]}
                onPress={() => setActiveFilter(chip)}
              >
                <Text style={[styles.filterChipText, activeFilter === chip && styles.filterChipTextActive]}>{chip}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.peptideGrid}>
            <View style={styles.gridRow}>
              {filteredPeptides.map((p) => {
                const selected = stackIds.includes(p.id);
                return (
                  <TouchableOpacity
                    key={p.id}
                    style={[styles.peptideCard, selected && styles.peptideCardSelected, { borderColor: selected ? getCategoryColor(p.category) : Colors.surfaceBorder }]}
                    onPress={() => togglePeptide(p.id)}
                    activeOpacity={0.7}
                  >
                    <View style={[styles.peptideCardAvatar, { backgroundColor: getCategoryColor(p.category) }]}>
                      <Text style={styles.peptideCardLetter}>{p.name[0]}</Text>
                    </View>
                    <Text style={styles.peptideCardName}>{p.name}</Text>
                    <Text style={styles.peptideCardCat} numberOfLines={1}>{p.category}</Text>
                    {selected && (
                      <View style={[styles.selectedBadge, { backgroundColor: getCategoryColor(p.category) }]}>
                        <Text style={styles.selectedBadgeText}>✓</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
            <View style={{ height: 120 }} />
          </ScrollView>
        </>
      )}

      {/* Custom tab */}
      {activeTab === 'custom' && (
        <View style={styles.customTab}>
          <Text style={styles.customLabel}>ADD CUSTOM ITEM</Text>
          <Text style={styles.customSub}>Dose & schedule come next</Text>
          <TextInput
            style={styles.customInput}
            placeholder="Name"
            placeholderTextColor={Colors.textTertiary}
          />
          <Text style={styles.customInputSub}>A name to identify what you're taking</Text>
        </View>
      )}

      {/* Blends tab */}
      {activeTab === 'blends' && (
        <View style={styles.customTab}>
          <Text style={styles.customLabel}>SAVED BLENDS</Text>
          <Text style={styles.customSub}>Pre-made combinations</Text>
          <Text style={styles.emptyText}>No blends saved yet. Blends can be created in the Reconstitute tab.</Text>
        </View>
      )}

      {stackIds.length > 0 && (
        <View style={styles.footer}>
          <TouchableOpacity style={styles.doneBtn} onPress={handleDone} activeOpacity={0.85}>
            <Text style={styles.doneBtnText}>Done — {stackIds.length} peptide{stackIds.length > 1 ? 's' : ''} added</Text>
          </TouchableOpacity>
        </View>
      )}
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
  navTitle: { fontSize: Typography.base, fontWeight: FontWeight.bold, color: Colors.textPrimary },
  navSub: { textAlign: 'center', fontSize: Typography.xs, color: Colors.textTertiary, marginBottom: Spacing.md },
  stackArea: {
    minHeight: 52, marginHorizontal: Spacing.lg, marginBottom: Spacing.sm,
    backgroundColor: Colors.surface, borderRadius: Radii.lg,
    borderWidth: 1.5, borderStyle: 'dashed', borderColor: Colors.surfaceBorder,
    padding: Spacing.sm, justifyContent: 'center',
  },
  stackEmpty: { fontSize: Typography.xs, color: Colors.textTertiary, textAlign: 'center', paddingVertical: Spacing.sm },
  stackChip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: Colors.primaryOrangeLight, borderRadius: Radii.full,
    paddingHorizontal: Spacing.sm, paddingVertical: 6, marginRight: Spacing.sm,
  },
  stackChipDot: { width: 8, height: 8, borderRadius: 4 },
  stackChipText: { fontSize: Typography.xs, color: Colors.primaryOrange, fontWeight: FontWeight.semibold },
  innerTabBar: {
    flexDirection: 'row', paddingHorizontal: Spacing.lg, gap: Spacing.sm, marginBottom: Spacing.sm,
  },
  innerTab: {
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, borderRadius: Radii.full,
    backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.surfaceBorder,
  },
  innerTabActive: { backgroundColor: Colors.primaryOrange, borderColor: Colors.primaryOrange },
  innerTabText: { fontSize: Typography.xs, color: Colors.textSecondary, fontWeight: FontWeight.medium },
  innerTabTextActive: { color: '#fff', fontWeight: FontWeight.bold },
  filterRow: { marginBottom: Spacing.sm },
  filterChip: {
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, borderRadius: Radii.full,
    backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.surfaceBorder,
  },
  filterChipActive: { backgroundColor: Colors.primaryOrangeLight, borderColor: Colors.primaryOrange },
  filterChipText: { fontSize: Typography.xs, color: Colors.textSecondary },
  filterChipTextActive: { color: Colors.primaryOrange, fontWeight: FontWeight.bold },
  peptideGrid: { paddingHorizontal: Spacing.lg },
  gridRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  peptideCard: {
    width: '47%', backgroundColor: Colors.surface, borderRadius: Radii.xl, padding: Spacing.md,
    borderWidth: 1.5, borderColor: Colors.surfaceBorder, alignItems: 'center',
    position: 'relative',
  },
  peptideCardSelected: { backgroundColor: Colors.primaryOrangeLight },
  peptideCardAvatar: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.sm },
  peptideCardLetter: { color: '#fff', fontSize: Typography.lg, fontWeight: FontWeight.extrabold },
  peptideCardName: { fontSize: Typography.sm, fontWeight: FontWeight.bold, color: Colors.textPrimary, textAlign: 'center' },
  peptideCardCat: { fontSize: Typography.xs, color: Colors.textTertiary, textAlign: 'center', marginTop: 2 },
  selectedBadge: {
    position: 'absolute', top: 8, right: 8,
    width: 20, height: 20, borderRadius: 10, alignItems: 'center', justifyContent: 'center',
  },
  selectedBadgeText: { color: '#fff', fontSize: 10, fontWeight: FontWeight.bold },
  customTab: { flex: 1, paddingHorizontal: Spacing.lg, paddingTop: Spacing.lg },
  customLabel: { fontSize: Typography.xs, color: Colors.textTertiary, fontWeight: FontWeight.semibold, letterSpacing: 1.5, marginBottom: 4 },
  customSub: { fontSize: Typography.sm, color: Colors.textSecondary, marginBottom: Spacing.lg },
  customInput: {
    backgroundColor: Colors.surface, borderRadius: Radii.lg, padding: Spacing.md,
    fontSize: Typography.base, color: Colors.textPrimary, borderWidth: 1, borderColor: Colors.surfaceBorder,
  },
  customInputSub: { fontSize: Typography.xs, color: Colors.textTertiary, marginTop: Spacing.sm },
  emptyText: { fontSize: Typography.sm, color: Colors.textTertiary, lineHeight: 22 },
  footer: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    padding: Spacing.lg, paddingBottom: 36, backgroundColor: Colors.base,
    borderTopWidth: 1, borderTopColor: Colors.surfaceBorder,
  },
  doneBtn: { backgroundColor: Colors.primaryOrange, borderRadius: 32, paddingVertical: 18, alignItems: 'center' },
  doneBtnText: { color: '#fff', fontSize: Typography.base, fontWeight: FontWeight.bold },
});
