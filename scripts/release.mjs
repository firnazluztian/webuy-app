#!/usr/bin/env node
/**
 * Independent app releases for the WeBuy monorepo.
 *
 * Usage (from repo root):
 *   node scripts/release.mjs web patch|minor|major
 *   node scripts/release.mjs bo  patch|minor|major
 *
 * Or via package.json:
 *   pnpm release:web:patch
 *   pnpm release:bo:minor
 *
 * Creates:
 *   - bumps apps/webuy-{web|bo}/package.json
 *   - prepends apps/webuy-{web|bo}/CHANGELOG.md
 *   - commit + annotated tag `web@x.y.z` / `bo@x.y.z`
 *   - pushes branch + tags
 *
 * Deploy stays on Vercel Git integration (merge/push to main).
 * Tags are the release ledger for "what shipped" and fast rollback lookup —
 * not Docker image tags. See docs/ops/0001-vercel-deploy-and-release.md.
 */

import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const APPS = {
  web: {
    dir: "apps/webuy-web",
    tagPrefix: "web",
    label: "@webuy/web",
  },
  bo: {
    dir: "apps/webuy-bo",
    tagPrefix: "bo",
    label: "@webuy/bo",
  },
};

const ALLOWED_BRANCHES = new Set(["main", "master"]);
const BUMP_TYPES = new Set(["patch", "minor", "major"]);

function run(command, opts = {}) {
  return execSync(command, {
    cwd: root,
    encoding: "utf8",
    stdio: opts.stdio ?? "pipe",
    ...opts,
  });
}

function bumpSemver(version, type) {
  const parts = version.split(".").map(Number);
  if (parts.length !== 3 || parts.some((n) => Number.isNaN(n))) {
    throw new Error(`Invalid semver "${version}" — expected x.y.z`);
  }
  let [major, minor, patch] = parts;
  if (type === "major") {
    major += 1;
    minor = 0;
    patch = 0;
  } else if (type === "minor") {
    minor += 1;
    patch = 0;
  } else {
    patch += 1;
  }
  return `${major}.${minor}.${patch}`;
}

function usage(exitCode = 1) {
  console.error(`Usage: node scripts/release.mjs <web|bo> <patch|minor|major>`);
  process.exit(exitCode);
}

const appKey = process.argv[2];
const bumpType = process.argv[3];

if (!appKey || !bumpType) usage();
if (!(appKey in APPS)) {
  console.error(`Unknown app "${appKey}". Use web or bo.`);
  usage();
}
if (!BUMP_TYPES.has(bumpType)) {
  console.error(`Unknown bump "${bumpType}". Use patch, minor, or major.`);
  usage();
}

const app = APPS[appKey];
const branch = run("git rev-parse --abbrev-ref HEAD").trim();
if (!ALLOWED_BRANCHES.has(branch)) {
  console.error(
    `🚫 On branch "${branch}". Switch to main (or master) before releasing.`,
  );
  process.exit(1);
}

const status = run("git status --porcelain").trim();
if (status) {
  console.error("🚫 Working tree dirty. Commit or stash before releasing.");
  console.error(status);
  process.exit(1);
}

const pkgPath = path.join(root, app.dir, "package.json");
const changelogPath = path.join(root, app.dir, "CHANGELOG.md");
const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
const previousVersion = pkg.version;
const newVersion = bumpSemver(previousVersion, bumpType);
const tag = `${app.tagPrefix}@${newVersion}`;

pkg.version = newVersion;
fs.writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`);

let previousTag = "";
try {
  previousTag = run(
    `git describe --tags --match "${app.tagPrefix}@*" --abbrev=0`,
  ).trim();
} catch {
  // first release for this app
}

let log = "";
try {
  const range = previousTag ? `${previousTag}..HEAD` : "";
  log = run(`git log ${range} --pretty=format:"- %s"`).trim();
} catch {
  log = "";
}

const today = new Date().toISOString().slice(0, 10);
const entry = `## [${tag}] - ${today}\n\n${log || "- No commit messages found"}\n`;
const title = `# Changelog — ${app.label}\n`;
let existing = "";
if (fs.existsSync(changelogPath)) {
  existing = fs.readFileSync(changelogPath, "utf8");
  if (existing.startsWith("# Changelog")) {
    const firstNewline = existing.indexOf("\n");
    existing = existing.slice(firstNewline + 1).replace(/^\n+/, "");
  }
}
fs.writeFileSync(
  changelogPath,
  `${title}\n${entry}\n${existing}`.replace(/\n{3,}/g, "\n\n"),
);

run(`git add "${app.dir}/package.json" "${app.dir}/CHANGELOG.md"`, {
  stdio: "inherit",
});
run(`git commit -m "Release ${tag}"`, { stdio: "inherit" });
run(`git tag -a "${tag}" -m "Release ${tag}"`, { stdio: "inherit" });

try {
  run(`git push origin ${branch} --follow-tags`, { stdio: "inherit" });
} catch {
  console.warn(
    `\n⚠️  Local release ${tag} created, but push failed (no remote / auth).`,
  );
  console.warn(`   Push manually: git push origin ${branch} --follow-tags`);
  process.exit(0);
}

console.log(`\n✅ Released ${tag} (${previousVersion} → ${newVersion})`);
console.log(`   App:     ${app.label}`);
console.log(`   Deploy:  Vercel project for ${app.dir} (turbo-ignore may skip the other app)`);
console.log(`   Rollback: Vercel → Deployments → … on previous production, or vercel rollback`);
