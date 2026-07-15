import { readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const manifestPath = join(root, "public", "manifest.webmanifest");
const swPath = join(root, "public", "sw.js");
const installPromptPath = join(root, "components", "ChurchWorkInstallPrompt.tsx");
const layoutPath = join(root, "app", "layout.tsx");
const pwaRegisterPath = join(root, "components", "ChurchWorkPwaRegister.tsx");
const pwaCheckPath = join(root, "app", "pwa-check", "page.tsx");

function fail(message) {
  console.error(`❌ ${message}`);
  process.exitCode = 1;
}

function pass(message) {
  console.log(`✅ ${message}`);
}

function assert(condition, message) {
  if (condition) pass(message);
  else fail(message);
}

function pngDimensions(path) {
  const bytes = readFileSync(path);
  const pngSignature = "89504e470d0a1a0a";
  const signature = bytes.subarray(0, 8).toString("hex");
  if (signature !== pngSignature) {
    throw new Error(`${path} is not a valid PNG`);
  }

  return {
    width: bytes.readUInt32BE(16),
    height: bytes.readUInt32BE(20)
  };
}

const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
const sw = readFileSync(swPath, "utf8");
const installPrompt = readFileSync(installPromptPath, "utf8");
const layout = readFileSync(layoutPath, "utf8");
const pwaRegister = readFileSync(pwaRegisterPath, "utf8");
const pwaCheck = readFileSync(pwaCheckPath, "utf8");

assert(manifest.name === "ChurchWork", "Manifest name is ChurchWork");
assert(manifest.short_name === "ChurchWork", "Manifest short_name is ChurchWork");
assert(manifest.id === "/churchwork-app", "Manifest app id is fresh /churchwork-app");
assert(manifest.start_url === "/admin?source=pwa", "Manifest starts installed app at /admin");
assert(manifest.scope === "/", "Manifest scope covers the full app");
assert(manifest.display === "standalone", "Manifest display is standalone");

const icons = Array.isArray(manifest.icons) ? manifest.icons : [];
const any192 = icons.find((icon) => icon.src === "/brand/churchwork-install-icon-v4-192.png" && icon.sizes === "192x192" && icon.type === "image/png");
const any512 = icons.find((icon) => icon.src === "/brand/churchwork-install-icon-v4-512.png" && icon.sizes === "512x512" && icon.type === "image/png" && icon.purpose.includes("any"));
const maskable512 = icons.find((icon) => icon.src === "/brand/churchwork-install-icon-v4-maskable-512.png" && icon.sizes === "512x512" && icon.type === "image/png" && icon.purpose.includes("maskable"));

assert(Boolean(any192), "Manifest declares a clean versioned 192x192 PNG icon");
assert(Boolean(any512), "Manifest declares a clean versioned 512x512 PNG icon");
assert(Boolean(maskable512), "Manifest declares a clean versioned 512x512 maskable PNG icon");

for (const icon of [any192, any512, maskable512].filter(Boolean)) {
  const [declaredWidth, declaredHeight] = icon.sizes.split("x").map(Number);
  const imagePath = join(root, "public", icon.src.replace(/^\//, ""));
  const { width, height } = pngDimensions(imagePath);
  assert(width === declaredWidth && height === declaredHeight, `${icon.src} actual PNG size matches ${icon.sizes}`);
}

assert(layout.includes('manifest: "/manifest.webmanifest"'), "Next metadata points to manifest.webmanifest");
assert(layout.includes("/brand/churchwork-install-icon-v4-192.png"), "Next metadata points to clean versioned app icon");
assert(!layout.includes("churchwork-install-prompt-ready"), "Experimental install prompt capture script is removed");
assert(installPrompt.includes("beforeinstallprompt"), "Install prompt listens for beforeinstallprompt");
assert(installPrompt.includes("deferredPrompt.prompt()"), "Install button calls the native prompt() API");
assert(!installPrompt.includes("Status:"), "Install prompt does not render disabled waiting status");
assert(!installPrompt.includes("Waiting for Chrome"), "Install prompt does not show Chrome waiting text");
assert(!installPrompt.includes("three-dot"), "Install prompt does not tell users to use the three-dot menu");
assert(pwaRegister.includes('navigator.serviceWorker.register("/sw.js", { scope: "/" })'), "Service worker registers at root scope");
assert(pwaRegister.includes('window.location.pathname === "/"'), "Landing page participates in controlled reload flow");
assert(pwaRegister.includes("churchwork:pwa-controller-reload-v4"), "Controlled reload key is current");
assert(pwaRegister.includes("controllerchange"), "Registration listens for service-worker controller changes");
assert(sw.includes("churchwork-shell-v21"), "Service worker cache version is current");
assert(sw.includes('"/"'), "Service worker caches landing page");
assert(sw.includes('"/admin"'), "Service worker caches admin app entry");
assert(sw.includes('"/pwa-check"'), "Service worker caches PWA diagnostics page");
assert(!sw.includes('"/install"'), "Service worker no longer caches removed install experiment path");
assert(sw.includes('"/manifest.webmanifest"'), "Service worker caches manifest");
assert(sw.includes('"/brand/churchwork-install-icon-v4-512.png"'), "Service worker caches clean 512 app icon");
assert(sw.includes('"/brand/churchwork-install-icon-v4-maskable-512.png"'), "Service worker caches clean maskable 512 app icon");
assert(!manifest.icons.some((icon) => icon.type === "image/svg+xml"), "Manifest no longer uses SVG launcher icons");
assert(pwaCheck.includes("Live installability check"), "PWA diagnostics page exists");
assert(pwaCheck.includes("Native install event"), "PWA diagnostics checks native install event");
assert(pwaCheck.includes("Page controlled by service worker"), "PWA diagnostics checks service-worker controller state");
assert(pwaCheck.includes("Manifest start_url"), "PWA diagnostics checks manifest start URL");
assert(pwaCheck.includes("createImageBitmap"), "PWA diagnostics decodes icon dimensions in browser");

if (process.exitCode) {
  console.error("\nPWA self-test failed.");
  process.exit(process.exitCode);
}

console.log("\nPWA self-test passed.");
