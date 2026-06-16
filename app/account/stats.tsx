import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { X, Activity, FlaskConical, Play } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';
import { format, isToday, isYesterday } from 'date-fns';
import { useProtocolStore } from '../../store/useProtocolStore';
import { Colors, Radii, Typography, FontWeight, Spacing } from '../../constants/theme';
import type { ActivityLogEntry } from '../../types';

const TYPE_CONFIG = {
  protocol_started: { icon: Play,         color: Colors.accentViolet, bg: 'rgba(123,79,255,0.12)' },
  vial_saved:       { icon: FlaskConical,  color: Colors.accentOrange, bg: 'rgba(255,107,43,0.12)' },
  dose_logged:      { icon: Activity,      color: '#4ADE80',           bg: 'rgba(74,222,128,0.12)' },
};

function groupByDate(entries: ActivityLogEntry[]) {
  const map = new Map<string, ActivityLogEntry[]>();
  entries.forEach((e) => {
    const d = new Date(e.date);
    const key = isToday(d) ? 'Today' : isYesterday(d) ? 'Yesterday' : format(d, 'MMM d, yyyy');
    const arr = map.get(key) ?? [];
    arr.push(e);
    map.set(key, arr);
  });
  return Array.from(map.entries());
}

export default function StatsScreen() {
  const { activityLog } = useProtocolStore();
  const grouped = groupByDate(activityLog);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.header}>
        <Text style={styles.title}>Stats & Activity</Text>
        <TouchableOpacity style={styles.closeBtn} onPress={() => router.back()}>
          <X size={18} color="rgba(255,255,255,0.6)" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <Text style={styles.sectionTitle}>Activity History</Text>
        <Text style={styles.sectionSub}>Your protocol and peptide schedule history</Text>

        {activityLog.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>No activity started yet</Text>
            <Text style={styles.emptySubText}>
              Start a protocol or schedule a peptide to see it here
            </Text>
          </View>
        ) : (
          grouped.map(([dateLabel, entries]) => (
            <View key={dateLabel} style={styles.group}>
              <Text style={styles.dateLabel}>{dateLabel}</Text>
              {entries.map((entry) => {
                const config = TYPE_CONFIG[entry.type] ?? TYPE_CONFIG.dose_logged;
                const Icon = config.icon;
                return (
                  <View key={entry.id} style={styles.entryRow}>
                    <View style={[styles.entryIcon, { backgroundColor: config.bg }]}>
                      <Icon size={15} color={config.color} />
                    </View>
                    <View style={styles.entryText}>
                      <Text style={styles.entryTitle}>{entry.title}</Text>
                      {entry.subtitle && (
                        <Text style={styles.entrySub}>{entry.subtitle}</Text>
                      )}
                    </View>
                    <Text style={styles.entryTime}>
                      {format(new Date(entry.date), 'HH:mm')}
                    </Text>
                  </View>
                );
              })}
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.base },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 56,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  title: { color: '#FFF', fontSize: Typography.xl, fontWeight: FontWeight.extrabold },
  closeBtn: {
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: Colors.surfaceElevated,
    alignItems: 'center', justifyContent: 'center',
  },
  scroll: { paddingHorizontal: Spacing.lg, paddingBottom: 48 },
  sectionTitle: {
    color: '#FFF',
    fontSize: Typography.lg,
    fontWeight: FontWeight.bold,
    marginBottom: 4,
  },
  sectionSub: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: Typography.sm,
    marginBottom: Spacing.lg,
  },
  emptyBox: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: Radii.lg,
    padding: Spacing.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    gap: Spacing.sm,
  },
  emptyText: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: Typography.base,
    fontWeight: FontWeight.medium,
  },
  emptySubText: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: Typography.sm,
    textAlign: 'center',
    lineHeight: 20,
  },
  group: { marginBottom: Spacing.lg },
  dateLabel: {
    color: '#FFF',
    fontSize: Typography.sm,
    fontWeight: FontWeight.semibold,
    marginBottom: Spacing.sm,
  },
  entryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    backgroundColor: Colors.surfaceElevated,
    borderRadius: Radii.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
  },
  entryIcon: {
    width: 34, height: 34, borderRadius: 9,
    alignItems: 'center', justifyContent: 'center',
  },
  entryText: { flex: 1 },
  entryTitle: { color: '#FFF', fontSize: Typography.sm, fontWeight: FontWeight.semibold },
  entrySub: { color: 'rgba(255,255,255,0.4)', fontSize: Typography.xs, marginTop: 2 },
  entryTime: { color: 'rgba(255,255,255,0.3)', fontSize: Typography.xs },
});
