import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { X, Activity, FlaskConical, Play } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';
import { format, isToday, isYesterday } from 'date-fns';
import { useProtocolStore } from '../../store/useProtocolStore';
import { Colors, Radii, Typography, FontWeight, Spacing } from '../../constants/theme';
import type { ActivityLogEntry } from '../../types';

const TYPE_CONFIG = {
  protocol_started: { icon: Play, color: Colors.accentViolet, bg: 'rgba(123,79,255,0.12)' },
  vial_saved: { icon: FlaskConical, color: Colors.accentOrange, bg: 'rgba(255,107,43,0.12)' },
  dose_logged: { icon: Activity, color: Colors.success, bg: 'rgba(46,204,113,0.12)' },
};

function groupByDate(entries: ActivityLogEntry[]) {
  const map = new Map<string, ActivityLogEntry[]>();
  entries.forEach((e) => {
    const d = new Date(e.date);
    let key: string;
    if (isToday(d)) key = 'Today';
    else if (isYesterday(d)) key = 'Yesterday';
    else key = format(d, 'MMM d, yyyy');
    const arr = map.get(key) ?? [];
    arr.push(e);
    map.set(key, arr);
  });
  return Array.from(map.entries());
}

export default function StatsScreen() {
  const { activityLog, myProtocols } = useProtocolStore();
  const grouped = groupByDate(activityLog);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.header}>
        <Text style={styles.title}>Stats & Activity</Text>
        <TouchableOpacity style={styles.closeBtn} onPress={() => router.back()}>
          <X size={20} color={Colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* Summary cards */}
        <View style={styles.summaryRow}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryValue}>{myProtocols.length}</Text>
            <Text style={styles.summaryLabel}>Active Protocols</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryValue}>{activityLog.length}</Text>
            <Text style={styles.summaryLabel}>Total Actions</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryValue}>
              {activityLog.filter((e) => e.type === 'vial_saved').length}
            </Text>
            <Text style={styles.summaryLabel}>Vials Saved</Text>
          </View>
        </View>

        {/* Activity history */}
        <Text style={styles.sectionTitle}>ACTIVITY HISTORY</Text>

        {activityLog.length === 0 ? (
          <EmptyState />
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
                      <Icon size={16} color={config.color} />
                    </View>
                    <View style={styles.entryText}>
                      <Text style={styles.entryTitle}>{entry.title}</Text>
                      {entry.subtitle ? (
                        <Text style={styles.entrySub}>{entry.subtitle}</Text>
                      ) : null}
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

function EmptyState() {
  return (
    <View style={emptyStyles.container}>
      <Text style={emptyStyles.emoji}>📊</Text>
      <Text style={emptyStyles.title}>No activity yet</Text>
      <Text style={emptyStyles.body}>
        Start a protocol or save a vial — your activity will appear here.
      </Text>
    </View>
  );
}

const emptyStyles = StyleSheet.create({
  container: { alignItems: 'center', paddingTop: 60, gap: Spacing.sm },
  emoji: { fontSize: 48 },
  title: {
    color: Colors.textPrimary,
    fontSize: Typography.lg,
    fontWeight: FontWeight.bold,
  },
  body: {
    color: Colors.textSecondary,
    fontSize: Typography.sm,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: Spacing.xl,
  },
});

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
  title: {
    color: Colors.textPrimary,
    fontSize: Typography.xl,
    fontWeight: FontWeight.extrabold,
  },
  closeBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: Colors.surfaceElevated,
    alignItems: 'center', justifyContent: 'center',
  },
  scroll: { paddingHorizontal: Spacing.lg, paddingBottom: 48 },
  summaryRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: Colors.surfaceElevated,
    borderRadius: Radii.lg,
    padding: Spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    gap: 4,
  },
  summaryValue: {
    color: Colors.accentOrange,
    fontSize: Typography.xxl,
    fontWeight: FontWeight.extrabold,
  },
  summaryLabel: {
    color: Colors.textTertiary,
    fontSize: Typography.xs,
    textAlign: 'center',
    lineHeight: 14,
  },
  sectionTitle: {
    color: Colors.textTertiary,
    fontSize: Typography.xs,
    fontWeight: FontWeight.semibold,
    letterSpacing: 1.5,
    marginBottom: Spacing.md,
  },
  group: { marginBottom: Spacing.lg },
  dateLabel: {
    color: Colors.textSecondary,
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
    width: 36, height: 36, borderRadius: 10,
    alignItems: 'center', justifyContent: 'center',
  },
  entryText: { flex: 1 },
  entryTitle: {
    color: Colors.textPrimary,
    fontSize: Typography.sm,
    fontWeight: FontWeight.semibold,
  },
  entrySub: { color: Colors.textTertiary, fontSize: Typography.xs, marginTop: 2 },
  entryTime: { color: Colors.textTertiary, fontSize: Typography.xs },
});
