type InstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

let installPrompt: InstallPromptEvent | null = null;
let initialized = false;

export function isAppInstalled() {
  const navigatorWithStandalone = navigator as Navigator & { standalone?: boolean };
  return window.matchMedia("(display-mode: standalone)").matches || navigatorWithStandalone.standalone === true;
}

export function canInstallApp() {
  return Boolean(installPrompt) && !isAppInstalled();
}

export function initPwaInstallPrompt() {
  if (initialized) return;
  initialized = true;

  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    installPrompt = event as InstallPromptEvent;
    window.dispatchEvent(new Event("curacasa-install-ready"));
  });

  window.addEventListener("appinstalled", () => {
    installPrompt = null;
    window.dispatchEvent(new Event("curacasa-install-ready"));
  });
}

export async function requestAppInstall() {
  if (!installPrompt) return false;
  await installPrompt.prompt();
  const choice = await installPrompt.userChoice;
  installPrompt = null;
  window.dispatchEvent(new Event("curacasa-install-ready"));
  return choice.outcome === "accepted";
}

export function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) return;
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch(() => undefined);
  });
}

export async function forceAppUpdate() {
  if ("serviceWorker" in navigator) {
    const registrations = await navigator.serviceWorker.getRegistrations();
    await Promise.all(registrations.map((registration) => registration.unregister()));
  }

  if ("caches" in window) {
    const keys = await caches.keys();
    await Promise.all(keys.map((key) => caches.delete(key)));
  }

  window.location.reload();
}
