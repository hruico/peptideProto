import { useState, useMemo } from 'react';
import {
  View, Text, StyleSheet, FlatList,
  TextInput, TouchableOpacity, ScrollView, Modal,
} from 'react-native';
import { router } from 'expo-router';
import { Search, X, SlidersHorizontal, Check } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';

import SegmentedControl from '../../components/ui/SegmentedControl';
import ProtocolHeroCard from '../../components/cards/ProtocolHeroCard';
import PeptideGridCard from '../../components/cards/PeptideGridCard';
import { PEPTIDES, PEPTIDE_CATEGORIES } from '../../data/peptides';
import { PROTOCOLS } from '../../data/protocols';
import { Colors, Radii, Typography, FontWeight, Spacing } from '../../constants/theme';
import type { Peptide } from '../../types';

const TABS = ['Protocols', 'Peptides'];

export default function ExploreScreen() {
  const [activeTab, setActiveTab] = useState('Protocols');
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);

  // Filtered peptides
  const filteredPeptides = useMemo(() => {
    let result = PEPTIDES;
    if (selectedCategory) {
      result = result.filter((p) => p.category === selectedCategory);
    }
    if (query.trim()) {
      const q = query.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }
    return result;
  }, [query, selectedCategory]);

  // Filtered protocols
  const filteredProtocols = useMemo(() => {
    if (!query.trim()) return PROTOCOLS;
    const q = query.toLowerCase();
    return PROTOCOLS.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.subtitle.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
    );
  }, [query]);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Explore</Text>
      </View>

      {/* Segmented control */}
      <View style={styles.segmentWrapper}>
        <SegmentedControl
          options={TABS}
          selected={activeTab}
          onChange={setActiveTab}
        />
      </View>

      {/* Search bar */}
      <View style={styles.searchRow}>
        <Search size={16} color={Colors.textTertiary} />
        <TextInput
          style={styles.searchInput}
          placeholder={activeTab === 'Peptides' ? 'Search peptides...' : 'Search protocols...'}
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

      {/* Category filter — Peptides only */}
      {activeTab === 'Peptides' && (
        <TouchableOpacity
          style={styles.filterBtn}
          onPress={() => setShowCategoryModal(true)}
        >
          <SlidersHorizontal size={14} color={selectedCategory ? Colors.accentOrange : Colors.textTertiary} />
          <Text style={[styles.filterText, selectedCategory && styles.filterTextActive]}>
            {selectedCategory ?? 'All categories'} ▾
          </Text>
        </TouchableOpacity>
      )}

      {/* Protocols tab */}
      {activeTab === 'Protocols' && (
        <FlatList
          data={filteredProtocols}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <ProtocolHeroCard
              protocol={item}
              onPress={() => router.push(`/protocol/${item.id}`)}
              width={undefined as any}
            />
          )}
          ListEmptyComponent={<EmptyState message={`No protocols found for "${query}"`} />}
        />
      )}

      {/* Peptides tab */}
      {activeTab === 'Peptides' && (
        <FlatList
          data={filteredPeptides}
          keyExtractor={(item) => item.id}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.gridContent}
          columnWrapperStyle={styles.columnWrapper}
          renderItem={({ item }) => (
            <View style={styles.gridItem}>
              <PeptideGridCard
                peptide={item}
                onPress={() => router.push(`/peptide/${item.id}`)}
              />
            </View>
          )}
          ListEmptyComponent={<EmptyState message={`No peptides found for "${query}"`} />}
        />
      )}

      {/* Category filter modal */}
      <Modal
        visible={showCategoryModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCategoryModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowCategoryModal(false)}
        >
          <View style={styles.modalSheet}>
            <Text style={styles.modalTitle}>Filter by category</Text>

            <TouchableOpacity
              style={styles.categoryRow}
              onPress={() => { setSelectedCategory(null); setShowCategoryModal(false); }}
            >
              <Text style={[styles.categoryLabel, !selectedCategory && styles.categoryLabelActive]}>
                All categories
              </Text>
              {!selectedCategory && <Check size={16} color={Colors.accentOrange} />}
            </TouchableOpacity>

            {PEPTIDE_CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat}
                style={styles.categoryRow}
                onPress={() => { setSelectedCategory(cat); setShowCategoryModal(false); }}
              >
                <Text style={[styles.categoryLabel, selectedCategory === cat && styles.categoryLabelActive]}>
                  {cat}
                </Text>
                {selectedCategory === cat && <Check size={16} color={Colors.accentOrange} />}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <View style={emptyStyles.container}>
      <Text style={emptyStyles.text}>{message}</Text>
    </View>
  );
}

const emptyStyles = StyleSheet.create({
  container: { alignItems: 'center', paddingTop: 60 },
  text: { color: Colors.textTertiary, fontSize: Typography.sm },
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.base },
  header: {
    paddingTop: 56,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.sm,
  },
  title: {
    color: Colors.textPrimary,
    fontSize: Typography.xxl,
    fontWeight: FontWeight.extrabold,
  },
  segmentWrapper: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceElevated,
    borderRadius: Radii.lg,
    marginHorizontal: Spacing.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
  },
  searchInput: {
    flex: 1,
    color: Colors.textPrimary,
    fontSize: Typography.base,
  },
  filterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },
  filterText: {
    color: Colors.textTertiary,
    fontSize: Typography.sm,
    fontWeight: FontWeight.medium,
  },
  filterTextActive: { color: Colors.accentOrange },
  listContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: 32,
    gap: Spacing.md,
  },
  gridContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: 32,
  },
  columnWrapper: { gap: Spacing.md, marginBottom: Spacing.md },
  gridItem: { flex: 1 },
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: Colors.surfaceElevated,
    borderTopLeftRadius: Radii.xl,
    borderTopRightRadius: Radii.xl,
    padding: Spacing.lg,
    paddingBottom: 40,
    gap: 2,
  },
  modalTitle: {
    color: Colors.textPrimary,
    fontSize: Typography.md,
    fontWeight: FontWeight.bold,
    marginBottom: Spacing.md,
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.surfaceBorder,
  },
  categoryLabel: {
    color: Colors.textSecondary,
    fontSize: Typography.base,
  },
  categoryLabelActive: {
    color: Colors.textPrimary,
    fontWeight: FontWeight.semibold,
  },
});
