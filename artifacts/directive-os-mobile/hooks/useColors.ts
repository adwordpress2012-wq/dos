import colors from "@/constants/colors";

/**
 * Always returns dark palette — Directive OS Command Bridge is a dark-mode-only app.
 */
export function useColors() {
  return { ...colors.dark, radius: colors.radius };
}
