import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Colors, Typography, FontWeight, Spacing } from '../constants/theme';

export default function NotFoundScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>🔍</Text>
      <Text style={styles.title}>Page not found</Text>
      <Text style={styles.body}>This screen doesn't exist.</Text>
      <TouchableOpacity onPress={() => router.replace('/(tabs)')} style={styles.btn}>
        <Text style={styles.btnText}>Go to Home</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.base,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.md,
    padding: Spacing.xl,
  },
  emoji: { fontSize: 48 },
  title: {
    color: Colors.textPrimary,
    fontSize: Typography.xl,
    fontWeight: FontWeight.extrabold,
  },
  body: { color: Colors.textSecondary, fontSize: Typography.base },
  btn: {
    marginTop: Spacing.md,
    backgroundColor: Colors.accentOrange,
    borderRadius: 12,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
  },
  btnText: {
    color: '#fff',
    fontWeight: FontWeight.semibold,
    fontSize: Typography.base,
  },
});
