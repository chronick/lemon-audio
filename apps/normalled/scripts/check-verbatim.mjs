#!/usr/bin/env node
// Mechanical verbatim guard. Facts paraphrase the manual; they never carry
// long passages of it. Any string inside a fact's value or description over
// MAX_CHARS is a failure — that length is the shape of copied prose.
//   node scripts/check-verbatim.mjs
import { existsSync } from "node:fs";
import { basename } from "node:path";
import { MODULES_JSON, readJson, recordFiles } from "./lib.mjs";

const MAX_CHARS = 200;
const failures = [];
let checked = 0;
let longest = 0;

function walk(node, where) {
  if (typeof node === "string") {
    checked += 1;
    longest = Math.max(longest, node.length);
    if (node.length > MAX_CHARS) failures.push(`${where}: ${node.length} chars (max ${MAX_CHARS})`);
  } else if (node && typeof node === "object") {
    for (const [k, v] of Object.entries(node)) walk(v, `${where}.${k}`);
  }
}

function scan(record, label) {
  for (const f of record.facts || []) {
    walk(f.value, `${label} ${f.id} value`);
    walk(f.description, `${label} ${f.id} description`);
  }
}

for (const file of recordFiles()) scan(readJson(file), `records/${basename(file)}`);
if (existsSync(MODULES_JSON)) {
  for (const mod of readJson(MODULES_JSON).modules || []) scan(mod, `modules.json[${mod.module.slug}]`);
}

console.log(`check-verbatim: ${checked} string(s) checked, longest ${longest} chars, limit ${MAX_CHARS}`);
if (failures.length) {
  for (const f of failures) console.error(`  ERROR ${f}`);
  console.error(`check-verbatim: FAILED with ${failures.length} over-length string(s)`);
  process.exit(1);
}
console.log("check-verbatim: OK");
