import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Platform } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ChevronLeft, ChevronRight, Bell, MessageSquare, HeartPulse, HelpCircle, FileText, RotateCcw } from 'lucide-react-native';
import { useState } from 'react';
import { useUserStore } from '../../store/useUserStore';
import { useOnboardingStore } from '../../store/useOnboardingStore';
import { useScheduleStore } from '../../store/useScheduleStore';
import { useProtocolStore } from '../../store/useProtocolStore';
import { useTrackingStore } from '../../store/useTrackingStore';
import { Colors, Radii, Typography, FontWeight, Spacing } from '../../constants/theme';

export default function SettingsScreen() {
  const [notifications, setNotifications] = useState(true);
  const [weightUnit, setWeightUnit] = useState<'LB' | 'KG'>('LB');
  const [practitionerMode, setPractitionerMode] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);

  const { resetOnboarding } = useOnboardingStore();
  const { signOut } = useUserStore();
  const { clearAll } = useScheduleStore();
  const { clearActivityLog, removeProtocol, myProtocols } = useProtocolStore();
  const { sessions, removeSession } = useTrackingStore();

  function doReset() {
    clearAll();
    clearActivityLog();
    // snapshot the arrays first so forEach doesn't mutate mid-loop
    [...myProtocols].forEach(p => removeProtocol(p.id));
    [...sessions].forEach(s => removeSession(s.id));
    signOut();
    resetOnboarding();
    router.replace('/onboarding/splash' as any);
  }

  function handleResetDemo() {
    if (Platform.OS === 'web') {
      // Alert.alert is a no-op on web — use inline confirm state instead
      setConfirmVisible(true);
    } else {
      Alert.alert(
        'Reset for Demo',
        'This will clear all data and restart onboarding.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Reset & Restart', style: 'destructive', onPress: doReset },
        ]
      );
    }
  }


  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ChevronLeft size={22} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* Notifications */}
        <View style={styles.section}>
          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Bell size={18} color={Colors.primaryOrange} />
              <Text style={styles.settingLabel}>Notifications</Text>
            </View>
            <TouchableOpacity onPress={() => setNotifications(!notifications)}>
              <View style={[styles.toggle, notifications && styles.toggleOn]}>
                <View style={[styles.toggleThumb, notifications && styles.toggleThumbOn]} />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Units */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>UNITS</Text>
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Weight</Text>
            <View style={styles.segmented}>
              {(['LB', 'KG'] as const).map((u) => (
                <TouchableOpacity
                  key={u}
                  style={[styles.segBtn, weightUnit === u && styles.segBtnActive]}
                  onPress={() => setWeightUnit(u)}
                >
                  <Text style={[styles.segBtnText, weightUnit === u && styles.segBtnTextActive]}>{u}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Practitioner Mode */}
        <View style={styles.section}>
          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Practitioner Mode</Text>
                <Text style={styles.settingDesc}>Organize peptides for collections</Text>
              </View>
            </View>
            <TouchableOpacity onPress={() => setPractitionerMode(!practitionerMode)}>
              <View style={[styles.toggle, practitionerMode && styles.toggleOn]}>
                <View style={[styles.toggleThumb, practitionerMode && styles.toggleThumbOn]} />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Links */}
        <View style={styles.section}>
          {[
            { icon: <MessageSquare size={18} color={Colors.textSecondary} />, label: 'Community', sub: 'Ask experienced peptide practitioners on Discord' },
            { icon: <HeartPulse size={18} color={Colors.textSecondary} />, label: 'Health Integrations', sub: 'Coming soon' },
            { icon: <HelpCircle size={18} color={Colors.textSecondary} />, label: 'Support', sub: '' },
            { icon: <FileText size={18} color={Colors.textSecondary} />, label: 'Terms & Conditions', sub: '' },
          ].map((item, i) => (
            <TouchableOpacity key={i} style={styles.linkRow} activeOpacity={0.7}>
              <View style={styles.settingLeft}>
                {item.icon}
                <View>
                  <Text style={styles.settingLabel}>{item.label}</Text>
                  {item.sub ? <Text style={styles.settingDesc}>{item.sub}</Text> : null}
                </View>
              </View>
              <ChevronRight size={16} color={Colors.textTertiary} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Demo reset */}
        <View style={[styles.section, { marginTop: Spacing.xl }]}>
          {confirmVisible ? (
            // Web-safe inline confirm (Alert.alert is a no-op on web)
            <View style={styles.confirmBox}>
              <Text style={styles.confirmText}>Reset all data and restart onboarding?</Text>
              <View style={styles.confirmBtns}>
                <TouchableOpacity
                  style={styles.confirmCancel}
                  onPress={() => setConfirmVisible(false)}
                >
                  <Text style={styles.confirmCancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.confirmDestroy}
                  onPress={() => { setConfirmVisible(false); doReset(); }}
                >
                  <Text style={styles.confirmDestroyText}>Reset & Restart</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <TouchableOpacity style={styles.resetRow} onPress={handleResetDemo} activeOpacity={0.8}>
              <View style={styles.settingLeft}>
                <View style={styles.resetIcon}>
                  <RotateCcw size={16} color={Colors.accentRed} />
                </View>
                <View>
                  <Text style={[styles.settingLabel, { color: Colors.accentRed }]}>Reset for Demo</Text>
                  <Text style={styles.settingDesc}>Clear all data and restart onboarding</Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.base },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg, paddingTop: 52, paddingBottom: Spacing.md,
    borderBottomWidth: 1, borderBottomColor: Colors.surfaceBorder,
  },
  backBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.surface, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: Typography.md, fontWeight: FontWeight.bold, color: Colors.textPrimary },
  scroll: { paddingBottom: 48 },
  section: {
    backgroundColor: Colors.surface, borderRadius: Radii.xl,
    marginHorizontal: Spacing.lg, marginTop: Spacing.md,
    paddingHorizontal: Spacing.md, overflow: 'hidden',
  },
  sectionLabel: { fontSize: Typography.xs, color: Colors.textTertiary, fontWeight: FontWeight.semibold, letterSpacing: 1.5, paddingTop: Spacing.md, paddingBottom: Spacing.sm },
  settingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: Spacing.md },
  linkRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: Spacing.md, borderTopWidth: 1, borderTopColor: Colors.surfaceBorder },
  settingLeft: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, flex: 1 },
  settingInfo: {},
  settingLabel: { fontSize: Typography.base, color: Colors.textPrimary, fontWeight: FontWeight.medium },
  settingDesc: { fontSize: Typography.xs, color: Colors.textSecondary, marginTop: 2 },
  toggle: { width: 44, height: 26, borderRadius: 13, backgroundColor: Colors.surfaceBorder, justifyContent: 'center', paddingHorizontal: 3 },
  toggleOn: { backgroundColor: Colors.primaryOrange },
  toggleThumb: { width: 20, height: 20, borderRadius: 10, backgroundColor: '#fff' },
  toggleThumbOn: { alignSelf: 'flex-end' },
  segmented: { flexDirection: 'row', backgroundColor: Colors.surfaceBorder, borderRadius: Radii.full, padding: 2 },
  segBtn: { paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs, borderRadius: Radii.full },
  segBtnActive: { backgroundColor: Colors.primaryOrange },
  segBtnText: { fontSize: Typography.sm, color: Colors.textSecondary, fontWeight: FontWeight.medium },
  segBtnTextActive: { color: '#fff', fontWeight: FontWeight.bold },
  resetRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.md,
  },
  resetIcon: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: 'rgba(231,76,60,0.15)',
    alignItems: 'center', justifyContent: 'center',
  },
  confirmBox: {
    padding: Spacing.md, gap: Spacing.md,
  },
  confirmText: {
    color: Colors.textPrimary, fontSize: Typography.sm, lineHeight: 20,
  },
  confirmBtns: {
    flexDirection: 'row', gap: Spacing.sm,
  },
  confirmCancel: {
    flex: 1, paddingVertical: Spacing.sm, borderRadius: Radii.lg,
    backgroundColor: Colors.surfaceBorder, alignItems: 'center',
  },
  confirmCancelText: {
    color: Colors.textSecondary, fontSize: Typography.sm, fontWeight: FontWeight.medium,
  },
  confirmDestroy: {
    flex: 1, paddingVertical: Spacing.sm, borderRadius: Radii.lg,
    backgroundColor: Colors.accentRed, alignItems: 'center',
  },
  confirmDestroyText: {
    color: '#fff', fontSize: Typography.sm, fontWeight: FontWeight.bold,
  },
});
