#!/usr/bin/env node
// Validates every record in records/ and the generated modules.json against
// schema/normalled.schema.json, then applies the corpus provenance rules.
//   node scripts/validate.mjs
import { existsSync, readFileSync, statSync } from "node:fs";
import { basename, join } from "node:path";
import {
  MODULES_JSON, RECORDS_DIR, SCHEMA_PATH,
  findPatchLibrary, readJson, recordFiles, validate,
} from "./lib.mjs";

const schema = readJson(SCHEMA_PATH);
const library = findPatchLibrary();
const errors = [];
const notes = [];
const seenIds = new Set();

function checkRecord(record, label) {
  for (const e of validate(record, schema)) errors.push(`${label} ${e}`);

  const { module: mod, facts } = record;
  if (!mod || !Array.isArray(facts)) return;

  const ids = new Set([
    ...(mod.jacks || []).map((j) => j.id),
    ...(mod.controls || []).map((c) => c.id),
  ]);
  const resolves = (path) => {
    const [slug, ...rest] = path.split("/");
    if (slug !== mod.slug) return false;
    return rest.length === 0 || rest.every((seg) => ids.has(seg));
  };

  if (mod.manual.path !== `modules/${mod.slug}/manual.pdf`) {
    errors.push(`${label} module.manual.path does not match slug ${mod.slug}`);
  }
  if (library) {
    const pdf = join(library, mod.manual.path);
    if (!existsSync(pdf)) errors.push(`${label} cited manual missing from patch-library: ${mod.manual.path}`);
    else if (!readFileSync(pdf).subarray(0, 5).equals(Buffer.from("%PDF-"))) {
      errors.push(`${label} cited manual is not a PDF: ${mod.manual.path}`);
    } else if (statSync(pdf).size === 0) errors.push(`${label} cited manual is empty: ${mod.manual.path}`);
  }

  for (const f of facts) {
    const at = `${label} fact ${f.id}`;
    if (seenIds.has(`${label}|${f.id}`)) errors.push(`${at}: duplicate fact id`);
    seenIds.add(`${label}|${f.id}`);

    if (!f.id.startsWith(`${mod.slug}:`)) errors.push(`${at}: id must start with the module slug`);
    if (!resolves(f.subject)) errors.push(`${at}: subject "${f.subject}" resolves to no declared jack or control`);
    if (typeof f.value === "string" && f.value.includes("/") && /^[a-z0-9-]+\/[a-z0-9.-]+$/.test(f.value)) {
      if (!resolves(f.value)) errors.push(`${at}: value path "${f.value}" resolves to no declared jack or control`);
    }

    const src = f.source || {};
    if (JSON.stringify(src).includes("manual.md")) {
      errors.push(`${at}: a patch-library manual.md is never a citable source`);
    }
    if (src.type === "pdf_page") {
      if (!src.ref.startsWith(mod.manual.path)) errors.push(`${at}: pdf_page ref must cite ${mod.manual.path}`);
      const inRef = /#page=(\d+)$/.exec(src.ref);
      if (!inRef) errors.push(`${at}: pdf_page ref must end with #page=<n>`);
      else {
        const page = Number(inRef[1]);
        if (src.page !== undefined && src.page !== page) errors.push(`${at}: source.page disagrees with the ref`);
        if (page > mod.manual.pages) errors.push(`${at}: cites page ${page} of a ${mod.manual.pages}-page PDF`);
      }
    } else if (src.type === "derived") {
      if (f.confidence !== "low") errors.push(`${at}: derived facts must carry confidence low`);
    } else {
      errors.push(`${at}: normalization facts must cite a pdf_page (got ${src.type})`);
    }
    if (f.confidence !== "low" && src.type !== "pdf_page") {
      errors.push(`${at}: high/medium confidence requires a pdf_page source`);
    }
  }
}

for (const file of recordFiles()) {
  const record = readJson(file);
  checkRecord(record, `records/${basename(file)}`);
  if (record.module && `${record.module.slug}.json` !== basename(file)) {
    errors.push(`records/${basename(file)}: filename does not match module slug`);
  }
}

if (!existsSync(MODULES_JSON)) {
  errors.push("modules.json missing — run: node scripts/generate.mjs");
} else {
  const collection = readJson(MODULES_JSON);
  for (const e of validate(collection, schema.$defs.collection, schema)) errors.push(`modules.json ${e}`);
  for (const mod of collection.modules || []) {
    checkRecord(mod, `modules.json[${mod.module ? mod.module.slug : "?"}]`);
    for (const f of mod.facts || []) {
      if (f.source.type !== "pdf_page") {
        errors.push(`modules.json[${mod.module.slug}] fact ${f.id}: projection must contain pdf_page facts only`);
      }
    }
  }
  const nonHigh = (collection.modules || [])
    .flatMap((m) => m.facts || [])
    .filter((f) => f.confidence !== "high");
  if (nonHigh.length === 0) errors.push("modules.json contains no non-high-confidence fact");
  else notes.push(`${nonHigh.length} non-high-confidence fact(s) in the projection`);
}

notes.push(library ? `patch-library: ${library}` : "patch-library: NOT FOUND (PDF existence checks skipped)");
if (!library) notes.push("set NORMALLED_PATCH_LIBRARY to the chronick/patch-library checkout to enable them");

console.log(`validate: ${recordFiles().length} record(s) against ${basename(SCHEMA_PATH)} (${RECORDS_DIR})`);
for (const n of notes) console.log(`  note: ${n}`);
if (errors.length) {
  for (const e of errors) console.error(`  ERROR ${e}`);
  console.error(`validate: FAILED with ${errors.length} error(s)`);
  process.exit(1);
}
console.log("validate: OK");
