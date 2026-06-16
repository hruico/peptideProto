import {
  View, Text, StyleSheet, ScrollView,
  FlatList, TouchableOpacity,
} from 'react-native';
import { router } from 'expo-router';
import { useState } from 'react';
import * as Linking from 'expo-linking';
import { Target, Layers } from 'lucide-react-native';

import HomeHeader from '../../components/ui/HomeHeader';
import WeekDateStrip from '../../components/ui/WeekDateStrip';
import VerifiedExpertsCard from '../../components/cards/VerifiedExpertsCard';
import ProtocolHeroCard from '../../components/cards/ProtocolHeroCard';
import { PROTOCOLS } from '../../data/protocols';
import { Colors, Radii, Typography, FontWeight, Spacing } from '../../constants/theme';

const DISCORD_URL = 'https://discord.gg/peptideapp';

const curatedCombos = PROTOCOLS.filter((p) => p.category === 'curated-combo');
const expertProtocols = PROTOCOLS.filter((p) => p.category === 'expert-protocol');

export default function HomeScreen() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <View style={styles.container}>
      <HomeHeader />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {/* Week date strip */}
        <WeekDateStrip
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
        />

        {/* Verified experts card */}
        <View style={styles.section}>
          <VerifiedExpertsCard
            onPressAskExpert={() => Linking.openURL(DISCORD_URL)}
          />
        </View>

        {/* Jump straight in */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>OR JUMP STRAIGHT IN</Text>
          <View style={styles.jumpRow}>
            <TouchableOpacity
              style={styles.jumpCard}
              onPress={() => router.push('/onboarding/get-started')}
              activeOpacity={0.85}
            >
              <View style={styles.jumpIcon}>
                <Target size={22} color={Colors.accentOrange} />
              </View>
              <Text style={styles.jumpTitle}>Get guided</Text>
              <Text style={styles.jumpSub}>Match peptides to your goals</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.jumpCard}
              onPress={() => router.push('/reconstitute/add-blend')}
              activeOpacity={0.85}
            >
              <View style={styles.jumpIcon}>
                <Layers size={22} color={Colors.accentViolet} />
              </View>
              <Text style={styles.jumpTitle}>Bring your stack</Text>
              <Text style={styles.jumpSub}>Add what you're already running</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Curated combos */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Curated combos</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/explore')}>
              <Text style={styles.seeAll}>See all</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={curatedCombos}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.carousel}
            renderItem={({ item }) => (
              <ProtocolHeroCard
                protocol={item}
                onPress={() => router.push(`/protocol/${item.id}`)}
                width={260}
              />
            )}
          />
        </View>

        {/* Featured expert protocols */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured expert protocols</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/explore')}>
              <Text style={styles.seeAll}>See all</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={expertProtocols}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.carousel}
            renderItem={({ item }) => (
              <ProtocolHeroCard
                protocol={item}
                onPress={() => router.push(`/protocol/${item.id}`)}
                width={260}
              />
            )}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.base,
  },
  scroll: {
    paddingBottom: 32,
  },
  section: {
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.lg,
  },
  sectionLabel: {
    color: Colors.textTertiary,
    fontSize: Typography.xs,
    fontWeight: FontWeight.semibold,
    letterSpacing: 1.5,
    marginBottom: Spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    color: Colors.textPrimary,
    fontSize: Typography.md,
    fontWeight: FontWeight.bold,
  },
  seeAll: {
    color: Colors.accentOrange,
    fontSize: Typography.sm,
    fontWeight: FontWeight.semibold,
  },
  carousel: {
    paddingRight: Spacing.lg,
  },
  jumpRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  jumpCard: {
    flex: 1,
    backgroundColor: Colors.surfaceElevated,
    borderRadius: Radii.xl,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    gap: Spacing.xs,
  },
  jumpIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xs,
  },
  jumpTitle: {
    color: Colors.textPrimary,
    fontSize: Typography.sm,
    fontWeight: FontWeight.bold,
  },
  jumpSub: {
    color: Colors.textTertiary,
    fontSize: Typography.xs,
    lineHeight: 15,
  },
});
