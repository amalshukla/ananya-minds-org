import { createFileRoute } from "@tanstack/react-router";
import { PublicLayout } from "@/components/site-shell";
import { LegalDocument } from "@/components/legal-document";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy | Mindwell" },
      { name: "description", content: "How Mindwell collects, uses, stores, and protects your personal and clinical information." },
      { property: "og:url", content: "/privacy" },
    ],
    links: [{ rel: "canonical", href: "/privacy" }],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <PublicLayout>
      <LegalDocument
        eyebrow="Legal"
        title="Privacy policy"
        lastUpdated="Updated June 1, 2026"
        sections={[
          { id: "overview", heading: "Overview", body: "Your privacy is foundational to therapy. This policy explains what we collect, how we use it, and the choices you have." },
          { id: "what-we-collect", heading: "What we collect", body: "We collect contact details, billing information, clinical notes, and any information you share during care. We never sell personal data." },
          { id: "how-we-use-it", heading: "How we use your information", body: "Information is used to deliver clinical care, schedule appointments, process payments, and meet our legal obligations." },
          { id: "sharing", heading: "Sharing", body: "We do not share clinical information without your consent, except where required by law or for the small number of safety exceptions explained at the start of care." },
          { id: "security", heading: "Security", body: "Notes and records are stored in an encrypted, HIPAA-compliant clinical platform. Access is restricted and audited." },
          { id: "your-rights", heading: "Your rights", body: "You may request access to, correction of, or deletion of your data at any time by emailing privacy@mindwell.health." },
          { id: "contact", heading: "Contact", body: "Questions about privacy can be sent to privacy@mindwell.health. We respond within five business days." },
        ]}
      />
    </PublicLayout>
  );
}