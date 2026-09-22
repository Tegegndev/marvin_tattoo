/**
 * LiteSpeed Web Server (lsnode.js) CommonJS Loader
 * Marvin Tattoo Studio API
 *
 * LiteSpeed's lsnode runner uses `require(startupFile)` synchronously.
 * Since this project uses ES Modules ("type": "module"), this .cjs file
 * acts as the CommonJS bridge by dynamically importing the compiled ES Module.
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

// 1. Ensure .env is loaded with absolute path regardless of process.cwd()
try {
  const dotenv = require("dotenv");
  dotenv.config({ path: path.join(__dirname, ".env") });
} catch (e) {
  // If dotenv isn't in root node_modules, try finding it
}

// 2. Configure Prisma engines without using /tmp (since /tmp is mounted noexec on cPanel)
function configurePrismaEngine() {
  const localEnginesDir = path.join(__dirname, "prisma-engines");
  const localClientDir = path.join(__dirname, "node_modules", ".prisma", "client");
  const nodevenvClientDir = "/home/kingofboosting/nodevenv/api.marvintattoos256.com/20/lib/node_modules/.prisma/client";

  // Target directories inside the user's home folder (guaranteed exec permission)
  const targetDirs = [localClientDir, nodevenvClientDir];
  for (const tDir of targetDirs) {
    try {
      if (!fs.existsSync(tDir)) {
        fs.mkdirSync(tDir, { recursive: true });
      }
    } catch (_) {}
  }

  // Candidates for debian-openssl-1.0.x engine
  const candidates = [
    path.join(localEnginesDir, "libquery_engine-debian-openssl-1.0.x.so.node"),
    path.join(localClientDir, "libquery_engine-debian-openssl-1.0.x.so.node"),
    path.join(nodevenvClientDir, "libquery_engine-debian-openssl-1.0.x.so.node"),
  ];

  let selectedEngine = null;
  for (const c of candidates) {
    if (fs.existsSync(c)) {
      selectedEngine = c;
      break;
    }
  }

  // If found in prisma-engines, sync to nodevenv and local client directories
  if (selectedEngine) {
    for (const tDir of targetDirs) {
      try {
        const dest = path.join(tDir, "libquery_engine-debian-openssl-1.0.x.so.node");
        if (!fs.existsSync(dest) || fs.statSync(dest).size !== fs.statSync(selectedEngine).size) {
          fs.copyFileSync(selectedEngine, dest);
          try { fs.chmodSync(dest, 0o755); } catch (_) {}
        }
      } catch (_) {}
    }

    try { fs.chmodSync(selectedEngine, 0o755); } catch (_) {}
    process.env.PRISMA_QUERY_ENGINE_LIBRARY = selectedEngine;
    process.env.PRISMA_QUERY_ENGINE_BINARY = selectedEngine;
    console.log("⚡ [Auto-Setup] Configured Prisma engine at (exec-safe):", selectedEngine);
    return;
  }

  // If not found yet, search any .so.node in prisma-engines
  if (fs.existsSync(localEnginesDir)) {
    try {
      const files = fs.readdirSync(localEnginesDir);
      for (const f of files) {
        if (f.endsWith(".so.node")) {
          const src = path.join(localEnginesDir, f);
          for (const tDir of targetDirs) {
            try {
              const dest = path.join(tDir, f);
              if (!fs.existsSync(dest)) {
                fs.copyFileSync(src, dest);
                try { fs.chmodSync(dest, 0o755); } catch (_) {}
              }
            } catch (_) {}
          }
          if (f.includes("debian-openssl-1.0.x")) {
            selectedEngine = src;
          }
        }
      }
    } catch (_) {}
  }

  if (selectedEngine) {
    try { fs.chmodSync(selectedEngine, 0o755); } catch (_) {}
    process.env.PRISMA_QUERY_ENGINE_LIBRARY = selectedEngine;
    process.env.PRISMA_QUERY_ENGINE_BINARY = selectedEngine;
    console.log("⚡ [Auto-Setup] Configured Prisma engine from readdir:", selectedEngine);
  } else {
    console.warn("⚠️ [Auto-Setup] No engine found in home directory. Running fallback prisma generate...");
    try {
      const prismaCli = path.join(__dirname, "node_modules", "prisma", "build", "index.js");
      if (fs.existsSync(prismaCli)) {
        execSync(`node "${prismaCli}" generate`, {
          cwd: __dirname,
          stdio: "inherit",
          env: process.env,
        });
      }
    } catch (err) {
      console.warn("⚠️ [Auto-Setup] fallback generate error:", err.message);
    }
  }
}

try {
  configurePrismaEngine();
} catch (e) {
  console.warn("⚠️ [Auto-Setup Warning]:", e.message);
}

async function start() {
  await import("./dist/server.js");
}

start().catch((err) => {
  console.error("Fatal error starting Marvin Tattoo Studio backend via loader.cjs:", err);
  process.exit(1);
});
