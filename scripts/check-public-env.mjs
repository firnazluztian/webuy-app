#!/usr/bin/env node
/**
 * Fail the build when public client env names look like secrets.
 *
 * Scans:
 * - .env / .env.* (except .env.example content is still scanned for bad names)
 * - Source references to NEXT_PUBLIC_* and VITE_*
 *
 * Escape hatch (local only, never in CI): ALLOW_PUBLIC_SECRET_ENV=1
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const SECRET_HINT =
  /(?:SECRET|PRIVATE|PASSWORD|PASSWD|CREDENTIAL|AUTH_TOKEN|ACCESS_TOKEN|REFRESH_TOKEN|API_KEY|APIKEY|PRIVATE_KEY|SIGNING|WEBHOOK|DATABASE_URL|DB_URL|CONNECTION_STRING|STRIPE_SECRET|AWS_SECRET|CLIENT_SECRET)/i;

const PUBLIC_PREFIXES = ["NEXT_PUBLIC_", "VITE_"];

const SOURCE_EXT = new Set([
  ".ts",
  ".tsx",
  ".js",
  ".jsx",
  ".mjs",
  ".cjs",
  ".mts",
  ".cts",
]);

const IGNORE_DIR = new Set([
  "node_modules",
  ".git",
  ".next",
  "dist",
  "coverage",
  ".turbo",
  ".vercel",
]);

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (IGNORE_DIR.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
}

function isEnvFile(filePath) {
  const base = path.basename(filePath);
  return base === ".env" || base.startsWith(".env.");
}

function extractEnvKeysFromEnvFile(content) {
  const keys = [];
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const match = trimmed.match(/^(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=/);
    if (match) keys.push(match[1]);
  }
  return keys;
}

function extractPublicEnvFromSource(content) {
  const found = new Set();
  const nextRe = /NEXT_PUBLIC_[A-Z0-9_]+/g;
  const viteRe = /VITE_[A-Z0-9_]+/g;
  for (const re of [nextRe, viteRe]) {
    let m;
    while ((m = re.exec(content)) !== null) found.add(m[0]);
  }
  return [...found];
}

function isPublicName(name) {
  return PUBLIC_PREFIXES.some((p) => name.startsWith(p));
}

function looksSecret(name) {
  if (!isPublicName(name)) return false;
  // Allow well-known publishable / site identifiers that are intentionally public.
  if (/_PUBLISHABLE(_|$)/i.test(name)) return false;
  if (/NEXT_PUBLIC_GTM_/i.test(name)) return false;
  if (/NEXT_PUBLIC_GA_/i.test(name)) return false;
  if (/SITE_KEY|SITEKEY|RECAPTCHA_SITE/i.test(name) && !/SECRET/i.test(name)) {
    return false;
  }
  return SECRET_HINT.test(name);
}

function main() {
  if (process.env.ALLOW_PUBLIC_SECRET_ENV === "1") {
    console.warn(
      "[check-public-env] ALLOW_PUBLIC_SECRET_ENV=1 — skipping public secret scan (do not use in CI).",
    );
    return;
  }

  const findings = [];

  const envCandidates = [
    ...walk(root).filter(isEnvFile),
    path.join(root, ".env.example"),
    path.join(root, "apps/webuy-web/.env.example"),
    path.join(root, "apps/webuy-bo/.env.example"),
  ];

  for (const file of new Set(envCandidates)) {
    if (!fs.existsSync(file)) continue;
    const content = fs.readFileSync(file, "utf8");
    for (const key of extractEnvKeysFromEnvFile(content)) {
      if (looksSecret(key)) {
        findings.push({ file: path.relative(root, file), name: key, kind: "env-file" });
      }
    }
  }

  const sourceRoots = [
    path.join(root, "apps"),
    path.join(root, "packages"),
    path.join(root, "scripts"),
  ];

  for (const srcRoot of sourceRoots) {
    for (const file of walk(srcRoot)) {
      if (!SOURCE_EXT.has(path.extname(file))) continue;
      if (path.basename(file) === "check-public-env.mjs") continue;
      const content = fs.readFileSync(file, "utf8");
      for (const name of extractPublicEnvFromSource(content)) {
        if (looksSecret(name)) {
          findings.push({
            file: path.relative(root, file),
            name,
            kind: "source",
          });
        }
      }
    }
  }

  const unique = [
    ...new Map(findings.map((f) => [`${f.file}:${f.name}`, f])).values(),
  ];

  if (unique.length === 0) {
    console.log("[check-public-env] OK — no secret-like public env names found.");
    return;
  }

  console.error(
    "[check-public-env] Refusing to build: public client env names look like secrets.\n" +
      "NEXT_PUBLIC_* and VITE_* are visible in the browser. Move secrets to server-only env,\n" +
      "or use a true publishable key. See AGENTS.md.\n",
  );
  for (const f of unique) {
    console.error(`  - ${f.name} (${f.kind}) in ${f.file}`);
  }
  console.error(
    "\nIf this is a false positive and the value is intentionally public, rename it\n" +
      "(e.g. *_PUBLISHABLE_KEY) or discuss with the team. Do not set ALLOW_PUBLIC_SECRET_ENV in CI.",
  );
  process.exit(1);
}

main();
