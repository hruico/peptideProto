import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { router } from 'expo-router';
import { X, User, ChevronRight, Settings } from 'lucide-react-native';
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
      <StatusBar style="dark" />

      {/* Close */}
      <TouchableOpacity style={styles.closeBtn} onPress={() => router.back()}>
        <X size={18} color={Colors.textPrimary} />
      </TouchableOpacity>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Avatar */}
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <User size={36} color={Colors.textSecondary} />
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
              <Text style={styles.saveCardSub}>Sync across devices and keep your data</Text>
            </View>
            <TouchableOpacity
              style={styles.signInBtn}
              onPress={() => signIn('Demo User')}
              activeOpacity={0.85}
            >
              <Text style={styles.signInText}>Sign In</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Menu section */}
        <View style={styles.menuSection}>
          <TouchableOpacity
            style={styles.menuRow}
            onPress={() => router.push('/account/my-protocols')}
            activeOpacity={0.7}
          >
            <Text style={styles.menuRowText}>My Protocols</Text>
            <ChevronRight size={18} color={Colors.textTertiary} />
          </TouchableOpacity>

          <View style={styles.separator} />

          <TouchableOpacity
            style={styles.menuRow}
            onPress={() => router.push('/account/stats')}
            activeOpacity={0.7}
          >
            <Text style={styles.menuRowText}>Stats & Activity</Text>
            <ChevronRight size={18} color={Colors.textTertiary} />
          </TouchableOpacity>

          <View style={styles.separator} />

          <TouchableOpacity
            style={styles.menuRow}
            onPress={() => router.push('/account/settings' as any)}
            activeOpacity={0.7}
          >
            <Text style={styles.menuRowText}>Settings</Text>
            <ChevronRight size={18} color={Colors.textTertiary} />
          </TouchableOpacity>
        </View>

        {/* Set Up Public Profile */}
        <TouchableOpacity
          style={[styles.profileRow, isGuest && styles.profileRowDisabled]}
          disabled={isGuest}
          onPress={() => Alert.alert('Public Profile', 'Coming soon!')}
          activeOpacity={0.8}
        >
          <Text style={[styles.profileRowTitle, isGuest && { color: Colors.textTertiary }]}>
            Set Up Public Profile
          </Text>
          {isGuest && <Text style={styles.profileRowHint}>Sign in first</Text>}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.base },
  closeBtn: {
    position: 'absolute', top: 52, right: Spacing.lg, zIndex: 10,
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: Colors.surface, alignItems: 'center', justifyContent: 'center',
  },
  scroll: {
    paddingHorizontal: Spacing.lg, paddingTop: 100, paddingBottom: 48, alignItems: 'center',
  },
  avatarContainer: { alignItems: 'center', marginBottom: Spacing.xl, gap: Spacing.sm },
  avatar: {
    width: 88, height: 88, borderRadius: 44,
    backgroundColor: Colors.surface, borderWidth: 1.5, borderColor: Colors.surfaceBorder,
    alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.sm,
  },
  displayName: { color: Colors.textPrimary, fontSize: Typography.xl, fontWeight: FontWeight.extrabold },
  since: { color: Colors.textTertiary, fontSize: Typography.sm },
  saveCard: {
    width: '100%', flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.primaryOrange, borderRadius: Radii.xl,
    padding: Spacing.lg, marginBottom: Spacing.xl,
  },
  saveCardLeft: { flex: 1 },
  saveCardTitle: { color: '#fff', fontSize: Typography.base, fontWeight: FontWeight.bold },
  saveCardSub: { color: 'rgba(255,255,255,0.75)', fontSize: Typography.xs, marginTop: 2 },
  signInBtn: {
    backgroundColor: '#fff', borderRadius: Radii.lg,
    paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm,
  },
  signInText: { color: Colors.primaryOrange, fontSize: Typography.sm, fontWeight: FontWeight.bold },
  menuSection: {
    width: '100%', backgroundColor: Colors.surface, borderRadius: Radii.xl,
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
    width: '100%', padding: Spacing.lg, backgroundColor: Colors.surface,
    borderRadius: Radii.xl, borderWidth: 1, borderColor: Colors.surfaceBorder,
  },
  profileRowDisabled: { opacity: 0.5 },
  profileRowTitle: { color: Colors.textPrimary, fontSize: Typography.base, fontWeight: FontWeight.semibold },
  profileRowHint: { color: Colors.textTertiary, fontSize: Typography.xs, marginTop: 2 },
});
