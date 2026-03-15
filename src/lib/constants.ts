/* ============================================
   TIMING CONSTANTS
   ============================================ */

/** Minimum simulated network delay (ms) */
export const AUTH_DELAY_MIN_MS = 800;
/** Random jitter added on top of AUTH_DELAY_MIN_MS (ms) */
export const AUTH_DELAY_JITTER_MS = 700;

/** Auto-close duration for save/unsave toast notifications (ms) */
export const TOAST_DURATION_MS = 2500;

/** Delay before closing the auth modal after a successful login/register (ms) */
export const AUTH_SUCCESS_REDIRECT_MS = 1000;

/** Delay before closing the auth modal after a successful social login (ms) */
export const AUTH_SOCIAL_SUCCESS_MS = 800;

/** Duration the "reset link sent" feedback is shown in forgot password flow (ms) */
export const FORGOT_PASSWORD_FEEDBACK_MS = 3000;

/* ============================================
   BUDDY MATCHING CONSTANTS
   ============================================ */

/** Probability threshold for a buddy match (< this value = match) */
export const BUDDY_MATCH_PROBABILITY = 0.65;

/** Minimum delay before a buddy reply appears (ms) */
export const BUDDY_REPLY_DELAY_MIN_MS = 1200;

/** Random jitter added on top of BUDDY_REPLY_DELAY_MIN_MS (ms) */
export const BUDDY_REPLY_JITTER_MS = 1000;

/* ============================================
   UI / NAVIGATION CONSTANTS
   ============================================ */

/** Scroll distance (px) before the navbar switches to glass/solid style */
export const NAVBAR_SCROLL_THRESHOLD = 50;

/* ============================================
   SEARCH CONSTANTS
   ============================================ */

/** Debounce delay for search input (ms) */
export const SEARCH_DEBOUNCE_MS = 300;

/** Minimum query length before search is triggered */
export const SEARCH_MIN_LENGTH = 2;

/** Maximum number of results shown per category in the search dropdown */
export const SEARCH_MAX_RESULTS_PER_CATEGORY = 3;
