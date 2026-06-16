import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { router } from 'expo-router';
import { X, Image as ImageIcon, ChevronRight } from 'lucide-react-native';
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

      {/* Close */}
      <TouchableOpacity style={styles.closeBtn} onPress={() => router.back()}>
        <X size={18} color="rgba(255,255,255,0.6)" />
      </TouchableOpacity>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* Avatar */}
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <ImageIcon size={36} color="rgba(255,255,255,0.3)" />
          </View>
          <Text style={styles.displayName}>
            {isGuest ? 'Guest' : (user?.displayName ?? 'User')}
          </Text>
          <Text style={styles.since}>since {memberYear}</Text>
        </View>

        {/* Save Account card */}
        {isGuest && (
          <View style={styles.saveCard}>
            <View style={styles.saveCardLeft}>
              <Text style={styles.saveCardTitle}>Save Your Account</Text>
              <Text style={styles.saveCardSub}>Sync across devices</Text>
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

        {/* Set Up Public Profile */}
        <TouchableOpacity
          style={[styles.profileRow, isGuest && styles.profileRowDisabled]}
          disabled={isGuest}
          onPress={() => {
            if (!isGuest) {
              Alert.alert('Public Profile', 'Public profile setup coming soon!');
            }
          }}
          activeOpacity={0.8}
        >
          <View style={styles.profileRowLeft}>
            <View style={[styles.profileDot, isGuest && styles.profileDotDisabled]} />
            <View>
              <Text style={[styles.profileRowTitle, isGuest && styles.disabledText]}>
                Set Up Public Profile
              </Text>
              {isGuest && (
                <Text style={styles.profileRowHint}>Sign in first to create a public profile</Text>
              )}
            </View>
          </View>
          <ChevronRight size={16} color="rgba(255,255,255,0.2)" />
        </TouchableOpacity>

        {/* My Protocols */}
        <TouchableOpacity
          style={styles.menuRow}
          onPress={() => router.push('/account/my-protocols')}
          activeOpacity={0.8}
        >
          <Text style={styles.menuRowText}>My Protocols</Text>
          <ChevronRight size={16} color="rgba(255,255,255,0.3)" />
        </TouchableOpacity>

        {/* Stats */}
        <TouchableOpacity
          style={styles.menuRow}
          onPress={() => router.push('/account/stats')}
          activeOpacity={0.8}
        >
          <Text style={styles.menuRowText}>Stats & Activity</Text>
          <ChevronRight size={16} color="rgba(255,255,255,0.3)" />
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.base },
  closeBtn: {
    position: 'absolute',
    top: 52,
    right: Spacing.lg,
    zIndex: 10,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: Colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scroll: {
    paddingHorizontal: Spacing.lg,
    paddingTop: 100,
    paddingBottom: 48,
    alignItems: 'center',
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
    gap: Spacing.xs,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: Colors.surfaceElevated,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  displayName: {
    color: '#FFFFFF',
    fontSize: Typography.xl,
    fontWeight: FontWeight.extrabold,
  },
  since: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: Typography.sm,
  },
  saveCard: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.accentViolet,
    borderRadius: Radii.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
  },
  saveCardLeft: { flex: 1 },
  saveCardTitle: {
    color: '#FFFFFF',
    fontSize: Typography.base,
    fontWeight: FontWeight.bold,
  },
  saveCardSub: {
    color: 'rgba(255,255,255,0.65)',
    fontSize: Typography.xs,
    marginTop: 2,
  },
  signInBtn: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radii.lg,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
  },
  signInText: {
    color: Colors.accentViolet,
    fontSize: Typography.sm,
    fontWeight: FontWeight.bold,
  },
  profileRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surfaceElevated,
    borderRadius: Radii.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
  },
  profileRowDisabled: { opacity: 0.45 },
  profileRowLeft: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  profileDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.accentOrange,
  },
  profileDotDisabled: { backgroundColor: 'rgba(255,255,255,0.2)' },
  profileRowTitle: {
    color: '#FFFFFF',
    fontSize: Typography.base,
    fontWeight: FontWeight.semibold,
  },
  profileRowHint: {
    color: 'rgba(255,255,255,0.35)',
    fontSize: Typography.xs,
    marginTop: 2,
  },
  disabledText: { color: 'rgba(255,255,255,0.35)' },
  menuRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surfaceElevated,
    borderRadius: Radii.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
  },
  menuRowText: {
    color: '#FFFFFF',
    fontSize: Typography.base,
    fontWeight: FontWeight.semibold,
  },
});
