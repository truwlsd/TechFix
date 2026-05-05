/**
 * Превью карточек на /services — файлы из public/images/services/.
 * Свободные ассеты: internals-abstract.jpg, motherboard-glow.jpg, rgb-components.jpg, cooling-fan-closeup.jpg
 */
const SERVICE_CARD_IMAGE_BY_ID: Record<string, string> = {
  "laptop-repair": "/images/services/laptop-repair.jpg",
  "screen-replacement": "/images/services/screen-replacement.jpg",
  "keyboard-replace": "/images/services/keyboard-replace.jpg",
  "battery-replace": "/images/services/battery-replace.jpg",
  "pc-diagnostics": "/images/services/pc-diagnostics.jpg",
  "pc-clean": "/images/services/pc-clean.jpg",
  "pc-upgrade": "/images/services/pc-upgrade.jpg",
  "os-install": "/images/services/os-install.webp",
  "virus-removal": "/images/services/virus-removal.jpg",
  "speed-up": "/images/services/speed-up.jpg",
  "wifi-setup": "/images/services/wifi-setup.jpg",
  "data-recovery": "/images/services/data-recovery.jpg",
  "camera-repair": "/images/services/camera-repair.jpg",
};

const DEFAULT_SERVICE_CARD_IMAGE = "/images/services/pc-diagnostics.jpg";

export function getServiceCardImageUrl(serviceId: string): string {
  return SERVICE_CARD_IMAGE_BY_ID[serviceId] ?? DEFAULT_SERVICE_CARD_IMAGE;
}
