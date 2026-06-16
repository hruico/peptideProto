import { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Alert, TextInput,
} from 'react-native';
import { router } from 'expo-router';
import { X, Plus, ChevronRight, Trash2 } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';
import GradientButton from '../../components/ui/GradientButton';
import { useVialStore } from '../../store/useVialStore';
import { useProtocolStore } from '../../store/useProtocolStore';
import { POPULAR_BLENDS } from '../../data/blends';
import { Colors, Radii, Typography, FontWeight, Spacing } from '../../constants/theme';
import type { Blend } from '../../types';

export default function AddBlendScreen() {
  const { addCustomBlend } = useVialStore();
  const { logActivity } = useProtocolStore();
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [customName, setCustomName] = useState('');

  function handleSelectPopular(blend: Blend) {
    addCustomBlend({ ...blend, isCustom: false });
    logActivity({
      id: Date.now().toString(),
      date: new Date().toISOString(),
      type: 'vial_saved',
      title: `Added blend: ${blend.name}`,
      subtitle: `${blend.peptides.length} peptides`,
    });
    Alert.alert('Blend Added! ✅', `${blend.name} has been added to your vials.`, [
      { text: 'OK', onPress: () => router.back() },
    ]);
  }

  function handleSaveCustom() {
    if (!customName.trim()) {
      Alert.alert('Name required', 'Please enter a name for your custom blend.');
      return;
    }
    const blend: Blend = {
      id: Date.now().toString(),
      name: customName.trim(),
      isCustom: true,
      peptides: [],
    };
    addCustomBlend(blend);
    logActivity({
      id: Date.now().toString(),
      date: new Date().toISOString(),
      type: 'vial_saved',
      title: `Created custom blend: ${blend.name}`,
    });
    Alert.alert('Custom Blend Created! ✅', blend.name, [
      { text: 'OK', onPress: () => router.back() },
    ]);
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.header}>
        <Text style={styles.title}>Add a Blend</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn}>
          <X size={20} color={Colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* Popular blends */}
        <Text style={styles.sectionTitle}>POPULAR BLENDS</Text>
        {POPULAR_BLENDS.map((blend) => (
          <TouchableOpacity
            key={blend.id}
            style={styles.blendCard}
            onPress={() => handleSelectPopular(blend)}
            activeOpacity={0.85}
          >
            <View style={styles.blendLeft}>
              <Text style={styles.blendName}>{blend.name}</Text>
              {blend.description ? (
                <Text style={styles.blendDesc}>{blend.description}</Text>
              ) : null}
              <View style={styles.peptideChips}>
                {blend.peptides.map((p) => (
                  <View key={p.peptideId} style={styles.chip}>
                    <Text style={styles.chipText}>{p.peptideName}</Text>
                  </View>
                ))}
              </View>
            </View>
            <ChevronRight size={18} color={Colors.textTertiary} />
          </TouchableOpacity>
        ))}

        {/* Create custom blend */}
        <Text style={[styles.sectionTitle, { marginTop: Spacing.xl }]}>CREATE CUSTOM BLEND</Text>

        {!showCustomForm ? (
          <TouchableOpacity
            style={styles.customBtn}
            onPress={() => setShowCustomForm(true)}
            activeOpacity={0.85}
          >
            <Plus size={20} color={Colors.accentOrange} />
            <Text style={styles.customBtnText}>Create a new blend</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.customForm}>
            <Text style={styles.fieldLabel}>Blend name</Text>
            <TextInput
              style={styles.textInput}
              value={customName}
              onChangeText={setCustomName}
              placeholder="e.g. My Recovery Stack"
              placeholderTextColor={Colors.textTertiary}
            />
            <Text style={styles.formHint}>
              You can add individual peptides to this blend after saving.
            </Text>
            <GradientButton
              label="Save Custom Blend"
              onPress={handleSaveCustom}
              disabled={!customName.trim()}
            />
          </View>
        )}
      </ScrollView>
    </View>
  );
}

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
    fontSize: Typography.lg,
    fontWeight: FontWeight.extrabold,
  },
  closeBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: Colors.surfaceElevated,
    alignItems: 'center', justifyContent: 'center',
  },
  scroll: { paddingHorizontal: Spacing.lg, paddingBottom: 48 },
  sectionTitle: {
    color: Colors.textTertiary,
    fontSize: Typography.xs,
    fontWeight: FontWeight.semibold,
    letterSpacing: 1.5,
    marginBottom: Spacing.md,
  },
  blendCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceElevated,
    borderRadius: Radii.xl,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    gap: Spacing.md,
  },
  blendLeft: { flex: 1, gap: 4 },
  blendName: {
    color: Colors.textPrimary,
    fontSize: Typography.base,
    fontWeight: FontWeight.bold,
  },
  blendDesc: {
    color: Colors.textSecondary,
    fontSize: Typography.xs,
    lineHeight: 16,
  },
  peptideChips: { flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginTop: 4 },
  chip: {
    backgroundColor: 'rgba(255,107,43,0.1)',
    borderRadius: Radii.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
  },
  chipText: {
    color: Colors.accentOrange,
    fontSize: Typography.xs,
    fontWeight: FontWeight.medium,
  },
  customBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.surfaceElevated,
    borderRadius: Radii.xl,
    padding: Spacing.md,
    borderWidth: 1.5,
    borderColor: Colors.accentOrange,
    borderStyle: 'dashed',
  },
  customBtnText: {
    color: Colors.accentOrange,
    fontSize: Typography.base,
    fontWeight: FontWeight.semibold,
  },
  customForm: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: Radii.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    gap: Spacing.md,
  },
  fieldLabel: {
    color: Colors.textSecondary,
    fontSize: Typography.sm,
    fontWeight: FontWeight.semibold,
  },
  textInput: {
    backgroundColor: Colors.base,
    borderRadius: Radii.lg,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    color: Colors.textPrimary,
    fontSize: Typography.base,
    padding: Spacing.md,
  },
  formHint: {
    color: Colors.textTertiary,
    fontSize: Typography.xs,
    lineHeight: 16,
  },
});
