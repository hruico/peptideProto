import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { X, Settings, User, ChevronRight, LogIn, BarChart2, BookOpen } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';
import { format } from 'date-fns';
import GradientButton from '../../components/ui/GradientButton';
import { useUserStore } from '../../store/useUserStore';
import { Colors, Radii, Typography, FontWeight, Spacing } from '../../constants/theme';

export default function AccountScreen() {
  const { user, isGuest, signIn } = useUserStore();

  const memberSince = user?.createdAt
    ? format(new Date(user.createdAt), 'yyyy')
    : '—';

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Account</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.iconBtn} activeOpacity={0.7}>
            <Settings size={20} color={Colors.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn} onPress={() => router.back()}>
            <X size={20} color={Colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* Avatar + identity */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <User size={32} color={Colors.textTertiary} />
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.displayName}>
              {isGuest ? 'Guest' : (user?.displayName ?? 'User')}
            </Text>
            <Text style={styles.memberSince}>Member since {memberSince}</Text>
          </View>
        </View>

        {/* Auth CTAs */}
        {isGuest && (
          <View style={styles.authSection}>
            <GradientButton
              label="Save Your Account"
              icon={LogIn}
              onPress={() => signIn('Demo User')}
            />
            <TouchableOpacity style={styles.signInRow} onPress={() => signIn('Demo User')}>
              <Text style={styles.signInText}>Already have an account? Sign In</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Menu */}
        <View style={styles.menuSection}>
          <MenuItem
            icon={BookOpen}
            label="My Protocols"
            onPress={() => router.push('/account/my-protocols')}
          />
          <MenuItem
            icon={BarChart2}
            label="Stats & Activity"
            onPress={() => router.push('/account/stats')}
          />
          <MenuItem
            icon={User}
            label="Set Up Public Profile"
            onPress={() => {}}
            disabled={isGuest}
            hint={isGuest ? 'Sign in to unlock' : undefined}
          />
        </View>
      </ScrollView>
    </View>
  );
}

function MenuItem({
  icon: Icon,
  label,
  onPress,
  disabled,
  hint,
}: {
  icon: any;
  label: string;
  onPress: () => void;
  disabled?: boolean;
  hint?: string;
}) {
  return (
    <TouchableOpacity
      style={[menuStyles.row, disabled && menuStyles.rowDisabled]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      <View style={menuStyles.iconCircle}>
        <Icon size={18} color={disabled ? Colors.textTertiary : Colors.accentOrange} />
      </View>
      <View style={menuStyles.textBlock}>
        <Text style={[menuStyles.label, disabled && menuStyles.labelDisabled]}>{label}</Text>
        {hint ? <Text style={menuStyles.hint}>{hint}</Text> : null}
      </View>
      <ChevronRight size={16} color={Colors.textTertiary} />
    </TouchableOpacity>
  );
}

const menuStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceElevated,
    borderRadius: Radii.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    gap: Spacing.md,
  },
  rowDisabled: { opacity: 0.4 },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(255,107,43,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textBlock: { flex: 1 },
  label: {
    color: Colors.textPrimary,
    fontSize: Typography.base,
    fontWeight: FontWeight.semibold,
  },
  labelDisabled: { color: Colors.textTertiary },
  hint: { color: Colors.textTertiary, fontSize: Typography.xs, marginTop: 2 },
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
  headerRight: { flexDirection: 'row', gap: Spacing.sm },
  iconBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: Colors.surfaceElevated,
    alignItems: 'center', justifyContent: 'center',
  },
  scroll: { paddingHorizontal: Spacing.lg, paddingBottom: 48 },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceElevated,
    borderRadius: Radii.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInfo: { gap: 4 },
  displayName: {
    color: Colors.textPrimary,
    fontSize: Typography.lg,
    fontWeight: FontWeight.extrabold,
  },
  memberSince: { color: Colors.textTertiary, fontSize: Typography.sm },
  authSection: { gap: Spacing.sm, marginBottom: Spacing.xl },
  signInRow: { alignItems: 'center' },
  signInText: {
    color: Colors.accentViolet,
    fontSize: Typography.sm,
    fontWeight: FontWeight.medium,
  },
  menuSection: { gap: 0 },
});
