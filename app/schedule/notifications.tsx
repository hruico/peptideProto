import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Bell, ClipboardList } from 'lucide-react-native';
import { useState } from 'react';
import { Colors, Radii, Typography, FontWeight, Spacing } from '../../constants/theme';

export default function NotificationsScreen() {
  const [doseReminders, setDoseReminders] = useState(true);
  const [protocolUpdates, setProtocolUpdates] = useState(true);

  function handleEnable() {
    // In production: Notifications.requestPermissionsAsync()
    router.replace('/(tabs)');
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.content}>
        <View style={styles.bellWrap}>
          <Bell size={40} color={Colors.primaryOrange} />
        </View>

        <Text style={styles.headline}>Stay on Track</Text>
        <Text style={styles.sub}>
          Enable notifications to receive timely dose reminders and never miss a beat.
        </Text>

        <View style={styles.toggleList}>
          <View style={styles.toggleRow}>
            <View style={styles.toggleLeft}>
              <Bell size={18} color={Colors.primaryOrange} />
              <View>
                <Text style={styles.toggleTitle}>Dose Reminders</Text>
                <Text style={styles.toggleSub}>Never miss a scheduled dose</Text>
              </View>
            </View>
            <TouchableOpacity onPress={() => setDoseReminders(!doseReminders)}>
              <View style={[styles.toggle, doseReminders && styles.toggleOn]}>
                <View style={[styles.toggleThumb, doseReminders && styles.toggleThumbOn]} />
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.divider} />

          <View style={styles.toggleRow}>
            <View style={styles.toggleLeft}>
              <ClipboardList size={18} color={Colors.primaryOrange} />
              <View>
                <Text style={styles.toggleTitle}>Protocol Updates</Text>
                <Text style={styles.toggleSub}>Stay on track with your updates</Text>
              </View>
            </View>
            <TouchableOpacity onPress={() => setProtocolUpdates(!protocolUpdates)}>
              <View style={[styles.toggle, protocolUpdates && styles.toggleOn]}>
                <View style={[styles.toggleThumb, protocolUpdates && styles.toggleThumbOn]} />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.enableBtn} onPress={handleEnable} activeOpacity={0.85}>
          <Text style={styles.enableBtnText}>Enable Notifications</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.replace('/(tabs)')} style={{ marginTop: Spacing.lg }}>
          <Text style={styles.skipText}>Not now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.base },
  content: { flex: 1, paddingHorizontal: Spacing.lg, paddingTop: 100, alignItems: 'center' },
  bellWrap: {
    width: 80, height: 80, borderRadius: 40, backgroundColor: Colors.primaryOrangeLight,
    alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.xl,
  },
  headline: { fontSize: Typography.xxl, fontWeight: FontWeight.extrabold, color: Colors.textPrimary, textAlign: 'center', marginBottom: Spacing.sm },
  sub: { fontSize: Typography.sm, color: Colors.textSecondary, textAlign: 'center', lineHeight: 22, marginBottom: Spacing.xl },
  toggleList: { width: '100%', backgroundColor: Colors.surface, borderRadius: Radii.xl, padding: Spacing.md, marginBottom: Spacing.xl },
  toggleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: Spacing.sm },
  toggleLeft: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, flex: 1 },
  toggleTitle: { fontSize: Typography.base, fontWeight: FontWeight.semibold, color: Colors.textPrimary },
  toggleSub: { fontSize: Typography.xs, color: Colors.textSecondary },
  divider: { height: 1, backgroundColor: Colors.surfaceBorder, marginVertical: Spacing.sm },
  toggle: { width: 44, height: 26, borderRadius: 13, backgroundColor: Colors.surfaceBorder, justifyContent: 'center', paddingHorizontal: 3 },
  toggleOn: { backgroundColor: Colors.primaryOrange },
  toggleThumb: { width: 20, height: 20, borderRadius: 10, backgroundColor: '#fff' },
  toggleThumbOn: { alignSelf: 'flex-end' },
  enableBtn: { width: '100%', backgroundColor: Colors.primaryOrange, borderRadius: 32, paddingVertical: 18, alignItems: 'center' },
  enableBtnText: { color: '#fff', fontSize: Typography.base, fontWeight: FontWeight.bold },
  skipText: { color: Colors.textTertiary, fontSize: Typography.base },
});
