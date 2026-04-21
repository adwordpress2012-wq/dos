// 1. Export everything from the primary source
export * from "./generated/api";

// 2. Export ONLY what is missing from 'types' (excluding the duplicates)
// If 'generated/api' already covers everything, you can delete this line entirely.
export {
  // Add unique types here that only exist in 'types.ts', e.g.:
  // SomeUniqueTypeOnlyInTypes
} from "./generated/types";