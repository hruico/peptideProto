import { useState, useMemo } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  TextInput, FlatList, SectionList,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ChevronLeft, Search, X } from 'lucide-react-native';
import GradientButton from '../../components/ui/GradientButton';
import ScreenBackground from '../../components/ScreenBackground';
import { useOnboardingStore } from '../../store/useOnboardingStore';
import { PEPTIDES, PEPTIDE_CATEGORIES } from '../../data/peptides';
import { getGoalById } from '../../data/goals';
import { Colors, Radii, Typography, FontWeight, Spacing } from '../../constants/theme';
import type { Peptide } from '../../types';

export default function PeptidePickerScreen() {
  const { goalId } = useLocalSearchParams<{ goalId?: string }>();
  const { setInterestedPeptideId } = useOnboardingStore();
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<string | null>(null);

  // Filter peptides — by goal if provided, then by search query
  const filtered = useMemo(() => {
    const goal = goalId ? getGoalById(goalId) : null;
    let base = goal
      ? PEPTIDES.filter((p) => goal.relatedPeptideIds.includes(p.id))
      : PEPTIDES;

    if (query.trim()) {
      const q = query.toLowerCase();
      base = base.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }
    return base;
  }, [query, goalId]);

  // Group by category for SectionList
  const sections = useMemo(() => {
    const map = new Map<string, Peptide[]>();
    filtered.forEach((p) => {
      const arr = map.get(p.category) ?? [];
      arr.push(p);
      map.set(p.category, arr);
    });
    return Array.from(map.entries()).map(([title, data]) => ({ title, data }));
  }, [filtered]);

  function handleContinue(peptideId: string) {
    setInterestedPeptideId(peptideId);
    router.push({ pathname: '/onboarding/interest-reason' as any, params: { peptideId } });
  }

  return (
    <ScreenBackground>
      <StatusBar style="light" />

      <TouchableOpacity style={styles.back} onPress={() => router.back()}>
        <ChevronLeft size={24} color={Colors.textSecondary} />
      </TouchableOpacity>

      <View style={styles.header}>
        <Text style={styles.heading}>
          {goalId ? 'Recommended peptides' : 'Choose a peptide'}
        </Text>
        <TouchableOpacity onPress={() => router.push('/onboarding/interest-reason' as any)}>
          <Text style={styles.skip}>Skip</Text>
        </TouchableOpacity>
      </View>

      {/* Search bar */}
      <View style={styles.searchRow}>
        <Search size={16} color={Colors.textTertiary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search peptides..."
          placeholderTextColor={Colors.textTertiary}
          value={query}
          onChangeText={setQuery}
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => setQuery('')}>
            <X size={16} color={Colors.textTertiary} />
          </TouchableOpacity>
        )}
      </View>

      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
        renderSectionHeader={({ section }) => (
          <Text style={styles.sectionHeader}>{section.title}</Text>
        )}
        renderItem={({ item }) => {
          const isSelected = selected === item.id;
          return (
            <TouchableOpacity
              style={[styles.row, isSelected && styles.rowSelected]}
              onPress={() => setSelected(item.id)}
              activeOpacity={0.8}
            >
              <View style={styles.rowText}>
                <Text style={[styles.rowName, isSelected && styles.rowNameSelected]}>
                  {item.name}
                </Text>
                <Text style={styles.rowDesc} numberOfLines={1}>{item.description}</Text>
              </View>
              {isSelected && (
                <GradientButton
                  label="Select"
                  onPress={() => handleContinue(item.id)}
                  variant="primary-orange"
                />
              )}
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          <Text style={styles.empty}>No peptides found for "{query}"</Text>
        }
      />
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  back: { paddingTop: 56, paddingHorizontal: Spacing.md },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.lg,
    marginBottom: Spacing.md,
  },
  heading: {
    color: Colors.textPrimary,
    fontSize: Typography.xl,
    fontWeight: FontWeight.extrabold,
  },
  skip: {
    color: Colors.accentOrange,
    fontSize: Typography.sm,
    fontWeight: FontWeight.semibold,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderRadius: Radii.lg,
    marginHorizontal: Spacing.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    gap: Spacing.sm,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
  },
  searchInput: {
    flex: 1,
    color: Colors.textPrimary,
    fontSize: Typography.base,
  },
  list: { paddingHorizontal: Spacing.lg, paddingBottom: 40 },
  sectionHeader: {
    color: Colors.textTertiary,
    fontSize: Typography.xs,
    fontWeight: FontWeight.semibold,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderRadius: Radii.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  rowSelected: {
    borderColor: Colors.accentOrange,
    backgroundColor: 'rgba(255,107,43,0.08)',
  },
  rowText: { flex: 1, marginRight: Spacing.sm },
  rowName: {
    color: Colors.textSecondary,
    fontSize: Typography.base,
    fontWeight: FontWeight.semibold,
  },
  rowNameSelected: { color: Colors.textPrimary },
  rowDesc: { color: Colors.textTertiary, fontSize: Typography.xs, marginTop: 2 },
  empty: {
    color: Colors.textTertiary,
    textAlign: 'center',
    marginTop: Spacing.xxl,
    fontSize: Typography.sm,
  },
});
