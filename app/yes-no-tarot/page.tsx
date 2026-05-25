import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { SeoLandingPage } from "@/components/SeoLandingPage";
import { getSeoPage } from "@/lib/seo-pages";

const page = getSeoPage("yes-no-tarot")!;

export const metadata: Metadata = {
  title: page.title,
  description: page.description,
  openGraph: {
    title: page.title,
    description: page.description,
  },
};

export default function YesNoTarotPage() {
  return (
    <>
      <SiteHeader />
      <main className="page-main seo-landing">
        <SeoLandingPage page={page} />
      </main>
    </>
  );
}
