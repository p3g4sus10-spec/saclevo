export const RUNTIME_GATES = {
  calendly: {
    state: "disabled_pending_privacy",
    enabled: false,
  },
  analytics: {
    state: "no_op_provider_unapproved",
    enabled: false,
  },
  privacyNotice: {
    state: "draft_not_approved",
    approved: false,
  },
  publicDomain: {
    state: "unconfirmed",
    approved: false,
  },
  publication: {
    state: "preview_only",
    productionAuthorized: false,
  },
} as const;
