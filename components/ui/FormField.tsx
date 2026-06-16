import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Radii, Typography, FontWeight, Spacing } from '../../constants/theme';

interface UnitOption {
  label: string;
  value: string;
}

interface Props {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  keyboardType?: 'numeric' | 'default';
  units?: UnitOption[];
  selectedUnit?: string;
  onUnitChange?: (unit: string) => void;
  hint?: string;
}

export default function FormField({
  label,
  value,
  onChangeText,
  placeholder = '0',
  keyboardType = 'numeric',
  units,
  selectedUnit,
  onUnitChange,
  hint,
}: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={Colors.textTertiary}
          keyboardType={keyboardType}
          returnKeyType="done"
        />
        {units && onUnitChange && (
          <View style={styles.unitRow}>
            {units.map((u) => (
              <TouchableOpacity
                key={u.value}
                style={[styles.unitBtn, selectedUnit === u.value && styles.unitBtnActive]}
                onPress={() => onUnitChange(u.value)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.unitText,
                    selectedUnit === u.value && styles.unitTextActive,
                  ]}
                >
                  {u.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
      {hint ? <Text style={styles.hint}>{hint}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: Spacing.md },
  label: {
    color: Colors.textSecondary,
    fontSize: Typography.sm,
    fontWeight: FontWeight.semibold,
    marginBottom: Spacing.xs,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceElevated,
    borderRadius: Radii.lg,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    overflow: 'hidden',
  },
  input: {
    flex: 1,
    color: Colors.textPrimary,
    fontSize: Typography.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    fontWeight: FontWeight.medium,
  },
  unitRow: {
    flexDirection: 'row',
    borderLeftWidth: 1,
    borderLeftColor: Colors.surfaceBorder,
  },
  unitBtn: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unitBtnActive: {
    backgroundColor: Colors.accentOrange,
  },
  unitText: {
    color: Colors.textTertiary,
    fontSize: Typography.xs,
    fontWeight: FontWeight.semibold,
  },
  unitTextActive: {
    color: Colors.textPrimary,
  },
  hint: {
    color: Colors.textTertiary,
    fontSize: Typography.xs,
    marginTop: 4,
  },
});
