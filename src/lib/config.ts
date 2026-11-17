export const BRAND_NAME =
  process.env.NEXT_PUBLIC_BRAND_NAME || process.env.NEXT_PUBLIC_SHOP_NAME || "PageTurn Exchange";
export const AREA = process.env.NEXT_PUBLIC_AREA || process.env.NEXT_PUBLIC_CITY || "Your area";
export const OWNER_NAME = process.env.NEXT_PUBLIC_OWNER_NAME || "A local reader";
export const ABOUT = process.env.NEXT_PUBLIC_ABOUT ||
  "I run a small, home-run book exchange to help non-fiction books find their next reader.";

const rawWhatsApp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "";
const rawPhone = process.env.NEXT_PUBLIC_PHONE_NUMBER || "";
export const WHATSAPP_NUMBER = /X/i.test(rawWhatsApp) ? "" : rawWhatsApp.replace(/\D/g, "");
export const PHONE_NUMBER = /X/i.test(rawPhone) ? "" : rawPhone.replace(/[^\d+]/g, "");
export const INSTAGRAM_URL = process.env.NEXT_PUBLIC_INSTAGRAM_URL || "https://instagram.com/";
export const WHATSAPP_URL = WHATSAPP_NUMBER
  ? `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`Hi ${BRAND_NAME}, I have a question about book exchange.`)}`
  : "https://wa.me/";
