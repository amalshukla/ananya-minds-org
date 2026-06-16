import { createFileRoute } from "@tanstack/react-router";
import { PublicLayout } from "@/components/site-shell";
import { LegalDocument } from "@/components/legal-document";

export const Route = createFileRoute("/cookies")({
  head: () => ({
    meta: [
      { title: "Cookie Policy | Mindwell" },
      { name: "description", content: "How Mindwell uses cookies and similar technologies on our website." },
      { property: "og:url", content: "/cookies" },
    ],
    links: [{ rel: "canonical", href: "/cookies" }],
  }),
  component: CookiesPage,
});

function CookiesPage() {
  return (
    <PublicLayout>
      <LegalDocument
        eyebrow="Legal"
        title="Cookie policy"
        lastUpdated="Updated June 1, 2026"
        sections={[
          { id: "what", heading: "What cookies are", body: "Cookies are small text files placed on your device when you visit a website. They help sites remember your preferences and measure usage." },
          { id: "how-we-use", heading: "How we use cookies", body: "We use essential cookies to keep you signed in and to remember booking preferences. We use a small number of analytics cookies to understand how the site is used." },
          { id: "categories", heading: "Categories", body: "Essential — required for the site to function. Analytics — help us improve the site. We do not use advertising cookies." },
          { id: "choices", heading: "Your choices", body: "You can manage or block cookies via your browser. Disabling essential cookies will affect site functionality." },
          { id: "questions", heading: "Questions", body: "Email privacy@mindwell.health with any questions about how we use cookies." },
        ]}
      />
    </PublicLayout>
  );
}