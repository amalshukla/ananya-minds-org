import { createFileRoute } from "@tanstack/react-router";
import { PublicLayout } from "@/components/site-shell";
import { LegalDocument } from "@/components/legal-document";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service | Mindwell" },
      { name: "description", content: "The terms under which Mindwell provides therapy, assessment, and digital services." },
      { property: "og:url", content: "/terms" },
    ],
    links: [{ rel: "canonical", href: "/terms" }],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <PublicLayout>
      <LegalDocument
        eyebrow="Legal"
        title="Terms of service"
        lastUpdated="Updated June 1, 2026"
        sections={[
          { id: "agreement", heading: "Your agreement with us", body: "By booking a session you agree to these terms. They explain what you can expect from us and what we expect from you." },
          { id: "services", heading: "The services we provide", body: "We offer clinical psychology services including therapy, assessment, and coaching. Care is delivered by registered clinicians." },
          { id: "fees", heading: "Fees and payment", body: "Fees are listed on our Services page. Payment is taken at the time of the session unless otherwise agreed." },
          { id: "cancellations", heading: "Cancellations", body: "We ask for 48 hours' notice of any cancellation. Late cancellations may be charged at the full session fee." },
          { id: "emergencies", heading: "Emergencies", body: "We do not offer crisis or emergency services. If you are at risk, please use the resources on our Emergency page." },
          { id: "liability", heading: "Liability", body: "Our liability is limited to the fees you have paid for services. We carry professional indemnity insurance." },
          { id: "changes", heading: "Changes to these terms", body: "We may update these terms periodically. We'll notify active clients of material changes." },
        ]}
      />
    </PublicLayout>
  );
}