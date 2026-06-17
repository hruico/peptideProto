import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ChevronLeft, Users } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { PROTOCOLS } from '../../data/protocols';
import { PEPTIDES } from '../../data/peptides';
import { Colors, Radii, Typography, FontWeight, Spacing } from '../../constants/theme';

const CARD_COLORS: string[] = [
  '#EF4444', '#F97316', '#3B82F6', '#8B5CF6', '#14B8A6', '#22C55E', '#6366F1',
];

function getCategoryColor(cat: string): string {
  const map: Record<string, string> = {
    'Recovery & Healing': '#EF4444', 'Fat Loss': '#F97316', 'Muscle & Performance': '#3B82F6',
    'Cognitive & Neuroprotection': '#8B5CF6', 'Sleep & Longevity': '#6366F1',
    'Skin & Aesthetics': '#EC4899', 'GI & Gut Health': '#22C55E',
  };
  return map[cat] ?? '#999';
}

export default function FeaturedProtocolsScreen() {
  const expertProtocols = PROTOCOLS.filter(p => p.category === 'expert-protocol');
  const curatedProtocols = PROTOCOLS.filter(p => p.category === 'curated-combo');

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <ChevronLeft size={22} color={Colors.textPrimary} />
        </TouchableOpacity>
        <View>
          <Text style={styles.title}>Featured Protocols</Text>
          <Text style={styles.sub}>Advanced multi-peptide protocols by experts</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Expert protocols grid */}
        <Text style={styles.sectionLabel}>EXPERT PROTOCOLS</Text>
        <View style={styles.grid}>
          {expertProtocols.map((protocol, i) => (
            <TouchableOpacity
              key={protocol.id}
              style={styles.gridCard}
              onPress={() => router.push({ pathname: '/protocol/[id]', params: { id: protocol.id } })}
              activeOpacity={0.85}
            >
              <LinearGradient
                colors={[CARD_COLORS[i % CARD_COLORS.length], '#000']}
                style={styles.gridCardGradient}
              >
                <Text style={styles.gridCardName}>{protocol.name}</Text>
                <Text style={styles.gridCardMeta}>{protocol.peptideIds.length} peptides · {protocol.durationLabel}</Text>
                <View style={styles.gridCardUsers}>
                  <Users size={10} color="rgba(255,255,255,0.7)" />
                  <Text style={styles.gridCardUsersText}>{protocol.participantCount.toLocaleString()}</Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>

        {/* Curated combos */}
        <Text style={[styles.sectionLabel, { marginTop: Spacing.xl }]}>CURATED COMBOS</Text>
        <View style={styles.grid}>
          {curatedProtocols.map((protocol, i) => (
            <TouchableOpacity
              key={protocol.id}
              style={styles.gridCard}
              onPress={() => router.push({ pathname: '/protocol/[id]', params: { id: protocol.id } })}
              activeOpacity={0.85}
            >
              <LinearGradient
                colors={[CARD_COLORS[(i + 3) % CARD_COLORS.length], '#000']}
                style={styles.gridCardGradient}
              >
                <Text style={styles.gridCardName}>{protocol.name}</Text>
                <Text style={styles.gridCardMeta}>{protocol.peptideIds.length} peptides · {protocol.durationLabel}</Text>
                <View style={styles.gridCardUsers}>
                  <Users size={10} color="rgba(255,255,255,0.7)" />
                  <Text style={styles.gridCardUsersText}>{protocol.participantCount.toLocaleString()}</Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>

        {/* Popular peptides list */}
        <Text style={[styles.sectionLabel, { marginTop: Spacing.xl }]}>POPULAR PEPTIDES</Text>
        {PEPTIDES.map((peptide) => (
          <TouchableOpacity
            key={peptide.id}
            style={styles.peptideRow}
            onPress={() => router.push({ pathname: '/peptide/[id]', params: { id: peptide.id } })}
            activeOpacity={0.7}
          >
            <View style={[styles.peptideAvatar, { backgroundColor: getCategoryColor(peptide.category) }]}>
              <Text style={styles.peptideAvatarLetter}>{peptide.name[0]}</Text>
            </View>
            <View style={styles.peptideInfo}>
              <Text style={styles.peptideName}>{peptide.name}</Text>
              <Text style={styles.peptideCategory}>{peptide.category}</Text>
            </View>
          </TouchableOpacity>
        ))}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.base },
  header: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    paddingHorizontal: Spacing.lg, paddingTop: 52, paddingBottom: Spacing.lg,
    borderBottomWidth: 1, borderBottomColor: Colors.surfaceBorder,
  },
  backBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.surface, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: Typography.xl, fontWeight: FontWeight.extrabold, color: Colors.textPrimary },
  sub: { fontSize: Typography.sm, color: Colors.textSecondary, marginTop: 2 },
  scroll: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.lg },
  sectionLabel: {
    fontSize: Typography.xs, color: Colors.textTertiary, fontWeight: FontWeight.semibold,
    letterSpacing: 1.5, marginBottom: Spacing.md,
  },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.md },
  gridCard: { width: '47%', borderRadius: Radii.xl, overflow: 'hidden' },
  gridCardGradient: { padding: Spacing.md, minHeight: 140, justifyContent: 'flex-end' },
  gridCardName: { fontSize: Typography.sm, fontWeight: FontWeight.extrabold, color: '#fff', marginBottom: 4 },
  gridCardMeta: { fontSize: Typography.xs, color: 'rgba(255,255,255,0.7)', marginBottom: 6 },
  gridCardUsers: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  gridCardUsersText: { fontSize: Typography.xs, color: 'rgba(255,255,255,0.7)' },
  peptideRow: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    paddingVertical: Spacing.md, borderBottomWidth: 1, borderBottomColor: Colors.surfaceBorder,
  },
  peptideAvatar: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  peptideAvatarLetter: { color: '#fff', fontSize: Typography.base, fontWeight: FontWeight.bold },
  peptideInfo: { flex: 1 },
  peptideName: { fontSize: Typography.base, fontWeight: FontWeight.semibold, color: Colors.textPrimary },
  peptideCategory: { fontSize: Typography.xs, color: Colors.textSecondary, marginTop: 2 },
});
