/**
 * Type-level gate: every component manifest must satisfy ComponentManifest.
 * Runs as part of `pnpm typecheck` (tsc --noEmit). Add one line per component.
 */
import type { ComponentManifest } from "./manifest-schema";
import { manifest as button } from "../src/components/button";
import { manifest as checkbox } from "../src/components/checkbox";
import { manifest as dialog } from "../src/components/dialog";
import { manifest as input } from "../src/components/input";
import { manifest as select } from "../src/components/select";
import { manifest as tabs } from "../src/components/tabs";
import { manifest as textarea } from "../src/components/textarea";

button satisfies ComponentManifest;
checkbox satisfies ComponentManifest;
dialog satisfies ComponentManifest;
input satisfies ComponentManifest;
select satisfies ComponentManifest;
tabs satisfies ComponentManifest;
textarea satisfies ComponentManifest;
