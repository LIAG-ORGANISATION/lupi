/**
 * Feature flags utility functions
 * 
 * These functions check environment variables to control feature visibility.
 * Variables should be set in .env file with VITE_ prefix.
 * 
 * Boolean values should be strings: "true" or "false"
 */

/**
 * Check if PRO signup should be displayed
 * @returns true if VITE_SHOW_PRO_SIGNUP is "true", false otherwise
 */
export const isProSignupEnabled = (): boolean => {
  return import.meta.env.VITE_SHOW_PRO_SIGNUP === "true";
};

/**
 * Check if Professional Directory and Messaging features should be displayed
 * @returns true if VITE_SHOW_PRO_DIRECTORY_AND_MESSAGING is "true", false otherwise
 */
export const isProDirectoryAndMessagingEnabled = (): boolean => {
  return import.meta.env.VITE_SHOW_PRO_DIRECTORY_AND_MESSAGING === "true";
};

