import type {
  ReconstitutionInput,
  PreMixedInput,
  CalcResult,
  DoseUnit,
  ConcentrationUnit,
} from '../types';

// ─── Unit converters ──────────────────────────────────────────────────────────

/** Convert any dose to mcg */
function toMcg(amount: number, unit: DoseUnit): number {
  switch (unit) {
    case 'mcg': return amount;
    case 'mg':  return amount * 1000;
    case 'IU':  return amount; // IU treated as mcg for syringe math (1:1 ratio)
  }
}

/** Convert any concentration to mcg/mL */
function toMcgPerMl(concentration: number, unit: ConcentrationUnit): number {
  switch (unit) {
    case 'mcg/mL': return concentration;
    case 'mg/mL':  return concentration * 1000;
    case 'IU/mL':  return concentration; // IU/mL treated as mcg/mL
  }
}

// ─── Calculator A: Reconstitute from powder ───────────────────────────────────
/**
 * Given a lyophilised vial and BAC water added, calculate draw volume for a desired dose.
 *
 * Example:
 *   5 mg vial + 2 mL BAC water → concentration = 2500 mcg/mL
 *   Desired dose 500 mcg → draw 0.2 mL (20 units on a 100-unit syringe)
 */
export function calculateFromReconstitution(input: ReconstitutionInput): CalcResult {
  const { vialAmountMg, bacWaterMl, desiredDose, desiredDoseUnit } = input;

  const vialAmountMcg = vialAmountMg * 1000;
  const concentrationMcgPerMl = vialAmountMcg / bacWaterMl;

  const doseMcg = toMcg(desiredDose, desiredDoseUnit);
  const drawVolumeMl = doseMcg / concentrationMcgPerMl;

  // A standard insulin syringe is 100 units per mL
  const syringeUnits = drawVolumeMl * 100;
  const dosesPerVial = vialAmountMcg / doseMcg;

  return {
    drawVolumeMl: roundTo(drawVolumeMl, 3),
    syringeUnits: roundTo(syringeUnits, 1),
    dosesPerVial: roundTo(dosesPerVial, 1),
    concentrationMcgPerMl: roundTo(concentrationMcgPerMl, 2),
  };
}

// ─── Calculator B: Pre-mixed / known concentration ────────────────────────────
/**
 * Given a pre-mixed vial with a known concentration, calculate draw volume.
 *
 * Example from spec §8 (verification case):
 *   concentration = 600 mcg/mL, totalVolumeMl = 20, doseAmount = 500 mcg
 *   → drawVolumeMl ≈ 0.833, syringeUnits ≈ 83.3, dosesPerVial ≈ 24
 */
export function calculateFromPreMixed(input: PreMixedInput): CalcResult {
  const { concentration, concentrationUnit, totalVolumeMl, doseAmount, doseUnit } = input;

  const concentrationMcgPerMl = toMcgPerMl(concentration, concentrationUnit);

  if (!doseAmount || !doseUnit) {
    // No dose specified — return concentration info only
    return {
      drawVolumeMl: 0,
      syringeUnits: 0,
      concentrationMcgPerMl: roundTo(concentrationMcgPerMl, 2),
    };
  }

  const doseMcg = toMcg(doseAmount, doseUnit);
  const drawVolumeMl = doseMcg / concentrationMcgPerMl;
  const syringeUnits = drawVolumeMl * 100;

  const totalAmountMcg = concentrationMcgPerMl * totalVolumeMl;
  const dosesPerVial = totalAmountMcg / doseMcg;

  return {
    drawVolumeMl: roundTo(drawVolumeMl, 3),
    syringeUnits: roundTo(syringeUnits, 1),
    dosesPerVial: roundTo(dosesPerVial, 1),
    concentrationMcgPerMl: roundTo(concentrationMcgPerMl, 2),
  };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function roundTo(value: number, decimals: number): number {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}

/** Format draw volume for display */
export function formatDrawVolume(ml: number): string {
  if (ml === 0) return '—';
  return `${ml.toFixed(3)} mL`;
}

/** Format syringe units for display */
export function formatSyringeUnits(units: number): string {
  if (units === 0) return '—';
  return `${units.toFixed(1)} units`;
}
