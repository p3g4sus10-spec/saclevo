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

export const LEGAL_FISCAL_GATES = {
  legalProvider: "open_unconfirmed",
  rfc: "open_unconfirmed",
  taxRegime: "open_unconfirmed",
  domesticIvaTreatment: "open_unconfirmed",
  internationalIva: "open_unconfirmed",
  privacyResponsible: "open_unconfirmed",
  privacyAddress: "open_unconfirmed",
  arco: "open_unconfirmed",
  privacyNotice: "open_unconfirmed",
  analyticsProvider: "open_unconfirmed",
  cookieTreatment: "open_unconfirmed",
  productionAuthorization: "open_unconfirmed",
} as const;

export const WEBSITE_RELEASE = {
  version: "2.1",
  state: "frozen_ready_for_legal_final_patch",
  permittedPostFreezeChanges: [
    "verified_bug",
    "confirmed_legal_fiscal_information",
    "explicit_owner_override",
  ],
} as const;
