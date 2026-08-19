#!/usr/bin/env node
// Compiles records/*.json into modules.json — the compact, machine-facing
// projection. records/ stay the pretty-printed, human-audited source of truth;
// modules.json is minified so it is never a second copy to hand-edit.
//
// v1 exclusion rule: a fact whose source.type is "derived" (equivalently,
// whose confidence is "low") is NOT confirmable in the manufacturer PDF, so it
// stays in records/ for the audit trail and is dropped from the projection.
//   node scripts/generate.mjs
import { writeFileSync } from "node:fs";
import { basename } from "node:path";
import { MODULES_JSON, readJson, recordFiles } from "./lib.mjs";

const modules = [];
let dropped = 0;

for (const file of recordFiles()) {
  const record = readJson(file);
  const kept = (record.facts || []).filter((f) => f.source.type !== "derived" && f.confidence !== "low");
  dropped += (record.facts || []).length - kept.length;
  modules.push({ ...record, facts: kept });
  console.log(`  ${basename(file)}: ${kept.length} fact(s) kept, ${(record.facts || []).length - kept.length} excluded`);
}

const collection = {
  schema_version: "1.0.0",
  generator: "apps/normalled/scripts/generate.mjs",
  excludes: "facts with source.type=derived or confidence=low (not confirmable in the manufacturer PDF)",
  modules,
};

writeFileSync(MODULES_JSON, JSON.stringify(collection) + "\n");
console.log(`generate: ${modules.length} module(s), ${modules.reduce((n, m) => n + m.facts.length, 0)} fact(s), ${dropped} excluded -> ${basename(MODULES_JSON)}`);
