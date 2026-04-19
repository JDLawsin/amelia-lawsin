/**
 * Normalizes string for deduplication matching
 * Handles: case, whitespace, separators, accents, articles
 */
export function normalizeForMatching(input: string): string {
  if (!input) return "";

  return input
    .trim()
    .replace(/\s+/g, " ") // Collapse whitespace
    .replace(/[\-_./]/g, " ") // Replace separators with space
    .replace(/^(the|a|an)\s+/i, "") // Remove leading articles
    .toLowerCase()
    .normalize("NFD") // Decompose accented characters
    .replace(/[\u0300-\u036f]/g, "") // Remove accent marks
    .replace(/[^\w\s]/g, "") // Remove special characters
    .trim();
}

/**
 * Formats string for storage (Title Case)
 */
export function formatForStorage(input: string): string {
  if (!input) return "";

  return input
    .trim()
    .replace(/\s+/g, " ")
    .split(" ")
    .map((word) => {
      if (word.length <= 3 && word === word.toUpperCase()) {
        return word;
      }
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(" ");
}

/**
 * Generates a unique name for payment schemes
 * Combines type and key parameters for deduplication
 */
export function generatePaymentSchemeName(scheme: {
  type: string;
  downPayment?: number | null;
  terms?: number | null;
  interestRate?: number | null;
}): string {
  const parts: string[] = [];

  if (scheme.downPayment) {
    parts.push(`${scheme.downPayment}% Down`);
  }

  if (scheme.terms) {
    parts.push(`${scheme.terms} ${scheme.terms === 1 ? "Year" : "Years"}`);
  }

  if (scheme.interestRate) {
    parts.push(`${scheme.interestRate}% Interest`);
  }

  return parts.length > 0
    ? parts.join(", ")
    : scheme.type.replace(/_/g, " ").toLowerCase();
}
