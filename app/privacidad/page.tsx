import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RUNTIME_GATES } from "@/config/gates";

export const metadata: Metadata = {
  title: { absolute: "Privacidad — SCALEVO" },
  robots: {
    index: false,
    follow: false,
  },
};

export default function PrivacyPage(): never {
  if (!RUNTIME_GATES.privacyNotice.approved) {
    notFound();
  }

  throw new Error(
    "Privacy publication is gated until the approved notice is implemented.",
  );
}
