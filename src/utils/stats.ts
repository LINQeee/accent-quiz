export function getKnowledgeLevel(percent: number, confidence: number): string {
  if (percent >= 90 && confidence >= 75) return "Отличное знание";
  if (percent >= 75 && confidence >= 55) return "Уверенное знание";
  if (percent >= 55) return "Средний уровень";
  return "Нужно повторить";
}
