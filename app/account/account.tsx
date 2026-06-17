import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { router } from 'expo-router';
import { X, User, ChevronRight } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';
import { format } from 'date-fns';
import { useUserStore } from '../../store/useUserStore';
import { Colors, Radii, Typography, FontWeight, Spacing } from '../../constants/theme';

export default function AccountScreen() {
  const { user, isGuest, signIn } = useUserStore();
  const memberYear = user?.createdAt
    ? format(new Date(user.createdAt), 'yyyy')
    : new Date().getFullYear().toString();

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <TouchableOpacity style={styles.closeBtn} onPress={() => router.back()}>
        <X size={18} color="rgba(255,255,255,0.6)" />
      </TouchableOpacity>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Avatar */}
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <User size={36} color="rgba(255,255,255,0.3)" />
          </View>
          <Text style={styles.displayName}>
            {isGuest ? 'Guest' : (user?.displayName ?? 'User')}
          </Text>
          <Text style={styles.since}>Member since {memberYear}</Text>
        </View>

        {/* Save Account card */}
        {isGuest && (
          <View style={styles.saveCard}>
            <View style={styles.saveCardLeft}>
              <Text style={styles.saveCardTitle}>Save Your Account</Text>
              <Text style={styles.saveCardSub}>Sync across devices</Text>
            </View>
            <TouchableOpacity style={styles.signInBtn} onPress={() => signIn('Demo User')} activeOpacity={0.85}>
              <Text style={styles.signInText}>Sign In</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Menu */}
        <View style={styles.menuSection}>
          {[
            { label: 'My Protocols', route: '/account/my-protocols' },
            { label: 'Stats & Activity', route: '/account/stats' },
            { label: 'Settings', route: '/account/settings' },
          ].map((item, i, arr) => (
            <View key={item.label}>
              <TouchableOpacity
                style={styles.menuRow}
                onPress={() => router.push(item.route as any)}
                activeOpacity={0.7}
              >
                <Text style={styles.menuRowText}>{item.label}</Text>
                <ChevronRight size={18} color="rgba(255,255,255,0.25)" />
              </TouchableOpacity>
              {i < arr.length - 1 && <View style={styles.separator} />}
            </View>
          ))}
        </View>

        {/* Public Profile */}
        <TouchableOpacity
          style={[styles.profileRow, isGuest && { opacity: 0.45 }]}
          disabled={isGuest}
          onPress={() => Alert.alert('Public Profile', 'Coming soon!')}
          activeOpacity={0.8}
        >
          <Text style={styles.menuRowText}>Set Up Public Profile</Text>
          {isGuest && <Text style={styles.profileHint}>Sign in first</Text>}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.base },
  closeBtn: {
    position: 'absolute', top: 52, right: Spacing.lg, zIndex: 10,
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: Colors.surfaceElevated,
    alignItems: 'center', justifyContent: 'center',
  },
  scroll: { paddingHorizontal: Spacing.lg, paddingTop: 100, paddingBottom: 48, alignItems: 'center' },
  avatarContainer: { alignItems: 'center', marginBottom: Spacing.xl, gap: Spacing.sm },
  avatar: {
    width: 88, height: 88, borderRadius: 44,
    backgroundColor: Colors.surfaceElevated,
    borderWidth: 1, borderColor: Colors.surfaceBorder,
    alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.sm,
  },
  displayName: { color: Colors.textPrimary, fontSize: Typography.xl, fontWeight: FontWeight.extrabold },
  since: { color: Colors.textTertiary, fontSize: Typography.sm },
  saveCard: {
    width: '100%', flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.accentViolet, borderRadius: Radii.xl,
    padding: Spacing.lg, marginBottom: Spacing.xl,
  },
  saveCardLeft: { flex: 1 },
  saveCardTitle: { color: '#fff', fontSize: Typography.base, fontWeight: FontWeight.bold },
  saveCardSub: { color: 'rgba(255,255,255,0.65)', fontSize: Typography.xs, marginTop: 2 },
  signInBtn: { backgroundColor: '#fff', borderRadius: Radii.lg, paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm },
  signInText: { color: Colors.accentViolet, fontSize: Typography.sm, fontWeight: FontWeight.bold },
  menuSection: {
    width: '100%', backgroundColor: Colors.surfaceElevated, borderRadius: Radii.xl,
    overflow: 'hidden', marginBottom: Spacing.md,
    borderWidth: 1, borderColor: Colors.surfaceBorder,
  },
  menuRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg, paddingVertical: Spacing.lg,
  },
  menuRowText: { color: Colors.textPrimary, fontSize: Typography.base, fontWeight: FontWeight.semibold },
  separator: { height: 1, backgroundColor: Colors.surfaceBorder, marginHorizontal: Spacing.lg },
  profileRow: {
    width: '100%', padding: Spacing.lg,
    backgroundColor: Colors.surfaceElevated, borderRadius: Radii.xl,
    borderWidth: 1, borderColor: Colors.surfaceBorder,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  profileHint: { color: Colors.textTertiary, fontSize: Typography.xs },
});
