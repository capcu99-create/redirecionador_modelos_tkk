export const checkEnvironment = (): boolean => {
  if (typeof navigator === 'undefined') return false;

  const ua = navigator.userAgent.toLowerCase();
  
  // Browsers considered "Safe" to open the link
  const isChrome = ua.includes("chrome") || ua.includes("crios");
  const isSafari = ua.includes("safari") && !ua.includes("chrome") && !ua.includes("android");
  const isSamsung = ua.includes("samsungbrowser");

  // Browsers considered "Blocked" (In-App Browsers)
  const isBlocked = /tiktok|instagram|fbav|fban|messenger|snapchat|wv|bytedance/i.test(ua);

  // Allow if it is a known browser AND not explicitly blocked
  return (isChrome || isSafari || isSamsung) && !isBlocked;
};
