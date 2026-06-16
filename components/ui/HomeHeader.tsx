import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Bell, Bookmark, User } from 'lucide-react-native';
import { router } from 'expo-router';
import { Colors, Typography, FontWeight, Spacing } from '../../constants/theme';

export default function HomeHeader() {
  return (
    <View style={styles.container}>
      {/* Avatar / Account */}
      <TouchableOpacity
        style={styles.avatar}
        onPress={() => router.push('/account/account' as any)}
        activeOpacity={0.8}
      >
        <User size={18} color={Colors.textSecondary} />
      </TouchableOpacity>

      {/* Title */}
      <View style={styles.titleBlock}>
        <Text style={styles.welcome}>Welcome back</Text>
        <Text style={styles.appName}>THE PEPTIDE APP</Text>
      </View>

      {/* Right icons */}
      <View style={styles.rightIcons}>
        <TouchableOpacity activeOpacity={0.7}>
          <Bell size={22} color={Colors.textSecondary} />
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.7}>
          <Bookmark size={22} color={Colors.textSecondary} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: 56,
    paddingBottom: Spacing.md,
    backgroundColor: Colors.base,
    gap: Spacing.md,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.surfaceElevated,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleBlock: {
    flex: 1,
  },
  welcome: {
    color: Colors.textTertiary,
    fontSize: Typography.xs,
    fontWeight: FontWeight.medium,
  },
  appName: {
    color: Colors.textPrimary,
    fontSize: Typography.sm,
    fontWeight: FontWeight.extrabold,
    letterSpacing: 1.5,
  },
  rightIcons: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
});
