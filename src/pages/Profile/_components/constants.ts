// Constants for security settings components
export const SECURITY_TEXT = {
  TWO_FA: {
    TITLE: "Two-Factor Authentication",
    DESCRIPTION: "Protect your account with two-factor authentication",
    ENABLE_PROMPT: "Toggle to enable protection",
    DISABLE_PROMPT: "Toggle to disable protection",
    CONFIGURE_PROMPT: "Configure two-factor authentication",
    ENABLED_STATUS: "Your account is protected with 2FA",
    DISABLED_STATUS: "Two-factor authentication is disabled",
    SETUP_STEP_ONE: "Generate QR Code",
    SETUP_STEP_TWO: "Verify Code & Enable 2FA",
    MANUAL_ENTRY_TITLE: "Manual Entry Key",
    MANUAL_ENTRY_DESC: "If you can't scan the QR code, manually enter this key:",
    VERIFY_PROMPT: "Enter the 6-digit code from your authenticator app to verify and enable two-factor authentication",
    GENERATING_QR: "Generating QR code...",
    GENERATING_KEY: "Generating...",
    VERIFY_BUTTON: "Verify Code",
    CANCEL_BUTTON: "Cancel",
    CONFIRM_DISABLE: "Confirm Disable",
    PROCESSING_TEXT: "Processing...",
    GENERATING_TEXT: "Generating...",
    BACKUP_CODES_TITLE: "Backup Codes",
    BACKUP_CODES_DESC:
      "Backup codes are one-time use codes that can be used as an alternative to your authenticator app.",
    BACKUP_INFO: [
      "You have 10 backup codes available to regenerate at any time",
      "Each code can only be used once",
      "Store them securely - they are your only recovery option",
      "They're automatically regenerated when you enable 2FA",
    ],
  },
  DISABLE_MODAL: {
    TITLE: "Verify to Disable 2FA",
    DESC: "Enter your current authenticator code to disable 2FA",
    WARNING_TITLE: "⚠️ Security Warning",
    WARNING_DESC:
      "Disabling 2FA will reduce your account security. Make sure you have backup codes saved or can access your authenticator app later.",
  },
};
