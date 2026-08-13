export type Period = "FIRST_HALF" | "SECOND_HALF";

export const PeriodEnum = {
  FIRST_HALF: "FIRST_HALF",
  SECOND_HALF: "SECOND_HALF",
} as const;

export const PERIOD_LABELS: Record<Period, string> = {
  FIRST_HALF: "1ª Quinzena (Dias 1 - 15)",
  SECOND_HALF: "2ª Quinzena (Dias 16 - Fim)",
};

export default PeriodEnum;
