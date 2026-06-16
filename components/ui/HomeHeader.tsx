import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Activity, BookOpen, User } from 'lucide-react-native';
import { router } from 'expo-router';
import { Colors, Typography, FontWeight, Spacing } from '../../constants/theme';

export default function HomeHeader() {
  return (
    <View style={styles.container}>
      {/* Avatar */}
      <TouchableOpacity
        style={styles.iconBtn}
        onPress={() => router.push('/account/account' as any)}
        activeOpacity={0.8}
      >
        <User size={20} color="rgba(255,255,255,0.7)" />
      </TouchableOpacity>

      {/* Centered title */}
      <Text style={styles.title}>Welcome</Text>

      {/* Right icons */}
      <View style={styles.rightIcons}>
        <TouchableOpacity style={styles.iconBtn} activeOpacity={0.7}>
          <Activity size={20} color="rgba(255,255,255,0.7)" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconBtn} activeOpacity={0.7}>
          <BookOpen size={20} color="rgba(255,255,255,0.7)" />
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
  },
  iconBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: Typography.lg,
    fontWeight: FontWeight.semibold,
    textAlign: 'center',
  },
  rightIcons: {
    flexDirection: 'row',
    gap: 4,
  },
});
