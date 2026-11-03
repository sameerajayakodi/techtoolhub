/** localStorage key holding the visitor's analytics choice: "granted" | "denied" */
export const CONSENT_STORAGE_KEY = 'tth-cookie-consent'

/**
 * Google Consent Mode v2 defaults, inlined at the top of <head> so they run before any Google
 * tag (gtag.js after consent, AdSense once enabled). Everything starts denied; a stored
 * "granted" choice only re-enables analytics. Ad consent is never granted by our banner: once
 * AdSense is live, Google's certified consent message (AdSense → Privacy & messaging) handles
 * ad consent for EEA/UK/Swiss visitors and updates these signals itself.
 */
export const consentDefaultsScript = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;
gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'denied',wait_for_update:500});
gtag('set','ads_data_redaction',true);
try{if(localStorage.getItem('${CONSENT_STORAGE_KEY}')==='granted'){gtag('consent','update',{analytics_storage:'granted'});}}catch(e){}`

/** True when the visitor accepted analytics cookies (client-side only) */
export function hasAnalyticsConsent() {
  try {
    return localStorage.getItem(CONSENT_STORAGE_KEY) === 'granted'
  } catch {
    return false
  }
}
