/**
 * Type-level gate: every component manifest must satisfy ComponentManifest.
 * Runs as part of `pnpm typecheck` (tsc --noEmit). Add one line per component.
 */
import type { ComponentManifest } from "./manifest-schema";
import { manifest as button } from "../src/components/button";

button satisfies ComponentManifest;
