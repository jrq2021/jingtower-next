import {
  EntryUniverse,
  ReportAndGrowth,
  SitemapSection,
} from "@/components/MarketingSections";
import { SiteHeader } from "@/components/SiteHeader";
import { TarotRoom } from "@/components/TarotRoom";
import { UserRetention } from "@/components/UserRetention";

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main>
        <TarotRoom />
        <UserRetention />
        <EntryUniverse />
        <ReportAndGrowth />
        <SitemapSection />
      </main>
    </>
  );
}
